# 숏코드 시스템 변경 이력

> cs_v2 프로젝트의 숏코드 명칭·구조·기능 변경 내역을 기록합니다.  
> 원본 프로젝트: `c:\ai\creative-spark`

---

## Phase 5 — 렌더링 단일화 · 수치 config 구동 · 정합성 테스트 (2026-06-25)

### 배경
HTML 숏코드 렌더러가 `build-guide.mjs`·`build-presentation.mjs`·`client-compiler.ts` **3벌로 중복**되어 출력이 어긋나고(번갈아 깨짐), PPTX 폰트 크기를 config에서 바꿔도 반영되지 않는 문제(스타일 오버라이드·렌더러 하드코딩)를 해소.

### 변경 1 — HTML 숏코드 렌더링 정본 단일화
- 정본 파서+렌더러 → **`scripts/shortcode-render.mjs`** (순수 함수, marked만 의존) 추출.
- 컴포넌트 CSS → **`scripts/shortcode-styles.mjs`** (`var(--*)` 테마 독립, 카드배경 `var(--card-bg, #fff)`).
- `build-guide`·`build-presentation`·`client-compiler` **3개 HTML 출력이 모두 공유 모듈 사용** → 한 곳 수정 시 동시 반영(드리프트 차단). presentation은 `before-after`·`os-tabs`를 새로 획득.

### 변경 2 — 수치 전면 config 구동 (하드코딩 제거)
- PPTX 렌더러의 폰트 크기 하드코딩 **28곳 → `config/pptdesign.config.json` 참조**로 전환(컴포넌트별 키 신설).
- HTML `:root` 크기 토큰 → **`config/htmldesign.config.json`의 `htmlSize.guide/presentation`** 에서 로드(3개 셸 모두).
- `config/styles.json` custom-blue 의 우발적 `titleSize/bodySize` 제거 → config 기본값 폴백. 스타일별 크기는 **선택적 오버라이드**로만 유지.
- 크기 캐스케이드: `config → styles.json → frontmatter → 숏코드 블록 인자`.

### 변경 3 — 숏코드 블록 크기 인자 PPTX 대칭
- `title-size=` / `desc-size=` 인자를 **PPTX(`md-to-pptx.mjs`)에도 추가**(배수/절대 pt). 기존 HTML 전용 → HTML·PPTX 양쪽 동작.

### 변경 4 — 가이드 데이터 단일 출처
- `MarkdownCompiler.tsx`의 숏코드 가이드 패널 데이터 + `insertShortcode` 삽입 스니펫 중복 → **`config/shortcode-guide.ts` 단일 출처**로 통합.

### 변경 5 — 정합성 테스트 & 빌드 게이트
- `src/__tests__/shortcode-conformance.test.ts` 신설(85 케이스): 공유 HTML 렌더러 + PPTX 레지스트리 커버리지 + standalone `:::` 잔존 검사. **드리프트 1건 발견·수정**(PPTX `before-after` 레지스트리 누락).
- `npm run build:standalone` 이 정합성 테스트 통과를 **게이트**로 선행 실행.

> 상세 분석·의사결정: `docs/report/pipeline_divergence_analysis_2026-06-25.md`

---

## Phase 3 — 폰트 크기 통일 및 유지보수 기능 추가 (2026-06-24)

### 배경

Phase 2 통합 이후 숏코드별 카드 제목/설명 폰트 크기가 제각각이었음을 확인하였다 (0.82rem ~ 1.3rem 혼재). 일관된 타이포그래피 규격 적용 및 문서 단위 오버라이드 기능을 추가하였다. 아울러 `\n` 치환 버그를 수정하고 미리보기 축소 기능을 개선하였다.

---

### 변경 1: 숏코드 카드 폰트 크기 전면 통일 — CSS 변수 시스템

| 항목 | 내용 |
|------|------|
| **변경 전** | 숏코드별 하드코딩된 rem 값 혼재 (0.82rem ~ 1.3rem) |
| **변경 후** | 전체 카드 title → `var(--size-card-title)`, desc → `var(--size-card-p)` |
| **기본값** | `--size-card-title: 1.15rem`, `--size-card-p: 0.92rem` |
| **변경 파일** | `scripts/build-guide.mjs` (CSS 변수 `:root` 블록 및 각 CSS 클래스) |

**통일 적용 대상 CSS 클래스 (전체):**

| 클래스 | 적용 변수 |
|--------|---------|
| `.step-title`, `.plan-title`, `.skill-title` | `--size-card-title` |
| `.badge-title`, `.c2-title`, `.tc-name` | `--size-card-title` |
| `.wf-name`, `.faq-q`, `.ba-label` | `--size-card-title` |
| `.alert-body strong`, `.level-name`, `.ci-text strong` | `--size-card-title` |
| `.fs-title`, `.ta-label` | `--size-card-title` |
| `.skill-desc`, `.c2-list li`, `.tc-sub`, `.tc-list` | `--size-card-p` |
| `.wf-tool`, `.faq-a p`, `.ba-content` | `--size-card-p` |
| `.level-tool`, `.ci-text`, `.fs-sub`, `.ta-text` | `--size-card-p` |
| `multiline-item` 인라인 스타일 | `--size-card-p` |

**수정 방법 (전역 크기 변경)**: `scripts/build-guide.mjs` 약 984번째 줄 수정

```css
--size-card-title: 1.15rem;   /* 변경 가능 */
--size-card-p:     0.92rem;   /* 변경 가능 */
```

---

### 변경 2: 숏코드별 폰트 크기 오버라이드 인수 추가 — `title-size` / `desc-size`

| 항목 | 내용 |
|------|------|
| **새 기능** | 모든 숏코드 선언부에 `title-size=<값>` / `desc-size=<값>` 인수 지원 |
| **비율 입력** | 순수 숫자(예: `0.9`) → 기본값 × 배율 (`0.9 × 1.15rem = 1.035rem`) |
| **절대값 입력** | 단위 포함(예: `1.0rem`, `14px`) → 해당 값 그대로 |
| **적용 범위** | 해당 블록에만 CSS 변수 스코프 — 다른 블록 영향 없음 |
| **변경 파일** | `scripts/build-guide.mjs` (헬퍼 함수 `resolveSizeArg`, `buildSizeOverrideStyle` 추가) |

```markdown
::: icon-grid title-size=0.9 desc-size=0.85rem
- icon: 🔵
  title: 이 블록만 작은 제목
  desc: 이 블록만 작은 설명
:::
```

---

### 변경 3: `\n` → `<br>` 치환 시 코드 블록 보호 (버그 수정)

| 항목 | 내용 |
|------|------|
| **버그** | `\n` → `<br>` 전역 정규식이 펜스 코드 블록(` ``` `)과 인라인 코드(`` ` ``)까지 오염 |
| **현상** | 코드 블록 내 `\n` 문자열이 `<br>`로 치환되어 렌더링 깨짐 |
| **수정** | 치환 전 코드 블록/인라인 코드를 null-byte 플레이스홀더로 보호, 치환 후 복원 |
| **변경 파일** | `scripts/build-guide.mjs` (약 854번째 줄 구간) |

---

### 변경 4: MarkdownCompiler 미리보기 축소 렌더링 개선

| 항목 | 내용 |
|------|------|
| **변경 전** | 미리보기 iframe이 원본 크기(1:1)로 표시되어 좁은 패널에서 글자가 비정상적으로 크게 보임 |
| **변경 후** | `ResizeObserver` + `transform: scale()` 으로 컨테이너 너비에 맞게 축소 렌더링 |
| **가상 기준 너비** | Desktop = 1200px, Tablet = 768px, Mobile = 375px |
| **스케일 표시** | 우측 상단 오버레이 배지로 현재 축소 비율(%) 표시 |
| **변경 파일** | `src/components/MarkdownCompiler.tsx` |

---

## Phase 2 — 디자인 독창성 검토 및 통합 정리 (2026-06-24)

### 배경

cs_v2 이식 완료 후 29종 숏코드 전체를 렌더링 코드 수준에서 분석한 결과, 시각적 구조가 실질적으로 동일하거나 포함 관계에 있는 숏코드를 확인하였다. 기존 md_src 파일의 하위 호환을 유지하면서 UI 문서 및 코드를 통합 정리하였다.

---

### 변경 1: `compare-grid` → `columns-grid` 흡수 (alias)

| 항목 | 내용 |
|------|------|
| **변경 전** | `compare-grid`와 `columns-grid` 두 개의 독립 숏코드 존재 |
| **변경 후** | `columns-grid` 가 정식 명칭. `compare-grid` 는 동작 호환 alias |
| **이유** | 렌더링 코드가 동일 구조(`compare-card` vs `column-card` 클래스명만 다름). `renderCompareNote()` 공유. 독립 유지 가치 없음 |
| **md_src 영향** | 없음. `compare-grid` 는 alias 로 계속 동작 (사용 건수: 18건) |
| **변경 파일** | `build-guide.mjs`, `pptx-renderers/columns.mjs`, `MarkdownCompiler.tsx` |

**코드 변경 요약:**
```js
// build-guide.mjs
if (type === "columns-grid" || type === "compare-grid") { ... }

// pptx-renderers/columns.mjs
export const type = ["columns-grid", "columns", "compare-grid"];
```

---

### 변경 2: `workflow-flow` → `step-flow` 흡수 (alias)

| 항목 | 내용 |
|------|------|
| **변경 전** | `workflow-flow`와 `step-flow` 두 개의 독립 가로 흐름 숏코드 존재 |
| **변경 후** | `step-flow` 가 정식 명칭. `workflow-flow` 는 동작 호환 alias (시각적 wf-* CSS 클래스 유지) |
| **이유** | 둘 다 가로 방향 단계 흐름. `step-flow` 가 더 범용적이며 `tag:active` 강조 기능 포함. `workflow-flow` 의 meta(도구/코멘트) 필드를 `step-flow` 에 추가하여 완전 흡수 |
| **기능 추가** | `step-flow` 에 `meta` 필드 추가 (도구/코멘트 표시 가능) |
| **md_src 영향** | 없음. `workflow-flow` 는 alias 로 계속 동작 (사용 건수: 8건) |
| **변경 파일** | `build-guide.mjs`, `pptx-renderers/flow.mjs`, `pptx-renderers/registry.mjs`, `MarkdownCompiler.tsx` |

**코드 변경 요약:**
```js
// build-guide.mjs — step-flow 에 meta 필드 추가
if (type === "step-flow" || type === "flow") {
  // ... fs-meta 렌더링 추가
}

// pptx-renderers/flow.mjs
export const type = ["step-flow", "flow", "workflow-flow", "workflow-strip"];

// pptx-renderers/registry.mjs — workflow.mjs import 제거
```

---

### 변경 3: `icon-grid` — `align` 파라미터 추가 (skill-list / checkpoint-grid 흡수)

| 항목 | 내용 |
|------|------|
| **변경 전** | `icon-grid`, `skill-list`, `checkpoint-grid` 세 개의 독립 숏코드 |
| **변경 후** | `icon-grid align=center\|left\|row` 로 통합. 구 이름은 alias |
| **이유** | 세 가지 모두 icon + title + desc 구조. 차이는 정렬 방향뿐 |
| **align 옵션** | |
| `align=center` (기본값) | 아이콘 중앙, 카드형 — 기존 `icon-grid` 동일 |
| `align=left` | 아이콘 좌측 작은 배경박스 — 기존 `skill-list` 동일 |
| `align=row` | 아이콘 좌, 텍스트 우 수평 — 기존 `checkpoint-grid` 동일 |
| **md_src 영향** | 없음. `skill-list`(2건), `checkpoint-grid`(1건) alias 로 계속 동작 |
| **변경 파일** | `build-guide.mjs`, `MarkdownCompiler.tsx` |

**사용 예시:**
```markdown
::: icon-grid align=left
- icon: "⚡"
  title: "스킬명"
  desc: "설명"
:::

::: icon-grid align=row
- icon: "📐"
  title: "항목명"
  desc: "세부 설명"
:::
```

---

### 변경 4: `compare-diff` → `before-after` 개명 (alias 유지)

| 항목 | 내용 |
|------|------|
| **변경 전** | `compare-diff` |
| **변경 후** | `before-after` (정식 명칭). `compare-diff` / `compare-before-after` 는 alias |
| **이유** | "diff"는 코드 diff를 연상시켜 ❌/✅ 전후 대조 의도가 불명확. `before-after` 가 사용 목적을 직접 표현 |
| **md_src 영향** | 없음. `compare-diff`(1건) alias 로 계속 동작 |
| **변경 파일** | `build-guide.mjs`, `MarkdownCompiler.tsx` |

---

### 변경 5: `step-flow` — `meta` 필드 추가 (기능 확장)

| 항목 | 내용 |
|------|------|
| **변경 전** | `step-flow` 는 icon, title, desc, tag 만 지원 |
| **변경 후** | `meta` 필드 추가 — 각 단계에 도구/코멘트 텍스트 표시 가능 |
| **이유** | `workflow-flow` 흡수 시 meta(도구 코멘트) 기능을 보존하기 위함 |
| **변경 파일** | `build-guide.mjs` |

---

### 검토 결과: 유지 결정 항목

| 항목 | 결론 | 이유 |
|------|------|------|
| `step-list` vs `step-flow` 네이밍 | **유지** | 접미사 규칙(-list=수직목록, -flow=가로흐름)으로 명확히 구분됨 |
| `compare-split` 독립 유지 | **유지** | meta(체크리스트) 지원, 좌/우 균형 2분할 구조 — before-after 와 의도 다름 |
| V1 별칭 코드 유지 | **유지** | md_src 사용 건수가 다수(bottom-list, flow 등)여서 코드 alias 필수 |

---

## Phase 1 — creative-spark → cs_v2 이식 (이전 작업)

### 숏코드 네이밍 변경 (creative-spark 기준)

| creative-spark 원본명 | cs_v2 변경명 | 변경 이유 |
|-----------------------|------------|---------|
| `steps` | `step-list` | `-list` 접미사 일관성 |
| `compare-2col` | `compare-split` | 기능 설명적 이름 |
| `tool-card` | `tool-list` | `-list` 접미사 일관성 |
| `workflow` | `workflow-flow` | HTML 클래스명 정합 → Phase 2에서 step-flow alias로 추가 정리 |
| `prompt-example` | `console-box` | 기능 설명적 이름 |
| `stat-highlight` | `stat-grid` | `-grid` 접미사 일관성 |
| `command-block` | `cmd-box` | `-box` 접미사 일관성 |
| `tabs` | `os-tabs` | 플랫폼 명시 |
| `faq-accordion` | `faq-list` | `-list` 접미사 일관성 |
| `columns` | `columns-grid` | `-grid` 접미사 일관성 |

### V1 하위 호환 별칭 (creative-spark 구형 이름)

| 구형 이름 | 현행 이름 |
|-----------|---------|
| `bottom-list` | `summary-box` |
| `compare-before-after` | `before-after` (구 `compare-diff`) |
| `flow` | `step-flow` |
| `git-flow-strip` | `git-flow` |
| `part-deck` | `part-banner` |
| `takeaway` | `takeaway-banner` |
| `tool-box` | `tool-list` |
| `workflow-strip` | `workflow-flow` → (Phase 2) `step-flow` |

---

## 네이밍 규칙 (접미사 체계)

cs_v2에서 확립된 숏코드 네이밍 원칙:

| 접미사 | 의미 | 예시 |
|--------|------|------|
| `-grid` | 격자 레이아웃 | `icon-grid`, `feature-grid`, `plan-grid` |
| `-list` | 수직 목록 | `step-list`, `tool-list`, `faq-list` |
| `-flow` | 가로 흐름/연결 | `step-flow`, `git-flow` |
| `-box` | 단일 박스 컨테이너 | `alert-box`, `summary-box`, `editor-box` |
| `-banner` | 와이드 전체폭 배너 | `part-banner`, `takeaway-banner` |
| `-bar` | 가로 띠 | `summary-bar` |
| `-tabs` | 탭 전환 UI | `os-tabs` |
| `-split` | 2분할 비교 | `compare-split` |

**명칭 선정 원칙**: 이름만 보고 해당 컴포넌트의 시각적 형태(모양, 방향, 레이아웃)를 즉시 연상할 수 있도록 Prefix(내용/용도) + Suffix(형태/레이아웃) 조합으로 구성.

---

## 현재 숏코드 목록 (Phase 2 이후)

### 정식 명칭 25종

| # | 숏코드명 | 카테고리 |
|---|---------|---------|
| 1 | `compare-split` | 비교 & 대조 |
| 2 | `before-after` | 비교 & 대조 |
| 3 | `columns-grid` | 비교 & 대조 |
| 4 | `editor-box` | 코드 & 터미널 |
| 5 | `console-box` | 코드 & 터미널 |
| 6 | `cmd-box` | 코드 & 터미널 |
| 7 | `network-box` | 시각 자료 & 흐름 |
| 8 | `git-flow` | 시각 자료 & 흐름 |
| 9 | `step-flow` | 시각 자료 & 흐름 |
| 10 | `icon-grid` | 콘텐츠 그리드 |
| 11 | `feature-grid` | 콘텐츠 그리드 |
| 12 | `tool-list` | 콘텐츠 그리드 |
| 13 | `plan-grid` | 콘텐츠 그리드 |
| 14 | `badge-grid` | 콘텐츠 그리드 |
| 15 | `stat-grid` | 콘텐츠 그리드 |
| 16 | `alert-box` | 정보 & 알림 |
| 17 | `summary-box` | 정보 & 알림 |
| 18 | `takeaway-banner` | 정보 & 알림 |
| 19 | `part-banner` | 정보 & 알림 |
| 20 | `summary-bar` | 정보 & 알림 |
| 21 | `step-list` | 구조 & 내비게이션 |
| 22 | `faq-list` | 구조 & 내비게이션 |
| 23 | `os-tabs` | 구조 & 내비게이션 |
| 24 | `chapter-list` | 구조 & 내비게이션 |
| 25 | `level-grid` | 구조 & 내비게이션 |

### 동작 호환 alias (하위 호환 — 신규 문서 사용 비권장)

| alias | 정식 명칭 |
|-------|---------|
| `compare-grid` | `columns-grid` |
| `workflow-flow` | `step-flow` |
| `workflow-strip` | `step-flow` |
| `skill-list` | `icon-grid align=left` |
| `checkpoint-grid` | `icon-grid align=row` |
| `compare-diff` | `before-after` |
| `bottom-list` | `summary-box` |
| `compare-before-after` | `before-after` |
| `flow` | `step-flow` |
| `git-flow-strip` | `git-flow` |
| `part-deck` | `part-banner` |
| `takeaway` | `takeaway-banner` |
| `tool-box` | `tool-list` |
