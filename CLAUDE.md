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

- **Frontend**: React + TypeScript + Vite + shadcn/ui
- **빌드 파이프라인**: Node.js ESM 스크립트 (pptxgenjs 4.x, marked, gray-matter)
- **스타일**: Tailwind CSS

---

## 디렉토리 구조

```
cs_v2/
├── src/
│   └── components/
│       ├── MarkdownCompiler.tsx   # 메인 에디터 UI (숏코드 툴바 포함)
│       ├── PptxAnalyzer.tsx       # PPTX 분석기
│       ├── PptxInspectorSuite.tsx # PPTX 인스펙터 & 리매퍼
│       ├── VisualAdjuster.tsx     # 테마 빌더
│       └── SubUtilities.tsx       # 보조 유틸
├── scripts/
│   ├── build-guide.mjs            # MD → 가이드 HTML 변환 (단일 파일, 모든 숏코드 포함)
│   ├── build-presentation.mjs     # MD → 횡슬라이드 HTML 변환
│   ├── md-to-pptx.mjs             # MD → PPTX 변환 (CLI)
│   ├── build-publish.mjs          # 배포용 빌드
│   └── pptx-renderers/            # PPTX 숏코드별 렌더러 모듈
│       ├── registry.mjs           # 렌더러 등록 테이블
│       ├── flow.mjs               # step-flow / workflow-flow / workflow-strip
│       ├── columns.mjs            # columns-grid / compare-grid (alias)
│       ├── compare-grid.mjs       # level-grid / part-banner / part-deck
│       └── ...                    # 나머지 숏코드별 모듈
├── config/
│   ├── styles.json                # 테마 프리셋 (폰트·색상)
│   ├── pptdesign.config.json      # PPTX 레이아웃·폰트 크기 기본값
│   ├── htmldesign.config.json     # HTML 폰트·크기 토큰 (guide/presentation 프로파일)
│   ├── shortcode-guide.ts         # 숏코드 가이드 패널+삽입툴바 공용 데이터 (단일 출처, MarkdownCompiler가 import)
│   └── layout.json                # 슬라이드 레이아웃
├── md_src/                        # 마크다운 원본 소스
├── dist/                          # 변환 출력물 (git 제외)
├── public/                        # Vite dev 서버용 정적 자산
└── docs/
    ├── shortcode-reference.md     # 숏코드 레퍼런스 (25종 정식 + 13종 alias)
    └── shortcode-changelog.md     # creative-spark → cs_v2 변경 이력
```

---

## 빌드 명령어

```bash
# 단일 MD → HTML
node scripts/build-guide.mjs md_src/<폴더>/<파일>.md --out dist/<폴더>/<파일>.html

# 단일 MD → 횡슬라이드 HTML
node scripts/build-presentation.mjs md_src/<폴더>/<파일>.md --out dist/<폴더>/<파일>_slides.html

# 단일 MD → PPTX
node scripts/md-to-pptx.mjs md_src/<폴더>/<파일>.md --out dist/<폴더>/<파일>.pptx

# 폴더 전체 일괄 변환 예시 (claudeguide 기준)
node scripts/build-guide.mjs "md_src/claudeguide/ai-tools-guide.md" --out dist/claudeguide/
node scripts/md-to-pptx.mjs --all "md_src/claudeguide/*.md"

# React UI 개발 서버
npm run dev

# Vite 빌드
npm run build
```

---

## 숏코드 시스템

### 구문
```markdown
::: shortcode-type args
- key: value
  key2: value2
:::
```

### 정식 명칭 25종

| 카테고리 | 숏코드 |
|---------|-------|
| 비교 & 대조 | `compare-split`, `before-after`, `columns-grid` |
| 코드 & 터미널 | `editor-box`, `console-box`, `cmd-box` |
| 시각 자료 & 흐름 | `network-box`, `git-flow`, `step-flow` |
| 콘텐츠 그리드 | `icon-grid`, `feature-grid`, `tool-list`, `plan-grid`, `badge-grid`, `stat-grid` |
| 정보 & 알림 | `alert-box`, `summary-box`, `takeaway-banner`, `part-banner`, `summary-bar` |
| 구조 & 내비게이션 | `step-list`, `faq-list`, `os-tabs`, `chapter-list`, `level-grid` |

### 주요 alias (코드에서 처리, 신규 문서 사용 비권장)

| alias | 정식 명칭 |
|-------|---------|
| `compare-grid` | `columns-grid` |
| `workflow-flow`, `workflow-strip` | `step-flow` |
| `skill-list` | `icon-grid align=left` |
| `checkpoint-grid` | `icon-grid align=row` |
| `compare-diff` | `before-after` |
| `bottom-list` | `summary-box` |
| `flow` | `step-flow` |

### icon-grid align 옵션
```markdown
::: icon-grid align=center   # 기본 — 아이콘 중앙 카드형
::: icon-grid align=left     # 아이콘 좌측 배경박스 (구 skill-list)
::: icon-grid align=row      # 아이콘+텍스트 수평 (구 checkpoint-grid)
```

---

## 폰트 설정

### Font Alias 시스템 (`config/font-aliases.json`)

`styles.json`, `pptdesign.config.json`, frontmatter 에서 실제 폰트명 대신 **alias**를 사용합니다.  
`md-to-pptx.mjs`의 `resolveFont()` 함수가 PPTX 생성 직전에 alias → 실제 폰트명으로 변환합니다.

```
styles.json: "pptxFont": "paperlogy-regular"
      ↓ resolveFont()
PPTX XML:  typeface="페이퍼로지 4 Regular"
```

alias에 없는 값은 그대로 폰트명으로 사용됩니다 (기존 직접 입력도 호환).

### 주요 alias 목록

| alias | 실제 폰트명 |
|-------|-----------|
| `paperlogy` | 페이퍼로지 4 Regular |
| `paperlogy-regular` | 페이퍼로지 4 Regular |
| `paperlogy-semibold` | 페이퍼로지 6 SemiBold |
| `paperlogy-extrabold` | 페이퍼로지 8 ExtraBold |
| `pretendard` | Pretendard |
| `noto-sans` | Noto Sans KR |
| `noto-serif` | Noto Serif KR |
| `malgun` | 맑은 고딕 |
| `consolas` | Consolas |

> **주의**: 페이퍼로지는 한글명(`페이퍼로지 X 무게명`)으로 설치되어 있음.  
> 영문 `"Paperlogy X"` 로는 인식 안 됨 → 반드시 alias 또는 한글명 사용.

### 스타일 키 → alias 매핑
| 스타일 키 | body | title | subtitle |
|----------|------|-------|----------|
| `custom-blue`, `creative` | `paperlogy-regular` | `paperlogy-extrabold` | `paperlogy-semibold` |
| `knowledge`, `finance` | `noto-serif` | `noto-serif` | `noto-sans` |
| 나머지 | `pretendard` | `pretendard` | `pretendard` |
| 기본값 (`pptdesign.config.json`) | `malgun` | `malgun` | `malgun` |

---

## 아키텍처 핵심 규칙

### HTML 렌더링 (2026-06-25 단일화 — Phase 3)
- **정본 공유 모듈**: `scripts/shortcode-render.mjs` (파서+렌더러, 순수 함수·marked만 의존) + `scripts/shortcode-styles.mjs` (컴포넌트 CSS, `var(--*)` 기반 테마 독립)
- **세 HTML 출력이 모두 이 공유 모듈을 사용**: `build-guide.mjs`(가이드)·`build-presentation.mjs`(슬라이드)·`src/lib/client-compiler.ts`(미리보기/standalone). 한 곳을 고치면 3개 출력에 동시 반영 → 드리프트 차단.
- 함수 `renderShortcode(type, body, args)` — 색상은 `var(--brand)` 등 CSS 변수로 반환하므로 스타일 객체 불필요.
- 각 셸(shell)은 페이지 골격 CSS + `:root` 테마 변수(`--card-bg`, `--text-2/3`, `--size-*` 등)만 자기 테마/프로파일로 정의하고 `${SHORTCODE_CSS}`를 포함한다. 카드 배경은 `var(--card-bg, #fff)` — guide=라이트, presentation/client=다크.
- **수정 시 규칙**: `shortcode-render.mjs`/`shortcode-styles.mjs`/`client-compiler.ts` 변경 후 → `npm run build:standalone` (정합성 테스트 게이트 후 standalone 재빌드). 빠른 재빌드만 필요하면 `build:standalone:fast`.
- **정합성 테스트**: `src/__tests__/shortcode-conformance.test.ts` — showcase 숏코드가 공유 HTML 렌더러 + PPTX 레지스트리 양쪽에서 누락·에러 없이 처리되는지 검증(드리프트 가드). `build:standalone`이 이 테스트를 먼저 실행.

### PPTX 렌더링
- **모듈 분리**: `pptx-renderers/` 디렉토리의 숏코드별 `.mjs` 파일
- `registry.mjs`가 타입 → 모듈 맵핑 관리
- 각 모듈은 `export const type`, `estimateHeight()`, `render()` 필수 구현

### 주의: 모듈 제거 시 alias 체크
`compare-grid.mjs`는 `compare-grid` 외에 `level-grid`, `part-banner`, `part-deck` 타입도 담당.  
`columns.mjs`가 `compare-grid`를 흡수했지만 `compare-grid.mjs`는 반드시 유지 (나머지 3종 처리).

---

## 마크다운 frontmatter 키

```yaml
---
title: "문서 제목"
subtitle: "부제목"
style: "custom-blue"     # styles.json 키
logo: "🤖"               # 표지 이모지
badge: "배지 텍스트"
titleSize: 22
bodySize: 12
stats:
  - value: "숫자"
    label: "설명"
done:
  title: "마무리 슬라이드 제목"
  subtitle: "마무리 부제목"
---
```

---

## 주요 이슈 이력

| 이슈 | 원인 | 해결 |
|------|------|------|
| PPTX 한글 깨짐 | styles.json에 "Paperlogy X" 영문명 사용 (미인식) | `페이퍼로지 X 무게명` 한글명으로 수정 |
| level-grid PPTX 경고 | compare-grid.mjs 제거 시 level-grid 렌더러도 삭제됨 | compare-grid.mjs type 배열에서 compare-grid만 제거 후 registry 복원 |
| workflow-flow 슬라이드 카드 작음 | wf-step flex: 0 1 auto → 카드가 확장 안 됨 | flex: 1로 변경, 화살표를 flex 형제 아이템으로 분리 |
| 숏코드 29→25 통합 | 유사 디자인 중복 | compare-grid→alias, workflow-flow→alias, skill-list/checkpoint-grid→icon-grid align 흡수 |
| dist/module2.html 프리뷰 전체 깨짐 (2026-06-25) | `client-compiler.ts`에 새 숏코드 렌더러(skill-item, before-after, network-box, faq-list, os-tabs 등) + CSS 대거 추가 후 standalone 미재빌드 → 번들에 구버전 컴파일러 잔존 | `npm run build:standalone` 재실행. **규칙: client-compiler.ts 수정 후 반드시 재빌드** |
| MarkdownCompiler 초기 MD → showcase.md로 교체 (2026-06-25) | 기존 하드코딩 템플릿 → `showcaseMd` import로 변경. 위 재빌드 전까지 showcase 숏코드들이 CSS 없이 렌더링됨 | 재빌드로 해결. showcase.md는 25종 전체 숏코드 레퍼런스로 사용 |
| PPTX 폰트 크기 config 수정 미반영 (2026-06-25, Phase 1·2) | ① styles.json `custom-blue`에 titleSize14/bodySize11이 박혀 pptdesign.config.json을 덮어씀 ② 렌더러 28곳이 fontSize 하드코딩 | custom-blue 크기 오버라이드 제거(→config 기본 16/13 폴백, 오버라이드 메커니즘은 유지) / 28곳을 config 참조로 전환 / pptdesign.config.json에 컴포넌트별 폰트 키 신설 / PPTX에도 숏코드 `title-size=`/`desc-size=` 인자 추가(HTML 대칭). **상세: docs/report/pipeline_divergence_analysis_2026-06-25.md** |

### 크기 수치 설정 규칙 (P2 — 2026-06-25 확정)
- **모든 폰트/크기 수치는 매체별 config json에 둔다**: PPTX=`pptdesign.config.json`, HTML=`htmldesign.config.json`. 렌더러 코드에 폰트 크기 리터럴 금지.
- **캐스케이드 우선순위**: `config 기본 → styles.json(스타일별 선택 오버라이드) → frontmatter(문서) → 숏코드 블록 인자`. 뒤로 갈수록 우선.
- styles.json의 titleSize/bodySize는 **선택적 오버라이드**(색·폰트와 동일 패턴). 없으면 config 기본 사용.
