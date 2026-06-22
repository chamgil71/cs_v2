---
title: "Claude & Claude Code 통합 가이드"
subtitle: "웹/앱부터 CLI 터미널 에이전트까지, Anthropic Claude 서비스 완벽 마스터"
badge: "💡 Anthropic 공식 파트너급 가이드"
style: "ai-chat"
logo: "🤖"
fontFace: "Malgun Gothic"
titleSize: 22
bodySize: 12
stats:
  - value: "3종 환경"
    label: "웹·앱·모바일"
  - value: "CLI 에이전트"
    label: "Claude Code"
  - value: "3종 모델"
    label: "Haiku·Sonnet·Opus"
done:
  title: "🎉 Claude 완전 정복!"
  subtitle: "웹과 터미널을 아우르는 최강의 생산성을 직접 경험해 보세요."
  ctaLabel: "Anthropic Claude 공식 문서"
  ctaUrl: "https://docs.anthropic.com/en/docs/about-claude/claude-code"
---

# 1. Claude 플랫폼 선택 및 가이드 (Web, Desktop, Mobile)
본 장에서는 사용 목적에 따른 Claude의 3대 구동 환경(웹, 데스크탑, 모바일)의 특징을 이해하고 가장 적합한 플랫폼을 선택하는 법을 알아봅니다.

## 언제 어디서나 접속하는 3대 플랫폼 환경
Claude는 사용자의 기기 환경에 맞춰 완전히 동기화되는 3가지 클라이언트 인터페이스를 공식 지원합니다.

::: feature-grid cols=3
- icon: "🌐"
  title: "Web (Claude.ai)"
  tag: "무설치 브라우저"
  desc: "별도 다운로드 없이 크롬, 사파리 등 웹 브라우저에서 즉시 로그인하여 사용하는 기본 환경입니다."
- icon: "💻"
  title: "Desktop App"
  tag: "로컬 백그라운드"
  desc: "윈도우 및 macOS 독립 앱으로 가동되며, 창 전환단축키 및 컴퓨터 파일 드래그앤드롭 첨부가 간편합니다."
- icon: "📱"
  title: "Mobile App"
  tag: "기동성 및 햅틱"
  desc: "iOS 및 Android 정식 앱으로 구동되어, 이동 중 음성 질문이나 사진 촬영을 연계한 즉석 분석에 유리합니다."
:::

---

## 웹/앱 환경과 모바일 환경의 기능 비교
모바일에서는 카메라와 음성 인식을 통해 일상의 정보를 즉각 처리하며, 데스크탑에서는 프로젝트 생성과 파일 관리에 집중합니다.

::: compare-split
- title: "웹 & 데스크탑 환경"
  desc: "넓은 화면을 바탕으로 다량의 문서 자료 업로드, 프로젝트 컨텍스트 관리, 그리고 코드 컴파일 화면 조회가 가능합니다."
  meta: "대용량 프로젝트 관리|Artifacts 독립 창 지원|외부 MCP 서버 추가|고성능 코딩"
  note: "주 업무 및 개발 환경"
- title: "모바일 환경"
  desc: "스마트폰 카메라로 책, 기판, 에러 화면을 촬영하여 즉시 OCR 분석을 지시하거나 음성 인터뷰를 진행합니다."
  meta: "카메라 실시간 이미지 분석|음성 인식 대화 기능|단발성 현장 디버깅|언제 어디서나 접근"
  note: "현장형 보조 및 외출 시 사용"
:::

---

# 2. Claude Web/App 주요 메뉴 가이드
웹 포털 및 데스크탑 앱 화면의 핵심 기능을 메뉴별로 하나씩 상세히 설명합니다.

## Claude.ai 서비스의 4대 핵심 메뉴 설명
메뉴별 고유 명칭과 역할을 인지하면 AI가 보유한 기능을 200% 활용할 수 있습니다.

::: icon-grid cols=2
- icon: "📁"
  title: "Projects (프로젝트)"
  desc: "자주 쓰는 시스템 지시문(System Prompt)과 참고 지식 문서, 그리고 스킬가이드(SKILL.md)를 올려두어 대화방들의 일관된 맥락을 통제하는 전용 지식 베이스 저장소입니다."
- icon: "🎨"
  title: "Artifacts (아티팩트)"
  desc: "대화 중 생성된 HTML 코드, React 컴포넌트, SVG 아이콘 등을 대화창 우측의 독립된 분할 패널에 즉석에서 직접 렌더링하고 다운로드할 수 있는 대화형 결과물 출력 공간입니다."
- icon: "👥"
  title: "Team / Workspace (워크스페이스)"
  desc: "Team 요금제 가입 시 가동되는 협업 메뉴로, 동료들과 공동 프로젝트 지식 문서를 공유하고 동일한 AI 프롬프트 템플릿으로 협력 업무를 지속할 수 있게 해줍니다."
- icon: "⚙️"
  title: "Settings & Billing (설정/결제)"
  desc: "API 사용량 조회, 결제 카드 관리, 라이트/다크 테마 스위치, 프로필 정보 조율 및 개인 대화 내역 전체를 일괄 삭제하거나 내보내는 계정 제어 메뉴입니다."
:::

---

## 성능별 모델 라인업 (Haiku / Sonnet / Opus)
Claude는 응답 속도와 비용 및 추론 성능에 맞춰 3종의 지능형 모델을 차등 제공합니다.

::: plan-grid cols=3
- title: "Claude Haiku"
  tag: "속도 & 저비용"
  meta: "단순 텍스트 분류|초고속 요약|대량 데이터 전처리|API 대량 호출 최적"
  note: "일상 Q&A 및 번역"
- title: "Claude Sonnet"
  tag: "균형 추천 (LTS)"
  meta: "프로그래밍 디버깅|정밀 기획서 작성|고성능 데이터 추출|대부분의 실무 최적"
  note: "가장 권장하는 표준 모델"
  featured: "true"
- title: "Claude Opus"
  tag: "초고성능 추론"
  meta: "수학적/논리 추론|최고 정밀도 분석|장편 교육 도서 기필|응답 속도는 다소 느림"
  note: "최고 난이도 연구용"
:::

---

# 3. Claude Code 개요 및 설치/인증
터미널에서 직접 사용자 프로젝트 코드를 분석하고 쉘 명령을 구동하는 자율 에이전트 Claude Code에 대해 알아봅니다.

## 웹 채팅형 Claude vs 터미널 에이전트 Claude Code
터미널 자율 제어 루프를 장착한 에이전트의 강점을 비교합니다.

::: compare-split
- title: "기존 웹채팅 (Claude.ai)"
  desc: "브라우저 상에서 마크다운이나 텍스트를 복사-붙여넣기 해야 하며 로컬 명령어 실행이 불가능합니다."
  meta: "정적 텍스트 대화|수동 파일 관리|시스템 접근 권한 없음"
  note: "브레인스토밍 및 학습"
- title: "자율 에이전트 (Claude Code)"
  desc: "로컬 저장소의 파일 구조를 스스로 분석하여, 소스 코드를 부분 패치하고 테스트 실행 및 빌드 오류 디버깅까지 완수합니다."
  meta: "자율 파일 쓰기/수정|로컬 명령어 직접 구동|오류 시 수정 무한 루프"
  note: "개발 생산성 극대화"
:::

---

## 3단계 운영체제별 설치 가이드
Node.js(v18+) 환경이 먼저 준비되어야 하며, 터미널에 공식 스크립트를 입력하여 간편히 설치할 수 있습니다.

::: step-list
- title: "Node.js 버전 확인"
  desc: "터미널에 `node -v`를 입력해 v18 이상인지 점검합니다. 없으면 공식 사이트에서 LTS 버전을 설치합니다."
- title: "macOS / Linux 설치 명령어"
  desc: "터미널에서 `npm install -g @anthropic-ai/claude-code`를 가동하여 글로벌 에이전트로 등록합니다."
- title: "Windows PowerShell 스크립트 실행"
  desc: "PowerShell 관리자 권한을 연 뒤 `Set-ExecutionPolicy Bypass -Scope Process` 처리 후 npm 명령어로 설치를 완료합니다."
:::

---

## 처음 시작하는 로그인 및 인증 프로시저
설치가 끝난 에이전트를 내 Anthropic 계정과 연동하여 활성화하는 보안 인증 절차입니다.

::: step-list
- title: "1단계: claude 명령어 입력"
  desc: "터미널 쉘 창에 아무 인자 없이 `claude`를 입력하고 Enter를 누릅니다."
- title: "2단계: 웹 브라우저 인증 승인"
  desc: "명령 창에 표시된 1회용 일시 인증 링크를 클릭하여 Anthropic 로그인 화면을 엽니다."
- title: "3단계: 권한 허용 및 연동 성공"
  desc: "웹상에서 계정 로그인을 마치고 'Authorize' 승인을 누르는 즉시, 터미널 창에 웰컴 로고와 함께 프롬프트가 실행됩니다."
:::

---

# 4. Claude Code CLI 메뉴 및 기능 상세 설명
터미널 쉘 명령어 수준에서의 파라미터(CLI Flags)와 기동된 대화방 내부에서 사용하는 내장 슬래시 명령어들을 알아봅니다.

::: slide-config
bg: "#1E293B"
color: "#F8FAFC"
titleSize: 22
:::

## Claude Code CLI 실행 매개변수 (CLI Flags)
기동 명령어인 `claude` 뒤에 인자 플래그를 붙여 에이전트의 구동 환경과 디렉토리를 통제합니다.

::: columns-grid cols=3
- title: "인터랙티브 기동"
  desc: "에이전트와 연속 대화를 나눌 수 있는 전용 쉘 환경을 활성화합니다."
  meta: "claude"
- title: "일회성 쿼리 전송"
  desc: "대화방을 유지하지 않고, 요청한 지시만 로컬에서 처리한 뒤 즉시 종료합니다."
  meta: "claude \"이 파일의 오류를 찾아서 패치해줘\""
- title: "자가 상태 진단"
  desc: "에이전트와 Anthropic API 서버 간의 연결 무결성 및 시스템 권한 설정을 점검합니다."
  meta: "claude doctor"
- title: "최신 버전 업데이트"
  desc: "클로드 코드 엔진의 새로운 패치 및 성능 버전을 자동 추적하여 강제 업데이트합니다."
  meta: "claude update"
- title: "설정 구성 관리"
  desc: "자동 파일 편집 권한 범위 및 네트워크 프록시 값을 설정창 없이 CLI로 직접 셋업합니다."
  meta: "claude config set --key value"
- title: "MCP 서버 연동 추가"
  desc: "Model Context Protocol 서버를 등록하여 데이터베이스나 웹 서치 API를 연동 제어합니다."
  meta: "claude mcp add [mcp-name]"
:::

---

## 인터랙티브 쉘 내부의 주요 명령어 (Slash Commands)
기동된 대화방 쉘 내부에서 사용할 수 있는 전용 명령어 리스트입니다.

::: icon-grid cols=3
- icon: "❓"
  title: "/help"
  desc: "현재 세션에서 사용 가능한 모든 지시어 도움말 목록을 로출합니다."
- icon: "🧹"
  title: "/compact"
  desc: "이전의 장황한 대화 내역 코드를 요약 정리하여 API 입력 토큰 비용을 최소화합니다."
- icon: "🛠️"
  title: "/doctor"
  desc: "대화 중 권한 꼬임이나 네트워크 통신 지연 문제를 즉각적으로 내부 점검합니다."
- icon: "⚙️"
  title: "/settings"
  desc: "자동 파일 저장 승인 여부, 프롬프트 컬러 스키마 설정을 실시간 변경합니다."
- icon: "🚪"
  title: "/exit"
  desc: "대화 세션을 안전하게 정리하고 시스템 OS 터미널 쉘 환경으로 돌아갑니다."
- icon: "🔄"
  title: "/undo"
  desc: "방금 전 클로드 코드가 내 로컬 코드 파일에 수정을 가해 패치한 내용을 이전 상태로 즉각 되돌립니다."
:::

---

# 5. 실전 비즈니스 및 개발 활용 시나리오
웹 포털과 CLI 에이전트가 어떤 유기적 시너지를 내며 실제 개발 및 프로젝트 생산성을 극대화하는지 사례로 알아봅니다.

## 프로젝트를 활용한 기획/보고서 작성 워크플로우
Claude 웹북 포털을 기획실로 전환하여 복잡한 정부 정책 기획서 초안을 조립해 내는 비즈니스 적용 3단계입니다.

::: step-list
- title: "1단계: 시스템 프롬프트 역할 고정"
  desc: "기획서 양식과 문장 정규화 규칙을 시스템 지시어로 탑재합니다."
- title: "2단계: SKILL.md 및 참고 파일 업로드"
  desc: "과거 모범 보고서 파일과 한글 hwp x 변환 스킬 문서를 업로드해 지식 컨텍스트를 고정합니다."
- title: "3단계: 대화형 기필 및 팀 협업 공유"
  desc: "출력물을 확인하여 아티팩트 창에서 수정한 뒤, 프로젝트 공유 링크로 팀에 전송합니다."
:::

---

## 레거시 디버깅 및 테스트 자동화 (Claude Code)
CLI 에이전트가 코드베이스 구조를 파악하고, 코드를 패치한 뒤, 테스트 검증과 깃 커밋까지 자율 질주하는 일지입니다.

::: step-list
- title: "1. 코드 탐색"
  desc: "`claude \"이 프로젝트의 DB 예외 로직의 위치를 찾아서 설명해줘\"`"
- title: "2. 파일 부분 수정 (Diff Patch)"
  desc: "스스로 `App.tsx`를 파싱하여 아래의 안전 코드로 정밀 부분 수정(Diff Patch)을 가합니다."
- title: "3. 테스트 실행 검증"
  desc: "스스로 `npm run test`를 기동하여 변경 사항이 기존 유닛 테스트들을 다 패스하는지 모니터링합니다."
- title: "4. 버전 관리 커밋 위임"
  desc: "`claude \"변경된 내용에 맞는 커밋 코멘트를 달아서 git 커밋해줘\"`를 통해 버전 등록 완료."
:::

---

## 코드 수정 시뮬레이션 및 Git 변경 이력
에이전트가 `App.tsx` 파일을 부분 패치하고 Git 커밋 트리에 등록한 결과 화면 예시입니다.

::: editor-box
- title: "src/App.tsx"
  tag: "typescript"
  desc: |
    // DB 커넥터 예외 보완
    <<<<<<< ORIGINAL
    db.connect(url);
    =======
    try {
      db.connect(url);
    } catch (e) {
      logger.critical("DB 연결 실패, 백업 풀 가동", e);
      db.connectBackupPool();
    }
    >>>>>>> UPDATED
:::

::: git-flow
- title: "main"
  tag: "v1.0.0"
  meta: "기본 모듈 설계 완료"
  color: "#10B981"
- title: "feature/db-backup"
  tag: "Commit 992"
  meta: "DB 연결 실패 예외 로직 자동 패치 완료|npm run test 검증 통과"
  color: "#3B82F6"
:::
