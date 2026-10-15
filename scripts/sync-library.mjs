#!/usr/bin/env node
/**
 * sync-library.mjs — 공용 배치 카탈로그(slide-library/catalog)를 cs_v2 로 가져온다.
 *
 * 공용 카탈로그는 pptgen 과 cs_v2 가 같은 배치 이름·항목 규칙·서식 세트를 쓰게 하는 단일 출처다.
 * 현재 정본 위치는 coding 저장소 `_templates/slide-library/catalog/` 이고, 나중에 cs_v2 `library/`
 * 로 옮긴다(그때는 이 스크립트의 방향만 바뀐다 — library/README.md 참조).
 *
 *   node scripts/sync-library.mjs [--from <카탈로그 폴더>] [--check]
 *
 * 하는 일
 *   1) layouts.json · shape-sets.json 을 library/ 로 복사(내용 그대로)
 *   2) scripts/library-map.mjs 생성 — 브라우저·Node 어디서나 import 되는 순수 객체 모듈
 *      (JSON import 속성 차이 회피. 손으로 고치지 말 것: 카탈로그를 고치고 다시 sync)
 *   --check : 복사본·생성본이 카탈로그와 다르면 종료코드 1 (CI·테스트용, 파일은 안 바꾼다)
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const flag = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
const CHECK = argv.includes("--check");

const CANDIDATES = [
  flag("--from"),
  process.env.SLIDE_CATALOG,
  join(ROOT, "..", "coding", "_templates", "slide-library", "catalog"),
  "C:/coding/_templates/slide-library/catalog",
].filter(Boolean);
const SRC = CANDIDATES.find((d) => existsSync(join(d, "layouts.json")));
const LIB = join(ROOT, "library");   // 최상위 library/ — 설정(config/)과 라이브러리(재사용 정의) 층 분리(2026-10-14, 인계서 E)
if (!SRC) {
  console.error(`카탈로그를 찾지 못했습니다. --from 또는 SLIDE_CATALOG 로 지정하세요.\n  찾은 곳: ${CANDIDATES.join("\n           ")}`);
  process.exit(2);
}

const read = (p) => readFileSync(p, "utf8");
const eol = (s) => s.replace(/\r\n/g, "\n");
const layoutsTxt = read(join(SRC, "layouts.json"));
const setsTxt = read(join(SRC, "shape-sets.json"));
const layouts = JSON.parse(layoutsTxt), sets = JSON.parse(setsTxt);

// 생성 모듈: 이름 해석에 필요한 최소 정보만(배치별 group·label·cs_v2 구현) + 별칭표 + 서식 세트 전체
const L = {};
const ALIAS = {};
const ALIAS_ARGS = {};   // 옛 이름 → 그 이름이 뜻하던 인수(모양이 다른 옛 이름만)
const EXAMPLES = {};     // 배치 → { args, body, more } (가이드 스니펫·웹 라이브러리 화면의 단일 출처)
for (const [name, e] of Object.entries(layouts.layouts)) {
  const c = (e.impl || {}).cs_v2 || {};
  // defaults = 인수 기본값(빈 값 제외) — 렌더러는 블록 인수 > 이 값 순서로 읽는다(수치를 코드에 두지 않음)
  const defaults = Object.fromEntries(Object.entries(e.args || {}).filter(([, a]) => a.default !== "" && a.default != null).map(([k, a]) => [k, String(a.default)]));
  // args = 인수 표(웹 배치 라이브러리 화면 — 값·기본값·도구별 지원·설명), pptgen = pptgen 구현 요약(같은 배치를 pptgen 이 어떻게 그리는지)
  const args = Object.fromEntries(Object.entries(e.args || {}).map(([k, a]) => [k, { values: a.values, default: a.default ?? "", cs_v2: !!a.cs_v2, pptgen: !!a.pptgen, note: a.note || "" }]));
  const p = (e.impl || {}).pptgen || {};
  L[name] = { group: e.group, label: e.label, emoji: e.emoji || "", desc: e.desc || "", fields: e.fields || {}, status: c.status || "none", shortcode: c.shortcode || null,
    pptx_shortcode: c.pptx_shortcode || null, variants: c.variants || [], defaults, args,
    pptgen: { status: p.status || "none", pattern: p.pattern || null, theme: p.theme || null }, aliases: e.aliases || [] };
  for (const a of e.aliases || []) ALIAS[a] = name;
  Object.assign(ALIAS_ARGS, e.alias_args || {});
  if (e.example) EXAMPLES[name] = e.example;
}
const groups = Object.fromEntries(Object.entries(layouts.groups).map(([k, v]) => [k, v]));
const mod = `// ⚠️ 자동 생성 파일 — 손으로 고치지 마세요. 원본: slide-library/catalog (npm run sync:library)
// 카탈로그 갱신일 layouts=${layouts.updated} shape-sets=${sets.updated}
export const LIBRARY_UPDATED = ${JSON.stringify(layouts.updated)};
export const LAYOUT_GROUPS = ${JSON.stringify(groups, null, 1)};
export const LAYOUTS = ${JSON.stringify(L, null, 1)};
export const LAYOUT_ALIASES = ${JSON.stringify(ALIAS, null, 1)};
export const ALIAS_ARGS = ${JSON.stringify(ALIAS_ARGS, null, 1)};
export const LAYOUT_EXAMPLES = ${JSON.stringify(EXAMPLES, null, 1)};
export const SHAPE_SETS = ${JSON.stringify(sets, null, 1)};
export const COLOR_TOKENS = ${JSON.stringify(layouts.color_tokens || {}, null, 1)};
export const LAYOUT_FALLBACK = ${JSON.stringify(layouts.fallback || {}, null, 1)};
`;

const outputs = [
  [join(LIB, "layouts.json"), layoutsTxt],
  [join(LIB, "shape-sets.json"), setsTxt],
  [join(ROOT, "scripts", "library-map.mjs"), mod],
];
let stale = 0;
for (const [p, txt] of outputs) {
  // 줄바꿈은 비교에서 뺀다 — Windows(core.autocrlf)는 체크아웃 파일이 CRLF 라 내용이 같아도 LF 생성본과 달라 보인다
  const same = existsSync(p) && eol(read(p)) === eol(txt);
  if (CHECK) { if (!same) { stale++; console.error(`✗ 동기화 필요: ${p}`); } continue; }
  if (!same) writeFileSync(p, txt);
  console.log(`${same ? "=" : "✓"} ${p.replace(ROOT + "/", "")}`);
}
if (CHECK) { console.log(stale ? `카탈로그(${SRC})와 ${stale}건 다름` : `카탈로그와 일치 (${SRC})`); process.exit(stale ? 1 : 0); }
console.log(`원본: ${SRC} — 배치 ${Object.keys(L).length}종, 별칭 ${Object.keys(ALIAS).length}개, 서식 세트 ${Object.keys(sets.sets).length}종`);
