/**
 * shortcode-guide.ts — 숏코드 가이드 패널 + 삽입 툴바 공용 데이터 (단일 출처).
 * MarkdownCompiler 의 가이드 패널 표시와 insertShortcode 삽입 스니펫이 모두 이 배열을 참조한다.
 * 스니펫은 들여쓰기가 의미를 가지므로 템플릿 리터럴로 그대로 작성한다. (입력 문법 변경 시 여기만 수정)
 */
export interface ShortcodeDoc {
  key: string;
  name: string;
  category: string;
  desc: string;
  fields: string;
  snippet: string;
}

export const SHORTCODE_DOCS: ShortcodeDoc[] = [
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
    key: "before-after",
    name: "🔍 Before/After 전후 대조 (before-after)",
    category: "비교 & 대조",
    desc: "AS-IS(구형)와 TO-BE(신형)를 ❌/✅ 레이블로 단순 명확하게 전후 대조합니다. (compare-diff 는 호환 별칭)",
    fields: "title, desc",
    snippet: `::: before-after
- title: "AS-IS 구형 방식"
  desc: "수동으로 서버에 SSH 접속하여 파일을 업로드했습니다."
- title: "TO-BE 개선 방식"
  desc: "커밋 하나로 CI/CD 자동 빌드·배포가 실행됩니다."
:::`
  },
  {
    key: "columns-grid",
    name: "🗂️ 다단 정보 카드 그리드 (columns-grid)",
    category: "비교 & 대조",
    desc: "가로 다단 카드 격자. 일반 다단 정보 배치뿐 아니라 compare-grid 대체 비교 용도로도 사용합니다.",
    fields: "cols (속성: cols=2), title, desc, note (팁박스), color (선택)",
    snippet: `::: columns-grid cols=2
- title: "ORM 사용"
  desc: "빠른 개발 속도와 타입 안정성을 제공합니다."
  note: "복잡한 쿼리에서는 Raw SQL 병행 권장"
  color: "#3b82f6"
- title: "Raw SQL"
  desc: "세밀한 쿼리 최적화가 가능합니다."
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
    key: "step-flow",
    name: "➡️ 가로 이정표 흐름도 (step-flow)",
    category: "시각 자료 & 흐름",
    desc: "단계별 흐름을 가로로 표현. tag:active 로 현재 단계 강조. meta 필드로 도구/코멘트 추가 가능. (workflow-flow 는 호환 별칭)",
    fields: "icon, title, desc, meta (도구/코멘트), tag (active 시 강조), color (선택)",
    snippet: `::: step-flow
- icon: "👨"
  title: "요구사항 정의"
  desc: "기능 정의 및 범위 확정"
  meta: "회의록 작성"
  tag: "active"
- icon: "💻"
  title: "시나리오 설계"
  desc: "동선 및 와이어프레임 설계"
  meta: "Figma"
:::`
  },
  {
    key: "icon-grid",
    name: "🧩 아이콘 카드 그리드 (icon-grid)",
    category: "콘텐츠 그리드",
    desc: "아이콘+제목+설명 카드 격자. align 옵션으로 레이아웃 변형: center(기본) / left(좌측 아이콘, 구 skill-list) / row(수평 배열, 구 checkpoint-grid).",
    fields: "cols (속성), bullet (속성), align=center|left|row (속성), icon, title, desc, color (선택)",
    snippet: `::: icon-grid cols=3
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
  meta: "25종 숏코드 | HTML 연동 | PPTX 연동"
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
- icon: "25종"
  title: "핵심 숏코드"
- icon: "38종"
  title: "alias 포함 지원 규격"
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
  },
  {
    key: "chapter-list",
    name: "📚 챕터 목록 (chapter-list)",
    category: "구조 & 내비게이션",
    desc: "시리즈 부(Part) 하위에 속한 세부 챕터를 번호·제목·설명·구분 배지로 목록화합니다.",
    fields: "icon (챕터번호), title, desc, tag (개념/도구/사례/가이드/실습/주의/핵심)",
    snippet: `::: chapter-list
- icon: "01"
  title: "시스템 개요"
  desc: "전체 아키텍처와 핵심 구성 요소를 소개합니다."
  tag: "개념"
- icon: "02"
  title: "빠른 시작 가이드"
  desc: "설치부터 첫 빌드까지 단계별로 안내합니다."
  tag: "실습"
:::`
  },
  {
    key: "level-grid",
    name: "📶 레벨 스펙트럼 (level-grid)",
    category: "구조 & 내비게이션",
    desc: "난이도·성숙도·역량 구간을 카드 격자로 비교. tag:highlight 로 강조 카드 지정.",
    fields: "title (레벨명), desc, color (선택), tag (highlight 시 강조)",
    snippet: `::: level-grid
- title: "입문"
  desc: "기본 문법과 핵심 개념 이해"
- title: "중급"
  desc: "실무 프로젝트 적용 가능"
  tag: "highlight"
- title: "고급"
  desc: "아키텍처 설계 및 최적화 수행"
:::`
  },
  {
    key: "venn-diagram",
    name: "⭕ 벤 다이어그램 (venn-diagram)",
    category: "데이터 다이어그램",
    desc: "두 영역이 겹칠 때 새로운 가치/의미가 발생함을 표현. 항목 3개 고정 순서(왼쪽 원 / 오른쪽 원 / 교집합 캡션).",
    fields: "[0]title,color (왼쪽 원) · [1]title,color (오른쪽 원) · [2]icon,desc (교집합, 선택)",
    snippet: `::: venn-diagram
- title: "전공 A"
  color: "#6366F1"
- title: "전공 B"
  color: "#EC4899"
- icon: "⭐"
  desc: "새로운 가치"
:::`
  },
  {
    key: "quadrant-chart",
    name: "📍 사분면 차트 (quadrant-chart)",
    category: "데이터 다이어그램",
    desc: "두 축(X/Y) 기준으로 여러 항목의 상대 위치를 비교. 축 라벨은 블록 인수로 지정.",
    fields: "블록 인수 xLabel=\"...\" yLabel=\"...\" · title, color, fx/fy (0~1 비율)",
    snippet: `::: quadrant-chart xLabel="가격" yLabel="품질"
- title: "제품 A"
  fx: "0.3"
  fy: "0.7"
  color: "#6366F1"
- title: "제품 B"
  fx: "0.8"
  fy: "0.2"
  color: "#EC4899"
:::`
  },
  {
    key: "concentric-rings",
    name: "🎯 동심원 포함관계 (concentric-rings)",
    category: "데이터 다이어그램",
    desc: "A⊃B⊃C 같은 계층적 포함관계 표현. 항목은 바깥(큰 범주)에서 안쪽(구체적 범주) 순서로 작성.",
    fields: "title (범주명), color, icon (마지막 항목에만 — 중심 아이콘)",
    snippet: `::: concentric-rings
- title: "AI"
  color: "#94A3B8"
- title: "머신러닝"
  color: "#64748B"
- title: "딥러닝"
  color: "#475569"
- title: "LLM"
  icon: "🧠"
  color: "#1E293B"
:::`
  }
];
