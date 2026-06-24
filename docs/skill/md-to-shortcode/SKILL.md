# /md-to-shortcode — 텍스트 · MD → 숏코드 MD 변환

일반 텍스트 또는 마크다운을 Creative Spark V2 숏코드 시스템으로 시각화된 MD 파일로 변환합니다.

**사용법**:
- `/md-to-shortcode` — 이전 메시지의 텍스트/MD를 변환
- `/md-to-shortcode <파일경로>` — 파일을 읽어 변환 (Read 툴 사용)
- `/md-to-shortcode` 뒤에 텍스트를 직접 붙여넣기

---

## 에이전트 지시문

대상: `$ARGUMENTS`

아래 순서대로 실행하십시오.

---

### 1단계: 입력 파악

`$ARGUMENTS`를 확인합니다:

- **파일 경로**로 보이면 → Read 툴로 파일 읽기. 없으면 오류 출력 후 중단
- **텍스트 직접 입력** → `$ARGUMENTS`의 텍스트 그대로 사용
- **비어있음** → 이전 대화 메시지에서 가장 최근 텍스트/MD 블록 사용

---

### 2단계: 숏코드 선택 규칙

아래 매핑표를 기준으로 각 섹션의 콘텐츠 유형을 분류하고 숏코드를 선택합니다.

| 콘텐츠 유형 | 적합한 숏코드 |
|------------|------------|
| 단계별 절차, 순서 목록 | `step-list` |
| 가로 흐름, 프로세스 단계 | `step-flow` |
| 특징/기능 나열 (이모지 카드형) | `icon-grid` |
| 핵심 강점, 기술 소개 | `feature-grid` |
| 도구/앱 소개 | `tool-list` |
| 기술 스택, 태그 나열 | `badge-grid` |
| 수치/통계 강조 | `stat-grid` |
| 요금제/플랜 비교 | `plan-grid` |
| 좌우 대조 비교 (장단점 등) | `compare-split` |
| Before/After 전후 대조 | `before-after` |
| 다단 텍스트 카드, 표 | `columns-grid` |
| 코드 예시 (에디터 형태) | `editor-box` |
| 터미널 출력 | `console-box` |
| Windows CMD | `cmd-box` |
| 경고/팁/주의/참고 | `alert-box` |
| 요약 정리 | `summary-box` |
| 핵심 메시지 배너 | `takeaway-banner` |
| Part/챕터 구분 | `part-banner` |
| 수치 하이라이트 바 | `summary-bar` |
| FAQ, 질답 | `faq-list` |
| OS/플랫폼 탭 | `os-tabs` |
| 챕터 목록 | `chapter-list` |
| 레벨/난이도 스펙트럼 | `level-grid` |
| 네트워크/레이어 구조 | `network-box` |
| Git 브랜치 흐름 | `git-flow` |
| 스킬/역량 (좌측 아이콘) | `icon-grid align=left` |
| 체크포인트 (수평 배열) | `icon-grid align=row` |

---

### 3단계: 슬라이드 구조 규칙

- **`<!-- slide -->`** 구분자로 슬라이드를 분리합니다
- **H1(`#`)** → `frontmatter`의 `title:` 로 이동
- **H2(`##`)** → 각 슬라이드의 최상단 제목으로 유지
- **H3(`###`)** → 소제목으로 유지 (숏코드 위에 위치)
- 각 `<!-- slide -->` 이후에는 H2 제목이 오는 것이 자연스러운 구조
- 원본에 `<!-- slide -->` 가 이미 있으면 그대로 유지

**구조 예시**:
```markdown
---
title: "문서 제목"
subtitle: "부제목"
style: custom-blue
---

<!-- slide -->
## 섹션 1 제목

::: icon-grid
- icon: "🎯"  title: "항목"  desc: "설명"
:::

<!-- slide -->
## 섹션 2 제목

::: step-list
- title: "1단계"  desc: "설명"
:::
```

---

### 4단계: Frontmatter 생성

원본에 frontmatter(`---` 블록)가 없으면 자동 생성합니다:

```yaml
---
title: "문서 제목 (H1 또는 추론)"
subtitle: "부제목 (추론)"
style: custom-blue
---
```

기존 frontmatter가 있으면 `title`, `subtitle`, `style` 등을 그대로 보존합니다.

`style` 추천:
- 기술/개발 문서 → `custom-blue`
- 비즈니스/금융 → `finance`
- 지식/교육 → `knowledge`
- 창의/디자인 → `creative`

---

### 5단계: 변환 규칙

1. **산문 보존**: 4줄 이상의 연속 단락 → 숏코드 강제 변환 금지, 원문 유지
2. **불릿 리스트** → 내용 유형 판단 후 적합한 숏코드로 변환
3. **표(table)** → `columns-grid` 또는 `compare-split` 으로 변환
4. **alias 사용 금지**: `compare-diff` 대신 `before-after`, `workflow-flow` 대신 `step-flow`
5. **YAML 값에 콜론(`:`) 포함 시** 반드시 큰따옴표로 감쌀 것
6. **카드 많거나 제목 길 때** → `title-size=0.95 desc-size=0.85` 인수 추가

---

### 6단계: 출력

- **파일 경로 입력이었으면**: `<원본명>_sc.md` 경로에 Write 툴로 저장
  - 예: `md_src/guides/MyGuide.md` → `md_src/guides/MyGuide_sc.md`
- **텍스트 직접 입력이었으면**: 채팅창에 마크다운 코드블록으로 출력

저장 또는 출력 후 변환 요약을 보고합니다:
- 적용된 숏코드 종류 및 개수 (예: `icon-grid 3개, step-list 2개`)
- 숏코드로 변환하지 않은 항목과 이유

---

## 숏코드 문법 레퍼런스

### 기본 문법

```markdown
::: 숏코드명 [인수...]
- field1: "값"
  field2: "값"
- field1: "다음 항목"
:::
```

### 공통 선택 인수

| 인수 | 설명 | 예시 |
|------|------|------|
| `title-size` | 카드 제목 크기 오버라이드 | `0.9` (비율) 또는 `1.2rem` (절대값) |
| `desc-size` | 카드 설명 크기 오버라이드 | `0.85` (비율) 또는 `14px` (절대값) |

---

### 콘텐츠 그리드

**plan-grid** — 요금제/플랜 비교
```markdown
::: plan-grid
- title: "Standard"  tag: "추천"  meta: "기능A | 기능B"  note: "₩0"  featured: "true"  color: "#3b82f6"
:::
```

**feature-grid** — 핵심 강점/기술 소개
```markdown
::: feature-grid
- icon: "⚡"  tag: "성능"  title: "초고속 렌더링"  desc: "Vite 기반 빌드로 최적화합니다."  color: "#f59e0b"
:::
```

**icon-grid** — 범용 이모지 카드 격자
```markdown
::: icon-grid
- icon: "🎨"  title: "디자인 시스템"  desc: "HSL 기반 테마로 일관된 색상을 유지합니다."
:::
```
- `align=left` → 아이콘 좌측 배치 (스킬 목록)
- `align=row` → 아이콘+텍스트 수평 (체크포인트)

**badge-grid** — 기술 스택/태그
```markdown
::: badge-grid
- icon: "⚛️"  title: "React"  tag: "v19"
:::
```

**stat-grid** — 수치 지표
```markdown
::: stat-grid
- icon: "99.9%"  title: "가동률"  desc: "12개월 기준"
:::
```

**tool-list** — 도구 상세 소개
```markdown
::: tool-list
- icon: "🤖"  title: "Claude Code"  desc: "AI 터미널 도우미"  tag: "AI"  meta: "코드 생성 | 리팩토링"  color: "#8b5cf6"
:::
```

---

### 비교 & 대조

**compare-split** — 좌우 2단 비교
```markdown
::: compare-split
- title: "기존 방식"  desc: "설명"  tag: "Before"  color: "#ef4444"
- title: "개선 방식"  desc: "설명"  tag: "After"  color: "#22c55e"
:::
```

**before-after** — Before/After 전후 대조
```markdown
::: before-after
- title: "기존"  desc: "설명"  tag: "BEFORE"  color: "#ef4444"
- title: "개선"  desc: "설명"  tag: "AFTER"  color: "#22c55e"
:::
```

**columns-grid** — 다단 텍스트 카드
```markdown
::: columns-grid
- title: "개요"  desc: "설명"
- title: "목표"  desc: "설명"
:::
```

---

### 코드 & 터미널

**editor-box** — 코드 에디터
```markdown
::: editor-box
- title: "app.ts"
  desc: |
    ```typescript
    const app = express();
    ```
:::
```

**console-box** — 터미널 출력
```markdown
::: console-box
- title: "$ npm run build"
  desc: |
    ✓ 빌드 완료 (2.3s)
:::
```

**cmd-box** — Windows CMD
```markdown
::: cmd-box
- title: "pip install -r requirements.txt"
  desc: "패키지 설치 완료"
:::
```

---

### 시각 자료 & 흐름

**step-flow** — 가로 프로세스 흐름
```markdown
::: step-flow
- icon: "📥"  title: "입력"  desc: "마크다운"  tag: "active"
- type: "arrow"
- icon: "⚙️"  title: "컴파일"  desc: "빌드 파이프라인"
- type: "arrow"
- icon: "📄"  title: "출력"  desc: "HTML / PPTX"
:::
```

**network-box** — 네트워크/레이어 다이어그램
```markdown
::: network-box
- title: "Client Layer"  desc: "React SPA"  tag: "Frontend"  color: "#3b82f6"
- title: "API Gateway"  desc: "Load Balancer"  tag: "Infra"
:::
```

**git-flow** — Git 브랜치 흐름
```markdown
::: git-flow
- title: "main"  desc: "운영 배포"  tag: "main"
- title: "develop"  desc: "통합 개발"  tag: "dev"
- title: "feature/auth"  desc: "로그인 개발"  tag: "feature"
:::
```

---

### 정보 & 알림

**alert-box** — 강조 알림
```markdown
::: alert-box
- title: "⚠️ 주의"  desc: "이 설정 변경 시 데이터가 초기화될 수 있습니다."  tag: "warning"  color: "#f59e0b"
:::
```
`tag` 옵션: `warning` / `info` / `tip` / `note`

**summary-box** — 핵심 요약
```markdown
::: summary-box
- title: "핵심 요약"  desc: "숏코드 시스템으로 HTML, 슬라이드, PPTX를 동시에 생성합니다."  meta: "25종 숏코드 | HTML | PPTX"
:::
```

**takeaway-banner** — 핵심 메시지 배너
```markdown
::: takeaway-banner
- title: "단일 소스, 다중 출력"  desc: "마크다운 하나로 3가지 포맷을 생성합니다."  color: "#3b82f6"
:::
```

**part-banner** — Part 구분 배너
```markdown
::: part-banner
- title: "Part 2. 실무 활용"  desc: "실무 패턴을 학습합니다."  tag: "PART 02"  color: "#8b5cf6"
:::
```

**summary-bar** — 하단 수치 하이라이트 바
```markdown
::: summary-bar
- icon: "25종"  title: "정식 숏코드"
- icon: "3종"  title: "출력 포맷"
:::
```

---

### 구조 & 내비게이션

**step-list** — 수직형 단계 목록
```markdown
::: step-list
- title: "환경 설정"  desc: "Node.js 22 이상 설치"
- title: "의존성 설치"  desc: "`pnpm install` 실행"
:::
```

**faq-list** — FAQ 목록
```markdown
::: faq-list
- title: "숏코드와 마크다운 혼용 가능한가요?"
  desc: "네, 어디서나 자유롭게 혼용 가능합니다."
:::
```

**os-tabs** — OS/플랫폼 탭
```markdown
::: os-tabs
- title: "Windows"  desc: "`winget install Git.Git` 실행"
- title: "macOS"  desc: "`brew install git` 실행"
:::
```

**chapter-list** — 챕터 목록
```markdown
::: chapter-list
- icon: "01"  title: "시스템 개요"  desc: "전체 구조를 소개합니다."  tag: "개념"
- icon: "02"  title: "빠른 시작"  desc: "첫 빌드까지 안내합니다."  tag: "실습"
:::
```
`tag` 옵션: `개념` / `도구` / `사례` / `가이드` / `실습` / `주의` / `핵심`

**level-grid** — 레벨/난이도 스펙트럼
```markdown
::: level-grid
- title: "입문"  desc: "기본 개념 이해"
- title: "중급"  desc: "실무 적용"  tag: "highlight"
- title: "고급"  desc: "아키텍처 설계"
:::
```

---

## PPTX 지원 여부

| 숏코드 | PPTX |
|--------|------|
| plan-grid, feature-grid, icon-grid, badge-grid, stat-grid, tool-list | ✅ |
| compare-split, columns-grid, step-list, faq-list, os-tabs | ✅ |
| alert-box, summary-box, takeaway-banner, part-banner, summary-bar | ✅ |
| editor-box, console-box, cmd-box, chapter-list | ✅ |
| before-after, network-box, git-flow, step-flow, level-grid | ⚠️ PPTX 제외 |

⚠️ 숏코드는 HTML에서만 렌더링되며 PPTX 변환 시 해당 슬라이드가 제외됩니다.
