# Creative Spark V2 — Claude 작업 컨텍스트

## 프로젝트 개요

마크다운(`.md`) 원본을 **가이드 HTML · 횡슬라이드 HTML · PPTX** 세 포맷으로 자동 변환하는 저작 파이프라인 + React UI.  
원본 프로젝트: `c:\ai\creative-spark` (이식 및 확장 완료)

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
│   │   ├── client-compiler.test.ts # 브라우저 컴파일러 유닛 테스트 (63개)
│   │   ├── pptx-analyzer.test.ts  # PPTX 분석기 테스트
│   │   └── wcag.test.ts           # WCAG 유틸 테스트
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
│   ├── build-guide.mjs            # MD → 가이드 HTML 변환 (단일 파일, 모든 숏코드 포함)
│   ├── build-presentation.mjs     # MD → 횡슬라이드 HTML 변환
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
│   ├── styles.json                # 테마 프리셋 11종 (폰트·색상·그라디언트)
│   ├── pptdesign.config.json      # PPTX 레이아웃 기본값 (JSONC)
│   ├── htmldesign.config.json     # HTML 레이아웃 기본값 (JSONC, scale 포함)
│   ├── layout.json                # 슬라이드 레이아웃
│   └── font-aliases.json          # 폰트 alias → 실제 폰트명 매핑
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
npm test             # vitest run (63개 유닛 테스트)
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

`build-guide.mjs`와 `md-to-pptx.mjs` 양쪽의 `standardizeItem()` 함수가 이 변환을 담당합니다. 구형 키명(`name`, `description`, `tagline`, `features` 등)도 자동 매핑됩니다.

### HTML 렌더링

- **단일 파일**: `scripts/build-guide.mjs` 안에 모든 숏코드 렌더러가 함께 있음
- 함수 `renderShortcode(type, args, items)` 가 모든 숏코드를 처리
- CSS도 동일 파일 내 인라인 삽입 (스탠드얼론 배포 지원)
- **브라우저 포트**: `src/lib/client-compiler.ts` — Vite 환경에서 서버 없이 실행되는 동일 로직

### 폰트 크기 CSS 변수 시스템 (Phase 3 도입)

`build-guide.mjs`가 생성하는 HTML의 `:root` 블록 변수로 카드 폰트 크기를 전역 제어합니다:

```css
:root {
  --font-scale: 1.0;            /* config/htmldesign.config.json의 scale 값 */
  --size-card-title: 1.15rem;   /* 모든 숏코드 카드 제목 */
  --size-card-p:     0.92rem;   /* 모든 숏코드 카드 설명/본문 */
  --size-stat-val:   2.4rem;    /* stat-grid 수치 */
  --size-stat-name:  1.1rem;    /* stat-grid 라벨 */
  --size-stat-note:  0.8rem;    /* stat-grid 노트 */
}
```

**새 숏코드 추가 시 규칙**: 카드 내 폰트에는 반드시 변수를 사용합니다.
```css
/* ✅ 올바름 */
.new-card-title { font-size: var(--size-card-title); }
.new-card-desc  { font-size: var(--size-card-p); }
/* ❌ 금지: 하드코딩 */
.new-card-title { font-size: 1.0rem; }
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

- `client-compiler.test.ts`: `clientCompileMarkdown()` HTML 출력 구조, 숏코드 렌더링, FALLBACK_STYLES 유효성 (63개 테스트)
- `pptx-analyzer.test.ts`: PPTX XML 분석기 유닛 테스트
- `wcag.test.ts`: `getContrast()`, `getLuminance()` 계산 검증

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
| 숏코드 카드 폰트 크기 불일치 | 숏코드별 하드코딩 rem 혼재 (0.82~1.3rem) | Phase 3: `--size-card-title` / `--size-card-p` CSS 변수 시스템으로 통일 |
| `\n` 치환 버그 | `\\n` 리터럴이 실제 줄바꿈으로 변환 안 됨 | `standardizeItem()`에서 `.replace(/\\n/g, "\n")` 처리 |
