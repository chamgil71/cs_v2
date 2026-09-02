export interface ThemeDetails {
  label: string;
  brand: string;
  brandDark: string;
  brandDeep: string;
  brandLight: string;
  brandMid: string;
  bg: string;
  border: string;
  webFont: string;
  webFontTitle: string;
  pptxFont: string;
  pptxFontTitle: string;
  pptxFontSubTitle: string;
}

export const DEFAULT_THEME_FORM: ThemeDetails = {
  label: "",
  brand: "#2563FF",
  brandDark: "#1E71CE",
  brandDeep: "#0F478F",
  brandLight: "#F0F7FF",
  brandMid: "#C7CCFB",
  bg: "#F8F9FE",
  border: "#D8DCFB",
  webFont: "Pretendard, sans-serif",
  webFontTitle: "Pretendard-Bold, sans-serif",
  pptxFont: "Pretendard",
  pptxFontTitle: "Pretendard",
  pptxFontSubTitle: "Pretendard"
};

export const NEW_THEME_TEMPLATE: ThemeDetails = {
  label: "새 테마",
  brand: "#3B82F6",
  brandDark: "#1D4ED8",
  brandDeep: "#1E3A8A",
  brandLight: "#EFF6FF",
  brandMid: "#BFDBFE",
  bg: "#F8FAFC",
  border: "#E2E8F0",
  webFont: "Pretendard, sans-serif",
  webFontTitle: "Pretendard-Bold, sans-serif",
  pptxFont: "Pretendard",
  pptxFontTitle: "Pretendard",
  pptxFontSubTitle: "Pretendard"
};
