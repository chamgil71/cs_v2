# Creative Spark V2 — Claude 작업 컨텍스트

## 프로젝트 개요

마크다운(`.md`) 원본을 **가이드 HTML · 횡슬라이드 HTML · PPTX** 세 포맷으로 자동 변환하는 저작 파이프라인 + React UI.  
원본 프로젝트: `c:\ai\creative-spark` (이식 및 확장 완료)

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
│   ├── pptdesign.config.json      # PPTX 레이아웃 기본값
│   ├── htmldesign.config.json     # HTML 레이아웃 기본값
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

### HTML 렌더링
- **단일 파일**: `scripts/build-guide.mjs` 안에 모든 숏코드 렌더러가 함께 있음
- 함수 `renderShortcode(type, args, items)` 가 모든 숏코드를 처리
- CSS도 동일 파일 내 인라인 삽입 (스탠드얼론 배포 지원)

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
