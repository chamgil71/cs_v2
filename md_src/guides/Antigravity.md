---
title: "Google Antigravity완전 활용 가이드"
subtitle: "Gemini 3 기반 에이전트 우선 개발 환경"
badge: "⚡ Google · 에이전트 IDE · 2026"
style: "terracotta"
stats:
  - value: "Gemini 3"
    label: "코어 모델"
  - value: "Mac/Win/Linux"
    label: "데스크톱 지원"
  - value: "Agent Manager"
    label: "다중 에이전트 관제"
  - value: "무료"
    label: "개인 사용"
---

# Antigravity는 어떤 도구인가

Google Antigravity는 2026년 Gemini 3와 함께 출시된 **에이전트 우선(agent-first) 개발 환경**입니다. VS Code 확장이나 자동완성 도구를 넘어, 여러 개의 자율 에이전트가 코드 작성·브라우저 조작·터미널 명령까지 비동기로 동시에 수행하고 그 결과를 하나의 관제 화면(Agent Manager)에서 확인·승인하는 방식으로 동작합니다.

### 한눈에 보는 핵심 기능

::: icon-grid
- icon: "🕹️"
  title: "Agent Manager"
  desc: "여러 에이전트가 병렬로 진행 중인 작업(계획·실행·검증 단계)을 한 화면에서 관제. 각 작업의 아티팩트(계획서·스크린샷·실행 로그)를 검토 후 승인합니다."
- icon: "🌐"
  title: "브라우저 제어"
  desc: "에이전트가 실제 브라우저를 열어 웹앱을 클릭·입력·스크린샷 촬영하며 직접 검증. 프론트엔드 변경 사항을 시각적으로 확인합니다."
- icon: "🧩"
  title: "비동기 에이전트 실행"
  desc: "하나의 작업을 지시하고 다른 작업으로 넘어가도 에이전트가 백그라운드에서 계속 진행. 완료되면 알림으로 결과 확인."
- icon: "🖥️"
  title: "Antigravity CLI"
  desc: "터미널에서 Antigravity 에이전트를 직접 호출·모니터링. Gemini Audio 기반 실시간 음성 전사도 지원."
:::

### 이런 분들께 강력 추천합니다

::: feature-grid cols=3
- title: "🤹 여러 작업을 동시에 굴리는 개발자"
  tag: "생산성"
  desc: "기능 구현, 버그 수정, 리팩토링을 동시에 여러 에이전트에게 맡기고 결과만 검토하고 싶은 분."
- title: "🎨 프론트엔드·비주얼 작업이 많은 팀"
  tag: "검증"
  desc: "에이전트가 실제 브라우저로 UI를 직접 확인하고 스크린샷 근거를 남겨주길 원하는 분."
- title: "🔗 Gemini 생태계 사용자"
  tag: "통합"
  desc: "Gemini 3·Gemini Notebook(NotebookLM)과 이어지는 워크플로를 하나의 Google 계정으로 관리하고 싶은 분."
:::

# 시작하기

::: step-list
- title: "다운로드 및 설치"
  desc: "antigravity.google 에서 macOS/Windows/Linux 데스크톱 앱을 내려받아 설치합니다."
- title: "Google 계정 로그인"
  desc: "Gemini 앱과 동일한 Google 계정으로 로그인하면 개인 사용 기준 무료로 이용할 수 있습니다."
- title: "첫 작업 지시"
  desc: "Agent Manager에서 \"이 저장소에 다크모드를 추가해줘\"처럼 자연어로 작업을 등록하면 에이전트가 계획을 세우고 실행합니다."
- title: "계획·결과 검토"
  desc: "에이전트가 제시한 계획(Plan)과 실행 아티팩트를 검토한 뒤 승인하거나 수정 지시를 내립니다."
- title: "CLI 연동 (선택)"
  desc: "터미널 중심 워크플로가 필요하면 Antigravity CLI로 동일한 에이전트를 호출·관리할 수 있습니다."
:::

# 다른 에이전트 IDE와 비교

| 항목 | Antigravity | Cursor | Claude Code | GitHub Copilot |
| --- | --- | --- | --- | --- |
| 기본 모델 | Gemini 3 | Composer(자체) + 외부 모델 | Claude Sonnet/Opus | GPT-5 계열 |
| 실행 형태 | 독립 에이전트 관제 앱 | AI 네이티브 에디터 | 터미널 에이전트 | 에디터 확장 |
| 브라우저 제어 | ✓ 내장 | △ 확장 필요 | △ MCP 연동 | ✓ (VS Code Agent) |
| 다중 에이전트 병렬 | ✓ Agent Manager | ✓ Cloud Agents | ✓ 서브에이전트 | △ 병렬 세션 |
| 비용 | 무료(개인) | 무료~유료 | Pro 구독/API | $10/월~ |

::: alert-box tip
- title: "💡 Antigravity 2.0:"
  desc: "2026.05 출시된 Antigravity 2.0은 별도의 코드 에디터 화면 없이 에이전트 관리에만 집중하는 독립형 데스크톱 앱으로 재편되었습니다. 코드 편집 자체는 VS Code 등 기존 에디터와 나란히 열어 두고, Antigravity는 에이전트 오케스트레이션 역할에 집중하는 구조입니다."
:::

# Gemini 생태계와의 연결

Antigravity는 단독으로도 쓸 수 있지만, 같은 Google 계정으로 아래 도구와 이어지면 시너지가 커집니다.

::: tool-list
- icon: "📒"
  title: "Gemini Notebook(구 NotebookLM)"
  desc: "리서치·문서 분석 담당"
  meta: "기술 문서·API 레퍼런스를 먼저 Gemini Notebook에 모아 요약|핵심 요구사항을 Antigravity 작업 지시문으로 변환"
- icon: "💬"
  title: "Gemini 앱"
  desc: "아이디어 브레인스토밍"
  meta: "생성형 UI로 빠른 프로토타입 시안 확인|확정된 아이디어를 Antigravity 에이전트 작업으로 전달"
:::
