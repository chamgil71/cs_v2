---
title: "Cloudflare 완전 활용 가이드"
subtitle: "CDN · DNS · 인프라 보안"
badge: "☁️ 인프라 · 보안 및 배포"
style: "webdev"
stats:
  - value: "무료"
    label: "강력한 기본플랜"
  - value: "CDN"
    label: "전 세계 캐싱"
  - value: "Pages"
    label: "정적 배포"
  - value: "Tunnels"
    label: "포트포워딩 불필요"
---

# Cloudflare는 어떤 도구인가

Cloudflare는 초기에는 웹사이트를 빠르게 로딩해주는 CDN(콘텐츠 전송 네트워크)과 DDoS 방어 서비스로 유명해졌으나, 현재는 서버리스 앱 배포, 봇 방어, 심지어 집이나 사무실에 있는 내부망 장비를 외부로 안전하게 노출해주는 네트워크 솔루션까지 제공하는 올인원 인프라 플랫폼입니다.

### 한눈에 보는 핵심 기능

::: icon-grid
- icon: "🛡️"
  title: "프록시(Proxy) DNS"
  desc: "내 서버의 실제 IP 주소를 숨기고 Cloudflare의 방화벽을 거치게 하여 악성 공격을 차단합니다."
- icon: "🚀"
  title: "Cloudflare Pages"
  desc: "Vercel과 유사하게 GitHub과 연결하여 React, Vue 등의 정적 사이트를 무료로 무제한 배포합니다."
- icon: "🚇"
  title: "Zero Trust (Tunnels)"
  desc: "공유기 포트포워딩 없이도 로컬 미니 PC나 NAS의 내부 서비스를 외부 인터넷에 안전하게 노출합니다."
- icon: "⚙️"
  title: "Workers"
  desc: "무거운 서버 구축 없이, 자바스크립트 코드 몇 줄로 엣지 네트워크에서 실행되는 API를 만듭니다."
:::

### 이런 분들께 강력 추천합니다

::: feature-grid cols=3
- title: "🖥️ 홈 서버 / NAS 운영자"
  tag: "개인"
  desc: "집에서 24시간 돌아가는 미니 PC나 도커 컨테이너를 외부망에서 안전하게 접속하고 싶은 분."
- title: "🌐 프론트엔드 개발자"
  tag: "개발"
  desc: "트래픽 제한이 빡빡한 호스팅 대신, 대역폭 무제한 무료 배포(Pages)가 필요한 분."
- title: "🔐 웹 서비스 운영자"
  tag: "비즈니스"
  desc: "악성 크롤러나 봇의 접근을 막고, 글로벌 사용자에게 일관된 페이지 로딩 속도를 제공해야 하는 분."
:::

# 필수 서비스 활용 가이드

Cloudflare의 수많은 기능 중 실무에서 가장 많이 쓰이는 두 가지 설정법입니다.

### A. 도메인 연결 및 CDN 적용

::: step-list
- title: "도메인 추가"
  desc: "대시보드에서 구매한 도메인 이름을 입력하고 Free 플랜을 선택합니다."
- title: "네임서버 변경"
  desc: "가비아나 호스팅케이알 등 도메인 구매처로 가서 네임서버를 Cloudflare가 제공한 주소로 변경합니다."
- title: "DNS 레코드 설정"
  desc: "A 레코드나 CNAME을 추가하고, 구름 아이콘을 '오렌지색(프록시 켜짐)'으로 활성화하여 보안/캐싱을 적용합니다."
- title: "SSL/TLS 설정"
  desc: "SSL 모드를 '전체(Full) 또는 전체 엄격'으로 설정하여 완벽한 HTTPS 통신을 보장합니다."
:::

### B. 홈 서버를 위한 Cloudflare Tunnels 구축

| 기존 포트포워딩 방식 | Cloudflare Tunnels (Zero Trust) |
| --- | --- |
| 공유기 설정 복잡함 | 공유기 설정 변경 불필요 |
| 내 공인 IP가 외부 노출됨 | IP 노출 없음 (Cloudflare가 중계) |
| 통신사 포트 차단 시 접속 불가 | 포트 차단과 무관하게 아웃바운드 통신 |
| 보안 취약 (직접 뚫림) | Cloudflare 방화벽 및 인증 적용 가능 |

# 실무 효율을 높이는 팁

::: compare-grid cols=3
- title: "Cloudflare Pages vs Vercel"
  desc: "배포 속도나 DX는 Vercel이 앞서지만, **트래픽 무제한**이라는 점에서 미디어 자산이 많은 페이지는 Cloudflare Pages가 유리합니다."
  meta: "용도별 배포 플랫폼 분리"
- title: "Page Rules (페이지 규칙)"
  desc: "특정 URL(예: `/api/*`)은 캐싱을 피하고, 정적 이미지 폴더는 영구 캐싱하도록 정밀하게 제어합니다."
  meta: "성능 최적화 필수"
- title: "Access (인증 보안)"
  desc: "개발용 웹사이트나 개인 NAS 접속 페이지 앞에 구글 로그인이나 이메일 인증 화면을 강제로 띄워 방어합니다."
  meta: "완벽한 사생활 보호"
:::

# 마무리 체크리스트

### 아키텍처 점검

- DNS 탭에서 주황색 구름(프록시) 아이콘이 켜져 있어 실제 IP가 숨겨져 있는가?
- SSL/TLS 인증서가 만료되지 않고 정상적으로 자동 갱신되도록 설정되었는가?
- 불필요한 해외 IP 공격을 막기 위해 보안(WAF) 규칙에서 특정 국가 차단 룰을 설정했는가?

> 💡 TIP: Docker를 사용해 미니 PC 등에서 자동화 노드(n8n 등)나 개인용 앱을 구동 중이라면, 컨테이너 내부에 cloudflared를 설치하여 Tunnels를 연결해보세요. 로컬 IP(localhost:5678)를 n8n.my-domain.com으로 즉시 매핑할 수 있습니다.

## 가장 안전하고 빠른 인프라를 구축하세요

내 도메인의 네임서버를 연결하는 순간, 디도스 방어와 트래픽 가속이 자동으로 시작됩니다.

대시보드 이동
