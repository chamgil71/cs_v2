import { describe, it, expect } from 'vitest';
// 정본(canonical) 공유 숏코드 렌더러 — guide/presentation/client 가 모두 사용
// @ts-ignore — 순수 JS 공유 모듈
import { renderShortcode } from '../../scripts/shortcode-render.mjs';
// @ts-ignore — 공유 숏코드 CSS (단일 출처)
import { SHORTCODE_CSS } from '../../scripts/shortcode-styles.mjs';
// @ts-ignore
import { pptxRegistry } from '../../scripts/pptx-renderers/registry.mjs';
import { clientCompileMarkdown, FALLBACK_STYLES } from '../lib/client-compiler';
// @ts-ignore — 환경 비의존 코어 (client 가 위임하는 server 코드 경로)
import { buildHtml as guideCore } from '../../scripts/guide-core.mjs';
// @ts-ignore
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

// 각 숏코드의 최소 유효 입력 (정본 25종 + 주요 alias)
const CASES: Record<string, string> = {
  'icon-grid':       '- icon: "⚡"\n  title: "T"\n  desc: "D"',
  'feature-grid':    '- icon: "🧠"\n  title: "T"\n  tag: "핵심"\n  desc: "D"',
  'badge-grid':      '- icon: "🧪"\n  title: "T"\n  tag: "X"',
  'stat-grid':       '- icon: "29"\n  title: "T"\n  desc: "D"',
  'columns-grid':    '- title: "T"\n  desc: "D"\n  note: "N"',
  'plan-grid':       '- title: "Free"\n  tag: "무료"\n  meta: "A|B"\n  note: "시작"',
  'level-grid':      '- title: "L1"\n  desc: "D"\n  meta: "M"\n  note: "N"',
  'step-list':       '- title: "T"\n  desc: "D"',
  'chapter-list':    '- icon: "01"\n  title: "T"\n  desc: "D"\n  tag: "개념"',
  'faq-list':        '- title: "Q?"\n  desc: "A"',
  'tool-list':       '- icon: "💬"\n  title: "T"\n  desc: "D"\n  tag: "무료"\n  meta: "A|B"\n  color: "#10A37F"',
  'step-flow':       '- icon: "🧑"\n  title: "사람"\n  desc: "D"\n  tag: "active"',
  'git-flow':        '- title: "main"\n  tag: "v2"\n  meta: "A|B"\n  color: "#10B981"',
  'alert-box':       '- title: "T"\n  desc: "D"',
  'cmd-box':         '- title: "T"\n  tag: "bash"\n  desc: "npm run x"',
  'console-box':     '- title: "T"\n  desc: "출력"',
  'editor-box':      '- title: "a.js"\n  tag: "javascript"\n  desc: "const x = 1;"',
  'network-box':     '- title: "Core"\n  color: "#EC4899"\n- title: "A"\n  meta: "m"',
  'venn-diagram':    '- title: "A"\n  color: "#6366F1"\n- title: "B"\n  color: "#EC4899"\n- icon: "⭐"\n  desc: "가치"',
  'quadrant-chart':  '- title: "P1"\n  fx: "0.3"\n  fy: "0.7"\n  color: "#6366F1"\n- title: "P2"\n  fx: "0.8"\n  fy: "0.2"\n  color: "#EC4899"',
  'concentric-rings':'- title: "A"\n  color: "#94A3B8"\n- title: "B"\n  icon: "🧠"\n  color: "#1E293B"',
  'summary-box':     '- title: "T"\n  desc: "D"\n  meta: "A|B"',
  'compare-split':   '- title: "Before"\n  meta: "A|B"\n  note: "수동"\n- title: "After"\n  meta: "C|D"\n  note: "자동"',
  'before-after':    '- title: "나쁜"\n  desc: "X"\n- title: "좋은"\n  desc: "Y"',
  'part-banner':     '- icon: "1부"\n  title: "T"\n  desc: "D"\n  tag: "Ch.01"\n  color: "#1a3a5c"',
  'takeaway-banner': '- icon: "💡"\n  title: "Key"\n  desc: "D"',
  'summary-bar':     '- icon: "29"\n  title: "T"',
  'os-tabs':         '- title: "macOS"\n  desc: "brew install node"\n- title: "Windows"\n  desc: "winget install node"',
  // 주요 alias (계속 동작해야 함)
  'compare-grid':    '- title: "T"\n  desc: "D"',
  'workflow-flow':   '- icon: "💡"\n  title: "T"\n  meta: "M"',
  'skill-list':      '- icon: "📄"\n  title: "T"\n  desc: "D"',
  'checkpoint-grid': '- icon: "📐"\n  title: "T"\n  desc: "D"',
  'compare-diff':    '- title: "나쁜"\n  desc: "X"\n- title: "좋은"\n  desc: "Y"',
};

const CANONICAL = [
  'icon-grid','feature-grid','badge-grid','stat-grid','columns-grid','plan-grid','level-grid',
  'step-list','chapter-list','faq-list','tool-list','step-flow','git-flow','alert-box','cmd-box',
  'console-box','editor-box','network-box','summary-box','compare-split','before-after',
  'part-banner','takeaway-banner','summary-bar','os-tabs',
  'venn-diagram','quadrant-chart','concentric-rings',
];

// PPTX 가 별도 렌더러로 처리하지 않고 다른 메커니즘으로 흡수하는 타입(있다면 여기 명시)
const PPTX_EXEMPT = new Set<string>([]);

describe('숏코드 정합성 — 공유 HTML 렌더러 (guide/presentation/standalone 공통)', () => {
  for (const [type, body] of Object.entries(CASES)) {
    it(`${type} → 비어있지 않은 HTML, 에러/undefined 없음`, () => {
      const html = renderShortcode(type, body, '');
      expect(html, `${type}: 빈 출력`).toBeTruthy();
      expect(html.length, `${type}: 너무 짧음`).toBeGreaterThan(10);
      expect(html, `${type}: 'undefined' 노출`).not.toContain('undefined');
      expect(html, `${type}: HTML 태그 없음`).toMatch(/<\w/);
    });
  }
});

describe('숏코드 정합성 — PPTX 레지스트리 커버리지', () => {
  for (const type of CANONICAL) {
    if (PPTX_EXEMPT.has(type)) continue;
    it(`${type} → PPTX 렌더러 등록됨`, () => {
      expect(pptxRegistry.has(type), `${type}: PPTX 렌더러 미등록 (HTML엔 있으나 PPTX 누락 = 드리프트)`).toBe(true);
    });
  }
});

describe('숏코드 정합성 — client-compiler 가 공유 렌더러 사용 (raw ::: 잔존 없음)', () => {
  const styles = FALLBACK_STYLES;
  for (const [type, body] of Object.entries(CASES)) {
    it(`${type} → standalone HTML 컴파일 시 ::: 블록이 렌더됨`, () => {
      const md = `# 제목\n\n::: ${type}\n${body}\n:::\n`;
      const html = clientCompileMarkdown(md, 'html', 'custom-blue', styles);
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
    `---\ntitle: 통합 테스트\nstyle: ai-chat\n---\n\n# 표지\n\n## 본문\n\n` +
    `::: icon-grid\n- icon: "⚡"\n  title: "빠름"\n  desc: "설명"\n:::\n\n` +
    `::: alert-box\n- title: "주의"\n  desc: "확인"\n:::\n`;

  it('html 모드: client 출력 == guide-core 출력', () => {
    const client = clientCompileMarkdown(md, 'html', 'ai-chat', REAL_STYLES);
    const server = guideCore({ raw: md }, { styles: REAL_STYLES, config: REAL_PPT, htmlConfig: REAL_HTML, style: 'ai-chat' }).html;
    expect(norm(client)).toBe(norm(server));
  });

  it('presentation 모드: client 출력 == presentation-core 출력', () => {
    const client = clientCompileMarkdown(md, 'presentation', 'ai-chat', REAL_STYLES);
    const server = presCore([{ raw: md, basename: '' }], { styles: REAL_STYLES, config: REAL_PPT, htmlConfig: REAL_HTML, style: 'ai-chat' }).html;
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

  for (const [type, body] of Object.entries(CASES)) {
    it(`${type} → emit 하는 모든 클래스에 CSS 규칙 존재`, () => {
      const html = String(renderShortcode(type, body, ''));
      const classes = new Set<string>(
        [...html.matchAll(/class="([^"]+)"/g)].flatMap((m: RegExpMatchArray) => m[1].trim().split(/\s+/))
      );
      const missing = [...classes].filter(c => c && !definedClasses.has(c) && !ALLOW.has(c));
      expect(missing, `${type}: CSS 규칙 없는 클래스 → ${missing.join(', ')} (shortcode-styles.mjs 에 추가 필요)`).toEqual([]);
    });
  }
});
