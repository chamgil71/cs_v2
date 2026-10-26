import { describe, it, expect, vi } from 'vitest';
import { renderShortcode } from '../../scripts/shortcode-render.mjs';
import { LAYOUTS, LAYOUT_EXAMPLES, resolveShortcode, markAltItems, emphOf, layoutArgs } from '../../scripts/library-names.mjs';
import { EXT_RENDERERS, EXT_CSS } from '../../scripts/shortcode-ext/index.mjs';
import { SHORTCODE_CSS } from '../../scripts/shortcode-styles.mjs';
import { helpers } from '../../scripts/pptx-renderers/registry.mjs';
import pptxgen from 'pptxgenjs';
import JSZip from 'jszip';
import fs from 'node:fs';
import path from 'node:path';

/**
 * 인계서 C — cs_v2 에 없던 기능: 기능 이름 배치 전용 HTML(shortcode-ext) + 기존 숏코드의 새 배치 인수 + 항목 tag: alt.
 * 기본 수치(grow·emphasis·badge·connector 기본값)는 카탈로그 args.default 단일 출처 → library-map defaults → layoutArgs.
 */
const ROOT = path.resolve(__dirname, '../..');
const R = (name: string, body: string, args = '') => renderShortcode(name, body, args) as string;
const STEPS = '- icon: "🔍"\n  title: 하나\n  desc: 설명\n- icon: "🛠"\n  title: 둘\n- icon: "🚀"\n  title: 셋';

describe('기능 이름 배치 전용 HTML(shortcode-ext)', () => {
  const own = Object.keys(EXT_RENDERERS);
  it('예전 근사 34종 이상이 전용 렌더러를 가진다', () => expect(own.length).toBeGreaterThanOrEqual(34));
  for (const name of own) {
    it(`${name} — 카탈로그 예시(+변형)가 그려지고 클래스마다 CSS 가 있다`, () => {
      const ex = LAYOUT_EXAMPLES[name];
      for (const args of [ex.args, ...(ex.more || [])]) {
        const html = R(name, ex.body, args || '');
        expect(html).toBeTruthy();
        expect(html).not.toMatch(/undefined|NaN|\[object/);
        // CSS 커버리지 가드: 마크업의 sx-* 클래스가 공용 CSS(SHORTCODE_CSS) 안에 정의되어 있다
        const classes = [...html.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)).filter((c) => c.startsWith('sx-'));
        for (const c of new Set(classes)) expect(SHORTCODE_CSS, `${name}: .${c} CSS 없음`).toContain(`.${c}`);
      }
    });
  }
  it('EXT_CSS 는 SHORTCODE_CSS 에 한 번 들어간다(숏코드 CSS 단일 출처)', () => {
    expect(SHORTCODE_CSS.split(EXT_CSS).length).toBe(2);
  });
  it('글은 이스케이프된다', () => {
    for (const name of own) expect(R(name, '- title: "<script>x</script>"\n  desc: "<b>"\n  meta: "<i>|y"', ''), name).not.toMatch(/<script>|<b>|<i>/);
  });
  it('PPTX 는 예전 근사 그대로(pptx_shortcode)', () => {
    expect(resolveShortcode('process.staircase', '', 'pptx').type).toBe('level-grid');
    expect(resolveShortcode('data.gauge', '', 'pptx').type).toBe('stat-grid');
    expect(resolveShortcode('process.staircase').type).toBe('process.staircase');
  });
});

describe('배치 인수 — 기본값은 카탈로그', () => {
  it('layoutArgs = 카탈로그 기본값 < 블록 인수', () => {
    expect(layoutArgs('process.staircase', '')).toMatchObject({ grow: '1.35', emphasis: 'last' });
    expect(layoutArgs('process.staircase', 'grow=1.1 emphasis=none')).toMatchObject({ grow: '1.1', emphasis: 'none' });
    expect(layoutArgs('process.steps', '').badge).toBe('number');
  });
  it('emphOf — 항목 tag 가 인수보다 우선(pptgen U.emphOf 와 같음)', () => {
    expect(emphOf([{}, {}, {}], 'last')).toEqual([false, false, true]);
    expect(emphOf([{}, {}, {}], '2')).toEqual([false, true, false]);
    expect(emphOf([{ tag: 'highlight' }, {}], 'last')).toEqual([true, false]);
  });
  it('process.track: 기본 connector=line, none 이면 선 없음, 화살표 항목을 넣으면 선 없음', () => {
    expect(R('process.track', STEPS)).toContain('step-flow sf-line');
    expect(R('process.track', STEPS, 'connector=none')).not.toContain('sf-line');
    expect(R('process.track', STEPS + '\n- type: arrow\n- title: 넷')).not.toContain('sf-line');
  });
  it('process.track: badge=number → 01, none → 원 없음 / emphasis=last → 마지막 active', () => {
    expect(R('process.track', STEPS, 'badge=number')).toContain('>01</div>');
    expect(R('process.track', STEPS, 'badge=none')).not.toContain('fs-icon');
    expect(R('process.track', STEPS, 'emphasis=last').match(/step-flow-step active/g)).toHaveLength(1);
    expect(R('process.track', STEPS, 'connector=arrow emphasis=1')).toContain('wf-step active');
  });
  it('process.steps: 기본 번호 1·2·3(예전 그대로), badge=none 이면 번호 원 없음', () => {
    expect(R('process.steps', STEPS)).toContain('<div class="step-num" >1</div>');
    expect(R('process.steps', STEPS, 'badge=none')).not.toContain('step-num');
    expect(R('process.steps', STEPS, 'badge=icon')).toContain('🔍');
  });
  it('grid.cards: badge=none / number, header 머리띠', () => {
    expect(R('grid.cards', STEPS, 'badge=none')).not.toContain('icon-card-icon');
    expect(R('grid.cards', STEPS, 'badge=number')).toContain('>02</div>');
    expect(R('grid.cards', STEPS, 'header="세 가지"')).toMatch(/^<div class="sx-band">세 가지<\/div><div class="icon-grid"/);
    expect(R('compare.pair-summary', STEPS, 'header="결론"')).toMatch(/sx-band sx-band-end">결론<\/div>$/);   // 이 배치만 아래
  });
  it('process.levels: grow 가 1 보다 크면 뒤 카드일수록 높게, 기본(1.0)은 예전 그대로', () => {
    expect(R('process.levels', STEPS)).not.toContain('lv-grow');
    const h = R('process.levels', STEPS, 'grow=1.2 emphasis=last');
    expect(h).toContain('level-grid lv-grow');
    expect(h).toContain('--lv-k:0.694');   // 1.2^-2
    expect(h.match(/level-card highlight/g)).toHaveLength(1);
  });
  it('process.staircase: 카탈로그 기본 grow 1.35·emphasis last', () => {
    const h = R('process.staircase', STEPS);
    expect(h).toContain('--sx-k:0.549');   // 1.35^-2
    expect(h.match(/sx-emph/g)).toHaveLength(1);
    expect(R('process.staircase', STEPS, 'caption="요약"')).toContain('sx-caption">요약');
  });
  it('data.stats emphasis / process.branch connector', () => {
    expect(R('data.stats', STEPS, 'emphasis=first').match(/sx-emph/g)).toHaveLength(1);
    const git = '- title: main\n  tag: "a|b|c"\n  meta: "x|y|z"';
    expect(R('process.branch', git)).toContain('commit-line-segment"');
    expect(R('process.branch', git, 'connector=none')).not.toContain('commit-line-segment');
    expect(R('process.branch', git, 'connector=arrow')).toContain('commit-line-segment gf-arrow');
  });
  it('data.bars: scale sqrt(기본) 와 linear 의 막대 길이가 다르다', () => {
    const b = '- title: A\n  icon: 100\n- title: B\n  icon: 25';
    expect(R('data.bars', b)).toContain('width:50.0%');
    expect(R('data.bars', b, 'scale=linear')).toContain('width:25.0%');
  });
});

describe('항목 tag: alt — 그 카드만 보조 카드색', () => {
  const body = '- title: 하나\n- title: 둘\n  tag: alt';
  it('HTML: 그 항목 카드에만 sc-item-alt, 배지로 그리지 않음', () => {
    for (const name of ['grid.cards', 'grid.columns', 'process.track', 'data.stats', 'grid.box-2', 'compare.main-sub']) {
      const h = R(name, body);
      expect(h.match(/sc-item-alt/g), name).toHaveLength(1);
      expect(h, name).not.toContain('>alt<');
    }
    expect(SHORTCODE_CSS).toContain('.sc-item-alt { --set-card-bg: var(--card-alt-bg); }');
  });
  it('PPTX: 파서가 _alt 로 표시 → helpers.isAltBlock(item, it)', () => {
    const items = markAltItems([{ title: 'a', tag: '' }, { title: 'b', tag: 'alt' }]);
    expect(items[1]).toMatchObject({ _alt: true, tag: '' });
    expect(helpers.isAltBlock({ args: '' }, items[1])).toBe(true);
    expect(helpers.isAltBlock({ args: '' }, items[0])).toBe(false);
    expect(helpers.isAltBlock({ args: 'bg=alt' }, items[0])).toBe(true);
  });
});

describe('브라우저 PPTX — 발표스크립트(notes) 누락 수정', () => {
  it('slide-config notes 가 노트 슬라이드에 들어간다', async () => {
    let buf: any = null;
    const spy = vi.spyOn(pptxgen.prototype as any, 'writeFile').mockImplementation(async function (this: any) { buf = await this.write({ outputType: 'nodebuffer' }); return ''; });
    const { convertMdToPptxBrowser } = await import('../lib/pptx-browser');
    await convertMdToPptxBrowser('---\ntitle: 노트\n---\n# 장\n\n::: slide-config\nnotes: 발표 스크립트 첫 줄\n:::\n\n본문', 'x.pptx', { noCover: true });
    spy.mockRestore();
    const zip = await JSZip.loadAsync(buf);
    const notes = await Promise.all(Object.keys(zip.files).filter((f) => f.startsWith('ppt/notesSlides/') && f.endsWith('.xml')).map((f) => zip.file(f)!.async('string')));
    expect(notes.join('')).toContain('발표 스크립트 첫 줄');
  });
});

describe('카탈로그 기본값 생성본', () => {
  it('library-map 에 defaults·pptx_shortcode 가 있다(카탈로그와 같음)', () => {
    const json = JSON.parse(fs.readFileSync(path.join(ROOT, 'library/layouts.json'), 'utf8'));
    for (const [k, v] of Object.entries<any>(json.layouts)) {
      const d = Object.fromEntries(Object.entries<any>(v.args || {}).filter(([, a]) => a.default !== '' && a.default != null).map(([a, x]) => [a, String(x.default)]));
      expect(LAYOUTS[k].defaults, k).toEqual(d);
    }
  });
});

describe('media.video — 영상·그림 화면(2026-10-26, pptgen 과 같은 카탈로그 배치)', () => {
  it('유튜브 → iframe(start·end), 쇼츠 t= 는 시작, 파일 → video #t, 그림 → img', () => {
    const yt = R('media.video', '- url: https://www.youtube.com/watch?v=TsiNuMoqg-Y\n  title: 시험', 'start=0:15 end=0:45');
    expect(yt).toContain('src="https://www.youtube.com/embed/TsiNuMoqg-Y?start=15&amp;end=45"');
    expect(yt).toContain('allowfullscreen');
    const many = R('media.video', '- url: https://youtu.be/YFwx_VFFxSE?t=12\n- url: ./a.mp4\n- url: ./b.jpg', 'cols=3 end=30');
    expect(many).toContain('embed/YFwx_VFFxSE?start=12&amp;end=30');
    expect(many).toContain('<video controls preload="metadata" src="./a.mp4#t=0,30"');
    expect(many).toContain('<img src="./b.jpg"');
    expect(many).toContain('--sx-video-cols: 3');
  });
});
