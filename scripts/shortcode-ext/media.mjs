/**
 * shortcode-ext/media.mjs — 이미지 배치 HTML: media.cards-image · media.banner · media.full.
 * cs_v2 는 이미지를 만들지 않는다: 항목 src(또는 image) 가 있으면 그 그림을, 없으면 프롬프트를 적은 점선 "이미지 자리"를 그린다
 * (pptgen 도 같은 자리에 이미지 프롬프트를 둔다 — 이미지 생성·삽입은 사람/다른 도구 몫).
 *   cards-image: 정보 카드 N + 이미지(side = left|right, 카탈로그 기본 right). 이미지 = src 가 있는 항목, 없으면 빈 자리
 *   banner     : 위 글머리(title) + 아래 넓은 이미지 띠
 *   full       : 이미지 자리 하나(desc = 프롬프트)
 */
import { cls, glyph, imageSlot } from "./common.mjs";

function cardsImage(items, a, h) {
  const img = items.find((it) => it.src || it.image) || {};
  const cards = items.filter((it) => it !== img);
  const col = `<div class="sx-ci-cards">${cards.map((it) => `
      <div class="sx-card sx-ci-card${cls(it)}">
        ${glyph(it.icon) ? `<span class="sx-ci-icon">${h.esc(glyph(it.icon))}</span>` : ""}
        <div><div class="sx-title">${h.inline(it.title)}</div>${it.desc ? h.desc(it) : ""}</div>
      </div>`).join("")}</div>`;
  const pic = imageSlot(img, h, " sx-ci-img");
  return `<div class="sx-ci">${a.side === "left" ? pic + col : col + pic}</div>`;
}

function banner(items, a, h) {
  const img = items.find((it) => it.src || it.image) || {};
  const lines = items.filter((it) => it !== img).map((it) => it.title || it.desc).filter(Boolean);
  return `<div class="sx-banner">
    <ul class="sx-banner-lines">${lines.map((t) => `<li>${h.inline(t)}</li>`).join("")}</ul>
    ${imageSlot(img, h, " sx-banner-img")}
  </div>`;
}

function full(items, a, h) {
  const it = items[0] || {};
  return `<div class="sx-full">${imageSlot(it, h, " sx-full-img")}${it.title ? `<div class="sx-full-cap">${h.inline(it.title)}</div>` : ""}</div>`;
}

export const renderers = { "media.cards-image": cardsImage, "media.banner": banner, "media.full": full };

export const css = `
  .sx-ci { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: 20px; margin: 25px 0; align-items: stretch; }
  .sx-ci-cards { display: flex; flex-direction: column; gap: 12px; }
  .sx-ci-card { display: flex; gap: 14px; align-items: flex-start; padding: 16px 18px; }
  .sx-ci-icon { font-size: calc(1.5rem * var(--font-scale)); }
  .sx-ci-img { min-height: 240px; height: 100%; }
  .sx-banner { margin: 25px 0; }
  .sx-banner-lines { margin: 0 0 16px 1.2em; padding: 0; display: flex; flex-direction: column; gap: 6px; font-weight: 700; color: var(--text); font-size: calc(var(--size-card-title) * var(--font-scale)); }
  .sx-banner-img { min-height: 220px; }
  .sx-full { margin: 25px 0; }
  .sx-full-img { min-height: 340px; }
  .sx-full-cap { margin-top: 8px; text-align: center; color: var(--text-3); font-size: calc(var(--size-card-p) * var(--font-scale)); }
  @media (max-width: 720px) { .sx-ci { grid-template-columns: 1fr; } }
`;
