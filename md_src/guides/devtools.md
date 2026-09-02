---
title: "브라우저를 다루는 AI 에이전트"
subtitle: "Chrome DevTools MCP · Claude in Chrome · Playwright MCP 완전 정리"
badge: "🌐 브라우저 자동화 · 2026"
style: "ai-dev"
stats:
  - value: "29개"
    label: "Chrome DevTools MCP 도구"
  - value: "MCP"
    label: "표준 프로토콜 기반"
  - value: "실브라우저"
    label: "실제 세션·로그인 재사용"
  - value: "무료"
    label: "오픈소스 서버"
---

# 왜 '브라우저를 다루는 AI'가 필요한가

코딩 에이전트가 아무리 코드를 잘 고쳐도, 실제로 화면이 의도대로 그려지는지·API 요청이 정상인지·성능이 괜찮은지는 브라우저를 직접 열어봐야 압니다. 2026년 현재 이 역할을 하는 세 가지 축은 성격이 뚜렷이 다릅니다.

::: compare-split
- title: "Claude in Chrome (확장 프로그램)"
  desc: "내가 로그인해 둔 실제 브라우저 세션을 그대로 사용. Gmail·Notion·사내 시스템처럼 로그인이 필요한 작업을 사람 대신 처리."
  meta: "실제 로그인 세션 재사용|일상 업무 자동화|탭 클릭·양식 작성 대행"
  note: "\"내 브라우저로 일해주는 AI\""
- title: "Chrome DevTools MCP (개발자 도구)"
  desc: "깨끗한 Chrome 인스턴스를 열어 콘솔·네트워크·성능 트레이스까지 들여다보는 개발자용 MCP 서버. 코딩 에이전트가 자기 작업을 스스로 검증."
  meta: "콘솔 로그·네트워크 요청 분석|성능 트레이스 프로파일링|스크린샷 기반 시각 검증"
  note: "\"개발자 도구를 쓰는 AI\""
:::

# Chrome DevTools MCP — 코딩 에이전트의 눈

::: icon-grid
- icon: "🖱️"
  title: "브라우저 자동화"
  desc: "클릭·입력·폼 채우기·파일 업로드·페이지 이동·다이얼로그 처리 등 29종 도구로 실제 UI를 조작합니다."
- icon: "🐛"
  title: "심층 디버깅"
  desc: "네트워크 요청, 콘솔 메시지(소스맵 포함 스택 트레이스)를 분석해 에러 원인을 코드 레벨에서 추적합니다."
- icon: "⚡"
  title: "성능 프로파일링"
  desc: "Chrome DevTools의 트레이스 녹화 기능으로 실행 가능한 성능 인사이트를 추출합니다."
- icon: "📸"
  title: "스크린샷 기반 검증"
  desc: "코드 수정 후 실제 렌더링 결과를 스크린샷으로 확인해 \"눈으로 보이는\" 회귀를 잡아냅니다."
:::

::: step-list
- title: "설치"
  desc: "Claude Desktop Extension(.dxt)으로 원클릭 설치하거나, `npx chrome-devtools-mcp`로 MCP 서버를 직접 등록합니다."
- title: "에이전트에 연결"
  desc: "Claude Code·Cursor·Codex 등 MCP를 지원하는 에이전트에 서버를 등록하면 즉시 도구 목록이 노출됩니다."
- title: "작업 지시"
  desc: "\"방금 고친 로그인 폼을 브라우저에서 직접 눌러보고 콘솔 에러 있는지 확인해줘\"처럼 자연어로 검증을 위임합니다."
:::

# Playwright MCP — 접근성 트리 기반 자동화

::: feature-grid cols=3
- title: "스크린샷 없는 정밀 제어"
  tag: "접근성 트리"
  desc: "비전 모델 없이 ARIA 접근성 트리만으로 페이지를 탐색·조작. 브리틀한 CSS 셀렉터 대신 구조 기반으로 동작해 훨씬 안정적."
- title: "테스트 에이전트"
  tag: "Planner·Generator·Healer"
  desc: "테스트 계획 수립 → 코드 생성 → 실패 시 자가 치유(self-heal)까지 이어지는 3단계 AI 워크플로를 내장."
- title: "Chromium·Firefox·WebKit"
  tag: "크로스 브라우저"
  desc: "browser_navigate·browser_click·browser_snapshot 등 표준화된 도구 30여 종으로 3대 엔진을 동일하게 제어."
:::

::: alert-box tip
- title: "💡 어떤 걸 언제 쓰나:"
  desc: "사람의 로그인 세션이 필요한 반복 업무 자동화는 Claude in Chrome, 코딩 에이전트가 자기 결과물을 검증·디버깅하려면 Chrome DevTools MCP, CI에서 안정적인 E2E 테스트를 자동 생성·치유하려면 Playwright MCP가 적합합니다."
:::

# VS Code의 에이전틱 브라우저 도구

::: tool-list
- icon: "🧭"
  title: "VS Code Agentic Browser Tools (GA)"
  desc: "에이전트가 페이지를 탐색하고, 콘텐츠를 확인하고, 스크린샷을 찍어 웹앱을 직접 검증"
  meta: "기본 활성화된 정식 기능(GA)|Copilot Agent Mode·Autopilot과 함께 동작|브라우저 디버깅 세션을 에디터 안에서 그대로 이어감"
:::
