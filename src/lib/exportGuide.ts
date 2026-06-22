import pptxgen from "pptxgenjs";
import html2canvas from "html2canvas";

/* =========================================================
 *  PDF — 브라우저 인쇄 사용 (원본 디자인 100% 유지, 텍스트 검색 가능)
 * ========================================================= */

export function printGuideIframe(iframe: HTMLIFrameElement, docTitle: string) {
  const win = iframe.contentWindow;
  const doc = iframe.contentDocument;
  if (!win || !doc) throw new Error("가이드 문서를 불러오지 못했습니다.");

  const STYLE_ID = "__guide-print-style__";
  if (!doc.getElementById(STYLE_ID)) {
    const style = doc.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      @media print {
        @page { size: A4; margin: 12mm; }
        html, body {
          background: #fff !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .section, .card, .model-card, .feature-card, .tool-card,
        .tip-card, .step, table, pre, blockquote, figure {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        h1, h2, h3 { break-after: avoid; page-break-after: avoid; }
      }
    `;
    doc.head.appendChild(style);
  }

  const prevTitle = doc.title;
  doc.title = `${docTitle} 가이드`;
  try {
    win.focus();
    win.print();
  } finally {
    setTimeout(() => { doc.title = prevTitle; }, 1000);
  }
}

/* =========================================================
 *  PPTX — 가이드 전체를 캡처해 16:9 슬라이드로 분할
 * ========================================================= */

const SLIDE_W_IN = 13.333;
const SLIDE_H_IN = 7.5;
const DPI = 96;
const SLIDE_PX_W = Math.round(SLIDE_W_IN * DPI); // 1280
const SLIDE_PX_H = Math.round(SLIDE_H_IN * DPI); // 720

/** 섹션 한 개를 16:9 슬라이드 한 장에 맞춰 그린다(가로 폭 채움, 세로는 비율 유지). */
function fitToSlide(srcCanvas: HTMLCanvasElement): string {
  const out = document.createElement("canvas");
  out.width = SLIDE_PX_W;
  out.height = SLIDE_PX_H;
  const ctx = out.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, out.width, out.height);

  // 가로 폭에 맞춰 비례 스케일
  const ratio = out.width / srcCanvas.width;
  const drawH = srcCanvas.height * ratio;

  if (drawH <= out.height) {
    // 세로가 슬라이드보다 짧음 → 상단 정렬, 아래 흰 여백
    ctx.drawImage(srcCanvas, 0, 0, srcCanvas.width, srcCanvas.height,
                  0, 0, out.width, drawH);
  } else {
    // 세로가 더 김 → 슬라이드 높이에 맞춰 추가 축소(비례 유지, 가운데 정렬)
    const ratio2 = out.height / srcCanvas.height;
    const drawW2 = srcCanvas.width * ratio2;
    const dx = (out.width - drawW2) / 2;
    ctx.drawImage(srcCanvas, 0, 0, srcCanvas.width, srcCanvas.height,
                  dx, 0, drawW2, out.height);
  }
  return out.toDataURL("image/jpeg", 0.9);
}

export async function exportIframeToPptx(
  iframe: HTMLIFrameElement,
  docTitle: string,
  fileName: string,
) {
  const doc = iframe.contentDocument;
  const win = iframe.contentWindow;
  if (!doc || !win) throw new Error("가이드 문서를 불러오지 못했습니다.");

  // 가이드 본문 폭을 1280px로 강제 (캡처 동안만)
  const body = doc.body as HTMLElement;
  const prevWidth = body.style.width;
  const prevMaxWidth = body.style.maxWidth;
  body.style.width = `${SLIDE_PX_W}px`;
  body.style.maxWidth = `${SLIDE_PX_W}px`;

  // 분할 단위: hero / section / done-section. 없으면 body 전체.
  let sections = Array.from(
    doc.querySelectorAll<HTMLElement>(
      "section.hero, section.section, section.done-section",
    ),
  );
  if (sections.length === 0) sections = [body];

  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";

  // 표지
  const cover = pres.addSlide();
  cover.background = { color: "0F172A" };
  cover.addShape("rect", {
    x: 0.5, y: 3.0, w: 0.18, h: 1.5,
    fill: { color: "6366F1" }, line: { color: "6366F1" },
  });
  cover.addText(docTitle, {
    x: 0.9, y: 3.0, w: 11.5, h: 1.0,
    fontSize: 48, bold: true, color: "FFFFFF", fontFace: "Arial",
  });
  cover.addText("AI 가이드 허브", {
    x: 0.9, y: 4.1, w: 11.5, h: 0.5,
    fontSize: 16, color: "94A3B8", fontFace: "Arial",
  });

  try {
    const total = sections.length;
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      // 섹션을 1280px 폭으로 캡처
      const canvas = await html2canvas(section, {
        backgroundColor: "#ffffff",
        windowWidth: SLIDE_PX_W,
        width: SLIDE_PX_W,
        scale: 1.5,
        useCORS: true,
        logging: false,
      });

      const dataUrl = fitToSlide(canvas);
      const slide = pres.addSlide();
      slide.background = { color: "FFFFFF" };
      slide.addImage({
        data: dataUrl,
        x: 0, y: 0, w: SLIDE_W_IN, h: SLIDE_H_IN,
      });
      slide.addText(`${i + 1} / ${total}`, {
        x: SLIDE_W_IN - 1.2, y: SLIDE_H_IN - 0.35, w: 1.0, h: 0.25,
        fontSize: 9, color: "94A3B8", align: "right", fontFace: "Arial",
      });
    }
  } finally {
    body.style.width = prevWidth;
    body.style.maxWidth = prevMaxWidth;
  }

  await pres.writeFile({ fileName });
}

/* =========================================================
 *  PPTX (편집 가능) — HTML 구조를 파싱해 네이티브 객체로 재조립
 * ========================================================= */

const E = {
  bgDark: "0F172A",
  accent: "6366F1",
  title: "0F172A",
  body: "334155",
  muted: "64748B",
  cardBg: "F8FAFC",
  cardBorder: "E2E8F0",
  codeBg: "0F172A",
  codeText: "E2E8F0",
  white: "FFFFFF",
};

const FONT = "Malgun Gothic";
const FONT_MONO = "Consolas";

const MARGIN_X = 0.5;
const CONTENT_W = SLIDE_W_IN - MARGIN_X * 2; // 12.333
const TITLE_Y = 0.45;
const TITLE_H = 0.7;
const BODY_TOP = 1.3;
const BODY_BOTTOM = 7.0; // 페이지 번호 영역 위
const BODY_MAX_H = BODY_BOTTOM - BODY_TOP; // 5.7"

type Block =
  | { kind: "h3"; text: string }
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[]; ordered: boolean }
  | { kind: "card"; title?: string; body: string }
  | { kind: "table"; rows: string[][]; hasHeader: boolean }
  | { kind: "code"; text: string }
  | { kind: "quote"; text: string };

const norm = (s: string | null | undefined) =>
  (s || "").replace(/\s+/g, " ").replace(/\u00a0/g, " ").trim();

function isCardEl(el: Element) {
  const cls = el.className || "";
  if (typeof cls !== "string") return false;
  return /(^|\s)(card|feature-card|tool-card|tip-card|model-card|step|info-card|usecase-card|stat-card|pro-card)(\s|$)/i.test(cls);
}

function blockHeight(b: Block): number {
  // 매우 단순한 추정 (인치 단위)
  switch (b.kind) {
    case "h3": return 0.45;
    case "p": {
      const lines = Math.max(1, Math.ceil(b.text.length / 90));
      return 0.28 * lines + 0.1;
    }
    case "list": {
      const lines = b.items.reduce(
        (acc, t) => acc + Math.max(1, Math.ceil(t.length / 85)),
        0,
      );
      return 0.32 * lines + 0.15;
    }
    case "card": {
      const tLines = b.title ? 1 : 0;
      const bLines = Math.max(1, Math.ceil(b.body.length / 80));
      return 0.35 + 0.3 * tLines + 0.26 * bLines + 0.2;
    }
    case "table": {
      return 0.45 * Math.max(1, b.rows.length) + 0.2;
    }
    case "code": {
      const lines = b.text.split("\n").length;
      return 0.28 * lines + 0.3;
    }
    case "quote": {
      const lines = Math.max(1, Math.ceil(b.text.length / 80));
      return 0.3 * lines + 0.25;
    }
  }
}

/** section 내부를 Block 배열로 파싱 */
function parseSection(section: Element): { title: string; blocks: Block[] } {
  const titleEl = section.querySelector("h1, h2, .section-title");
  const title = norm(titleEl?.textContent) || "";

  const inner = section.querySelector(".section-inner") || section;
  const blocks: Block[] = [];
  const seen = new Set<Element>();
  if (titleEl) seen.add(titleEl);

  const walk = (root: Element) => {
    for (const child of Array.from(root.children)) {
      if (seen.has(child)) continue;
      const tag = child.tagName.toLowerCase();

      // 카드 컨테이너 → 단일 블록
      if (isCardEl(child)) {
        const ct = norm(child.querySelector("h3, h4, strong, .card-title")?.textContent);
        const cb = norm(child.textContent);
        const body = ct ? cb.replace(ct, "").trim() : cb;
        if (cb) blocks.push({ kind: "card", title: ct || undefined, body });
        continue;
      }

      // 카드 그리드 등 → 자식 순회
      const cls = (child.className as string) || "";
      if (
        typeof cls === "string" &&
        /(grid|flex|row|cards|list-wrap|wrap|columns)/i.test(cls) &&
        child.children.length > 0
      ) {
        walk(child);
        continue;
      }

      switch (tag) {
        case "h2":
          // 섹션 내 추가 h2는 무시 (제목으로 이미 사용됨)
          break;
        case "h3":
        case "h4": {
          const t = norm(child.textContent);
          if (t) blocks.push({ kind: "h3", text: t });
          break;
        }
        case "p": {
          const t = norm(child.textContent);
          if (t) blocks.push({ kind: "p", text: t });
          break;
        }
        case "ul":
        case "ol": {
          const items = Array.from(child.querySelectorAll(":scope > li"))
            .map((li) => norm(li.textContent))
            .filter(Boolean);
          if (items.length)
            blocks.push({ kind: "list", items, ordered: tag === "ol" });
          break;
        }
        case "table": {
          const rows: string[][] = [];
          let hasHeader = false;
          const thead = child.querySelector("thead");
          if (thead) {
            hasHeader = true;
            const r = Array.from(thead.querySelectorAll("th, td")).map((c) =>
              norm(c.textContent),
            );
            if (r.length) rows.push(r);
          }
          const trs = child.querySelectorAll("tbody tr, tr");
          trs.forEach((tr) => {
            if (thead && thead.contains(tr)) return;
            const r = Array.from(tr.querySelectorAll("th, td")).map((c) =>
              norm(c.textContent),
            );
            if (r.length) rows.push(r);
          });
          if (rows.length) blocks.push({ kind: "table", rows, hasHeader });
          break;
        }
        case "pre": {
          const t = (child.textContent || "").replace(/\s+$/g, "");
          if (t.trim()) blocks.push({ kind: "code", text: t });
          break;
        }
        case "blockquote": {
          const t = norm(child.textContent);
          if (t) blocks.push({ kind: "quote", text: t });
          break;
        }
        default: {
          // 컨테이너성 div/section → 재귀
          if (child.children.length > 0) walk(child);
          else {
            const t = norm(child.textContent);
            if (t) blocks.push({ kind: "p", text: t });
          }
        }
      }
    }
  };

  walk(inner);
  return { title, blocks };
}

/** 슬라이드 제목 + 좌측 컬러바를 그린다 */
function drawSlideHeader(slide: pptxgen.Slide, title: string, suffix?: string) {
  slide.addShape("rect" as never, {
    x: MARGIN_X, y: TITLE_Y + 0.05, w: 0.12, h: TITLE_H - 0.1,
    fill: { color: E.accent }, line: { color: E.accent },
  });
  slide.addText(title + (suffix ? `  ${suffix}` : ""), {
    x: MARGIN_X + 0.25, y: TITLE_Y, w: CONTENT_W - 0.25, h: TITLE_H,
    fontSize: 28, bold: true, color: E.title, fontFace: FONT,
    valign: "middle",
  });
}

function drawPageNumber(slide: pptxgen.Slide, current: number, total: number) {
  slide.addText(`${current} / ${total}`, {
    x: SLIDE_W_IN - 1.2, y: SLIDE_H_IN - 0.35, w: 1.0, h: 0.25,
    fontSize: 9, color: E.muted, align: "right", fontFace: FONT,
  });
}

/** Block 하나를 슬라이드의 (x, y) 위치에 그리고, 사용한 높이를 반환 */
function drawBlock(slide: pptxgen.Slide, b: Block, y: number): number {
  const x = MARGIN_X;
  const w = CONTENT_W;
  const h = blockHeight(b);

  switch (b.kind) {
    case "h3":
      slide.addText(b.text, {
        x, y, w, h,
        fontSize: 18, bold: true, color: E.title, fontFace: FONT,
      });
      break;
    case "p":
      slide.addText(b.text, {
        x, y, w, h,
        fontSize: 13, color: E.body, fontFace: FONT, valign: "top",
      });
      break;
    case "list":
      slide.addText(
        b.items.map((t) => ({
          text: t,
          options: { bullet: b.ordered ? { type: "number" } : true },
        })),
        {
          x, y, w, h,
          fontSize: 13, color: E.body, fontFace: FONT,
          paraSpaceAfter: 4, valign: "top",
        },
      );
      break;
    case "card": {
      slide.addShape("roundRect" as never, {
        x, y, w, h: h - 0.05,
        fill: { color: E.cardBg },
        line: { color: E.cardBorder, width: 1 },
        rectRadius: 0.08,
      });
      let innerY = y + 0.15;
      if (b.title) {
        slide.addText(b.title, {
          x: x + 0.2, y: innerY, w: w - 0.4, h: 0.3,
          fontSize: 14, bold: true, color: E.title, fontFace: FONT,
        });
        innerY += 0.32;
      }
      slide.addText(b.body, {
        x: x + 0.2, y: innerY, w: w - 0.4, h: h - (innerY - y) - 0.15,
        fontSize: 12, color: E.body, fontFace: FONT, valign: "top",
      });
      break;
    }
    case "table": {
      const colW = w / b.rows[0].length;
      const tableRows = b.rows.map((row, ri) =>
        row.map((cell) => ({
          text: cell,
          options: {
            bold: b.hasHeader && ri === 0,
            color: b.hasHeader && ri === 0 ? E.white : E.body,
            fill: { color: b.hasHeader && ri === 0 ? E.accent : E.white },
            fontFace: FONT,
            fontSize: 11,
            valign: "middle" as const,
          },
        })),
      );
      slide.addTable(tableRows, {
        x, y, w,
        colW: Array(b.rows[0].length).fill(colW),
        border: { type: "solid", pt: 0.5, color: E.cardBorder },
      });
      break;
    }
    case "code": {
      slide.addShape("roundRect" as never, {
        x, y, w, h: h - 0.05,
        fill: { color: E.codeBg },
        line: { color: E.codeBg, width: 0 },
        rectRadius: 0.05,
      });
      slide.addText(b.text, {
        x: x + 0.2, y: y + 0.12, w: w - 0.4, h: h - 0.3,
        fontSize: 11, color: E.codeText, fontFace: FONT_MONO,
        valign: "top",
      });
      break;
    }
    case "quote": {
      slide.addShape("rect" as never, {
        x, y, w: 0.08, h: h - 0.05,
        fill: { color: E.accent }, line: { color: E.accent },
      });
      slide.addText(b.text, {
        x: x + 0.25, y, w: w - 0.3, h,
        fontSize: 13, italic: true, color: E.body, fontFace: FONT,
        valign: "top",
      });
      break;
    }
  }
  return h + 0.12; // 블록 사이 여백
}

export async function exportIframeToEditablePptx(
  iframe: HTMLIFrameElement,
  docTitle: string,
  fileName: string,
) {
  const doc = iframe.contentDocument;
  if (!doc) throw new Error("가이드 문서를 불러오지 못했습니다.");

  let sections = Array.from(
    doc.querySelectorAll<HTMLElement>(
      "section.hero, section.section, section.done-section",
    ),
  );
  if (sections.length === 0) sections = [doc.body];

  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";

  // === 표지 ===
  const cover = pres.addSlide();
  cover.background = { color: E.bgDark };
  cover.addShape("rect" as never, {
    x: 0.5, y: 3.0, w: 0.18, h: 1.5,
    fill: { color: E.accent }, line: { color: E.accent },
  });
  cover.addText(docTitle, {
    x: 0.9, y: 3.0, w: 11.5, h: 1.0,
    fontSize: 44, bold: true, color: E.white, fontFace: FONT,
  });
  cover.addText("AI 가이드 허브 · 편집 가능한 PPT", {
    x: 0.9, y: 4.1, w: 11.5, h: 0.5,
    fontSize: 16, color: "94A3B8", fontFace: FONT,
  });

  // === 본문 슬라이드 (실제 페이지 수를 미리 계산하기 위해 두 번 순회는 생략하고,
  //     슬라이드 카운트는 마지막에 모두 채운 뒤 페이지 번호 후처리) ===
  const slidesMeta: { slide: pptxgen.Slide }[] = [];

  for (const section of sections) {
    const { title, blocks } = parseSection(section);
    const slideTitle = title || docTitle;

    if (blocks.length === 0) {
      const slide = pres.addSlide();
      slide.background = { color: E.white };
      drawSlideHeader(slide, slideTitle);
      slidesMeta.push({ slide });
      continue;
    }

    let slide = pres.addSlide();
    slide.background = { color: E.white };
    drawSlideHeader(slide, slideTitle);
    slidesMeta.push({ slide });
    let y = BODY_TOP;
    let partIndex = 1;

    for (const b of blocks) {
      const h = blockHeight(b);
      if (y + h > BODY_TOP + BODY_MAX_H && y > BODY_TOP) {
        // 새 슬라이드
        partIndex += 1;
        slide = pres.addSlide();
        slide.background = { color: E.white };
        drawSlideHeader(slide, slideTitle, `(${partIndex})`);
        slidesMeta.push({ slide });
        y = BODY_TOP;
      }
      const used = drawBlock(slide, b, y);
      y += used;
    }
  }

  // 페이지 번호 (표지 제외)
  const total = slidesMeta.length;
  slidesMeta.forEach(({ slide }, i) => drawPageNumber(slide, i + 1, total));

  await pres.writeFile({ fileName });
}

/* ========== 레거시 호환 (다른 곳에서 import해도 빌드되도록) ========== */

export type Section = { num: string; title: string; bullets: string[] };
export type ParsedGuide = { docTitle: string; subtitle: string; sections: Section[] };

const cleanText = (s: string) =>
  s.replace(/\s+/g, " ").replace(/\u00a0/g, " ").trim();

export function parseGuideHtml(html: string): ParsedGuide {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return {
    docTitle: cleanText(doc.querySelector("h1")?.textContent || "가이드"),
    subtitle: cleanText(doc.querySelector(".subtitle, .lead, header p")?.textContent || ""),
    sections: [],
  };
}
