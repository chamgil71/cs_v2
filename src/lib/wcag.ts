// Relative Luminance for WCAG Contrast
export function getLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return 0;
  const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255;
  const a = [r, g, b].map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrast(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export interface WCAGRating {
  rating: string;
  color: string;
  desc: string;
}

// WCAG Rating Determiner
export function getWCAGRating(contrast: number): WCAGRating {
  if (contrast >= 7.0) {
    return { rating: 'AAA (매우 적합)', color: 'text-emerald-600', desc: '모든 크기의 텍스트 및 본문 텍스트에 아주 가독성이 높습니다.' };
  }
  if (contrast >= 4.5) {
    return { rating: 'AA (적합)', color: 'text-green-600', desc: '일반 크기 본문 텍스트(18pt 미만)용으로 사용하기에 안전합니다.' };
  }
  if (contrast >= 3.0) {
    return { rating: 'AA (큰 텍스트 전용)', color: 'text-amber-500', desc: '제목이나 굵은 글씨 등 큰 텍스트(18pt 또는 14pt Bold 이상)에만 권장합니다.' };
  }
  return { rating: 'Fail (가독성 부족)', color: 'text-rose-600', desc: '배경과 구분이 모호하여 가독성이 떨어집니다. 중요 텍스트에는 피하십시오.' };
}
