---
title: "Creative Spark 숏코드 쇼케이스"
subtitle: "현재 등록된 숏코드의 입력 문법과 HTML 구현 결과를 함께 확인하는 레퍼런스"
badge: "Shortcode Reference · v2.0"
style: "ai-chat"
stats:
  - value: "29종"
    label: "지원 숏코드"
  - value: "8개"
    label: "표준 입력 키"
  - value: "HTML/PPTX"
    label: "동시 변환"
  - value: "cols/bullet"
    label: "블록 인자 제어"
---

# 현재 지원 숏코드 목록

| 분류 | 숏코드 |
| --- | --- |
| **Group A: Grid** | `icon-grid`, `feature-grid`, `badge-grid`, `stat-grid`, `columns-grid`, `compare-grid`, `plan-grid`, `level-grid`, `checkpoint-grid` |
| **Group B: List** | `step-list`, `skill-list`, `chapter-list`, `faq-list`, `tool-list` |
| **Group C: Flow** | `workflow-flow`, `git-flow`, `step-flow` |
| **Group D: Box** | `alert-box`, `cmd-box`, `console-box`, `editor-box`, `network-box`, `summary-box` |
| **Group E: Split** | `compare-split`, `compare-diff` |
| **Group F: Banner & Bar** | `part-banner`, `takeaway-banner`, `summary-bar` |
| **Group G: Interactive** | `os-tabs` |

# 숏코드 표준 입력 키

| 키 | 용도 | 비고 |
| --- | --- | --- |
| `icon` | 아이콘, 수치, 짧은 시각 라벨 | 이모지 또는 짧은 문자열 |
| `title` | 카드/항목 제목 | 필수에 가까운 기본 키 |
| `desc` | 본문 설명 또는 코드 | `\n`으로 구분하면 불릿 목록 |
| `tag` | 배지, 상태, 언어 라벨 | 플랜명, 추천, OS명 등에 사용 |
| `meta` | 추가 목록, 칩, 피처 리스트 | `\|`로 여러 항목 구분 |
| `note` | 하단 배지·메모 | `\n` → ` · ` 구분; `plan-grid`에서 가격 배지로 사용 |
| `color` | 개별 강조색 + SVG 불릿 색 | Hex 색상 권장 |
| `bullet` | 아이템별 불릿 기호 오버라이드 | `bullet: "✅"` — color보다 우선 |

숏코드별 예약 키: `featured`는 `plan-grid` 추천 플랜 강조, `alert-box`는 선언부 `tip·warn·success·danger` 타입을 읽습니다.

# 블록 인자

숏코드명 뒤에 공백으로 지정하며 복수 조합이 가능합니다.

| 인자 | 대상 | 설명 |
| --- | --- | --- |
| `cols=N` | grid 계열 5종 | CSS 컬럼 수 강제 지정 |
| `bullet=X` | 전체 | 블록 기본 불릿 기호 지정 |

```md
\::: feature-grid cols=3 bullet=✅
```

---

# 1. icon-grid

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `icon-grid` |
| 구현내용 | 아이콘 중심의 기본 카드 그리드. 핵심 기능, 사용 사례, 장점 목록에 적합합니다. |

숏코드 입력내용

```md
\::: icon-grid cols=3
- icon: "⚡"
  title: "빠른 작업"
  desc: "반복 작업을 줄이고 결과물을 빠르게 만듭니다."
- icon: "🎨"
  title: "쉬운 디자인"
  desc: "템플릿과 프리셋으로 초보자도 보기 좋은 결과를 만들 수 있습니다."
- icon: "🤝"
  title: "팀 협업"
  desc: "링크 공유와 댓글로 팀 작업을 이어갈 수 있습니다."
\:::
```

::: icon-grid cols=3
- icon: "⚡"
  title: "빠른 작업"
  desc: "반복 작업을 줄이고 결과물을 빠르게 만듭니다."
- icon: "🎨"
  title: "쉬운 디자인"
  desc: "템플릿과 프리셋으로 초보자도 보기 좋은 결과를 만들 수 있습니다."
- icon: "🤝"
  title: "팀 협업"
  desc: "링크 공유와 댓글로 팀 작업을 이어갈 수 있습니다."
:::

# 2. feature-grid

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `feature-grid` |
| 구현내용 | 상단 태그와 제목이 강조되는 설명형 기능 카드입니다. |

숏코드 입력내용

```md
\::: feature-grid cols=3
- icon: "🧠"
  title: "AI 자동화"
  tag: "핵심"
  desc: "입력 자료를 바탕으로 초안, 편집, 요약을 자동 생성합니다."
  color: "#6366F1"
- icon: "🧰"
  title: "템플릿 활용"
  tag: "실전"
  desc: "자주 쓰는 형식을 저장해 같은 품질의 결과물을 반복 제작합니다."
  color: "#10B981"
- icon: "🔗"
  title: "링크 배포"
  tag: "공유"
  desc: "완성된 결과를 링크나 파일로 공유하고 피드백을 받을 수 있습니다."
  color: "#F59E0B"
\:::
```

::: feature-grid cols=3
- icon: "🧠"
  title: "AI 자동화"
  tag: "핵심"
  desc: "입력 자료를 바탕으로 초안, 편집, 요약을 자동 생성합니다."
  color: "#6366F1"
- icon: "🧰"
  title: "템플릿 활용"
  tag: "실전"
  desc: "자주 쓰는 형식을 저장해 같은 품질의 결과물을 반복 제작합니다."
  color: "#10B981"
- icon: "🔗"
  title: "링크 배포"
  tag: "공유"
  desc: "완성된 결과를 링크나 파일로 공유하고 피드백을 받을 수 있습니다."
  color: "#F59E0B"
:::

# 3. badge-grid

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `badge-grid` |
| 구현내용 | 작은 서비스/기능 배지를 조밀하게 나열합니다. |

숏코드 입력내용

```md
\::: badge-grid cols=4
- icon: "🧪"
  title: "테스트"
  tag: "Vitest"
- icon: "📦"
  title: "빌드"
  tag: "Vite"
- icon: "🎞"
  title: "슬라이드"
  tag: "PPTX"
- icon: "🌐"
  title: "웹"
  tag: "HTML"
\:::
```

::: badge-grid cols=4
- icon: "🧪"
  title: "테스트"
  tag: "Vitest"
- icon: "📦"
  title: "빌드"
  tag: "Vite"
- icon: "🎞"
  title: "슬라이드"
  tag: "PPTX"
- icon: "🌐"
  title: "웹"
  tag: "HTML"
:::

# 4. stat-grid

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `stat-grid` |
| 구현내용 | 수치와 짧은 설명을 강조하는 통계 카드입니다. |

숏코드 입력내용

```md
\::: stat-grid cols=3
- icon: "29종"
  title: "숏코드"
  desc: "현재 빌더가 렌더링하는 컴포넌트 수"
- icon: "2종"
  title: "출력"
  desc: "HTML과 PPTX를 같은 MD에서 생성"
- icon: "8개"
  title: "표준 키"
  desc: "icon·title·desc·tag·meta·note·color·bullet"
\:::
```

::: stat-grid cols=3
- icon: "29종"
  title: "숏코드"
  desc: "현재 빌더가 렌더링하는 컴포넌트 수"
- icon: "2종"
  title: "출력"
  desc: "HTML과 PPTX를 같은 MD에서 생성"
- icon: "8개"
  title: "표준 키"
  desc: "icon·title·desc·tag·meta·note·color·bullet"
:::

# 5. columns-grid

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `columns-grid` |
| 구현내용 | 일반 본문, 짧은 코드, 체크 항목을 균등한 다단 카드로 보여줍니다. |

숏코드 입력내용

```md
\::: columns-grid cols=3
- title: "HTML"
  desc: "웹 가이드로 바로 열람합니다."
  note: "node scripts/build-guide.mjs guide.md"
- title: "PPTX"
  desc: "발표 슬라이드로 변환합니다."
  note: "node scripts/md-to-pptx.mjs guide.md"
- title: "Standalone"
  desc: "전체 가이드를 단일 HTML로 묶습니다."
  note: "npm run build:standalone"
\:::
```

::: columns-grid cols=3
- title: "HTML"
  desc: "웹 가이드로 바로 열람합니다."
  note: "node scripts/build-guide.mjs guide.md"
- title: "PPTX"
  desc: "발표 슬라이드로 변환합니다."
  note: "node scripts/md-to-pptx.mjs guide.md"
- title: "Standalone"
  desc: "전체 가이드를 단일 HTML로 묶습니다."
  note: "npm run build:standalone"
:::

# 6. compare-grid

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `compare-grid` |
| 구현내용 | 여러 선택지를 카드로 비교합니다. `note`가 있으면 하단 노트로 우선 표시하고, 없으면 `meta`를 노트처럼 표시합니다. |

숏코드 입력내용

```md
\::: compare-grid cols=2
- title: "수동 HTML"
  desc: "표현 자유도는 높지만 유지보수와 PPTX 변환이 어렵습니다."
  note: "디자인 고정이 필요한 특수 페이지에 적합"
  color: "#EF4444"
- title: "숏코드 MD"
  desc: "표준 입력만으로 HTML과 PPTX를 동시에 생성할 수 있습니다."
  note: "가이드와 교육 자료에 적합"
  color: "#10B981"
\:::
```

::: compare-grid cols=2
- title: "수동 HTML"
  desc: "표현 자유도는 높지만 유지보수와 PPTX 변환이 어렵습니다."
  note: "디자인 고정이 필요한 특수 페이지에 적합"
  color: "#EF4444"
- title: "숏코드 MD"
  desc: "표준 입력만으로 HTML과 PPTX를 동시에 생성할 수 있습니다."
  note: "가이드와 교육 자료에 적합"
  color: "#10B981"
:::

# 7. plan-grid

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `plan-grid` |
| 구현내용 | 요금제, 모델 등급, 옵션 비교에 쓰는 플랜 카드입니다. `note`가 하단 가격 배지로 표시됩니다. |

숏코드 입력내용

```md
\::: plan-grid cols=3
- title: "Free"
  tag: "무료"
  meta: "기본 기능|일일 제한|커뮤니티 지원"
  note: "지금 시작"
- title: "Pro"
  tag: "추천"
  meta: "무제한 사용|고급 기능|우선 지원"
  note: "$20 / 월"
  featured: "true"
  color: "#6366F1"
- title: "Team"
  tag: "팀"
  meta: "권한 관리|공유 워크스페이스|관리자 콘솔"
  note: "문의"
\:::
```

::: plan-grid cols=3
- title: "Free"
  tag: "무료"
  meta: "기본 기능|일일 제한|커뮤니티 지원"
  note: "지금 시작"
- title: "Pro"
  tag: "추천"
  meta: "무제한 사용|고급 기능|우선 지원"
  note: "$20 / 월"
  featured: "true"
  color: "#6366F1"
- title: "Team"
  tag: "팀"
  meta: "권한 관리|공유 워크스페이스|관리자 콘솔"
  note: "문의"
:::

# 8. level-grid

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `level-grid` |
| 구현내용 | 난이도, 단계, 도메인 스펙트럼 로드맵 등을 가로형 카드 그리드로 렌더링해 줍니다. |

숏코드 입력내용

```md
\::: level-grid
- title: "LEVEL 1"
  desc: "코드 자동완성"
  meta: "GitHub Copilot 인라인"
  note: "다음 줄 예측, Tab으로 수락"
- title: "LEVEL 2"
  desc: "대화형 생성"
  meta: "Claude.ai, ChatGPT"
  note: "요청 → 붙여넣기 → 실행"
  tag: "highlight"
\:::
```

::: level-grid
- title: "LEVEL 1"
  desc: "코드 자동완성"
  meta: "GitHub Copilot 인라인"
  note: "다음 줄 예측, Tab으로 수락"
- title: "LEVEL 2"
  desc: "대화형 생성"
  meta: "Claude.ai, ChatGPT"
  note: "요청 → 붙여넣기 → 실행"
  tag: "highlight"
:::

# 9. checkpoint-grid

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `checkpoint-grid` |
| 구현내용 | 중간 검수 타이밍, 주요 체크포인트를 이모지와 가로 뱃지 형식으로 나열해 줍니다. |

숏코드 입력내용

```md
\::: checkpoint-grid
- icon: "📐"
  title: "계획 수립 후"
  desc: "방향이 맞는지 확인"
- icon: "1️⃣"
  title: "1단계 완료 후"
  desc: "입력 데이터 검증"
\:::
```

::: checkpoint-grid
- icon: "📐"
  title: "계획 수립 후"
  desc: "방향이 맞는지 확인"
- icon: "1️⃣"
  title: "1단계 완료 후"
  desc: "입력 데이터 검증"
:::

# 10. step-list

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `step-list` |
| 구현내용 | 번호가 붙는 세로 단계 리스트입니다. `desc`에 `\n`을 쓰면 불릿 목록이 됩니다. |

숏코드 입력내용

```md
\::: step-list
- title: "MD 작성"
  desc: "표준 키와 숏코드로 콘텐츠를 작성합니다."
- title: "HTML 빌드"
  desc: "build-guide.mjs로 가이드 HTML을 생성합니다."
- title: "PPTX 빌드"
  desc: "md-to-pptx.mjs로 발표 자료를 생성합니다."
\:::
```

::: step-list
- title: "MD 작성"
  desc: "표준 키와 숏코드로 콘텐츠를 작성합니다."
- title: "HTML 빌드"
  desc: "build-guide.mjs로 가이드 HTML을 생성합니다."
- title: "PPTX 빌드"
  desc: "md-to-pptx.mjs로 발표 자료를 생성합니다."
:::

# 11. skill-list

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `skill-list` |
| 구현내용 | 기능이나 역량을 행 형태로 나열합니다. |

숏코드 입력내용

```md
\::: skill-list
- icon: "📄"
  title: "문서 자동화"
  desc: "보고서와 제안서를 빠르게 생성합니다."
- icon: "🔗"
  title: "API 연동"
  desc: "기존 시스템과 데이터를 연결합니다."
- icon: "📊"
  title: "분석 대시보드"
  desc: "실시간 데이터를 시각화합니다."
\:::
```

::: skill-list
- icon: "📄"
  title: "문서 자동화"
  desc: "보고서와 제안서를 빠르게 생성합니다."
- icon: "🔗"
  title: "API 연동"
  desc: "기존 시스템과 데이터를 연결합니다."
- icon: "📊"
  title: "분석 대시보드"
  desc: "실시간 데이터를 시각화합니다."
:::

# 12. chapter-list

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `chapter-list` |
| 구현내용 | 세부 목차 및 챕터 리스트 숏코드입니다. 챕터 번호와 뱃지 속성에 따라 HSL 배지 색상이 자동 매핑됩니다. |

숏코드 입력내용

```md
\::: chapter-list
- icon: "01"
  title: "바이브코딩이란?"
  desc: "Karpathy 발언 배경 · 전통 코딩 vs 바이브코딩 · LLM 발전"
  tag: "개념"
- icon: "02"
  title: "에이전트 코딩이란?"
  desc: "계획→실행→수정 루프 · 레벨 1~5 스펙트럼 · 바이브코딩과 차이"
  tag: "개념"
- icon: "04"
  title: "첫 대화: 프롬프트 설계"
  desc: "요구사항 명세 · 컨텍스트 주입 전략 · SKILL.md 재사용 지시"
  tag: "실습"
\:::
```

::: chapter-list
- icon: "01"
  title: "바이브코딩이란?"
  desc: "Karpathy 발언 배경 · 전통 코딩 vs 바이브코딩 · LLM 발전"
  tag: "개념"
- icon: "02"
  title: "에이전트 코딩이란?"
  desc: "계획→실행→수정 루프 · 레벨 1~5 스펙트럼 · 바이브코딩과 차이"
  tag: "개념"
- icon: "04"
  title: "첫 대화: 프롬프트 설계"
  desc: "요구사항 명세 · 컨텍스트 주입 전략 · SKILL.md 재사용 지시"
  tag: "실습"
:::

# 13. faq-list

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `faq-list` |
| 구현내용 | 클릭해 펼치는 FAQ 아코디언입니다. |

숏코드 입력내용

```md
\::: faq-list
- title: "PPTX 변환도 같은 MD를 쓰나요?"
  desc: "네. 같은 숏코드 입력을 HTML과 PPTX 렌더러가 함께 사용합니다."
- title: "HTML을 직접 넣어야 하나요?"
  desc: "아니요. 쇼케이스와 가이드는 숏코드 문법으로 작성하는 것이 원칙입니다."
\:::
```

::: faq-list
- title: "PPTX 변환도 같은 MD를 쓰나요?"
  desc: "네. 같은 숏코드 입력을 HTML과 PPTX 렌더러가 함께 사용합니다."
- title: "HTML을 직접 넣어야 하나요?"
  desc: "아니요. 쇼케이스와 가이드는 숏코드 문법으로 작성하는 것이 원칙입니다."
:::

# 14. tool-list

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `tool-list` |
| 구현내용 | 색상 헤더와 피처 목록을 가진 도구 소개 카드입니다. |

숏코드 입력내용

```md
\::: tool-list
- icon: "💬"
  title: "ChatGPT"
  desc: "OpenAI의 대화형 AI 어시스턴트"
  tag: "무료/Pro"
  meta: "텍스트 생성|파일 분석|이미지 생성|코드 실행"
  color: "#10A37F"
- icon: "💻"
  title: "Cursor"
  desc: "AI 코드 에디터"
  tag: "Pro"
  meta: "코드베이스 인덱싱|멀티 파일 편집|자동완성"
  color: "#2563EB"
\:::
```

::: tool-list
- icon: "💬"
  title: "ChatGPT"
  desc: "OpenAI의 대화형 AI 어시스턴트"
  tag: "무료/Pro"
  meta: "텍스트 생성|파일 분석|이미지 생성|코드 실행"
  color: "#10A37F"
- icon: "💻"
  title: "Cursor"
  desc: "AI 코드 에디터"
  tag: "Pro"
  meta: "코드베이스 인덱싱|멀티 파일 편집|자동완성"
  color: "#2563EB"
:::

# 15. workflow-flow

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `workflow-flow` |
| 구현내용 | 아이콘과 화살표로 이어지는 가로 흐름도입니다. |

숏코드 입력내용

```md
\::: workflow-flow
- icon: "💡"
  title: "아이디어"
  meta: "요구사항 정리"
- icon: "⚡"
  title: "초안"
  meta: "AI 생성"
- icon: "✅"
  title: "검토"
  meta: "사람 확인"
- icon: "📤"
  title: "배포"
  meta: "HTML/PPTX"
\:::
```

::: workflow-flow
- icon: "💡"
  title: "아이디어"
  meta: "요구사항 정리"
- icon: "⚡"
  title: "초안"
  meta: "AI 생성"
- icon: "✅"
  title: "검토"
  meta: "사람 확인"
- icon: "📤"
  title: "배포"
  meta: "HTML/PPTX"
:::

# 16. git-flow

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `git-flow` |
| 구현내용 | 브랜치 라인과 커밋 라벨을 가진 Git 흐름도입니다. |

숏코드 입력내용

```md
\::: git-flow
- title: "main"
  tag: "v2.0.0"
  meta: "숏코드 29종 완비|bullet/color 개선"
  color: "#10B981"
- title: "feature/shortcode-refactor"
  tag: "Commit 812"
  meta: "bullet 블록 인자 추가|desc 멀티라인 통일"
  color: "#3B82F6"
\:::
```

::: git-flow
- title: "main"
  tag: "v2.0.0"
  meta: "숏코드 29종 완비|bullet/color 개선"
  color: "#10B981"
- title: "feature/shortcode-refactor"
  tag: "Commit 812"
  meta: "bullet 블록 인자 추가|desc 멀티라인 통일"
  color: "#3B82F6"
:::

# 17. step-flow

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `step-flow` |
| 구현내용 | 단계별 수행 과정 및 가로 흐름 다이어그램을 카드와 화살표 그리드로 렌더링해 줍니다. |

숏코드 입력내용

```md
\::: step-flow
- icon: "🧑"
  title: "사람"
  desc: "원하는 것 설명"
  tag: "active"
- icon: "→"
  title: "→"
- icon: "🤖"
  title: "AI"
  desc: "코드 생성"
- icon: "→"
  title: "→"
- icon: "✅"
  title: "완성"
  desc: "결과물"
  tag: "active"
\:::
```

::: step-flow
- icon: "🧑"
  title: "사람"
  desc: "원하는 것 설명"
  tag: "active"
- icon: "→"
  title: "→"
- icon: "🤖"
  title: "AI"
  desc: "코드 생성"
- icon: "→"
  title: "→"
- icon: "✅"
  title: "완성"
  desc: "결과물"
  tag: "active"
:::

# 18. alert-box

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `alert-box` |
| 구현내용 | `tip`, `warn`, `success`, `danger` 타입을 가진 알림 박스입니다. |

숏코드 입력내용

```md
\::: alert-box tip
- title: "작성 팁"
  desc: "긴 본문은 desc: | 멀티라인 블록으로 작성하세요."
\:::

\::: alert-box warn
- title: "주의"
  desc: "들여쓰기가 틀어지면 숏코드 파서가 항목을 잘못 읽을 수 있습니다."
\:::
```

::: alert-box tip
- title: "작성 팁"
  desc: "긴 본문은 desc: | 멀티라인 블록으로 작성하세요."
:::

::: alert-box warn
- title: "주의"
  desc: "들여쓰기가 틀어지면 숏코드 파서가 항목을 잘못 읽을 수 있습니다."
:::

# 19. cmd-box

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `cmd-box` |
| 구현내용 | 복사 버튼이 있는 터미널 명령어 블록입니다. |

숏코드 입력내용

```md
\::: cmd-box
- title: "HTML 빌드"
  tag: "bash"
  desc: "node scripts/build-guide.mjs md_src/showcase/showcase.md"
\:::
```

::: cmd-box
- title: "HTML 빌드"
  tag: "bash"
  desc: "node scripts/build-guide.mjs md_src/showcase/showcase.md"
:::

# 20. console-box

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `console-box` |
| 구현내용 | 프롬프트나 콘솔 출력 예시를 어두운 박스로 보여줍니다. |

숏코드 입력내용

```md
\::: console-box
- title: "가이드 생성 요청"
  desc: |
    Obsidian 가이드를 작성해줘.
    network-box로 지식 그래프 예시를 포함하고,
    마지막에는 faq-list를 넣어줘.
\:::
```

::: console-box
- title: "가이드 생성 요청"
  desc: |
    Obsidian 가이드를 작성해줘.
    network-box로 지식 그래프 예시를 포함하고,
    마지막에는 faq-list를 넣어줘.
:::

# 21. editor-box

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `editor-box` |
| 구현내용 | VS Code 느낌의 코드 편집기 시뮬레이션입니다. |

숏코드 입력내용

````md
\::: editor-box
- title: "build-guide.mjs"
  tag: "javascript"
  desc: |
    function renderShortcode(type, body, args) {
      const items = parseShortcodeItems(body);
      if (!items.length) return "";
      return renderComponent(type, items, args);
    }
\:::
````

::: editor-box
- title: "build-guide.mjs"
  tag: "javascript"
  desc: |
    function renderShortcode(type, body, args) {
      const items = parseShortcodeItems(body);
      if (!items.length) return "";
      return renderComponent(type, items, args);
    }
:::

# 22. network-box

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `network-box` |
| 구현내용 | 중앙 노드와 주변 노드가 떠 있는 지식 그래프 시각화입니다. |

숏코드 입력내용

```md
\::: network-box
- title: "Creative Spark"
  color: "#EC4899"
- title: "HTML"
  meta: "build-guide"
  color: "#10B981"
- title: "PPTX"
  meta: "md-to-pptx"
  color: "#3B82F6"
- title: "Markdown"
  meta: "shortcode"
  color: "#F59E0B"
\:::
```

::: network-box
- title: "Creative Spark"
  color: "#EC4899"
- title: "HTML"
  meta: "build-guide"
  color: "#10B981"
- title: "PPTX"
  meta: "md-to-pptx"
  color: "#3B82F6"
- title: "Markdown"
  meta: "shortcode"
  color: "#F59E0B"
:::

# 23. summary-box

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `summary-box` |
| 구현내용 | 본문 설명 아래에 여러 칩을 붙이는 요약 카드입니다. |

숏코드 입력내용

```md
\::: summary-box
- title: "핵심 요약"
  desc: "숏코드 MD는 콘텐츠와 표현을 분리하여 반복 제작을 쉽게 만듭니다."
  meta: "HTML 자동 생성|PPTX 자동 생성|표준 키 사용|재사용 가능"
\:::
```

::: summary-box
- title: "핵심 요약"
  desc: "숏코드 MD는 콘텐츠와 표현을 분리하여 반복 제작을 쉽게 만듭니다."
  meta: "HTML 자동 생성|PPTX 자동 생성|표준 키 사용|재사용 가능"
:::

# 24. compare-split

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `compare-split` |
| 구현내용 | before/after 또는 양자 비교를 2열로 강조합니다. |

숏코드 입력내용

```md
\::: compare-split
- title: "Before"
  meta: "HTML 직접 편집|디자인은 자유롭지만 유지보수 어려움"
  note: "수동 관리"
- title: "After"
  meta: "숏코드 입력|HTML/PPTX 동시 생성|재사용 쉬움"
  note: "자동 파이프라인"
\:::
```

::: compare-split
- title: "Before"
  meta: "HTML 직접 편집|디자인은 자유롭지만 유지보수 어려움"
  note: "수동 관리"
- title: "After"
  meta: "숏코드 입력|HTML/PPTX 동시 생성|재사용 쉬움"
  note: "자동 파이프라인"
:::

# 25. compare-diff

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `compare-diff` |
| 구현내용 | Bad vs Good, 변경 전후 1:1 대비를 전용 테두리 카드 레이아웃으로 렌더링해 줍니다. |

숏코드 입력내용

```md
\::: compare-diff
- title: "나쁜 프롬프트"
  desc: "엑셀 자동화 코드 만들어줘."
- title: "좋은 프롬프트"
  desc: "Python으로 A열 날짜, B열 금액 합산 summary.xlsx 만드는 Pandas 코드 작성해줘."
\:::
```

::: compare-diff
- title: "나쁜 프롬프트"
  desc: "엑셀 자동화 코드 만들어줘."
- title: "좋은 프롬프트"
  desc: "Python으로 A열 날짜, B열 금액 합산 summary.xlsx 만드는 Pandas 코드 작성해줘."
:::

# 26. part-banner

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `part-banner` |
| 구현내용 | 시리즈 가이드북 등 목차용 대단원(부, Part)을 알리는 헤더 숏코드입니다. HSL 브랜드 컬러가 다이내믹하게 적용됩니다. |

숏코드 입력내용

```md
\::: part-banner
- icon: "1부"
  title: "개념 이해"
  desc: "바이브코딩과 에이전트 코딩의 작동 원리"
  tag: "Ch.01–03"
  color: "#1a3a5c"
- icon: "2부"
  title: "AI와 대화하는 법"
  desc: "프롬프트 설계부터 복잡한 작업 위임까지"
  tag: "Ch.04–05"
  color: "#1a4a3a"
\:::
```

::: part-banner
- icon: "1부"
  title: "개념 이해"
  desc: "바이브코딩과 에이전트 코딩의 작동 원리"
  tag: "Ch.01–03"
  color: "#1a3a5c"
- icon: "2부"
  title: "AI와 대화하는 법"
  desc: "프롬프트 설계부터 복잡한 작업 위임까지"
  tag: "Ch.04–05"
  color: "#1a4a3a"
:::

# 27. takeaway-banner

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `takeaway-banner` |
| 구현내용 | 핵심 요약 및 테이크어웨이 메시지를 그라데이션 프리미엄 배너 형태로 감싸 줍니다. |

숏코드 입력내용

```md
\::: takeaway-banner
- icon: "💡"
  title: "Key Takeaway"
  desc: "바이브코딩은 문법 암기가 아닌, 원하는 바를 논리적 자연어로 설명하는 역량이 본질입니다."
\:::
```

::: takeaway-banner
- icon: "💡"
  title: "Key Takeaway"
  desc: "바이브코딩은 문법 암기가 아닌, 원하는 바를 논리적 자연어로 설명하는 역량이 본질입니다."
:::

---

# 28. summary-bar

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `summary-bar` |
| 구현내용 | 주요 수치를 가로 격자 형태로 요약 노출하는 수치 뱃지 숏코드입니다. |

숏코드 입력내용

```md
\::: summary-bar
- icon: "29종"
  title: "Support Shortcodes"
- icon: "8개"
  title: "Standard Keys"
- icon: "2종"
  title: "Output Formats"
\:::
```

::: summary-bar
- icon: "29종"
  title: "Support Shortcodes"
- icon: "8개"
  title: "Standard Keys"
- icon: "2종"
  title: "Output Formats"
:::

# 29. os-tabs

| 항목 | 내용 |
| --- | --- |
| 숏코드 명 | `os-tabs` |
| 구현내용 | 탭 버튼으로 여러 설치법이나 플랫폼별 설명을 전환합니다. |

숏코드 입력내용

````md
\::: os-tabs
- title: "macOS"
  desc: |
    #### 터미널 설치
    ```bash
    brew install node
    ```
- title: "Windows"
  desc: |
    #### PowerShell 설치
    ```powershell
    winget install OpenJS.NodeJS
    ```
\:::
````

::: os-tabs
- title: "macOS"
  desc: |
    #### 터미널 설치
    ```bash
    brew install node
    ```
- title: "Windows"
  desc: |
    #### PowerShell 설치
    ```powershell
    winget install OpenJS.NodeJS
    ```
:::

# 부록 A. desc 다중 줄 불릿 목록

`desc`에 `\n`(YAML 멀티라인 `|`)으로 줄을 나누면 자동으로 불릿 목록이 됩니다. 줄 앞에 이모지를 쓰면 그 이모지가 불릿으로 사용됩니다.

숏코드 입력내용

```md
\::: step-list
- title: "기본 불릿 (SVG 체크)"
  desc: |
    첫 번째 항목
    두 번째 항목
    세 번째 항목
- title: "이모지 불릿"
  desc: |
    ✅ 완료된 항목
    🔥 중요 항목
    📌 참고 항목
- title: "표준 마커 → SVG로 변환"
  desc: |
    - 마이너스 기호
    • 불릿 기호
\:::
```

::: step-list
- title: "기본 불릿 (SVG 체크)"
  desc: |
    첫 번째 항목
    두 번째 항목
    세 번째 항목
- title: "이모지 불릿"
  desc: |
    ✅ 완료된 항목
    🔥 중요 항목
    📌 참고 항목
- title: "표준 마커 → SVG로 변환"
  desc: |
    - 마이너스 기호
    • 불릿 기호
:::

# 부록 B. bullet 필드 — 아이템별 불릿 오버라이드

아이템의 `bullet:` 필드로 해당 카드의 불릿 기호만 바꿀 수 있습니다.

숏코드 입력내용

```md
\::: skill-list
- icon: "⚡"
  title: "고속 처리"
  desc: "대용량 파일도 빠르게 처리\n병렬 처리 지원\n메모리 최적화"
  bullet: "🔥"
- icon: "🔒"
  title: "보안 강화"
  desc: "엔드투엔드 암호화\n접근 권한 관리\n감사 로그 제공"
  bullet: "🔐"
\:::
```

::: skill-list
- icon: "⚡"
  title: "고속 처리"
  desc: "대용량 파일도 빠르게 처리\n병렬 처리 지원\n메모리 최적화"
  bullet: "🔥"
- icon: "🔒"
  title: "보안 강화"
  desc: "엔드투엔드 암호화\n접근 권한 관리\n감사 로그 제공"
  bullet: "🔐"
:::

# 부록 C. bullet= 블록 인자 — 블록 전체 불릿 지정

`bullet=X` 블록 인자로 블록 안 모든 아이템의 기본 불릿을 한 번에 지정합니다. 아이템 `bullet:` 필드가 있으면 그쪽이 우선합니다.

숏코드 입력내용

```md
\::: icon-grid cols=3 bullet=✅
- icon: "📄"
  title: "문서화"
  desc: "자동 생성\n버전 관리\n다국어 지원"
- icon: "🔧"
  title: "자동화"
  desc: "CI/CD 통합\n테스트 자동화\n배포 스크립트"
- icon: "📊"
  title: "분석"
  desc: "실시간 모니터링\n대시보드\n알림 설정"
\:::
```

::: icon-grid cols=3 bullet=✅
- icon: "📄"
  title: "문서화"
  desc: "자동 생성\n버전 관리\n다국어 지원"
- icon: "🔧"
  title: "자동화"
  desc: "CI/CD 통합\n테스트 자동화\n배포 스크립트"
- icon: "📊"
  title: "분석"
  desc: "실시간 모니터링\n대시보드\n알림 설정"
:::

# 부록 D. color — 카드 강조 + SVG 불릿 색 동시 적용

`color:` 필드는 카드 테두리·배경과 함께 SVG 불릿 색상도 동시에 제어합니다.

숏코드 입력내용

```md
\::: feature-grid cols=2
- icon: "🚀"
  title: "빠른 배포"
  desc: "원클릭 배포\n자동 롤백\n무중단 업데이트"
  color: "#6366F1"
- icon: "🛡️"
  title: "보안 우선"
  desc: "자동 인증서\n방화벽 내장\n취약점 스캔"
  color: "#E11D48"
\:::
```

::: feature-grid cols=2
- icon: "🚀"
  title: "빠른 배포"
  desc: "원클릭 배포\n자동 롤백\n무중단 업데이트"
  color: "#6366F1"
- icon: "🛡️"
  title: "보안 우선"
  desc: "자동 인증서\n방화벽 내장\n취약점 스캔"
  color: "#E11D48"
:::

# 부록 E. Frontmatter (문서 메타) 및 slide-config

## 1. Frontmatter 설정 (문서 메타데이터)
마크다운 문서 최상단의 YAML Frontmatter 영역에서 문서 전체의 테마, 제목, 및 표지 설정을 할 수 있습니다.

| 설정 키 | 설명 | 예시 |
| --- | --- | --- |
| `title` | 문서 전체 제목 (표지에 렌더링) | `"Creative Spark 가이드"` |
| `subtitle` | 문서 부제목 | `"숏코드 설명서"` |
| `badge` | 표지 상단에 노출되는 배지 | `"v2.0"` |
| `style` | 문서에 적용할 테마 명칭 | `"custom-blue"`, `"ai-chat"`, `"green"`, `"purple"`, `"coral"` 등 |
| `coverBg` | 표지 전용 배경색 또는 그라데이션 | `"#2563FF"`, `"linear-gradient(135deg, #2563FF, #0F478F)"` |

## 2. slide-config 숏코드
개별 슬라이드나 섹션의 배경색(`bg`)과 글자색(`color`)을 임의로 재정의할 수 있는 특수 숏코드입니다. 이 숏코드는 화면에 렌더링되지 않으며 해당 슬라이드의 스타일만 오버라이드합니다.

숏코드 입력내용

```md
\::: slide-config
bg: "#0F172A"
color: "#F8FAFC"
\:::
```

