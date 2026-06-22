/**
 * V2 Design Spec Parser
 * 디자인 지침서(Markdown)를 해석하여 styles.json 규격으로 변환하는 파서 모듈입니다.
 */

export function parseDesignSpec(markdownContent) {
  const result = {
    theme: {
      colors: {
        primary: "#1D4E8F", // 기본값
        primary_dark: "auto",
        primary_mid: "auto",
        accent_bg: "auto",
        table_alt: "auto",
        border: "auto",
        text_body: "#1A1A1A",
        text_muted: "#555555",
        text_on_primary: "#FFFFFF",
        background: "#FFFFFF",
        page_bg: "#F8F9FA"
      },
      fonts: {
        body: "Pretendard",
        heading: "Pretendard",
        google_fonts_url: ""
      }
    }
  };

  const lines = markdownContent.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();

    // 1. 색상 매핑 파싱 (예: primary-brand: #1D4E8F, primary: #1D4E8F, 등)
    const colorMatch = trimmed.match(/(primary(?:-brand|-dark|-mid)?|accent-bg|table-row-alt|border-main|text-body)\s*(?::|는|=)\s*(#[0-9A-Fa-f]{6})/);
    if (colorMatch) {
      const key = colorMatch[1];
      const val = colorMatch[2];

      if (key === "primary" || key === "primary-brand") {
        result.theme.colors.primary = val;
      } else if (key === "primary-dark") {
        result.theme.colors.primary_dark = val;
      } else if (key === "primary-mid") {
        result.theme.colors.primary_mid = val;
      } else if (key === "accent-bg") {
        result.theme.colors.accent_bg = val;
      } else if (key === "table-row-alt") {
        result.theme.colors.table_alt = val;
      } else if (key === "text-body") {
        result.theme.colors.text_body = val;
      }
    }

    // 2. 폰트명 파싱 (예: 본문 폰트: Pretendard, Noto Sans 등)
    const fontMatch = trimmed.match(/(본문\s*폰트|body-font|heading-font|제목\s*폰트)\s*(?::|는|=)\s*([\w\s가-힣\-]+)/);
    if (fontMatch) {
      const key = fontMatch[1];
      const val = fontMatch[2].trim();

      if (key.includes("본문") || key.includes("body")) {
        result.theme.fonts.body = val;
      }
      if (key.includes("제목") || key.includes("heading")) {
        result.theme.fonts.heading = val;
      }
    }
  }

  return result;
}
