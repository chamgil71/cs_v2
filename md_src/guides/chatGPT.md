---
title: "ChatGPT완전 활용 가이드"
subtitle: "OpenAI 대화형 AI 활용 가이드"
badge: "OpenAI · 2026"
style: "emerald"
stats:
  - value: "GPT-5.6"
    label: "최신 플래그십 모델"
  - value: "Agent Mode"
    label: "브라우저·앱 자율 조작"
  - value: "Images 2.0"
    label: "gpt-image-2 · DALL·E 완전 종료"
  - value: "메모리"
    label: "대화 기억 기능"
---

# 플랜 선택 가이드

::: grid.tiers cols=4
- title: "무료 플랜"
  tag: "Free"
  note: "₩0 / 월"
  meta: "GPT-4o (제한적)|웹 검색|기본 이미지 생성|메모리 기능"
- title: "Plus 플랜"
  tag: "Plus ⭐"
  note: "$20 / 월"
  meta: "GPT-5.6 무제한|o3 추론 모델 접근|DALL·E 3 고급|파일 분석·코드 실행|고급 Voice 모드"
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

::: grid.columns cols=3 variant=plain
- title: "GPT-5.6 Sol — 최상위 플래그십 (2026.08 출시)"
  tag: |
    GPT-5.6 Sol
     ⭐ 추천
  desc: "코딩·멀티모달·추론 전반 최상위 성능. 풀-듀플렉스 음성 모델과 함께 출시. 대부분의 고난도 작업에서 최선."
  meta: "💼 일반 업무|💻 코딩|🖼️ 이미지 분석"
- title: "GPT-5.6 Terra — 균형형 모델"
  tag: |
    GPT-5.6 Terra
     속도·비용 균형
  desc: "Sol 대비 속도와 비용의 균형을 맞춘 표준 모델. Plus 플랜 일반 대화의 기본값으로 사용."
  meta: "💬 일반 대화|📝 문서 작성|🔍 요약"
- title: "GPT-5.6 Luna — 효율 모델"
  tag: |
    GPT-5.6 Luna
     빠른·저비용
  desc: "간단한 질문, 요약, 번역에 적합한 경량 모델. API 대량 처리에 유리."
  meta: "⚡ 빠른 응답|💰 비용 효율|🔄 API 처리"
:::

# 내장 도구 활용

::: grid.cards
- icon: "🌐"
  title: "웹 검색 & 브라우징"
  desc: "실시간 웹 검색은 물론 ChatGPT 내에서 직접 탭을 열고 로그인·다운로드까지 처리하는 브라우저 기능 통합. \"최신 정보로 검색해줘\" 입력."
- icon: "🕹️"
  title: "Agent Mode"
  desc: "예약·이메일 정리·양식 작성 등 반복 웹 작업을 여러 단계에 걸쳐 자율 수행. 2026년 업데이트로 '게으름'이 크게 줄어 수백 통의 이메일도 끝까지 처리."
- icon: "🎨"
  title: "ChatGPT Images 2.0 (gpt-image-2)"
  desc: |
    Thinking Mode로 웹 검색·추론 후 이미지 생성·자동검증. 한국어 텍스트 정확 삽입. 8장 일관 배치. 2K 해상도. DALL-E 계열은 완전 종료되어 gpt-image-2로 일원화.
- icon: "💻"
  title: "코드 인터프리터"
  desc: "Python 코드 실행·데이터 분석·차트 생성. CSV 업로드 후 즉시 분석 가능."
- icon: "📁"
  title: "파일 분석"
  desc: "PDF·Word·Excel·PPT·이미지 업로드 후 분석. 표 추출·요약·Q&A 모두 가능."
- icon: "🎙️"
  title: "Advanced Voice"
  desc: "풀-듀플렉스 실시간 음성 대화. 감정 표현·끼어들기 지원. 언어 학습·회의 연습에 탁월."
:::

::: text.callout tip
- title: "💡 Atlas 브라우저 통합 안내:"
  desc: "별도 앱이던 ChatGPT Atlas 브라우저는 2026년 8월 서비스가 종료되고, 탭·다운로드·로그인 유지 등 브라우징 기능이 ChatGPT 본체와 Codex 안으로 이전되었습니다. 이제 별도 설치 없이 ChatGPT에서 바로 웹 작업을 맡길 수 있습니다."
:::

# GPTs 설정 & 시스템 프롬프트

::: code.console
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

::: text.callout tip
- title: "💡 GPTs vs 프로젝트 차이:"
  desc: "GPTs는 OpenAI Store에 배포·공유 가능한 독립 AI 앱. 프로젝트(Project)는 개인 워크스페이스로 파일과 지침을 저장. 팀 배포는 GPTs, 개인 활용은 프로젝트 권장."
:::

# 메모리 & 개인화

🧠 ChatGPT 메모리 시스템

::: grid.cards
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
