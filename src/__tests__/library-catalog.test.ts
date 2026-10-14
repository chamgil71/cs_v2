import { describe, it, expect } from 'vitest';
import { renderShortcode } from '../../scripts/shortcode-render.mjs';
import { pptxRegistry } from '../../scripts/pptx-renderers/registry.mjs';
import { LAYOUTS, LAYOUT_ALIASES, ALIAS_ARGS, IMPL_SHORTCODES, PLAIN_FALLBACK, resolveShortcode, stripHeadingAttrs, shortcodeBlockRe } from '../../scripts/library-names.mjs';
import { EXT_RENDERERS } from '../../scripts/shortcode-ext/index.mjs';
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

describe('카탈로그 — 인수 기본값은 값이다(두 도구가 그대로 깔아 쓰므로)', () => {
  it('default 는 빈 값, 숫자, 또는 values 목록 중 하나', () => {
    const json = JSON.parse(fs.readFileSync(path.join(ROOT, 'library/layouts.json'), 'utf8'));
    const bad: string[] = [];
    for (const [k, e] of Object.entries<any>(json.layouts)) for (const [n, a] of Object.entries<any>(e.args || {})) {
      const d = a.default ?? '';
      if (d !== '' && !/^-?\d+(\.\d+)?$/.test(d) && !String(a.values).split('|').includes(d)) bad.push(`${k}.${n}=${d}`);
    }
    expect(bad).toEqual([]);
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
