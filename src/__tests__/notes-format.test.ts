import { describe, it, expect } from 'vitest';
import pptxgen from 'pptxgenjs';
import JSZip from 'jszip';
import { formatNotesXml, attachNotesFormatter } from '../../scripts/pptx-core/notes.mjs';

/**
 * 발표 노트 정리(pptx-core/notes.mjs) — 줄마다 문단 · **굵게**. pptgen lib/notes_format.py 와 같은 규칙.
 */
describe('notes formatter', () => {
  it('pptx 노트: 줄마다 <a:p>, **…** 는 b="1", 특수문자는 이스케이프', async () => {
    const prs = new pptxgen();
    prs.addSlide().addNotes('첫 줄\n둘째 줄의 **핵심** & <꺾쇠>\n\n셋째 문단');
    attachNotesFormatter(prs);
    const buf = await prs.write({ outputType: 'nodebuffer' });
    const zip = await JSZip.loadAsync(buf as Buffer);
    const name = Object.keys(zip.files).find((n) => /^ppt\/notesSlides\/notesSlide\d+\.xml$/.test(n))!;
    const xml = await zip.file(name)!.async('string');
    const body = xml.slice(xml.indexOf('type="body"'));
    expect((body.match(/<a:p>/g) || []).length).toBeGreaterThanOrEqual(4);
    expect(body).toContain('b="1"/><a:t>핵심</a:t>');
    expect(body).toContain('&amp; &lt;꺾쇠&gt;');
    expect(body).not.toContain('**');
  });
  it('바꿀 게 없는 노트는 그대로', () => {
    const xml = '<p:sp><p:nvSpPr><p:nvPr><p:ph type="body"/></p:nvPr></p:nvSpPr><p:txBody><a:bodyPr/><a:p><a:r><a:rPr lang="en-US"/><a:t>한 줄</a:t></a:r></a:p></p:txBody></p:sp>';
    expect(formatNotesXml(xml)).toBe(xml);
  });
});
