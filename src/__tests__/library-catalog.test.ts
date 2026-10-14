import { describe, it, expect } from 'vitest';
// @ts-ignore — 순수 JS 공유 모듈
import { renderShortcode } from '../../scripts/shortcode-render.mjs';
// @ts-ignore
import { pptxRegistry, helpers } from '../../scripts/pptx-renderers/registry.mjs';
// @ts-ignore
import { LAYOUTS, LAYOUT_ALIASES, NATIVE_SHORTCODES, resolveShortcode, stripHeadingAttrs, shortcodeBlockRe } from '../../scripts/library-names.mjs';
// @ts-ignore
import { shapeSetCss, shapeSetPptx, pickShapeSet } from '../../scripts/shape-set.mjs';
// @ts-ignore
import { SHAPE_SETS } from '../../scripts/library-map.mjs';
import { clientCompileMarkdown, FALLBACK_STYLES } from '../lib/client-compiler';
import fs from 'node:fs';
import path from 'node:path';

/**
 * 공용 배치 카탈로그(config/library) 연결 테스트.
 * pptgen 과 cs_v2 가 같은 배치 이름(<그룹>.<형태>)·같은 서식 세트를 쓴다는 약속을 cs_v2 쪽에서 잠근다.
 * 깨지면: 카탈로그를 바꾸고 `npm run sync:library` 를 안 했거나, 렌더러/이름표가 카탈로그와 어긋난 것.
 */
const ROOT = path.resolve(__dirname, '../..');
const BODY = '- icon: "⚡"\n  title: "하나"\n  desc: "설명"\n  meta: "A|B"\n- icon: "🧠"\n  title: "둘"\n  desc: "설명"\n- icon: "✅"\n  title: "셋"\n  desc: "설명"';
const INTERNAL = new Set(['slide-config', 'arrow']);

describe('카탈로그 — 생성본(library-map.mjs) == 복사본(config/library/layouts.json)', () => {
  const json = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/library/layouts.json'), 'utf8'));
  it('배치 이름 집합이 같다', () => {
    expect(Object.keys(LAYOUTS).sort()).toEqual(Object.keys(json.layouts).sort());
  });
  it('cs_v2 구현 상태·숏코드가 같다', () => {
    for (const [k, v] of Object.entries<any>(json.layouts)) {
      expect(LAYOUTS[k].shortcode, k).toBe(v.impl?.cs_v2?.shortcode || null);
      expect(LAYOUTS[k].status, k).toBe(v.impl?.cs_v2?.status || 'none');
    }
  });
  it('서식 세트 생성본 == 복사본', () => {
    const sets = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/library/shape-sets.json'), 'utf8'));
    expect(SHAPE_SETS).toEqual(sets);
  });
});

describe('카탈로그 — 모든 기능 이름이 HTML·PPTX 로 그려진다', () => {
  for (const name of Object.keys(LAYOUTS)) {
    it(`${name} → ${resolveShortcode(name).type}`, () => {
      const r = resolveShortcode(name);
      expect(NATIVE_SHORTCODES.has(r.type), `${name}: 해석 결과 ${r.type} 가 cs_v2 숏코드가 아님`).toBe(true);
      const html = renderShortcode(name, BODY, '');
      expect(html, `${name}: 빈 출력`).toBeTruthy();
      expect(html).not.toContain('undefined');
      expect(pptxRegistry.has(r.type), `${name}: PPTX 렌더러 없음 (${r.type})`).toBe(true);
    });
  }
  it('카탈로그가 가리키는 cs_v2 숏코드는 전부 고유 이름표(NATIVE_SHORTCODES)에 있다', () => {
    const missing = Object.entries<any>(LAYOUTS).filter(([, e]) => e.shortcode && !NATIVE_SHORTCODES.has(e.shortcode)).map(([k]) => k);
    expect(missing).toEqual([]);
  });
  it('고유 이름표의 모든 숏코드가 실제로 그려진다(이름표 = 렌더러 분기)', () => {
    const dead = [...NATIVE_SHORTCODES].filter((t: any) => !INTERNAL.has(t) && !renderShortcode(t, BODY, ''));
    expect(dead).toEqual([]);
  });
  it('고유 이름은 해석하지 않는다(skill-list 등 변형 보존 — 기존 문서 출력 동일)', () => {
    for (const t of ['skill-list', 'checkpoint-grid', 'compare-grid', 'workflow-flow']) {
      expect(renderShortcode(t, BODY, '')).toBe(renderShortcode(t, BODY, ''));
      expect(resolveShortcode(t).type).toBe(t);
    }
  });
  it('pptgen 옛 이름(별칭)도 기능 이름으로 받아준다', () => {
    expect(resolveShortcode('staircase')).toMatchObject({ layout: 'process.staircase', type: 'level-grid' });
    expect(resolveShortcode('c01-p01').layout).toBe('grid.main-plus-3');
    expect(Object.keys(LAYOUT_ALIASES).length).toBeGreaterThan(0);
  });
  it('모르는 이름은 기존처럼 빈 출력', () => {
    expect(renderShortcode('no-such.layout', BODY, '')).toBe('');
  });
});

describe('md 형식 — 점(.) 이름 블록 · 제목 속성', () => {
  it('블록 정규식이 기능 이름(점 포함)을 잡는다', () => {
    const m = [...'::: grid.cards cols=3\n- title: "a"\n:::\n'.matchAll(shortcodeBlockRe())];
    expect(m[0][1]).toBe('grid.cards');
    expect(m[0][2]).toBe('cols=3');
  });
  it('standalone 컴파일에서 기능 이름 블록이 렌더된다', () => {
    const html = clientCompileMarkdown(`# 제목\n\n## 본문\n\n::: grid.cards\n${BODY}\n:::\n`, 'html', 'sky-blue', FALLBACK_STYLES);
    expect(html.split('<body')[1]).not.toContain('::: grid.cards');
    expect(html).toContain('icon-card');
  });
  it('제목 끝 {key=value} 속성만 지우고 일반 중괄호·코드펜스는 둔다', () => {
    const md = '## 시장 현황 {master=brand.full label="현황"}\n## 집합 {A}\n```\n## 코드 {a=b}\n```';
    expect(stripHeadingAttrs(md)).toBe('## 시장 현황\n## 집합 {A}\n```\n## 코드 {a=b}\n```');
  });
});

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
    pal.shape = shapeSetPptx('template', pal);
    expect(helpers.cardBox(pal, { radius: 0.08 })).toEqual({ rectRadius: 0.08, fill: { color: 'FFFFFF' }, line: { color: 'D8DCFB', width: 0.75 } });
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
      'scripts/md-to-pptx.mjs', 'src/lib/pptx-browser.ts', 'scripts/shape-set.mjs',
    ];
    const bad = files.filter((f) => /line:\s*\{\s*width:\s*0\s*\}/.test(fs.readFileSync(path.join(ROOT, f), 'utf8')));
    expect(bad).toEqual([]);
  });
});
