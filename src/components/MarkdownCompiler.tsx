import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  RefreshCw, 
  Loader2, 
  Monitor, 
  Tablet, 
  Smartphone,
  Save,
  AlertTriangle,
  HelpCircle,
  BookOpen,
  X,
  Copy,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { getContrast } from '../lib/wcag';
import { clientCompileMarkdown, FALLBACK_STYLES } from '../lib/client-compiler';


const downloadFile = (content: string, filename: string, contentType: string) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

interface ShortcodeDoc {
  key: string;
  name: string;
  category: string;
  desc: string;
  fields: string;
  snippet: string;
}

const SHORTCODE_DOCS: ShortcodeDoc[] = [
  {
    key: "compare-split",
    name: "⚖️ 2단 대조 비교 (compare-split)",
    category: "비교 & 대조",
    desc: "두 대상을 좌우로 2단 분할 배치하여 전후 관계나 상세 비교를 렌더링합니다.",
    fields: "title, desc, meta (구분선 | 목록)",
    snippet: `::: compare-split
- title: "Before"
  desc: "기존 수동 렌더링"
  meta: "수동 HTML 태그 관리 | 스타일 일관성 부족"
- title: "After"
  desc: "V2 자동 숏코드"
  meta: "마크다운 기반 시각화 | 동적 높이 및 일관성"
:::`
  },
  {
    key: "compare-diff",
    name: "🔍 Before/After 대조 (compare-diff)",
    category: "비교 & 대조",
    desc: "구 버전 코드나 방법(AS-IS)과 신규 버전(TO-BE)을 단순 명확하게 선형 대조합니다.",
    fields: "title, desc",
    snippet: `::: compare-diff
- title: "AS-IS 구형 코드"
  desc: "legacyCode()"
- title: "TO-BE 신규 코드"
  desc: "modernCode()"
:::`
  },
  {
    key: "compare-grid",
    name: "📋 비교 그리드 (compare-grid)",
    category: "비교 & 대조",
    desc: "여러 항목의 구분값과 설명을 격자(Grid) 카드로 나열하여 비교합니다.",
    fields: "title, desc, color (선택)",
    snippet: `::: compare-grid
- title: "구분 1"
  desc: "설명 1"
- title: "구분 2"
  desc: "설명 2"
:::`
  },
  {
    key: "columns-grid",
    name: "🗂️ 다단 정보 카드 그리드 (columns-grid)",
    category: "비교 & 대조",
    desc: "가로 다단 형태의 깔끔한 다용도 가이드북 레이아웃 카드를 배치합니다.",
    fields: "cols (속성: cols=2), title, desc, meta (선택), color (선택)",
    snippet: `::: columns-grid cols=2
- title: "HTML Guide"
  desc: "가로 다단 형태의 깔끔한 가이드 북 레이아웃"
  meta: "독립 실행 HTML 파일"
- title: "16:9 Slides"
  desc: "발표 및 스크린 공유를 위한 와이드 슬라이드 레이아웃"
  meta: "프레젠테이션 최적화"
:::`
  },
  {
    key: "editor-box",
    name: "🖥️ 에디터 시뮬레이션 (editor-box)",
    category: "코드 & 터미널",
    desc: "코드 에디터 창(예: VS Code)의 외형을 흉내 낸 다크 에뮬레이터 블록입니다.",
    fields: "title (파일명), tag (언어), desc (코드 내용, 멀티라인 | 지원)",
    snippet: `::: editor-box
- title: "filename.js"
  tag: "javascript"
  desc: |
    // 코드 내용
    console.log("Hello, World!");
:::`
  },
  {
    key: "console-box",
    name: "💻 콘솔 출력 (console-box)",
    category: "코드 & 터미널",
    desc: "시스템 명령어나 스크립트 실행 결과를 출력하는 콘솔화면 블록입니다.",
    fields: "title, tag, desc (멀티라인 | 지원)",
    snippet: `::: console-box
- title: "가이드 생성 결과"
  desc: |
    [System] build-guide.mjs 빌드 완료
    [Success] C:\\ai\\cs_v2\\publish\\index.html 생성 성공!
:::`
  },
  {
    key: "cmd-box",
    name: "⌨️ 터미널 명령어 (cmd-box)",
    category: "코드 & 터미널",
    desc: "실행해야 하는 명령어(CLI)를 안내하는 터미널 모형 박스입니다.",
    fields: "title, tag, desc",
    snippet: `::: cmd-box
- title: "V2 서버 구동"
  tag: "bash"
  desc: "npm run dev"
:::`
  },
  {
    key: "network-box",
    name: "🕸️ 네트워크 다이어그램 (network-box)",
    category: "시각 자료 & 흐름",
    desc: "여러 개념 간의 연계성 또는 네트워크 연결 관계를 시각화합니다.",
    fields: "title, meta, color (선택)",
    snippet: `::: network-box
- title: "중앙 핵심 개념"
  color: "#EC4899"
- title: "연결 개념 A"
  meta: "세부 관계"
- title: "연결 개념 B"
  meta: "세부 관계"
:::`
  },
  {
    key: "git-flow",
    name: "🔧 Git Flow 흐름도 (git-flow)",
    category: "시각 자료 & 흐름",
    desc: "Git 브랜치나 버전 릴리즈 흐름을 노드형 다이어그램으로 가시화합니다.",
    fields: "title, tag, meta, color (선택)",
    snippet: `::: git-flow
- title: "main"
  tag: "v2.0.0"
  meta: "초기 버전 | 패치 배포"
  color: "#10B981"
- title: "dev"
  tag: "develop"
  meta: "신규 기능 추가 | 버그 수정"
  color: "#3B82F6"
:::`
  },
  {
    key: "workflow-flow",
    name: "🔄 가로 워크플로우 (workflow-flow)",
    category: "시각 자료 & 흐름",
    desc: "진행되는 단계나 워크플로우 순서를 가로 방향 화살표로 연결해 노출합니다.",
    fields: "icon, title, meta, color (선택)",
    snippet: `::: workflow-flow
- icon: "✏️"
  title: "마크다운 작성"
  meta: "에디터 사용"
- icon: "⚙️"
  title: "V2 컴파일"
  meta: "백엔드 변환"
:::`
  },
  {
    key: "step-flow",
    name: "➡️ 가로 이정표 흐름도 (step-flow)",
    category: "시각 자료 & 흐름",
    desc: "프로젝트 단계 및 활성화 상태(tag: active)를 보여주는 가로형 마일스톤입니다.",
    fields: "icon, title, desc, tag (active 설정 시 강조)",
    snippet: `::: step-flow
- icon: "👨"
  title: "요구사항 정의"
  desc: "기능 정의 및 범위 확정"
  tag: "active"
- icon: "💻"
  title: "시나리오 설계"
  desc: "동선 및 와이어프레임 설계"
:::`
  },
  {
    key: "icon-grid",
    name: "🧩 아이콘 카드 그리드 (icon-grid)",
    category: "콘텐츠 그리드",
    desc: "이모지 아이콘과 제목, 본문 리스트를 동반하는 심플 그리드 영역입니다.",
    fields: "cols (속성: cols=3), bullet (속성: bullet=✔️), icon, title, desc",
    snippet: `::: icon-grid cols=3 bullet=✔️
- icon: "🚀"
  title: "빠른 퍼포먼스"
  desc: "최적화된 빌드와 빌트인 파서 탑재"
- icon: "🎨"
  title: "디자인 테마 선택"
  desc: "다양한 테마 조합 가능"
:::`
  },
  {
    key: "feature-grid",
    name: "⭐ 핵심 기능 카드 그리드 (feature-grid)",
    category: "콘텐츠 그리드",
    desc: "태그 배지 및 아이콘이 포함된 다채로운 핵심 피처 카드 그리드입니다.",
    fields: "cols (속성), icon, title, desc, tag, color (선택)",
    snippet: `::: feature-grid cols=2
- icon: "⚡"
  title: "실시간 미리보기"
  desc: "수정 즉시 빌드 결과를 반영합니다."
  tag: "핵심"
- icon: "📦"
  title: "일괄 변환 기능"
  desc: "전체 폴더를 원클릭으로 변환합니다."
  tag: "실무"
:::`
  },
  {
    key: "tool-list",
    name: "🧰 도구 목록 (tool-list)",
    category: "콘텐츠 그리드",
    desc: "사용 도구나 스펙의 강점을 헤더(아이콘, 제목, 부제)와 기능 목록 형태로 렌더링합니다.",
    fields: "icon, title, desc, tag, meta (목록 구분선 |)",
    snippet: `::: tool-list
- icon: "🛠️"
  title: "Vite"
  desc: "초고속 프론트엔드 빌드 도구"
  meta: "HMR 지원 | 플러그인 생태계"
:::`
  },
  {
    key: "plan-grid",
    name: "💳 요금제 카드 그리드 (plan-grid)",
    category: "콘텐츠 그리드",
    desc: "추천 요금제(tag=Best)나 상품 가격/기능 구성품 스펙을 카드 형태로 비교합니다.",
    fields: "title, tag, meta (목록 구분선 |), featured (true 시 강조), color (선택), note (하단 설명)",
    snippet: `::: plan-grid
- title: "Basic Plan"
  tag: "Free"
  meta: "기본 기능 제공 | 일간 10회 컴파일"
- title: "Premium Plan"
  tag: "Best"
  meta: "모든 숏코드 지원 | 무제한 빌드 및 익스포트"
  featured: "true"
  color: "#3B82F6"
:::`
  },
  {
    key: "badge-grid",
    name: "🏷️ 배지 칩 그리드 (badge-grid)",
    category: "콘텐츠 그리드",
    desc: "여러 장점이나 키워드를 작은 배지 칩으로 콤팩트하게 나열합니다.",
    fields: "icon, title, tag, color (선택)",
    snippet: `::: badge-grid
- icon: "🌟"
  title: "신속성"
  tag: "Fast"
- icon: "🔒"
  title: "보안성"
  tag: "Secure"
:::`
  },
  {
    key: "stat-grid",
    name: "📊 통계 지표 그리드 (stat-grid)",
    category: "콘텐츠 그리드",
    desc: "수치 데이터(icon)와 통계 지표 정보(title, desc)를 상단 바 보더와 함께 시각화합니다.",
    fields: "icon (수치), title, desc, color (선택)",
    snippet: `::: stat-grid
- icon: "99.9%"
  title: "가동 시간"
  desc: "평균 가동률"
- icon: "120ms"
  title: "응답 지연"
  desc: "API 응답 지연"
:::`
  },
  {
    key: "skill-list",
    name: "🎯 스킬 리스트 (skill-list)",
    category: "콘텐츠 그리드",
    desc: "가로 배열 형태로 역량이나 기술 상세 정보를 행 목록으로 배열합니다.",
    fields: "icon, title, desc, bullet (목록 기호), color (선택)",
    snippet: `::: skill-list
- icon: "⚡"
  title: "초고속 로딩"
  desc: "Vite 기반 빌드로 브라우저 첫 렌더링 최적화"
  bullet: "HMR 지원"
:::`
  },
  {
    key: "alert-box",
    name: "⚠️ 경고/알림 박스 (alert-box)",
    category: "정보 & 알림",
    desc: "주의(warning), 팁(tip), 위험(caution) 등의 알림이나 조언 메시지 박스를 렌더링합니다.",
    fields: "title, desc, color (선택)",
    snippet: `::: alert-box tip
- title: "작성 팁"
  desc: "기본 본문은 desc 속성 하위에서 작성해 주세요."
:::`
  },
  {
    key: "summary-box",
    name: "📝 하단 요약 박스 (summary-box)",
    category: "정보 & 알림",
    desc: "가이드 마지막 단에 배치하여 내용을 정리하고, 하단에 다량의 태그 칩을 덧붙입니다.",
    fields: "title, desc, meta (칩 구분선 |), color (선택)",
    snippet: `::: summary-box
- title: "요약정리"
  desc: "시각화 숏코드를 활용하면 핵심 개념을 직관적으로 전달할 수 있습니다."
  meta: "21종 숏코드 | HTML 연동 | PPTX 연동"
:::`
  },
  {
    key: "takeaway-banner",
    name: "💡 핵심 테이크어웨이 (takeaway-banner)",
    category: "정보 & 알림",
    desc: "강조하고 싶은 핵심 교훈이나 테이크어웨이 메시지를 한 줄 배너로 노출합니다.",
    fields: "icon, title, desc",
    snippet: `::: takeaway-banner
- icon: "💡"
  title: "Key Takeaway"
  desc: "숏코드의 진정한 가치는 텍스트 정보의 시각적 컴포넌트 자동화에 있습니다."
:::`
  },
  {
    key: "part-banner",
    name: "🚩 파트/챕터 시작 배너 (part-banner)",
    category: "정보 & 알림",
    desc: "긴 문서나 슬라이드 중 단원/파트의 구분을 나누는 가로 대형 단막 배너입니다.",
    fields: "icon, title, desc, tag",
    snippet: `::: part-banner
- icon: "2부"
  title: "핵심 가이드 마스터"
  desc: "V2.0에서 강화된 숏코드로 다양한 웹/PPTX 변환 실무 적용하기"
  tag: "Ch.10 - 20"
:::`
  },
  {
    key: "summary-bar",
    name: "📈 하단 수치 요약 바 (summary-bar)",
    category: "정보 & 알림",
    desc: "수치 통계나 단위 성과들을 가로형 바 형태로 간결하게 나열합니다.",
    fields: "icon, title",
    snippet: `::: summary-bar
- icon: "21종"
  title: "핵심 숏코드"
- icon: "29종"
  title: "별칭 포함 지원 규격"
:::`
  },
  {
    key: "step-list",
    name: "🔢 순서형 단계 리스트 (step-list)",
    category: "구조 & 내비게이션",
    desc: "1, 2, 3... 순번이 자동으로 매겨진 단계식 지침과 부연 설명을 노출합니다.",
    fields: "title, desc, color (선택)",
    snippet: `::: step-list
- title: "문서 선택"
  desc: "가이드 문서를 로드하거나 새로 작성합니다."
- title: "숏코드 편집"
  desc: "필요한 시각화 숏코드를 삽입하고 옵션을 조절합니다."
:::`
  },
  {
    key: "faq-list",
    name: "❓ FAQ 아코디언 (faq-list)",
    category: "구조 & 내비게이션",
    desc: "질문(title)과 그에 답하는 답변(desc) 형태의 아코디언 질문-답변 리스트입니다.",
    fields: "title, desc",
    snippet: `::: faq-list
- title: "Q. 숏코드가 정상적으로 렌더링되지 않아요."
  desc: "A. 숏코드 내부 인덴트(여백)나 문법이 V2 규격(::: 숏코드명)과 일치하는지 확인하십시오."
:::`
  },
  {
    key: "os-tabs",
    name: "📁 OS/탭 전환 (os-tabs)",
    category: "구조 & 내비게이션",
    desc: "Windows / macOS 등 플랫폼별 조치 방법이나 다중 탭을 리스트로 안내합니다.",
    fields: "title, desc",
    snippet: `::: os-tabs
- title: "Windows"
  desc: "Windows OS의 설정 가이드 내용을 마크다운으로 기술합니다."
- title: "macOS"
  desc: "macOS용 단축키 및 실행 명령어 가이드를 작성합니다."
:::`
  }
];

export default function MarkdownCompiler() {
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Markdown editor states
  const [markdown, setMarkdown] = useState<string>(`---
title: 새 가이드 문서 V2.0
subtitle: V2.0 컴파일러를 통해 HTML 및 PPTX를 생성합니다
style: custom-blue
---

# 🚀 새로운 기능 소개

이곳에 가이드 내용을 작성하세요.

## 📋 핵심 요약

- **서버리스 아키텍처**: 브라우저 단독 컴파일 지원
- **디자인 격리**: V1.0 영향도 0%

---
<!-- slide -->
# 💡 숏코드 테스트

::: editor-box dev_env (javascript)
### 🛠️ 개발 환경 설정
- **OS**: Windows / macOS / Linux 지원
- **Runtime**: Node.js v18 이상 권장
:::
`);
  const [filename, setFilename] = useState("guide_v2.md");

  // Insert shortcode at cursor position
  const insertShortcode = (type: string) => {
    if (!type) return;
    let snippet = "";
    switch (type) {
      case "editor-box":
        snippet = `\n::: editor-box\n- title: "filename.js"\n  tag: "javascript"\n  desc: |\n    // 코드 내용\n    console.log("Hello, World!");\n:::\n`;
        break;
      case "compare-split":
        snippet = `\n::: compare-split\n- title: "Before"\n  desc: "기존 수동 렌더링"\n  meta: "수동 HTML 태그 관리 | 스타일 일관성 부족"\n- title: "After"\n  desc: "V2 자동 숏코드"\n  meta: "마크다운 기반 시각화 | 동적 높이 및 일관성"\n:::\n`;
        break;
      case "compare-diff":
        snippet = `\n::: compare-diff\n- title: "AS-IS 구형 코드"\n  desc: "legacyCode()"\n- title: "TO-BE 신규 코드"\n  desc: "modernCode()"\n:::\n`;
        break;
      case "compare-grid":
        snippet = `\n::: compare-grid\n- title: "구분 1"\n  desc: "설명 1"\n- title: "구분 2"\n  desc: "설명 2"\n:::\n`;
        break;
      case "network-box":
        snippet = `\n::: network-box\n- title: "중앙 핵심 개념"\n  color: "#EC4899"\n- title: "연결 개념 A"\n  meta: "세부 관계"\n- title: "연결 개념 B"\n  meta: "세부 관계"\n:::\n`;
        break;
      case "stat-grid":
        snippet = `\n::: stat-grid\n- icon: "99.9%"\n  title: "가동 시간"\n  desc: "평균 가동률"\n- icon: "120ms"\n  title: "응답 지연"\n  desc: "API 응답 지연"\n:::\n`;
        break;
      case "git-flow":
        snippet = `\n::: git-flow\n- title: "main"\n  tag: "v2.0.0"\n  meta: "초기 버전 | 패치 배포"\n  color: "#10B981"\n- title: "dev"\n  tag: "develop"\n  meta: "신규 기능 추가 | 버그 수정"\n  color: "#3B82F6"\n:::\n`;
        break;
      case "alert-box":
        snippet = `\n::: alert-box tip\n- title: "작성 팁"\n  desc: "기본 본문은 desc 속성 하위에서 작성해 주세요."\n:::\n`;
        break;
      case "tool-list":
        snippet = `\n::: tool-list\n- icon: "🛠️"\n  title: "Vite"\n  desc: "초고속 프론트엔드 빌드 도구"\n  meta: "HMR 지원 | 플러그인 생태계"\n:::\n`;
        break;
      case "plan-grid":
        snippet = `\n::: plan-grid\n- title: "Basic Plan"\n  tag: "Free"\n  meta: "기본 기능 제공 | 일간 10회 컴파일"\n- title: "Premium Plan"\n  tag: "Best"\n  meta: "모든 숏코드 지원 | 무제한 빌드 및 익스포트"\n  featured: "true"\n  color: "#3B82F6"\n:::\n`;
        break;
      case "icon-grid":
        snippet = `\n::: icon-grid cols=3 bullet=✔️\n- icon: "🚀"\n  title: "빠른 퍼포먼스"\n  desc: "최적화된 빌드와 빌트인 파서 탑재"\n- icon: "🎨"\n  title: "디자인 테마 선택"\n  desc: "다양한 테마 조합 가능"\n:::\n`;
        break;
      case "feature-grid":
        snippet = `\n::: feature-grid cols=2\n- icon: "⚡"\n  title: "실시간 미리보기"\n  desc: "수정 즉시 빌드 결과를 반영합니다."\n  tag: "핵심"\n- icon: "📦"\n  title: "일괄 변환 기능"\n  desc: "전체 폴더를 원클릭으로 변환합니다."\n  tag: "실무"\n:::\n`;
        break;
      case "step-list":
        snippet = `\n::: step-list\n- title: "문서 선택"\n  desc: "가이드 문서를 로드하거나 새로 작성합니다."\n- title: "숏코드 편집"\n  desc: "필요한 시각화 숏코드를 삽입하고 옵션을 조절합니다."\n:::\n`;
        break;
      case "columns-grid":
        snippet = `\n::: columns-grid cols=2\n- title: "HTML Guide"\n  desc: "가로 다단 형태의 깔끔한 가이드 북 레이아웃"\n  meta: "독립 실행 HTML 파일"\n- title: "16:9 Slides"\n  desc: "발표 및 스크린 공유를 위한 와이드 슬라이드 레이아웃"\n  meta: "프레젠테이션 최적화"\n:::\n`;
        break;
      case "workflow-flow":
        snippet = `\n::: workflow-flow\n- icon: "✏️"\n  title: "마크다운 작성"\n  meta: "에디터 사용"\n- icon: "⚙️"\n  title: "V2 컴파일"\n  meta: "백엔드 변환"\n:::\n`;
        break;
      case "summary-box":
        snippet = `\n::: summary-box\n- title: "요약정리"\n  desc: "시각화 숏코드를 활용하면 핵심 개념을 직관적으로 전달할 수 있습니다."\n  meta: "21종 숏코드 | HTML 연동 | PPTX 연동"\n:::\n`;
        break;
      case "faq-list":
        snippet = `\n::: faq-list\n- title: "Q. 숏코드가 정상적으로 렌더링되지 않아요."\n  desc: "A. 숏코드 내부 인덴트(여백)나 문법이 V2 규격(::: 숏코드명)과 일치하는지 확인하십시오."\n:::\n`;
        break;
      case "console-box":
        snippet = `\n::: console-box\n- title: "가이드 생성 결과"\n  desc: |\n    [System] build-guide.mjs 빌드 완료\n    [Success] C:\\ai\\cs_v2\\publish\\index.html 생성 성공!\n:::\n`;
        break;
      case "cmd-box":
        snippet = `\n::: cmd-box\n- title: "V2 서버 구동"\n  tag: "bash"\n  desc: "npm run dev"\n:::\n`;
        break;
      case "os-tabs":
        snippet = `\n::: os-tabs\n- title: "Windows"\n  desc: "Windows OS의 설정 가이드 내용을 마크다운으로 기술합니다."\n- title: "macOS"\n  desc: "macOS용 단축키 및 실행 명령어 가이드를 작성합니다."\n:::\n`;
        break;
      case "takeaway-banner":
        snippet = `\n::: takeaway-banner\n- icon: "💡"\n  title: "Key Takeaway"\n  desc: "숏코드의 진정한 가치는 텍스트 정보의 시각적 컴포넌트 자동화에 있습니다."\n:::\n`;
        break;
      case "step-flow":
        snippet = `\n::: step-flow\n- icon: "👨"\n  title: "요구사항 정의"\n  desc: "기능 정의 및 범위 확정"\n  tag: "active"\n- icon: "💻"\n  title: "시나리오 설계"\n  desc: "동선 및 와이어프레임 설계"\n:::\n`;
        break;
      case "part-banner":
        snippet = `\n::: part-banner\n- icon: "2부"\n  title: "핵심 가이드 마스터"\n  desc: "V2.0에서 강화된 숏코드로 다양한 웹/PPTX 변환 실무 적용하기"\n  tag: "Ch.10 - 20"\n:::\n`;
        break;
      case "summary-bar":
        snippet = `\n::: summary-bar\n- icon: "21종"\n  title: "핵심 숏코드"\n- icon: "29종"\n  title: "별칭 포함 지원 규격"\n:::\n`;
        break;
      case "badge-grid":
        snippet = `\n::: badge-grid\n- icon: "🌟"\n  title: "신속성"\n  tag: "Fast"\n- icon: "🔒"\n  title: "보안성"\n  tag: "Secure"\n:::\n`;
        break;
      case "skill-list":
        snippet = `\n::: skill-list\n- icon: "⚡"\n  title: "초고속 로딩"\n  desc: "Vite 기반 빌드로 브라우저 첫 렌더링 최적화"\n  bullet: "HMR 지원"\n:::\n`;
        break;
      default:
        return;
    }

    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    setMarkdown(before + snippet + after);

    // Focus back and position cursor after inserted snippet
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + snippet.length, start + snippet.length);
    }, 0);
  };
  
  // Style and Server files
  const [styles, setStyles] = useState<Record<string, any>>(FALLBACK_STYLES);
  const [selectedStyle, setSelectedStyle] = useState("custom-blue");
  const [sourceFiles, setSourceFiles] = useState<string[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  // Split View & Generation options
  const [previewMode, setPreviewMode] = useState<"html" | "presentation">("html");
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [generatingPreview, setGeneratingPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  
  // Final Save Options
  const [outputPath, setOutputPath] = useState("");
  const [saveOption, setSaveOption] = useState<"standalone" | "guideHub">("standalone");
  const [targetFormats, setTargetFormats] = useState<string[]>(["html", "presentation", "pptx"]);
  const [options] = useState({
    toc: true,
    noCover: false,
  });
  const [saving, setSaving] = useState(false);
  const [hasServer, setHasServer] = useState<boolean | null>(null);

  // Bulk Mode Options
  const [isBulkMode, setIsBulkMode] = useState<boolean>(false);
  const [bulkInputPath, setBulkInputPath] = useState<string>("md_src");
  const [bulkOutputPath, setBulkOutputPath] = useState<string>("publish");
  const [portalUrl, setPortalUrl] = useState<string>("");
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopySnippet = (key: string, snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedKey(key);
    toast({
      title: "템플릿 복사 완료",
      description: "클립보드에 숏코드 템플릿이 복사되었습니다. 에디터에 붙여넣어 사용하세요.",
    });
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  // Compute contrast ratio for selected style
  const currentStyle = styles[selectedStyle];
  let contrastRatio = 4.5;
  if (currentStyle && currentStyle.brand && currentStyle.bg) {
    contrastRatio = getContrast(currentStyle.brand, currentStyle.bg);
  }

  // Load styles and file list on mount
  useEffect(() => {
    fetchStyles();
    fetchFiles();
  }, []);

  // Initial preview render on load
  useEffect(() => {
    if (markdown) {
      triggerPreview(markdown, previewMode, selectedStyle);
    }
  }, [previewMode]);

  // Fetch styles from backend; sets hasServer based on API availability
  const fetchStyles = async () => {
    try {
      const res = await fetch("/api/list-styles");
      if (res.ok) {
        const data = await res.json();
        setStyles(data);
        setHasServer(true);
      } else {
        setStyles(FALLBACK_STYLES);
        setHasServer(false);
      }
    } catch (err) {
      console.error("Failed to load styles, using fallback:", err);
      setStyles(FALLBACK_STYLES);
      setHasServer(false);
    }
  };

  // Fetch files list from backend
  const fetchFiles = async () => {
    setLoadingFiles(true);
    try {
      const res = await fetch("/api/list-files");
      if (res.ok) {
        const data = await res.json();
        setSourceFiles(data.files || []);
      }
    } catch (err) {
      console.error("Failed to load source files:", err);
    } finally {
      setLoadingFiles(false);
    }
  };

  // Load selected server file content
  const handleLoadFile = async (filePath: string) => {
    try {
      const res = await fetch(`/api/load-file?path=${encodeURIComponent(filePath)}`);
      if (res.ok) {
        const data = await res.json();
        setMarkdown(data.content);
        setFilename(filePath.split(/[/\\]/).pop() || "guide_v2.md");
        
        // Extract style if present in frontmatter
        const styleMatch = data.content.match(/style:\s*([^\r\n]+)/);
        if (styleMatch && styleMatch[1]) {
          const matchedStyle = styleMatch[1].trim();
          if (styles[matchedStyle]) {
            setSelectedStyle(matchedStyle);
          }
        }
        
        toast({
          title: "파일 로드 완료",
          description: `서버에서 "${filePath}" 내용을 성공적으로 가져왔습니다.`,
        });
      }
    } catch (err: any) {
      toast({
        title: "파일 로드 실패",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // Upload local markdown file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      setMarkdown(text);
      setFilename(file.name);
      
      const styleMatch = text.match(/style:\s*([^\r\n]+)/);
      if (styleMatch && styleMatch[1]) {
        const matchedStyle = styleMatch[1].trim();
        if (styles[matchedStyle]) {
          setSelectedStyle(matchedStyle);
        }
      }
      
      toast({
        title: "로컬 파일 로드 완료",
        description: `"${file.name}" 파일을 성공적으로 가져왔습니다.`,
      });
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Trigger preview compilation
  const triggerPreview = async (mdContent = markdown, mode = previewMode, style = selectedStyle) => {
    setGeneratingPreview(true);
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown: mdContent, mode, style })
      });
      
      if (res.ok) {
        const html = await res.text();
        setPreviewHtml(html);
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Preview generation failed");
      }
    } catch (err: any) {
      console.warn("API preview failed, falling back to client-side compiler:", err.message);
      try {
        const localHtml = clientCompileMarkdown(mdContent, mode, style, styles);
        setPreviewHtml(localHtml);
      } catch (localErr: any) {
        toast({
          title: "로컬 컴파일 오류",
          description: localErr.message,
          variant: "destructive",
        });
      }
    } finally {
      setGeneratingPreview(false);
    }
  };

  // Compile and Save
  const handleSaveAndCompile = async () => {
    setSaving(true);
    setPortalUrl("");
    try {
      if (targetFormats.length === 0) {
        toast({
          title: "알림",
          description: "최소 한 개 이상의 변환 포맷을 선택해 주세요.",
        });
        setSaving(false);
        return;
      }

      if (isBulkMode) {
        // Bulk Mode Compilation
        const res = await fetch("/api/bulk-convert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            inputDir: bulkInputPath,
            outputDir: bulkOutputPath,
            style: selectedStyle,
            formats: targetFormats,
            options,
          })
        });

        if (res.ok) {
          const result = await res.json();
          setPortalUrl(result.portalIndex);
          toast({
            title: "폴더 일괄 변환 완료",
            description: `${result.message}\n생성된 가이드 포털로 즉시 연결 가능합니다.`,
            duration: 6000,
          });
        } else {
          const errData = await res.json();
          throw new Error(errData.error || "폴더 일괄 변환 실패");
        }
      } else {
        // Single File Compilation
        if (!filename.trim()) {
          toast({
            title: "입력 오류",
            description: "저장할 파일명을 작성해 주세요.",
            variant: "destructive",
          });
          setSaving(false);
          return;
        }

        const res = await fetch("/api/save-generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            markdown,
            filename,
            outputPath,
            saveOption,
            formats: targetFormats,
            style: selectedStyle,
            options,
          }),
        });

        if (res.ok) {
          const result = await res.json();
          
          // HTML format included, set portal link
          const hasHtml = targetFormats.includes("html");
          if (hasHtml) {
            setPortalUrl("/publish/index.html");
          }

          toast({
            title: "변환 및 로컬 저장 완료",
            description: result.message,
            duration: 6000,
          });
        } else {
          const errData = await res.json();
          throw new Error(errData.error || "Save & generate failed");
        }
      }
    } catch (err: any) {
      console.warn("Save & generate server API failed, falling back to local download:", err);
      
      // Standalone/Offline fallback
      if (!isBulkMode) {
        try {
          const hasHtml = targetFormats.includes("html");
          const hasPresentation = targetFormats.includes("presentation");
          const hasPptx = targetFormats.includes("pptx");

          // 1. Download Markdown
          downloadFile(markdown, filename || "guide_v2.md", "text/markdown;charset=utf-8");

          // 2. Download HTML Guide if selected
          if (hasHtml) {
            const htmlContent = clientCompileMarkdown(markdown, "html", selectedStyle, styles);
            const htmlName = filename.replace(/\.md$/i, ".html");
            downloadFile(htmlContent, htmlName, "text/html;charset=utf-8");
          }

          // 3. Download Presentation Slides if selected
          if (hasPresentation) {
            const presContent = clientCompileMarkdown(markdown, "presentation", selectedStyle, styles);
            const presName = filename.replace(/\.md$/i, "_presentation.html");
            downloadFile(presContent, presName, "text/html;charset=utf-8");
          }

          if (hasPptx) {
            toast({
              title: "로컬 파일 다운로드 완료 (PPTX 제외)",
              description: "서버가 오프라인 상태이므로 PPTX 슬라이드는 생성할 수 없습니다. 대신 마크다운(.md) 및 HTML 문서들을 다운로드했습니다.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "로컬 파일 다운로드 완료",
              description: "마크다운(.md) 및 변환된 HTML 파일들을 브라우저 다운로드로 저장했습니다.",
            });
          }
          return;
        } catch (localErr: any) {
          toast({
            title: "오프라인 변환 오류",
            description: localErr.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "폴더 일괄 변환 불가",
          description: "폴더 선택 및 일괄 변환은 로컬 백엔드 API 서버가 켜져 있어야 작동합니다. 오프라인 모드에서는 개별 파일의 마크다운 및 HTML 컴파일 다운로드만 가능합니다.",
          variant: "destructive",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleFormatToggle = (format: string) => {
    if (targetFormats.includes(format)) {
      setTargetFormats(targetFormats.filter(f => f !== format));
    } else {
      setTargetFormats([...targetFormats, format]);
    }
  };

  const handleFolderPick = async (target: "input" | "output" | "save") => {
    try {
      const res = await fetch("/api/select-folder", {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        if (data.selectedPath) {
          if (target === "input") {
            setBulkInputPath(data.selectedPath);
          } else if (target === "output") {
            setBulkOutputPath(data.selectedPath);
          } else if (target === "save") {
            setOutputPath(data.selectedPath);
          }
          toast({
            title: "폴더 선택 완료",
            description: `선택된 경로: ${data.selectedPath}`,
          });
        }
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "폴더 선택 실패");
      }
    } catch (err: any) {
      toast({
        title: "오프라인 상태 또는 오류",
        description: "로컬 백엔드 서버가 구동 중일 때만 폴더 선택 다이얼로그를 사용할 수 있습니다. 경로를 텍스트로 직접 입력해 주세요.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[calc(100vh-140px)] h-auto min-h-[500px] text-slate-800">
      {/* Left panel: Editor & Settings */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col lg:h-full h-auto min-h-[450px] space-y-4">
        {/* Editor Top Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex flex-wrap items-center gap-4">
            {hasServer !== false && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-500 font-semibold">문서 열기:</label>
                <select
                  onChange={(e) => handleLoadFile(e.target.value)}
                  className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">서버 문서 선택...</option>
                  {sourceFiles.map((file) => (
                    <option key={file} value={file}>{file}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-500 font-semibold">숏코드 삽입:</label>
              <select
                onChange={(e) => {
                  insertShortcode(e.target.value);
                  e.target.value = ""; // Reset value
                }}
                value=""
                className="bg-blue-50/50 border border-blue-200 text-blue-800 rounded px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer hover:bg-blue-600 hover:text-white transition-colors"
              >
                <option value="" disabled>선택 삽입...</option>
                <optgroup label="📋 비교 & 대조 (Compare & Diff)">
                  <option value="compare-split">⚖️ 2단 대조 비교 (compare-split)</option>
                  <option value="compare-diff">🔍 Before/After 대조 (compare-diff)</option>
                  <option value="compare-grid">📋 비교 그리드 (compare-grid)</option>
                  <option value="columns-grid">🗂️ 다단 정보 카드 그리드 (columns-grid)</option>
                </optgroup>
                <optgroup label="🖥️ 코드 & 터미널 (Code & Command)">
                  <option value="editor-box">🖥️ 에디터 시뮬레이션 (editor-box)</option>
                  <option value="console-box">💻 콘솔 출력 (console-box)</option>
                  <option value="cmd-box">⌨️ 터미널 명령어 (cmd-box)</option>
                </optgroup>
                <optgroup label="🕸️ 시각 자료 & 흐름 (Visuals & Flows)">
                  <option value="network-box">🕸️ 네트워크 다이어그램 (network-box)</option>
                  <option value="git-flow">🔧 Git Flow 흐름도 (git-flow)</option>
                  <option value="workflow-flow">🔄 가로 워크플로우 (workflow-flow)</option>
                  <option value="step-flow">➡️ 가로 이정표 흐름도 (step-flow)</option>
                </optgroup>
                <optgroup label="🧩 콘텐츠 그리드 (Content Grids)">
                  <option value="icon-grid">🧩 아이콘 카드 그리드 (icon-grid)</option>
                  <option value="feature-grid">⭐ 핵심 기능 카드 그리드 (feature-grid)</option>
                  <option value="tool-list">🧰 도구 목록 (tool-list)</option>
                  <option value="plan-grid">💳 요금제 카드 그리드 (plan-grid)</option>
                  <option value="badge-grid">🏷️ 배지 칩 그리드 (badge-grid)</option>
                  <option value="stat-grid">📊 통계 지표 그리드 (stat-grid)</option>
                  <option value="skill-list">🎯 스킬 리스트 (skill-list)</option>
                </optgroup>
                <optgroup label="📢 정보 & 알림 (Info & Highlights)">
                  <option value="alert-box">⚠️ 경고/알림 박스 (alert-box)</option>
                  <option value="summary-box">📝 하단 요약 박스 (summary-box)</option>
                  <option value="takeaway-banner">💡 핵심 테이크어웨이 (takeaway-banner)</option>
                  <option value="part-banner">🚩 파트/챕터 시작 배너 (part-banner)</option>
                  <option value="summary-bar">📈 하단 수치 요약 바 (summary-bar)</option>
                </optgroup>
                <optgroup label="🔢 구조 & 내비게이션 (Structure & Nav)">
                  <option value="step-list">🔢 순서형 단계 리스트 (step-list)</option>
                  <option value="faq-list">❓ FAQ 아코디언 (faq-list)</option>
                  <option value="os-tabs">📁 OS/탭 전환 (os-tabs)</option>
                </optgroup>
              </select>
              <button
                type="button"
                onClick={() => setShowGuide(true)}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-800 px-3 py-1.5 rounded text-xs flex items-center gap-1 transition-colors font-semibold shadow-sm shrink-0"
                title="숏코드 설명서 보기"
              >
                <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                <span>숏코드 설명서</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800 px-3 py-1.5 rounded text-sm flex items-center gap-1 cursor-pointer transition-colors font-semibold font-sans">
              <Upload className="h-3 w-3" /> 로컬 파일 업로드
              <input
                type="file"
                accept=".md"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <select
              value={selectedStyle}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedStyle(val);
                setMarkdown(prev => {
                  if (prev.includes("style:")) {
                    return prev.replace(/style:\s*[^\r\n]+/, "style: " + val);
                  }
                  return prev;
                });
              }}
              className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
            >
              {Object.entries(styles).map(([key, value]) => (
                <option key={key} value={key}>{value.label || key}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filename and refresh */}
        <div className="flex items-center justify-between gap-3 bg-slate-50 p-2 border border-slate-200 rounded-lg">
          <div className="flex items-center gap-2 flex-1">
            <FileText className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="bg-white border border-slate-200 rounded px-2.5 py-1 text-sm font-mono text-slate-800 flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="filename.md"
            />
          </div>
          <button
            onClick={() => triggerPreview(markdown, previewMode, selectedStyle)}
            disabled={generatingPreview}
            className="bg-blue-600 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold py-1.5 px-3 rounded text-sm flex items-center gap-1 transition-all shadow-sm"
          >
            {generatingPreview ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
            <span>미리보기 반영</span>
          </button>
        </div>

        {/* Markdown Source Area */}
        <div className="flex-1 min-h-[220px]">
          <textarea
            ref={textareaRef}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="w-full h-full bg-slate-50 text-slate-800 border border-slate-200 rounded-lg p-4 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none overflow-y-auto"
            spellCheck={false}
          />
        </div>

        {/* Bulk compile switch — 서버 연결 시에만 노출 */}
        {hasServer !== false && (
          <div className="flex items-center gap-6 border-t border-slate-200 pt-3 text-sm">
            <label className="flex items-center gap-2 font-semibold text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={isBulkMode}
                onChange={(e) => setIsBulkMode(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              폴더 일괄 변환 (마크다운 폴더 매핑 컴파일)
            </label>
          </div>
        )}

        {/* Compile Settings */}
        <div className="border-t border-slate-200 pt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="font-semibold text-slate-500">1. 대상 포맷 선택</div>
            <div className="flex flex-wrap gap-2">
              {["html", "presentation", "pptx"].map((fmt) => {
                const checked = targetFormats.includes(fmt);
                return (
                  <button
                    key={fmt}
                    onClick={() => handleFormatToggle(fmt)}
                    className={`px-3 py-1.5 rounded-md border flex items-center gap-1 transition-all font-semibold ${
                      checked
                        ? 'bg-blue-600/10 border-blue-500 text-blue-600'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'
                    }`}
                  >
                    <span>{fmt.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {hasServer !== false && (
            <div className="space-y-2">
              {!isBulkMode ? (
                <>
                  <div className="font-semibold text-slate-500 flex items-center justify-between">
                    <span>2. 저장 위치 옵션</span>
                    <button
                      type="button"
                      onClick={() => handleFolderPick("save")}
                      className="text-xs text-blue-600 hover:text-blue-800 font-bold underline"
                    >
                      폴더 선택...
                    </button>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <select
                      value={saveOption}
                      onChange={(e) => setSaveOption(e.target.value as any)}
                      className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                    >
                      <option value="standalone">독립 파일 단독 생성</option>
                      <option value="guideHub">가이드 허브 목록 추가 및 전체 빌드</option>
                    </select>
                    <input
                      type="text"
                      value={outputPath}
                      onChange={(e) => setOutputPath(e.target.value)}
                      className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-sm text-slate-800 font-mono w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="기본값 (storage/)"
                    />
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-500 flex items-center justify-between">
                      <span>2. 입력 폴더</span>
                      <button
                        type="button"
                        onClick={() => handleFolderPick("input")}
                        className="text-xs text-blue-600 hover:text-blue-800 font-bold underline"
                      >
                        선택...
                      </button>
                    </div>
                    <input
                      type="text"
                      value={bulkInputPath}
                      onChange={(e) => setBulkInputPath(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="md_src"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-500 flex items-center justify-between">
                      <span>3. 출력 폴더</span>
                      <button
                        type="button"
                        onClick={() => handleFolderPick("output")}
                        className="text-xs text-blue-600 hover:text-blue-800 font-bold underline"
                      >
                        선택...
                      </button>
                    </div>
                    <input
                      type="text"
                      value={bulkOutputPath}
                      onChange={(e) => setBulkOutputPath(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="publish"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Link to generated portal */}
        {portalUrl && (
          <a
            href={portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm text-sm"
          >
            <span>빌드 완료: 가이드북 포털 허브 바로가기 ↗</span>
          </a>
        )}

        <button
          onClick={handleSaveAndCompile}
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm text-sm"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>
            {isBulkMode
              ? "선택 폴더 일괄 숏코드 컴파일 실행"
              : hasServer === false
                ? "마크다운 컴파일 · 브라우저 다운로드"
                : "V2 마크다운 컴파일 및 저장"}
          </span>
        </button>
      </div>

      {/* Right panel: Live Preview */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col lg:h-full h-auto min-h-[450px] space-y-4">
        {/* Preview Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex gap-1.5 bg-slate-100 p-1 border border-slate-200 rounded-lg">
            <button
              onClick={() => setPreviewMode("html")}
              className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
                previewMode === "html"
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              A4 Guide
            </button>
            <button
              onClick={() => setPreviewMode("presentation")}
              className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
                previewMode === "presentation"
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              16:9 Slides
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 border border-slate-200 rounded-lg">
            <button
              onClick={() => setPreviewDevice("desktop")}
              className={`p-1.5 rounded transition-colors ${previewDevice === "desktop" ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
              title="Desktop"
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setPreviewDevice("tablet")}
              className={`p-1.5 rounded transition-colors ${previewDevice === "tablet" ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
              title="Tablet"
            >
              <Tablet className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setPreviewDevice("mobile")}
              className={`p-1.5 rounded transition-colors ${previewDevice === "mobile" ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
              title="Mobile"
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Live Contrast Linter Warning Banner */}
        {contrastRatio < 4.5 && currentStyle && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-4 text-sm flex items-start gap-2.5 shadow-sm leading-relaxed">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>가독성 대비 경고 (WCAG AA 미달)</strong><br />
              선택한 테마 <code>{currentStyle?.label || selectedStyle}</code>의 주컬러와 배경색 간의 명도 대비도가 <strong>{contrastRatio.toFixed(2)}:1</strong>로 WCAG AA 가이드라인 기준(4.5:1)에 미달합니다. 
              가독성 확보를 위해 <span className="underline font-bold text-amber-900">디자인 시스템 조율</span> 탭에서 해당 테마의 브랜드 색상 명도(L값)를 조절할 것을 권장합니다.
            </div>
          </div>
        )}

        {/* Live Preview Iframe Frame */}
        <div className="flex-1 min-h-[300px] bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex flex-col p-2 justify-center">
          <div
            className={`bg-white rounded-lg overflow-hidden border border-slate-200/60 shadow-sm ${previewMode === "html" ? "flex-1 w-full" : "w-full"}`}
            style={{
              width: previewDevice === "desktop" ? "100%" : previewDevice === "tablet" ? "768px" : "375px",
              maxWidth: "100%",
              aspectRatio: previewMode === "presentation" ? "16 / 9" : undefined,
              margin: "0 auto"
            }}
          >
            {generatingPreview && !previewHtml ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2 bg-slate-50">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                <span className="text-xs">Generating preview...</span>
              </div>
            ) : previewHtml ? (
              <iframe
                title="Markdown Compiler Preview Frame"
                srcDoc={previewHtml}
                className="w-full h-full border-0"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs bg-slate-50 font-semibold">
                [미리보기 반영] 버튼을 눌러 컴파일 결과물을 표시합니다.
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showGuide && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-xl max-w-4xl w-full h-[85vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-800">🧩 V2.0 숏코드 레퍼런스 설명서</h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-semibold">총 26종</span>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 p-1.5 rounded-lg transition-colors"
                title="닫기"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Bar */}
            <div className="border-b border-slate-100 px-6 py-3 bg-white flex flex-col md:flex-row gap-3 items-center justify-between">
              {/* Category tabs */}
              <div className="flex flex-wrap gap-1">
                {["전체", "비교 & 대조", "코드 & 터미널", "시각 자료 & 흐름", "콘텐츠 그리드", "정보 & 알림", "구조 & 내비게이션"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="숏코드 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                />
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SHORTCODE_DOCS.filter((doc) => {
                  const matchesCat = selectedCategory === "전체" || doc.category === selectedCategory;
                  const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                        doc.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        doc.desc.toLowerCase().includes(searchQuery.toLowerCase());
                  return matchesCat && matchesSearch;
                }).map((doc) => (
                  <div key={doc.key} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1">
                          {doc.name}
                        </h4>
                        <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-semibold">
                          {doc.category}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed mb-3">
                        {doc.desc}
                      </p>
                      {doc.fields && (
                        <div className="text-[11px] text-slate-400 mb-4 bg-slate-50 px-2.5 py-1.5 rounded font-mono">
                          <strong className="text-slate-500 font-sans">지원 필드:</strong> {doc.fields}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="relative">
                        <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-[10px] font-mono overflow-x-auto whitespace-pre-wrap max-h-36 text-left">
                          <code>{doc.snippet}</code>
                        </pre>
                        <button
                          onClick={() => handleCopySnippet(doc.key, doc.snippet)}
                          className="absolute right-2 top-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-1.5 rounded transition-all shadow border border-slate-700/50"
                          title="스니펫 복사"
                        >
                          {copiedKey === doc.key ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400 animate-in zoom-in" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-200 px-6 py-3 bg-slate-50 flex justify-between items-center text-xs text-slate-500 font-semibold">
              <span>💡 각 숏코드 템플릿을 에디터의 적절한 위치에 복사해서 붙여넣으세요.</span>
              <button
                onClick={() => setShowGuide(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-1.5 rounded-md transition-colors text-xs"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
