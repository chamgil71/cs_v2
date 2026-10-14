import { describe, it, expect } from 'vitest';
import { LAYOUT_ENTRIES, GROUP_KEYS, SHAPE_SET_NAMES, DEFAULT_SHAPE_SET, implSummary, pptgenSummary, exampleVariants, snippetOf, previewMd, matches } from '../lib/layout-library';
import { clientCompileMarkdown, BUNDLED_STYLES } from '../lib/client-compiler';
import { SHORTCODE_DOCS } from '../../config/shortcode-guide';
// @ts-ignore — 순수 JS 생성 모듈
import { LAYOUTS } from '../../scripts/library-map.mjs';

/**
 * 웹 배치 라이브러리(모듈 1) 데이터 — 화면에 보이는 값이 전부 공용 카탈로그에서 오는지, 예시가 실제 렌더러로 그려지는지.
 */
describe('배치 라이브러리 — 카탈로그 그대로', () => {
  it('카탈로그 66종 전부, 카탈로그 순서', () => {
    expect(LAYOUT_ENTRIES.map((e) => e.name)).toEqual(Object.keys(LAYOUTS));
    expect(LAYOUT_ENTRIES.length).toBe(66);
  });
  it('그룹·서식 세트 목록', () => {
    expect(GROUP_KEYS).toContain('grid');
    expect(GROUP_KEYS).toContain('media');
    expect(SHAPE_SET_NAMES).toEqual(['template', 'flat', 'soft', 'outline', 'elevated', 'tinted']);
    expect(SHAPE_SET_NAMES).toContain(DEFAULT_SHAPE_SET);
  });
  it('구현 상태 요약 — 직접 64 · 근사 2(견본)', () => {
    const direct = LAYOUT_ENTRIES.filter((e) => implSummary(e).direct);
    expect(direct.length).toBe(64);
    expect(implSummary(LAYOUT_ENTRIES.find((e) => e.name === 'process.staircase')!).pptx).toBe('근사 — level-grid');
    expect(implSummary(LAYOUT_ENTRIES.find((e) => e.name === 'grid.cards')!).pptx).toBe('모양 그대로');
    expect(pptgenSummary(LAYOUT_ENTRIES.find((e) => e.name === 'grid.box-3')!)).toMatch(/패턴 c01-p13/);
  });
  it('검색 — 기능 이름·설명·옛 이름', () => {
    const find = (q: string) => LAYOUT_ENTRIES.filter((e) => matches(e, q)).map((e) => e.name);
    expect(find('icon-grid')).toEqual(['grid.cards']);   // 옛 이름으로도 찾는다
    expect(find('계단')).toContain('process.staircase');
    expect(find('')).toHaveLength(66);
  });
});

describe('설명은 카탈로그 하나에서 (emoji·desc → 가이드 패널·배치 라이브러리)', () => {
  it('66종 모두 emoji·desc 가 있다', () => {
    expect(LAYOUT_ENTRIES.filter((e) => !e.emoji || !e.desc).map((e) => e.name)).toEqual([]);
  });
  it('가이드 패널(SHORTCODE_DOCS)의 설명·이름 = 카탈로그 값, 칸 안내는 fields·args 에서', () => {
    for (const d of SHORTCODE_DOCS) {
      const e = LAYOUT_ENTRIES.find((x) => x.name === d.key)!;
      expect(d.desc).toBe(e.desc);
      expect(d.name).toBe(`${e.emoji} ${e.label} (${e.name})`);
      for (const f of Object.keys(e.fields)) expect(d.fields).toContain(f);
    }
    expect(SHORTCODE_DOCS.find((d) => d.key === 'process.staircase')!.fields).toContain('인수 grow=1.0~1.6(1.35)');
  });
});

describe('배치 라이브러리 — 예시 미리보기', () => {
  it('스니펫은 기능 이름 블록', () => {
    const e = LAYOUT_ENTRIES.find((x) => x.name === 'data.stats')!;
    expect(exampleVariants(e)).toEqual(['', 'bg=alt']);
    expect(snippetOf(e, 'bg=alt')).toMatch(/^::: data\.stats bg=alt\n- icon/);
  });
  it('머리말에 테마·서식 세트', () => {
    const md = previewMd(LAYOUT_ENTRIES[0], '', 'emerald', 'soft');
    expect(md).toMatch(/^---\ntitle: "grid\.cards"\nstyle: "emerald"\nshape: "soft"\n---/);
  });
  for (const e of LAYOUT_ENTRIES) {
    it(`${e.name} — 예시가 가이드·슬라이드로 그려진다(블록이 남지 않음)`, () => {
      for (const a of exampleVariants(e)) {
        for (const mode of ['html', 'presentation'] as const) {
          const html = clientCompileMarkdown(previewMd(e, a, 'emerald', 'soft'), mode, 'emerald', BUNDLED_STYLES);
          expect(html).toContain('--set-card-bg');   // 서식 세트(soft) 변수가 들어간다
          expect(html.replace(/<pre[\s\S]*?<\/pre>/g, '')).not.toMatch(/^:::\s/m);
        }
      }
    });
  }
});
