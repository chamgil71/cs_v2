---
title: "Claude완전 활용 가이드"
subtitle: "Anthropic의 추론 강화형 AI"
badge: "Anthropic · 2025"
style: "ai-chat"
stats:
  - value: "3종"
    label: "모델 라인업"
  - value: "200K"
    label: "컨텍스트 토큰"
  - value: "무제한"
    label: "프로젝트 생성"
  - value: "50+"
    label: "연결 가능 서비스"
---

# 모델 선택 가이드

::: icon-grid
- title: |
    Claude Opus
     최고 성능
     복잡한 분석, 장문 보고서, 다단계 추론에 최적. 가장 강력하지만 응답 속도가 느림.
     
     🧠 복잡한 분석
     📄 장문 작성
     🔬 연구
- title: |
    Claude Sonnet ⭐ 추천
     균형 잡힌 선택
     성능과 속도의 황금비율. 일상 업무, 코딩, 문서 작성에 가장 적합. 대부분의 상황에서 최선.
     
     💼 업무 자동화
     💻 코딩
     ✍️ 문서 작성
  featured: "true"
- title: |
    Claude Haiku
     빠른 응답
     단순 요약, 분류, 빠른 Q&A에 최적화. API 활용 및 대량 처리에 비용 효율적.
     
     ⚡ 빠른 응답
     📊 분류/요약
     🔄 API 처리
:::

# 시스템 프롬프트 & 세부 설정 ⚙️

### 시스템 프롬프트 구성 예시 (프로젝트 → 설정 → System Prompt에 입력)

::: feature-grid cols=3
- title: "역할 정의 (Persona)"
  desc: "당신은 한국 정부 ICT 정책 전문가입니다. 과기부 예산 문서를 분석하고, 정책 보고서를 작성하는 데 특화되어 있습니다."
- title: "출력 형식 (Format)"
  desc: "한국어로 답변하세요. 보고서는 □ ○ ― 기호를 사용한 계층 구조로 작성하고, 핵심 수치는 표로 정리하세요."
- title: "제약 조건 (Constraints)"
  desc: "출처를 명시하세요. 불확실한 내용은 \"추가 확인 필요\"로 표기하세요. 1차 문서 외 추측을 배제하세요."
:::

::: console-box
- title: "실전 시스템 프롬프트 템플릿"
  desc: |
    [역할] 당신은 {직책/전문분야} 전문가입니다.
    
    # 구체적일수록 좋음: "시니어 파이썬 개발자", "한국어 카피라이터"
    
    [맥락] 현재 {프로젝트명}을 진행 중입니다.
    
    {핵심 배경 정보 2-3줄}
    
    [출력 규칙]
    
    - 언어: 한국어 (기술 용어는 영문 병기)
    
    - 형식: {마크다운/표/리스트 등}
    
    - 길이: {간결/상세} 위주
    
    [금지 사항] 불필요한 서문 생략, 확인되지 않은 수치 사용 금지
:::

::: icon-grid cols=2
- icon: "🎯"
  title: "Chain of Thought:"
- icon: "⚡"
  title: "긴 문서 분석:"
:::

# Claude 스킬 (Skills) 활용

스킬은 Claude에게 특정 작업 방식을 학습시키는 지시 문서입니다. SKILL.md 파일로 관리하며, 프로젝트에 업로드하면 자동으로 적용됩니다.

::: icon-grid
- icon: "📝"
  title: "HWPX 생성"
  desc: "한글 보고서 자동화"
- icon: "📊"
  title: "Excel/PPTX"
  desc: "문서 생성 자동화"
- icon: "🤖"
  title: "AI 전략 보고서"
  desc: "시장 분석 특화"
- icon: "🔤"
  title: "문장 정규화"
  desc: "공문서 스타일 변환"
- icon: "💻"
  title: "Frontend 설계"
  desc: "UI/UX 컴포넌트"
- icon: "📖"
  title: "PDF 파싱"
  desc: "문서 구조 추출"
:::

::: alert-box tip
- title: "💡 스킬 파일 작성 팁:"
  desc: "SKILL.md에 \"언제 이 스킬을 사용하는가\"를 명확히 명시하고, 입출력 예시를 포함시키면 Claude가 자동으로 적절한 스킬을 선택합니다."
:::

# 프로젝트 (Projects) 설정

::: tool-list
- icon: "📋"
  title: "업무 자동화 프로젝트"
  desc: "반복 문서 작업 제거"
  meta: "시스템 프롬프트로 역할과 출력 형식 고정|SKILL.md 파일 업로드로 전문 기능 추가|참고 문서(예시 보고서) 컨텍스트에 유지|대화 히스토리로 맥락 지속 유지"
:::

::: tool-list
- icon: "💻"
  title: "개발 지원 프로젝트"
  desc: "코딩 생산성 극대화"
  meta: "코드베이스 구조 문서를 프로젝트 파일로 업로드|코딩 컨벤션, 스택 정보 시스템 프롬프트에 명시|에러 로그 첨부하면 즉시 디버깅|Claude Code와 연동하여 직접 코드 실행"
:::

# 프로젝트 구성 3단계 🗂️

::: step-flow
- icon: "1️⃣"
  title: "시스템 프롬프트"
  desc: "역할·형식·제약 조건 설정"
- icon: "→"
- icon: "2️⃣"
  title: "파일 업로드"
  desc: "SKILL.md·참고 문서·데이터"
- icon: "→"
- icon: "3️⃣"
  title: "팀 공유"
  desc: "Team 플랜에서 협업"
:::

# 연결 서비스 & 통합

::: feature-grid cols=3
- icon: "📧"
  title: "Gmail"
  tag: "이메일 자동화"
- icon: "📅"
  title: "Google Calendar"
  tag: "일정 관리"
- icon: "📁"
  title: "Google Drive"
  tag: "문서 접근"
- icon: "💬"
  title: "Slack"
  tag: "팀 커뮤니케이션"
- icon: "📋"
  title: "Notion"
  tag: "지식 베이스"
- icon: "🗄️"
  title: "Supabase"
  tag: "DB 연동"
- icon: "🚀"
  title: "Vercel"
  tag: "배포 자동화"
- icon: "🐙"
  title: "GitHub"
  tag: "코드 관리"
:::

::: alert-box tip
- title: "💡 MCP 서버 활용:"
  desc: "Model Context Protocol로 외부 서비스와 직접 연결. Claude Code에서 claude mcp add 명령으로 추가하면 Claude가 직접 서비스를 제어할 수 있습니다."
:::

📡

Claude API 활용

| 활용 방식 | 특징 | 적합한 용도 |
| --- | --- | --- |
| claude.ai (웹) | 설정 불필요, 즉시 사용 | 개인 업무, 프로토타이핑 |
| Claude Code (CLI) | 터미널 직접 제어 | 개발, 파일 자동화 |
| API 직접 호출 | 완전한 커스터마이징 | 서비스 개발, 대량 처리 |
| Artifacts 내 AI | 앱 내 AI 기능 탑재 | 인터랙티브 도구 제작 |
