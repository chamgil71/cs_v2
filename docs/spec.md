# Creative Spark V2 — 시스템 사양서 (Specification)

> 버전: 2026-06-25 기준 (숏코드 렌더링 단일화 · 수치 config 구동 반영)
> 대상: 개발자, 기여자, 콘텐츠 작성자
> 성격: 현재 코드베이스의 동작·구조·계약(contract)을 규정하는 기술 사양서

---

## 1. 개요

### 1.1 목적
하나의 마크다운(`.md`) 원본을 **세 가지 출력 포맷**으로 자동 변환하는 저작 파이프라인 + React UI.

| 출력 | 산출물 | 용도 |
|------|--------|------|
| 가이드 HTML | 단일 HTML 문서 | 웹 가이드북 열람 (라이트 테마) |
| 프레젠테이션 HTML | 16:9 횡슬라이드 HTML | 발표용 웹 슬라이드 (다크/라이트 토글) |
| PPTX | PowerPoint 파일 | 발표/배포용 슬라이드 |

핵심 설계 원칙: **콘텐츠(마크다운)와 표현(렌더러·테마)을 분리**하여, 같은 입력으로 세 포맷을 일관되게 생성한다.

### 1.2 기술 스택
- **Frontend**: React 18 + TypeScript + Vite 8 + shadcn/ui + Tailwind CSS 3
- **빌드 엔진**: Node.js ESM 스크립트 (pptxgenjs 4.x, marked 18.x, gray-matter)
- **테스트**: Vitest 3.x (전체 148건, 정합성 85건 포함)

### 1.3 핵심 불변식 (Invariants)
1. **단일 출처(Single Source of Truth)**: 같은 데이터/로직은 한 곳에만 존재한다.
   - HTML 숏코드 렌더링 → `scripts/shortcode-render.mjs`
   - HTML 컴포넌트 CSS → `scripts/shortcode-styles.mjs`
   - 수치(폰트·크기) → `config/*.config.json`
   - 숏코드 가이드 데이터 → `config/shortcode-guide.ts`
2. **하드코딩 금지**: 렌더러 코드에 폰트 크기·색상 리터럴을 박지 않는다. config에서 로드한다.
3. **드리프트 가드**: 정합성 테스트가 출력물 간 불일치를 자동 검출한다.

---

## 2. 시스템 아키텍처

### 2.1 출력 경로 4종과 공유 구조

```
                         ┌─────────────────────────────┐
   markdown (.md)  ───►  │  shortcode-render.mjs (정본) │  파서 + HTML 렌더러 (순수)
                         │  shortcode-styles.mjs (정본) │  컴포넌트 CSS (var(--*))
                         └──────────────┬──────────────┘
                                        │ import (공유)
              ┌─────────────────────────┼─────────────────────────┐
              ▼                         ▼                         ▼
   build-guide.mjs           build-presentation.mjs      client-compiler.ts
   (가이드 HTML)              (슬라이드 HTML)              (미리보기 / standalone)
   Node                      Node                         브라우저 (Vite)

   ── 별도 매체 (HTML 공유 불가, 같은 입력 파서 공유) ──
   md-to-pptx.mjs + pptx-renderers/*.mjs  →  PPTX
```

- **HTML 3종**은 숏코드 → HTML 문자열을 만드는 동일 매체이므로 `shortcode-render.mjs` + `shortcode-styles.mjs`를 **공유**한다. 한 곳 수정 시 3개 출력에 동시 반영.
- **PPTX**는 DOM이 아니라 pptxgenjs 도형·좌표를 그리므로 렌더러를 공유할 수 없다. 대신 **같은 표준화 입력**(standardizeItem)과 **같은 수치 config**(pptdesign)를 소비한다.

### 2.2 셸(shell)의 역할 분담
각 HTML 출력(셸)은 **페이지 골격 + 테마 변수만** 정의하고, 숏코드 본문은 공유 모듈에 위임한다.

| 셸 | 페이지 골격 | 테마(`:root`) | 숏코드 본문 |
|----|------------|--------------|------------|
| build-guide | nav/hero/section 레이아웃 | 라이트 (`--card-bg: #fff`) | `renderShortcode()` + `${SHORTCODE_CSS}` |
| build-presentation | 16:9 슬라이드 + 토글 | 다크 기본 + 라이트모드 | 동일 |
| client-compiler | html/presentation 두 모드 | html=라이트 / pres=다크 | 동일 |

색상은 `resolveColorKeyword()`가 `var(--brand)` 등 **CSS 변수로 반환**하므로, 같은 렌더 출력이 각 셸의 `:root` 값에 따라 라이트/다크로 표현된다.

---

## 3. 마크다운 원본 포맷

### 3.1 문서 구조
```markdown
---
<프론트매터 (YAML)>
---

# H1 → 섹션 / 표지

본문 마크다운...

::: shortcode-type [블록인자]
- key: value
:::

---            ← 슬라이드 구분 (presentation/pptx)
```

### 3.2 프론트매터 키

| 키 | 타입 | 설명 |
|----|------|------|
| `title` | string | 문서 제목 (표지) |
| `subtitle` | string | 부제목 |
| `style` | string | 테마 키 (§6.1) |
| `logo` | string | 표지 이모지/로고 |
| `badge` | string | 표지 배지 텍스트 |
| `coverBg` | string | 표지 배경색/그라데이션 (선택) |
| `titleSize` | number | **문서 단위** 제목 폰트 오버라이드 (pt, PPTX) |
| `bodySize` | number | **문서 단위** 본문 폰트 오버라이드 (pt, PPTX) |
| `stats` | list | 표지 하단 통계 (`value`, `label`) |
| `done` | object | 마무리 슬라이드 (`title`, `subtitle`, `ctaLabel`) |

### 3.3 숏코드 구문
```markdown
::: <type> [arg1 arg2 ...]
- key: "value"
  key2: "value2"
- key: "다음 항목"
:::
```
- 항목은 `- ` 로 시작. 하위 키는 2칸 들여쓰기.
- 멀티라인 값은 YAML 리터럴 블록 `key: |` 사용 (들여쓰기 4칸).

### 3.4 블록 인자

| 인자 | 적용 대상 | 의미 |
|------|----------|------|
| `cols=N` | grid 계열 | CSS 컬럼 수 강제 |
| `bullet=X` | 전체 | 블록 기본 불릿 기호 |
| `align=center\|left\|row` | icon-grid | 레이아웃 변형 |
| `title-size=V` | 전체 | 블록 카드 제목 크기 오버라이드 |
| `desc-size=V` | 전체 | 블록 카드 본문 크기 오버라이드 |
| (alert) `tip\|warn\|success\|danger` | alert-box | 알림 타입 |

`title-size`/`desc-size` 값 규칙:
- 순수 숫자(`1.5`, `0.8`) → 기본값의 **배수** (HTML rem 기준 / PPTX pt 기준)
- 단위 포함(`1.2rem`, `18pt`) → **절대값** 그대로

---

## 4. 표준 입력 키 (Universal Schema)

모든 숏코드 항목은 `standardizeItem()`에 의해 다음 키로 정규화된다 (`scripts/shortcode-render.mjs`, `md-to-pptx.mjs` 양쪽 동일 계약).

| 표준 키 | 용도 | 레거시/대체 입력 (자동 매핑) |
|---------|------|----------------------------|
| `icon` | 아이콘·수치·짧은 라벨 | (title 앞 이모지 자동 추출) |
| `title` | 카드/항목 제목 | `name`, `col` |
| `desc` | 본문·코드 (멀티라인 시 불릿화) | `description`, `tagline`, `body` |
| `tag` | 배지·상태·언어 라벨 | `badge`, `type` |
| `meta` | 추가 목록·칩 (`|` 또는 `\n` 구분) | `tool`, `features`, `items`, `points` |
| `note` | 하단 배지·메모 (`\n`→` · `) | — |
| `color` | 강조색 + SVG 불릿색 (Hex 또는 키워드) | — |
| `bullet` | 아이템별 불릿 기호 (color보다 우선) | — |
| `featured` | `plan-grid` 추천 강조 (`"true"`) | — |

- `desc`/`meta`/`note`의 `\\n`·`/n` 리터럴은 실제 줄바꿈으로 치환된다.
- `color` 키워드: `main/brand`, `sub/brandDark`, `deep/brandDeep`, `mid/brandMid`, `light/brandLight` → 각각 `var(--brand*)` 로 해석.

---

## 5. 숏코드 카탈로그

### 5.1 정식 25종 (카테고리별)

| 카테고리 | 숏코드 |
|---------|-------|
| 비교 & 대조 | `compare-split`, `before-after`, `columns-grid` |
| 코드 & 터미널 | `editor-box`, `console-box`, `cmd-box` |
| 시각 자료 & 흐름 | `network-box`, `git-flow`, `step-flow` |
| 콘텐츠 그리드 | `icon-grid`, `feature-grid`, `tool-list`, `plan-grid`, `badge-grid`, `stat-grid` |
| 정보 & 알림 | `alert-box`, `summary-box`, `takeaway-banner`, `part-banner`, `summary-bar` |
| 구조 & 내비게이션 | `step-list`, `faq-list`, `os-tabs`, `chapter-list`, `level-grid` |

### 5.2 하위 호환 alias 13종 (코드에서 처리, 신규 문서 비권장)

| alias | 정식 | alias | 정식 |
|-------|------|-------|------|
| `compare-grid` | `columns-grid` | `compare-diff` | `before-after` |
| `compare-before-after` | `before-after` | `workflow-flow` | `step-flow` |
| `workflow-strip` | `step-flow` | `flow` | `step-flow` |
| `skill-list` | `icon-grid align=left` | `checkpoint-grid` | `icon-grid align=row` |
| `bottom-list` | `summary-box` | `tool-box` | `tool-list` |
| `git-flow-strip` | `git-flow` | `info-box` | (client 전용 알림) |
| `part-deck` | `part-banner` | | |

### 5.3 icon-grid align 변형
```markdown
::: grid.cards align=center   # 기본 — 아이콘 중앙 카드
::: grid.cards align=left     # 아이콘 좌측 배경박스 (구 skill-list)
::: grid.cards align=row      # 아이콘+텍스트 수평 (구 checkpoint-grid)
```

### 5.4 특수 숏코드
- `slide-config` — 렌더링되지 않음. 해당 슬라이드의 `bg`/`color`를 오버라이드.

---

## 6. 설정 시스템 (config/)

### 6.1 styles.json — 테마 프리셋 (11종)
`custom-blue`, `ai-chat`, `ai-dev`, `knowledge`, `productivity`, `creative`, `security`, `finance`, `future`, `enterprise`, `media`

각 테마 필드:
| 필드 | 용도 |
|------|------|
| `brand`, `brandDark`, `brandDeep`, `brandLight`, `brandMid` | 브랜드 색 단계 |
| `border`, `bg` | 테두리·배경 |
| `webFont`, `webFontTitle` | HTML 폰트 |
| `pptxFont`, `pptxFontTitle`, `pptxFontSubTitle` | PPTX 폰트 (alias) |
| `heroGradient`, `subtitleColor` 등 | 표지 연출 (선택) |
| `titleSize`, `bodySize` | **선택적** 크기 오버라이드 (없으면 config 기본) |

### 6.2 pptdesign.config.json — PPTX 수치 단일 출처 (JSONC)
PPTX의 모든 폰트 크기·레이아웃 수치의 home. 주요 섹션:
- `slide`: 폰트·여백·라운드·본문 영역
- `cover`: 표지 (titleFontSize, subtitleFontSize, logoFontSize, statValueSize, statLabelSize)
- `done`: 마무리 (titleSize, subtitleSize, ctaSize)
- `header`: 섹션 헤더
- `card`: 표준 키 크기 (`titleSize`, `bodySize`, `h3Size`, `codeSize`)
- `grid`/`workflow`/`toolCard`/`network`/`alert`/`tabs`/`cmdBox`/`columns`/`takeaway`/`editorBox`: 컴포넌트별 폰트 크기
- `system`: 에러 placeholder 폰트
- `palette`: 고정 팔레트

### 6.3 htmldesign.config.json — HTML 크기 토큰 (JSONC)
```jsonc
{
  "htmlFont": { "title", "desc", "note", "code", "tag", "scale" },
  "htmlSize": {
    "guide":        { "h1", "h2", "h3", "body-p", "card-title", "card-p",
                      "stat-val", "stat-name", "stat-note", "plan-badge", "plan-features" },
    "presentation": { ...guide 키 + "workflow-name", "workflow-tool" }
  }
}
```
세 셸이 `:root --size-*` 변수를 이 프로파일에서 주입 (가이드=`guide`, 슬라이드=`presentation`, client=모드별).

### 6.4 font-aliases.json — 폰트 별칭 매핑
`md-to-pptx.mjs`의 `resolveFont()`가 PPTX 생성 직전 alias → 실제 폰트명으로 변환.

| alias | 실제 폰트명 |
|-------|-----------|
| `paperlogy`, `paperlogy-regular` | 페이퍼로지 4 Regular |
| `paperlogy-semibold` | 페이퍼로지 6 SemiBold |
| `paperlogy-extrabold` | 페이퍼로지 8 ExtraBold |
| `pretendard` | Pretendard |
| `noto-sans` / `noto-serif` | Noto Sans KR / Noto Serif KR |
| `malgun` / `consolas` | 맑은 고딕 / Consolas |

> ⚠️ 페이퍼로지는 **한글명**으로만 설치 인식됨. 영문 `"Paperlogy X"` 불가 → alias 또는 한글명 사용.

### 6.5 shortcode-guide.ts — 가이드/삽입 데이터 (단일 출처)
`MarkdownCompiler`의 가이드 패널 표시 + `insertShortcode()` 삽입 스니펫이 **모두 이 배열을 참조**. 25개 항목(`key`, `name`, `category`, `desc`, `fields`, `snippet`). 멀티라인 스니펫은 템플릿 리터럴.

### 6.6 layout.json — 슬라이드 레이아웃 오프셋

---

## 7. 폰트 · 크기 시스템

### 7.1 크기 캐스케이드 (우선순위: 뒤로 갈수록 우선)
```
1. config 기본          (pptdesign.config.json / htmldesign.config.json)
2. styles.json          (스타일별 선택 오버라이드 — titleSize/bodySize)
3. frontmatter          (문서 단위 — titleSize/bodySize)
4. 숏코드 블록 인자      (블록 단위 — title-size= / desc-size=)
```
PPTX 구현: `md-to-pptx.mjs` L803-811 (style/fm) + `applyShortcodeSizeArgs()` (블록).
HTML 구현: `:root` ← htmlSize config / `buildSizeOverrideStyle()` (블록 인라인 변수).

### 7.2 PPTX 폰트 흐름
```
styles.json pptxFont (alias)  →  resolveFont()  →  실제 폰트명  →  PPTX XML typeface
pptdesign card.bodySize       →  (style/fm/블록 오버라이드)  →  addText fontSize
```

---

## 8. 렌더링 계약 (Rendering Contract)

### 8.1 HTML 공유 모듈 API
```js
// scripts/shortcode-render.mjs
renderShortcode(type: string, body: string, args: string): string  // → HTML 문자열
parseShortcodeItems(src: string): Item[]                            // YAML유사 → 표준 item[]
// 색상은 var(--*) 반환 → 스타일 객체 불요. 미등록 type → "" (조용히 무시)
```
```js
// scripts/shortcode-styles.mjs
export const SHORTCODE_CSS: string   // var(--*) 기반 컴포넌트 CSS (각 셸 <style>에 포함)
```

### 8.2 PPTX 렌더러 모듈 계약
`scripts/pptx-renderers/<name>.mjs` 각 모듈은 다음을 export:
```js
export const type            // string 또는 string[] (담당 숏코드 타입/별칭)
export function estimateHeight(item, w, D, helpers): number   // 인치 단위 높이 추정
export function render(slide, item, x, y, w, pal, D, helpers): number  // 실제 드로잉, 소비 높이 반환
```
`registry.mjs`가 `type` → 모듈 맵을 구성하고 `pptxRegistry.get(type)`/`.has(type)` 제공.

### 8.3 PPTX 렌더러 모듈 맵 (요약)
| 모듈 | 담당 타입 |
|------|----------|
| `flow.mjs` | step-flow / workflow-flow / workflow-strip |
| `columns.mjs` | columns-grid / compare-grid(alias) |
| `compare-grid.mjs` | level-grid / part-banner / part-deck |
| `compare-split.mjs` | compare-split / compare-2col / compare-before-after / compare-diff / **before-after** |
| `icon-grid.mjs` | icon-grid (align 변형) |
| `feature-grid.mjs`, `stat-grid.mjs`, `plan-grid.mjs` | 동명 그리드 |
| `steps.mjs` | step-list / chapter-list |
| `summary-box.mjs` | summary-box / bottom-list |
| `takeaway.mjs` | takeaway-banner / summary-bar |
| `tool-list.mjs` | tool-list / badge-grid |
| `tabs.mjs`, `faq-list.mjs`, `git-flow.mjs`, `network-box.mjs`, `editor-box.mjs`, `console-box.mjs`, `cmd-box.mjs`, `alert-box.mjs` | 동명 |

> ⚠️ `compare-grid.mjs`는 `compare-grid`를 `columns.mjs`에 넘겼지만 `level-grid`/`part-banner`/`part-deck` 처리를 위해 **유지 필수**.

---

## 9. 빌드 · 명령어

```bash
# 단일 변환
node scripts/build-guide.mjs <md> --out <html>
node scripts/build-presentation.mjs <md> --out <html>
node scripts/md-to-pptx.mjs <md> --out <pptx>

# 일괄
node scripts/md-to-pptx.mjs --all "md_src/guides/*.md"

# React UI / 빌드
npm run dev
npm run build

# standalone (정합성 테스트 게이트 후 빌드)
npm run build:standalone        # vitest 정합성 → build-standalone.mjs
npm run build:standalone:fast   # 빌드만

# 테스트
npm test                        # 전체 148건
```

산출물: `dist/{standalone,module1,module2}.html` (standalone), `dist/` (Vite 빌드).

---

## 10. 테스트 · 정합성 (드리프트 가드)

### 10.1 정합성 테스트 (`src/__tests__/shortcode-conformance.test.ts`, 85 케이스)
3개 검증 축:
1. **공유 HTML 렌더러**: 정식 25종 + 주요 alias가 비어있지 않은 HTML 생성, `undefined`/에러 없음.
2. **PPTX 레지스트리 커버리지**: 정식 25종이 `pptxRegistry.has(type)`.
3. **client-compiler**: 각 숏코드가 standalone 컴파일 시 원문 `:::` 델리미터를 남기지 않음.

> 이 테스트는 출력물 간 드리프트(한쪽에만 추가/변경)를 즉시 검출한다. 실제로 도입 시 PPTX `before-after` 레지스트리 누락을 발견·수정함.

### 10.2 기타 유닛 테스트
`client-compiler.test.ts`, `pptx-analyzer.test.ts`, `wcag.test.ts`.

---

## 11. 작업 규칙 (Constraints)

본 사양을 유지하기 위한 필수 규칙 (상세: `CLAUDE.md`):

1. **하드코딩 금지** — 폰트 크기·색상 등 수치는 config에 두고 코드는 읽기만. 폴백 리터럴은 `D.x?.y ?? 기본값` 형태로만.
2. **단일 출처 유지** — 같은 로직/데이터가 2곳 이상 생기면 공유 모듈로 추출.
3. **종료 전 문서화 확인** — 변경 시 CLAUDE.md / README / docs / 본 spec.md 및 테스트 갱신.
4. **시점 기록 보존** — `docs/report/*_YYYY-MM-DD.md`는 수정하지 말고 새 파일/항목 추가.

---

## 12. 확장 가이드 — 새 숏코드 추가 절차

> **2026-10-14 부터 새 배치는 기능 이름으로 추가한다**: 공용 카탈로그(coding `_templates/slide-library/catalog/layouts.json`)에 배치를 먼저 정의하고
> `impl.cs_v2 = { status: "ready", shortcode: "<기능 이름>", pptx_shortcode: "<가까운 옛 숏코드>" }` → `scripts/shortcode-ext/<그룹>.mjs` 에 렌더러 `(items, a, h)` + CSS
> → `npm run sync:library` → `npm test`(`layout-ext.test.ts` 가 예시 렌더·CSS 커버리지·이스케이프를 자동 검사). 기본 수치는 카탈로그 `args.default`(`layoutArgs`).
> 아래 1~8 은 옛 숏코드 분기(구현 ID)를 고칠 때의 절차다.

1. **HTML 렌더러**: `scripts/shortcode-render.mjs`에 `type === "new"` 분기 추가 (클래스 기반 출력, 색상은 `resolveColorKeyword`).
2. **HTML CSS**: `scripts/shortcode-styles.mjs`에 컴포넌트 CSS 추가 (`var(--*)` 사용, 카드 배경 `var(--card-bg, #fff)`).
3. **PPTX 렌더러**: `scripts/pptx-renderers/new.mjs` 작성 (`type`/`estimateHeight`/`render`), `registry.mjs` 자동 등록 확인. 폰트 크기는 `D.<comp>.*` (config) 참조.
4. **config**: 새 PPTX 수치는 `pptdesign.config.json`에, HTML 크기 토큰은 `htmldesign.config.json htmlSize`에 추가.
5. **가이드 데이터**: `config/shortcode-guide.ts`에 항목(name/desc/fields/snippet) 추가.
6. **정합성 테스트**: `shortcode-conformance.test.ts` CASES/CANONICAL에 추가.
7. **문서**: `docs/shortcode-reference.md`, `shortcode-changelog.md`, 본 spec §5 갱신.
8. **빌드 검증**: `npm test` + `npm run build:standalone`.

---

## 13. 파일 레퍼런스

| 영역 | 경로 |
|------|------|
| 정본 HTML 렌더러 | `scripts/shortcode-render.mjs` + 기능 이름 배치 `scripts/shortcode-ext/*` |
| 정본 HTML CSS | `scripts/shortcode-styles.mjs` |
| 가이드 HTML 셸 | `scripts/build-guide.mjs` |
| 슬라이드 HTML 셸 | `scripts/build-presentation.mjs` |
| 브라우저 셸 | `src/lib/client-compiler.ts` |
| PPTX 엔진 | `scripts/md-to-pptx.mjs` |
| PPTX 렌더러 | `scripts/pptx-renderers/*.mjs` + `registry.mjs` |
| standalone 빌드 | `scripts/build-standalone.mjs` |
| 설정 | `config/{styles,pptdesign.config,htmldesign.config,font-aliases,layout}.json`, `config/shortcode-guide.ts` |
| 정합성 테스트 | `src/__tests__/shortcode-conformance.test.ts` |
| 에디터 UI | `src/components/MarkdownCompiler.tsx` |
| 관련 문서 | `docs/{shortcode-reference,shortcode-changelog,scripts_guide,guide}.md`, `docs/report/pipeline_divergence_analysis_2026-06-25.md` |

---

*본 사양서는 2026-06-25 숏코드 렌더링 단일화 작업 기준으로 작성되었습니다. 구조 변경 시 본 문서를 함께 갱신하십시오 (작업 규칙 §11-3).*
