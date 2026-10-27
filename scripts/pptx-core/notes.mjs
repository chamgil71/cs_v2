/**
 * pptx-core/notes.mjs — 발표 노트(speaker notes)를 읽기 좋게: 줄마다 문단 · **굵게** (2026-10-26)
 *
 * pptxgenjs addNotes 는 노트 전체를 문단 하나·글 하나(<a:t>)에 줄바꿈째 넣고 md 의 **굵게** 를 별표 그대로 둔다.
 * → 만든 pptx(zip)의 ppt/notesSlides/*.xml 에서 노트 본문 칸(ph type="body")만 골라 줄마다 <a:p>, **…** 는 b="1".
 * pptgen lib/notes_format.py 와 같은 규칙(같은 md 를 두 도구가 똑같이 낸다).
 *
 * 쓰는 법: buildPptx 가 prs 에 붙인다 — exportPresentation 을 감싸므로 writeFile·write(CLI·브라우저) 모두 적용된다.
 */
import JSZip from "jszip";

const BODY_RE = /(<p:sp>(?:(?!<\/p:sp>)[\s\S])*?<p:ph type="body"(?:(?!<\/p:sp>)[\s\S])*?<p:txBody>)([\s\S]*?)(<\/p:txBody>)/g;
const T_RE = /<a:t>([\s\S]*?)<\/a:t>/g;
const BOLD_RE = /\*\*(.+?)\*\*/g;

const unescape = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function runs(line, rpr) {
  const out = [];
  let pos = 0;
  for (const m of line.matchAll(BOLD_RE)) {
    if (m.index > pos) out.push([line.slice(pos, m.index), false]);
    out.push([m[1], true]);
    pos = m.index + m[0].length;
  }
  if (pos < line.length) out.push([line.slice(pos), false]);
  return out.filter(([t]) => t).map(([t, b]) => `<a:r><a:rPr ${rpr}${b ? ' b="1"' : ""}/><a:t>${escape(t)}</a:t></a:r>`).join("");
}

/** 노트 슬라이드 XML 한 장 → 줄마다 문단 · **굵게** (바꿀 게 없으면 그대로) */
export function formatNotesXml(xml) {
  return xml.replace(BODY_RE, (all, head, inner, tail) => {
    const texts = [...inner.matchAll(T_RE)].map((m) => m[1]);
    if (!texts.length) return all;
    const text = unescape(texts.join("")).replace(/\r\n?/g, "\n");   // pptxgenjs 는 줄바꿈을 \r\n 으로 적는다
    if (!text.includes("\n") && !text.includes("**")) return all;
    const lm = inner.match(/<a:rPr ([^/>]*?)\s*\/?>/);
    const rpr = (lm ? lm[1] : 'lang="ko-KR"').replace(' b="1"', "").trim();
    const pre = (inner.match(/^(<a:bodyPr\s*\/>|<a:bodyPr[\s\S]*?<\/a:bodyPr>)?\s*(<a:lstStyle\s*\/>|<a:lstStyle>[\s\S]*?<\/a:lstStyle>)?/) || [""])[0];
    return head + pre + text.split("\n").map((l) => `<a:p>${runs(l, rpr)}<a:endParaRPr ${rpr}/></a:p>`).join("") + tail;
  });
}

/** prs.exportPresentation 을 감싸 노트를 정리한다(writeFile·write 모두 이것을 거친다) */
export function attachNotesFormatter(prs) {
  const orig = prs.exportPresentation;
  if (typeof orig !== "function" || orig.__notesFormatted) return prs;
  const wrapped = async (props = {}) => {
    const buf = await orig.call(prs, { ...props, outputType: "arraybuffer" });
    const zip = await JSZip.loadAsync(buf);
    const names = Object.keys(zip.files).filter((n) => /^ppt\/notesSlides\/[^/]+\.xml$/.test(n));
    for (const n of names) {
      const xml = await zip.file(n).async("string");
      const next = formatNotesXml(xml);
      if (next !== xml) zip.file(n, next);
    }
    const type = props.outputType === "STREAM" ? "nodebuffer" : props.outputType || "blob";
    return zip.generateAsync({ type, compression: props.compression ? "DEFLATE" : "STORE" });
  };
  wrapped.__notesFormatted = true;
  prs.exportPresentation = wrapped;
  return prs;
}
