import { describe, it, expect, vi } from 'vitest';
import pptxgen from 'pptxgenjs';
import JSZip from 'jszip';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildPptx, parseJsonc } from '../../scripts/pptx-core/index.mjs';

/**
 * PPTX 공용 코어(scripts/pptx-core) — 브라우저 PPTX == CLI PPTX 잠금.
 * 예전엔 pptx-browser.ts 가 md-to-pptx.mjs 의 복사본이라 한쪽만 고쳐지며 갈라졌다
 * (브라우저만 title-size/desc-size 무시, 발표 노트 누락, 표지·마무리 글자 크기 하드코딩).
 */
const ROOT = path.resolve(__dirname, '../..');
const cfg = (f: string) => parseJsonc(fs.readFileSync(path.join(ROOT, 'config', f), 'utf8'));
const OPTS = { styles: cfg('styles.json'), design: cfg('pptdesign.config.json'), fontAliases: cfg('font-aliases.json') };

// 갈라졌던 기능을 모두 쓰는 문서: 표지 stats·마무리(done)·블록 크기 인수·slide-config(bg·titleSize·notes)
const DRIFT_MD = [
  '---', 'title: "동치 확인"', 'stats:', '  - value: "66종"', '    label: "배치"',
  'done:', '  title: "끝"', '  subtitle: "부제"', '  ctaLabel: "다음"', '---',
  '# 장 하나', '', '::: slide-config', 'bg: "#F8FAFC"', 'titleSize: 20', 'notes: |', '  발표 첫 줄', '  둘째 줄', ':::', '',
  '::: grid.cards title-size=1.4 desc-size=18pt', '- icon: "⚡"', '  title: "카드"', '  desc: "설명"', ':::', '',
  '# 장 둘', '', '::: process.track', '- title: "가"', '- title: "나"', ':::', '',
].join('\n');

async function slidesXml(buf: Buffer) {
  const zip = await JSZip.loadAsync(buf);
  const names = Object.keys(zip.files).filter((f) => /^ppt\/(slides|notesSlides)\/[^/]+\.xml$/.test(f)).sort();
  return Object.fromEntries(await Promise.all(names.map(async (n) => [n, (await zip.file(n)!.async('string')).replace(/ id="\d+"/g, '')])));
}

async function browserBuf(md: string) {
  let buf: any = null;
  const spy = vi.spyOn(pptxgen.prototype as any, 'writeFile').mockImplementation(async function (this: any) { buf = await this.write({ outputType: 'nodebuffer' }); return ''; });
  const { convertMdToPptxBrowser } = await import('../lib/pptx-browser');
  await convertMdToPptxBrowser(md, 'x.pptx');
  spy.mockRestore();
  return buf as Buffer;
}

async function cliBuf(md: string) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pptx-core-'));
  const src = path.join(dir, 'in.md'), out = path.join(dir, 'out.pptx');
  fs.writeFileSync(src, md);
  const { convertMdToPptx } = await import('../../scripts/md-to-pptx.mjs');
  const log = vi.spyOn(console, 'log').mockImplementation(() => {});
  await convertMdToPptx(src, { out });
  log.mockRestore();
  return fs.readFileSync(out);
}

describe('PPTX 공용 코어 — 브라우저 == CLI', () => {
  for (const [name, md] of [['갈라졌던 기능 묶음', DRIFT_MD], ['showcase.md', fs.readFileSync(path.join(ROOT, 'md_src/showcase/showcase.md'), 'utf8')]] as const) {
    it(`${name}: 슬라이드·노트 XML 이 같다`, async () => {
      const c = await slidesXml(await cliBuf(md));      // 차례로 — 브라우저 쪽은 writeFile 을 잠시 가로챈다
      const b = await slidesXml(await browserBuf(md));
      expect(Object.keys(b).length).toBeGreaterThan(2);
      expect(b).toEqual(c);
    }, 60000);
  }

  it('블록 크기 인수(title-size·desc-size)가 PPTX 에 반영된다', async () => {
    const plain = await slidesXml(await browserBuf(DRIFT_MD.replace(' title-size=1.4 desc-size=18pt', '')));
    const sized = await slidesXml(await browserBuf(DRIFT_MD));
    expect(sized['ppt/slides/slide2.xml']).toContain('sz="1800"');   // desc-size=18pt
    expect(sized['ppt/slides/slide2.xml']).not.toEqual(plain['ppt/slides/slide2.xml']);
  }, 60000);

  it('코어는 넘겨받은 config 를 바꾸지 않는다(섹션 slide-config 가 다음 섹션·다음 변환에 새지 않음)', () => {
    const before = JSON.stringify(OPTS.design);
    const r = buildPptx(DRIFT_MD, OPTS);
    expect(JSON.stringify(OPTS.design)).toBe(before);
    expect(r.D.card.titleSize).toBe(OPTS.design.card.titleSize);   // slide-config titleSize: 20 은 그 섹션에만
  });
});
