/**
 * shortcode-render/text.mjs — 글자 도구 — 이스케이프·인라인 강조·값 정리·여러 줄 글/글머리·색 이름·크기 인수
 * 정본 렌더러 shortcode-render.mjs 를 200줄 규칙으로 나눈 부분(바깥에서는 shortcode-render.mjs 만 import 한다).
 */
import { colorToken } from "../library-names.mjs";

// text.callout 종류 별칭 — 카탈로그 values(tip|info|warning|danger|success)의 warning 을 기존 CSS 클래스(alert-warn)로
export const CALLOUT_ALIAS = { warning: "warn", caution: "warn" };

export function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

export function renderInline(s) {
  return escapeHtml(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
}

export function cleanValue(v) {
  const s = String(v ?? "").trim();
  if (s.length >= 2 && s[0] === '"' && s[s.length - 1] === '"') {
    return s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  }
  if (s.length >= 2 && s[0] === "'" && s[s.length - 1] === "'") {
    return s.slice(1, -1);
  }
  return s.replace(/^["']|["']$/g, "");
}

// ════════════════════════════════════════════════════════════════
//  2. 숏코드 렌더링 엔진 (모든 숏코드 지원)
// ════════════════════════════════════════════════════════════════

// 기본 불릿 — 여기서 한 곳만 바꾸면 전체 적용
// 이모지 예시: "✅" "✔️" "•" "●"  |  SVG 체크 사용 시: null
export const DEFAULT_BULLET = null;   // null → SVG 체크마크

// 줄 앞 이모지 감지 (단독 이모지 + 공백 + 내용) — ✅✔️ 포함
export const EMOJI_BULLET_RE = /^([\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{27BF}]|[\u{2B00}-\u{2BFF}])\s+(.+)$/u;
// 표준 텍스트 마커만 (이모지 제외)
export const STD_BULLET_RE   = /^[-*+•]\s*(.*)$/;

export function renderMultiLineText(text, defaultTag = "p", customBullet = null, bulletColor = null) {
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

export function resolveColorKeyword(color) {
  if (!color) return "";
  // 색 이름 → CSS 변수: 공용 카탈로그 color_tokens (pptgen 과 같은 이름 — primary·accent… / 옛 main·sub·deep·mid·light 도 별칭)
  return colorToken(color, "cs_v2") || color;
}

// 텍스트성 desc/note 통일 렌더러 (코드블록 제외 모든 숏코드에 사용)
export function renderDesc(text, bullet, color) {
  return renderMultiLineText(text, "p", bullet || null, resolveColorKeyword(color) || null);
}

// note는 배지 맥락이지만 \n → · 구분으로 렌더
export function renderNote(text) {
  if (!text) return "";
  return escapeHtml(String(text).split(/\n/).map(s => s.trim()).filter(Boolean).join(" · "));
}

// ── 숏코드별 폰트 크기 오버라이드 헬퍼 ──────────────────────────────
// title-size / desc-size arg 값 처리
//   순수 숫자(0.9)   → 기본값 대비 비율: 0.9 × 기본rem
//   단위 포함(1rem)  → 그대로 절대값으로 사용
export const DEFAULT_TITLE_REM = 1.15;
export const DEFAULT_P_REM     = 0.92;

export function resolveSizeArg(val, defaultRem) {
  if (!val) return null;
  const s = String(val).trim();
  if (/^\d+(\.\d+)?$/.test(s)) return `${(parseFloat(s) * defaultRem).toFixed(3)}rem`;
  return s;
}

export function buildSizeOverrideStyle(argsStr) {
  if (!argsStr) return "";
  const tm = argsStr.match(/title-size=(\S+)/);
  const dm = argsStr.match(/desc-size=(\S+)/);
  const parts = [];
  if (tm) { const v = resolveSizeArg(tm[1], DEFAULT_TITLE_REM); if (v) parts.push(`--size-card-title:${v}`); }
  if (dm) { const v = resolveSizeArg(dm[1], DEFAULT_P_REM);     if (v) parts.push(`--size-card-p:${v}`); }
  return parts.join(';');
}
// ─────────────────────────────────────────────────────────────────
