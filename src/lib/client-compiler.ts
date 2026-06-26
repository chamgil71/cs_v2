// 브라우저에서 gray-matter(코어가 사용) 가 쓰는 Buffer 전역을 먼저 보강 (반드시 코어 import 보다 위).
import './buffer-polyfill';
// [파이프라인 통합] clientCompileMarkdown 은 자체 렌더러를 두지 않고 서버 CLI 와 동일한 환경 비의존 코어에 위임한다:
//   html 모드        → scripts/guide-core.mjs (build-guide 와 공유)
//   presentation 모드 → scripts/presentation-core.mjs (build-presentation 과 공유)
// → standalone(브라우저) 출력 == server(CLI) 출력 을 코드 레벨에서 보장. (docs/plan/presentation-stabilization.md §3)
// 크기 토큰 단일 출처: config/htmldesign.config.json (Node 의 loadJsonWithComments 와 동일하게 주석 제거 후 파싱)
// @ts-ignore — Vite ?raw 로 원문 문자열 import
import htmlDesignRaw from '../../config/htmldesign.config.json?raw';
const HTML_DESIGN: any = (() => {
  try { return JSON.parse(String(htmlDesignRaw).replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')); }
  catch { return {}; }
})();

// [Step 2] 프레젠테이션은 환경 비의존 코어(build-presentation 와 공유)로 생성 → standalone==server.
// @ts-ignore — 순수 JS 코어 모듈
import { buildPresentationHtml } from '../../scripts/presentation-core.mjs';
// @ts-ignore — 가이드 HTML 코어 (build-guide 와 공유, standalone==server)
import { buildHtml as buildGuideHtml } from '../../scripts/guide-core.mjs';
// @ts-ignore — pptdesign config(globalRadius 등) 주입용 원문 import
import pptDesignRaw from '../../config/pptdesign.config.json?raw';
const PPT_DESIGN: any = (() => {
  try { return JSON.parse(String(pptDesignRaw).replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')); }
  catch { return {}; }
})();

// Fallback styles for offline mode
export const FALLBACK_STYLES: Record<string, any> = {
  "custom-blue": {
    "label": "페이퍼로지 커스텀 블루 (테스트 테마)",
    "brand": "#2789F5",
    "brandDark": "#1E71CE",
    "brandDeep": "#0F478F",
    "brandLight": "#F0F7FF",
    "border": "#D2E5FA",
    "bg": "#FAFBFD"
  },
  "ai-chat": {
    "label": "AI 챗봇 (그린)",
    "brand": "#10A37F",
    "brandDark": "#0D8065",
    "brandDeep": "#085C4A",
    "brandLight": "#E6F4F0",
    "border": "#C8E6DF",
    "bg": "#F7FBF9"
  },
  "ai-dev": {
    "label": "AI 개발 도구 (오렌지)",
    "brand": "#D97757",
    "brandDark": "#B85F3F",
    "brandDeep": "#8B4530",
    "brandLight": "#FDF0EB",
    "border": "#F0D4C4",
    "bg": "#FBF7F5"
  },
  "knowledge": {
    "label": "노트 & 지식관리 (퍼플)",
    "brand": "#6366F1",
    "brandDark": "#4F46E5",
    "brandDeep": "#3730A3",
    "brandLight": "#EEF0FE",
    "border": "#D8DCFB",
    "bg": "#F8F9FE"
  },
  "productivity": {
    "label": "생산성 유틸 (블루)",
    "brand": "#1565C0",
    "brandDark": "#0D47A1",
    "brandDeep": "#0A3578",
    "brandLight": "#E3F2FD",
    "border": "#B3E5FC",
    "bg": "#FAFBFD"
  }
};

export function clientCompileMarkdown(md: string, mode: "html" | "presentation", styleName: string, stylesList: any) {
  const resolvedStyles = (stylesList && Object.keys(stylesList).length > 0) ? stylesList : FALLBACK_STYLES;
  if (mode === "presentation") {
    // 슬라이드 분할·페이지 템플릿·CSS·숏코드 렌더 전부 코어가 담당(서버 CLI 와 동일 코드).
    // 원문 md(프론트매터 포함)를 그대로 코어에 넘긴다 — 숏코드 파싱/렌더도 코어가 수행.
    const { html } = buildPresentationHtml(
      [{ raw: md, basename: "" }],
      { styles: resolvedStyles, config: PPT_DESIGN, htmlConfig: HTML_DESIGN, style: styleName }
    );
    return html;
  }
  // [Step 4] 가이드 HTML 도 공유 코어(build-guide 와 동일)로 생성 → standalone html == build-guide.
  const { html } = buildGuideHtml({ raw: md }, { styles: resolvedStyles, config: PPT_DESIGN, htmlConfig: HTML_DESIGN, style: styleName });
  return html;
}
