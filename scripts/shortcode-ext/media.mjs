/**
 * shortcode-ext/media.mjs — 이미지·영상 배치 HTML: media.cards-image · media.banner · media.image(옛 이름 media.full — 카탈로그 별칭, 2026-10-28) · media.video(2026-10-26).
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

// ---- media.video(2026-10-26 — pptgen 과 같은 카탈로그 배치) ----------------------------------------------------
//   항목 url(읽기 호환 src·image): 유튜브 주소 → iframe(embed ?start=&end=) · 영상 파일 → <video>(#t=시작,끝) · 그림 → <img>.
//   구간 start·end = 초(30)·분:초(0:30), 유튜브 주소의 t= 도 시작으로 읽는다(pptgen lib/media_src.js parseTime 과 같은 규칙).
//   HTML 은 브라우저가 end 를 지킨다(PowerPoint 와 다름). play=fullscreen·embed 는 pptx 전용 인수(HTML 은 플레이어 전체 화면 단추).
const YT = /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/i;
const YT_EMBED = "https://www.youtube.com/embed/";   // pptgen config/media.json youtube.embed 와 같은 주소
const VIDEO_EXT = /\.(mp4|m4v|mov|webm|ogg)(?:[?#].*)?$/i;
function parseTime(v) {
  const s = String(v ?? "").trim();
  if (!s) return null;
  if (/^\d+(\.\d+)?$/.test(s)) return +s;
  if (/^\d+(:\d{1,2}){1,2}$/.test(s)) return s.split(":").reduce((a, x) => a * 60 + +x, 0);
  const m = s.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  return m && (m[1] || m[2] || m[3]) ? (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0) : null;
}
const RATIO = { "16:9": "16 / 9", "9:16": "9 / 16", "4:3": "4 / 3", "1:1": "1 / 1" };

function screen(it, a, h) {
  const url = String(it.url || it.src || it.image || "").trim();
  if (!url) return `<div class="sx-video-empty">${h.esc("url 없음")}</div>`;
  const yt = url.match(YT);
  const t = yt ? parseTime((url.split("?")[1] || "").split("&").map((kv) => kv.split("=")).find(([k]) => k === "t" || k === "start")?.[1]) : null;
  const st = parseTime(a.start) ?? t, en = parseTime(a.end);
  const shorts = yt && /\/shorts\//i.test(url);
  const ratio = RATIO[a.ratio] || (shorts ? RATIO["9:16"] : RATIO["16:9"]);
  if (yt) {
    const q = [st != null ? `start=${Math.floor(st)}` : "", en != null ? `end=${Math.ceil(en)}` : ""].filter(Boolean).join("&");
    return `<div class="sx-video-frame" style="aspect-ratio: ${ratio}"><iframe src="${h.esc(YT_EMBED + yt[1] + (q ? `?${q}` : ""))}" title="${h.esc(it.title || "영상")}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
  }
  if (VIDEO_EXT.test(url)) {
    const frag = st != null || en != null ? `#t=${st ?? 0}${en != null ? `,${en}` : ""}` : "";
    return `<div class="sx-video-frame"${RATIO[a.ratio] ? ` style="aspect-ratio: ${ratio}"` : ""}><video controls preload="metadata" src="${h.esc(url + frag)}"${it.poster ? ` poster="${h.esc(it.poster)}"` : ""}></video></div>`;
  }
  return `<div class="sx-video-frame sx-video-img"><img src="${h.esc(url)}" alt="${h.esc(it.title || "")}"></div>`;
}

function video(items, a, h) {
  const cols = Math.max(1, Math.min(3, parseInt(a.cols, 10) || items.length || 1));
  return `<div class="sx-video" style="--sx-video-cols: ${cols}">${items.map((it) => `
    <figure class="sx-video-item">${screen(it, a, h)}${it.title || it.desc ? `<figcaption>${it.title ? `<div class="sx-title">${h.inline(it.title)}</div>` : ""}${it.desc ? h.desc(it) : ""}</figcaption>` : ""}</figure>`).join("")}</div>`;
}

export const renderers = { "media.cards-image": cardsImage, "media.banner": banner, "media.image": full, "media.video": video };

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
  .sx-video { display: grid; grid-template-columns: repeat(var(--sx-video-cols, 1), minmax(0, 1fr)); gap: 20px; margin: 25px 0; justify-items: center; }
  .sx-video-item { margin: 0; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .sx-video-frame { width: 100%; max-height: 70vh; background: var(--text, #111); border: 4px solid var(--text, #111); border-radius: 4px; overflow: hidden; }
  .sx-video-frame[style*="9 / 16"] { width: auto; height: 60vh; }
  .sx-video-frame iframe, .sx-video-frame video, .sx-video-frame img { display: block; width: 100%; height: 100%; border: 0; object-fit: contain; }
  .sx-video-img { background: transparent; border-color: transparent; }
  .sx-video-item figcaption { text-align: center; color: var(--text-3); font-size: calc(var(--size-card-p) * var(--font-scale)); }
  .sx-video-empty { padding: 24px; border: 2px dashed var(--border); color: var(--text-3); text-align: center; }
  @media (max-width: 720px) { .sx-ci { grid-template-columns: 1fr; } .sx-video { grid-template-columns: 1fr; } }
`;
