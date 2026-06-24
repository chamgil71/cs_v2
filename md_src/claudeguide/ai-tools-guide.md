---
title: "AI 도구 학습 가이드"
subtitle: "Claude를 중심으로 주요 AI 플랫폼 및 연계 도구 전반 이해"
badge: "2026 실전 학습 노트"
style: "custom-blue"
logo: "🤖"
titleSize: 22
bodySize: 12
stats:
  - value: "13개 챕터"
    label: "단계별 학습 구성"
  - value: "5대 플랫폼"
    label: "Claude · Gemini · GPT 등"
  - value: "14가지"
    label: "실전 레슨런 원칙"
  - value: "파이프라인"
    label: "연계 자동화 예시 4종"
done:
  title: "🎉 AI 도구 마스터 가이드 완성!"
  subtitle: "Claude 웹부터 에이전틱 코딩, 레슨런 14가지, 서비스 연결·조립까지. 백문이 불여일견, 백견이 불여일타, 백타가 불여일문 !!"
  ctaLabel: "Claude 공식 문서"
  ctaUrl: "https://docs.anthropic.com"
---

## 목차

::: chapter-list
- icon: "01"
  title: "Claude 플랫폼 전체 구조"
  desc: "3종 접근 채널 · 플랜별 기능 비교"
  tag: "기반"
- icon: "02"
  title: "웹 Claude 기본 사용법"
  desc: "설정 4항목 · 아티팩트 · 프로젝트"
  tag: "실습"
- icon: "03"
  title: "Claude Desktop"
  desc: "Desktop vs 웹 차이 · MCP 서버 등록 · 주요 MCP 목록"
  tag: "설치"
- icon: "04"
  title: "Claude Code (CLI)"
  desc: "설치·슬래시 명령 · CLAUDE.md · 에이전틱 동작 흐름"
  tag: "개발"
- icon: "05"
  title: "Claude 활용 전략"
  desc: "지침 4요소 · 스킬 등록 · 커넥터 활용"
  tag: "전략"
- icon: "06"
  title: "Claude 고급 기능"
  desc: "Cowork 협업 · 루틴 자동화 · 디자인 도구"
  tag: "고급"
- icon: "07"
  title: "에이전틱 코딩 도구 비교"
  desc: "5대 도구 상세 비교 · 상황별 선택 가이드"
  tag: "비교"
:::

---

## 목차 (계속)

::: chapter-list
- icon: "08"
  title: "다른 AI 플랫폼"
  desc: "Gemini · ChatGPT · Perplexity · 기타 AI"
  tag: "비교"
- icon: "09"
  title: "유용한 보조 도구"
  desc: "핵심 설치 도구 · 유틸리티 7선"
  tag: "도구"
- icon: "10"
  title: "프로젝트 연계 파이프라인"
  desc: "Wiki · 뉴스 자동화 · 슬라이드 · AI 비교 4종"
  tag: "파이프라인"
- icon: "11"
  title: "AI 협업 레슨런"
  desc: "설계·기록·실행·소통 — 14가지 실전 원칙"
  tag: "레슨런"
- icon: "12"
  title: "설계와 구조화"
  desc: "단편 질답 → 구조화 · SKILL.md 재사용 설계"
  tag: "설계"
- icon: "13"
  title: "서비스 연결과 조립"
  desc: "API · MCP · 웹훅 · 문서 자동 배포 파이프라인"
  tag: "연결"
- icon: "✦"
  title: "맺음말"
  desc: "백문이 불여일견 · 백견이 불여일타 · 백타가 불여일문"
  tag: "결론"
:::

---

# 1. Claude 플랫폼 전체 구조

Claude는 Anthropic이 만든 AI 어시스턴트로, 접근 방식에 따라 세 가지 형태로 나뉜다. 목적에 맞는 진입 채널을 선택하는 것이 첫 번째 단계다.

## 3종 접근 채널 비교

::: compare-grid cols=3
- title: "웹 Claude (claude.ai)"
  desc: "브라우저에서 즉시 사용. 가장 쉬운 진입 방법으로 별도 설치 없이 로그인만 하면 된다. 아티팩트·프로젝트·커넥터 등 주요 기능을 모두 UI로 조작한다."
  meta: "설치 불필요|아티팩트 미리보기|프로젝트·커넥터 지원|파일 첨부·음성 입력"
  color: "#6366F1"
- title: "Claude Desktop"
  desc: "Mac / Windows 전용 앱. 웹과 동일한 계정으로 사용하지만 MCP 서버 연결이 핵심 차이점이다. 로컬 파일 시스템, Notion, GitHub 등 외부 서비스를 직접 제어한다."
  meta: "MCP 서버 연결|로컬 파일 접근|파일 드래그앤드롭|Alt+Space 글로벌 호출"
  color: "#10B981"
  featured: "true"
- title: "Claude Code (CLI)"
  desc: "터미널에서 실행하는 에이전틱 코딩 도구. 파일을 읽고 수정하고, 테스트를 실행하며, Git을 조작하는 자율적 방식으로 동작한다. 개발자 전용 환경."
  meta: "npm install -g|파일 자동 수정|터미널 명령 실행|CLAUDE.md 프로젝트 지침"
  color: "#F59E0B"
:::

---

## Claude 플랜 구조

::: plan-grid cols=4
- title: "Free"
  tag: "무료"
  meta: "하루 제한 메시지|Sonnet 모델|기본 기능"
  desc: "$0 / 월"
- title: "Pro"
  tag: "추천"
  meta: "더 많은 메시지 (5시간 단위 리셋)|Opus · Sonnet 선택|프로젝트 기능|확장 사고 모드"
  desc: "$20 / 월"
  featured: "true"
  color: "#6366F1"
- title: "Max"
  tag: "Heavy User"
  meta: "5× ~ 20× 더 많은 사용량|우선 처리|API 연동 최적"
  desc: "$100 ~ $200 / 월"
- title: "Team / Enterprise"
  tag: "조직"
  meta: "관리자 콘솔|데이터 비학습 보장|SSO 지원"
  desc: "별도 문의"
:::

---

# 2. 웹 Claude 기본 사용법

## 설정 (Settings) 4가지 핵심 항목

좌측 하단 프로필 아이콘 클릭 → **Settings** 진입 후 각 탭에서 설정한다.

::: columns-grid cols=2
- title: "이름 · 기본 지침 (Profile 탭)"
  desc: |
    - Name 필드: Claude가 부를 이름 입력
    - "What should Claude know about you?": 직업·관심사·언어 선호
    - "How would you like Claude to respond?": 응답 스타일 고정
  meta: "저장 즉시 신규 대화부터 반영|프로젝트 지침과 충돌 시 프로젝트 우선"
- title: "사용량 보기 (Account 탭)"
  desc: |
    - Settings → Account → Usage 항목
    - 현재 메시지 사용량·남은 양 숫자로 표시
    - Pro: 5시간 단위 리셋 / Max: 더 넉넉한 풀
  meta: "사용량 초과 시 속도 저하 또는 차단|Max 플랜 업그레이드로 해결"
- title: "커넥터 (Integrations 탭)"
  desc: |
    - Settings → Integrations
    - 각 서비스 옆 Connect 버튼 클릭
    - OAuth 인증 → 권한 허용 → 연결 완료
    - 이후 대화에서 "내 캘린더 일정 보여줘" 직접 조회 가능
  meta: "Google Drive · Gmail · Google Calendar 지원|연결 해제도 같은 탭에서 가능"
- title: "Claude Code 연동 (Claude Code 탭)"
  desc: |
    - Claude Code CLI 설치 후 탭 표시됨
    - 웹 세션과 CLI 세션 동기화 여부 설정
    - 프로젝트 단위 연동 옵션 제공
  meta: "설치 명령: npm install -g @anthropic-ai/claude-code|터미널에서 claude 입력 후 브라우저 인증"
:::

---

## 아티팩트 (Artifacts) 활용법

대화 중 Claude가 생성한 독립 실행 가능한 결과물. 채팅창 오른쪽 별도 패널에 표시된다.

::: step-list
- title: "생성 요청"
  desc: "\"HTML로 할일 관리 앱 만들어줘\" 또는 \"SVG로 로고 그려줘\" 같이 구체적으로 요청한다. 아티팩트가 생성되면 자동으로 우측 패널이 열린다."
  color: "#6366F1"
- title: "Preview / Code 전환"
  desc: "패널 상단 탭에서 Preview(실행 화면)와 Code(소스 코드)를 자유롭게 전환한다. 미리보기 상태에서 직접 클릭·입력하며 동작을 확인한다."
  color: "#10B981"
- title: "후속 수정 요청"
  desc: "\"버튼 색을 파란색으로 바꿔줘\", \"모바일에서도 잘 보이게 해줘\" 식으로 채팅에 계속 입력하면 아티팩트가 실시간 업데이트된다."
  color: "#F59E0B"
- title: "저장 및 공유"
  desc: "우측 상단 Copy 버튼으로 코드 복사, Download 버튼으로 파일 저장. Publish 버튼 클릭 시 공개 URL 생성 → 타인과 링크 공유 가능."
  color: "#EC4899"
:::

::: alert-box tip
- title: "아티팩트 활용 예시"
  desc: "간단한 포트폴리오 페이지 뼈대 · 엑셀 데이터 붙여넣기 → 차트 즉시 생성 · 발표용 인터랙티브 슬라이드 · 계산기·게임 등 미니 웹앱"
:::

---

## 프로젝트 (Projects) 3단계 설정

관련 대화를 하나로 묶고 공통 지침·파일을 공유하는 기능. 분야별 전문 AI처럼 만들 수 있다.

::: step-flow
- icon: "1️⃣"
  title: "프로젝트 생성"
  desc: "좌측 사이드바 Projects → + New Project → 이름 입력"
- icon: "→"
- icon: "2️⃣"
  title: "지침 설정"
  desc: "Edit 클릭 → 텍스트 박스에 전용 지침 입력 → Save"
- icon: "→"
- icon: "3️⃣"
  title: "파일 업로드"
  desc: "+ Add content → PDF·Word·코드 파일 등록 (최대 200MB)"
:::

::: alert-box tip
- title: "프로젝트 지침 예시"
  desc: "\"모든 응답은 불릿 포인트로 정리해줘. 전문 용어는 괄호 안에 한국어 설명을 달아줘. 분량은 A4 1장 이내로.\" — 이 프로젝트 내 모든 대화에 자동 적용된다."
:::

---

## 스킬 (Skills) — 슬래시로 호출하는 능력 단위

Settings → Integrations → **Skills** 탭에서 관리. 대화창에서 `/`를 입력하면 현재 활성화된 스킬 목록이 자동완성으로 표시된다.

::: columns-grid cols=2
- title: "스킬이란?"
  desc: |
    - 특정 업무에 최적화된 프롬프트 단위
    - / 입력 시 목록에서 선택하거나 이름 검색
    - 플러그인 설치 시 해당 스킬이 자동 추가됨
    - 프로젝트 지침보다 가볍고 즉시 호출 가능
  color: "#6366F1"
- title: "활용 흐름"
  desc: |
    - Settings → Integrations → Skills 탭에서 목록 확인
    - 대화창 / 타이핑 → 원하는 스킬 선택
    - 선택 즉시 해당 컨텍스트로 대화 시작
    - 문맥에 따라 Claude가 자동 적용하기도 함
  color: "#10A37F"
:::

::: alert-box tip
- title: "스킬 관리"
  desc: "Settings → Integrations → Skills 탭에서 활성 스킬 수 확인 및 관리. 플러그인을 제거하면 해당 스킬도 함께 비활성화된다."
:::

---

## 커넥터 (Connectors) — 외부 서비스 실시간 연결

Settings → Integrations → **Connectors** 탭. MCP 기반으로 웹 Claude에서 외부 서비스 데이터를 직접 조회·제어. 디렉터리에 수십~수백 종이 등록되어 있고 계속 늘어나는 중이며, 아래는 대표 예시다.

::: icon-grid
- icon: "💬"
  title: "Slack"
  desc: "채널 메시지 조회·발송, 스레드 요약"
  tag: "협업"
- icon: "📝"
  title: "Notion"
  desc: "페이지 읽기·쓰기, 데이터베이스 조회"
  tag: "문서"
- icon: "🎨"
  title: "Figma"
  desc: "컴포넌트 생성, 디자인 컨텍스트 읽기"
  tag: "디자인"
- icon: "🖌️"
  title: "Canva"
  desc: "디자인 초안 생성 및 편집"
  tag: "디자인"
- icon: "📊"
  title: "HubSpot"
  desc: "리드·거래·연락처 조회 및 생성"
  tag: "CRM"
- icon: "🔍"
  title: "Ahrefs"
  desc: "키워드 분석, 경쟁사 백링크 조사"
  tag: "SEO"
- icon: "📈"
  title: "Amplitude"
  desc: "이벤트·퍼널·리텐션 분석"
  tag: "분석"
- icon: "🐙"
  title: "GitHub"
  desc: "저장소 조회, PR·이슈 관리"
  tag: "개발"
- icon: "📋"
  title: "Jira"
  desc: "이슈 생성·조회, 스프린트 현황 확인"
  tag: "관리"
- icon: "🎫"
  title: "Zendesk"
  desc: "티켓 조회, 답변 초안 작성"
  tag: "지원"
- icon: "📐"
  title: "Linear"
  desc: "이슈 생성, 프로젝트 현황 확인"
  tag: "트래킹"
:::

::: alert-box warn
- title: "주의"
  desc: "커넥터 연결 후 Claude는 해당 서비스의 실제 데이터에 접근한다. 민감 정보가 포함된 서비스는 연결 범위와 권한을 먼저 확인할 것."
:::

---

## 플러그인 (Plugins) — 스킬 묶음 패키지

Settings → Integrations → **Plugins** 탭. Anthropic 공식 또는 파트너사가 제공하는 목적별 기능 패키지. 설치 시 해당 플러그인의 스킬이 자동으로 추가된다.

::: tool-list
- icon: "📣"
  title: "Marketing (Anthropic 공식)"
  desc: "마케팅 채널 전반의 콘텐츠 제작·캠페인 기획·성과 분석. 설치 시 8개 스킬 커맨드 추가됨."
  tag: "공식 플러그인"
  meta: "/brand-review — 브랜드 일관성 검토|/campaign-plan — 멀티채널 캠페인 기획|/content-creation — SEO 블로그 포스트 작성|/draft-content — 콘텐츠 초안 생성|/email-sequence — 이메일 시퀀스 작성|/seo-audit — SEO 감사 및 갭 분석|/competitive-brief — 경쟁사 포지셔닝 분석|/performance-report — 채널별 성과 리포트"
  color: "#10A37F"
:::

::: summary-box
- title: "플러그인 → 스킬 → 커넥터 관계"
  desc: "플러그인을 설치하면 스킬이 추가된다. 스킬은 /커맨드로 호출한다. 커넥터는 실시간 외부 데이터 연결이다. 세 가지를 조합하면 Claude가 실제 업무 데이터를 보면서 전문 기능을 수행한다."
:::

---

# 3. Claude Desktop

## Desktop vs 웹 차이점

::: compare-grid cols=2
- title: "Claude Desktop만 가능한 것"
  desc: "MCP 서버 연결로 로컬 파일·외부 서비스를 직접 제어한다. Documents 폴더 읽기, Notion 페이지 쓰기, GitHub 저장소 조작 등 API 수준의 작업이 대화 한 줄로 가능해진다."
  meta: "로컬 파일 시스템 접근|Notion · GitHub · Slack 제어|SQLite DB 조회|브라우저 자동화(Puppeteer)"
  color: "#10B981"
- title: "웹 Claude만 가능한 것"
  desc: "별도 설치 없이 즉시 사용. Google 커넥터(Drive · Gmail · Calendar)는 웹 전용 OAuth 방식이라 Desktop에서는 MCP로 대체한다."
  meta: "설치 없이 즉시 사용|Google 공식 커넥터|Publish로 공개 URL 생성|모바일 브라우저 접근"
  color: "#6366F1"
:::

---

## MCP 서버 등록 방법

상단 메뉴 → Claude → Settings (Mac: Cmd+,) → Developer 탭 → Edit Config 클릭 → `claude_desktop_config.json` 파일 편집 → 저장 후 Desktop 재시작.

::: editor-box
- title: "claude_desktop_config.json"
  tag: "json"
  desc: |
    {
      "mcpServers": {
        "filesystem": {
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-filesystem",
                   "C:/Users/yourname/Documents"]
        },
        "notion": {
          "command": "npx",
          "args": ["-y", "@notionhq/notion-mcp-server"],
          "env": {
            "NOTION_API_TOKEN": "your_token_here"
          }
        },
        "github": {
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-github"],
          "env": {
            "GITHUB_PERSONAL_ACCESS_TOKEN": "your_pat_here"
          }
        }
      }
    }
:::

---

## 주요 MCP 서버 목록

::: feature-grid cols=3
- icon: "📁"
  title: "server-filesystem"
  tag: "로컬 파일"
  desc: "지정 폴더의 파일 읽기·쓰기. \"Desktop 폴더 파일 목록 보여줘\" 가능."
- icon: "📋"
  title: "notion-mcp-server"
  tag: "Notion"
  desc: "Notion 페이지 읽기·쓰기. 대화 내용을 바로 Notion에 올릴 수 있다."
- icon: "🐙"
  title: "server-github"
  tag: "GitHub"
  desc: "저장소 파일 조회·PR 생성·이슈 관리를 대화로 수행한다."
- icon: "💬"
  title: "server-slack"
  tag: "Slack"
  desc: "채널 메시지 조회 및 발송. \"팀 채널에 업무 공유해줘\" 가능."
- icon: "🌐"
  title: "server-puppeteer"
  tag: "브라우저"
  desc: "Headless Chrome 자동화. 웹 스크래핑·폼 자동 입력 등에 활용."
- icon: "🗄️"
  title: "server-sqlite"
  tag: "데이터베이스"
  desc: "로컬 SQLite DB 직접 조회. 자연어로 SQL 없이 데이터 분석 가능."
:::

---

# 4. Claude Code (CLI)

## 설치 및 첫 실행

::: cmd-box
- title: "Claude Code 설치 및 실행"
  tag: "bash"
  desc: |
    # 전역 설치 (Node.js 18 이상 필요)
    npm install -g @anthropic-ai/claude-code
    
    # 프로젝트 디렉토리로 이동 후 실행
    cd my-project
    claude
    
    # 첫 실행 시 브라우저 인증창 자동 오픈 → Claude 계정으로 로그인
:::

---

## 주요 슬래시 명령어

::: columns-grid cols=3
- title: "대화 관리"
  desc: "세션 컨텍스트와 토큰을 제어한다."
  meta: "/help : 명령어 전체 목록|/clear : 컨텍스트 초기화|/compact : 대화 요약 압축 (토큰 절약)|/exit : 세션 종료"
- title: "작업 실행"
  desc: "코드·앱을 직접 실행하고 검증한다."
  meta: "/run : 앱 실행 및 동작 확인|/review : 현재 브랜치 PR 리뷰|/code-review : 변경 코드 리뷰|/verify : 변경사항 실제 동작 검증"
- title: "설정 · 자동화"
  desc: "모델·권한·반복 작업을 관리한다."
  meta: "/config : 모델·테마 설정 변경|/memory : 기억 파일 편집|/schedule : 반복 작업 예약|/fast : Opus 고속 모드 전환"
:::

---

## CLAUDE.md (프로젝트 지침 파일)

프로젝트 루트에 `CLAUDE.md` 파일을 만들면 Claude Code가 항상 참조한다. 팀원 모두가 공유하는 AI 행동 규칙서 역할을 한다.

::: editor-box
- title: "CLAUDE.md"
  tag: "markdown"
  desc: |
    # 프로젝트 지침
    
    ## 기술 스택
    - Python 3.11, FastAPI, PostgreSQL
    - 테스트: pytest / 린트: ruff, mypy
    
    ## 코딩 규칙
    - 모든 함수에 타입 힌트 필수
    - 커밋 메시지: feat: / fix: / docs: 접두어 사용
    - 영어 변수명, 주석은 한국어
    
    ## 절대 금지
    - print() 대신 logging 사용
    - 하드코딩된 API 키 금지 (.env 파일 활용)
    - 테스트 없는 기능 추가 금지
:::

---

## Claude Code 에이전틱 동작 흐름

::: step-list
- title: "파일 탐색 및 구조 파악"
  desc: "프로젝트 디렉토리를 자동 스캔하여 package.json, tsconfig.json 등을 읽고 기술 스택을 파악한 뒤 수정 대상 파일을 열람한다."
  color: "#6366F1"
- title: "정밀 부분 패치 (Diff Patch)"
  desc: "전체 파일을 재작성하지 않고, 수정이 필요한 라인만 정확히 포인팅하여 오리지널-업데이트 블록 구성으로 코드 일부만 안전하게 교체한다."
  color: "#10B981"
- title: "빌드 및 테스트 자동 실행"
  desc: "수정된 소스가 컴파일에 실패하지 않는지 npm run build, pytest 등을 CLI에서 직접 실행하여 통과 여부를 검증한다."
  color: "#F59E0B"
- title: "자율 디버깅 루프"
  desc: "에러 로그가 터미널에 수신되면 원인을 스스로 추적하여 재패치 후 재검증하는 피드백 루프를 완수한다. 사람이 개입하지 않아도 된다."
  color: "#EC4899"
:::

---

# 5. Claude 활용 전략

## 지침 작성의 4요소

효과적인 지침은 **역할 + 맥락 + 형식 + 제약** 네 가지를 모두 포함한다.

::: feature-grid cols=4
- icon: "👤"
  title: "역할 (Persona)"
  tag: "누구로 행동할지"
  desc: "\"너는 10년 경력의 UX 라이터야. 기술 문서를 일반인도 쉽게 읽도록 바꿔줘.\""
- icon: "🗺️"
  title: "맥락 (Context)"
  tag: "배경 정보"
  desc: "\"우리 서비스는 40~60대 직장인 대상 건강관리 앱이야. 사용자들은 IT에 익숙하지 않아.\""
- icon: "📄"
  title: "형식 (Format)"
  tag: "출력 형태"
  desc: "\"결과는 마크다운 표로 정리하고, 각 항목에는 예시를 하나씩 포함해줘.\""
- icon: "🚫"
  title: "제약 (Constraint)"
  tag: "하지 말아야 할 것"
  desc: "\"전문 의학 용어는 쓰지 마. 영어는 괄호 안에만 병기해.\""
:::

---

## 지침 만드는 실전 흐름

::: step-list
- title: "먼저 자연어로 질문해보기"
  desc: "원하는 작업을 평소 말하듯 자유롭게 입력한다. 결과가 마음에 안 들면 \"더 짧게\", \"다른 형식으로\" 식으로 방향을 조정한다."
  color: "#6366F1"
- title: "만족스러운 결과 확보"
  desc: "원하는 수준의 결과가 나오면, \"방금 내가 준 요청을 재사용 가능한 지침으로 정리해줘\"라고 요청한다. Claude가 구조화된 지침 텍스트를 생성해준다."
  color: "#10B981"
- title: "지침 등록"
  desc: "정리된 지침을 프로젝트 지침(웹 Claude) 또는 CLAUDE.md(Claude Code)에 붙여넣는다. 이후 모든 대화에 자동 적용된다."
  color: "#F59E0B"
:::

---

## 스킬(Skill) 등록 및 파이프라인

Claude Code에서 반복 작업을 슬래시 명령어로 등록하는 기능. `.claude/commands/<이름>.md` 파일로 정의한다.

::: workflow-flow
- icon: "📝"
  title: "/report"
  meta: "보고서 초안 생성"
- icon: "✏️"
  title: "/refine"
  meta: "문체 정제"
- icon: "📊"
  title: "/export-pptx"
  meta: "슬라이드 변환"
- icon: "📬"
  title: "/send-mail"
  meta: "이메일 발송"
:::

---

## 커넥터 활용 예시

::: tool-list
- icon: "📅"
  title: "Google Calendar 연결 후"
  tag: "웹 Claude"
  desc: "대화에서 일정을 직접 조회·추가한다."
  meta: "\"다음 주 미팅 일정 전체 요약해줘\"|\"내일 오후 2시에 팀 회의 추가해줘\"|\"이번 달 외부 미팅이 몇 번이야?\""
- icon: "📋"
  title: "Notion 연결 후"
  tag: "웹 Claude 또는 MCP"
  desc: "Notion 데이터를 읽고 새 내용을 추가한다."
  meta: "\"작업 목록에서 미완료 항목만 골라줘\"|\"이 내용을 TIL 페이지에 추가해줘\"|\"회의록 템플릿으로 오늘 내용 정리해줘\""
- icon: "📁"
  title: "로컬 파일 MCP 연결 후"
  tag: "Claude Desktop"
  desc: "PC 파일을 자연어로 조작한다."
  meta: "\"Desktop 폴더 파일 목록 보여줘\"|\"이 PDF 요약해서 새 텍스트 파일로 저장해줘\"|\"Downloads에서 이번 달 파일만 정렬해줘\""
:::

---

# 6. Claude 고급 기능

## Claude Cowork (협업 도구 연동)

::: icon-grid cols=2
- icon: "📊"
  title: "Claude + Excel / Google Sheets"
  desc: |
    - 파일 첨부 후 "전월 대비 증감률 구하는 수식 알려줘"
    - 데이터 붙여넣기 → 피벗 구조 설계, 차트 제안
    - MCP 연결 시 파일 직접 읽기·수정 가능
- icon: "📄"
  title: "Claude + Google Docs / Word"
  desc: |
    - 문서 첨부 후 요약·교정·번역·재구성 요청
    - Google Drive MCP 연결 시 문서 직접 읽기·쓰기
    - "이 기획서를 A4 2장 요약본으로 만들어줘"
- icon: "📁"
  title: "폴더 정리 자동화"
  desc: |
    - 파일 시스템 MCP 연결 후
    - "Downloads 폴더를 날짜별·유형별로 정리해줘"
    - Python 스크립트 생성 후 직접 실행하는 방식도 가능
- icon: "💬"
  title: "카카오 메모 연동 (제한적)"
  desc: |
    - PlayMCP(카카오 공식 MCP)는 카카오톡 '나와의 채팅방'에 메모를 보내는 기능만 제공
    - 타인과의 대화 조회·발송은 지원하지 않음 (자기 자신에게만 전송 가능)
    - 톡캘린더·카카오맵·선물하기 등 다른 카카오 서비스 MCP는 별도 제공
    - "오늘 정리한 할 일을 나와의 채팅방으로 보내줘" 정도가 현실적인 활용 범위
:::

---

## Claude 루틴 (정기 자동화)

Claude Code의 `/schedule` 기능으로 반복 작업을 클라우드 에이전트로 등록. PC가 꺼져 있어도 자동 실행된다.

::: step-list
- title: "/schedule 입력"
  desc: "Claude Code 터미널에서 /schedule 입력하면 루틴 등록 대화가 시작된다."
  color: "main"
- title: "작업·주기 지정"
  desc: "작업 내용(자연어로 설명)과 실행 시각(cron 표현식 또는 \"매일 오전 8시\"), 반복 주기를 지정한다."
  color: "sub"
- title: "클라우드 등록 완료"
  desc: "/schedule list로 등록된 루틴 목록 확인. /schedule delete로 삭제. 등록 후에는 로컬 PC 없이 클라우드에서 자동 실행."
  color: "deep"
:::

::: summary-box
- title: "루틴 활용 예시"
  desc: "매일 오전 8시: 뉴스 헤드라인 수집 → 주요 일정 정리 → 이메일 발송 자동화"
  meta: "매주 월요일 주간 보고 초안 생성|매일 밤 GitHub 이슈 요약|정기 데이터 백업"
:::

---

## Claude 디자인

::: feature-grid cols=3
- icon: "🎨"
  title: "Figma MCP 연동"
  tag: "코드 ↔ 디자인"
  desc: "Claude Desktop에 Figma MCP 연결 후 \"이 컴포넌트를 Figma에 생성해줘\" 형태로 디자인 자동화. 코드→디자인, 디자인→코드 양방향 지원."
- icon: "🖥️"
  title: "아티팩트 프로토타이핑"
  tag: "즉시 미리보기"
  desc: "웹 Claude에서 HTML/CSS 아티팩트로 빠른 UI 프로토타입 생성. \"모바일 앱 로그인 화면 HTML로 만들어줘\" → 즉시 미리보기 + 수정 가능."
- icon: "✏️"
  title: "SVG 벡터 즉시 생성"
  tag: "화질 무손실"
  desc: "\"미니멀한 머그잔 SVG 아이콘 코드 만들어줘\" → 크기를 조절해도 깨지지 않는 벡터 아이콘 즉시 획득. 로고·아이콘에 활용."
:::

---

# 7. 에이전틱 코딩 도구 비교

에이전틱 코딩: AI가 코드를 생성하는 것을 넘어, 파일을 읽고 수정하며 테스트와 디버깅까지 자율적으로 수행하는 방식.

---

## 5대 에이전틱 코딩 도구

::: tool-list
- icon: "🤖"
  title: "Claude Code (Anthropic)"
  tag: "터미널 CLI"
  desc: "npm install -g 후 claude 명령어로 실행. 대용량 컨텍스트(Opus/Sonnet 4.6 기준 표준 요금으로 최대 1M 토큰), CLAUDE.md 프로젝트 지침, 메모리 시스템, 훅 자동화가 강점."
  meta: "VS Code 익스텐션 지원|JetBrains 플러그인 지원|Pro 구독 필요 ($20/월)|MCP 생태계 연동"
  color: "#6366F1"
- icon: "⚡"
  title: "Cursor"
  tag: "독자 AI IDE"
  desc: "VS Code 기반 독자적 AI IDE (별도 앱 설치). Ctrl+K 인라인 편집, Ctrl+L 채팅 사이드바. Composer 모드로 멀티 파일 동시 수정."
  meta: "전체 코드베이스 인덱싱|파일 간 참조 이해도 높음|무료(제한) / Pro $20/월"
  color: "#D97757"
- icon: "🐙"
  title: "GitHub Copilot"
  tag: "VS Code 익스텐션"
  desc: "VS Code 익스텐션 설치 후 코드 작성 중 자동 완성 제안(Tab 수락). Copilot Chat으로 코드 설명·수정 요청. Copilot Workspace로 이슈→PR 자동화."
  meta: "개인 $10/월 · 비즈니스 $19/월|GitHub 계정만 있으면 즉시 사용"
  color: "#10B981"
- icon: "🔷"
  title: "Gemini CLI / Project IDX"
  tag: "Google 생태계"
  desc: "gemini 명령어로 터미널 실행. Google 서비스(Drive·Docs·Sheets) 네이티브 연동. Project IDX는 브라우저 기반 클라우드 IDE."
  meta: "Gemini 3 계열(3.5 Flash·3.1 Pro)로 빠른 응답|무료 사용량 넉넉함|Google 생태계 활용 시 강점"
  color: "#F59E0B"
- icon: "🤍"
  title: "OpenAI Codex / ChatGPT Canvas"
  tag: "OpenAI"
  desc: "codex 명령어로 터미널 실행. ChatGPT Canvas는 웹 내 코드 편집 전용 패널. Python 코드 실행 환경 내장."
  meta: "GPT-5.5 기반|광범위한 언어·프레임워크|Python 인터프리터 내장"
  color: "#10A37F"
:::

---

## 도구 선택 가이드

::: level-grid
- title: "처음 AI 코딩 시작"
  desc: "GitHub Copilot 권장. VS Code가 익숙하다면 익스텐션 하나 설치로 즉시 시작. 비용 부담 없이 효과를 빠르게 체감."
  note: "VS Code + Copilot → 자동완성 경험 후 → 더 강력한 도구로 이동"
  color: "#10B981"
- title: "전체 프로젝트 자율 작업"
  desc: "Claude Code 권장. 파일 탐색·수정·테스트·커밋까지 자율 실행. CLAUDE.md로 팀 규칙 공유 가능."
  note: "Pro 구독 필요. 대형 프로젝트일수록 효과 극대화"
  color: "#6366F1"
- title: "VS Code 기반 강력한 AI"
  desc: "Cursor 권장. 코드베이스 전체를 인덱싱하여 파일 간 참조 이해도가 높다. Composer 모드로 멀티 파일 동시 수정."
  note: "무료 플랜으로 시작 후 Pro 전환 ($20/월)"
  color: "#D97757"
- title: "가끔 코드 질문"
  desc: "웹 Claude 또는 ChatGPT. 설치 없이 브라우저에서 코드 붙여넣기 후 질문. 빠르고 간편하지만 자율 실행은 불가."
  note: "자율 에이전트 기능 없음. 질문-답변 방식"
  color: "#F59E0B"
:::

---

# 8. 다른 AI 플랫폼

## Google Gemini

::: compare-grid cols=2
- title: "Gems (커스텀 AI)"
  desc: "좌측 사이드바 Gems → + New Gem → 이름·지침 입력·파일 업로드 → 저장. 이후 Gems 목록에서 클릭하면 전용 지침이 적용된 대화 시작. Claude 프로젝트와 동일한 개념."
  meta: "Claude 프로젝트와 유사한 개념|분야별 전문 AI 역할 부여|Super Gems(고급 기능) 지원"
  color: "#4285F4"
- title: "Deep Research (심층 리서치)"
  desc: "수십 개의 웹소스를 자율 탐색 후 구조화된 리포트 생성 (수분 소요). 출처를 명시하며 최신 정보를 반영한다. Perplexity의 심화 연구와 유사."
  meta: "수십 개 소스 자동 탐색|출처 인용 포함|최신 정보 반영|수분 소요 (긴 작업)"
  color: "#34A853"
:::

::: tool-list
- icon: "🔬"
  title: "Google AI Studio (aistudio.google.com)"
  tag: "개발자용"
  desc: "Gemini API 실험 환경. 온도·최대 토큰 등 파라미터 직접 조정, System Instruction 설정 후 동작 테스트, API 키 발급."
  meta: "무료 사용량 넉넉함|Gemini 3 계열 모델 포함|API 키 발급 무료"
- icon: "📓"
  title: "NotebookLM (notebooklm.google.com)"
  tag: "소스 기반 AI"
  desc: "PDF·문서·유튜브 URL·오디오를 소스로 등록하면 소스 내용만 기반으로 답변 (환각 최소화). Audio Overview: 등록 소스를 팟캐스트 형식으로 자동 변환."
  meta: "출처 외 내용 생성 안 함|강의·논문·책 공부에 최적|팟캐스트 자동 생성 (2인 대화)"
:::

---

## ChatGPT (OpenAI)

::: tool-list
- icon: "📁"
  title: "Projects (프로젝트)"
  tag: "지침 가능"
  desc: "좌측 사이드바 Projects → + New Project → 이름·지침 입력·파일 업로드. Claude 프로젝트와 동일한 개념으로 동작."
  meta: "지침(Instructions) 입력|파일 업로드 지원|프로젝트별 대화 분리"
- icon: "🤖"
  title: "GPTs (커스텀 AI 앱)"
  tag: "앱 스토어"
  desc: "GPT Explore에서 타인이 만든 GPT 사용 또는 직접 제작. My GPTs → Create a GPT → 지침·액션·파일 설정. 외부에 공개 배포 가능."
  meta: "전 세계 사용자가 만든 GPT 탐색|API 액션 연결 가능|무료·유료 GPT 혼재"
- icon: "🖼️"
  title: "GPT Image 2"
  tag: "이미지 생성"
  desc: "OpenAI의 차세대 이미지 모델. 2026년 5월 DALL-E 시리즈가 단계적으로 종료되며 이미지 생성을 대체. 텍스트 추가, 부분 수정(Inpainting), 한 프롬프트로 다중 이미지 생성 지원."
  meta: "텍스트→이미지 생성|이미지 부분 편집|스타일 변환"
- icon: "🔍"
  title: "심층 리서치 (Deep Research)"
  tag: "자율 웹 탐색"
  desc: "수십 분에 걸쳐 자율 웹 검색 후 긴 리포트 생성. Gemini의 Deep Research와 유사하지만 더 긴 작업 시간."
  meta: "최대 수십 분 소요|출처 링크 포함|Pro 플랜 필요"
:::

::: alert-box tip
- title: "개인 맞춤설정 (Personalization)"
  desc: "우측 상단 프로필 → Customize ChatGPT → Custom Instructions 탭: \"ChatGPT에게 알려줄 내용\"과 \"응답 방식\" 두 칸 입력. 모든 대화에 전역 적용."
:::

---

## Perplexity

검색 엔진과 AI를 결합한 플랫폼. 출처를 인용하며 최신 정보를 답변. 사실 확인이 필요할 때 유리하다.

::: feature-grid cols=3
- icon: "🏠"
  title: "Spaces (지침 가능)"
  tag: "커스텀 공간"
  desc: "좌측 Spaces → + New Space → 이름·지침·파일 등록. 이 Space 내 질문은 지침이 적용된 전문 AI처럼 동작."
- icon: "🔬"
  title: "심화 연구 (Deep Research)"
  tag: "자율 탐색"
  desc: "수십 개 소스를 탐색 후 보고서 생성. 검색 범위를 학술·Reddit·YouTube·뉴스 등으로 지정 가능."
- icon: "🔢"
  title: "Compute"
  tag: "수학·과학"
  desc: "복잡한 수학·과학 문제 풀이 특화. 단계별 풀이 과정과 계산 결과를 함께 제공."
:::

---

## 기타 AI 플랫폼

::: tool-list
- icon: "🤖"
  title: "Grok (xAI)"
  tag: "X 통합"
  desc: "X(트위터) 실시간 데이터에 직접 접근. SNS 트렌드·여론 분석에 강점. 검열이 상대적으로 적어 직접적인 답변."
  meta: "X 실시간 데이터 접근|다른 AI보다 직접적인 답변|이미지 생성(Aurora) 포함"
- icon: "⚙️"
  title: "Manus"
  tag: "멀티 에이전트"
  desc: "복잡한 멀티 스텝 태스크를 자율 실행. 브라우저·코드·파일을 동시에 조작. 사람처럼 PC를 쓰는 에이전트."
  meta: "브라우저 자동화 내장|파일·코드 동시 처리|장시간 자율 작업 가능"
- icon: "🔧"
  title: "Ollama (로컬 AI)"
  tag: "완전 오프라인"
  desc: "로컬 PC에서 오픈소스 LLM 실행. ollama pull llama3.2 후 ollama run llama3.2로 완전 오프라인 사용. API 서버로도 실행 가능."
  meta: "인터넷 불필요 (완전 오프라인)|무료 사용|Llama · Mistral · Qwen 등 지원|localhost:11434 API 서버"
:::

---

# 9. 유용한 보조 도구

## 설치하면 좋은 핵심 도구

::: tool-list
- icon: "🗒️"
  title: "Obsidian"
  tag: "로컬 지식 저장소"
  desc: "마크다운(.md) 기반 완전 로컬 노트 앱. 파일이 모두 텍스트로 저장되어 소유권이 완전히 보장된다. Claude Desktop MCP로 연결하면 \"내 노트에서 관련 내용 찾아줘\" 가능."
  meta: "무료 사용 가능|Obsidian Git 플러그인으로 자동 백업|Templater · Dataview 플러그인 유용|로컬 파일 → AI 참조 가능"
  color: "#7C3AED"
- icon: "🐙"
  title: "GitHub"
  tag: "코드 · 자동화"
  desc: "코드 버전 관리 + GitHub Actions CI/CD 파이프라인. main 브랜치에 push하면 자동으로 테스트·빌드·배포 실행. Claude Code와 깊이 통합(PR 생성·브랜치 관리)."
  meta: "무료 계정으로 무제한 저장소|GitHub Pages 정적 사이트 무료 호스팅|Actions로 자동화 파이프라인 구성"
  color: "#1F2937"
- icon: "💻"
  title: "VS Code"
  tag: "개발 IDE"
  desc: "가장 널리 쓰이는 개발 에디터. Claude Code 익스텐션 설치 후 IDE 내에서 Claude Code 직접 사용. Ctrl+` 으로 통합 터미널 열기 → claude CLI 실행."
  meta: "무료 오픈소스|Claude Code 익스텐션 공식 지원|GitLens · Prettier · ESLint 플러그인 추천"
  color: "#0078D4"
:::

---

## 유틸리티 도구

::: icon-grid cols=2
- icon: "📌"
  title: "Snipaste"
  desc: |
    강력한 화면 캡처 + 스티커 도구.
    - **F1**: 화면 캡처 시작 → 드래그로 영역 선택 → 화면에 고정(핀)
    - **F3**: 클립보드 내용을 화면에 스티커로 붙이기
    - Win+Shift+S보다 강력한 편집·주석 기능
    - 캡처 이미지를 Claude에 드래그앤드롭으로 바로 첨부 가능
- icon: "🌐"
  title: "Claude for Chrome (익스텐션)"
  desc: |
    어느 웹사이트에서나 Claude 사이드바 열기.
    - 웹페이지에서 텍스트 드래그 선택
    - 나타나는 Claude 아이콘 클릭
    - 사이드바에 선택한 텍스트 자동 입력
    - "요약해줘", "번역해줘" 즉시 가능
:::

::: feature-grid cols=3
- icon: "📹"
  title: "YouTube to NotebookLM"
  tag: "크롬 익스텐션"
  desc: "YouTube 영상을 NotebookLM 소스로 원클릭 추가. 영상 페이지에서 버튼 하나로 NotebookLM에 자동 등록."
- icon: "📋"
  title: "Grabit"
  tag: "크롬 익스텐션"
  desc: "웹페이지 내 원하는 요소를 마크다운으로 추출. 테이블·리스트·본문을 깔끔한 마크다운으로 변환."
- icon: "📄"
  title: "rHwp"
  tag: "크롬 익스텐션"
  desc: "HWP 파일을 웹에서 열람. 한글 뷰어 없이 HWP 파일 내용을 브라우저에서 바로 확인 가능."
:::

---

# 10. 프로젝트 연계 파이프라인 예시

## 개인 Wiki 사이트 구축

::: git-flow
- title: "Obsidian"
  tag: "노트 작성"
  meta: "마크다운으로 내용 작성|Obsidian Git 플러그인으로 자동 commit"
  color: "#7C3AED"
- title: "GitHub"
  tag: "버전 관리"
  meta: "push 감지 시 Actions 워크플로우 자동 트리거|코드 저장 + 이력 관리"
  color: "#1F2937"
- title: "Vercel"
  tag: "자동 배포"
  meta: "GitHub push 감지 → 빌드 자동 시작|Next.js 또는 Hugo/Jekyll 정적 사이트 빌드"
  color: "#000000"
- title: "Wiki 사이트"
  tag: "완성"
  meta: "업데이트마다 자동 반영|무료 도메인 또는 커스텀 도메인 연결 가능"
  color: "#10B981"
:::

---

## 시황 뉴스 자동화 파이프라인

::: git-flow
- title: "Claude 루틴"
  tag: "매일 오전 7시"
  meta: "Claude Code /schedule로 등록|PC 없이 클라우드에서 자동 실행"
  color: "#6366F1"
- title: "GitHub Actions"
  tag: "워크플로우 트리거"
  meta: "cron: '0 22 * * *' (UTC 기준)|뉴스 크롤링 스크립트 자동 실행"
  color: "#1F2937"
- title: "Claude API"
  tag: "뉴스 분석"
  meta: "헤드라인 수집 → 요약 및 시황 분석|중요도·카테고리별 자동 분류"
  color: "#6366F1"
- title: "다중 발송"
  tag: "배포 완료"
  meta: "Gmail 이메일 발송|텔레그램 Bot 메시지|SNS 자동 포스팅"
  color: "#10B981"
:::

---

## 문서→슬라이드 자동화 파이프라인

::: workflow-flow
- icon: "📝"
  title: "메모 작성"
  meta: "Obsidian 또는 텍스트"
- icon: "🤖"
  title: "Claude Code"
  meta: "구조화된 마크다운 정제"
- icon: "⚙️"
  title: "빌드 스크립트"
  meta: "MD → HTML/PPTX 변환"
- icon: "📊"
  title: "슬라이드"
  meta: "발표 자료 완성"
:::

---

## AI 플랫폼 빠른 비교

::: stat-grid cols=4
- icon: "1M"
  title: "Claude 컨텍스트"
  desc: "Opus/Sonnet 4.6, 표준 요금"
- icon: "1M"
  title: "Gemini 컨텍스트"
  desc: "Gemini 3.1 Pro 기준"
- icon: "✅"
  title: "Claude 강점"
  desc: "긴 문서 이해 · 에이전틱 코딩"
- icon: "✅"
  title: "Perplexity 강점"
  desc: "최신 정보 · 출처 인용 검색"
:::

::: summary-box
- title: "플랫폼별 최적 용도 요약"
  desc: "Claude: 긴 문서·코딩·자동화 / ChatGPT: 범용·GPTs 생태계 / Gemini: Google 연동·이미지·동영상 / Perplexity: 최신 정보·팩트 체크 / NotebookLM: 자료 기반 학습"
  meta: "목적에 따라 여러 도구를 조합하는 것이 핵심|Claude + Gemini + Perplexity 역할 분리 활용 권장"
:::

---

# 11. AI 협업 레슨런

실전 AI 협업에서 시행착오를 거쳐 정리한 14가지 핵심 원칙. 설계·역할 분리부터 프롬프트 기술까지.

---

## 레슨런 — 설계·구조 원칙

::: feature-grid cols=3
- icon: "🎯"
  title: "역할 분리"
  tag: "레슨런 #1"
  desc: "AI에게 설계를 위임하지 않는다. 설계는 사람이, 구현은 AI가."
- icon: "🔌"
  title: "파이프라인 설계"
  tag: "레슨런 #3"
  desc: "각 단계의 입출력 형식을 계약처럼 명시. 인터페이스가 바뀌어도 전체가 무너지지 않는다."
- icon: "⚙️"
  title: "설정·코드 분리"
  tag: "레슨런 #4"
  desc: "변하는 것(색상·문구·API)은 설정 파일로, 변하지 않는 것(로직·구조)은 코드로."
:::

---

## 레슨런 — 기록·자산 원칙

::: feature-grid cols=2
- icon: "📋"
  title: "실패 기록"
  tag: "레슨런 #2"
  desc: "오류 메시지와 실패한 시도를 반드시 기록한다. AI는 이전 대화를 기억하지 못한다. 오류 로그가 다음 세션의 출발점이 된다."
- icon: "💾"
  title: "원본 보존"
  tag: "레슨런 #5"
  desc: "복사 → 검증 → 삭제 순서를 지킨다. AI가 파일을 수정하기 전 항상 원본을 복사한다."
- icon: "📦"
  title: "자산 축적"
  tag: "레슨런 #7"
  desc: "대화는 흘러가지만 파일은 남는다. 성공한 프롬프트와 패턴을 SKILL.md에 저장해 다음 프로젝트에서 재사용한다."
- icon: "🗂️"
  title: "미완성 기록"
  tag: "레슨런 #10"
  desc: "완성보다 기록이 먼저다. 막힌 지점·다음 할 일을 남겨두면 재개가 쉬워진다."
:::

---

## 레슨런 — 실행 원칙

::: feature-grid cols=3
- icon: "😤"
  title: "고통 우선"
  tag: "레슨런 #8"
  desc: "자동화는 실제로 고통스러운 부분부터 시작한다. 고통이 명확할수록 자동화 범위도 명확해진다."
- icon: "🌱"
  title: "최소 인프라"
  tag: "레슨런 #9"
  desc: "가장 작은 v1으로 시작해 실제로 동작하는 것을 확인한 뒤 점진적으로 확장한다."
- icon: "⚡"
  title: "즉시 시작"
  tag: "레슨런 #13"
  desc: "완벽한 설계를 기다리는 것이 가장 비싼 실수. 불완전한 v1이라도 실행해야 실제 문제를 알 수 있다."
:::

---

## 레슨런 — 소통·프롬프트 원칙

::: stat-grid cols=4
- icon: "현상"
  title: "무슨 상황인가"
  desc: "현재 어떤 일이 벌어지고 있는가"
- icon: "예상"
  title: "어떻게 돼야 하나"
  desc: "원래 기대한 결과는 무엇인가"
- icon: "실제"
  title: "어떻게 되고 있나"
  desc: "실제 나타나고 있는 결과"
- icon: "시도"
  title: "뭘 해봤나"
  desc: "이미 시도한 것은 무엇인가"
:::

::: summary-box
- title: "프롬프트 밀도 4원칙 (레슨런 #11)"
  desc: "현상·예상·실제·시도 네 가지를 명시하면 AI가 핵심을 파악하는 시간이 크게 줄어든다."
  meta: "맥락 명시 (#6): 독자·형식·금지 세 줄 필수|형식 명시 (#14): 몇 줄·어떤 요소·누가 읽는가|도구 연결 (#12): 단일 도구보다 파이프라인 연결이 강력"
:::

---

# 12. 설계와 구조화

단편적 질답에서 구조화된 재사용성으로 — 지침이 생산성을 결정한다.

---

## 단편적 질답 vs 구조화된 접근

::: compare-grid cols=2
- title: "단편적 질답 방식"
  desc: "매번 맥락을 처음부터 설명한다. 대화가 끝나면 패턴이 사라진다. AI에게 설명하는 시간이 전체 작업의 절반을 차지한다."
  meta: "매 세션 맥락 재설명 필요|결과 품질이 일관되지 않음|다른 팀원이 재현 불가|패턴이 축적되지 않음"
  color: "#EF4444"
- title: "구조화된 재사용 방식"
  desc: "SKILL.md와 시스템 프롬프트로 맥락을 파일에 저장한다. 한 번 만든 지침이 모든 세션에 자동 적용된다."
  meta: "지침 파일 한 번 작성으로 영구 재사용|팀원 모두가 동일 품질 재현|프로젝트 간 이식 가능|점진적으로 지침 품질 향상"
  color: "#10A37F"
:::

---

## SKILL.md — 재사용 가능한 지침 구조

::: editor-box
- title: "SKILL.md 템플릿"
  tag: "markdown"
  desc: |
    [스킬 이름] 주간 업무 보고서 생성
    
    [언제 사용] 매주 금요일 업무 정리 시
    
    [입력] 이번 주 완료한 업무 목록 (불릿 형식)
    
    [출력 형식]
    - 제목: "YYYY-WW 주간 업무 보고"
    - 섹션: 완료 / 진행중 / 계획
    - 길이: A4 1장 이내
    - 어조: 공식 보고서 (존댓말)
    
    [예시 입력/출력]
    ... (실제 예시 포함)
:::

---

## 설계(지침)의 힘 — 4가지 효과

::: feature-grid cols=2
- icon: "⏱️"
  title: "맥락 파악 시간 단축"
  desc: "AI가 프로젝트 배경을 묻지 않아도 된다. 지침 파일이 맥락을 대신 전달한다."
- icon: "🔁"
  title: "반복 수정 횟수 감소"
  desc: "출력 형식과 제약 조건이 미리 정의되어 있어 첫 결과물의 품질이 높아진다."
- icon: "👥"
  title: "팀 전체가 동일 품질"
  desc: "지침 파일을 공유하면 누가 써도 같은 수준의 결과를 얻는다. 개인 역량에 의존하지 않는다."
- icon: "🔄"
  title: "프로젝트 간 이식"
  desc: "잘 만든 SKILL.md는 다른 프로젝트에 그대로 가져다 쓸 수 있다. 지침이 곧 자산이다."
:::

---

# 13. 서비스 연결과 조립

도구는 연결될수록 강해진다. 각 도구가 가장 잘 하는 한 가지만 맡기고 결과를 이어 붙인다.

---

## 연결 방식 선택 가이드

::: compare-grid cols=2
- title: "API · MCP (개발자 방식)"
  desc: "Claude와 외부 서비스를 코드나 MCP 서버로 직접 연결. 완전한 제어가 가능하고 복잡한 로직을 구현할 수 있다."
  meta: "API 직접 호출: 완전한 제어, 코드 필요|MCP 서버: Claude와 서비스 직접 연동|Claude Code 환경에서 즉시 활용 가능"
  color: "#6366F1"
- title: "웹훅 · 노코드 (빠른 방식)"
  desc: "n8n, Zapier, Make 등 노코드 플랫폼으로 이벤트 기반 자동화 구성. 코드 없이 시각적으로 파이프라인을 연결한다."
  meta: "웹훅: 이벤트 기반 자동 트리거|n8n: 자기 호스팅 노코드 자동화|비개발자도 빠른 프로토타이핑 가능"
  color: "#F59E0B"
:::

---

## 실전 파이프라인 — 문서 자동 배포

::: git-flow
- title: "Obsidian 노트"
  tag: "내용 작성"
  meta: "마크다운으로 문서 작성|파일 저장 시 웹훅 트리거"
  color: "#7C3AED"
- title: "n8n 워크플로우"
  tag: "자동화 엔진"
  meta: "파일 변경 감지 → 파이프라인 시작|Claude API 호출 조율"
  color: "#F59E0B"
- title: "Claude API"
  tag: "구조화 처리"
  meta: "마크다운 → 구조화 문서 변환|숏코드 형식으로 정제"
  color: "#10A37F"
- title: "빌드 스크립트"
  tag: "변환 실행"
  meta: "MD → HTML 슬라이드 생성|PPTX 자동 출력"
  color: "#3B82F6"
- title: "Notion + Slack"
  tag: "배포 · 알림"
  meta: "팀 공유 페이지 자동 업데이트|담당자에게 완료 알림 전송"
  color: "#6366F1"
:::

---

## 조립의 핵심 원칙

::: step-list
- title: "고통스러운 지점부터"
  desc: "막연한 자동화가 아니라, 실제로 반복되고 고통스러운 부분을 먼저 자동화한다."
  color: "#EF4444"
- title: "인터페이스 계약 먼저"
  desc: "각 단계의 입출력 형식을 미리 정의한다. 중간 단계가 바뀌어도 전체가 무너지지 않는다."
  color: "#F59E0B"
- title: "단계별 검증"
  desc: "전체를 한꺼번에 연결하지 않는다. 한 단계씩 동작을 확인하며 이어 붙인다."
  color: "#10B981"
- title: "실패 알림 + 로그"
  desc: "자동화가 조용히 실패하는 것이 최악이다. 어느 단계에서 문제가 생겼는지 추적 가능하게 로그를 남긴다."
  color: "#6366F1"
:::

---

# 맺음말

백문이 불여일견 · 백견이 불여일타 · 백타가 불여일문

---

## 직접 해봐야 안다

::: summary-box
- title: "백문이 불여일견, 백견이 불여일타, **백타가 불여일문** !!"
  desc: "AI 도구에 대한 설명은 읽는 것만으로 감각이 생기지 않는다. 내 업무에서 가장 고통스러운 부분이 무엇인지 묻는 것에서 시작하라. 그 답이 나왔을 때, 이 모든 도구와 원칙이 비로소 의미를 가진다."
  meta: "설계는 사람이, 구현은 AI가|지침이 정밀할수록 결과가 달라진다|도구는 연결될수록 강해진다"
:::
