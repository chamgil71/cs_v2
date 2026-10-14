/**
 * shortcode-ext/common.mjs — 기능 이름 배치 HTML 렌더러(shortcode-ext/*)의 공용 조각 + 공용 CSS.
 *
 * 렌더러 시그니처: (items, a, h) → HTML 문자열
 *   items = 표준화된 항목(Universal Schema: icon·title·desc·tag·meta·color·note + _alt)
 *   a     = 배치 인수(카탈로그 기본값 < 블록 인수 — library-names.mjs layoutArgs). 기본 수치는 카탈로그에만 둔다.
 *   h     = shortcode-render.mjs 가 넘기는 텍스트 도구 { esc, inline, desc(it), meta(v), color(c) } — 순환 import 를 피한다.
 * 색·글꼴·카드 서식은 전부 var(--*)(테마·서식 세트 변수)로만 — 셸(가이드·프레젠테이션)이 값을 정한다.
 */

/** 카드 클래스 꼬리: 항목 tag: alt → 보조 카드색, 강조 → sx-emph */
export const cls = (it, emph = false) => `${it && it._alt ? " sc-item-alt" : ""}${emph ? " sx-emph" : ""}`;

/** 글 속 첫 숫자(쉼표 무시) — "75년" → 75, "2.5조" → 2.5. 없으면 NaN */
export const num = (v) => {
  const m = String(v ?? "").replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  return m ? parseFloat(m[0]) : NaN;
};

/** 숫자 인수를 범위 안으로(잘못된 값이면 d) */
export const clamp = (v, lo, hi, d) => (Number.isFinite(parseFloat(v)) ? Math.min(hi, Math.max(lo, parseFloat(v))) : d);

/**
 * 원 칸에 넣을 글자: 이모지·짧은 글(이니셜 DA·수치 1억)은 그대로, pptgen 아이콘 라이브러리 키(robot·data_chart 처럼
 * 소문자 영단어)는 HTML 에 그림이 없으므로 빈 값 → 호출 쪽이 번호·기본 기호로 대신한다.
 */
export const glyph = (v) => {
  const s = String(v ?? "").trim();
  return /^[a-z][a-z0-9_]{2,}$/.test(s) ? "" : s;
};

/** 글머리 목록 */
export const bullets = (list, h, extra = "") =>
  list.length ? `<ul class="sx-list${extra}">${list.map((t) => `<li>${h.inline(t)}</li>`).join("")}</ul>` : "";

/** 상자 본문: desc(여러 줄·글머리 규칙은 공용 renderDesc) + meta 글머리 */
export const boxBody = (it, h) => `${it.desc ? h.desc(it) : ""}${bullets(h.meta(it.meta), h)}`;

/** 알약 제목 */
export const pill = (text, h, it) =>
  text ? `<div class="sx-pill"${it && it.color ? ` style="background:${h.esc(h.color(it.color))}"` : ""}>${h.inline(text)}</div>` : "";

/** 머리띠(header 인수) / 결론 띠 */
export const band = (text, h, where = "") => (text ? `<div class="sx-band${where}">${h.inline(text)}</div>` : "");

/** 이미지 자리 — 항목 src 가 있으면 그림, 없으면 프롬프트를 적은 점선 자리 */
export const imageSlot = (it, h, extra = "") => {
  const src = it && (it.src || it.image);
  if (src) return `<figure class="sx-img sx-img-real${extra}"><img src="${h.esc(src)}" alt="${h.esc(it.title || "")}"></figure>`;
  const prompt = (it && (it.prompt || it.desc)) || "";
  return `<figure class="sx-img${extra}"><span class="sx-img-mark">🖼</span>${prompt ? `<figcaption>${h.esc(prompt)}</figcaption>` : ""}</figure>`;
};

export const css = `
  /* ── 기능 이름 배치(shortcode-ext) 공용 ── */
  .sc-item-alt { --set-card-bg: var(--card-alt-bg); }
  .sx-card { background: var(--set-card-bg, var(--card-bg, #fff)); border: var(--card-border-width, 1px) solid var(--card-border-color, var(--border)); border-radius: var(--card-radius, var(--radius)); box-shadow: var(--card-shadow, var(--shadow)); padding: 20px; position: relative; color: var(--text); }
  .sx-card.sx-emph, .sx-emph > .sx-card { border-color: var(--brand); box-shadow: var(--shadow-lg, var(--card-shadow, var(--shadow))); }
  .sx-title { font-family: var(--font-title); font-weight: 800; font-size: calc(var(--size-card-title) * var(--font-scale)); color: var(--text); margin-bottom: 6px; }
  .sx-sub { font-size: calc(var(--size-card-p) * var(--font-scale)); color: var(--text-2); line-height: 1.55; }
  .sx-card p, .sx-sub p { margin: 0; font-size: calc(var(--size-card-p) * var(--font-scale)); color: var(--text-2); line-height: 1.55; }
  .sx-list { list-style: none; margin: 10px 0 0; padding: 0; display: flex; flex-direction: column; gap: 6px; text-align: left; }
  .sx-list li { position: relative; padding-left: 16px; font-size: calc(var(--size-card-p) * var(--font-scale)); color: var(--text-2); line-height: 1.5; }
  .sx-list li::before { content: ""; position: absolute; left: 2px; top: 0.6em; width: 6px; height: 6px; border-radius: 50%; background: var(--brand); }
  .sx-list.sx-check li { padding-left: 22px; }
  .sx-list.sx-check li::before { content: "✓"; width: auto; height: auto; background: none; top: 0; left: 0; color: var(--brand); font-weight: 900; }
  .sx-pill { display: inline-block; padding: 5px 16px; border-radius: 999px; background: var(--brand); color: #fff; font-weight: 800; font-size: calc(var(--size-card-p) * var(--font-scale)); margin-bottom: 10px; }
  .sx-band { margin: 20px 0 12px; padding: 12px 20px; border-radius: var(--card-radius, var(--radius)); background: var(--brand-gradient, var(--brand)); color: #fff; font-weight: 800; text-align: center; font-size: calc(var(--size-card-title) * var(--font-scale)); }
  .sx-band + * { margin-top: 0 !important; }
  .sx-band.sx-band-end { margin: 12px 0 20px; }
  .sx-dot { width: 64px; height: 64px; border-radius: 50%; background: var(--brand); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: calc(1.15rem * var(--font-scale)); flex-shrink: 0; text-align: center; line-height: 1.15; padding: 4px; }
  .sx-dot.sx-dot-soft { background: var(--brand-light); color: var(--brand-dark); }
  .sx-emph .sx-dot, .sx-dot.sx-emph { background: var(--brand-dark); color: #fff; }
  .sx-arrow { color: var(--text-3); font-weight: 900; font-size: calc(1.4rem * var(--font-scale)); display: flex; align-items: center; justify-content: center; }
  .sx-img { margin: 0; min-height: 180px; border: 2px dashed var(--border); border-radius: var(--card-radius, var(--radius)); background: color-mix(in srgb, var(--brand) 5%, transparent); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 16px; color: var(--text-3); text-align: center; }
  .sx-img-mark { font-size: calc(2rem * var(--font-scale)); opacity: 0.6; }
  .sx-img figcaption { font-size: calc(var(--size-card-p) * 0.9 * var(--font-scale)); max-width: 46ch; line-height: 1.45; }
  .sx-img-real { border: none; padding: 0; background: none; overflow: hidden; }
  .sx-img-real img { width: 100%; height: 100%; object-fit: cover; display: block; }
`;
