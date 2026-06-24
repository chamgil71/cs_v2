# Creative Spark V2 숏코드 레퍼런스

> **Phase 2 정리 기준 (2026-06-24)**: 25종 정식 명칭 + 13종 하위 호환 alias  
> 변경 이력 상세: [shortcode-changelog.md](./shortcode-changelog.md)

Creative Spark V2가 지원하는 **25종 정식 숏코드 + 13종 alias**의 문법, 사용 필드, 사용처, V1 호환 별칭을 정리한 참조 문서입니다.

---

## 숏코드 문법 기본 규칙

```markdown
::: 숏코드명 [인수...]
- field1: "값"
  field2: "값"
- field1: "다음 항목"
  field2: "값"
:::
```

- 각 항목(`-`)은 YAML 리스트 형태로 작성합니다.
- 문자열 값은 큰따옴표(`"`)로 감쌉니다.
- `desc` 필드는 마크다운 파이프 구분(`|`)을 사용하여 내부 마크다운을 허용합니다.
- `color` 필드는 CSS 색상값 (HEX: `"#3b82f6"`, CSS 변수: `"var(--brand)"`) 형식을 사용합니다.

### 공통 선택 인수 (모든 숏코드에서 사용 가능)

| 인수 | 형식 | 예시 | 설명 |
|------|------|------|------|
| `title-size` | 숫자(비율) 또는 CSS값 | `0.9` / `1.2rem` | 해당 블록 카드 제목 크기 오버라이드 |
| `desc-size` | 숫자(비율) 또는 CSS값 | `0.85` / `14px` | 해당 블록 카드 설명 크기 오버라이드 |

**비율 입력** (단위 없이 숫자만): 전역 기본값 대비 배율 (`0.9` = 기본의 90%)  
**절대값 입력** (단위 포함): 해당 값 그대로 적용 (`1.2rem`, `14px` 등)  
전역 기본값: `title-size` 기본 = `1.15rem`, `desc-size` 기본 = `0.92rem`

```markdown
# 예시: 이 faq-list 블록만 제목을 작게
::: faq-list title-size=0.95 desc-size=0.85rem
- title: "질문"
  desc: "답변"
:::
```

---

## 숏코드 지원 현황 요약

| 구분 | 수량 | 설명 |
|------|------|------|
| 정식 숏코드 | **25종** | 문서화·권장 사용 대상 |
| 하위 호환 alias | **13종** | 구형 또는 통합 전 명칭 — 기존 문서 호환용, 신규 작성 비권장 |
| 내부 특수 토큰 | **2종** | `arrow` (step-flow 내부 항목), `slide-config` (슬라이드 설정 전용) |
| **총 지원** | **40종** | 빌드 파이프라인이 처리하는 전체 유형 수 |

### icon-grid align 옵션

`icon-grid`는 `align` 파라미터로 3가지 레이아웃 변형을 지원합니다:

| align 값 | 레이아웃 | 구 숏코드 |
|----------|---------|---------|
| `center` (기본) | 아이콘 중앙, 카드형 격자 | icon-grid |
| `left` | 아이콘 좌측 작은 배경박스, 좌측 정렬 | skill-list |
| `row` | 아이콘 좌 + 텍스트 우 수평 배열 | checkpoint-grid |

```markdown
::: icon-grid align=left cols=2
- icon: "⚡"  title: "스킬명"  desc: "설명"
:::
```

---

## 1. 콘텐츠 그리드 (Content Grids)

### [1] plan-grid — 요금제 / 플랜 비교 격자

서비스 요금 요약표, 등급별 멤버십 플랜 다단 대조 비교.

**지원 필드**: `title`, `tag` (추천 뱃지), `meta` (특징 칩 목록, `|` 구분), `note` (하단 배지/가격), `featured` (`"true"` 시 강조), `color`

```markdown
::: plan-grid
- title: "Standard"
  tag: "추천"
  meta: "HTML 변환 | PPTX 변환 | 팀 협업"
  note: "₩0"
  featured: "true"
  color: "#3b82f6"
- title: "Enterprise"
  meta: "모든 Standard 기능 | 전용 지원"
  note: "문의"
:::
```

**PPTX 지원**: ✅ `md-to-pptx.mjs`

---

### [2] feature-grid — 대표 강점 / 기술 소개 격자

시스템 장점 나열, 핵심 아키텍처 구성 기술 목록화.

**지원 필드**: `icon` (이모지), `tag` (우측 상단 뱃지), `title` (강점 제목), `desc` (설명 본문), `color`

```markdown
::: feature-grid
- icon: "⚡"
  tag: "성능"
  title: "초고속 렌더링"
  desc: "Vite 기반 빌드로 브라우저 첫 렌더링을 최적화합니다."
  color: "#f59e0b"
:::
```

**PPTX 지원**: ✅

---

### [3] icon-grid — 이모지 범용 카드 격자

다목적 3단/4단 반응형 요약 카드.

**지원 필드**: `icon` (빅 이모지), `title` (대제목), `desc` (본문), `color`

```markdown
::: icon-grid
- icon: "🎨"
  title: "디자인 시스템"
  desc: "HSL 기반 테마로 일관된 색상 팔레트를 유지합니다."
:::
```

**PPTX 지원**: ✅

---

### [4] badge-grid — 미니 스택 / 단어 뱃지 격자

기술 스택 묶음 나열, 관련 도구의 초소형 조밀 배치.

**지원 필드**: `icon` (작은 이모지), `title` (키워드/스택명), `tag` (버전/강조), `color`

```markdown
::: badge-grid
- icon: "⚛️"
  title: "React"
  tag: "v19"
- icon: "🔷"
  title: "TypeScript"
  tag: "v5"
:::
```

**PPTX 지원**: ✅

---

### [5] stat-grid — 수치 지표 / 핵심 데이터 카드

"33% 성능 향상", "₩0 비용" 등 거대한 지표 표현.

**지원 필드**: `icon` (또는 `title` — 거대 수치), `title` (수치 라벨), `desc` (참조 노트), `color`

```markdown
::: stat-grid
- icon: "99.9%"
  title: "가동률"
  desc: "지난 12개월 기준"
- icon: "2K"
  title: "지원 해상도"
:::
```

**PPTX 지원**: ✅

---

### [6] tool-list — 도구 상세 설명 요약 상자

추천 툴 목록, 개발 환경별 도구 요약 카드.  
**V1 별칭**: `tool-box`

**지원 필드**: `icon` (대표 아이콘), `title` (도구명), `desc` (슬로건), `tag` (사용처 배지), `meta` (기능 리스트, `|` 구분), `color`

```markdown
::: tool-list
- icon: "🤖"
  title: "Claude Code"
  desc: "AI 기반 터미널 개발 도우미"
  tag: "AI"
  meta: "코드 생성 | 리팩토링 | 문서화"
  color: "#8b5cf6"
:::
```

**PPTX 지원**: ✅ `md-to-pptx.mjs`

---

### [7] skill-list — 스킬 / 역량 목록

인물·팀 역량, 기술 항목별 불렛 설명 카드.

**지원 필드**: `icon` (이모지), `title` (스킬명), `desc` (설명), `bullet` (불렛 리스트 문자열, 줄바꿈 구분), `color`

```markdown
::: skill-list
- icon: "⚡"
  title: "초고속 로딩"
  desc: "Vite 기반 빌드로 브라우저 첫 렌더링 최적화"
  bullet: "HMR 지원"
:::
```

**PPTX 지원**: ✅

---

## 2. 비교 & 대조 (Comparison)

### [8] compare-split — 좌우 2단 분할 비교

두 요소의 병렬 대조 비교 (좌: Before / 우: After 방식).

**지원 필드**: `title` (대조 카드 제목), `desc` (비교 내용, 마크다운 가능), `tag` (라벨 배지), `color`

```markdown
::: compare-split
- title: "기존 방식"
  desc: "모놀리식 서버로 모든 기능을 한 프로세스에서 처리합니다."
  tag: "Before"
  color: "#ef4444"
- title: "개선 방식"
  desc: "마이크로서비스로 독립 배포와 스케일링이 가능합니다."
  tag: "After"
  color: "#22c55e"
:::
```

**PPTX 지원**: ✅

---

### [9] before-after — Before / After 비교

기존 방식과 개선 후 방식의 전후 차이 강조.  
**alias**: `compare-diff`, `compare-before-after`

**지원 필드**: `title`, `desc`, `tag`, `color`

```markdown
::: before-after
- title: "기존 배포"
  desc: "수동으로 서버에 SSH 접속하여 파일을 업로드했습니다."
  tag: "BEFORE"
  color: "#ef4444"
- title: "CI/CD 자동화"
  desc: "커밋 하나로 빌드·테스트·배포가 자동 실행됩니다."
  tag: "AFTER"
  color: "#22c55e"
:::
```

**PPTX 지원**: ⚠️ 전용 렌더러 없음 (슬라이드 변환 시 제외)

---

### [10] compare-grid — 다각도 비교 / 하단 팁박스 카드

장단점 대조, 사용자 유형별 권장 코멘트 추가.

**지원 필드**: `title` (비교 대상), `desc` (상세 비교 내용), `note` (하단 팁박스 메모), `meta` (팁박스 Fallback), `color`

```markdown
::: compare-grid
- title: "ORM 사용"
  desc: "빠른 개발 속도와 타입 안정성을 제공합니다."
  note: "복잡한 쿼리에서는 Raw SQL 병행 사용 권장"
- title: "Raw SQL"
  desc: "세밀한 쿼리 최적화가 가능합니다."
:::
```

**PPTX 지원**: ✅

---

### [11] columns-grid — 범용 다단 텍스트 단 카드

장식을 배제하고 줄글 본문 레이아웃 가독성을 높일 때.

**지원 필드**: `title` (단락 제목), `desc` (설명 본문), `note` (예시/참고란), `meta` (예시 Fallback), `color`

```markdown
::: columns-grid
- title: "개요"
  desc: "이 시스템은 마크다운 기반의 통합 가이드북 저작 도구입니다."
- title: "목표"
  desc: "HTML, 웹 슬라이드, PPTX를 단일 소스에서 동시에 생성합니다."
:::
```

**PPTX 지원**: ✅

---

## 3. 코드 & 터미널 (Code & Terminal)

### [12] editor-box — 코드 에디터 스타일 박스

코드 편집기 UI 형태로 코드 블록을 감싸 표현.

**지원 필드**: `title` (파일명/탭명), `desc` (코드 또는 설명 본문, 마크다운 가능)

```markdown
::: editor-box
- title: "app.ts"
  desc: |
    ```typescript
    const app = express();
    app.listen(3000);
    ```
:::
```

**PPTX 지원**: ✅

---

### [13] console-box — 터미널 콘솔 출력 박스

다크 배경 터미널 스타일로 CLI 출력을 표현.

**지원 필드**: `title` (세션/프롬프트 라벨), `desc` (콘솔 출력 내용)

```markdown
::: console-box
- title: "$ npm run build"
  desc: |
    ✓ 빌드 완료 (2.3s)
    dist/index.html  42 kB
:::
```

**PPTX 지원**: ✅

---

### [14] cmd-box — Windows 명령 프롬프트 박스

Windows cmd 스타일의 커맨드 실행 표현.

**지원 필드**: `title` (명령어 또는 라벨), `desc` (실행 결과)

```markdown
::: cmd-box
- title: "pip install -r requirements.txt"
  desc: "패키지 설치 완료. Successfully installed 12 packages."
:::
```

**PPTX 지원**: ✅

---

## 4. 시각 자료 & 흐름 (Visuals & Flow)

### [15] network-box — 네트워크 / 레이어 박스 다이어그램

인프라 레이어, 네트워크 구조 계층을 박스로 시각화.

**지원 필드**: `title` (레이어명), `desc` (구성 요소 설명), `tag` (레이어 유형 배지), `color`

```markdown
::: network-box
- title: "Client Layer"
  desc: "React SPA, Mobile App"
  tag: "Frontend"
  color: "#3b82f6"
- title: "API Gateway"
  desc: "Load Balancer, Rate Limiting"
  tag: "Infra"
:::
```

**PPTX 지원**: ⚠️ 전용 렌더러 없음

---

### [16] git-flow — 깃 플로우 브랜치 흐름 시각화

Git 브랜치 전략, 브랜치 흐름을 시각화.  
**V1 별칭**: `git-flow-strip`

**지원 필드**: `title` (브랜치명), `desc` (브랜치 용도), `tag` (브랜치 타입: `main`/`dev`/`feature`/`release`/`hotfix`), `color`

```markdown
::: git-flow
- title: "main"
  desc: "운영 배포 브랜치"
  tag: "main"
- title: "develop"
  desc: "통합 개발 브랜치"
  tag: "dev"
- title: "feature/auth"
  desc: "로그인 기능 개발"
  tag: "feature"
:::
```

**PPTX 지원**: ⚠️ 전용 렌더러 없음

---

### [17] workflow-flow — 가로형 연쇄 흐름도

기획 → 초안 → 디자인 → 검토 → 배포 등 마일스톤 흐름 표현.  
**V1 별칭**: `workflow-strip`

**지원 필드**: `icon` (단계 이모지), `title` (단계명), `meta` (활용 툴/코멘트), `color`

```markdown
::: workflow-flow
- icon: "📋"
  title: "기획"
  meta: "요구사항 분석"
- icon: "✏️"
  title: "설계"
  meta: "ERD, API 명세"
- icon: "🚀"
  title: "배포"
  meta: "CI/CD 자동화"
:::
```

**PPTX 지원**: ✅

---

### [18] step-flow — 프로세스 흐름 시각화

단계별 프로세스, 데이터 흐름을 가로 흐름으로 표현.  
**V1 별칭**: `flow`

**지원 필드**: `icon`, `title` (단계명), `desc` (세부 설명), `tag` (`active` 시 강조), `color`  
**특수**: 항목 `type: "arrow"` 로 방향 화살표를 삽입합니다.

```markdown
::: step-flow
- icon: "📥"
  title: "입력"
  desc: "마크다운 원고"
  tag: "active"
- type: "arrow"
- icon: "⚙️"
  title: "컴파일"
  desc: "빌드 파이프라인"
- type: "arrow"
- icon: "📄"
  title: "출력"
  desc: "HTML / PPTX"
:::
```

**PPTX 지원**: ⚠️ 전용 렌더러 없음

---

## 5. 정보 & 알림 (Info & Notice)

### [19] alert-box — 강조 알림 박스

중요 경고, 팁, 참고 사항 등을 강조 배경으로 표현.

**지원 필드**: `title` (알림 제목), `desc` (본문), `tag` (배지: `warning`/`info`/`tip`/`note`), `color`

```markdown
::: alert-box
- title: "⚠️ 주의 사항"
  desc: "이 설정을 변경하면 기존 데이터가 초기화될 수 있습니다."
  tag: "warning"
  color: "#f59e0b"
:::
```

**PPTX 지원**: ✅

---

### [20] summary-box — 핵심 내용 요약 박스

챕터 후반부에 핵심 요점을 정리하는 카드.  
**V1 별칭**: `bottom-list`

**지원 필드**: `title` (요약 대제목), `desc` (요약 본문, 마크다운 가능), `meta` (부연 설명 또는 칩 리스트)

```markdown
::: summary-box
- title: "핵심 요약"
  desc: "숏코드 시스템을 활용하면 마크다운 단일 소스에서 HTML, 웹 슬라이드, PPTX를 동시에 생성할 수 있습니다."
  meta: "29종 숏코드 | HTML 연동 | PPTX 연동"
:::
```

**PPTX 지원**: ✅

---

### [21] takeaway-banner — Key Takeaway 배너

섹션 마무리 핵심 메시지를 풀 와이드 배너로 강조.  
**V1 별칭**: `takeaway`

**지원 필드**: `title` (핵심 문장), `desc` (부연 설명), `color`

```markdown
::: takeaway-banner
- title: "단일 소스, 다중 출력"
  desc: "마크다운 원고 하나로 HTML·슬라이드·PPTX를 동시에 생성합니다."
  color: "#3b82f6"
:::
```

**PPTX 지원**: ✅

---

### [22] part-banner — Part 구분 표지 배너

대형 Part/Chapter 전환 구분 슬라이드 또는 섹션 헤더.  
**V1 별칭**: `part-deck`

**지원 필드**: `title` (Part 제목), `desc` (부제 또는 설명), `tag` (Part 번호 배지), `color`

```markdown
::: part-banner
- title: "Part 2. 실무 활용 패턴"
  desc: "실제 프로젝트에서 즉시 사용 가능한 숏코드 조합 패턴을 학습합니다."
  tag: "PART 02"
  color: "#8b5cf6"
:::
```

**PPTX 지원**: ✅

---

### [23] summary-bar — 하단 지표 요약 수치 그리드

챕터 분석 완료 후나 문서 하단에 수치 하이라이트를 다크 띠로 표현.

**지원 필드**: `icon` (요약 수치 및 단위), `title` (수치 라벨)

```markdown
::: summary-bar
- icon: "25종"
  title: "정식 숏코드"
- icon: "38종"
  title: "alias 포함 지원 규격"
- icon: "3종"
  title: "출력 포맷"
:::
```

**PPTX 지원**: ✅

---

## 6. 구조 & 내비게이션 (Structure & Navigation)

### [24] step-list — 수직형 순서 단계 목록

튜토리얼 1단계, 2단계, 3단계의 수직 나열.

**지원 필드**: `title` (단계 요약), `desc` (상세 실행 지침), `color`

```markdown
::: step-list
- title: "환경 설정"
  desc: "Node.js 22 이상과 pnpm을 설치합니다."
- title: "의존성 설치"
  desc: "`pnpm install` 명령으로 패키지를 설치합니다."
- title: "개발 서버 실행"
  desc: "`pnpm dev` 명령으로 로컬 서버를 시작합니다."
:::
```

**PPTX 지원**: ✅

---

### [25] faq-list — FAQ 아코디언 목록

자주 묻는 질문 / 답변 형식의 접이식 목록.

**지원 필드**: `title` (질문), `desc` (답변, 마크다운 가능)

```markdown
::: faq-list
- title: "숏코드와 일반 마크다운을 혼용할 수 있나요?"
  desc: "네, 문서 내 어디서나 자유롭게 혼용 가능합니다. 숏코드 블록 밖의 마크다운은 표준 방식으로 렌더링됩니다."
- title: "PPTX로 변환이 안 되는 숏코드가 있나요?"
  desc: "일부 복잡한 시각화 숏코드(compare-diff, network-box, git-flow, step-flow)는 현재 PPTX 렌더러가 없어 변환 시 해당 슬라이드가 제외됩니다."
:::
```

**PPTX 지원**: ✅

---

### [26] os-tabs — OS / 플랫폼 탭 전환 목록

Windows / macOS 등 플랫폼별 조치 방법 탭 안내.

**지원 필드**: `title` (탭/플랫폼 이름), `desc` (해당 플랫폼 내용, 마크다운 가능)

```markdown
::: os-tabs
- title: "Windows"
  desc: "`winget install Git.Git` 명령을 관리자 터미널에서 실행합니다."
- title: "macOS"
  desc: "`brew install git` 명령을 Terminal에서 실행합니다."
:::
```

**PPTX 지원**: ✅

---

### [27] chapter-list — 시리즈 세부 챕터 목록

Part 하위의 챕터 번호·제목·설명·구분 배지 목록화.

**지원 필드**: `icon` (챕터 번호 문자열), `title` (챕터 제목), `desc` (세부 설명), `tag` (구분 배지: `개념`/`도구`/`사례`/`가이드`/`실습`/`주의`/`핵심`)

```markdown
::: chapter-list
- icon: "01"
  title: "시스템 개요"
  desc: "전체 아키텍처와 핵심 구성 요소를 소개합니다."
  tag: "개념"
- icon: "02"
  title: "빠른 시작 가이드"
  desc: "설치부터 첫 빌드까지 단계별로 안내합니다."
  tag: "실습"
:::
```

**PPTX 지원**: ✅

---

### [28] level-grid — 레벨 스펙트럼

난이도·성숙도·역량 구간을 카드 격자로 비교.  
`tag: "highlight"` 로 특정 카드를 강조합니다.

**지원 필드**: `title` (레벨명), `desc` (설명), `color` (선택), `tag` (`highlight` 시 강조 카드)

```markdown
::: level-grid
- title: "입문"
  desc: "기본 문법과 핵심 개념 이해"
- title: "중급"
  desc: "실무 프로젝트 적용 가능"
  tag: "highlight"
- title: "고급"
  desc: "아키텍처 설계 및 최적화 수행"
:::
```

**PPTX 지원**: ⚠️ 전용 렌더러 없음

---

### [29] checkpoint-grid — 중간 체크포인트

점검 항목, 중간 검수 포인트, 체크리스트형 요약.

**지원 필드**: `icon` (체크 아이콘 이모지), `title` (항목명), `desc` (세부 설명)

```markdown
::: checkpoint-grid
- icon: "📐"
  title: "디자인 검수"
  desc: "숏코드 렌더링 결과물이 디자인 가이드에 부합하는지 확인합니다."
- icon: "🔍"
  title: "콘텐츠 검수"
  desc: "문서 내용의 정확성과 완결성을 점검합니다."
- icon: "✅"
  title: "최종 승인"
  desc: "팀 리뷰 및 게시 전 최종 확인을 완료합니다."
:::
```

**PPTX 지원**: ⚠️ 전용 렌더러 없음

---

## 하위 호환 alias 전체 목록

신규 문서에는 **정식 명칭** 사용을 권장합니다. 기존 문서의 구형 이름은 빌드 파이프라인에서 자동으로 처리됩니다.

| alias (구형/통합 전 이름) | 정식 명칭 | 비고 |
|--------------------------|---------|------|
| `compare-grid` | `columns-grid` | Phase 2 통합 |
| `workflow-flow` | `step-flow` | Phase 2 통합 |
| `workflow-strip` | `step-flow` | Phase 2 통합 |
| `skill-list` | `icon-grid align=left` | Phase 2 통합 |
| `checkpoint-grid` | `icon-grid align=row` | Phase 2 통합 |
| `compare-diff` | `before-after` | Phase 2 개명 |
| `bottom-list` | `summary-box` | Phase 1 (V1 호환) |
| `compare-before-after` | `before-after` | Phase 1 (V1 호환) |
| `flow` | `step-flow` | Phase 1 (V1 호환) |
| `git-flow-strip` | `git-flow` | Phase 1 (V1 호환) |
| `part-deck` | `part-banner` | Phase 1 (V1 호환) |
| `takeaway` | `takeaway-banner` | Phase 1 (V1 호환) |
| `tool-box` | `tool-list` | Phase 1 (V1 호환) |

---

## PPTX 변환 지원 현황

| 숏코드 | HTML | PPTX |
|--------|------|------|
| plan-grid | ✅ | ✅ |
| feature-grid | ✅ | ✅ |
| icon-grid | ✅ | ✅ |
| badge-grid | ✅ | ✅ |
| stat-grid | ✅ | ✅ |
| tool-list | ✅ | ✅ |
| skill-list | ✅ | ✅ |
| compare-split | ✅ | ✅ |
| compare-grid | ✅ | ✅ |
| columns-grid | ✅ | ✅ |
| workflow-flow | ✅ | ✅ |
| step-list | ✅ | ✅ |
| faq-list | ✅ | ✅ |
| os-tabs | ✅ | ✅ |
| alert-box | ✅ | ✅ |
| summary-box | ✅ | ✅ |
| takeaway-banner | ✅ | ✅ |
| part-banner | ✅ | ✅ |
| summary-bar | ✅ | ✅ |
| editor-box | ✅ | ✅ |
| console-box | ✅ | ✅ |
| cmd-box | ✅ | ✅ |
| chapter-list | ✅ | ✅ |
| compare-diff | ✅ | ⚠️ |
| network-box | ✅ | ⚠️ |
| git-flow | ✅ | ⚠️ |
| step-flow | ✅ | ⚠️ |
| level-grid | ✅ | ⚠️ |
| checkpoint-grid | ✅ | ⚠️ |

⚠️: PPTX 전용 렌더러 없음 — 변환 시 해당 슬라이드 제외됨.
