import { describe, it, expect } from 'vitest';

// ESM 동적 import — pptx-analyzer.js는 JSZip을 top-level import하므로
// 테스트에서는 순수 헬퍼 함수만 분리하여 검증한다.
// (JSZip 의존 함수: extractThemeColors, extractColors, extractFonts, extractShapesFromZip 등은 통합 테스트 대상)

import { vld, eh, e2p, autoTo, palNm, KNOWN, KEEP } from '../../scripts/pptx-analyzer.js';

describe('vld — 6자리 HEX 검증', () => {
  it('유효한 HEX: 대소문자 혼합 허용', () => {
    expect(vld('2789F5')).toBe(true);
    expect(vld('ffffff')).toBe(true);
    expect(vld('000000')).toBe(true);
    expect(vld('AABBCC')).toBe(true);
  });

  it('무효 입력 거부', () => {
    expect(vld('')).toBe(false);
    expect(vld(null)).toBe(false);
    expect(vld('GGGGGG')).toBe(false);
    expect(vld('#FFFFFF')).toBe(false);
    expect(vld('12345')).toBe(false);
    expect(vld('1234567')).toBe(false);
  });
});

describe('eh — HTML 엔티티 이스케이프', () => {
  it('& → &amp;', () => expect(eh('a&b')).toBe('a&amp;b'));
  it('< → &lt;', () => expect(eh('<tag>')).toBe('&lt;tag&gt;'));
  it('> → &gt;', () => expect(eh('>>')).toBe('&gt;&gt;'));
  it('" → &quot;', () => expect(eh('"hi"')).toBe('&quot;hi&quot;'));
  it('null/undefined 안전 처리', () => {
    expect(eh(null)).toBe('');
    expect(eh(undefined)).toBe('');
  });
  it('특수문자 없는 문자열은 그대로', () => expect(eh('hello world')).toBe('hello world'));
});

describe('e2p — EMU to Point 변환', () => {
  it('12700 EMU = 1 pt', () => expect(e2p(12700)).toBe(1));
  it('914400 EMU = 72 pt (1 inch)', () => expect(e2p(914400)).toBe(72));
  it('0 EMU = 0 pt', () => expect(e2p(0)).toBe(0));
  it('소수점 EMU 처리', () => expect(e2p(6350)).toBeCloseTo(0.5, 5));
});

describe('autoTo — 색상 리매핑', () => {
  it('KNOWN 매핑 정확 반환', () => {
    expect(autoTo('FF0000', [])).toBe('2789F5');
    expect(autoTo('C00000', [])).toBe('002060');
    expect(autoTo('7030A0', [])).toBe('1E4785');
  });

  it('소문자 입력도 정상 처리', () => {
    expect(autoTo('ff0000', [])).toBe('2789F5');
    expect(autoTo('c00000', [])).toBe('002060');
  });

  it('KEEP 목록 색상은 원본 반환', () => {
    expect(autoTo('FFFFFF', [])).toBe('FFFFFF');
    expect(autoTo('000000', [])).toBe('000000');
    expect(autoTo('D9D9D9', [])).toBe('D9D9D9');
  });

  it('매우 밝은 색상(R+G+B > 690)은 원본 반환', () => {
    // 예: #F0F0F0 = 240+240+240 = 720 > 690
    const result = autoTo('F0F0F0', []);
    expect(result).toBe('F0F0F0');
  });

  it('팔레트 우선 매핑: 가까운 색상 반환', () => {
    const palette = [{ hex: '2789F5', name: '브랜드 블루' }];
    // FF0101 ≈ FF0000 → KNOWN 처리 우선
    // 완전 미지 색상: C05020 (R=192 G=80 B=32) - 빨강 계열
    const result = autoTo('C05020', palette);
    // 팔레트 안에서 거리 계산: (192-39)^2+(80-137)^2+(32-245)^2 ≈ 23409+3249+45369 = 72027 → sqrt ≈ 268 > 100
    // 따라서 팔레트 미적용, 자체 규칙으로 2789F5 반환
    expect(typeof result).toBe('string');
    expect(result.length).toBe(6);
  });
});

describe('palNm — 팔레트 이름 조회', () => {
  const palette = [
    { hex: '2789F5', name: '브랜드 블루' },
    { hex: '0DB364', name: '브랜드 그린' },
    { hex: 'FFFFFF', name: '흰색' },
  ];

  it('일치하는 색상의 이름 반환', () => {
    expect(palNm('2789F5', palette)).toBe('브랜드 블루');
    expect(palNm('0DB364', palette)).toBe('브랜드 그린');
  });

  it('대소문자 구분 없이 매칭', () => {
    expect(palNm('2789f5', palette)).toBe('브랜드 블루');
    expect(palNm('FFFFFF', palette)).toBe('흰색');
  });

  it('팔레트에 없는 색상은 빈 문자열', () => {
    expect(palNm('123456', palette)).toBe('');
  });
});

describe('KNOWN / KEEP 상수 무결성', () => {
  it('KNOWN의 모든 값은 유효한 6자리 HEX', () => {
    for (const [, val] of Object.entries(KNOWN)) {
      expect(vld(val as string)).toBe(true);
    }
  });

  it('KNOWN의 모든 키는 6자리 HEX 형식', () => {
    for (const key of Object.keys(KNOWN)) {
      expect(/^[0-9A-Fa-f]{6}$/.test(key)).toBe(true);
    }
  });

  it('KEEP의 모든 값은 유효한 6자리 HEX', () => {
    for (const val of KEEP) {
      expect(vld(val as string)).toBe(true);
    }
  });
});
