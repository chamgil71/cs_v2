/**
 * library-names.mjs — 공용 배치 카탈로그 이름 해석 (cs_v2 쪽 단일 지점)
 *
 * pptgen 과 cs_v2 는 같은 배치 이름 규칙을 쓴다: `<그룹>.<형태>` (예: grid.cards, process.track).
 * 카탈로그(config/library/layouts.json, 생성본 scripts/library-map.mjs)가 이름 ↔ cs_v2 숏코드 대응의 단일 출처다.
 *
 *   ::: grid.cards cols=3        → icon-grid 로 렌더 (기능 이름)
 *   ::: icon-grid cols=3         → 그대로 (cs_v2 고유 이름 — 하위 호환, 기존 문서 그대로 동작)
 *   ::: staircase                → process.staircase → level-grid 근사 (pptgen 옛 이름도 받아준다)
 *
 * 규칙
 *  - cs_v2 가 직접 그리는 숏코드 이름(NATIVE_SHORTCODES)은 해석하지 않고 그대로 쓴다.
 *    (skill-list·checkpoint-grid 처럼 같은 배치의 변형이 고유 이름에 묶인 경우가 있어 기능 이름으로 바꾸면 모양이 달라진다)
 *  - 그 밖의 이름은 카탈로그에서 찾는다: 기능 이름 → 그대로, 별칭 → 기능 이름.
 *    cs_v2 구현이 ready/fallback 이면 그 숏코드, markdown/none 이면 PLAIN_FALLBACK 으로 근사한다.
 *  - 이 파일의 숏코드 블록 정규식(SHORTCODE_BLOCK_SOURCE)을 4개 파서(guide-core·presentation-core·md-to-pptx·pptx-browser)가 같이 쓴다.
 *    이름에 '.' 을 허용한다(기능 이름).
 */
import { LAYOUTS, LAYOUT_ALIASES, LAYOUT_GROUPS, SHAPE_SETS, COLOR_TOKENS, LAYOUT_FALLBACK } from "./library-map.mjs";

export { LAYOUTS, LAYOUT_ALIASES, LAYOUT_GROUPS, SHAPE_SETS, COLOR_TOKENS };

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

/** cs_v2 가 직접 그리는 이름 — shortcode-render.mjs 의 분기와 같아야 한다(정합성 테스트가 잠근다) */
export const NATIVE_SHORTCODES = new Set([
  "icon-grid", "feature-grid", "badge-grid", "stat-grid", "tool-list", "plan-grid",
  "columns-grid", "compare-split", "before-after", "step-flow", "step-list", "level-grid", "git-flow",
  "network-box", "venn-diagram", "quadrant-chart", "concentric-rings", "summary-bar",
  "alert-box", "summary-box", "takeaway-banner", "part-banner", "editor-box", "console-box", "cmd-box",
  "faq-list", "os-tabs", "chapter-list",
  // cs_v2 하위 호환 별칭(같은 렌더러의 다른 이름)
  "compare-grid", "workflow-flow", "workflow-strip", "skill-list", "checkpoint-grid", "compare-diff",
  "bottom-list", "compare-before-after", "flow", "git-flow-strip", "part-deck", "takeaway", "tool-box", "venn",
  // 내부 토큰
  "slide-config", "arrow",
]);

/** cs_v2 에 대응 숏코드가 없는 배치(markdown/none)를 그릴 때 쓰는 근사 숏코드 — 카탈로그 fallback.cs_v2 (코드에 정책 값을 두지 않는다) */
export const PLAIN_FALLBACK = LAYOUT_FALLBACK.cs_v2;

/**
 * 블록 이름 → cs_v2 가 그릴 숏코드.
 * @returns {{ type: string, layout: string|null, status: string, known: boolean }}
 *   type   = 실제로 그릴 cs_v2 숏코드(모르는 이름이면 입력 그대로 → 렌더러가 빈 문자열을 낸다: 기존 동작)
 *   layout = 카탈로그 기능 이름(고유 숏코드 이름이면 그 숏코드가 대응하는 기능 이름, 없으면 null)
 */
export function resolveShortcode(name) {
  const raw = String(name || "").trim();
  if (NATIVE_SHORTCODES.has(raw)) {
    const layout = LAYOUT_ALIASES[raw] || null;
    return { type: raw, layout, status: "ready", known: true };
  }
  const layout = LAYOUTS[raw] ? raw : LAYOUT_ALIASES[raw] || null;
  if (!layout) return { type: raw, layout: null, status: "unknown", known: false };
  const e = LAYOUTS[layout];
  const type = e.shortcode && (e.status === "ready" || e.status === "fallback") ? e.shortcode : PLAIN_FALLBACK;
  return { type, layout, status: e.status, known: true };
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
