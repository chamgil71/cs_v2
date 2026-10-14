import { describe, it, expect } from 'vitest';
// @ts-ignore — 순수 JS 공유 모듈
import { renderShortcode } from '../../scripts/shortcode-render.mjs';
// @ts-ignore
import { pptxRegistry, helpers } from '../../scripts/pptx-renderers/registry.mjs';
// @ts-ignore
import { LAYOUTS, LAYOUT_ALIASES, ALIAS_ARGS, IMPL_SHORTCODES, PLAIN_FALLBACK, resolveShortcode, stripHeadingAttrs, shortcodeBlockRe } from '../../scripts/library-names.mjs';
// @ts-ignore
import { EXT_RENDERERS } from '../../scripts/shortcode-ext/index.mjs';
// @ts-ignore
import { shapeSetCss, shapeSetPptx, pickShapeSet } from '../../scripts/shape-set.mjs';
// @ts-ignore
import { SHAPE_SETS } from '../../scripts/library-map.mjs';
import { clientCompileMarkdown, FALLBACK_STYLES } from '../lib/client-compiler';
import fs from 'node:fs';
import path from 'node:path';

/**
 * 공용 배치 카탈로그(library) 연결 테스트.
 * pptgen 과 cs_v2 가 같은 배치 이름(<그룹>.<형태>)·같은 서식 세트를 쓴다는 약속을 cs_v2 쪽에서 잠근다.
 * 깨지면: 카탈로그를 바꾸고 `npm run sync:library` 를 안 했거나, 렌더러/이름표가 카탈로그와 어긋난 것.
 */
const ROOT = path.resolve(__dirname, '../..');
const BODY = '- icon: "⚡"\n  title: "하나"\n  desc: "설명"\n  meta: "A|B"\n- icon: "🧠"\n  title: "둘"\n  desc: "설명"\n- icon: "✅"\n  title: "셋"\n  desc: "설명"';

describe('카탈로그 — 생성본(library-map.mjs) == 복사본(library/layouts.json)', () => {
  const json = JSON.parse(fs.readFileSync(path.join(ROOT, 'library/layouts.json'), 'utf8'));
  it('배치 이름 집합이 같다', () => {
    expect(Object.keys(LAYOUTS).sort()).toEqual(Object.keys(json.layouts).sort());
  });
  it('cs_v2 구현 상태·숏코드가 같다', () => {
    for (const [k, v] of Object.entries<any>(json.layouts)) {
      expect(LAYOUTS[k].shortcode, k).toBe(v.impl?.cs_v2?.shortcode || null);
      expect(LAYOUTS[k].status, k).toBe(v.impl?.cs_v2?.status || 'none');
      expect(LAYOUTS[k].pptx_shortcode, k).toBe(v.impl?.cs_v2?.pptx_shortcode || null);
    }
  });
  it('서식 세트 생성본 == 복사본', () => {
    const sets = JSON.parse(fs.readFileSync(path.join(ROOT, 'library/shape-sets.json'), 'utf8'));
    expect(SHAPE_SETS).toEqual(sets);
  });
});

describe('카탈로그 — 모든 기능 이름이 HTML·PPTX 로 그려진다', () => {
  for (const name of Object.keys(LAYOUTS)) {
    it(`${name} → ${resolveShortcode(name).type}`, () => {
      const r = resolveShortcode(name), p = resolveShortcode(name, '', 'pptx');
      expect(IMPL_SHORTCODES.has(r.type) || !!EXT_RENDERERS[r.type], `${name}: 구현 ID ${r.type} 가 cs_v2 렌더러에 없음`).toBe(true);
      const html = renderShortcode(name, BODY, '');
      expect(html, `${name}: 빈 출력`).toBeTruthy();
      expect(html).not.toContain('undefined');
      expect(html).not.toContain('NaN');
      // PPTX 는 HTML 전용 구현(기능 이름) 대신 카탈로그 pptx_shortcode(빠른 근사) — 옛 숏코드 PPTX 렌더러가 있어야 한다
      expect(IMPL_SHORTCODES.has(p.type), `${name}: PPTX 구현 ID ${p.type} 가 옛 숏코드가 아님`).toBe(true);
      expect(pptxRegistry.has(p.type), `${name}: PPTX 렌더러 없음 (${p.type})`).toBe(true);
    });
  }
  it('카탈로그가 가리키는 구현 ID(shortcode·variants·pptx_shortcode)는 전부 렌더러에 있다', () => {
    const ids = Object.values<any>(LAYOUTS).flatMap((e) => [e.shortcode, e.pptx_shortcode, ...(e.variants || []).map((v: any) => v.shortcode)]).filter(Boolean);
    expect(ids.filter((t) => !IMPL_SHORTCODES.has(t) && !EXT_RENDERERS[t])).toEqual([]);
    expect(Object.values<any>(LAYOUTS).map((e) => e.pptx_shortcode).filter((t) => t && !IMPL_SHORTCODES.has(t))).toEqual([]);
    expect(resolveShortcode('text.avatar', '', 'pptx').type).toBe(PLAIN_FALLBACK);   // 예전(none) PPTX 근사 그대로
  });
  it('기능 이름 구현(shortcode-ext) == 카탈로그에서 구현 ID 가 기능 이름인 배치', () => {
    const own = Object.entries<any>(LAYOUTS).filter(([k, e]) => e.shortcode === k).map(([k]) => k).sort();
    expect(Object.keys(EXT_RENDERERS).sort()).toEqual(own);
  });
  it('구현 ID 표의 모든 항목이 실제로 그려진다(표 = 렌더러 분기)', () => {
    expect([...IMPL_SHORTCODES].filter((t: any) => !renderNativeOk(t))).toEqual([]);
  });
  it('모르는 이름은 기존처럼 빈 출력', () => {
    expect(renderShortcode('no-such.layout', BODY, '')).toBe('');
  });
});

// 구현 ID 를 직접 그려 보기 — 구현 ID 는 별칭이기도 하므로 renderShortcode 로 부르면 기능 이름으로 정규화된 뒤 같은 분기로 간다
const renderNativeOk = (impl: string) => !!renderShortcode(impl, BODY, '');

describe('이름은 하나로 — 옛 이름은 기능 이름 + 인수로 정규화(출력 동일)', () => {
  const csAliases = Object.keys(LAYOUT_ALIASES).filter((a) => !/^c\d\d-p\d\d$/.test(a));
  for (const a of csAliases) {
    const layout = LAYOUT_ALIASES[a];
    const extra = Object.entries<any>(ALIAS_ARGS[a] || {}).map(([k, v]) => `${k}=${v}`).join(' ');
    it(`${a} == ${layout}${extra ? ' ' + extra : ''}`, () => {
      const norm = (h: string) => h.replace(/\bt[a-z0-9]{5}(-\d+)?/g, 'tUID');   // nav.tabs 의 무작위 탭 ID
      expect(norm(renderShortcode(a, BODY, ''))).toBe(norm(renderShortcode(layout, BODY, extra)));
      expect(resolveShortcode(a)).toMatchObject({ layout, alias: a });
    });
  }
  it('모양 차이는 인수로 — 변형이 구현 ID 를 고른다', () => {
    expect(resolveShortcode('grid.columns', 'variant=plain').type).toBe('compare-grid');
    expect(resolveShortcode('grid.columns', '').type).toBe('columns-grid');
    expect(resolveShortcode('process.track', 'connector=arrow').type).toBe('workflow-flow');
    expect(resolveShortcode('process.track', 'connector=none').type).toBe('step-flow');
    expect(resolveShortcode('compare-grid', 'cols=2')).toMatchObject({ layout: 'grid.columns', type: 'compare-grid', args: 'cols=2 variant=plain' });
  });
  it('블록에 쓴 인수가 옛 이름 인수보다 우선', () => {
    expect(resolveShortcode('workflow-flow', 'connector=none').type).toBe('step-flow');
  });
  it('pptgen 옛 이름(구현 ID)도 받아준다', () => {
    expect(resolveShortcode('staircase')).toMatchObject({ layout: 'process.staircase', type: 'process.staircase' });
    expect(resolveShortcode('staircase', '', 'pptx').type).toBe('level-grid');
    expect(resolveShortcode('c01-p01').layout).toBe('grid.main-plus-3');
  });
  it('md_src 에 옛 이름이 남아 있지 않다(npm run migrate:names)', () => {
    const left: string[] = [];
    const walk = (d: string) => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (p.endsWith('.md')) {
      for (const m of fs.readFileSync(p, 'utf8').matchAll(/^\s*\\?:::\s*([A-Za-z0-9_.-]+)/gm)) if (!LAYOUTS[m[1]] && LAYOUT_ALIASES[m[1]]) left.push(`${path.relative(ROOT, p)}: ${m[1]}`);
    } } };
    walk(path.join(ROOT, 'md_src'));
    expect(left).toEqual([]);
  });
  it('text.callout 종류는 variant 또는 첫 위치 인수(다른 인수와 함께 써도 안전)', () => {
    const h = renderShortcode('text.callout', BODY, 'warning bg=alt');
    expect(h).toContain('alert-warn');
    expect(h.startsWith('<div class="sc-bg-alt">')).toBe(true);
    expect(renderShortcode('text.callout', BODY, 'variant=tip')).toContain('alert-tip');
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
      'scripts/md-to-pptx.mjs', 'src/lib/pptx-browser.ts', 'scripts/shape-set.mjs',
    ];
    const bad = files.filter((f) => /line:\s*\{\s*width:\s*0\s*\}/.test(fs.readFileSync(path.join(ROOT, f), 'utf8')));
    expect(bad).toEqual([]);
  });
});

describe('slide-config — pptgen 과 같은 규칙', () => {
  it('`key: |` 여러 줄 값과 `\\n` 리터럴이 모두 줄바꿈', async () => {
    // @ts-ignore
    const { parseSlideConfig } = await import('../../scripts/shortcode-render.mjs');
    expect(parseSlideConfig('notes: |\n  첫 줄\n  둘째 줄\nsource: 매체')).toEqual({ notes: '첫 줄\n둘째 줄', source: '매체' });
    expect(parseSlideConfig('- notes: "가\\n나"\nbg: "#111"')).toEqual({ notes: '가\n나', bg: '#111' });
  });
});
