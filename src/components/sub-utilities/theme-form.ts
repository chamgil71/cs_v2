/**
 * theme-form.ts — 테마 프리셋 빌더 폼의 모양(단일 출처). ThemePresetBuilder 의 상태와
 * PaletteBuilderForm(입력)·PaletteLivePreview(미리보기)가 같은 타입을 쓴다 — 예전엔 두 파일에 따로 선언되어 어긋났다.
 * 키는 config/styles.json 테마 항목의 키와 같다.
 */
export interface ThemeFormShape {
  label: string;
  brand: string;
  brandDark: string;
  brandDeep: string;
  brandLight: string;
  brandMid: string;
  border: string;
  bg: string;
  webFont: string;
  webFontTitle: string;
  pptxFont: string;
  pptxFontTitle: string;
  pptxFontSubTitle: string;
}

/** 색 입력 칸이 되는 키 */
export type ThemeColorKey = 'brand' | 'brandDark' | 'brandDeep' | 'brandLight' | 'brandMid' | 'border' | 'bg';
