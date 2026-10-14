/**
 * library-names.mjs — 공용 배치 카탈로그 이름 해석 (cs_v2 쪽 단일 지점)
 *
 * 이름은 하나로 운영한다(2026-10-14 결정): 정식 이름은 기능 이름 `<그룹>.<형태>`(pptgen 과 같음) 하나뿐이다.
 * 옛 이름(cs_v2 숏코드 icon-grid·compare-grid…, pptgen 구현 ID staircase·c01-p07…)은 읽기 호환 별칭으로만 받고,
 * 받는 즉시 "기능 이름 + 그 옛 이름이 뜻하던 인수(카탈로그 alias_args)"로 정규화한다.
 *
 *   ::: grid.columns variant=plain   → 기능 이름 그대로
 *   ::: compare-grid                 → grid.columns variant=plain 과 같은 것으로 정규화 (옛 이름 — npm run migrate:names)
 *
 * 그다음 기능 이름 + 인수로 cs_v2 "구현 ID"(= shortcode-render.mjs·pptx-renderers 의 내부 분기 이름)를 고른다:
 *   카탈로그 impl.cs_v2.variants(인수 조합 → 구현 ID) 가 맞으면 그것, 아니면 impl.cs_v2.shortcode,
 *   cs_v2 구현이 markdown/none 이면 PLAIN_FALLBACK(카탈로그 fallback.cs_v2).
 * 구현 ID 는 내부 이름일 뿐이라 문서·예시·화면에 쓰지 않는다(pptgen 의 c01-p07 과 같은 위치).
 *
 * 이 파일의 숏코드 블록 정규식(SHORTCODE_BLOCK_SOURCE)을 4개 파서(guide-core·presentation-core·md-to-pptx·pptx-browser)가 같이 쓴다.
 */
import { LAYOUTS, LAYOUT_ALIASES, LAYOUT_GROUPS, SHAPE_SETS, COLOR_TOKENS, LAYOUT_FALLBACK, ALIAS_ARGS, LAYOUT_EXAMPLES } from "./library-map.mjs";

export { LAYOUTS, LAYOUT_ALIASES, LAYOUT_GROUPS, SHAPE_SETS, COLOR_TOKENS, ALIAS_ARGS, LAYOUT_EXAMPLES };

/**
 * 항목 color 의 색 이름(primary·secondary·accent·accent2·light·dark·ink·gray + 별칭 main·sub·brand…) → 매체 값.
 * 공용 카탈로그 color_tokens 단일 출처(pptgen 과 같은 이름). medium = "cs_v2"(CSS 값) | "cs_v2_pptx"(PPTX 팔레트 키)
 * 모르는 이름이면 null (호출 쪽이 #hex 등으로 처리)
 */
const TOKEN_INDEX = {};
for (const [k, v] of Object.entries(COLOR_TOKENS)) {
  if (k.startsWith("_")) continue;
  for (const n of [k, ...(v.aliases || [])]) TOKEN_INDEX[n.toLowerCase()] = v;
}
export function colorToken(name, medium) {
  const v = TOKEN_INDEX[String(name || "").trim().toLowerCase()];
  return v ? v[medium] || null : null;
}

/** `::: 이름 인수…\n본문\n:::` — 이름은 영문·숫자·`_`·`-`·`.` */
export const SHORTCODE_BLOCK_SOURCE = String.raw`^:::\s*([A-Za-z0-9_.-]+)(?:[ \t]+([^\r\n]+))?[ \t]*\r?\n([\s\S]*?)(?:\r?\n|^):::[ \t]*$`;
export const shortcodeBlockRe = () => new RegExp(SHORTCODE_BLOCK_SOURCE, "gm");

/** 숏코드 블록이 아닌 내부 토큰 — 이름 해석 없이 그대로 */
const INTERNAL = new Set(["slide-config", "arrow"]);

/** cs_v2 구현 ID — shortcode-render.mjs 분기 = 카탈로그 impl.cs_v2.shortcode·variants 가 가리키는 값(정합성 테스트가 잠근다) */
export const IMPL_SHORTCODES = new Set([
  "icon-grid", "feature-grid", "badge-grid", "stat-grid", "tool-list", "plan-grid",
  "columns-grid", "compare-grid", "compare-split", "before-after", "step-flow", "workflow-flow", "step-list", "level-grid", "git-flow",
  "network-box", "venn-diagram", "quadrant-chart", "concentric-rings", "summary-bar",
  "alert-box", "summary-box", "takeaway-banner", "part-banner", "editor-box", "console-box", "cmd-box",
  "faq-list", "os-tabs", "chapter-list",
]);

/** cs_v2 에 대응 숏코드가 없는 배치(markdown/none)를 그릴 때 쓰는 근사 숏코드 — 카탈로그 fallback.cs_v2 (코드에 정책 값을 두지 않는다) */
export const PLAIN_FALLBACK = LAYOUT_FALLBACK.cs_v2;

/** 인수 문자열의 key=value 들(따옴표 값 포함) — 위치 인수는 무시 */
export function argKeys(args) {
  const out = {};
  for (const m of String(args || "").matchAll(/([A-Za-z][\w.-]*)=("([^"]*)"|'([^']*)'|(\S+))/g)) out[m[1]] = m[3] ?? m[4] ?? m[5];
  return out;
}

/** 블록 인수 + 옛 이름이 뜻하던 인수(블록에 이미 있는 키는 블록 값이 우선) → 인수 문자열 */
function mergeArgs(args, extra) {
  const have = argKeys(args);
  const add = Object.entries(extra || {}).filter(([k]) => !(k in have)).map(([k, v]) => `${k}=${v}`);
  return [String(args || "").trim(), ...add].filter(Boolean).join(" ");
}

/** 옛 이름 사용 기록(이름 → 정규화 결과) — CLI 빌드가 끝에 경고로 보여 준다(reportAliasUse) */
export const ALIAS_SEEN = new Map();

/**
 * 블록 이름 + 인수 → cs_v2 가 그릴 구현.
 * @returns {{ type: string, layout: string|null, args: string, status: string, known: boolean, alias: string|null }}
 *   type   = cs_v2 구현 ID(모르는 이름이면 입력 그대로 → 렌더러가 빈 문자열: 기존 동작)
 *   layout = 기능 이름, args = 정규화된 인수 문자열(옛 이름 인수 포함), alias = 옛 이름으로 썼으면 그 이름
 */
export function resolveShortcode(name, args = "") {
  const raw = String(name || "").trim();
  if (INTERNAL.has(raw)) return { type: raw, layout: null, args: String(args || ""), status: "internal", known: true, alias: null };
  const layout = LAYOUTS[raw] ? raw : LAYOUT_ALIASES[raw] || null;
  if (!layout) return { type: raw, layout: null, args: String(args || ""), status: "unknown", known: false, alias: null };
  const alias = raw !== layout ? raw : null;
  const merged = mergeArgs(args, alias ? ALIAS_ARGS[alias] : null);
  if (alias) ALIAS_SEEN.set(alias, `${layout}${alias && ALIAS_ARGS[alias] ? " " + mergeArgs("", ALIAS_ARGS[alias]) : ""}`);
  const e = LAYOUTS[layout], keys = argKeys(merged);
  const variant = (e.variants || []).find((v) => Object.entries(v.when || {}).every(([k, val]) => keys[k] === String(val)));
  const type = variant ? variant.shortcode
    : e.shortcode && (e.status === "ready" || e.status === "fallback") ? e.shortcode : PLAIN_FALLBACK;
  return { type, layout, args: merged, status: e.status, known: true, alias };
}

/** CLI 빌드 끝에 옛 이름 사용을 한 줄씩 알린다(브라우저에서는 부르지 않는다) */
export function reportAliasUse(log = console.warn) {
  for (const [a, to] of ALIAS_SEEN) log(`  ⚠ 옛 이름 ${a} → ${to}  (기능 이름 하나로 운영 — npm run migrate:names)`);
  ALIAS_SEEN.clear();
}

/**
 * 제목 줄 끝의 속성 묶음 `{master=brand.full label="…"}` 을 지운다 (pptgen md 형식 v2 — cs_v2 는 쓰지 않음).
 * 안에 `=` 가 있는 묶음만 지워 일반 중괄호 제목은 건드리지 않는다. 코드 펜스 안은 건너뛴다.
 */
export function stripHeadingAttrs(md) {
  let fence = null;
  return String(md).split("\n").map((line) => {
    const f = line.match(/^\s*(```+|~~~+)/);
    if (f) { if (!fence) fence = f[1][0]; else if (f[1][0] === fence) fence = null; return line; }
    if (fence) return line;
    return line.replace(/^(#{1,6}[ \t]+.*?)[ \t]+\{[^{}\n]*=[^{}\n]*\}[ \t]*$/, "$1");
  }).join("\n");
}

/** 블록 인수 문자열에서 bg=alt (보조 카드색) 여부 */
export const wantsAltBg = (args) => /(?:^|\s)bg=["']?alt\b/.test(String(args || ""));
