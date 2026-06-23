import { describe, it, expect } from 'vitest';
import { getLuminance, getContrast, getWCAGRating } from '../lib/wcag';

describe('getLuminance', () => {
  it('흰색(#FFFFFF)은 상대 휘도 1.0', () => {
    expect(getLuminance('#FFFFFF')).toBeCloseTo(1.0, 4);
  });

  it('검정(#000000)은 상대 휘도 0.0', () => {
    expect(getLuminance('#000000')).toBeCloseTo(0.0, 4);
  });

  it('순수 빨강(#FF0000)은 약 0.2126', () => {
    expect(getLuminance('#FF0000')).toBeCloseTo(0.2126, 3);
  });

  it('순수 초록(#00FF00)은 약 0.7152', () => {
    expect(getLuminance('#00FF00')).toBeCloseTo(0.7152, 3);
  });

  it('순수 파랑(#0000FF)은 약 0.0722', () => {
    expect(getLuminance('#0000FF')).toBeCloseTo(0.0722, 3);
  });

  it('# 없이 6자리 hex가 아니면 0 반환', () => {
    expect(getLuminance('invalid')).toBe(0);
    expect(getLuminance('')).toBe(0);
  });
});

describe('getContrast', () => {
  it('흰배경-검정 텍스트: 대비비 21:1', () => {
    expect(getContrast('#FFFFFF', '#000000')).toBeCloseTo(21, 0);
  });

  it('동일 색상: 대비비 1:1', () => {
    expect(getContrast('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 4);
  });

  it('대칭성: (a,b) === (b,a)', () => {
    const ab = getContrast('#2789F5', '#FFFFFF');
    const ba = getContrast('#FFFFFF', '#2789F5');
    expect(ab).toBeCloseTo(ba, 8);
  });

  it('브랜드 블루 #2789F5와 흰색: AA 기준 4.5 충족 여부 확인', () => {
    const ratio = getContrast('#2789F5', '#FFFFFF');
    expect(ratio).toBeGreaterThan(1);
    expect(ratio).toBeLessThan(21);
  });
});

describe('getWCAGRating', () => {
  it('7.0 이상: AAA', () => {
    const r = getWCAGRating(7.0);
    expect(r.rating).toContain('AAA');
    expect(r.color).toContain('emerald');
  });

  it('4.5 이상 7.0 미만: AA', () => {
    const r = getWCAGRating(5.2);
    expect(r.rating).toContain('AA');
    expect(r.color).toContain('green');
  });

  it('3.0 이상 4.5 미만: AA (큰 텍스트 전용)', () => {
    const r = getWCAGRating(3.5);
    expect(r.rating).toContain('AA');
    expect(r.desc).toContain('큰 텍스트');
  });

  it('3.0 미만: Fail', () => {
    const r = getWCAGRating(1.5);
    expect(r.rating).toContain('Fail');
    expect(r.color).toContain('rose');
  });

  it('경계값 7.0 정확히: AAA', () => {
    expect(getWCAGRating(7.0).rating).toContain('AAA');
  });

  it('경계값 4.5 정확히: AA', () => {
    expect(getWCAGRating(4.5).rating).toContain('AA');
    expect(getWCAGRating(4.5).rating).not.toContain('AAA');
  });

  it('경계값 3.0 정확히: AA (큰 텍스트)', () => {
    expect(getWCAGRating(3.0).rating).toContain('AA');
    expect(getWCAGRating(3.0).desc).toContain('큰 텍스트');
  });

  it('항상 rating, color, desc 세 필드 반환', () => {
    for (const val of [1.0, 3.0, 4.5, 7.0, 10.0]) {
      const r = getWCAGRating(val);
      expect(r).toHaveProperty('rating');
      expect(r).toHaveProperty('color');
      expect(r).toHaveProperty('desc');
    }
  });
});
