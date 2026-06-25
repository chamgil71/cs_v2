# Creative Spark V2 — Claude 작업 컨텍스트

## 프로젝트 개요

마크다운(`.md`) 원본을 **가이드 HTML · 횡슬라이드 HTML · PPTX** 세 포맷으로 자동 변환하는 저작 파이프라인 + React UI.  
원본 프로젝트: `c:\ai\creative-spark` (이식 및 확장 완료)

---

## ⚠️ 작업 필수 규칙 (MUST — 위반 금지)

### 규칙 1. 하드코딩 금지 — 수치·데이터는 config / 단일 출처에서 불러 쓴다
코드에 **수치·반복 데이터를 직접 박지 않는다.** 반드시 설정/데이터 모듈에서 import 해서 사용한다.

| 대상 | 출처(home) | 금지 예 |
|------|-----------|--------|
| PPTX 폰트 크기·레이아웃 수치 | `config/pptdesign.config.json` | 렌더러에 `fontSize: 14` 직접 입력 ❌ → `c.bodySize`/`D.alert.iconFontSize` ✅ |
| HTML 폰트·크기 토큰 | `config/htmldesign.config.json` (`htmlSize.guide`/`presentation`) | `:root`에 `--size-card-p: 0.92rem` 하드코딩 ❌ |
| 테마 색상·폰트 | `config/styles.json` (스타일별), `config/font-aliases.json` | 렌더러에 색상 HEX 직접 입력 ❌ |
| 숏코드 HTML 렌더링 | `scripts/shortcode-render.mjs` (정본 단일 모듈) | build-guide/presentation/client 에 각각 렌더러 중복 ❌ |
| 숏코드 컴포넌트 CSS | `scripts/shortcode-styles.mjs` (`var(--*)` 기반) | 셸마다 컴포넌트 CSS 따로 작성 ❌ |
| 숏코드 가이드/삽입 스니펫 | `config/shortcode-guide.ts` (단일 출처) | 가이드패널·insertShortcode 에 스니펫 중복 ❌ |

- **크기 캐스케이드 우선순위**: `config 기본 → styles.json(스타일별 선택) → frontmatter(문서) → 숏코드 블록 인자(title-size=/desc-size=)`. 뒤로 갈수록 우선.
- 새 수치가 필요하면 **먼저 적절한 config 파일에 키를 추가**하고 코드는 그 키를 읽는다. 부득이한 폴백 리터럴은 `D.x?.y ?? 기본값` 형태로만 허용.
- 같은 로직/데이터가 2곳 이상에 생기려 하면 **단일 모듈로 추출**한다 (렌더러 4벌 드리프트 재발 방지).

### 규칙 2. 종료 전 문서화 확인 (Definition of Done)
작업(기능 추가·구조 변경·버그 수정)을 **끝내기 전 반드시** 아래를 점검하고, 영향받은 문서를 현행화한다.

- [ ] **CLAUDE.md** — 아키텍처/규칙/이슈 이력에 영향이 있으면 갱신 (특히 「주요 이슈 이력」 표)
- [ ] **README.md** — 폴더 구조·스크립트·기능 설명에 변경이 있으면 갱신 (숏코드 개수 등 수치 표기 포함)
- [ ] **docs/** — `scripts_guide.md`(개발자), `guide.md`(사용자), `shortcode-reference.md`, `shortcode-changelog.md`(변경이력 **추가**) 중 해당 문서 갱신
- [ ] **정합성 테스트** — 숏코드/렌더러 변경 시 `npm test` (정합성 85건 포함) 통과 확인
- [ ] 시점 기록 문서(`docs/report/*_YYYY-MM-DD.md`)는 **수정하지 말고 새 항목/새 파일로 추가** (역사 보존)

> 문서화는 작업의 일부다. "코드만 고치고 문서는 나중에"는 이 프로젝트의 반복 이슈(드리프트)의 원인이므로 금지.

---

## 주요 기술 스택

- **Frontend**: React 18 + TypeScript + Vite 8 + shadcn/ui
- **빌드 파이프라인**: Node.js ESM 스크립트 (pptxgenjs 4.x, marked 18.x, gray-matter)
- **스타일**: Tailwind CSS 3.x + CSS 변수 기반 테마
- **테스트**: Vitest 3.x + @testing-library/react

---

## 디렉토리 구조

```
cs_v2/
├── src/
│   ├── components/
│   │   ├── MarkdownCompiler.tsx   # 메인 에디터 UI (숏코드 툴바 포함, 브라우저 내 컴파일)
│   │   ├── PptxAnalyzer.tsx       # PPTX 분석기 (폰트·색상 추출)
│   │   ├── PptxInspectorSuite.tsx # PPTX 인스펙터 & 리매퍼
│   │   ├── VisualAdjuster.tsx     # 테마 빌더 (styles.json 실시간 편집)
│   │   ├── SubUtilities.tsx       # 보조 유틸 (파일 변환 도구 모음)
│   │   └── ErrorBoundary.tsx      # React 에러 경계
│   ├── lib/
│   │   ├── client-compiler.ts     # 브라우저 전용 MD→HTML 컴파일러 (pptx-browser와 쌍)
│   │   ├── pptx-browser.ts        # 브라우저 전용 MD→PPTX (md-to-pptx.mjs 포트)
│   │   ├── exportGuide.ts         # 가이드 HTML 내보내기 헬퍼
│   │   ├── wcag.ts                # WCAG 색상 대비 계산 유틸
│   │   └── utils.ts               # clsx/tailwind 유틸
│   ├── __tests__/
│   │   ├── client-compiler.test.ts # 브라우저 컴파일러 유닛 테스트
│   │   ├── shortcode-conformance.test.ts # 정합성(드리프트 가드) 85개 — 공유 렌더러+PPTX 레지스트리
│   │   ├── pptx-analyzer.test.ts  # PPTX 분석기 테스트
│   │   └── wcag.test.ts           # WCAG 유틸 테스트 (전체 148개)
│   ├── standalone/
│   │   ├── module1-main.tsx       # 스탠드얼론 모듈1 진입점
│   │   └── module2-main.tsx       # 스탠드얼론 모듈2 진입점
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── components/ui/             # shadcn/ui 컴포넌트 (accordion~tooltip)
│   ├── main.tsx
│   └── index.css
├── scripts/
│   ├── shortcode-render.mjs       # [정본] 숏코드 → HTML 파서+렌더러 (3개 HTML 출력 공유, 순수 함수)
│   ├── shortcode-styles.mjs       # [정본] 숏코드 컴포넌트 CSS (var(--*) 테마 독립)
│   ├── build-guide.mjs            # MD → 가이드 HTML 변환 (공유 모듈 import)
│   ├── build-presentation.mjs     # MD → 횡슬라이드 HTML 변환 (공유 모듈 import)
│   ├── md-to-pptx.mjs             # MD → PPTX 변환 CLI (Universal Schema 기반)
│   ├── build-publish.mjs          # 배포용 빌드
│   ├── build-standalone.mjs       # 스탠드얼론 빌드 (npm run build:standalone)
│   ├── spec-parser.js             # 숏코드 사양 파서 (레퍼런스 동기화용)
│   ├── sync-guides-index.mjs      # md_src 가이드 인덱스 동기화
│   ├── vite-api-plugin.ts         # Vite dev 서버 API 미들웨어 (스타일 저장·미리보기)
│   └── pptx-renderers/            # PPTX 숏코드별 렌더러 모듈
│       ├── registry.mjs           # 렌더러 등록 테이블 + 공통 helpers 정의
│       ├── flow.mjs               # step-flow / workflow-flow / workflow-strip
│       ├── workflow.mjs           # (레거시 유지, flow.mjs와 협력)
│       ├── columns.mjs            # columns-grid / compare-grid(alias)
│       ├── compare-grid.mjs       # level-grid / part-banner / part-deck (compare-grid 제외)
│       ├── compare-split.mjs      # compare-split
│       ├── console-box.mjs        # console-box
│       ├── editor-box.mjs         # editor-box
│       ├── faq-list.mjs           # faq-list
│       ├── feature-grid.mjs       # feature-grid
│       ├── git-flow.mjs           # git-flow
│       ├── icon-grid.mjs          # icon-grid (align=center/left/row)
│       ├── network-box.mjs        # network-box
│       ├── plan-grid.mjs          # plan-grid
│       ├── stat-grid.mjs          # stat-grid
│       ├── steps.mjs              # step-list / chapter-list
│       ├── summary-box.mjs        # summary-box / bottom-list(alias)
│       ├── tabs.mjs               # os-tabs
│       ├── takeaway.mjs           # takeaway-banner / summary-bar
│       └── tool-list.mjs          # tool-list / badge-grid
├── config/
│   ├── styles.json                # 테마 프리셋 11종 (폰트·색상·그라디언트, 스타일별 선택적 크기 오버라이드)
│   ├── pptdesign.config.json      # PPTX 레이아웃·폰트 크기 기본값 (JSONC, 수치 단일 출처)
│   ├── htmldesign.config.json     # HTML 폰트·크기 토큰 (JSONC, htmlSize guide/presentation 프로파일 + scale)
│   ├── font-aliases.json          # 폰트 alias → 실제 폰트명 매핑
│   ├── shortcode-guide.ts         # 숏코드 가이드 패널+삽입툴바 공용 데이터 (단일 출처, MarkdownCompiler가 import)
│   └── layout.json                # 슬라이드 레이아웃
├── md_src/                        # 마크다운 원본 소스
│   ├── claudeguide/               # Claude 가이드 문서
│   ├── guides/                    # AI 툴별 가이드 문서 (30+ 파일)
│   └── showcase/                  # 쇼케이스 예시
├── dist/                          # 변환 출력물 (git 제외)
├── public/                        # Vite dev 서버용 정적 자산
└── docs/
    ├── shortcode-reference.md     # 숏코드 레퍼런스 (25종 정식 + 13종 alias)
    ├── shortcode-changelog.md     # 변경 이력 (Phase 1~3)
    ├── scripts_guide.md           # 스크립트 API 및 아키텍처 해설
    ├── docs_index.md              # 문서 인덱스
    ├── guide.md                   # 사용자 가이드
    ├── plan/                      # 기획·설계 문서
    └── report/                    # 감사·패치 보고서
```

---

## 빌드 명령어

```bash
# 단일 MD → 가이드 HTML
node scripts/build-guide.mjs md_src/<폴더>/<파일>.md --out dist/<폴더>/<파일>.html

# 단일 MD → 횡슬라이드 HTML
node scripts/build-presentation.mjs md_src/<폴더>/<파일>.md --out dist/<폴더>/<파일>_slides.html

# 단일 MD → PPTX
node scripts/md-to-pptx.mjs md_src/<폴더>/<파일>.md --out dist/<폴더>/<파일>.pptx

# 폴더 전체 일괄 변환 (glob)
node scripts/md-to-pptx.mjs --all "md_src/guides/*.md"

# React UI 개발 서버 (Vite API 미들웨어 포함)
npm run dev

# Vite 프로덕션 빌드
npm run build

# 스탠드얼론 빌드
npm run build:standalone

# 테스트 실행
npm test             # vitest run (148개 — 정합성 85개 포함)
npm run test:watch   # watch 모드

# PPTX CLI 단축키
npm run pptx:md -- md_src/<폴더>/<파일>.md --out dist/<파일>.pptx
```

---

## 숏코드 시스템

### 기본 구문
```markdown
::: shortcode-type [인수...]
- field1: "값"
  field2: "값"
- field1: "다음 항목"
:::
```

### 공통 선택 인수 (모든 숏코드에서 사용 가능)

| 인수 | 형식 | 설명 |
|------|------|------|
| `title-size` | 숫자(비율) 또는 CSS값 (`0.9` / `1.2rem`) | 해당 블록 카드 제목 크기 오버라이드 |
| `desc-size` | 숫자(비율) 또는 CSS값 (`0.85` / `14px`) | 해당 블록 카드 설명 크기 오버라이드 |

비율 입력(단위 없는 숫자)은 기본값 대비 배율로 계산됩니다 (`0.9` = 기본의 90%).

### 정식 명칭 25종

| 카테고리 | 숏코드 |
|---------|-------|
| 콘텐츠 그리드 | `plan-grid`, `feature-grid`, `icon-grid`, `badge-grid`, `stat-grid`, `tool-list` |
| 비교 & 대조 | `compare-split`, `before-after`, `compare-grid`, `columns-grid` |
| 코드 & 터미널 | `editor-box`, `console-box`, `cmd-box` |
| 시각 자료 & 흐름 | `network-box`, `git-flow`, `workflow-flow`, `step-flow` |
| 정보 & 알림 | `alert-box`, `summary-box`, `takeaway-banner`, `part-banner`, `summary-bar` |
| 구조 & 내비게이션 | `step-list`, `faq-list`, `os-tabs`, `chapter-list`, `level-grid` |

### 하위 호환 alias (신규 문서 사용 비권장, 자동 처리됨)

| alias | 정식 명칭 | 비고 |
|-------|---------|------|
| `compare-grid` | `columns-grid` | Phase 2 통합 |
| `workflow-flow` | `step-flow` | Phase 2 통합 |
| `workflow-strip` | `step-flow` | Phase 2 통합 |
| `skill-list` | `icon-grid align=left` | Phase 2 통합 |
| `checkpoint-grid` | `icon-grid align=row` | Phase 2 통합 |
| `compare-diff` | `before-after` | Phase 2 개명 |
| `bottom-list` | `summary-box` | V1 호환 |
| `compare-before-after` | `before-after` | V1 호환 |
| `flow` | `step-flow` | V1 호환 |
| `git-flow-strip` | `git-flow` | V1 호환 |
| `part-deck` | `part-banner` | V1 호환 |
| `takeaway` | `takeaway-banner` | V1 호환 |
| `tool-box` | `tool-list` | V1 호환 |

### icon-grid align 옵션
```markdown
::: icon-grid align=center   # 기본 — 아이콘 중앙 카드형
::: icon-grid align=left     # 아이콘 좌측 배경박스 (구 skill-list)
::: icon-grid align=row      # 아이콘+텍스트 수평 (구 checkpoint-grid)
```

### 특수 내부 토큰
- `type: "arrow"` — `step-flow` 내부에서만 사용하는 방향 화살표 삽입 항목
- `slide-config` — 슬라이드 설정 전용 토큰

### PPTX 변환 지원 현황

| 숏코드 | HTML | PPTX |
|--------|------|------|
| plan-grid, feature-grid, icon-grid, badge-grid, stat-grid, tool-list | ✅ | ✅ |
| compare-split, compare-grid, columns-grid, workflow-flow | ✅ | ✅ |
| step-list, faq-list, os-tabs, chapter-list | ✅ | ✅ |
| alert-box, summary-box, takeaway-banner, part-banner, summary-bar | ✅ | ✅ |
| editor-box, console-box, cmd-box | ✅ | ✅ |
| before-after, network-box, git-flow, step-flow, level-grid | ✅ | ⚠️ 렌더러 없음 |

⚠️ PPTX 전용 렌더러 없음 — 변환 시 해당 슬라이드 제외됨.

---

## 폰트 설정

### Font Alias 시스템 (`config/font-aliases.json`)

`styles.json`, `pptdesign.config.json`, frontmatter에서 실제 폰트명 대신 **alias**를 사용합니다.  
`md-to-pptx.mjs`와 `pptx-browser.ts`의 `resolveFont()` 함수가 PPTX 생성 직전에 alias → 실제 폰트명으로 변환합니다.

```
styles.json: "pptxFont": "paperlogy-regular"
      ↓ resolveFont()
PPTX XML:  typeface="페이퍼로지 4 Regular"
```

alias에 없는 값은 그대로 폰트명으로 사용됩니다.

### 주요 alias 목록

| alias | 실제 폰트명 |
|-------|-----------|
| `paperlogy`, `paperlogy-regular` | 페이퍼로지 4 Regular |
| `paperlogy-semibold` | 페이퍼로지 6 SemiBold |
| `paperlogy-extrabold` | 페이퍼로지 8 ExtraBold |
| `pretendard` | Pretendard |
| `noto-sans` | Noto Sans KR |
| `noto-serif` | Noto Serif KR |
| `malgun` | 맑은 고딕 |
| `consolas` | Consolas |

> **주의**: 페이퍼로지는 한글명(`페이퍼로지 X 무게명`)으로 설치되어 있음.  
> 영문 `"Paperlogy X"` 로는 인식 안 됨 → 반드시 alias 또는 한글명 사용.

### 스타일 테마 목록 (`config/styles.json` — 11종)

| 키 | label | 계열 색상 | PPTX 폰트 |
|----|-------|---------|---------|
| `custom-blue` | 페이퍼로지 커스텀 블루 | #2789F5 | paperlogy-extrabold / paperlogy-regular |
| `ai-chat` | AI 챗봇 (그린) | #10A37F | pretendard |
| `ai-dev` | AI 개발 도구 (오렌지) | #D97757 | Consolas / Pretendard |
| `knowledge` | 노트 & 지식관리 (퍼플) | #6366F1 | noto-serif / noto-sans |
| `productivity` | 생산성 유틸 (블루) | #1565C0 | pretendard |
| `creative` | 크리에이티브 AI (마젠타) | #9B59B6 | paperlogy-extrabold / paperlogy-regular |
| `security` | 보안 & 인프라 (사이언) | #06B6D4 | pretendard |
| `finance` | 재테크 & 금융 (골드) | #D4A017 | noto-serif / noto-sans |
| `future` | 퓨처 AI (네온 라임) | #84CC16 | pretendard |
| `enterprise` | 엔터프라이즈 (슬레이트) | #475569 | pretendard |
| `media` | 미디어 & 콘텐츠 (로즈) | #E11D48 | pretendard |

각 테마는 `brand`, `brandDark`, `brandDeep`, `brandLight`, `brandMid`, `border`, `bg`, `heroGradient`, `webFont`, `webFontTitle`, `pptxFont`, `pptxFontTitle`, `pptxFontSubTitle` 키를 가집니다.

---

## 아키텍처 핵심 규칙

### Universal Schema (6대 표준 키)

모든 숏코드 항목은 내부적으로 다음 6개 표준 키로 정규화됩니다:

```
icon | title | desc | tag | meta | color
```

공유 모듈 `scripts/shortcode-render.mjs`의 `standardizeItem()`(HTML)과 `md-to-pptx.mjs`의 동명 함수(PPTX)가 이 변환을 담당합니다. 구형 키명(`name`, `description`, `tagline`, `features` 등)도 자동 매핑됩니다.

### HTML 렌더링 (2026-06-25 단일화 — Phase 5)
- **정본 공유 모듈**: `scripts/shortcode-render.mjs` (파서+렌더러, 순수 함수·marked만 의존) + `scripts/shortcode-styles.mjs` (컴포넌트 CSS, `var(--*)` 기반 테마 독립). ※ 과거의 "build-guide.mjs 단일 파일" 구조는 이 모듈로 추출됨.
- **세 HTML 출력이 모두 이 공유 모듈을 사용**: `build-guide.mjs`(가이드)·`build-presentation.mjs`(슬라이드)·`src/lib/client-compiler.ts`(미리보기/standalone). 한 곳을 고치면 3개 출력에 동시 반영 → 드리프트 차단.
- 함수 `renderShortcode(type, body, args)` — 색상은 `var(--brand)` 등 CSS 변수로 반환하므로 스타일 객체 불필요.
- 각 셸(shell)은 페이지 골격 CSS + `:root` 테마 변수(`--card-bg`, `--text-2/3`, `--size-*` 등)만 자기 테마/프로파일로 정의하고 `${SHORTCODE_CSS}`를 포함한다. 카드 배경은 `var(--card-bg, #fff)` — guide=라이트, presentation/client=다크.
- **수정 시 규칙**: `shortcode-render.mjs`/`shortcode-styles.mjs`/`client-compiler.ts` 변경 후 → `npm run build:standalone` (정합성 테스트 게이트 후 standalone 재빌드). 빠른 재빌드만 필요하면 `build:standalone:fast`.
- **정합성 테스트**: `src/__tests__/shortcode-conformance.test.ts` — showcase 숏코드가 공유 HTML 렌더러 + PPTX 레지스트리 양쪽에서 누락·에러 없이 처리되는지 검증(드리프트 가드). `build:standalone`이 이 테스트를 먼저 실행.

### 폰트 크기 — config 단일 출처 (Phase 5)

HTML `:root`의 `--size-*` 변수는 **`config/htmldesign.config.json`의 `htmlSize.{guide,presentation}`에서 로드**됩니다(3개 셸 공통, 하드코딩 금지 — 규칙 1 참조). 전역 변경은 이 config 한 곳만 수정. 새 숏코드 카드 폰트는 반드시 변수를 사용합니다.
```css
/* ✅ 올바름 */  .new-card-title { font-size: var(--size-card-title); }
/* ❌ 금지: 하드코딩 */  .new-card-title { font-size: 1.0rem; }
```

### PPTX 렌더링

- **모듈 분리**: `pptx-renderers/` 디렉토리의 숏코드별 `.mjs` 파일
- `registry.mjs`가 타입 → 모듈 맵핑 관리 및 공통 `helpers` 객체 export
- 각 모듈은 `export const type` (문자열 또는 문자열 배열), `estimateHeight()`, `render()` 필수 구현
- **브라우저 포트**: `src/lib/pptx-browser.ts` — 같은 `pptxRegistry`를 import하여 브라우저에서 PPTX 생성

### Vite API 미들웨어 (`scripts/vite-api-plugin.ts`)

개발 서버에서만 활성화되는 4개 API 엔드포인트:

| 엔드포인트 | 역할 |
|-----------|------|
| `GET /api/list-styles` | `config/styles.json` 스타일 목록 반환 |
| `POST /api/save-styles` | 스타일 설정 저장 (스키마 검증 포함) |
| `POST /api/preview` | 마크다운 → HTML 실시간 미리보기 컴파일 |
| `POST /api/save-generate` | 최종 저장 + 3종 출력물(HTML·슬라이드·PPTX) 동시 빌드 |

### 주의: 모듈 제거 시 alias 체크

`compare-grid.mjs`는 `compare-grid` 외에 `level-grid`, `part-banner`, `part-deck` 타입도 담당.  
`columns.mjs`가 `compare-grid`를 흡수했지만 `compare-grid.mjs`는 반드시 유지 (나머지 3종 처리).

---

## 마크다운 frontmatter 키

```yaml
---
title: "문서 제목"
subtitle: "부제목"
style: "custom-blue"     # styles.json 키 (11종 중 선택)
logo: "🤖"               # 표지 이모지
badge: "배지 텍스트"
titleSize: 22            # PPTX 제목 폰트 크기
bodySize: 12             # PPTX 본문 폰트 크기
stats:
  - value: "숫자"
    label: "설명"
done:
  title: "마무리 슬라이드 제목"
  subtitle: "마무리 부제목"
---
```

---

## 테스트

```bash
npm test          # vitest run (src/__tests__/ 하위 전체)
npm run test:watch
```

- `client-compiler.test.ts`: `clientCompileMarkdown()` HTML 출력 구조, 숏코드 렌더링, FALLBACK_STYLES 유효성
- `shortcode-conformance.test.ts`: 정합성 가드 85개 — 공유 HTML 렌더러 + PPTX 레지스트리 커버리지 + standalone `:::` 잔존 검사
- `pptx-analyzer.test.ts`: PPTX XML 분석기 유닛 테스트
- `wcag.test.ts`: `getContrast()`, `getLuminance()` 계산 검증 (전체 148개)

---

## 주요 이슈 이력

| 이슈 | 원인 | 해결 |
|------|------|------|
| PPTX 한글 깨짐 | styles.json에 "Paperlogy X" 영문명 사용 (미인식) | `페이퍼로지 X 무게명` 한글명으로 수정 or alias 사용 |
| level-grid PPTX 경고 | compare-grid.mjs 제거 시 level-grid 렌더러도 삭제됨 | compare-grid.mjs type 배열에서 compare-grid만 제거 후 registry 복원 |
| workflow-flow 슬라이드 카드 작음 | wf-step flex: 0 1 auto → 카드가 확장 안 됨 | flex: 1로 변경, 화살표를 flex 형제 아이템으로 분리 |
| 숏코드 통합 | 유사 디자인 중복 (29→25종) | compare-grid→alias, workflow-flow→alias, skill-list/checkpoint-grid→icon-grid align 흡수 |
| `getBody()` TDZ ReferenceError | vite-api-plugin.ts에서 헬퍼 함수가 사용 지점 이후에 정의됨 | 헬퍼 함수를 라우트 핸들러보다 앞으로 이동 |
| 커맨드 인젝션 취약점 | `style`, `filename`, `format` 파라미터가 검증 없이 셸 명령어에 삽입됨 | `validateStyleKeyword`, `validateFilename`, `validateFormat` 검증 함수 추가 |
| `\n` 치환 버그 | `\\n` 리터럴이 실제 줄바꿈으로 변환 안 됨 | `standardizeItem()`에서 `.replace(/\\n/g, "\n")` 처리 |
| 숏코드 카드 폰트 크기 불일치 | 숏코드별 하드코딩 rem 혼재 (0.82~1.3rem) | `--size-card-title`/`--size-card-p` CSS 변수로 통일 → 이후 config(htmlSize)로 외부화(Phase 5) |
| dist/module2.html 프리뷰 전체 깨짐 (2026-06-25) | client-compiler.ts 렌더러/CSS 추가 후 standalone 미재빌드 → 구버전 번들 잔존 | `npm run build:standalone` 재실행 (현재는 정합성 테스트 게이트 포함) |
| MarkdownCompiler 초기 MD → showcase.md 교체 (2026-06-25) | 하드코딩 템플릿 → `showcaseMd` import | 재빌드로 해결. showcase.md = 25종 전체 레퍼런스 |
| PPTX 폰트 크기 config 수정 미반영 (2026-06-25) | ① styles.json custom-blue가 pptdesign 덮어씀 ② 렌더러 28곳 하드코딩 | custom-blue 오버라이드 제거 / 28곳 config 참조 / 숏코드 `title-size=`·`desc-size=` PPTX 추가. 상세: docs/report/pipeline_divergence_analysis_2026-06-25.md |
| HTML 렌더러 3벌 드리프트 (2026-06-25, Phase 5) | build-guide/presentation/client 렌더러·CSS 중복 | `shortcode-render.mjs`/`shortcode-styles.mjs` 공유 모듈로 통합 + 정합성 테스트 게이트 |

### 크기 수치 설정 규칙 (P2 — 상세, 규칙 1 보충)
- **모든 폰트/크기 수치는 매체별 config json에 둔다**: PPTX=`pptdesign.config.json`, HTML=`htmldesign.config.json`. 렌더러 코드에 폰트 크기 리터럴 금지.
- **캐스케이드 우선순위**: `config 기본 → styles.json(스타일별 선택 오버라이드) → frontmatter(문서) → 숏코드 블록 인자`. 뒤로 갈수록 우선.
- styles.json의 titleSize/bodySize는 **선택적 오버라이드**(색·폰트와 동일 패턴). 없으면 config 기본 사용.
