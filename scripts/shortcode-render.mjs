/**
 * shortcode-render.mjs  —  숏코드 → HTML 정본(canonical) 렌더러
 * build-guide.mjs 에서 추출한 환경 비의존(순수) 모듈. marked 외 의존 없음.
 * build-guide / build-presentation / client-compiler 가 공유한다.
 * 색상은 resolveColorKeyword 가 CSS 변수(var(--brand) 등)로 반환하므로 스타일 객체가 불필요하다.
 */
import { marked } from "marked";
import { resolveShortcode, wantsAltBg, colorToken, argKeys, layoutArgs, emphOf, markAltItems } from "./library-names.mjs";
import { EXT_RENDERERS, EXT_OWN_HEADER, headerBand } from "./shortcode-ext/index.mjs";

// text.callout 종류 별칭 — 카탈로그 values(tip|info|warning|danger|success)의 warning 을 기존 CSS 클래스(alert-warn)로
const CALLOUT_ALIAS = { warning: "warn", caution: "warn" };

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function renderInline(s) {
  return escapeHtml(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
}

function cleanValue(v) {
  const s = String(v ?? "").trim();
  if (s.length >= 2 && s[0] === '"' && s[s.length - 1] === '"') {
    return s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  }
  if (s.length >= 2 && s[0] === "'" && s[s.length - 1] === "'") {
    return s.slice(1, -1);
  }
  return s.replace(/^["']|["']$/g, "");
}

/**
 * ::: slide-config 본문 → { key: value } (md-to-pptx·pptx-browser 공용, pptgen lib/parse_v2.js parseConfig 와 같은 규칙)
 *  - 줄마다 `key: value` 또는 `- key: value`
 *  - 여러 줄 값: `key: |` 다음 들여쓴 줄들(줄바꿈 유지) — 또는 한 줄에 `\n` 리터럴(둘 다 줄바꿈)
 */
function parseSlideConfig(src) {
  const cfg = {};
  let lit = null;
  for (const line of String(src || "").split(/\r?\n/)) {
    if (lit && /^\s+\S/.test(line)) { cfg[lit] = cfg[lit] ? `${cfg[lit]}\n${line.trim()}` : line.trim(); continue; }
    lit = null;
    const m = line.match(/^\s*(?:-\s*)?([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const v = cleanValue(m[2]);
    if (v === "|") { lit = m[1]; cfg[lit] = ""; } else cfg[m[1]] = v.replace(/\\n/g, "\n");
  }
  return cfg;
}

function splitMeta(meta) {
  if (!meta) return [];
  return String(meta)
    .split(/[|\n]/)
    .map(s => s.trim().replace(/^["']|["']$/g, "").trim())
    .filter(Boolean);
}

function standardizeItem(item) {
  const rawName = item.name || item.title || "";
  const iconMatch = rawName.match(/^([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])\s*(.*)$/);

  const icon =     item.icon || (iconMatch ? iconMatch[1] : "") || "";
  const title =    item.title || (iconMatch ? iconMatch[2] : item.name) || item.col || "";
  const desc =     String(item.desc || item.description || item.tagline || item.body || "").replace(/\\n/g, "\n").replace(/\/n/g, "\n");
  const tag =      item.tag || item.badge || item.type || "";
  const color =    item.color || "";
  const featured = String(item.featured || "").trim().toLowerCase() === "true" ? "true" : "";
  const bullet =   item.bullet || "";

  const meta =     String(item.meta || item.tool || item.features || item.items || item.points || "").replace(/\\n/g, "\n").replace(/\/n/g, "\n");
  const note =     String(item.note || "").replace(/\\n/g, "\n").replace(/\/n/g, "\n");

  return {
    ...item,
    icon,
    title,
    desc,
    tag,
    meta,
    note,
    color,
    featured,
    bullet,
  };
}

function parseShortcodeItems(src) {
  const items = [];
  let current = null;
  let currentKey = null;
  let inLiteralBlock = false;

  for (const line of src.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;  // 빈 줄 무시

    // 멀티라인 리터럴 블록 내부 파싱 보장 (공백 4칸 들여쓰기 유지 시)
    if (inLiteralBlock && line.startsWith("    ")) {
      const val = line.slice(4);
      const sep = currentKey === 'meta' ? ' | ' : '\n';
      const existing = current[currentKey];
      current[currentKey] = (!existing || existing === '|') ? val : existing + sep + val;
      continue;
    } else {
      inLiteralBlock = false;
    }

    // 1. 새 아이템 시작: - key: value
    const firstMatch = line.match(/^\s*-\s*([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (firstMatch) {
      currentKey = firstMatch[1];
      let val = cleanValue(firstMatch[2]);
      if (val === "|") {
        inLiteralBlock = true;
        current = { [currentKey]: "" };
      } else {
        current = { [currentKey]: val };
      }
      items.push(current);
      continue;
    }

    // 2. 기존 아이템 내 새 키 (들여쓰기 + key: value)
    const nextMatch = line.match(/^\s+([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (nextMatch && current) {
      currentKey = nextMatch[1];
      let val = cleanValue(nextMatch[2]);
      if (val === "|") {
        inLiteralBlock = true;
        current[currentKey] = "";
      } else {
        current[currentKey] = val;
      }
      continue;
    }

    // 3. 들여쓰기된 하이픈 리스트 항목 (들여쓰기 + - value)
    //    meta → | 구분, desc/note → \n 구분
    const listMatch = line.match(/^\s+-\s+(.+)$/);
    if (listMatch && current && currentKey) {
      const val = listMatch[1].trim();
      const existing = current[currentKey];
      const sep = currentKey === 'meta' ? ' | ' : '\n';
      current[currentKey] = (!existing || existing === '|') ? val : existing + sep + val;
      continue;
    }

    // 4. 들여쓰기된 연속 텍스트 (desc/note 멀티라인, YAML | 블록 스칼라 지원)
    //    반드시 인덴트가 있어야 캡처됨 → 새 아이템 오인 방지
    if (line.match(/^\s+\S/) && current && currentKey) {
      const val = line.trim();
      if (val === '|') {
        inLiteralBlock = true;
        continue;
      }
      const existing = current[currentKey];
      const sep = currentKey === 'meta' ? ' | ' : '\n';
      current[currentKey] = (!existing || existing === '|') ? val : existing + sep + val;
    }
  }

  return items.map(standardizeItem);
}

// ════════════════════════════════════════════════════════════════
//  2. 숏코드 렌더링 엔진 (모든 숏코드 지원)
// ════════════════════════════════════════════════════════════════

// 기본 불릿 — 여기서 한 곳만 바꾸면 전체 적용
// 이모지 예시: "✅" "✔️" "•" "●"  |  SVG 체크 사용 시: null
const DEFAULT_BULLET = null;   // null → SVG 체크마크

// 줄 앞 이모지 감지 (단독 이모지 + 공백 + 내용) — ✅✔️ 포함
const EMOJI_BULLET_RE = /^([\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{27BF}]|[\u{2B00}-\u{2BFF}])\s+(.+)$/u;
// 표준 텍스트 마커만 (이모지 제외)
const STD_BULLET_RE   = /^[-*+•]\s*(.*)$/;

function renderMultiLineText(text, defaultTag = "p", customBullet = null, bulletColor = null) {
  if (!text) return "";
  const cleanText = String(text).replace(/\\n/g, "\n").replace(/\/n/g, "\n");
  const lines = cleanText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // 단일 줄이고 불릿 마커 없으며 호출자가 지정한 커스텀 불릿도 없으면 → 일반 태그
  if (lines.length <= 1 && !STD_BULLET_RE.test(lines[0]) && !EMOJI_BULLET_RE.test(lines[0]) && !customBullet) {
    return defaultTag ? `<${defaultTag}>${escapeHtml(lines[0] ?? "")}</${defaultTag}>` : escapeHtml(lines[0] ?? "");
  }

  const svgBullet = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="margin-top:4px;display:inline-block;vertical-align:middle;"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  // 우선순위: 호출자 지정(customBullet) → DEFAULT_BULLET → SVG
  const activeBullet = customBullet ?? DEFAULT_BULLET;
  const makeBulletHtml = (sym) =>
    sym ? `<span style="font-size:1rem;line-height:1;">${sym}</span>` : svgBullet;
  // 불릿 색: it.color → var(--brand)
  const bulletColorStyle = bulletColor ? `color:${bulletColor};` : "color:var(--brand);";

  let listHtml = '<div class="multiline-list" style="margin-top:8px;display:flex;flex-direction:column;gap:6px;text-align:left;width:100%;">';
  for (const line of lines) {
    const emojiMatch = line.match(EMOJI_BULLET_RE);
    const stdMatch   = line.match(STD_BULLET_RE);

    let bulletHtml, content;
    if (emojiMatch) {
      bulletHtml = `<span style="font-size:1rem;line-height:1;">${emojiMatch[1]}</span>`;
      content    = emojiMatch[2];
    } else if (stdMatch) {
      bulletHtml = makeBulletHtml(activeBullet);
      content    = stdMatch[1];
    } else {
      bulletHtml = makeBulletHtml(activeBullet);
      content    = line;
    }
    if (!content.trim()) continue;

    listHtml += `<div class="multiline-item" style="display:flex;gap:8px;align-items:flex-start;font-size:var(--size-card-p);color:var(--text-2);line-height:1.5;">
      <span class="bullet" style="${bulletColorStyle}flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;min-width:16px;">${bulletHtml}</span>
      <span class="content" style="text-align:left;">${escapeHtml(content)}</span>
    </div>`;
  }
  listHtml += '</div>';
  return listHtml;
}

function resolveColorKeyword(color) {
  if (!color) return "";
  // 색 이름 → CSS 변수: 공용 카탈로그 color_tokens (pptgen 과 같은 이름 — primary·accent… / 옛 main·sub·deep·mid·light 도 별칭)
  return colorToken(color, "cs_v2") || color;
}

// 텍스트성 desc/note 통일 렌더러 (코드블록 제외 모든 숏코드에 사용)
function renderDesc(text, bullet, color) {
  return renderMultiLineText(text, "p", bullet || null, resolveColorKeyword(color) || null);
}

// note는 배지 맥락이지만 \n → · 구분으로 렌더
function renderNote(text) {
  if (!text) return "";
  return escapeHtml(String(text).split(/\n/).map(s => s.trim()).filter(Boolean).join(" · "));
}

// ── 숏코드별 폰트 크기 오버라이드 헬퍼 ──────────────────────────────
// title-size / desc-size arg 값 처리
//   순수 숫자(0.9)   → 기본값 대비 비율: 0.9 × 기본rem
//   단위 포함(1rem)  → 그대로 절대값으로 사용
const DEFAULT_TITLE_REM = 1.15;
const DEFAULT_P_REM     = 0.92;

function resolveSizeArg(val, defaultRem) {
  if (!val) return null;
  const s = String(val).trim();
  if (/^\d+(\.\d+)?$/.test(s)) return `${(parseFloat(s) * defaultRem).toFixed(3)}rem`;
  return s;
}

function buildSizeOverrideStyle(argsStr) {
  if (!argsStr) return "";
  const tm = argsStr.match(/title-size=(\S+)/);
  const dm = argsStr.match(/desc-size=(\S+)/);
  const parts = [];
  if (tm) { const v = resolveSizeArg(tm[1], DEFAULT_TITLE_REM); if (v) parts.push(`--size-card-title:${v}`); }
  if (dm) { const v = resolveSizeArg(dm[1], DEFAULT_P_REM);     if (v) parts.push(`--size-card-p:${v}`); }
  return parts.join(';');
}
// ─────────────────────────────────────────────────────────────────

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

  // 1. icon-grid (align=center|left|row) + feature-grid + badge-grid + stat-grid
  //    align=left  → skill-list 느낌 (좌측 아이콘 배경박스)
  //    align=row   → checkpoint-grid 느낌 (아이콘 좌, 텍스트 우 수평)
  //    구 이름 skill-list / checkpoint-grid 는 alias 로 동작
  if (["icon-grid", "feature-grid", "badge-grid", "stat-grid", "skill-list", "checkpoint-grid"].includes(type)) {
    const isBadge = type === "badge-grid";
    const isFeat  = type === "feature-grid";
    const isStat  = type === "stat-grid";

    // alias → effective layout
    const effectiveAlign = type === "skill-list"      ? "left"
                         : type === "checkpoint-grid"  ? "row"
                         : layoutAlign;

    const isSkillLayout = !isBadge && !isFeat && !isStat && effectiveAlign === "left";
    const isRowLayout   = !isBadge && !isFeat && !isStat && effectiveAlign === "row";

    const wrapClass = isBadge      ? "badge-grid"
                    : isFeat       ? "feature-grid"
                    : isStat       ? "stat-grid"
                    : isSkillLayout ? "skill-list"
                    : isRowLayout   ? "checkpoint-grid"
                    : "icon-grid";

    const statEmph = isStat ? emphOf(items, a.emphasis) : [];
    const cardBadge = (it, i, dflt) => (isBadge || isFeat || isStat) ? (it.icon || dflt) : badgeOf(it, i, dflt);   // badge 인수는 grid.cards 만
    return `<div class="${wrapClass}" ${gridStyle}>${items.map((it, i) => {
      if (isBadge) {
        return `<div class="badge-item${alt(it)}" ${renderAccent(it.color)}>
          <div class="badge-icon">${escapeHtml(it.icon)}</div>
          <div class="badge-title" style="color: var(--text);">${escapeHtml(it.title)}</div>
          <div class="badge-tag">${escapeHtml(it.tag)}</div>
        </div>`;
      }
      if (isStat) {
        return `<div class="stat-card${alt(it)}${statEmph[i] ? " sx-emph" : ""}" ${it.color ? `style="border-top: 3px solid ${it.color};"` : `style="border-top: 3px solid var(--brand);"`}>
          <div class="stat-val" ${it.color ? `style="color:${it.color}"` : ""}>${escapeHtml(it.icon || it.title)}</div>
          ${it.icon ? `<div class="stat-name">${escapeHtml(it.title)}</div>` : ""}
          ${it.desc ? `<div class="stat-note">${renderDesc(it.desc, itemBullet(it), it.color)}</div>` : ""}
        </div>`;
      }
      if (isSkillLayout) {
        // align=left : 작은 아이콘 좌측 배경박스, 제목+설명 우측
        const b = cardBadge(it, i, "");
        return `<div class="skill-item${alt(it)}" ${renderAccent(it.color)}>
          ${b === null ? "" : `<div class="skill-icon" ${it.color ? `style="background:${it.color}22; color:${it.color};"` : ""}>${escapeHtml(b)}</div>`}
          <div class="skill-title" ${renderTextColor(it.color)}>${escapeHtml(it.title)}</div>
          <div class="skill-desc">${renderDesc(it.desc, itemBullet(it), it.color)}</div>
        </div>`;
      }
      if (isRowLayout) {
        // align=row : 아이콘 좌 + 텍스트 우 수평 배열
        const b = cardBadge(it, i, "📐");
        return `<div class="checkpoint-item${alt(it)}">
          ${b === null ? "" : `<div class="ci-icon">${escapeHtml(b)}</div>`}
          <div class="ci-text"><strong>${escapeHtml(it.title || "")}</strong>${it.desc ? `<br>${escapeHtml(it.desc)}` : ""}</div>
        </div>`;
      }
      // 기본(center): icon-grid 또는 feature-grid
      const cb = cardBadge(it, i, "");
      return `<div class="${isFeat ? 'feature-card' : 'icon-card'}${alt(it)}" ${renderAccent(it.color)}>
        ${isFeat && it.color ? `<div class="card-top-bar" style="background-color:${resolveColorKeyword(it.color)}"></div>` : ''}
        ${it.tag ? `<span class="feature-tag" ${it.color ? `style="background:${resolveColorKeyword(it.color)}; color:#fff;"` : ""}>${escapeHtml(it.tag)}</span>` : ""}
        ${isFeat ? `
          <div class="feature-card-title" style="color: var(--brand-dark);">
            ${it.icon ? `<span class="fc-icon">${escapeHtml(it.icon)}</span>` : ""}${renderMultiLineText(it.title, "")}
          </div>
        ` : `
          ${cb === null ? "" : `<div class="icon-card-icon" style="color: var(--brand);">${escapeHtml(cb)}</div>`}
          <div class="icon-card-title" style="color: var(--text);">${renderMultiLineText(it.title, "")}</div>
        `}
        ${renderDesc(it.desc, itemBullet(it), it.color)}
      </div>`;
    }).join("")}</div>`;
  }
  // 2. tool-list (구 tool-box 호환)
  if (type === "tool-list" || type === "tool-box") {
    return items.map(it => {
      const resColor = resolveColorKeyword(it.color);
      const grad = resColor ? (resColor.startsWith("var(") ? `linear-gradient(135deg, ${resColor}, color-mix(in srgb, ${resColor} 80%, black))` : `linear-gradient(135deg, ${resColor}, ${resColor}CC)`) : `var(--brand-gradient)`;
      const metaItems = splitMeta(it.meta);
      return `<div class="tool-card${alt(it)}">
        <div class="tc-header" style="background: ${grad}; color: #fff;">
          <div class="tc-icon">${escapeHtml(it.icon)}</div>
          <div class="tc-content">
            <div class="tc-name">${escapeHtml(it.title)}</div>
            <div class="tc-sub">${escapeHtml(it.desc)}</div>
          </div>
          ${it.tag ? `<div class="tc-badge">${escapeHtml(it.tag)}</div>` : ""}
        </div>
        ${metaItems.length ? `<ul class="tc-list">${metaItems.map(f => `<li>${escapeHtml(f)}</li>`).join("")}</ul>` : ""}
      </div>`;
    }).join("");
  }

  // 3. workflow-flow (alias → step-flow 스타일로 렌더, 시각적 wf-* 클래스 유지)
  if (type === "workflow-flow" || type === "workflow-strip") {
    const emph = emphOf(items, a.emphasis);
    return `<div class="workflow-flow">${items.map((it, idx) => { const b = badgeOf(it, idx); return `
      <div class="wf-step${alt(it)}${emph[idx] ? " active" : ""}" ${renderAccent(it.color)}>
        ${b === null ? "" : `<div class="wf-icon" ${it.color ? `style="background:${it.color}; color:#fff;"` : ""}>${escapeHtml(b)}</div>`}
        <div class="wf-name" ${renderTextColor(it.color)}>${escapeHtml(it.title)}</div>
        <div class="wf-tool">${escapeHtml(it.meta)}</div>
        ${idx < items.length - 1 ? `<div class="wf-arrow">→</div>` : ""}
      </div>`; }).join("")}</div>`;
  }

  // 4. step-list (구 steps)
  if (type === "step-list") {
    // badge 기본 number(카탈로그) — 번호는 1·2·3(예전 그대로), icon 이면 아이콘(없으면 번호), none 이면 원 없음
    const stepBadge = (it, idx) => a.badge === "none" ? null : a.badge === "icon" && it.icon ? it.icon : String(idx + 1);
    return `<div class="step-list">${items.map((it, idx) => `
      <div class="step-item${alt(it)}" ${renderAccent(it.color)}>
        ${stepBadge(it, idx) === null ? "" : `<div class="step-num" ${it.color ? `style="background:${it.color}"` : ""}>${escapeHtml(stepBadge(it, idx))}</div>`}
        <div class="step-content">
          <div class="step-title" ${renderTextColor(it.color)}>${escapeHtml(it.title)}</div>
          ${renderDesc(it.desc, itemBullet(it), it.color)}
        </div>
      </div>`).join("")}</div>`;
  }

  // 5. compare-grid
  if (type === "compare-grid") {
    return `<div class="compare-grid" ${gridStyle}>${items.map(it => {
      const activeNote = it.note || it.meta;
      return `
      <div class="compare-card${alt(it)}" ${renderAccent(it.color)}>
        <div class="compare-card-title" ${renderTextColor(it.color)}>${escapeHtml(it.title)}</div>
        ${renderDesc(it.desc, itemBullet(it), it.color)}
        ${activeNote ? renderCompareNote(activeNote, it.color) : ""}
      </div>`;
    }).join("")}</div>`;
  }

  // 6. plan-grid
  if (type === "plan-grid") {
    return `<div class="plan-grid" ${gridStyle}>${items.map(it => {
      const isFeat = it.featured === "true" || it.tag === "Best" || it.color;
      const highlight = isFeat ? "plan-featured" : "";
      const resColor = resolveColorKeyword(it.color);
      const style = resColor ? `style="border-color:${resColor}; box-shadow: 0 8px 24px ${resColor.startsWith("var(") ? 'color-mix(in srgb, ' + resColor + ' 20%, transparent)' : resColor + '33'};"` : "";
      const topBarStyle = resColor ? `style="background:${resColor};"` : "";
      const metaItems = splitMeta(it.meta);
      
      return `<div class="plan-card ${highlight}${alt(it)}" ${style}>
        <div class="card-top-bar" ${topBarStyle}></div>
        ${it.tag ? `<div class="plan-badge" ${topBarStyle}>${escapeHtml(it.tag)}</div>` : ""}
        <div class="plan-title" ${renderTextColor(it.color)}>${escapeHtml(it.title)}</div>
        <ul class="plan-features">
          ${metaItems.map(f => `<li>${escapeHtml(f)}</li>`).join('')}
        </ul>
        ${it.note ? `<div class="plan-note" ${topBarStyle}>${renderNote(it.note)}</div>` : ""}
      </div>`;
    }).join("")}</div>`;
  }

  // 7. skill-list
  if (type === "skill-list") {
    return `<div class="skill-list">${items.map(it => `
      <div class="skill-item" ${renderAccent(it.color)}>
        <div class="skill-icon" ${it.color ? `style="background:${it.color}22; color:${it.color};"` : ""}>${escapeHtml(it.icon)}</div>
        <div class="skill-title" ${renderTextColor(it.color)}>${escapeHtml(it.title)}</div>
        <div class="skill-desc">${renderDesc(it.desc, itemBullet(it), it.color)}</div>
      </div>`).join("")}</div>`;
  }

  // 8. columns-grid (compare-grid 는 alias — 동일 구조, 용도 컨텍스트만 다름)
  if (type === "columns-grid" || type === "compare-grid") {
    return `<div class="columns-grid" ${gridStyle}>${items.map(it => {
      const activeNote = it.note || it.meta;
      return `
      <div class="column-card${alt(it)}" ${renderAccent(it.color)}>
        <div class="card-top-bar" ${it.color ? `style="background:${resolveColorKeyword(it.color)}"` : ""}></div>
        <div class="col-title" ${renderTextColor(it.color)}>${escapeHtml(it.title)}</div>
        ${renderDesc(it.desc, itemBullet(it), it.color)}
        ${activeNote ? renderCompareNote(activeNote, it.color) : ""}
      </div>`;
    }).join("")}</div>`;
  }

  // 9. summary-box (구 bottom-list 호환)
  if (type === "summary-box" || type === "bottom-list") {
    const it = items[0];
    const chips = splitMeta(it.meta);
    return `<div class="summary-box${alt(it)}" ${renderAccent(it.color)}>
      <div class="bl-title" ${renderTextColor(it.color)}>${renderInline(it.title)}</div>
      ${renderDesc(it.desc, itemBullet(it), it.color)}
      ${chips.length ? `<div class="bl-chips">${chips.map(c => `<span class="bl-chip" ${it.color ? `style="background:${it.color}15; color:${it.color}"` : ""}>${escapeHtml(c)}</span>`).join('')}</div>` : ""}
    </div>`;
  }

  // 10. compare-split (구 compare-2col)
  if (type === "compare-split") {
    if (items.length < 2) return renderNative("compare-grid", body, args);
    return `<div class="compare-2col">${items.slice(0, 2).map((it, idx) => {
      const isLeft = idx === 0;
      const classes = (isLeft ? "c2-card c2-left" : "c2-card c2-right") + alt(it);
      const metaItems = splitMeta(it.meta);
      const metaHtml = metaItems.length ? `<ul class="c2-list">${metaItems.map(f => `<li>${escapeHtml(f)}</li>`).join('')}</ul>` : "";
      const descHtml = it.desc ? `<div class="c2-desc">${renderDesc(it.desc, itemBullet(it), it.color)}</div>` : "";
      return `<div class="${classes}">
        <div class="card-top-bar"></div>
        <div class="c2-title">${escapeHtml(it.title)}</div>
        ${metaHtml}
        ${descHtml}
        ${it.note ? `<div class="c2-note">${renderNote(it.note)}</div>` : ""}
      </div>`;
    }).join("")}</div>`;
  }

  // 11. alert-box
  if (type === "alert-box") {
    const typeColors = { tip: "var(--brand)", warn: "#F59E0B", success: "#22C55E", danger: "#EF4444" };
    return items.map(it => {
      // 종류 = variant=… 또는 첫 위치 인수(::: text.callout tip) — 인수 문자열 전체를 종류로 쓰지 않는다(bg=alt 등과 함께 써도 안전)
      const pos = String(args || "").trim().split(/\s+/).find((w) => w && !w.includes("="));
      const raw = String(argKeys(args).variant || pos || it.type || it.tag || a.variant || "").trim().toLowerCase();   // 마지막은 카탈로그 기본값(tip)
      const t = CALLOUT_ALIAS[raw] || raw;
      const color = typeColors[t] || "var(--brand)";
      return `<div class="alert-box alert-${t}" style="--alert-color:${color}">
        ${it.icon ? `<div class="alert-icon">${escapeHtml(it.icon)}</div>` : ""}
        <div class="alert-body">
          ${it.title ? `<strong>${escapeHtml(it.title)}</strong>` : ""}
          ${renderDesc(it.desc, itemBullet(it), it.color)}
        </div>
      </div>`;
    }).join("");
  }

  // 12. cmd-box (구 command-block)
  if (type === "cmd-box") {
    return items.map(it => {
      const label = it.title || it.tag || "Terminal";
      const lang  = it.meta || "bash";
      return `<div class="cmd-block">
        <div class="cmd-header">
          <span class="cmd-label">${escapeHtml(label)}</span>
          <span class="cmd-lang">${escapeHtml(lang)}</span>
          <button class="cmd-copy" onclick="(function(b){var p=b.closest('.cmd-block').querySelector('.cmd-pre');navigator.clipboard.writeText(p.textContent.trim()).then(()=>{b.textContent='복사됨';setTimeout(()=>b.textContent='복사',1500)})})(this)">복사</button>
        </div>
        <pre class="cmd-pre"><code>${escapeHtml(it.desc)}</code></pre>
      </div>`;
    }).join("");
  }

  // 13. os-tabs (구 tabs)
  if (type === "os-tabs") {
    const uid = "t" + Math.random().toString(36).slice(2, 7);
    return `<div class="tabs-wrap">
      <div class="tabs-nav">
        ${items.map((it, i) => `<button class="tab-btn${i === 0 ? " active" : ""}" onclick="switchTab(this,'${uid}-${i}')">${escapeHtml(it.title || it.tag || `탭 ${i+1}`)}</button>`).join("")}
      </div>
      ${items.map((it, i) => `<div class="tab-panel${i === 0 ? " active" : ""}" id="${uid}-${i}">${it.desc ? marked.parse(it.desc) : ""}</div>`).join("")}
    </div>`;
  }

  // 14. faq-list (구 faq-accordion)
  if (type === "faq-list") {
    return `<div class="faq-list">${items.map(it => `
      <div class="faq-item${alt(it)}">
        <button class="faq-q" onclick="this.closest('.faq-item').classList.toggle('open')">
          <span>${escapeHtml(it.title)}</span>
          <span class="faq-arrow">▼</span>
        </button>
        <div class="faq-a">${renderDesc(it.desc, itemBullet(it), it.color)}</div>
      </div>`).join("")}</div>`;
  }

  // 15. console-box (구 prompt-example)
  if (type === "console-box") {
    return items.map(it => `
      <div class="prompt-box">
        ${it.title ? `<div class="prompt-label">${escapeHtml(it.title)}</div>` : ""}
        <pre class="prompt-content">${escapeHtml(it.desc)}</pre>
      </div>`).join("");
  }

  // 16. [NEW] git-flow (구 git-flow-strip) (다차원 깃 플로우 브랜치 흐름 시각화)
  if (type === "git-flow" || type === "git-flow-strip") {
    return `<div class="git-flow-container"><div class="flow-branches">${items.map(it => {
      const color = it.color || "var(--brand)";
      const tags = it.tag ? it.tag.split("|").map(t => t.trim()) : [];
      const metas = it.meta ? it.meta.split("|").map(m => m.trim()) : [];
      const count = Math.max(tags.length, metas.length, 1);
      
      const commitsHtml = Array.from({ length: count }).map((_, idx) => {
        const tag = tags[idx] || "";
        const meta = metas[idx] || "";
        
        const labelHtml = tag ? `<span class="commit-label" style="background:${color};">${escapeHtml(tag)}</span>` : "";
        const descHtml = meta ? `<span class="commit-desc">${escapeHtml(meta)}</span>` : "";
        // connector: line(기본 — 카탈로그) | arrow(끝에 화살촉) | none(이음선 없음)
        const lineHtml = idx < count - 1 && a.connector !== "none" ? `<div class="commit-line-segment${a.connector === "arrow" ? " gf-arrow" : ""}" style="background:${color};${a.connector === "arrow" ? ` color:${color};` : ""}"></div>` : "";
        
        return `
          <div class="commit" style="border-color:${color};">
            ${labelHtml}
            ${descHtml}
          </div>
          ${lineHtml}
        `;
      }).join("");

      return `<div class="branch-row">
        <div class="branch-label" style="background: ${color}12; border-left: 4px solid ${color}; color: ${color}; font-weight: 800;">
          ${escapeHtml(it.title)}
        </div>
        <div class="branch-line">
          ${commitsHtml}
        </div>
      </div>`;
    }).join("")}</div></div>`;
  }

  // 17. [NEW] editor-box (VS Code 모양의 가상 코드 에디터 시뮬레이션)
  if (type === "editor-box") {
    // YAML 형식이 아닌 raw 마크다운 본문일 경우 폴백: args에서 title/lang 추출, 전체 body를 코드로 표시
    const hasStructured = items.some(it => it.desc);
    if (!hasStructured) {
      const argStr = (args || "").trim();
      const langMatch = argStr.match(/\((\w+)\)/);
      const filename = argStr.replace(/\(.*?\)/g, "").trim() || "code";
      const lang = langMatch ? langMatch[1] : "text";
      const rawCode = body.trim();
      const codeLines = rawCode.split('\n');
      return `<div class="editor-sim">
        <div class="editor-titlebar">
          <div class="editor-dot red"></div>
          <div class="editor-dot yellow"></div>
          <div class="editor-dot green"></div>
          <div class="editor-tab active">${escapeHtml(filename)} <span style="font-size:0.75rem;opacity:0.5;">(${escapeHtml(lang)})</span></div>
        </div>
        <div class="editor-body">
          <div class="line-nums">
            ${codeLines.map((_, i) => `<span>${i + 1}</span>`).join('')}
          </div>
          <div class="code-area"><pre><code>${escapeHtml(rawCode)}</code></pre></div>
        </div>
      </div>`;
    }
    return items.map(it => {
      const codeLines = (it.desc || "").split('\n');
      const filename = it.title || "untitled";
      const lang = it.tag || "javascript";
      return `<div class="editor-sim">
        <div class="editor-titlebar">
          <div class="editor-dot red"></div>
          <div class="editor-dot yellow"></div>
          <div class="editor-dot green"></div>
          <div class="editor-tab active">${escapeHtml(filename)} <span style="font-size:0.75rem;opacity:0.5;">(${escapeHtml(lang)})</span></div>
        </div>
        <div class="editor-body">
          <div class="line-nums">
            ${codeLines.map((_, i) => `<span>${i + 1}</span>`).join('')}
          </div>
          <div class="code-area"><pre><code>${escapeHtml(it.desc)}</code></pre></div>
        </div>
      </div>`;
    }).join("");
  }

  // 18. [NEW] network-box (둥둥 떠다니는 은하수 지식 그래프 성단)
  if (type === "network-box") {
    const mainNode = items[0];
    const subNodes = items.slice(1);
    const color = mainNode.color || "var(--brand)";
    return `<div class="graph-visual">
      <div class="graph-nodes">
        <div class="node node-main" style="background: ${color}; box-shadow: 0 0 24px ${color}88;">
          ${escapeHtml(mainNode.title)}
        </div>
        ${subNodes.map((n, i) => {
          const subColor = n.color || "var(--brand-dark)";
          return `<div class="node node-${i + 1}" style="border: 2px solid ${subColor}; color: ${subColor};">
            ${escapeHtml(n.title)}
            ${n.meta ? `<span style="font-size:0.7rem; opacity:0.6; display:block;">${escapeHtml(n.meta)}</span>` : ""}
          </div>`;
        }).join("")}
      </div>
    </div>`;
  }
  
  // 18-1. [NEW] venn-diagram — 두 영역의 교집합에서 새 가치가 발생함을 표현
  //   items[0]=왼쪽 원, items[1]=오른쪽 원, items[2](선택)=교집합 캡션(icon/desc)
  if (type === "venn-diagram" || type === "venn") {
    const left = items[0] || {};
    const right = items[1] || {};
    const center = items[2] || {};
    const leftColor = resolveColorKeyword(left.color) || "var(--brand)";
    const rightColor = resolveColorKeyword(right.color) || "var(--brand-dark)";
    const hasCenter = !!(center.icon || center.desc || center.title);
    return `<div class="venn-diagram">
      <div class="venn-circle venn-left" style="border-color:${leftColor}; background:color-mix(in srgb, ${leftColor} 16%, transparent);">
        <span class="venn-label" style="color:${leftColor};">${escapeHtml(left.title)}</span>
      </div>
      <div class="venn-circle venn-right" style="border-color:${rightColor}; background:color-mix(in srgb, ${rightColor} 16%, transparent);">
        <span class="venn-label" style="color:${rightColor};">${escapeHtml(right.title)}</span>
      </div>
      ${hasCenter ? `<div class="venn-center">
        ${center.icon ? `<span class="venn-center-icon">${escapeHtml(center.icon)}</span>` : ""}
        ${(center.desc || center.title) ? `<span class="venn-center-desc">${escapeHtml(center.desc || center.title)}</span>` : ""}
      </div>` : ""}
    </div>`;
  }

  // 18-2. [NEW] quadrant-chart — 두 축(X/Y) 기준 여러 항목의 상대 위치 비교
  //   블록 인수: xLabel="..." yLabel="..." (따옴표 필수, 공백 포함 라벨 지원)
  //   항목 필드: title(라벨), color, fx/fy(0~1 비율, 좌하단이 0,0)
  if (type === "quadrant-chart") {
    const xLabelMatch = (args || "").match(/xLabel="([^"]*)"/);
    const yLabelMatch = (args || "").match(/yLabel="([^"]*)"/);
    const xLabel = xLabelMatch ? xLabelMatch[1] : "";
    const yLabel = yLabelMatch ? yLabelMatch[1] : "";
    const clamp01 = (v) => Math.min(1, Math.max(0, parseFloat(v)));
    return `<div class="quadrant-chart">
      ${yLabel ? `<div class="quadrant-axis-y">${escapeHtml(yLabel)}</div>` : ""}
      <div class="quadrant-plot">
        <div class="quadrant-gridline quadrant-gridline-h"></div>
        <div class="quadrant-gridline quadrant-gridline-v"></div>
        ${items.map(it => {
          const fx = Number.isFinite(clamp01(it.fx)) ? clamp01(it.fx) : 0.5;
          const fy = Number.isFinite(clamp01(it.fy)) ? clamp01(it.fy) : 0.5;
          const color = resolveColorKeyword(it.color) || "var(--brand)";
          return `<div class="quadrant-point" style="left:${(fx * 100).toFixed(1)}%; bottom:${(fy * 100).toFixed(1)}%;">
            <span class="quadrant-dot" style="background:${color};"></span>
            <span class="quadrant-point-label" style="color:${color};">${escapeHtml(it.title)}</span>
          </div>`;
        }).join("")}
      </div>
      ${xLabel ? `<div class="quadrant-axis-x">${escapeHtml(xLabel)}</div>` : ""}
    </div>`;
  }

  // 18-3. [NEW] concentric-rings — A⊃B⊃C 같은 계층적 포함관계 (바깥→안쪽 순서로 작성)
  //   마지막 항목의 icon 이 있으면 가장 안쪽에 중심 아이콘으로 표시
  if (type === "concentric-rings") {
    const n = items.length;
    return `<div class="concentric-rings">
      <div class="rings-visual">
        ${items.map((it, i) => {
          const color = resolveColorKeyword(it.color) || "var(--brand)";
          return `<div class="ring ring-depth-${Math.min(i, 5)}" style="background:${color}; z-index:${i + 1};"></div>`;
        }).join("")}
        ${items[n - 1]?.icon ? `<div class="ring-center-icon" style="z-index:${n + 1};">${escapeHtml(items[n - 1].icon)}</div>` : ""}
      </div>
      <div class="rings-legend">
        ${items.map(it => `<span class="ring-legend-item"><i style="background:${resolveColorKeyword(it.color) || "var(--brand)"};"></i>${escapeHtml(it.title)}</span>`).join("")}
      </div>
    </div>`;
  }

  // 19. [NEW] part-banner (구 part-deck 호환)
  if (type === "part-banner" || type === "part-deck") {
    return items.map(it => {
      const color = it.color || "var(--brand)";
      return `<div class="part-banner" style="--part-color: ${color};">
        <div class="part-banner-header" style="background: ${color};">
          <div class="part-banner-num-block">${escapeHtml(it.icon || "부")}</div>
          <div class="part-banner-title-block">
            <span class="part-banner-title-text">${escapeHtml(it.title)}</span>
            ${it.desc ? `<span class="part-banner-tagline">${escapeHtml(it.desc)}</span>` : ""}
            ${it.tag ? `<span class="part-banner-chapter-range">${escapeHtml(it.tag)}</span>` : ""}
          </div>
        </div>
      </div>`;
    }).join("");
  }

  // 20. [NEW] chapter-list (시리즈 목차용 세부 챕터 목록)
  if (type === "chapter-list") {
    const getBadgeClass = (tag) => {
      const map = { "개념": "badge-concept", "도구": "badge-tool", "사례": "badge-case", "가이드": "badge-guide", "실습": "badge-practice", "주의": "badge-warn", "핵심": "badge-practice" };
      return map[tag.trim()] || "badge-concept";
    };

    return `<div class="chapter-list">${items.map(it => `
      <div class="chapter-item${alt(it)}">
        <span class="chapter-num">${escapeHtml(it.icon)}</span>
        <div class="chapter-title">
          <strong>${escapeHtml(it.title)}</strong>
          ${it.desc ? `<span class="chapter-desc">${escapeHtml(it.desc)}</span>` : ""}
        </div>
        ${it.tag && it.tag.trim() !== "" ? `<span class="chapter-badge ${getBadgeClass(it.tag)}">${escapeHtml(it.tag)}</span>` : ""}
      </div>`).join("")}</div>`;
  }

  // 21. [NEW] summary-bar (하단 지표 요약 수치 그리드)
  if (type === "summary-bar") {
    return `<div class="summary-bar">${items.map(it => {
      const rawNum = it.icon || "";
      const numMatch = rawNum.match(/^(\d+(?:\.\d+)?(?:[Kk]\+?|\+)?)\s*(.*)$/);
      const val = numMatch ? numMatch[1] : rawNum;
      const unit = numMatch ? numMatch[2] : "";

      return `<div class="summary-item">
        <span class="summary-num">${escapeHtml(val)}${unit ? `<span class="unit">${escapeHtml(unit)}</span>` : ""}</span>
        <span class="summary-label">${escapeHtml(it.title)}</span>
      </div>`;
    }).join("")}</div>`;
  }

  // 22. step-flow (구 flow 호환 + meta 필드 지원)
  //     meta 필드를 사용하면 workflow-flow 스타일처럼 도구/코멘트를 표시할 수 있음
  //     connector: line(기본 — 카탈로그) = 단계 사이 가는 선 | none = 선 없음(화살표는 type: arrow 항목으로). arrow 는 workflow-flow 구현
  //     badge: icon | number | none, emphasis: 항목 tag(active·highlight) 또는 last|first|<번호>
  if (type === "step-flow" || type === "flow") {
    const isArrow = (it) => it.type === "arrow" || it.title === "→" || it.icon === "→";
    const steps = items.filter((it) => !isArrow(it)), emph = emphOf(steps, a.emphasis);
    const line = a.connector === "line" && steps.length === items.length;   // 화살표 항목을 직접 넣었으면 선은 긋지 않는다
    return `<div class="step-flow${line ? " sf-line" : ""}">${items.map(it => {
      if (isArrow(it)) {
        return `<div class="step-flow-arrow">${escapeHtml(it.icon || "→")}</div>`;
      }
      const k = steps.indexOf(it), b = badgeOf(it, k);
      const activeClass = emph[k] ? "active" : "";
      return `<div class="step-flow-step ${activeClass}${alt(it)}">
        ${b === null ? "" : `<div class="fs-icon">${escapeHtml(b)}</div>`}
        <div class="fs-title">${escapeHtml(it.title)}</div>
        ${it.meta ? `<div class="fs-meta" style="font-size:0.75rem;color:var(--text-3);margin-top:4px;">${escapeHtml(it.meta)}</div>` : ""}
        <div class="fs-sub">${renderDesc(it.desc, itemBullet(it), it.color)}</div>
      </div>`;
    }).join("")}</div>`;
  }

  // 23. [NEW] level-grid (레벨 스펙트럼)
  //     grow: 뒤 카드일수록 높게(1.0 = 같은 높이, 카탈로그 기본), emphasis: 항목 tag(highlight) 또는 last|first|<번호>
  if (type === "level-grid") {
    const emph = emphOf(items, a.emphasis), n = items.length;
    const grow = Math.min(1.6, Math.max(1.0, parseFloat(a.grow) || 1.0));
    return `<div class="level-grid${grow > 1 ? " lv-grow" : ""}">${items.map((it, i) => {
      const activeClass = emph[i] ? "highlight" : "";
      return `<div class="level-card ${activeClass}${alt(it)}"${grow > 1 ? ` style="--lv-k:${Math.pow(grow, i - (n - 1)).toFixed(3)}"` : ""}>
        <div class="level-num">${escapeHtml(it.title)}</div>
        <div class="level-name">${renderDesc(it.desc, itemBullet(it), it.color)}</div>
        <div class="level-tool">${escapeHtml(it.meta)}</div>
        <div class="level-desc">${renderNote(it.note)}</div>
      </div>`;
    }).join("")}</div>`;
  }

  // 24. [NEW] checkpoint-grid (중간 검수 포인트)
  if (type === "checkpoint-grid") {
    return `<div class="checkpoint-grid">${items.map(it => `
      <div class="checkpoint-item">
        <div class="ci-icon">${escapeHtml(it.icon || "📐")}</div>
        <div class="ci-text"><strong>${escapeHtml(it.title || "")}</strong><br>${escapeHtml(it.desc || "")}</div>
      </div>`).join("")}</div>`;
  }

  // 25. before-after (전후 대조) — compare-diff / compare-before-after 는 alias
  if (type === "before-after" || type === "compare-diff" || type === "compare-before-after") {
    const bad = items[0] || {};
    const good = items[1] || {};
    return `<div class="compare-diff">
      <div class="before-box">
        <div class="ba-label">❌ ${escapeHtml(bad.title)}</div>
        <div class="ba-content">${escapeHtml(bad.desc).replace(/\n/g, "<br>")}</div>
      </div>
      <div class="after-box">
        <div class="ba-label">✅ ${escapeHtml(good.title)}</div>
        <div class="ba-content">${escapeHtml(good.desc).replace(/\n/g, "<br>")}</div>
      </div>
    </div>`;
  }

  // 26. [NEW] takeaway-banner (구 takeaway) (Key Takeaway)
  if (type === "takeaway-banner" || type === "takeaway") {
    const it = items[0] || {};
    return `<div class="takeaway-banner">
      <div class="ta-icon">${escapeHtml(it.icon || "💡")}</div>
      <div>
        <div class="ta-label">${escapeHtml(it.title || "Key Takeaway")}</div>
        <div class="ta-text">${renderDesc(it.desc, itemBullet(it), it.color)}</div>
      </div>
    </div>`;
  }

  if (type === "slide-config") {
    const lines = body.split(/\r?\n/);
    let bg = "", color = "";
    for (const line of lines) {
      const m = line.match(/^\s*(?:-\s*)?([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
      if (m) {
        const key = m[1].trim();
        const val = cleanValue(m[2]);
        if (key === "bg") bg = val;
        if (key === "color") color = val;
      }
    }
    if (bg || color) {
      const uid = "style-" + Math.random().toString(36).slice(2, 7);
      let styles = "";
      if (bg) {
        styles += `
          .section:has(.${uid}) { background-color: ${bg} !important; }
          .section:has(.${uid}) .card { background-color: ${bg} !important; border-color: rgba(255,255,255,0.1) !important; }
          .slide:has(.${uid}) { background-color: ${bg} !important; }
          .slide:has(.${uid}) .card { background-color: ${bg} !important; border-color: rgba(255,255,255,0.1) !important; }
        `;
      }
      if (color) {
        styles += `
          .section:has(.${uid}) { color: ${color} !important; }
          .section:has(.${uid}) h2,
          .section:has(.${uid}) h3,
          .section:has(.${uid}) p,
          .section:has(.${uid}) li,
          .section:has(.${uid}) span,
          .section:has(.${uid}) div,
          .section:has(.${uid}) strong,
          .section:has(.${uid}) a {
            color: ${color} !important;
          }
          .slide:has(.${uid}) { color: ${color} !important; }
          .slide:has(.${uid}) h1,
          .slide:has(.${uid}) h2,
          .slide:has(.${uid}) h3,
          .slide:has(.${uid}) p,
          .slide:has(.${uid}) li,
          .slide:has(.${uid}) span,
          .slide:has(.${uid}) div,
          .slide:has(.${uid}) strong,
          .slide:has(.${uid}) a {
            color: ${color} !important;
          }
        `;
      }
      return `<style>${styles}</style><div class="slide-style-trigger ${uid}" style="display:none;"></div>`;
    }
    return "";
  }

  return "";
}

// ════════════════════════════════════════════════════════════════
//  3. HTML 조립 (Config 연동 CSS 적용)
// ════════════════════════════════════════════════════════════════


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
