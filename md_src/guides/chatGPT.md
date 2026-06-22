---
title: "ChatGPT완전 활용 가이드"
subtitle: "OpenAI 대화형 AI 활용 가이드"
badge: "OpenAI · 2026"
style: "ai-chat"
stats:
  - value: "GPT-5.4"
    label: "최신 플래그십 모델"
  - value: "Images 2.0"
    label: "2026.04.21 출시"
  - value: "DALL·E 3"
    label: "이미지 생성 내장"
  - value: "메모리"
    label: "대화 기억 기능"
---

# 플랜 선택 가이드

::: plan-grid cols=4
- title: "무료 플랜"
  tag: "Free"
  note: "₩0 / 월"
  meta: "GPT-4o (제한적)|웹 검색|기본 이미지 생성|메모리 기능"
- title: "Plus 플랜"
  tag: "Plus ⭐"
  note: "$20 / 월"
  meta: "GPT-5.4 무제한|o3 추론 모델 접근|DALL·E 3 고급|파일 분석·코드 실행|고급 Voice 모드"
  featured: "true"
- title: "Pro 플랜"
  tag: "Pro"
  note: "$200 / 월"
  meta: "o1 Pro 무제한|o3 우선 접근|최고 성능 추론|전문가·연구자 대상"
- title: "Team 플랜"
  tag: "Team"
  note: "$25~30 / 월 / 인"
  meta: "팀 워크스페이스|데이터 학습 제외|GPTs 공유|관리자 콘솔"
:::

# GPT 모델 라인업

::: compare-grid cols=3
- title: "GPT-5.4 — 최신 플래그십 (2026.03 출시)"
  tag: |
    GPT-5.4
     ⭐ 추천
  desc: "코딩·멀티모달·추론 전반 대폭 향상. Standard·Thinking·Pro 3가지 변형 제공. 할루시네이션 33% 감소. 대부분의 작업에서 최선."
  meta: "💼 일반 업무|💻 코딩|🖼️ 이미지 분석"
- title: "o3 — 수학·과학·코딩 추론 모델"
  tag: |
    o3
     추론 특화
  desc: "복잡한 다단계 추론에 특화. 단계적으로 생각하며 답변. 속도보다 정확성이 중요한 연구·분석 작업에 최적."
  meta: "🔬 과학·수학|💻 복잡한 코딩|📊 전략 분석"
- title: "GPT-5.4 mini / nano — 효율 모델"
  tag: |
    GPT-5.4 mini
     빠른·저비용
  desc: "GPT-5.4 수준의 이해력에 훨씬 빠른 속도와 낮은 비용. 간단한 질문, 요약, 번역에 적합. API 대량 처리에 유리."
  meta: "⚡ 빠른 응답|💰 비용 효율|🔄 API 처리"
:::

# 내장 도구 활용

::: icon-grid
- icon: "🌐"
  title: "웹 검색"
  desc: "Bing 연동 실시간 검색. 최신 뉴스·정보·주가 등 즉시 확인. \"최신 정보로 검색해줘\" 입력."
- icon: "🎨"
  title: "ChatGPT Images 2.0 NEW"
  desc: |
    2026.04.21 출시. Thinking Mode로 웹 검색·추론 후 이미지 생성·자동검증. 한국어 텍스트 정확 삽입. 8장 일관 배치. 2K 해상도. DALL-E 2·3은 2026.05.12 종료.
- icon: "💻"
  title: "코드 인터프리터"
  desc: "Python 코드 실행·데이터 분석·차트 생성. CSV 업로드 후 즉시 분석 가능."
- icon: "📁"
  title: "파일 분석"
  desc: "PDF·Word·Excel·PPT·이미지 업로드 후 분석. 표 추출·요약·Q&A 모두 가능."
- icon: "🎙️"
  title: "Advanced Voice"
  desc: "자연스러운 실시간 음성 대화. 감정 표현·인터럽트 지원. 언어 학습·회의 연습에 탁월."
- icon: "🤖"
  title: "GPTs (맞춤 AI)"
  desc: "특정 업무에 특화된 커스텀 AI 생성. 시스템 프롬프트+파일로 나만의 AI 비서 제작."
:::

# GPTs 설정 & 시스템 프롬프트

::: console-box
- title: "GPTs 시스템 프롬프트 예시 — 정책 분석 보조 AI"
  desc: |
    You are a Korean government ICT policy analyst assistant.
    
    Your tasks:
    
    1. Analyze policy documents uploaded by the user
    
    2. Summarize key points in structured Korean format (□ ○ ―)
    
    3. Compare with similar international cases when relevant
    
    4. Always cite specific page numbers and clauses
    
    Language: Always respond in Korean unless asked otherwise.
    
    Format: Use tables for data comparison. Keep responses concise.
:::

::: alert-box tip
- title: "💡 GPTs vs 프로젝트 차이:"
  desc: "GPTs는 OpenAI Store에 배포·공유 가능한 독립 AI 앱. 프로젝트(Project)는 개인 워크스페이스로 파일과 지침을 저장. 팀 배포는 GPTs, 개인 활용은 프로젝트 권장."
:::

# 메모리 & 개인화

🧠 ChatGPT 메모리 시스템

::: icon-grid
- icon: "💾"
  title: "자동 저장"
  desc: "대화 중 중요한 정보를 자동으로 기억. \"~를 기억해줘\"로 명시적 저장도 가능."
- icon: "🔄"
  title: "대화 간 지속"
  desc: "새 대화에서도 이전에 기억한 내용 유지. 반복 설명 불필요."
- icon: "✏️"
  title: "수동 편집"
  desc: "설정 → 개인화 → 메모리에서 저장된 내용 확인·삭제·수정 가능."
- icon: "🔒"
  title: "프라이버시 제어"
  desc: "임시 채팅 모드로 메모리 없이 대화. 데이터 학습 제외 설정 가능."
:::
