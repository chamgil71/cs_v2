import { describe, it, expect } from 'vitest';
// 정본(canonical) 공유 숏코드 렌더러 — guide/presentation/client 가 모두 사용
import { renderShortcode } from '../../scripts/shortcode-render.mjs';
import { SHORTCODE_CSS } from '../../scripts/shortcode-styles.mjs';
import { pptxRegistry } from '../../scripts/pptx-renderers/registry.mjs';
import { resolveShortcode } from '../../scripts/library-names.mjs';
import { clientCompileMarkdown, FALLBACK_STYLES } from '../lib/client-compiler';
import { buildHtml as guideCore } from '../../scripts/guide-core.mjs';
import { buildPresentationHtml as presCore } from '../../scripts/presentation-core.mjs';
import fs from 'node:fs';
import path from 'node:path';

/**
 * 정합성(conformance) 테스트 — 출력물 간 드리프트 방지 (D4).
 *
 * HTML(가이드/프레젠테이션/standalone)은 단일 공유 렌더러 renderShortcode 를 쓰므로
 * 이를 검증하면 3개 HTML 출력이 동시에 보장된다. PPTX 는 별도 렌더러이므로
 * 동일 숏코드가 레지스트리에 등록되어 있는지 별도로 검증한다.
 *
 * 이 테스트가 깨지면: 숏코드를 한 출력에만 추가/변경해 다른 출력과 어긋난 것이다.
 */

// 각 배치의 최소 유효 입력 — 이름은 기능 이름 하나로(공용 카탈로그). 키 = "기능 이름[ 인수]"
const CASES: Record<string, string> = {
  'grid.cards':           '- icon: "⚡"\n  title: "T"\n  desc: "D"',
  'grid.cards align=left':'- icon: "📄"\n  title: "T"\n  desc: "D"',
  'grid.cards align=row': '- icon: "📐"\n  title: "T"\n  desc: "D"',
  'grid.features':        '- icon: "🧠"\n  title: "T"\n  tag: "핵심"\n  desc: "D"',
  'grid.badges':          '- icon: "🧪"\n  title: "T"\n  tag: "X"',
  'data.stats':           '- icon: "29"\n  title: "T"\n  desc: "D"',
  'grid.columns':         '- title: "T"\n  desc: "D"\n  note: "N"',
  'grid.columns variant=plain': '- title: "T"\n  desc: "D"',
  'grid.tiers':           '- title: "Free"\n  tag: "무료"\n  meta: "A|B"\n  note: "시작"',
  'process.levels':       '- title: "L1"\n  desc: "D"\n  meta: "M"\n  note: "N"',
  'process.steps':        '- title: "T"\n  desc: "D"',
  'nav.chapters':         '- icon: "01"\n  title: "T"\n  desc: "D"\n  tag: "개념"',
  'nav.faq':              '- title: "Q?"\n  desc: "A"',
  'grid.list':            '- icon: "💬"\n  title: "T"\n  desc: "D"\n  tag: "무료"\n  meta: "A|B"\n  color: "#10A37F"',
  'process.track':        '- icon: "🧑"\n  title: "사람"\n  desc: "D"\n  tag: "active"',
  'process.track connector=arrow': '- icon: "💡"\n  title: "T"\n  meta: "M"',
  'process.branch':       '- title: "main"\n  tag: "v2"\n  meta: "A|B"\n  color: "#10B981"',
  'text.callout':         '- title: "T"\n  desc: "D"',
  'code.command':         '- title: "T"\n  tag: "bash"\n  desc: "npm run x"',
  'code.console':         '- title: "T"\n  desc: "출력"',
  'code.editor':          '- title: "a.js"\n  tag: "javascript"\n  desc: "const x = 1;"',
  'structure.hub':        '- title: "Core"\n  color: "#EC4899"\n- title: "A"\n  meta: "m"',
  'structure.venn':       '- title: "A"\n  color: "#6366F1"\n- title: "B"\n  color: "#EC4899"\n- icon: "⭐"\n  desc: "가치"',
  'data.quadrant':        '- title: "P1"\n  fx: "0.3"\n  fy: "0.7"\n  color: "#6366F1"\n- title: "P2"\n  fx: "0.8"\n  fy: "0.2"\n  color: "#EC4899"',
  'structure.rings':      '- title: "A"\n  color: "#94A3B8"\n- title: "B"\n  icon: "🧠"\n  color: "#1E293B"',
  'text.summary':         '- title: "T"\n  desc: "D"\n  meta: "A|B"',
  'compare.pair':         '- title: "Before"\n  meta: "A|B"\n  note: "수동"\n- title: "After"\n  meta: "C|D"\n  note: "자동"',
  'compare.before-after': '- title: "나쁜"\n  desc: "X"\n- title: "좋은"\n  desc: "Y"',
  'text.section':         '- icon: "1부"\n  title: "T"\n  desc: "D"\n  tag: "Ch.01"\n  color: "#1a3a5c"',
  'text.takeaway':        '- icon: "💡"\n  title: "Key"\n  desc: "D"',
  'data.summary-bar':     '- icon: "29"\n  title: "T"',
  'nav.tabs':             '- title: "macOS"\n  desc: "brew install node"\n- title: "Windows"\n  desc: "winget install node"',
};
// "기능 이름 인수" → [이름, 인수]
const split = (k: string): [string, string] => { const i = k.indexOf(' '); return i < 0 ? [k, ''] : [k.slice(0, i), k.slice(i + 1)]; };

// PPTX 가 별도 렌더러로 처리하지 않고 다른 메커니즘으로 흡수하는 타입(있다면 여기 명시)
const PPTX_EXEMPT = new Set<string>([]);
// PPTX 레지스트리는 cs_v2 구현 ID 로 찾는다(기능 이름 + 인수 → resolveShortcode → 구현 ID)

describe('숏코드 정합성 — 공유 HTML 렌더러 (guide/presentation/standalone 공통)', () => {
  for (const [key, body] of Object.entries(CASES)) {
    const [type, args] = split(key);
    it(`${key} → 비어있지 않은 HTML, 에러/undefined 없음`, () => {
      const html = renderShortcode(type, body, args);
      expect(html, `${type}: 빈 출력`).toBeTruthy();
      expect(html.length, `${type}: 너무 짧음`).toBeGreaterThan(10);
      expect(html, `${type}: 'undefined' 노출`).not.toContain('undefined');
      expect(html, `${type}: HTML 태그 없음`).toMatch(/<\w/);
    });
  }
});

describe('숏코드 정합성 — PPTX 레지스트리 커버리지', () => {
  for (const key of Object.keys(CASES)) {
    const [name, args] = split(key);
    const impl = resolveShortcode(name, args).type;
    if (PPTX_EXEMPT.has(impl)) continue;
    it(`${key} → PPTX 렌더러(${impl}) 등록됨`, () => {
      expect(pptxRegistry.has(impl), `${key}: PPTX 렌더러 미등록 (HTML엔 있으나 PPTX 누락 = 드리프트)`).toBe(true);
    });
  }
});

describe('숏코드 정합성 — client-compiler 가 공유 렌더러 사용 (raw ::: 잔존 없음)', () => {
  const styles = FALLBACK_STYLES;
  for (const [key, body] of Object.entries(CASES)) {
    const type = split(key)[0];
    it(`${key} → standalone HTML 컴파일 시 ::: 블록이 렌더됨`, () => {
      const md = `# 제목\n\n::: ${key}\n${body}\n:::\n`;
      const html = clientCompileMarkdown(md, 'html', 'sky-blue', styles);
      // 숏코드가 렌더되면 본문에 원문 ':::' 델리미터가 남지 않아야 한다
      const bodyPart = html.split('<body')[1] || html;
      expect(bodyPart, `${type}: 미처리 ::: 블록 잔존`).not.toContain(`::: ${type}`);
    });
  }
});

// ── standalone(client) == server(core) 출력 일치 잠금 ──────────────────
// [파이프라인 통합] client 는 자체 렌더러를 두지 않고 guide-core/presentation-core 에 위임한다.
// 아래 두 테스트가 그 단일화를 코드 레벨에서 고정한다(누군가 client 에 별도 렌더러를 재도입하면 깨짐).
describe('숏코드 정합성 — standalone(client) == server(core) 출력 잠금', () => {
  const ROOT = path.resolve(__dirname, '../..');
  const loadJsonc = (p: string) =>
    JSON.parse(fs.readFileSync(p, 'utf8').replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, ''));
  const REAL_STYLES = loadJsonc(path.join(ROOT, 'config/styles.json'));
  const REAL_PPT = loadJsonc(path.join(ROOT, 'config/pptdesign.config.json'));
  const REAL_HTML = loadJsonc(path.join(ROOT, 'config/htmldesign.config.json'));
  // os-tabs/slide-config 의 비결정 uid 정규화
  const norm = (s: string) => s.replace(/style-[a-z0-9]{5}/g, 'style-UID').replace(/\bt[a-z0-9]{5}-\d+/g, 'tUID');
  const md =
    `---\ntitle: 통합 테스트\nstyle: emerald\n---\n\n# 표지\n\n## 본문\n\n` +
    `::: grid.cards\n- icon: "⚡"\n  title: "빠름"\n  desc: "설명"\n:::\n\n` +
    `::: text.callout\n- title: "주의"\n  desc: "확인"\n:::\n`;

  it('html 모드: client 출력 == guide-core 출력', () => {
    const client = clientCompileMarkdown(md, 'html', 'emerald', REAL_STYLES);
    const server = guideCore({ raw: md }, { styles: REAL_STYLES, config: REAL_PPT, htmlConfig: REAL_HTML, style: 'emerald' }).html;
    expect(norm(client)).toBe(norm(server));
  });

  it('presentation 모드: client 출력 == presentation-core 출력', () => {
    const client = clientCompileMarkdown(md, 'presentation', 'emerald', REAL_STYLES);
    const server = presCore([{ raw: md, basename: '' }], { styles: REAL_STYLES, config: REAL_PPT, htmlConfig: REAL_HTML, style: 'emerald' }).html;
    expect(norm(client)).toBe(norm(server));
  });
});

// ── 숏코드 CSS 커버리지 가드 ────────────────────────────────────────────
// [왜] 기존 "비어있지 않은 HTML" 검사는 '렌더러가 클래스를 emit 하지만 CSS 규칙이 없어
//   unstyled 로 나오는' 결함(badge-grid/faq-list/console-box 사례)을 못 잡았다.
//   렌더러가 내보내는 모든 클래스에 shortcode-styles.mjs 의 CSS 규칙이 존재하는지 검사한다.
describe('숏코드 정합성 — CSS 커버리지 (emit 클래스 = 정의된 CSS)', () => {
  // SHORTCODE_CSS 에 셀렉터로 정의된 클래스명 집합
  const definedClasses = new Set<string>(
    [...SHORTCODE_CSS.matchAll(/\.([a-zA-Z0-9_-]+)/g)].map((m: RegExpMatchArray) => m[1])
  );
  // CSS 규칙 없이 부모 레이아웃/인라인 스타일로 처리되는 구조 래퍼 (의도적 예외)
  const ALLOW = new Set<string>([]);

  for (const [key, body] of Object.entries(CASES)) {
    const [type, args] = split(key);
    it(`${key} → emit 하는 모든 클래스에 CSS 규칙 존재`, () => {
      const html = String(renderShortcode(type, body, args));
      const classes = new Set<string>(
        [...html.matchAll(/class="([^"]+)"/g)].flatMap((m: RegExpMatchArray) => m[1].trim().split(/\s+/))
      );
      const missing = [...classes].filter(c => c && !definedClasses.has(c) && !ALLOW.has(c));
      expect(missing, `${type}: CSS 규칙 없는 클래스 → ${missing.join(', ')} (shortcode-styles.mjs 에 추가 필요)`).toEqual([]);
    });
  }
});
