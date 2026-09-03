---
title: "OpenAI Codex 완전 활용 가이드"
subtitle: "터미널·IDE에서 동작하는 OpenAI의 에이전틱 코딩 도구"
badge: "🧠 OpenAI · Codex CLI/IDE · 2026"
style: "terracotta"
stats:
  - value: "GPT-5.5"
    label: "ChatGPT 로그인 시 기본 모델"
  - value: "CLI+IDE"
    label: "터미널·VS Code·클라우드"
  - value: "샌드박스"
    label: "격리 실행·자동 승인"
  - value: "MCP"
    label: "외부 도구 연동"
---

# Codex는 지금 무엇인가

과거 자동완성 엔진이었던 Codex는 현재 **Codex CLI / Codex IDE 확장 / 클라우드 에이전트**로 이루어진 OpenAI의 에이전틱 코딩 제품군입니다. 터미널에서 실행하면 코드베이스를 직접 읽고, 파일을 수정하고, 테스트를 돌리고, 필요하면 브라우저까지 조작하는 자율 개발 파트너 역할을 합니다. 기본 모델은 ChatGPT 계정으로 로그인하면 `GPT-5.5`, API 키로 인증하면 코딩 특화 튜닝된 `GPT-5.2-Codex`가 적용됩니다(모델 세대교체가 잦은 편이라 `codex --model`로 원하는 버전을 직접 지정하는 것을 권장).

### 한눈에 보는 핵심 기능

::: icon-grid
- icon: "🖥️"
  title: "Codex CLI"
  desc: "터미널에서 자연어로 작업을 지시하면 파일 읽기·수정·명령 실행을 자율적으로 수행. Vim 모드, 원격 세션 상태 표시(/status) 등 터미널 UX 지속 개선."
- icon: "🧩"
  title: "Agent Plugins & AGENTS.md"
  desc: "프로젝트 루트의 AGENTS.md로 컨벤션·금지 사항을 지정. 이식 가능한 Agent Plugins로 팀 전체가 같은 워크플로를 재사용."
- icon: "🔐"
  title: "샌드박스 & 승인 모드"
  desc: "파일시스템/네트워크가 격리된 샌드박스에서 실행. 승인 모드(항상 확인/자동 승인 등)를 선택해 안전과 속도를 조절."
- icon: "🔌"
  title: "MCP 클라이언트/서버"
  desc: "2026-07-28 MCP 프로토콜을 지원. Codex를 MCP 클라이언트로 써서 외부 도구를 붙이거나, 서버로 노출해 다른 에이전트가 호출 가능."
:::

### 이런 분들께 강력 추천합니다

::: feature-grid cols=3
- title: "🛠️ 터미널 중심 개발자"
  tag: "개발"
  desc: "IDE보다 터미널 워크플로가 편하고, git worktree·CI 스크립트와 자연스럽게 엮이는 에이전트를 원하는 분."
- title: "🔁 Claude Code·Cursor 병행 사용자"
  tag: "마이그레이션"
  desc: "/import 명령으로 Claude Code·Cursor의 설정과 최근 대화를 그대로 가져와 도구를 갈아타거나 병행하고 싶은 분."
- title: "🏢 대규모 코드베이스 운영팀"
  tag: "데이터"
  desc: "codex doctor로 환경·Git·MCP 진단을 받고, 승인 정책과 샌드박스로 대규모 저장소에서도 안전하게 자동화하고 싶은 분."
:::

# 실전 활용: 터미널에서 Codex 굴리기

### 기본 사용 흐름

::: step-list
- title: "설치 및 로그인"
  desc: "`npm install -g @openai/codex` 또는 공식 바이너리 설치 후 ChatGPT 계정(Plus/Pro/Business)으로 로그인합니다. API 키 방식도 지원."
- title: "AGENTS.md 작성"
  desc: "프로젝트 루트에 코딩 컨벤션·빌드 명령·금지 행위를 적어두면 Codex가 매 세션마다 이를 우선 참고합니다."
- title: "작업 지시"
  desc: "터미널에서 `codex \"실패하는 테스트 고쳐줘\"`처럼 자연어로 지시하면 관련 파일을 탐색해 수정안을 제시합니다."
- title: "이미지·화면 공유"
  desc: "스크린샷·와이어프레임·다이어그램을 CLI에 첨부해 디자인 의도를 함께 전달할 수 있습니다."
- title: "승인 및 검증"
  desc: "diff를 검토 후 승인하거나, 자동 승인 모드로 반복 작업을 맡기고 결과만 확인합니다."
:::

# 최적의 결과를 얻는 프롬프트 팁

::: compare-grid cols=3
- title: "명확한 컨텍스트 제공"
  desc: "로그인 화면 만들어줘\" (X) -> \"React와 Tailwind를 사용해서 이메일/비밀번호를 받는 로그인 컴포넌트를 만들어줘.\" (O)"
  meta: "기술 스택 명시 필수"
- title: "AGENTS.md로 규칙 고정"
  desc: "매번 반복 지시하는 대신 AGENTS.md에 \"테스트는 항상 pytest로 실행\", \"커밋 메시지는 한국어로\" 등을 적어 세션 간 일관성을 확보합니다."
  meta: "세션 간 컨텍스트 유지"
- title: "에러 메시지 통째로 복사"
  desc: "코드가 안 돌아갈 때는 내 코드만 주지 말고, 콘솔에 찍힌 붉은색 에러 로그를 그대로 복사해서 같이 던져줍니다."
  meta: "원인 파악의 핵심"
:::

# 마무리 체크리스트

### AI 코드 사용 시 주의사항

- 자동 승인 모드로 돌린 세션이라도 최종 diff를 사람이 한 번 더 확인했는가?
- 회사 내부의 민감한 데이터나 인증 키(API Key), 개인정보를 프롬프트나 샌드박스 환경변수에 남기지 않았는가?
- 사용하려는 라이브러리가 최신 버전인지 확인했는가? (AI가 구버전 문법을 제시할 수 있음)

> 💡 TIP: 전체 코드를 다시 짜달라고 하기보다 "이 함수의 이 부분 로직만 수정해서 전체 코드로 다시 보여줘"라고 지시하면 기존 구조가 망가지는 것을 막을 수 있습니다.

## 나만의 AI 코딩 비서를 직접 구축해보세요

Codex CLI와 MCP 서버를 조합해 코드 리뷰, 자동 생성, 버그 탐지 파이프라인을 팀 워크플로에 심어보세요.

CLI 설치 가이드 보기
