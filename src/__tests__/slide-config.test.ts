import { describe, it, expect } from 'vitest';
import { parseSlideConfig } from '../../scripts/shortcode-render/parse.mjs';

/**
 * ::: slide-config 의 여러 줄 값(notes: |) — pptgen lib/parse_v2.js parseConfig 와 같은 규칙.
 * 2026-10-26: 빈 줄에서 값이 끝나 그 뒤 노트가 조용히 사라지던 것을 고침(빈 줄 = 문단 나눔).
 */
describe('parseSlideConfig', () => {
  it('notes: | 안의 빈 줄은 문단 나눔이고 뒤 줄도 남는다', () => {
    const cfg = parseSlideConfig(['notes: |', '  첫 줄', '  둘째 줄', '', '  빈 줄 다음', '  Note: 쌍점 있는 줄', '', 'source: https://example.com/news'].join('\n'));
    expect(cfg.notes).toBe('첫 줄\n둘째 줄\n\n빈 줄 다음\nNote: 쌍점 있는 줄');
    expect(cfg.source).toBe('https://example.com/news');
  });
  it("한 줄 값의 '\\n' 은 줄바꿈, 주소의 '/n' 은 그대로", () => {
    const cfg = parseSlideConfig('notes: "가\\n나"\nsource: "a.com/news"');
    expect(cfg.notes).toBe('가\n나');
    expect(cfg.source).toBe('a.com/news');
  });
});
