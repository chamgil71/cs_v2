---
title: "Resend 완전 활용 가이드"
subtitle: "개발자용 이메일 API"
badge: "📧 이메일 API · 알림 자동화"
style: "webdev"
stats:
  - value: "무료 3,000건"
    label: "월 기본 발송"
  - value: "React Email"
    label: "컴포넌트 빌딩"
  - value: "초고속"
    label: "지연 없는 발송"
  - value: "Webhooks"
    label: "상태 추적"
---

# Resend는 어떤 도구인가

기존의 이메일 발송 서비스(SendGrid, AWS SES 등)는 강력하지만 API가 복잡하고, 메일 디자인을 위해 1990년대 방식의 `<table>` 태그 HTML을 억지로 작성해야 했습니다. Resend는 이러한 고통을 해결하기 위해 직관적인 API를 제공하며, 특히 **React 컴포넌트를 이용해 이메일을 UI 짜듯이 개발**할 수 있게 해주는 혁신적인 도구입니다.

### 한눈에 보는 핵심 기능

::: icon-grid
- icon: "⚛️"
  title: "React Email 통합"
  desc: "복잡한 HTML/CSS 대신 React 컴포넌트와 Tailwind CSS로 이메일 템플릿을 디자인합니다."
- icon: "⚡"
  title: "극강의 DX (개발자 경험)"
  desc: "Node, Python, Ruby 등 직관적인 공식 SDK를 제공하여 단 3줄의 코드로 이메일을 발송합니다."
- icon: "📊"
  title: "실시간 트래킹"
  desc: "사용자가 메일을 열었는지(Open), 링크를 클릭했는지(Click), 반송되었는지(Bounce) 대시보드에서 추적합니다."
- icon: "🎯"
  title: "뛰어난 도달률"
  desc: "자체 전용 IP 및 도메인 인증 최적화를 통해 메일이 스팸함에 빠지는 것을 최소화합니다."
:::

### 이런 상황에서 필수로 사용됩니다

::: feature-grid cols=3
- title: "🔔 시스템 자동 알림 메일"
  tag: "알림"
  desc: "자동화 스크립트(크롤러, 투자 분석기 등)에서 에러가 나거나 리포트가 완성됐을 때 알림을 받을 용도."
- title: "👋 회원가입 환영 메일"
  tag: "온보딩"
  desc: "Supabase 등으로 회원이 가입했을 때, 서비스 소개가 담긴 깔끔한 환영 메일을 자동 발송할 때."
- title: "🧾 결제 및 영수증 발송"
  tag: "비즈니스"
  desc: "전자상거래 또는 SaaS 서비스에서 구매자에게 상세한 결제 내역을 전송할 때."
:::

# 시작하기: 3분 만에 메일 보내기

복잡한 설정 없이 테스트 발송까지 매우 빠릅니다.

### 기본 발송 흐름 (Node.js/TypeScript 기준)

::: step-list
- title: "도메인 인증 (선택)"
  desc: "내 도메인(`@my-domain.com`)으로 보내려면 DNS에 Resend가 제공하는 TXT 레코드를 추가합니다."
- title: "SDK 설치"
  desc: "터미널에서 패키지를 설치합니다. `npm install resend`"
- title: "객체 생성"
  desc: "발급받은 API 키로 Resend 인스턴스를 초기화합니다. `const resend = new Resend('re_123456');`"
- title: "발송 함수 작성"
  desc: "`resend.emails.send({ from, to, subject, html })` 형태로 발송 명령을 내립니다."
- title: "React Email 연동"
  desc: "`html` 속성 대신 `react: <MyTemplate />` 형식으로 내가 만든 리액트 컴포넌트를 바로 넣습니다."
:::

### 타 서비스와의 비교

| 기능 | Resend | SendGrid / AWS SES |
| --- | --- | --- |
| **설정 난이도** | 매우 낮음 (가입 즉시 테스트 가능) | 높음 (복잡한 권한 및 도메인 설정) |
| **템플릿 디자인** | React, Tailwind 지원 (트렌디함) | 자체 드래그앤드롭 빌더 또는 순수 HTML |
| **무료 플랜** | 월 3,000건 (일 100건) | 월 100건(SendGrid) / 무료없음(SES) |

# 자동화 프로젝트 적용 팁

::: compare-grid cols=3
- title: "Python 크롤링 봇 연동"
  desc: "부동산 경매 리포트나 주식/배당금 분석 결과가 나오면, 파이썬용 `resend` 패키지를 이용해 요약된 데이터를 메일로 자동 전송합니다."
  meta: "데일리 자동 리포팅"
- title: "Supabase Webhook 연동"
  desc: "데이터베이스에 새 행(New Row)이 추가되면 Supabase Webhook이 Edge Function을 트리거하고, 거기서 Resend API를 호출하여 이메일을 보냅니다."
  meta: "완전한 서버리스 알림"
- title: "첨부파일 처리"
  desc: "PDF 생성 라이브러리와 결합하여 월간 가계부(Budget) 분석 결과를 PDF로 변환 후, `attachments` 배열에 넣어 전송합니다."
  meta: "문서 공유 최적화"
:::

# 마무리 체크리스트

### 실서비스 전환 시 확인

- 테스트용 이메일 주소가 아닌 임의의 사용자에게 메일을 보내려면, 반드시 도메인 DNS 인증(DKIM/SPF)을 완료했는가?
- 이메일 내용에 수신 거부(Unsubscribe) 링크가 포함되어 스팸 정책을 준수하는가?
- 발송 실패(에러 캐치) 시 재시도 로직이나 슬랙/텔레그램 알림 등 폴백(Fallback) 수단을 마련했는가?

> 💡 TIP: 다크모드를 사용하는 이메일 클라이언트(애플 메일 등) 환경을 고려하여, 로고 이미지의 배경은 투명하게(PNG) 처리하고 텍스트 컬러 대비를 점검하는 것이 좋습니다.

## 지루한 이메일 템플릿 코딩은 끝났습니다

낡은 테이블(Table) 기반 HTML 대신 React로 아름다운 이메일을 만들고 전송하세요.

API 키 발급받기
