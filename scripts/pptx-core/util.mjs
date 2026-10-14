/**
 * pptx-core/util.mjs — 색 정리·줄 수 추정·팔레트·글꼴 별칭
 * MD → PPTX 공용 코어의 부분(fs/path 없음). CLI(md-to-pptx.mjs)와 브라우저(src/lib/pptx-browser.ts)가 같은 코어를 부른다.
 * D = 이 변환 한 번의 디자인 설정(config/pptdesign.config.json 복사본 + 테마·머리말 덮어쓰기) — 부르는 쪽이 넘긴다.
 */

export function hexClean(hex) {
  if (!hex) return null;
  hex = (hex + "").replace(/^["']|["']$/g, "").replace(/^#/, "");
  if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
  return hex.length >= 6 ? hex.slice(0, 6).toUpperCase() : null;
}

export function estimateLines(text, widthInch, fontSize) {
  const charsPerLine = Math.max(8, Math.floor(widthInch * 68 / (fontSize * 0.55)));
  return Math.max(1, Math.ceil((text || "").length / charsPerLine));
}

export function makePalette(D, style) {
  const p = D.palette;
  return {
    brand:      hexClean(style.brand)      || "6366F1",
    brandDark:  hexClean(style.brandDark)  || "4338CA",
    brandDeep:  hexClean(style.brandDeep)  || "3730A3",
    brandLight: hexClean(style.brandLight) || "EEF2FF",
    border:     hexClean(style.border)     || "D8DCFB",
    bgDark:     p.bgDark,
    brandMid:   hexClean(style.brandMid)   || hexClean(style.brand) || "6366F1",
    white:      p.white,
    bgLight:    hexClean(style.bg)         || p.white,
    text:       p.text,
    text2:      p.text2,
    muted:      p.muted      || "8892B0",
    mutedLight: p.mutedLight || "CCDDDD",
    codeBg:     p.codeBg,
    codeText:   p.codeText   || "A8B2D8",
  };
}

// alias → 실제 폰트명 resolve (alias 맵에 없으면 원본 그대로 반환)
export function resolveFont(aliases, name) {
  if (!name) return name;
  return aliases[String(name).trim()] || name;
}

// D.slide 의 모든 폰트 필드를 한번에 resolve
export function resolveDFonts(D, aliases) {
  const s = D.slide;
  if (s.font)        s.font        = resolveFont(aliases, s.font);
  if (s.fontTitle)   s.fontTitle   = resolveFont(aliases, s.fontTitle);
  if (s.fontSubTitle)s.fontSubTitle= resolveFont(aliases, s.fontSubTitle);
  if (s.fontMono)    s.fontMono    = resolveFont(aliases, s.fontMono);
}
