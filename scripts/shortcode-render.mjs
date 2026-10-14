/**
 * shortcode-render.mjs  —  숏코드 → HTML 정본(canonical) 렌더러
 * build-guide.mjs 에서 추출한 환경 비의존(순수) 모듈. marked 외 의존 없음.
 * build-guide / build-presentation / client-compiler 가 공유한다.
 * 색상은 resolveColorKeyword 가 CSS 변수(var(--brand) 등)로 반환하므로 스타일 객체가 불필요하다.
 */
import { resolveShortcode, wantsAltBg, argKeys, layoutArgs, markAltItems } from "./library-names.mjs";
import { EXT_RENDERERS, EXT_OWN_HEADER, headerBand } from "./shortcode-ext/index.mjs";
import { escapeHtml, renderInline, cleanValue, DEFAULT_BULLET, EMOJI_BULLET_RE, STD_BULLET_RE, renderMultiLineText, resolveColorKeyword, renderDesc, renderNote, DEFAULT_TITLE_REM, DEFAULT_P_REM, resolveSizeArg, buildSizeOverrideStyle } from "./shortcode-render/text.mjs";
import { parseSlideConfig, splitMeta, standardizeItem, parseShortcodeItems } from "./shortcode-render/parse.mjs";
import { blocks as B_CARDS } from "./shortcode-render/cards.mjs";
import { blocks as B_LISTS } from "./shortcode-render/lists.mjs";
import { blocks as B_BOXES } from "./shortcode-render/boxes.mjs";
import { blocks as B_DIAGRAMS } from "./shortcode-render/diagrams.mjs";
import { blocks as B_SECTIONS } from "./shortcode-render/sections.mjs";
import { blocks as B_CONFIG } from "./shortcode-render/config.mjs";

// 옛 숏코드 분기(구현 ID) — 파일별로 나눴고 순서는 예전 if 순서 그대로(첫 번째 맞는 분기)
const BLOCKS = [...B_CARDS, ...B_LISTS, ...B_BOXES, ...B_DIAGRAMS, ...B_SECTIONS, ...B_CONFIG];

/**
 * 숏코드 진입점 — 이름 해석(공용 카탈로그) + 블록 공통 인수 처리 후 cs_v2 렌더러에 넘긴다.
 *  - 이름: 기능 이름(grid.cards) 하나로 운영 — 옛 이름은 기능 이름 + 인수로 정규화한 뒤 구현 ID 를 고른다 (library-names.mjs)
 *  - bg=alt: 이 블록의 카드만 서식 세트의 보조 카드색(--card-alt-bg)으로 — 레이아웃에 영향 없는 display:contents 래퍼
 *  - 배치 인수 a = 카탈로그 기본값 < 블록 인수(layoutArgs) — badge·connector·emphasis·grow 같은 기본 수치는 카탈로그에만 둔다
 *  - header 인수: 본문 위 머리띠(스스로 그리는 배치 제외)
 */
function renderShortcode(type, body, args) {
  const r = resolveShortcode(type, args);   // 기능 이름 + 정규화된 인수 → cs_v2 구현 ID
  const a = layoutArgs(r.layout, r.args);
  let html = renderNative(r.type, body, r.args, a);
  if (html && a.header && !EXT_OWN_HEADER.has(r.type)) html = headerBand(a.header, { inline: renderInline }) + html;
  return html && wantsAltBg(r.args) ? `<div class="sc-bg-alt">${html}</div>` : html;
}

function renderNative(type, body, args, a = argKeys(args)) {
  const items = markAltItems(parseShortcodeItems(body));   // 항목 tag: alt → _alt (그 카드만 보조 카드색)
  if (!items.length) return "";
  const alt = (it) => (it._alt ? " sc-item-alt" : "");

  const renderAccent = (color) => {
    if (!color) return "";
    const res = resolveColorKeyword(color);
    if (res.startsWith("var(")) {
      return `style="border-color: ${res}; background-color: color-mix(in srgb, ${res} 8%, transparent);"`;
    }
    return `style="border-color: ${res}; background-color: ${res}08;"`;
  };
  const renderTextColor = (color) => {
    if (!color) return "";
    const res = resolveColorKeyword(color);
    return `style="color: ${res};"`;
  };
  const renderCompareNote = (activeNote, color) => {
    if (!activeNote) return "";
    const metaItems = splitMeta(activeNote);
    const res = resolveColorKeyword(color);
    let style = "";
    if (res) {
      if (res.startsWith("var(")) {
        style = `style="background:color-mix(in srgb, ${res} 8%, transparent); color:${res}"`;
      } else {
        style = `style="background:${res}15; color:${res}"`;
      }
    }
    if (metaItems.length > 1) {
      return `<div class="compare-note" ${style}>
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; text-align: left;">
          ${metaItems.map(f => `<li style="display: flex; gap: 8px; align-items: flex-start; font-size: 0.85rem;"><span style="color: ${res || 'var(--brand)'}; flex-shrink: 0; margin-top: 2px;">•</span><span>${escapeHtml(f)}</span></li>`).join("")}
        </ul>
      </div>`;
    }
    return `<div class="compare-note" ${style}>${escapeHtml(activeNote)}</div>`;
  };

  // cols=N, bullet=X, align=center|left|row 파싱
  const colsMatch   = (args || "").match(/cols=(\d+)/);
  const bulletMatch = (args || "").match(/bullet=(\S+)/);
  const alignMatch  = (args || "").match(/align=(\S+)/);
  const cols        = colsMatch  ? colsMatch[1]  : null;
  const blockBullet = bulletMatch ? bulletMatch[1] : null;
  const layoutAlign = alignMatch  ? alignMatch[1]  : "center";
  const gridStyle   = cols ? `style="grid-template-columns: repeat(${cols}, 1fr);"` : "";

  // 아이템 bullet 필드가 없으면 블록 레벨 bullet 사용
  const itemBullet = (it) => it.bullet || blockBullet || null;

  // 기능 이름 구현(shortcode-ext/*) — 예전 "근사" 배치를 모양 그대로. h = 텍스트 도구(순환 import 회피)
  if (EXT_RENDERERS[type]) {
    const h = { esc: escapeHtml, inline: renderInline, meta: splitMeta, color: resolveColorKeyword,
      desc: (it) => renderDesc(it.desc, itemBullet(it), it.color) };
    return EXT_RENDERERS[type](items, a, h);
  }
  // 원 칸 글자 — badge=icon(기본: 아이콘) | number(01·02…) | none(그리지 않음 → null)
  const badgeOf = (it, i, dflt = "") => a.badge === "none" ? null : a.badge === "number" ? String(i + 1).padStart(2, "0") : (it.icon || dflt);
  const ctx = { items, alt, renderAccent, renderTextColor, renderCompareNote, colsMatch, bulletMatch, alignMatch, cols, blockBullet, layoutAlign, gridStyle, itemBullet, badgeOf, a, args, type, body, renderNative };   // renderNative = 다른 분기로 넘길 때(compare-split → compare-grid)
  for (const b of BLOCKS) {
    if (!b.when(type)) continue;
    const html = b.render(ctx);
    if (html !== undefined) return html;
  }
  return "";
}

export {
  escapeHtml,
  renderInline,
  cleanValue,
  splitMeta,
  parseSlideConfig,
  standardizeItem,
  parseShortcodeItems,
  DEFAULT_BULLET,
  EMOJI_BULLET_RE,
  STD_BULLET_RE,
  renderMultiLineText,
  resolveColorKeyword,
  renderDesc,
  renderNote,
  DEFAULT_TITLE_REM,
  DEFAULT_P_REM,
  resolveSizeArg,
  buildSizeOverrideStyle,
  renderShortcode,
};
