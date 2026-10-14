---
title: (md-to-shortcode) 숏코드 카탈로그 — 자체 완결 백업
type: 참조
연결: "cs_v2 안에서는 docs/shortcode-reference.md 와 library/layouts.json(공용 카탈로그)이 authoritative. 이 파일은 cs_v2 밖에서 쓸 때의 백업 — 공용 카탈로그에서 다시 만든다(가이드 데이터 config/shortcode-guide.ts 기준)."
기준일: 2026-10-14 (이름은 기능 이름 하나로 운영 — cs_v2 가 직접 그리는 64종, 견본 2종은 근사)
---

# 기본 문법

```markdown
::: 숏코드명 [인수...]
- field1: "값"
  field2: "값"
- field1: "다음 항목"
:::
```

- 각 항목(`-`)은 YAML 리스트 형태.
- 문자열 값은 큰따옴표로 감싼다. 콜론(`:`)이 값에 포함되면 필수.
- `desc`/`note`/`meta`는 `\n`(또는 YAML `|` 블록)으로 멀티라인 가능. `meta`는 `|`로 여러 항목 구분.
- 표준 키(대부분의 숏코드가 공유): `icon`, `title`, `desc`, `tag`, `meta`, `note`, `color`, `bullet`, `featured`.
- 공통 선택 인수: `title-size=0.95`(비율) / `title-size=1.2rem`(절대값), `desc-size=` 동일 방식.

# 그룹별 카탈로그 (기능 이름 — cs_v2 가 직접 그리는 64종)

이름은 **기능 이름 하나**만 쓴다(`<그룹>.<형태>`, pptgen 과 같음). 모양 변형은 인수로(아래 '변형' 표).
배치 인수 기본값은 공용 카탈로그(`config/library/layouts.json` args.default) — 공통 인수(`bg=alt`·`title-size`·`desc-size`)와 항목 `tag: alt`(그 카드만 보조 카드색)는 모든 배치에서 된다.

## 분할·카드 (`grid`)

| 기능 이름 | 용도 | 필드 | 배치 인수(기본값) |
|---|---|---|---|
| `grid.cards` | 아이콘+제목+설명 카드 격자. align 으로 모양 변형: center(기본) / left(왼쪽 아이콘) / row(수평 배열). | icon 아이콘 키 또는 이모지 · title 제목 · desc 설명 · color 카드 강조색(선택) | cols=1~6 (항목 수에 맞춤) · align=center\|left\|row (center) · badge=icon\|number\|none (icon) · header=문자열 |
| `grid.features` | 태그 배지 및 아이콘이 포함된 다채로운 핵심 피처 카드 그리드입니다. | icon 아이콘(선택) · title 제목 · tag 오른쪽 위 꼬리표 · desc 설명 | cols=1~6 (항목 수에 맞춤) · header=문자열 |
| `grid.badges` | 여러 장점이나 키워드를 작은 배지 칩으로 콤팩트하게 나열합니다. | icon 아이콘 · title 이름 · tag 꼬리표 | cols=1~6 (항목 수에 맞춤) |
| `grid.list` | 사용 도구나 스펙의 강점을 헤더(아이콘, 제목, 부제)와 기능 목록 형태로 렌더링합니다. | icon 아이콘 · title 이름 · desc 한 줄 설명 · tag 꼬리표 · meta 글머리(｜ 구분) | — |
| `grid.tiers` | 추천 요금제(tag=Best)나 상품 가격/기능 구성품 스펙을 카드 형태로 비교합니다. | title 등급 이름 · tag 꼬리표(가격·Best 등) · meta 구성 목록(｜ 구분) · featured true = 강조 카드 · note 아래 설명 | cols=1~6 (항목 수에 맞춤) |
| `grid.columns` | 가로 다단 카드 격자. variant=plain 이면 상단 색 띠 없는 담백한 카드(비교 용도). | title 제목 · desc 설명 · note 아래 팁 상자 · color 카드 강조색 | cols=1~6 (항목 수에 맞춤) · header=문자열 · variant=card\|plain (card) |
| `grid.main-plus-3` | 큰 칸 하나(핵심)와 오른쪽에 세로로 쌓은 작은 칸 셋. 핵심 하나를 크게 두고 보조 항목 셋을 곁들일 때. | title 소제목(상자 첫 줄) · meta 글머리(｜ 구분) · desc 글머리로 이어 붙임 | header=문자열 |
| `grid.cards-icon-3` | 카드 3열 — 알약 제목, 원 안의 짧은 말(desc), 아래 글머리. 세 축을 같은 무게로 보여 줄 때. | title 소제목(상자 첫 줄) · meta 글머리(｜ 구분) · desc 글머리로 이어 붙임 | header=문자열 |
| `grid.wide-narrow-titled` | 넓은 칸 + 좁은 칸, 칸마다 알약 제목. 주 내용과 보조 내용을 나란히. | title 소제목(상자 첫 줄) · meta 글머리(｜ 구분) · desc 글머리로 이어 붙임 | header=문자열 |
| `grid.narrow-wide-titled` | 좁은 칸 + 넓은 칸, 칸마다 알약 제목. 짧은 요약 옆에 긴 설명을 둘 때. | title 소제목(상자 첫 줄) · meta 글머리(｜ 구분) · desc 글머리로 이어 붙임 | header=문자열 |
| `grid.box-1` | 본문 전체를 차지하는 상자 하나 — 제목과 글머리. 한 가지 메시지를 넓게. | title 소제목(상자 첫 줄) · meta 글머리(｜ 구분) · desc 글머리로 이어 붙임 | header=문자열 |
| `grid.box-2` | 같은 크기 상자 2개 — 제목과 글머리. 대등한 두 항목(기회/위험 등). | title 소제목(상자 첫 줄) · meta 글머리(｜ 구분) · desc 글머리로 이어 붙임 | header=문자열 |
| `grid.box-3` | 같은 크기 상자 3개 — 제목과 글머리. 대등한 세 축(사람·프로세스·기술 등). | title 소제목(상자 첫 줄) · meta 글머리(｜ 구분) · desc 글머리로 이어 붙임 | header=문자열 |
| `grid.box-4` | 같은 크기 상자 4개 — 제목과 글머리. 4단계 순환이나 네 영역. | title 소제목(상자 첫 줄) · meta 글머리(｜ 구분) · desc 글머리로 이어 붙임 | header=문자열 |
| `grid.narrow-wide` | 좁은 칸 + 넓은 칸. 요약과 설명을 좌우로. | title 소제목(상자 첫 줄) · meta 글머리(｜ 구분) · desc 글머리로 이어 붙임 | header=문자열 |
| `grid.wide-narrow` | 넓은 칸 + 좁은 칸. 설명과 요약을 좌우로. | title 소제목(상자 첫 줄) · meta 글머리(｜ 구분) · desc 글머리로 이어 붙임 | header=문자열 |
| `grid.circle-3` | 큰 원 3개 — 원 안에 제목, 아래 글머리. 세 개념을 상징적으로. | title 소제목(상자 첫 줄) · meta 글머리(｜ 구분) · desc 글머리로 이어 붙임 | header=문자열 |
| `grid.band-box-3` | 위 머리띠(header 인수) + 상자 3개. 상위 메시지 아래 세 축을 펼칠 때. | title 소제목(상자 첫 줄) · meta 글머리(｜ 구분) · desc 글머리로 이어 붙임 | header=문자열 |

## 비교·대조 (`compare`)

| 기능 이름 | 용도 | 필드 | 배치 인수(기본값) |
|---|---|---|---|
| `compare.pair` | 두 대상을 좌우로 2단 분할 배치하여 전후 관계나 상세 비교를 렌더링합니다. | title 쪽 이름 · desc 설명 · meta 글머리(｜ 구분) · color 쪽 색 | — |
| `compare.before-after` | AS-IS(구형)와 TO-BE(신형)를 ❌/✅ 레이블로 단순 명확하게 전후 대조합니다. | title 상태 이름 · desc 설명 | — |
| `compare.main-sub` | 비대칭 2분할 — 주 칸이 크고 부 칸이 작다(ratio 인수). 핵심 주장과 보조 정보를 함께. | title 쪽 이름 · desc 설명 · meta 글머리 | ratio=0.5~0.75 (0.64) |
| `compare.balance` | 천칭 위 두 쪽 — 균형·절충 관계(속도 대 안전 등)를 보여 줄 때. | icon 아이콘 · title 쪽 이름 · desc 설명 | — |
| `compare.hbars` | 가로 막대를 쌓아 단계별 확장을 비교(뒤로 갈수록 넓어짐). emphasis 로 강조 막대. | icon 아이콘 · title 이름 · desc 설명 · tag highlight = 강조 | emphasis=last\|first\|none\|<번호> (none) |
| `compare.pair-summary` | 좌우 비교 칸 + 아래 결론 띠(header 인수). 비교 끝에 한 줄 결론. | title 칸 이름(알약) · desc 설명 · meta 글머리(｜ 구분) | header=문자열 |

## 순서·흐름 (`process`)

| 기능 이름 | 용도 | 필드 | 배치 인수(기본값) |
|---|---|---|---|
| `process.track` | 단계별 흐름을 가로로 표현. connector=line(기본) 이면 단계 사이 가는 선, arrow 면 화살표로 이은 단계, none 이면 연결 없음(화살표는 type: arrow 항목). tag:active 또는 emphasis=last\|first\|번호 로 강조, badge=number\|none 으로 원 칸 변경, meta 로 도구/코멘트. | icon 아이콘 · title 단계 · desc 설명 · meta 도구·코멘트 · tag active = 강조 | connector=arrow\|line\|none (line) · badge=icon\|number\|none (icon) · emphasis=last\|first\|none\|<번호> (none) |
| `process.steps` | 1, 2, 3... 순번이 자동으로 매겨진 단계식 지침과 부연 설명을 노출합니다. | title 단계 · desc 설명 · color 번호색 | badge=icon\|number\|none (number) |
| `process.staircase` | 뒤로 갈수록 높아지는 계단 — 진화·성장 단계. grow(높이 배율)·emphasis·caption, meta = 시점. | icon 아이콘 · title 단계 · desc 설명 · meta 시점 · tag highlight = 강조 | grow=1.0~1.6 (1.35) · emphasis=last\|first\|none\|<번호> (last) · caption=문자열 |
| `process.levels` | 난이도·성숙도·역량 구간을 카드 격자로 비교. tag:highlight 로 강조 카드 지정. | title 수준 · desc 설명 · tag highlight = 강조 · color 색 | cols=1~6 (항목 수에 맞춤) · grow=1.0~1.6 (1.0) · emphasis=last\|first\|none\|<번호> (none) |
| `process.branch` | Git 브랜치나 버전 릴리즈 흐름을 노드형 다이어그램으로 가시화합니다. | title 단계 · tag 갈래 이름 · meta 설명 · color 갈래 색 | connector=arrow\|line\|none (line) |
| `process.growth` | 이전 → 이후 두 패널로 성장 서사를 보여 줌. icon = 수치(1억 → 8억). | title 상태 · desc 설명 · icon 수치 | — |
| `process.cycle-3` | 세 단계가 돌아가는 삼각 순환(기록 → 학습 → 적용). | icon 아이콘 · title 단계 · desc 설명 | — |
| `process.zigzag` | 위·아래로 번갈아 놓인 노드를 잇는 지그재그 로드맵. emphasis 로 현재 단계. | icon 아이콘 · title 단계 · desc 설명 | emphasis=last\|first\|none\|<번호> (none) |
| `process.cards-arrow-4` | 카드 4단계를 화살표로 잇고, 카드마다 알약 제목·원(desc)·글머리 목록. | title 단계 이름 · desc 원 안 글(짧게) · meta 글머리(｜ 구분) | header=문자열 |
| `process.input-circles-4` | 원 4단계를 화살표로 잇고 아래 흐름 띠. 원 안에 단계 이름과 짧은 말, 아래 글머리. | title 단계 이름 · desc 원 안 글(짧게) · meta 글머리(｜ 구분) | header=문자열 |
| `process.band-columns-3` | 머리띠 + 3열 — 열마다 번호 원·제목·전 → 후 짝(meta 를 짝으로 읽음). 변화 비교. | title 열 이름 · desc 번호 원 글 · meta 전 \| 후 \| 전 \| 후 … (짝으로 읽어 전 → 후 줄) | header=문자열 |
| `process.steps-checklist-3` | 머리띠 + 3단계 — 단계마다 번호 원·제목·체크 목록. | title 단계 이름 · desc 번호 원 글 · meta 체크 목록(｜ 구분) | header=문자열 |

## 구조·관계 (`structure`)

| 기능 이름 | 용도 | 필드 | 배치 인수(기본값) |
|---|---|---|---|
| `structure.hub` | 여러 개념 간의 연계성 또는 네트워크 연결 관계를 시각화합니다. | title 첫 항목 = 중심, 나머지 = 주변 · meta 관계 설명 · icon 아이콘 · color 색 | — |
| `structure.pillars` | 기반 위에 선 기둥 — 첫 항목이 기반(아래 띠), 나머지가 기둥. | title 첫 항목 = 기반, 나머지 = 기둥 · desc 설명 · icon 아이콘 | — |
| `structure.rings` | A⊃B⊃C 같은 계층적 포함관계 표현. 항목은 바깥(큰 범주)에서 안쪽(구체적 범주) 순서로 작성. | title 범주 · color 색 · icon 마지막 항목 = 중심 아이콘 | — |
| `structure.venn` | 두 영역이 겹칠 때 새로운 가치/의미가 발생함을 표현. 항목 3개 고정 순서(왼쪽 원 / 오른쪽 원 / 교집합 캡션). | title [0] 왼쪽 원 · [1] 오른쪽 원 · desc [2] 교집합 설명 · icon [2] 교집합 아이콘 · color 원 색 | — |
| `structure.groups-2x3` | 두 그룹 × 원 여러 개 — 그룹마다 알약 제목·설명, meta 를 원으로. | title 그룹 이름(알약) · desc 설명 · meta 원(｜ 구분, 3~4개) | — |

## 데이터·수치 (`data`)

| 기능 이름 | 용도 | 필드 | 배치 인수(기본값) |
|---|---|---|---|
| `data.stats` | 수치 데이터(icon)와 통계 지표 정보(title, desc)를 상단 바 보더와 함께 시각화합니다. | icon 수치(예: 53%) · title 지표 이름 · desc 설명 · color 색 | cols=1~6 (항목 수에 맞춤) · emphasis=last\|first\|none\|<번호> (none) |
| `data.summary-bar` | 수치 통계나 단위 성과들을 가로형 바 형태로 간결하게 나열합니다. | icon 수치 · title 이름 | — |
| `data.bars` | 가로 막대그래프 — 값(icon)의 극단 대비를 sqrt 척도로 읽히게(scale 인수). emphasis 로 강조 막대. | title 이름 · icon 값(숫자) · tag highlight = 강조 | scale=linear\|sqrt (sqrt) · emphasis=last\|first\|none\|<번호> (none) |
| `data.quadrant` | 두 축(X/Y) 기준으로 여러 항목의 상대 위치를 비교. 축 라벨은 블록 인수로 지정. | title 점 이름 · fx 가로 위치 0~1 · fy 세로 위치 0~1 · color 색 | xLabel=문자열 · yLabel=문자열 |
| `data.gauge` | 반원 게이지 — 값(icon, 0~100)의 위치·비율. left/right 인수로 호 양 끝 이름. | title 이름 · icon 값(0~100) · desc 설명 | left=문자열 · right=문자열 |

## 서술·강조 (`text`)

| 기능 이름 | 용도 | 필드 | 배치 인수(기본값) |
|---|---|---|---|
| `text.statement` | 중앙에 큰 문장 하나(+보조 문장·요약 칩). 블록 없이 쓴 일반 문단과 같은 뜻. | title 중앙 문장 · desc 보조 문장 · meta 요약 줄(｜ 구분) | — |
| `text.body` | 일반 문단·글머리 — 숏코드 없이 쓴 본문을 블록으로 쓸 때(bullet 이 있으면 글머리). | desc 문단 또는 글머리 한 줄 | — |
| `text.quote` | 인물의 핵심 발언 — 이니셜 원·발언·출처, 아래 맥락 카드. | title 발언 · meta 시기·출처 · icon 이니셜 · desc 하단 카드 | — |
| `text.takeaway` | 강조하고 싶은 핵심 교훈이나 테이크어웨이 메시지를 한 줄 배너로 노출합니다. | icon 아이콘 · title 머리말 · desc 메시지 | — |
| `text.callout` | 팁·정보·주의·위험·성공 알림 상자. 종류는 첫 인수 또는 variant= (tip\|info\|warning\|danger\|success). | title 제목 · desc 내용 · color 색 | variant=tip\|info\|warning\|danger\|success (info) |
| `text.summary` | 가이드 마지막 단에 배치하여 내용을 정리하고, 하단에 다량의 태그 칩을 덧붙입니다. | title 제목 · desc 설명 · meta 칩(｜ 구분) | — |
| `text.section` | 긴 문서나 슬라이드 중 단원/파트의 구분을 나누는 가로 대형 단막 배너입니다. | icon 아이콘 · title 구역 이름 · desc 설명 · tag 꼬리표 | — |
| `text.icon-statement` | 큰 아이콘 하나와 문장 — 한 가지 메시지를 아이콘으로 강조. | icon 아이콘 · title 문장 · desc 보조 | — |
| `text.avatar` | 인물 이니셜 원 + 이름·소속(보조 요소). | icon 이니셜 · title 이름 · desc 소속 | — |

## 코드·터미널 (`code`)

| 기능 이름 | 용도 | 필드 | 배치 인수(기본값) |
|---|---|---|---|
| `code.editor` | 코드 에디터 창(예: VS Code)의 외형을 흉내 낸 다크 에뮬레이터 블록입니다. | title 파일 이름 · tag 언어 · desc 코드(여러 줄) | — |
| `code.console` | 시스템 명령어나 스크립트 실행 결과를 출력하는 콘솔화면 블록입니다. | title 제목 · tag 꼬리표 · desc 출력(여러 줄) | — |
| `code.command` | 실행해야 하는 명령어(CLI)를 안내하는 터미널 모형 박스입니다. | title 설명 · tag 셸 · desc 명령 | — |

## 탐색·목록 (`nav`)

| 기능 이름 | 용도 | 필드 | 배치 인수(기본값) |
|---|---|---|---|
| `nav.faq` | 질문(title)과 그에 답하는 답변(desc) 형태의 아코디언 질문-답변 리스트입니다. | title 질문 · desc 답변 | — |
| `nav.tabs` | Windows / macOS 등 플랫폼별 조치 방법이나 다중 탭을 리스트로 안내합니다. | title 탭 이름 · desc 내용 | — |
| `nav.chapters` | 시리즈 부(Part) 하위에 속한 세부 챕터를 번호·제목·설명·구분 배지로 목록화합니다. | icon 번호 · title 제목 · desc 설명 · tag 종류(개념·도구·사례…) | — |

## 이미지 혼합 (`media`)

| 기능 이름 | 용도 | 필드 | 배치 인수(기본값) |
|---|---|---|---|
| `media.cards-image` | 정보 카드 N개 + 이미지(side 인수로 이미지 쪽). 항목 src 가 있으면 그 그림, 없으면 이미지 자리. | title 카드 제목 · desc 설명 | side=left\|right (right) |
| `media.banner` | 위 핵심 문장 두세 줄 + 아래 넓은 이미지 띠. | title 글머리 | — |
| `media.full` | 본문 전체 이미지 자리 — desc 에 이미지 프롬프트, src 가 있으면 그림. | desc 이미지 프롬프트 | — |

# 변형은 인수로

| 배치 | 인수 | 모양 |
|---|---|---|
| `grid.cards` | `align=center`(기본)·`left`·`row` | 중앙 카드 / 왼쪽 아이콘 / 수평 |
| `grid.columns` | `variant=card`(기본)·`plain` | 상단 색 띠 / 띠 없는 비교 카드 |
| `process.track` | `connector=arrow`·`none` | 화살표로 이은 단계 / 연결 없음(화살표는 `type: arrow` 항목) |
| `text.callout` | 첫 인수 또는 `variant=` — `tip`·`info`·`warning`·`danger`·`success` | 알림 종류 |
| 모든 배치 | `bg=alt` | 이 블록 카드만 보조 카드색 |

# 옛 이름 — 쓰지 않는다

예전 문서를 읽을 수는 있지만(빌드가 기능 이름+인수로 바꾸고 경고) 새로 쓰는 md 에는 넣지 않는다. 받은 md 에 옛 이름이 있으면 cs_v2 `npm run migrate:names -- <파일>` 로 바꾼다.

| 옛 이름 | 기능 이름 + 인수 |
|---|---|
| `alert-box` | `text.callout` |
| `asymmetric-split` | `compare.main-sub` |
| `badge-grid` | `grid.badges` |
| `balance-beam` | `compare.balance` |
| `bar-chart` | `data.bars` |
| `before-after` | `compare.before-after` |
| `bottom-list` | `text.summary` |
| `box-image-split` | `media.cards-image` |
| `chapter-list` | `nav.chapters` |
| `checkpoint-grid` | `grid.cards align=row` |
| `cmd-box` | `code.command` |
| `columns-grid` | `grid.columns` |
| `compare-before-after` | `compare.before-after` |
| `compare-diff` | `compare.before-after` |
| `compare-grid` | `grid.columns variant=plain` |
| `compare-split` | `compare.pair` |
| `concentric-rings` | `structure.rings` |
| `console-box` | `code.console` |
| `editor-box` | `code.editor` |
| `faq-list` | `nav.faq` |
| `feature-grid` | `grid.features` |
| `flow` | `process.track connector=none` |
| `flow-track` | `process.track` |
| `gauge-arc` | `data.gauge` |
| `git-flow` | `process.branch` |
| `git-flow-strip` | `process.branch` |
| `growth-panel` | `process.growth` |
| `hub-spoke` | `structure.hub` |
| `icon-caption` | `text.icon-statement` |
| `icon-grid` | `grid.cards` |
| `level-grid` | `process.levels` |
| `network-box` | `structure.hub` |
| `os-tabs` | `nav.tabs` |
| `part-banner` | `text.section` |
| `part-deck` | `text.section` |
| `pillars-on-base` | `structure.pillars` |
| `plan-grid` | `grid.tiers` |
| `quadrant-chart` | `data.quadrant` |
| `quote-hero` | `text.quote` |
| `skill-list` | `grid.cards align=left` |
| `split-2box` | `compare.pair` |
| `stacked-bars` | `compare.hbars` |
| `stat-grid` | `data.stats` |
| `stat-row` | `data.stats` |
| `step-flow` | `process.track connector=none` |
| `step-list` | `process.steps` |
| `summary-bar` | `data.summary-bar` |
| `summary-box` | `text.summary` |
| `takeaway` | `text.takeaway` |
| `takeaway-banner` | `text.takeaway` |
| `tool-box` | `grid.list` |
| `tool-list` | `grid.list` |
| `triangle-cycle` | `process.cycle-3` |
| `venn` | `structure.venn` |
| `venn-diagram` | `structure.venn` |
| `workflow-flow` | `process.track connector=arrow` |
| `workflow-strip` | `process.track connector=arrow` |
| `zigzag-path` | `process.zigzag` |

# 특수 토큰

- `type: "arrow"` — `process.track` 안에서만 쓰는 방향 화살표 항목.
- `::: slide-config` — 화면에 렌더링되지 않는 설정 전용 블록. 키: `bg`(배경색 hex), `color`(글자색 hex), `titleSize`/`bodySize`(pt), `notes`(발표스크립트 — PPTX 노트로만 반영, HTML 무관. 여러 줄은 `notes: |` 다음 들여쓴 줄 또는 `\n`).
- Mermaid 구조도 — 숏코드 아님, 표준 ` ```mermaid ` fenced code block. 가이드·프레젠테이션 HTML은 mermaid.js로 실제 렌더링되지만, **PPTX는 전용 렌더러가 없어 원문이 코드박스로 표시된다**(다이어그램 이미지로 변환 안 됨).

# PPTX 지원 현황

HTML(종형 가이드·횡형 슬라이드)은 위 64종을 모양 그대로 그린다. cs_v2 자체 PPTX 는 빠른 근사다 — 옛 숏코드 28종은 같은 모양, 나머지(`process.staircase`·`structure.pillars`·`data.gauge`·회사 패턴 상자 등)는 카탈로그 `pptx_shortcode` 가 가리키는 가장 가까운 숏코드로 그린다. 정밀한 PPTX 는 pptgen(같은 md 그대로)이 직접 그린다. 견본 2종(`sample.*`)은 HTML 도 근사. Mermaid는 PPTX 에서 코드박스.
