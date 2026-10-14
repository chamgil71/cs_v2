import { describe, it, expect } from 'vitest';
import { renderShortcode } from '../../scripts/shortcode-render.mjs';
import { helpers } from '../../scripts/pptx-renderers/registry.mjs';
import { shapeSetCss, shapeSetPptx, pickShapeSet } from '../../scripts/shape-set.mjs';
import { SHAPE_SETS } from '../../scripts/library-map.mjs';
import fs from 'node:fs';
import path from 'node:path';

/**
 * 서식 세트(library/shape-sets.json → scripts/shape-set.mjs)·PPTX 선 없음 표기·slide-config 규칙.
 * library-catalog.test.ts 에서 나눔(200줄 규칙) — pptgen 과 같은 약속을 cs_v2 쪽에서 잠근다.
 */
const ROOT = path.resolve(__dirname, '../..');
const BODY = '- icon: "⚡"\n  title: "하나"\n  desc: "설명"\n  meta: "A|B"\n- icon: "🧠"\n  title: "둘"\n  desc: "설명"\n- icon: "✅"\n  title: "셋"\n  desc: "설명"';

describe('서식 세트 — 테마를 따르는 모양 층', () => {
  it('기본값은 template, 캐스케이드는 뒤가 우선, 없는 이름은 기본값', () => {
    expect(pickShapeSet()).toBe(SHAPE_SETS.default);
    expect(pickShapeSet('flat', 'soft')).toBe('soft');
    expect(pickShapeSet('flat', undefined)).toBe('flat');
    expect(pickShapeSet('nope')).toBe(SHAPE_SETS.default);
  });
  it('template 은 보조 카드색만 정한다(외곽선·그림자는 셸 원래 값 → 기존 출력과 같음)', () => {
    const css = shapeSetCss('template');
    expect(css).toContain('--card-alt-bg');
    expect(css).not.toContain('--card-border-width');
    expect(css).not.toContain('--card-shadow');
  });
  it('세트 값은 테마 변수로만 색을 가리킨다(hex 직접 지정 없음)', () => {
    for (const k of Object.keys(SHAPE_SETS.sets)) {
      const css = shapeSetCss(k);
      expect(css.replace(/rgba\([^)]*\)/g, ''), k).not.toMatch(/#[0-9a-fA-F]{3,6}\b(?![^(]*\))/);
    }
  });
  it('bg=alt 블록은 보조 카드색 래퍼로 감싼다(래퍼 CSS 존재)', () => {
    const html = renderShortcode('grid.cards', BODY, 'bg=alt');
    expect(html.startsWith('<div class="sc-bg-alt">')).toBe(true);
    expect(renderShortcode('grid.cards', BODY, '')).not.toContain('sc-bg-alt');
  });
  it('PPTX template 카드 서식 = 렌더러 원래 서식(흰 채움 + 테두리 0.75pt)', () => {
    const pal: any = { white: 'FFFFFF', border: 'D8DCFB', brandLight: 'EEF2FF', bgLight: 'FAFBFD', brand: '2789F5', brandDark: '1A5FB4', text: '1A1A2E' };
    // 테두리 굵기는 config(pptdesign.config.json card.borderWidth)에서 — 코드에 수치 없음
    const D = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/pptdesign.config.json'), 'utf8').replace(/\/\/[^\n]*/g, ''));
    pal.shape = shapeSetPptx('template', pal, { baseBorderWidth: D.card.borderWidth });
    expect(helpers.cardBox(pal, { radius: 0.08 })).toEqual({ rectRadius: 0.08, fill: { color: 'FFFFFF' }, line: { color: 'D8DCFB', width: D.card.borderWidth } });
    expect(helpers.cardBox(pal, { alt: true, radius: 0.08 }).fill.color).not.toBe('FFFFFF');
    pal.shape = shapeSetPptx('elevated', pal);
    expect(helpers.cardBox(pal, { radius: 0.08 }).shadow).toBeTruthy();
    expect(helpers.isAltBlock({ args: 'cols=3 bg=alt' })).toBe(true);
  });
});

describe('PPTX — 선 없음 표기', () => {
  // pptxgenjs 는 line.width 0 을 `width || 1` 로 1pt(#333333) 선으로 쓴다 → 선 없음은 반드시 { type: "none" }
  it('렌더러·변환기 어디에도 line: { width: 0 } 이 없다', () => {
    const files = [
      ...fs.readdirSync(path.join(ROOT, 'scripts/pptx-renderers')).map((f) => path.join('scripts/pptx-renderers', f)),
      ...fs.readdirSync(path.join(ROOT, 'scripts/pptx-core')).map((f) => path.join('scripts/pptx-core', f)),
      'scripts/md-to-pptx.mjs', 'src/lib/pptx-browser.ts', 'scripts/shape-set.mjs',
    ];
    const bad = files.filter((f) => /line:\s*\{\s*width:\s*0\s*\}/.test(fs.readFileSync(path.join(ROOT, f), 'utf8')));
    expect(bad).toEqual([]);
  });
});

describe('slide-config — pptgen 과 같은 규칙', () => {
  it('`key: |` 여러 줄 값과 `\\n` 리터럴이 모두 줄바꿈', async () => {
    const { parseSlideConfig } = await import('../../scripts/shortcode-render.mjs');
    expect(parseSlideConfig('notes: |\n  첫 줄\n  둘째 줄\nsource: 매체')).toEqual({ notes: '첫 줄\n둘째 줄', source: '매체' });
    expect(parseSlideConfig('- notes: "가\\n나"\nbg: "#111"')).toEqual({ notes: '가\n나', bg: '#111' });
  });
});
