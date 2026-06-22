---
title: "Ollama 완전 활용 가이드"
subtitle: "오픈소스 AI 활용 툴"
badge: "🦙 로컬 AI · LLM"
style: "ai-chat"
stats:
  - value: "오프라인"
    label: "완벽한 보안"
  - value: "무료"
    label: "API 과금 없음"
  - value: "Llama 3"
    label: "최신 모델 지원"
  - value: "CLI"
    label: "가벼운 터미널"
---

# Ollama는 어떤 도구인가

Ollama는 Meta의 Llama 3, 구글의 Gemma 등 성능이 뛰어난 오픈소스 AI 모델을 로컬 환경(내 PC)에서 클릭 몇 번 또는 명령어 한 줄로 쉽게 다운로드하고 구동할 수 있게 해주는 런타임 플랫폼입니다.

### 한눈에 보는 핵심 기능

::: icon-grid
- icon: "🔒"
  title: "완벽한 프라이버시"
  desc: "모든 연산이 내 컴퓨터 내부에서 이루어지므로 회사 기밀이나 개인 일기를 입력해도 외부로 유출되지 않습니다."
- icon: "🔌"
  title: "OpenAI 호환 API"
  desc: "Ollama를 실행하면 로컬에 `localhost:11434` API 서버가 열리며, 기존 OpenAI용으로 짠 코드를 URL만 바꿔 그대로 씁니다."
- icon: "🐳"
  title: "Docker 환경 지원"
  desc: "호스트 PC가 지저분해지는 것을 막기 위해 도커 컨테이너 내부에서도 완벽하게 구동 가능합니다."
- icon: "🧩"
  title: "다양한 Vibe 도구 연동"
  desc: "Roo Code, Cline(Claude Dev) 등 에디터 확장에 로컬 모델을 연결하여 무료 코딩 비서로 활용합니다."
:::

### 이런 분들께 강력 추천합니다

::: feature-grid cols=3
- title: "🛡️ 보안에 민감한 개발자"
  tag: "보안"
  desc: "외부 API로 코드를 보내는 것이 규정상 금지되어 있어 혼자만의 로컬 AI 보조가 필요한 분."
- title: "💳 Vibe Coding 헤비 유저"
  tag: "절약"
  desc: "수천 줄의 코드를 AI에게 읽히다 보니 API 비용(토큰 값)이 감당 안 되어 로컬로 전환하려는 분."
- title: "🧪 프롬프트 실험가"
  tag: "연구"
  desc: "RAG(검색 증강 생성) 기술이나 파이썬 랭체인(LangChain) 튜토리얼을 돈 걱정 없이 무제한으로 테스트하고 싶은 분."
:::

# 시작하기: 터미널에서 AI와 대화하기

윈도우 사용자의 경우 WSL2 환경이나 Docker Desktop을 통해 실행하는 것이 좋습니다.

### 기본 실행 흐름

::: step-list
- title: "프로그램 설치"
  desc: "공식 홈페이지에서 운영체제에 맞는 설치 파일을 받아 설치합니다. (윈도우/맥/리눅스 지원)"
- title: "모델 다운로드 및 실행"
  desc: "터미널을 열고 `ollama run llama3` (또는 원하는 모델명)을 입력하면 모델을 다운받은 뒤 대화창이 열립니다."
- title: "프롬프트 대화"
  desc: "프롬프트 창에 질문을 던지면 내 컴퓨터의 CPU/GPU 자원을 이용해 AI가 즉각 답변을 생성합니다."
- title: "REST API 활용"
  desc: "백그라운드에 켜둔 상태로, 파이썬이나 웹 서비스에서 `http://localhost:11434/api/generate` 로 요청을 보냅니다."
- title: "모델 커스텀(Modelfile)"
  desc: "`FROM llama3`, `SYSTEM \"너는 한국어 번역가야\"` 형태의 파일로 나만의 맞춤형 에이전트를 빌드합니다."
:::

# 모델 선택 가이드 및 활용 팁

Ollama 생태계에는 수많은 모델이 있습니다. PC 스펙(RAM)에 맞게 고르는 것이 핵심입니다.

::: compare-grid cols=3
- title: "코딩 전용 (DeepSeek Coder 등)"
  desc: "`ollama run deepseek-coder`. 코딩 지식에 특화된 모델로, 일반 모델보다 훨씬 정교한 코드 제안을 해줍니다."
  meta: "Vibe 코딩 파트너"
- title: "가볍고 빠른 모델 (Gemma 등)"
  desc: "메모리가 8~16GB인 미니 PC나 일반 랩톱에서도 쾌적하게 돌아가는 경량 모델입니다."
  meta: "단순 요약/분류용"
- title: "Web UI 연결 (Open-WebUI)"
  desc: "터미널이 불편하다면 도커로 `Open-WebUI`를 띄워 로컬에 챗GPT와 똑같이 생긴 깔끔한 웹 화면을 구축하세요."
  meta: "완벽한 개인용 ChatGPT"
:::

# 마무리 체크리스트

### 원활한 구동을 위한 확인

- 모델 크기에 비해 내 컴퓨터의 여유 메모리(RAM, VRAM)가 충분한가? (보통 7B 모델은 8GB RAM 권장)
- 윈도우 WSL2 환경이라면 Docker 및 WSL이 리소스를 충분히 할당받을 수 있도록 설정되었는가?
- 다른 컴퓨터나 로컬 네트워크 앱(웹서버 등)에서 접근하려면 환경 변수(
  
  OLLAMA_HOST
  
  )를
  
  0.0.0.0
  
  으로 개방했는가?

> 💡 TIP: Ollama의 가장 강력한 무기는 Modelfile입니다. Dockerfile을 짜듯 내가 자주 쓰는 프롬프트, 창의성(Temperature) 수치, 기본 지침을 파일에 저장해 두고 ollama create로 구워내면 매번 긴 설정을 입력할 필요가 없습니다.

## 내 PC를 AI 서버로 만들어보세요

터미널 명령어 한 줄로 전 세계의 강력한 오픈소스 AI 모델들을 내 컴퓨터에 다운받고 실행하세요.

모델 라이브러리 보기
