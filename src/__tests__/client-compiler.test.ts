import { describe, it, expect } from 'vitest';
import { clientCompileMarkdown, FALLBACK_STYLES } from '../lib/client-compiler';

const STYLE = FALLBACK_STYLES['custom-blue'];
const STYLES = FALLBACK_STYLES;

// ── 헬퍼 ──────────────────────────────────────────────────────────────
function compile(md: string, mode: 'html' | 'presentation' = 'html') {
  return clientCompileMarkdown(md, mode, 'custom-blue', STYLES);
}

// ── FALLBACK_STYLES ────────────────────────────────────────────────────
describe('FALLBACK_STYLES', () => {
  it('최소 1개 이상의 스타일 테마 존재', () => {
    expect(Object.keys(FALLBACK_STYLES).length).toBeGreaterThan(0);
  });

  it('각 테마는 brand, brandDark, brandLight, label 필수 키 포함', () => {
    for (const [key, theme] of Object.entries(FALLBACK_STYLES)) {
      expect(theme, `${key}: brand 누락`).toHaveProperty('brand');
      expect(theme, `${key}: brandDark 누락`).toHaveProperty('brandDark');
      expect(theme, `${key}: brandLight 누락`).toHaveProperty('brandLight');
      expect(theme, `${key}: label 누락`).toHaveProperty('label');
    }
  });

  it('brand 값은 #으로 시작하는 HEX', () => {
    for (const [, theme] of Object.entries(FALLBACK_STYLES)) {
      expect(theme.brand).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});

// ── clientCompileMarkdown: 기본 출력 구조 ─────────────────────────────
describe('clientCompileMarkdown — 기본 출력', () => {
  it('유효한 HTML 문서 반환 (DOCTYPE 포함)', () => {
    const html = compile('# 제목\n\n본문입니다.');
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html');
    expect(html).toContain('</html>');
  });

  it('마크다운 제목이 <h1>로 렌더링', () => {
    const html = compile('# 안녕하세요');
    expect(html).toContain('<h1');
    expect(html).toContain('안녕하세요');
  });

  it('프론트매터 title이 <title> 태그에 반영', () => {
    const md = '---\ntitle: 테스트 가이드\n---\n\n본문';
    const html = compile(md);
    expect(html).toContain('<title>테스트 가이드</title>');
  });

  it('프론트매터 없는 경우 기본 title "Guide" 사용', () => {
    const html = compile('# 그냥 제목\n\n내용');
    expect(html).toContain('<title>Guide</title>');
  });

  it('CSS 변수 --brand가 스타일 색상으로 설정됨', () => {
    const html = compile('내용');
    expect(html).toContain(`--brand:      ${STYLE.brand}`);
  });

  it('스탠드얼론 배너 포함', () => {
    const html = compile('내용');
    expect(html).toContain('standalone-banner');
    expect(html).toContain('Serverless');
  });

  it('XSS 방어: 스크립트 삽입 시 이스케이프', () => {
    const md = '---\ntitle: <script>alert(1)</script>\n---\n\n내용';
    const html = compile(md);
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;');
  });
});

// ── presentation 모드 ──────────────────────────────────────────────────
describe('clientCompileMarkdown — presentation 모드', () => {
  it('slides-container 클래스 포함', () => {
    const html = compile('# 슬라이드 1\n내용\n---\n# 슬라이드 2\n내용', 'presentation');
    expect(html).toContain('slides-container');
  });

  it('slide-page 클래스 존재', () => {
    const html = compile('# 슬라이드 1\n\n---\n\n# 슬라이드 2', 'presentation');
    expect(html).toContain('slide-page');
  });

  it('container 클래스 없음 (presentation은 풀스크린 레이아웃)', () => {
    const html = compile('# 슬라이드', 'presentation');
    expect(html).not.toContain('<div class="container">');
  });
});

// ── 숏코드 렌더링 ──────────────────────────────────────────────────────
describe('clientCompileMarkdown — 숏코드 처리', () => {
  it('icon-grid 숏코드 → icon-grid 클래스 출력', () => {
    const md = `:::icon-grid\n- icon: 🚀\n  title: 빠른 배포\n  desc: CI/CD 자동화\n:::`;
    const html = compile(md);
    expect(html).toContain('icon-grid');
    expect(html).toContain('빠른 배포');
  });

  it('alert-box 숏코드 → border-left 스타일 포함', () => {
    const md = `:::alert-box\n- title: 주의사항\n  desc: 반드시 확인하세요\n:::`;
    const html = compile(md);
    expect(html).toContain('border-left');
    expect(html).toContain('주의사항');
  });

  it('step-list 숏코드 → 번호가 있는 스텝 출력', () => {
    const md = `:::step-list\n- title: 1단계\n  desc: 설치\n- title: 2단계\n  desc: 설정\n:::`;
    const html = compile(md);
    expect(html).toContain('step-list');
    expect(html).toContain('1단계');
    expect(html).toContain('2단계');
  });

  it('compare-split 숏코드 → compare-2col 레이아웃', () => {
    const md = `:::compare-split\n- title: Before\n  desc: 기존\n- title: After\n  desc: 개선\n:::`;
    const html = compile(md);
    expect(html).toContain('compare-2col');
  });

  it('console-box 숏코드 → 다크 배경 pre 블록', () => {
    const md = `:::console-box\n- title: Terminal\n  desc: npm install\n:::`;
    const html = compile(md);
    expect(html).toContain('0F172A');
    expect(html).toContain('npm install');
  });

  it('미등록 숏코드 타입 → Fallback 카드 렌더링', () => {
    const md = `:::unknown-type\n- title: 항목\n  desc: 내용\n:::`;
    const html = compile(md);
    expect(html).toContain('[Shortcode: unknown-type]');
  });

  it('숏코드 XSS: desc에 스크립트 삽입 시 이스케이프', () => {
    const md = `:::alert-box\n- title: 테스트\n  desc: <script>evil()</script>\n:::`;
    const html = compile(md);
    expect(html).not.toContain('<script>evil()');
    expect(html).toContain('&lt;script&gt;');
  });
});

// ── 존재하지 않는 스타일 처리 ─────────────────────────────────────────
describe('clientCompileMarkdown — 스타일 폴백', () => {
  it('존재하지 않는 styleName → custom-blue 폴백 적용', () => {
    const html = clientCompileMarkdown('내용', 'html', 'nonexistent-style', STYLES);
    expect(html).toContain(`--brand:      ${FALLBACK_STYLES['custom-blue'].brand}`);
  });

  it('빈 stylesList → FALLBACK_STYLES 자동 사용', () => {
    const html = clientCompileMarkdown('내용', 'html', 'custom-blue', {});
    expect(html).toContain('--brand:');
  });
});
