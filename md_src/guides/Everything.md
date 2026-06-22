---
title: "Everything(에브리띵)"
subtitle: "초고속 파일 검색"
badge: "🔍 Windows 전용 · 완전 무료 · 오픈소스"
style: "productivity"
stats:
  - value: "<1초"
    label: "전체 드라이브 검색"
  - value: "0MB"
    label: "RAM 점유율"
  - value: "무료"
    label: "완전 무료"
  - value: "실시간"
    label: "파일 변경 반영"
---

# 왜 Everything인가?

검색 속도 비교 — "2024 예산보고서.xlsx" 찾기

🐌 Windows 기본 검색

인덱스 없는 폴더: 탐색기에서 검색

드라이브 전체 스캔

로딩 인디케이터 돌아가는 중...

파일 하나씩 순차 검색

30초 ~ 5분

⚡ Everything

Win+Alt+E로 실행

파일명 타이핑 시작

입력과 동시에 결과 표시

전체 드라이브 즉시 완료

0.1초

::: alert-box tip
- title: "💡 동작 원리:"
  desc: "Windows NTFS의 MFT(Master File Table)를 직접 읽어 모든 파일 정보를 메모리에 인덱싱. 설치 직후 빠르게 인덱스 구축 후 실시간 업데이트."
:::

# 검색 문법 & 고급 쿼리

::: columns-grid cols=3
- title: |
    *.xlsx
  desc: "특정 확장자 파일 전체 검색"
  meta: "예: *.pptx, *.pdf, *.py"
- title: "보고서 2025"
  desc: "두 단어 모두 포함 (AND)"
  meta: "띄어쓰기 = AND 조건"
- title: "ext:xlsx dm:today"
  desc: "오늘 수정된 Excel 파일"
  meta: "dm:yesterday / dm:thisweek"
- title: "path:C:\\Projects *.py"
  desc: "특정 폴더 내에서만 검색"
  meta: "경로 + 파일명 조합"
- title: "size:>10mb *.mp4"
  desc: "10MB 초과 MP4 파일"
  meta: "size:<1mb, size:1mb..100mb"
- title: "regex:2025\\d{4}"
  desc: "정규식 패턴 검색"
  meta: "고급 사용자 패턴 매칭"
:::

⭐ 자주 쓰는 쿼리 저장:

자주 사용하는 검색식은 Bookmarks로 저장 가능. 예: "*.pptx dm:thismonth" → "이달 PPT 파일"로 즐겨찾기.

# 주요 기능

::: icon-grid
- icon: "⚡"
  title: "실시간 인덱스"
  desc: "파일 생성·삭제·이동 즉시 반영. 항상 최신 상태 유지."
- icon: "🖱️"
  title: "우클릭 메뉴 통합"
  desc: "결과에서 우클릭 → 열기·경로 복사·폴더 열기 즉시 실행."
- icon: "🌐"
  title: "HTTP 서버"
  desc: "내부망에서 Everything을 웹 서버로 실행. 다른 PC에서 검색 가능."
- icon: "⌨️"
  title: "글로벌 단축키"
  desc: "어떤 창에서도 Win+Alt+E로 즉시 검색창 호출 (설정 가능)."
:::

# 설치 & 설정

::: step-list
- title: "1voidtools.com 접속 → Everything 다운로드 및 설치 (무료)32/64비트 선택. 설치 파일 크기 2MB 이하로 매우 가벼움."
- title: "2최초 실행 시 자동 인덱싱 시작 (수십 초 ~ 수 분)SSD 환경에서는 100만 파일도 1분 이내 완료. 이후 실시간 업데이트."
- title: "3Tools → Options → 글로벌 단축키 설정Win+Alt+E 또는 원하는 단축키로 변경. 시작 프로그램에 등록 권장."
- title: "4시스템 트레이에 상주하며 백그라운드 실행CPU·RAM 점유율 거의 0%. 항상 켜두어도 성능 영향 없음."
:::

::: alert-box tip
- title: "💡 PowerToys Run 연동:"
  desc: "Microsoft PowerToys 설치 후 Alt+Space → Everything 플러그인 활성화. PowerToys Run 검색창에서 Everything 검색 동시 사용 가능."
:::
