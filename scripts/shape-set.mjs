/**
 * shape-set.mjs — 공용 서식 세트(shape-sets.json)를 cs_v2 의 HTML(CSS 변수)·PPTX(카드 서식)로 바꾼다.
 *
 * 서식 세트는 '모양'(외곽선 굵기·그림자·둥글기·카드 채움/보조 채움)만 정하고 색은 테마 색 이름(token)으로만 가리킨다.
 * → 테마(styles.json)를 바꾸면 같은 세트가 그 테마 색으로 다시 칠해진다. 테마와 따로 놀지 않는다.
 *
 * 고르는 곳(뒤가 우선): config 기본(shape-sets.json default) → styles.json 테마의 shapeSet → frontmatter `shape:`
 * 블록 인수 `bg=alt` = 그 블록 카드만 보조 카드색(한 슬라이드에 카드 배경 2종).
 *
 * 'template' 세트 = 셸·테마가 원래 가진 서식 그대로(기존 출력과 같음). 보조 카드색만 정한다.
 */
import { SHAPE_SETS } from "./library-map.mjs";

const PT_TO_PX = 96 / 72;

/** 이름 캐스케이드 → 세트 이름(없는 이름이면 기본값) */
export function pickShapeSet(...names) {
  const name = [...names].reverse().find((n) => n && String(n).trim());
  const key = name ? String(name).trim() : SHAPE_SETS.default;
  return SHAPE_SETS.sets[key] ? key : SHAPE_SETS.default;
}

const tokenCss = (t) => ((SHAPE_SETS.tokens[t] || {}).cs_v2) || t;
const tokenPal = (t, pal) => pal[((SHAPE_SETS.tokens[t] || {}).cs_v2_pptx) || "white"] || pal.white;

/**
 * HTML: `:root, body` 에 넣을 카드 서식 변수 묶음.
 * body 에도 다시 정의하는 이유: 프레젠테이션 셸은 body.light-mode 에서 --card-bg 를 바꾸므로,
 * 그 값을 참조하는 세트 변수를 body 에서 다시 계산해야 라이트/다크 둘 다 맞는 색이 된다.
 */
export function shapeSetCss(name) {
  const key = pickShapeSet(name), s = SHAPE_SETS.sets[key];
  const tpl = SHAPE_SETS.sets.template || {};
  const alt = ((s.card_alt || tpl.card_alt || {}).fill) || "secondary-light";
  const vars = [`--card-alt-bg: ${tokenCss(alt)};`];
  if (!s.inherit) {
    const card = s.card || {}, out = s.outline || {};
    const rad = (SHAPE_SETS.radius[card.radius || "md"] || {}).px;
    const sh = SHAPE_SETS.shadow[s.shadow || "none"];
    vars.push(
      `--set-card-bg: ${tokenCss(card.fill || "white")};`,
      `--card-border-width: ${Math.round((out.width_pt || 0) * PT_TO_PX * 100) / 100}px;`,
      `--card-border-color: ${tokenCss(out.color || "border")};`,
      `--card-shadow: ${sh ? sh.css : "none"};`,
      ...(rad != null ? [`--card-radius: ${rad}px;`] : []),
    );
  }
  return `  /* 서식 세트: ${key} (library/shape-sets.json) */\n  :root, body { ${vars.join(" ")} }\n`;
}

/**
 * PPTX: 팔레트(pal)에 붙일 카드 서식 — helpers.cardBox 가 읽는다.
 * template 이면 inherit → 렌더러의 원래 서식(흰 채움 + 테두리 baseBorderWidth pt — pptdesign.config.json card.borderWidth).
 */
export function shapeSetPptx(name, pal, { baseBorderWidth } = {}) {
  const key = pickShapeSet(name), s = SHAPE_SETS.sets[key];
  const tpl = SHAPE_SETS.sets.template || {};
  const altFill = tokenPal(((s.card_alt || tpl.card_alt || {}).fill) || "secondary-light", pal);
  const baseLine = { color: pal.border, width: baseBorderWidth };
  if (s.inherit) return { name: key, inherit: true, altFill, line: baseLine };
  const card = s.card || {}, out = s.outline || {}, sh = SHAPE_SETS.shadow[s.shadow || "none"];
  return {
    name: key, inherit: false, altFill,
    fill: tokenPal(card.fill || "white", pal),
    line: (out.width_pt || 0) > 0 ? { color: tokenPal(out.color || "border", pal), width: out.width_pt } : { type: "none" },
    shadow: sh ? { type: "outer", blur: sh.blur_pt, offset: sh.dist_pt, angle: 90, color: "000000", opacity: sh.alpha } : null,
    radius: (SHAPE_SETS.radius[card.radius || "md"] || {}).in,
  };
}
