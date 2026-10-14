#!/usr/bin/env node
/**
 * sync-library.mjs — 공용 배치 카탈로그(slide-library/catalog)를 cs_v2 로 가져온다.
 *
 * 공용 카탈로그는 pptgen 과 cs_v2 가 같은 배치 이름·항목 규칙·서식 세트를 쓰게 하는 단일 출처다.
 * 현재 정본 위치는 coding 저장소 `_templates/slide-library/catalog/` 이고, 나중에 cs_v2 `config/library/`
 * 로 옮긴다(그때는 이 스크립트의 방향만 바뀐다 — config/library/README.md 참조).
 *
 *   node scripts/sync-library.mjs [--from <카탈로그 폴더>] [--check]
 *
 * 하는 일
 *   1) layouts.json · shape-sets.json 을 config/library/ 로 복사(내용 그대로)
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
const LIB = join(ROOT, "config", "library");
if (!SRC) {
  console.error(`카탈로그를 찾지 못했습니다. --from 또는 SLIDE_CATALOG 로 지정하세요.\n  찾은 곳: ${CANDIDATES.join("\n           ")}`);
  process.exit(2);
}

const read = (p) => readFileSync(p, "utf8");
const layoutsTxt = read(join(SRC, "layouts.json"));
const setsTxt = read(join(SRC, "shape-sets.json"));
const layouts = JSON.parse(layoutsTxt), sets = JSON.parse(setsTxt);

// 생성 모듈: 이름 해석에 필요한 최소 정보만(배치별 group·label·cs_v2 구현) + 별칭표 + 서식 세트 전체
const L = {};
const ALIAS = {};
for (const [name, e] of Object.entries(layouts.layouts)) {
  const c = (e.impl || {}).cs_v2 || {};
  L[name] = { group: e.group, label: e.label, status: c.status || "none", shortcode: c.shortcode || null };
  for (const a of e.aliases || []) ALIAS[a] = name;
}
const groups = Object.fromEntries(Object.entries(layouts.groups).map(([k, v]) => [k, v]));
const mod = `// ⚠️ 자동 생성 파일 — 손으로 고치지 마세요. 원본: slide-library/catalog (npm run sync:library)
// 카탈로그 갱신일 layouts=${layouts.updated} shape-sets=${sets.updated}
export const LIBRARY_UPDATED = ${JSON.stringify(layouts.updated)};
export const LAYOUT_GROUPS = ${JSON.stringify(groups, null, 1)};
export const LAYOUTS = ${JSON.stringify(L, null, 1)};
export const LAYOUT_ALIASES = ${JSON.stringify(ALIAS, null, 1)};
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
  const same = existsSync(p) && read(p) === txt;
  if (CHECK) { if (!same) { stale++; console.error(`✗ 동기화 필요: ${p}`); } continue; }
  if (!same) writeFileSync(p, txt);
  console.log(`${same ? "=" : "✓"} ${p.replace(ROOT + "/", "")}`);
}
if (CHECK) { console.log(stale ? `카탈로그(${SRC})와 ${stale}건 다름` : `카탈로그와 일치 (${SRC})`); process.exit(stale ? 1 : 0); }
console.log(`원본: ${SRC} — 배치 ${Object.keys(L).length}종, 별칭 ${Object.keys(ALIAS).length}개, 서식 세트 ${Object.keys(sets.sets).length}종`);
