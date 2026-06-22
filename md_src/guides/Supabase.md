---
title: "Supabase 완전 활용 가이드"
subtitle: "오픈소스 Firebase 대안 BaaS"
badge: "🗄️ 백엔드 서비스 · PostgreSQL"
style: "webdev"
stats:
  - value: "PostgreSQL"
    label: "기본 엔진"
  - value: "Auth"
    label: "인증 기본제공"
  - value: "API"
    label: "자동 생성"
  - value: "Realtime"
    label: "웹소켓 지원"
---

# Supabase는 어떤 도구인가

Supabase는 데이터베이스 연동, 사용자 인증(회원가입/로그인), 스토리지(파일 저장), 실시간 데이터 업데이트 등 백엔드 개발에 필요한 모든 기능을 하나의 대시보드와 클라이언트 라이브러리로 제공하는 BaaS(Backend as a Service)입니다. Firebase와 비슷하지만, 관계형 데이터베이스인 PostgreSQL을 사용하여 복잡한 데이터 분석과 쿼리에 훨씬 강력합니다.

### 한눈에 보는 핵심 기능

::: icon-grid
- icon: "🗃️"
  title: "자동 API 및 Database"
  desc: "대시보드에서 테이블(엑셀 시트 형태)을 만들면 CRUD 조작이 가능한 REST 및 GraphQL API가 즉시 생성됩니다."
- icon: "🔐"
  title: "강력한 Auth (인증)"
  desc: "이메일/비밀번호 로그인은 물론, 구글, 깃허브 등 소셜 OAuth 로그인을 클릭 몇 번으로 구현합니다."
- icon: "🛡️"
  title: "RLS (Row Level Security)"
  desc: "데이터베이스 레벨에서 \"본인이 쓴 글만 지울 수 있다\" 같은 정교한 보안 정책을 설정합니다."
- icon: "📂"
  title: "Storage"
  desc: "프로필 이미지나 문서를 저장하고 최적화하여 서빙하는 S3 호환 클라우드 스토리지를 제공합니다."
:::

### 이런 프레임워크와 찰떡궁합입니다

::: feature-grid cols=3
- title: "⚛️ React + Vite 생태계"
  tag: "프론트엔드"
  desc: "Vite로 빌드한 React 앱(대시보드 등)에 SDK를 붙여 즉각적으로 데이터를 불러오고 인증을 유지합니다."
- title: "▲ Next.js"
  tag: "풀스택"
  desc: "서버 사이드 렌더링(SSR) 환경에서도 안전하게 쿠키 기반으로 사용자 세션을 유지할 수 있는 툴킷을 제공합니다."
- title: "📱 Flutter / React Native"
  tag: "모바일"
  desc: "웹뿐만 아니라 모바일 환경에서도 동일한 백엔드 인프라를 완벽하게 공유하여 사용합니다."
:::

# 시작하기: 프론트엔드와 연결하기

복잡한 서버 프레임워크(Spring, Express 등) 없이 프론트엔드에서 직접 DB를 제어합니다.

### React(Vite) 앱 연결 흐름

::: step-list
- title: "프로젝트 생성"
  desc: "Supabase 대시보드에서 새 프로젝트를 생성하고 URL과 `anon_key`를 발급받습니다."
- title: "클라이언트 설치"
  desc: "로컬 React 프로젝트 터미널에서 `npm install @supabase/supabase-js`를 실행합니다."
- title: "클라이언트 초기화"
  desc: "`.env` 파일에 키를 넣고, `createClient(URL, KEY)`를 사용해 Supabase 객체를 생성합니다."
- title: "Auth (인증) 구현"
  desc: "`supabase.auth.signInWithPassword()` 함수 하나로 로그인 UI에 기능을 붙입니다."
- title: "데이터 쿼리"
  desc: "`const { data, error } = await supabase.from('budgets').select('*')` 처럼 직관적으로 데이터를 불러옵니다."
:::

### Firebase vs Supabase 핵심 비교

| 구분 | Supabase | Firebase |
| --- | --- | --- |
| **DB 종류** | RDBMS (PostgreSQL) - 구조적 데이터 | NoSQL - 비정형/계층적 데이터 |
| **데이터 결합(JOIN)** | 매우 쉬움 (외래키 활용) | 구조상 어렵거나 불가능 |
| **마이그레이션** | 순수 SQL이라 타 서버로 이전 쉬움 | 구글 생태계 종속성 높음 |
| **러닝 커브** | SQL 지식이 약간 필요함 | JSON 다루듯 직관적 |

# 실무 구축 시 주의/활용 팁

특히 예산 분석 대시보드처럼 데이터를 정밀하게 다루는 앱에서 중요한 포인트입니다.

::: compare-grid cols=3
- title: "Row Level Security (RLS) 활성화"
  desc: "테이블을 만들면 기본적으로 모든 접근이 차단됩니다. 반드시 \"인증된 사용자는 자신의 데이터만 Select/Insert 할 수 있다\"는 RLS 정책을 설정해야 합니다."
  meta: "데이터 유출 방지 1순위"
- title: "Supabase CLI 및 타입스크립트"
  desc: "CLI를 이용해 DB 스키마를 TypeScript 타입으로 자동 추출(`gen types`)하여 프론트엔드 개발 시 완벽한 자동완성을 누릴 수 있습니다."
  meta: "런타임 에러 사전 차단"
- title: "Edge Functions"
  desc: "결제 처리나 외부 API 통신처럼 프론트엔드에서 노출되면 안 되는 보안 로직은 Deno 기반의 Edge Function에 작성하여 실행합니다."
  meta: "백엔드 로직 분리"
:::

# 마무리 체크리스트

### 배포 전 필수 보안 점검

- .env
  
  파일에
  
  service_role
  
  키(모든 권한을 가진 마스터 키)가 노출되지 않았는가? (반드시
  
  anon_key
  
  만 사용)
- 예산, 금융 데이터 등이 저장된 민감한 테이블에 RLS(행 수준 보안)가 정확히 켜져 있는가?
- 이메일 회원가입 시 인증 메일 템플릿과 리다이렉트 URL이 실제 배포된 사이트(예: Vercel 도메인)로 설정되었는가?

> 💡 TIP: React + Vite로 'BudgetN' 같은 프로젝트를 구성할 때, 로그인 세션이 리프레시될 때 깜빡임(Flicker) 현상이 생길 수 있습니다. 이를 방지하려면 Supabase의 onAuthStateChange 리스너를 앱 최상단에 배치하여 유저 상태를 전역 상태(Zustand 등)에 동기화하는 패턴을 사용하세요.

## 서버리스 백엔드의 강력함을 경험하세요

테이블을 만들면 즉시 REST API가 생성되고, 몇 줄의 코드로 소셜 로그인을 구현할 수 있습니다.

프로젝트 생성
