@AGENTS.md

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
| 숏코드 HTML 렌더링 | `scripts/shortcode-render.mjs` (정본 단일 모듈) + 기능 이름 배치 `scripts/shortcode-ext/*`(그 모듈이 부름) | build-guide/presentation/client 에 각각 렌더러 중복 ❌ |
| 배치 인수 기본값(grow·emphasis·badge·connector…) | 카탈로그 `args.default` → `library-map.mjs` `defaults` → `layoutArgs()` | 렌더러에 `grow \|\| 1.35` 같은 기본 수치 ❌ |
| 숏코드 컴포넌트 CSS | `scripts/shortcode-styles.mjs` (`var(--*)` 기반) | 셸마다 컴포넌트 CSS 따로 작성 ❌ |
| 숏코드 가이드/삽입 스니펫 | `config/shortcode-guide.ts` (단일 출처) | 가이드패널·insertShortcode 에 스니펫 중복 ❌ |
| 배치 이름·그룹·별칭·색 이름 | `config/library/layouts.json` (공용 카탈로그 복사본 → `scripts/library-map.mjs` 생성본, 해석은 `scripts/library-names.mjs`) | 렌더러/메뉴에 `"main"→brand` 같은 색 이름 표·그룹 라벨 직접 작성 ❌ (pptgen 과 어긋남) |
| 카드 서식(외곽선·그림자·둥글기·보조 카드색) | `config/library/shape-sets.json` → `scripts/shape-set.mjs` | CSS 에 `border: 1px solid`·`box-shadow` 를 변수 없이 새로 추가 ❌, PPTX 카드에 `line:{color:pal.border,width:0.75}` 직접 작성 ❌ → `helpers.cardBox()` ✅ |

- **크기 캐스케이드 우선순위**: `config 기본 → styles.json(스타일별 선택) → frontmatter(문서) → 숏코드 블록 인자(title-size=/desc-size=)`. 뒤로 갈수록 우선.
- 새 수치가 필요하면 **먼저 적절한 config 파일에 키를 추가**하고 코드는 그 키를 읽는다. 부득이한 폴백 리터럴은 `D.x?.y ?? 기본값` 형태로만 허용.
- 같은 로직/데이터가 2곳 이상에 생기려 하면 **단일 모듈로 추출**한다 (렌더러 4벌 드리프트 재발 방지).

### 규칙 2. 종료 전 문서화 확인 (Definition of Done)
작업(기능 추가·구조 변경·버그 수정)을 **끝내기 전 반드시** 아래를 점검하고, 영향받은 문서를 현행화한다.

- [ ] **CLAUDE.md** — 아키텍처/규칙/이슈 이력에 영향이 있으면 갱신 (특히 「주요 이슈 이력」 표)
- [ ] **README.md** — 폴더 구조·스크립트·기능 설명에 변경이 있으면 갱신 (숏코드 개수 등 수치 표기 포함)
- [ ] **docs/** — `scripts_guide.md`(개발자), `guide.md`(사용자), `shortcode-reference.md`, `shortcode-changelog.md`(변경이력 **추가**) 중 해당 문서 갱신
- [ ] **정합성 테스트** — 숏코드/렌더러 변경 시 `npm test` (정합성 130건·카탈로그 151건·배치 인수 54건·배치 라이브러리 72건 포함) 통과 확인
- [ ] 시점 기록 문서(`docs/report/*_YYYY-MM-DD.md`)는 **수정하지 말고 새 항목/새 파일로 추가** (역사 보존)

> 문서화는 작업의 일부다. "코드만 고치고 문서는 나중에"는 이 프로젝트의 반복 이슈(드리프트)의 원인이므로 금지.

---

## 주요 기술 스택

- **Frontend**: React 18 + TypeScript + Vite 8 + shadcn/ui (라우팅: `react-router-dom`, TanStack Router/Start 미사용)
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
│   │   ├── PptxInspectorSuite.tsx # PPTX 인스펙터 & 리매퍼 (구 PptxAnalyzer.tsx 후속본)
│   │   ├── VisualAdjuster.tsx     # 테마 빌더 (styles.json 실시간 편집)
│   │   ├── DesignSystemSuite.tsx  # 모듈 1 셸 — 테마 조율 / 보조 유틸리티 / 배치 라이브러리 서브탭
│   │   ├── layout-library/        # 배치 라이브러리 화면(LayoutLibrary·List·Preview·Detail) — 공용 카탈로그 66종, 예시를 코어로 미리보기
│   │   ├── SubUtilities.tsx       # 보조 유틸 (파일 변환 도구 모음)
│   │   └── ErrorBoundary.tsx      # React 에러 경계
│   ├── lib/
│   │   ├── client-compiler.ts     # 브라우저 컴파일러 — guide-core/presentation-core 에 위임(자체 렌더러 없음, standalone==server)
│   │   ├── pptx-browser.ts        # 브라우저 전용 MD→PPTX (md-to-pptx.mjs 포트)
│   │   ├── layout-library.ts      # 배치 라이브러리 데이터(카탈로그 → 화면 항목·스니펫·미리보기 md, 구현 상태 요약)
│   │   ├── exportGuide.ts         # 가이드 HTML 내보내기 헬퍼
│   │   ├── wcag.ts                # WCAG 색상 대비 계산 유틸
│   │   └── utils.ts               # clsx/tailwind 유틸
│   ├── __tests__/                 # 전체 482개 (아래 8개 파일 합산)
│   │   ├── layout-ext.test.ts     # 기능 이름 배치 전용 HTML·배치 인수·tag: alt·브라우저 PPTX 노트 (54개)
│   │   ├── layout-library.test.ts # 배치 라이브러리 데이터 — 카탈로그 66종 그대로, 예시가 가이드·슬라이드로 그려짐 (72개)
│   │   ├── library-catalog.test.ts # 공용 배치 카탈로그 연결 (151개) — 기능 이름 66종 HTML·PPTX 커버리지, 옛 이름 = 기능 이름+인수 출력 동일, md_src 옛 이름 0, 생성본==복사본, 서식 세트, 선 없음 표기
│   │   ├── client-compiler.test.ts # 브라우저 컴파일러 유닛 테스트 (24개)
│   │   ├── shortcode-conformance.test.ts # 정합성 130개(기능 이름 기준) — 공유 렌더러+PPTX 커버리지 + CSS 커버리지 가드 + standalone==server 동치 잠금
│   │   ├── pptx-analyzer.test.ts  # PPTX 분석기 테스트 (23개)
│   │   ├── pptx-transform.test.ts # PPTX 왕복 변환 테스트 (10개)
│   │   └── wcag.test.ts           # WCAG 유틸 테스트 (18개)
│   ├── standalone/                # 웹앱(모듈 1/2/3) standalone 빌드용 엔트리
│   │   ├── design-system-main.tsx    # 모듈 1 진입점
│   │   ├── guide-authoring-main.tsx  # 모듈 2 진입점
│   │   └── pptx-inspector-main.tsx   # 모듈 3 진입점
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── components/ui/             # shadcn/ui 컴포넌트 (accordion~tooltip)
│   ├── main.tsx
│   └── index.css
├── scripts/
│   ├── shortcode-render.mjs       # [정본] 숏코드 → HTML 파서+렌더러 (guide-core 공유, 순수 함수)
│   ├── shortcode-ext/             # [정본] 기능 이름 배치 HTML(예전 "근사" 36종: 계단·기둥·게이지·회사 패턴 상자…) + CSS — index.mjs 가 렌더러·CSS 를 묶어 shortcode-render/styles 에 넘김(그룹별 파일, 각 200줄 이하)
│   ├── shortcode-styles.mjs       # [정본] 숏코드 컴포넌트 CSS (var(--*) 테마 독립)
│   ├── guide-core.mjs             # [정본 코어] MD 문서 → 가이드 HTML (fs/path 비의존). build-guide CLI + client html 모드 공유
│   ├── presentation-core.mjs      # [정본 코어] MD 문서 → 횡슬라이드 HTML (fs/path 비의존, 숏코드는 shortcode-render/styles 공유). build-presentation CLI + client presentation 모드 공유
│   ├── build-guide.mjs            # MD → 가이드 HTML (얇은 CLI 래퍼: 파일읽기+config로드+코어호출)
│   ├── build-presentation.mjs     # MD → 횡슬라이드 HTML (얇은 CLI 래퍼: 파일읽기+config로드+코어호출)
│   ├── md-to-pptx.mjs             # MD → PPTX 변환 CLI (Universal Schema 기반)
│   ├── library-names.mjs          # [단일 출처] 공용 배치 카탈로그 이름 해석(기능 이름·별칭→숏코드)·::: 블록 정규식·제목 속성 제거·색 이름
│   ├── shape-set.mjs              # [단일 출처] 서식 세트 → HTML CSS 변수 / PPTX 카드 서식(pal.shape → helpers.cardBox)
│   ├── library-map.mjs            # [자동 생성 — 손으로 고치지 않음] config/library 카탈로그의 import 용 생성본
│   ├── sync-library.mjs           # 공용 카탈로그 원본(coding/_templates/slide-library/catalog) → config/library 복사 + library-map 생성
│   ├── migrate-names.mjs          # md 의 옛 배치 이름 → 기능 이름 + 인수 (npm run migrate:names, --check)
│   ├── build-publish.mjs          # md_src 전체 폴더를 public/에 일괄 빌드하는 독립 유틸(더 이상 GUI에서 호출되지 않음 — 2026-09-02부터 웹 GUI의 "가이드 컬렉션에 저장" 옵션은 build-folder.mjs를 씀. 수동 실행은 여전히 가능)
│   ├── build-standalone.mjs       # 스탠드얼론 빌드 (npm run build:standalone)
│   ├── build-guide-hub.mjs        # md_src/<dir> 전체를 사이드바+Shadow DOM onepage 단일 HTML로 병합 (npm run build:onepage)
│   ├── build-folder.mjs           # 폴더 하나를 선택해 개별 3종(html/presentation/pptx)+폴더 index.html+onepage+통합덱까지 한 번에 오케스트레이션 (기존 스크립트들을 순차 호출, npm run build:folder)
│   ├── hub-config.mjs             # md_src/<dir>/hub.config.json 로더 — 카테고리 라벨·순서·사이드바 기본 상태·기본 산출물 옵션의 단일 출처
│   ├── spec-parser.js             # 숏코드 사양 파서 (레퍼런스 동기화용)
│   ├── sync-guides-index.mjs      # md_src 가이드 인덱스 동기화 (src/data/guides.json 생성)
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
│   ├── shortcode-guide.ts         # 숏코드 가이드 패널+삽입툴바 공용 데이터 (단일 출처, MarkdownCompiler가 import — 분류·기능 이름은 카탈로그에서)
│   ├── library/                   # 공용 배치 카탈로그 복사본 — layouts.json(배치 66종·그룹·색 이름) + shape-sets.json(서식 세트 6종). pptgen 과 같은 규칙. README.md 참조
│   └── layout.json                # 슬라이드 레이아웃
├── md_src/                        # 마크다운 원본 소스
│   ├── claudeguide/               # Claude 가이드 문서
│   ├── guides/                    # AI 툴별 가이드 문서 (30+ 파일)
│   └── showcase/                  # 쇼케이스 예시
├── dist/                          # 변환 출력물 (git 제외)
├── public/                        # Vite dev 서버용 정적 자산
└── docs/
    ├── shortcode-reference.md     # 숏코드 레퍼런스 (기능 이름 28종, 카탈로그 그룹 순서 + 옛 이름 표)
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

# 폴더 전체 → 횡형 통합 슬라이드 덱 1개 HTML (각 md 표지가 챕터 구분점)
npm run build:presentation -- "md_src/guides/*.md" --out publish/guides_slides.html

# 폴더 전체 → 종형 통합 허브 1개 onepage HTML (좌측 사이드바 + 카드형 홈, --dir 로 다른 md_src 하위 폴더도 지정 가능)
npm run build:onepage -- --dir guides   # 기본 출력: publish/guides-onepage.html (폴더명이 바뀌어도 "-onepage" 표시는 항상 붙음)

# 폴더 전체를 한 번에: 개별 3종(html/presentation/pptx) + 폴더 index.html + (설정에 따라) onepage/통합덱까지
npm run build:folder -- --dir guides             # 기본 세트(개별 3종 + 폴더 index.html) + hub.config.json 기본 옵션
npm run build:folder -- --dir guides --all       # 전부 다 생성
npm run build:folder -- --dir guides --guide --presentation --pptx --onepage   # 원하는 것만 선택

# React UI 개발 서버 (Vite API 미들웨어 포함)
npm run dev

# Vite 프로덕션 빌드
npm run build

# 웹앱(모듈 1/2/3) standalone 빌드 — 위 콘텐츠 파이프라인의 onepage와는 다른 산출물(React 앱 자체를 번들링, dist/*.html)
npm run build:standalone

# 테스트 실행
npm test             # vitest run (482개 — 정합성 130개 + 카탈로그 151개 + 배치 인수 54개 + 배치 라이브러리 72개 포함)
npm run migrate:names -- <경로>   # md 의 옛 배치 이름 → 기능 이름(+인수). --check 는 확인만(md_src 기본)
npm run test:watch   # watch 모드

# PPTX CLI 단축키
npm run build:pptx -- md_src/<폴더>/<파일>.md --out dist/<파일>.pptx
```

### npm 스크립트 명명 규칙

`build:` 접두사 뒤에 **무엇을 만드는지**를 붙인다(무슨 스크립트 파일을 부르는지가 아니라):

| 스크립트 | 실행 파일 | 만드는 것 |
| --- | --- | --- |
| `npm run build:guide` | `build-guide.mjs` | 개별 종형 가이드 html |
| `npm run build:presentation` | `build-presentation.mjs` | 개별/통합 횡형 프레젠테이션 html |
| `npm run build:pptx` | `md-to-pptx.mjs` | PPTX |
| `npm run build:onepage` | `build-guide-hub.mjs` | 폴더 전체를 합친 self-contained 단일 콘텐츠 파일 |
| `npm run build:folder` | `build-folder.mjs` | 위 4가지를 폴더 단위로 한 번에(오케스트레이터) |
| `npm run build:standalone` | `build-standalone.mjs` | React 웹앱(모듈 1/2/3) 자체를 번들링한 self-contained 앱 파일 — **콘텐츠가 아니라 도구를 담은 산출물**이라 이름은 비슷해도 위 5개와는 완전히 다른 파이프라인 |

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

### 이름은 하나로 — 기능 이름 (2026-10-14, pptgen 과 같은 규칙)

**정식 이름은 공용 카탈로그의 기능 이름 `<그룹>.<형태>` 하나뿐이다**(pptgen 과 같음, 단일 출처 `config/library/layouts.json` — `npm run sync:library`).
학습 콘텐츠용으로 붙였던 옛 숏코드 이름(`icon-grid`·`compare-grid`…)은 **읽기 호환 별칭**이자 렌더러 안의 **구현 ID**일 뿐이며, 문서·스니펫·화면·md_src 에 쓰지 않는다(md_src 466곳 이전 완료, 테스트가 잔존을 막음).

| 그룹 | 기능 이름 (cs_v2 가 직접 그리는 64종 — 굵게 = 2026-10-14 C 단계에서 근사 → 전용 HTML) |
|------|------|
| 분할·카드 (`grid`) | `grid.cards` `grid.features` `grid.badges` `grid.list` `grid.tiers` `grid.columns` **`grid.box-1~4` `grid.narrow-wide` `grid.wide-narrow` `grid.narrow-wide-titled` `grid.wide-narrow-titled` `grid.main-plus-3` `grid.cards-icon-3` `grid.circle-3` `grid.band-box-3`** |
| 비교·대조 (`compare`) | `compare.pair` `compare.before-after` **`compare.main-sub` `compare.balance` `compare.hbars` `compare.pair-summary`** |
| 순서·흐름 (`process`) | `process.track` `process.steps` `process.levels` `process.branch` **`process.staircase` `process.growth` `process.cycle-3` `process.zigzag` `process.cards-arrow-4` `process.input-circles-4` `process.band-columns-3` `process.steps-checklist-3`** |
| 구조·관계 (`structure`) | `structure.hub` `structure.rings` `structure.venn` **`structure.pillars` `structure.groups-2x3`** |
| 데이터·수치 (`data`) | `data.stats` `data.summary-bar` `data.quadrant` **`data.bars` `data.gauge`** |
| 서술·강조 (`text`) | `text.takeaway` `text.callout` `text.summary` `text.section` **`text.statement` `text.body` `text.quote` `text.icon-statement` `text.avatar`** |
| 코드·터미널 (`code`) | `code.editor` `code.console` `code.command` |
| 탐색·목록 (`nav`) | `nav.faq` `nav.tabs` `nav.chapters` |
| 이미지 (`media`) | **`media.cards-image` `media.banner` `media.full`** (항목 `src` 가 있으면 그림, 없으면 프롬프트를 적은 이미지 자리) |

- **모양 변형은 인수로**: `grid.cards align=center|left|row` · `grid.columns variant=card|plain` · `process.track connector=line|arrow|none` · `text.callout tip|info|warning|danger|success`(첫 인수 또는 `variant=`) · 모든 배치 `bg=alt`.
- **배치 인수(2026-10-14 C 단계, pptgen 과 같은 뜻)**: `badge=icon|number|none`(grid.cards·process.track·process.steps) · `connector`(process.track·process.branch) · `emphasis=last|first|none|<번호>`(track·levels·staircase·zigzag·stats·bars·hbars — 항목 `tag: highlight/active` 가 우선) · `grow`(levels·staircase) · `header`(grid.cards·features·columns·패턴 — 본문 위 머리띠, pair-summary 만 아래 결론 띠) · `caption`(staircase) · `ratio`(main-sub) · `scale`(bars) · `left`/`right`(gauge) · `side`(cards-image). **기본값은 카탈로그 `args.default` 하나**(`layoutArgs()` — 렌더러에 기본 수치 없음). 인수가 기본값이면 예전 마크업 그대로.
- **항목 `tag: alt`**: 그 카드만 서식 세트의 보조 카드색(블록 `bg=alt` 의 항목판). 세 파서가 `markAltItems()`(library-names) 로 `_alt` 표시 → HTML `sc-item-alt` / PPTX `helpers.isAltBlock(item, it)`.
- **해석 흐름**(`scripts/library-names.mjs` `resolveShortcode(name, args)` 한 곳): 옛 이름이면 기능 이름 + 카탈로그 `alias_args` 로 정규화(블록 인수 우선) → `impl.cs_v2.variants`(인수 → 구현 ID) → `impl.cs_v2.shortcode` → 근사(`fallback.cs_v2`). HTML(`renderShortcode`)·PPTX(md-to-pptx·pptx-browser) 모두 같은 함수 — PPTX 는 `resolveShortcode(name, args, "pptx")` 로 불러 기능 이름 구현(HTML 전용)이면 카탈로그 `pptx_shortcode`(옛 숏코드 근사).
- **옛 이름 관리**: CLI 빌드는 옛 이름을 만나면 `⚠ 옛 이름 X → Y` 경고. `npm run migrate:names -- <경로>`(이스케이프한 문법 예시 `\:::` 줄도) · `npm run migrate:names:check`.
- 카탈로그 66종 중 64종을 HTML 로 직접 그린다(옛 숏코드 28 + 기능 이름 구현 36 — `impl.cs_v2.shortcode` 가 기능 이름이면 `scripts/shortcode-ext/`). 견본 2종(`sample.chart-pair`·`sample.infographic-2`)만 근사. pptgen 옛 구현 ID(`staircase`·`c01-p01`)도 받아준다.
- `:::` 정규식은 `.` 을 허용(`shortcodeBlockRe`, 4개 파서 공유). 제목 끝 속성 `## 제목 {master=…}` 은 지우고 읽는다(`stripHeadingAttrs`).
- 색 이름(`color:`)은 카탈로그 `color_tokens` 단일 출처: `primary·secondary·accent·accent2·light·dark·ink·gray`(+`main·sub·deep·mid·brand`) 또는 `#hex`.
- 가이드 패널·삽입 메뉴(`config/shortcode-guide.ts`)는 카탈로그에서 목록·그룹·**스니펫(example)** 을 만든다 — pptgen 견본과 같은 예시.
- **배치 라이브러리 화면**(모듈 1 서브탭, `src/components/layout-library/` + `src/lib/layout-library.ts`, 2026-10-14): 카탈로그 66종을 그룹·검색(옛 이름 포함)으로 찾고, 예시를 `clientCompileMarkdown`(서버와 같은 코어)으로 테마·서식 세트·인수 변형·종형/횡형 미리보기, 구현 상태·항목 칸·배치 인수·스니펫 복사. 화면 값은 전부 생성본 `library-map.mjs`(`sync:library` 가 `args`·`pptgen`·`aliases` 도 넣음)에서 — pptgen `views/layouts.pptx` 와 같은 예시.

### 서식 세트 — 테마를 따르는 도형 서식 층 (2026-10-14)

테마(`styles.json`, 색·글꼴)와 배치(숏코드) 사이에 **서식 세트**(외곽선 굵기·그림자·둥글기·카드 채움·보조 카드 채움)를 둔다. 세트는 모양만 정하고 색은 테마 색 이름으로만 가리키므로, 테마를 바꾸면 같은 세트가 그 테마 색으로 다시 칠해진다(테마와 따로 놀지 않음).

| 고르는 곳 (뒤가 우선) | 예 |
|---|---|
| 카탈로그 기본 | `template` — 셸·테마 원래 서식(기존 출력 그대로), 보조 카드색만 정함 |
| `styles.json` 테마 키 `shapeSet`(선택) | `"shapeSet": "soft"` |
| frontmatter `shape:` | `shape: elevated` |
| 블록 인수 `bg=alt` | 이 블록 카드만 보조 카드색 — 한 슬라이드에 카드 배경 2종 |

세트: `template`·`flat`·`soft`·`outline`·`elevated`·`tinted`. HTML 은 `scripts/shape-set.mjs` 가 `:root, body` 에 `--set-card-bg`·`--card-alt-bg`·`--card-border-width`·`--card-border-color`·`--card-shadow`·`--card-radius` 를 넣고, `shortcode-styles.mjs` 카드 규칙이 이 변수를 먼저 읽는다(없으면 원래 값). PPTX 는 `pal.shape` → `helpers.cardBox(pal, {alt})`. 색 강조(`color:`)가 있는 카드는 자기 서식을 유지한다.

### 특수 내부 토큰
- `type: "arrow"` — `process.track` 안에서만 쓰는 방향 화살표 항목
- `slide-config` — 슬라이드 설정 전용 토큰(`notes` 여러 줄: `notes: |` 또는 `\n`)

### HTML·PPTX 지원 현황

HTML(종형·횡형)은 64종을 모양 그대로 그린다. cs_v2 자체 PPTX 는 **빠른 근사**(역할 분담 — 정밀 PPTX 는 pptgen): 옛 숏코드 28종은 같은 모양, 기능 이름 구현 36종은 카탈로그 `pptx_shortcode`(예: `process.staircase` → level-grid). `library-catalog.test.ts`·`layout-ext.test.ts`·`shortcode-conformance.test.ts` 가 66종 HTML·PPTX 커버리지·CSS 커버리지·렌더러 등록을 잠금. 옛 이름 → 기능 이름 + 인수 표: `docs/shortcode-reference.md` 맨 아래.

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

> **`style`(색상 테마)과 `category`(그룹핑)는 별개다.** 2026-09-03 이전에는 이 테마 키 자체가 `ai-dev`/`productivity`처럼 콘텐츠 카테고리명을 겸하고 있었다 — 처음 `guides/` 가이드 카테고리별로 테마를 하나씩 만들다 보니 그렇게 굳어진 것. 이제 여러 문서를 같은 카테고리로 묶고 싶으면(예: onepage 허브 사이드바, 통합 프레젠테이션 덱 순서) `style`과 무관하게 frontmatter에 `category:`를 별도로 지정한다 — `category`가 없으면 `style` 값이 카테고리로도 쓰인다(하위호환, `md_src/guides`·`md_src/claudeguide`의 기존 46개 문서가 이 경로). `hub.config.json`의 `categories.order`/`categories.meta`는 이 `category`(없으면 style) 값을 키로 쓴다.

| 키(2026-09-03 개명) | 이전 키 | label | 계열 색상 | PPTX 폰트 |
|----|----|-------|---------|---------|
| `sky-blue` | `custom-blue` | 스카이 블루 | #2789F5 | paperlogy-extrabold / paperlogy-regular |
| `emerald` | `ai-chat` | 에메랄드 그린 | #10A37F | pretendard |
| `terracotta` | `ai-dev` | 테라코타 오렌지 | #D97757 | Consolas / Pretendard |
| `indigo` | `knowledge` | 인디고 퍼플 | #6366F1 | noto-serif / noto-sans |
| `cobalt-blue` | `productivity` | 코발트 블루 | #1565C0 | pretendard |
| `orchid` | `creative` | 오키드 마젠타 | #9B59B6 | paperlogy-extrabold / paperlogy-regular |
| `cyan` | `security` | 사이언 | #06B6D4 | pretendard |
| `amber` | `finance` | 앰버 골드 | #D4A017 | noto-serif / noto-sans |
| `lime` | `future` | 네온 라임 | #84CC16 | pretendard |
| `slate` | `enterprise` | 슬레이트 그레이 | #475569 | pretendard |
| `rose` | `media` | 로즈 레드 | #E11D48 | pretendard |

키 이름은 색 속성 기준으로 바뀌었을 뿐 팔레트·폰트 값은 그대로다(개명 전후 산출물 동일). 기존 콘텐츠는 전부 새 키로 일괄 치환 완료 — `style: "ai-dev"` 같은 구 키를 쓰는 문서가 새로 생기면 `STYLES[key]`가 `undefined`가 되어 기본 테마(`emerald`)로 조용히 폴백되니 주의.

각 테마는 `brand`, `brandDark`, `brandDeep`, `brandLight`, `brandMid`, `border`, `bg`, `heroGradient`, `webFont`, `webFontTitle`, `pptxFont`, `pptxFontTitle`, `pptxFontSubTitle` 키를 가집니다.

---

## 아키텍처 핵심 규칙

### Universal Schema (6대 표준 키)

모든 숏코드 항목은 내부적으로 다음 6개 표준 키로 정규화됩니다:

```
icon | title | desc | tag | meta | color
```

공유 모듈 `scripts/shortcode-render.mjs`의 `standardizeItem()`(HTML)과 `md-to-pptx.mjs`의 동명 함수(PPTX)가 이 변환을 담당합니다. 구형 키명(`name`, `description`, `tagline`, `features` 등)도 자동 매핑됩니다.

### HTML 렌더링 — 코어 단일화 (페이지 생성 파이프라인 통합)

**구조: 환경 비의존 "코어" 2개가 페이지 생성 전체(슬라이드 분할·페이지 템플릿·CSS·숏코드 렌더)를 소유하고, CLI 래퍼와 브라우저 클라이언트가 그 코어를 그대로 호출한다 → `standalone(브라우저) == server(CLI)` 를 코드 레벨에서 보장.**

| 코어 (정본) | 숏코드 렌더링 | 호출처 |
|------------|-------|-------|
| `scripts/guide-core.mjs` | `shortcode-render.mjs` + `shortcode-styles.mjs` (공유) | `build-guide.mjs`(CLI) + `client-compiler.ts` **html 모드** |
| `scripts/presentation-core.mjs` | `shortcode-render.mjs` + `shortcode-styles.mjs` (**공유 — 가이드와 동일**) | `build-presentation.mjs`(CLI) + `client-compiler.ts` **presentation 모드** |

- **숏코드 마크업+CSS 단일 출처**: `shortcode-render.mjs`(렌더러) + `shortcode-styles.mjs`(CSS, `var(--*)` 테마 독립). **3종 HTML(가이드·프레젠테이션·클라이언트)이 모두 이 한 쌍을 공유** → 숏코드 하나의 여백/스타일을 바꾸려면 `shortcode-styles.mjs` **1곳만** 수정(드리프트·누락 구조적 불가). 각 코어는 페이지 골격(슬라이드 분할·표지/헤더·스크롤·TOC·표)과 `:root` 테마 변수만 자기 매체에 맞게 정의.
- presentation-core 의 `:root`는 다크 기본(+`body.light-mode` 라이트 변수)을 정의하고 `${SHORTCODE_CSS}`를 포함한다. os-tabs `switchTab` 함수는 페이지 스크립트에 포함.
- 코어 시그니처(환경 비의존, fs/path 없음): `buildHtml(doc{raw}, {styles,config,htmlConfig,style})` / `buildPresentationHtml(docs[{raw,basename}], {styles,config,htmlConfig,style})`. 프론트매터는 gray-matter(브라우저는 `buffer-polyfill` 필요), 토큰화는 marked.
- **CLI 래퍼**(`build-guide.mjs`·`build-presentation.mjs`)는 파일읽기 + `loadJsonWithComments` config 로드 + 코어 호출만 담당.
- **클라이언트**(`client-compiler.ts`)는 자체 렌더러를 두지 않고 `?raw`로 config를 주입해 코어를 호출. 과거 `renderClientShortcode`·자체 템플릿·자체 CSS·standalone 배너는 전부 제거됨.
- ⚠️ **PPTX 는 별개**: `pptx-renderers/` + `pptdesign.config.json`(절대좌표·수치). HTML과 렌더링 공유 불가(매체 상이). 입력 데이터 모델(`standardizeItem`)만 개념상 공유.
- **수정 시 규칙**: 코어/렌더러/`client-compiler.ts` 변경 후 → `npm run build:standalone` (정합성 게이트 후 standalone 재빌드). 빠른 재빌드만 필요하면 `build:standalone:fast`.
- **정합성 테스트**: `src/__tests__/shortcode-conformance.test.ts`(87건) — ① 공유 HTML 렌더러+PPTX 레지스트리 커버리지 ② **`standalone==server` 출력 동치 잠금**(html=guide-core, presentation=presentation-core). `build:standalone`이 먼저 실행.

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
style: "sky-blue"        # styles.json 색상 테마 키 (11종 중 선택)
category: "ai-dev-tools" # 그룹핑용(선택, 없으면 style 값이 카테고리로 대체됨)
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
npm test          # vitest run (src/__tests__/ 하위 전체, 482개)
npm run sync:library        # 공용 배치 카탈로그 원본 → config/library + scripts/library-map.mjs
npm run sync:library:check  # 원본과 다르면 종료코드 1
npm run test:watch
```

- `client-compiler.test.ts` (24개): `clientCompileMarkdown()` HTML 출력 구조, 숏코드 렌더링, FALLBACK_STYLES 유효성
- `shortcode-conformance.test.ts` (130개, 기능 이름 기준): 정합성 가드 — 공유 HTML 렌더러 + PPTX 레지스트리 커버리지 + standalone `:::` 잔존 + **standalone==server 출력 동치 잠금**(html/presentation)
- `pptx-analyzer.test.ts` (23개): PPTX XML 분석기 유닛 테스트
- `pptx-transform.test.ts` (10개): PPTX 왕복(round-trip) 변환 검증
- `wcag.test.ts` (18개): `getContrast()`, `getLuminance()` 계산 검증
- `layout-library.test.ts` (72개): 웹 배치 라이브러리 데이터 — 화면 목록 = 카탈로그 66종(순서 그대로), 직접 64·근사 2, 옛 이름 검색, 예시 66종×변형이 가이드·슬라이드 코어로 그려지고 `:::` 가 남지 않음
- `layout-ext.test.ts` (54개): 기능 이름 배치 전용 HTML(카탈로그 예시·변형 렌더, `sx-*` 클래스 CSS 커버리지, 이스케이프), 배치 인수(기본값 = 카탈로그), 항목 `tag: alt`(HTML·PPTX), 브라우저 PPTX 발표스크립트
- `library-catalog.test.ts` (151개): 공용 배치 카탈로그 — 생성본(library-map)==복사본(config/library), 기능 이름 66종이 전부 HTML·PPTX 로 그려짐, 옛 이름 42개 = 기능 이름+인수와 출력 동일, 변형(인수 → 구현 ID), md_src 옛 이름 0, callout 인수 파싱, `.` 이름 블록·제목 속성 제거, 서식 세트(template=기존 서식, 색은 테마 변수만), `bg=alt`, PPTX `line:{width:0}` 금지

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
| standalone(브라우저) vs server(CLI) 프레젠테이션 분기 — 동일 MD에 슬라이드 4 vs 40 (2026-06-26) | 숏코드 렌더러만 공유했을 뿐 **슬라이드 분할·페이지 생성·CSS는 client/server 별도 구현** | 페이지 생성 전체를 환경 비의존 코어(`guide-core.mjs`·`presentation-core.mjs`)로 추출 → CLI 래퍼+client 가 동일 코어 호출. 각 단계 byte-identical 게이트 + `standalone==server` 동치 잠금 테스트. (docs/plan/presentation-stabilization.md §3 완료) |
| 가이드 `<title>`·nav title 미escape XSS (2026-06-26) | build-guide buildHtml 이 frontmatter title 을 `<title>`/nav-logo 에 raw 삽입 | guide-core 에서 `escapeHtml(fm.title)` 적용(양성 title 출력 동일 → byte-identical 유지) |
| standalone 미리보기(html·presentation) 전부 공백 (2026-06-26) | 코어가 frontmatter 파싱에 gray-matter 사용 → 브라우저 빌드는 `buffer` externalize → `Buffer` 전역 부재로 `matter()`가 `Buffer.from` throw → `clientCompileMarkdown` 예외 → previewHtml 빈 채. (구 client 는 정규식 파싱이라 무영향) | `buffer` 폴리필 설치 + `src/lib/buffer-polyfill.ts`(전역 Buffer 보강)를 gray-matter 경로(`client-compiler.ts`·`pptx-browser.ts`) 최상단 import. 헤드리스(puppeteer) 검증: html 62KB·presentation 40슬라이드 렌더. ※ pptx-browser 도 동일 잠재 버그였음(함께 해소). |
| 프레젠테이션 숏코드가 가이드와 완전히 다르게 렌더 (2026-06-26) | presentation-core 가 가이드와 **별도 렌더러+CSS** 보유(안정화 임시방편) → 규칙 1(숏코드 CSS 단일 출처) 위반. badge-grid·faq-list·console-box·compare-split CSS 누락(unstyled), os-tabs·before-after 렌더러 자체 부재. 숏코드 1개 여백 바꾸려면 2파일 수정 필요했음 | presentation-core 를 공유 `shortcode-render.mjs`+`SHORTCODE_CSS` 로 **교체**(append 아님). `:root`에 다크/라이트 테마 변수 완비(`--text-2/3`,`--shadow(-lg)` 등) + os-tabs `switchTab` 추가 + 라이트모드 표 글자색 보정. 헤드리스 다크/라이트 검증. → 숏코드 스타일 단일 출처(`shortcode-styles.mjs` 1곳) |
| 프레젠테이션 전부 파란 표지 (2026-06-26) | showcase.md 등 모든 가이드가 섹션 제목에 `#`(h1) 사용 → 코어가 h1→표지(파란 중앙정렬)로 분기 → 거의 전부 표지·중앙정렬·제목짤림 | (정책) 섹션 제목은 `##`(h2=내용 슬라이드), `#`/frontmatter 만 표지. showcase.md 의 섹션 37개를 `#`→`##` 변환(코드펜스 내 `#` 제외) |
| standalone 미리보기(html·presentation) 및 dev 서버 실행 시 Module "buffer" externalized 에러로 module2 미리보기 공백 (2026-06-29) | buffer 패키지가 node_modules에 미설치되었고, Vite/Rolldown이 빌드 시 built-in name인 "buffer"를 강제로 externalize하여 브라우저 runtime에서 모듈 로드 실패 | 1. `npm install` 실행으로 buffer 패키지 설치<br>2. `vite.config.ts` 및 `vite.config.standalone.ts`에 resolve alias (`"buffer": path.resolve(__dirname, "./node_modules/buffer/index.js")`) 추가하여 브라우저용 buffer polyfill을 온전히 인라인 번들링하도록 고정 |
| 여러 md를 병합한 횡형 프레젠테이션에서 목차(TOC) 항목 글자가 거의 안 보임 (2026-09-01) | `.toc-cover .toc-title`이 전역 `:root --brand-light`(첫 문서 기준으로 고정) 색을 사용 → 여러 문서를 병합하면 모든 문서의 표지 항목이 그 하나의 옅은 파스텔색을 공유. 라이트모드 목차 배경(거의 흰색)과 겹치면 대비가 거의 0에 가까워짐 | `presentation-core.mjs`에서 표지형 목차 항목마다 자신의 `brandDark`를 인라인 CSS 변수(`--cover-color`)로 주입, `.toc-cover .toc-title`이 `var(--cover-color, var(--brand-light, var(--brand)))`를 사용하도록 수정 → 문서별로 뚜렷하고 라이트/다크 모두에서 읽히는 색상 확보. `npm run build:standalone`으로 client-compiler 번들 갱신 |
| VisualAdjuster/SubUtilities 테마 목록에 `"$comment"`가 가짜 테마로 표시됨 (2026-09-01) | `config/styles.json`의 JSONC 주석 관용구 `"$comment"` 키를, `/api/list-styles`(vite-api-plugin.ts)와 브라우저 standalone 폴백 `BUNDLED_STYLES`(client-compiler.ts)가 필터 없이 그대로 `Object.entries()`로 순회 → 두 컴포넌트 모두 이를 실제 테마 카드로 렌더 | 두 ingestion 지점에서 `$`-접두 키를 응답/번들 전에 제외(단일 지점 수정으로 모든 소비처 자동 해소). `/api/save-styles`는 클라이언트가 `$comment`를 더 이상 보내지 않으므로, 저장 시 기존 파일의 `$`-키를 읽어 병합해 보존 |
| `VisualAdjuster.tsx`(657L)·`SubUtilities.tsx`(1065L)가 200라인 제한(development_style.md) 위반 (2026-09-01) | God Component — 각각 3개의 독립 패널/섹션을 단일 파일에 상태+렌더링 함께 보유 | VisualAdjuster: 상태·핸들러를 `useThemeEditor`/`useThemeMutations` 훅으로, 3패널을 `visual-adjuster/*` 서브컴포넌트로 분리 → 컴포넌트는 48라인 조합 셸로 축소. SubUtilities: 섹션별 상태가 완전 독립임을 확인 후 `sub-utilities/*` 3개 자기완결 컴포넌트(+PPTX XML 스캔/치환 로직은 `lib/pptx-color-remap.ts`로 분리)로 나눔 → 컴포넌트는 13라인 조합 셸로 축소. 전 파일 200라인 이하 확인, 204/204 테스트 통과, standalone 4종 빌드+헤드리스 검증 완료 |
| `build-guide-hub.mjs` 홈 화면이 사이드바에 비해 초라함(히어로·검색·필터 없음) (2026-09-02) | 이 오프라인 허브는 원본 `c:\ai\creative-spark`의 React 홈페이지(`src/pages/Index.tsx`, 히어로+검색+카테고리 pill+카드형 그리드, shadcn/ui 기반 — 실제로 `aitoolguide-ms.netlify.app`에 배포되어 있던 화면)를 이식하지 않고 처음부터 새로 만든 vanilla-JS SPA라, 사이드바만 갖추고 홈 화면은 원본보다 훨씬 단순한 채로 남아 있었음 | `build-guide-hub.mjs`의 `showHome()`을 히어로(배지+그라디언트 타이틀+실시간 검색+CTA)·카테고리 pill(카운트 포함)·카드 그리드(상단 강조 바+hover 화살표)+홈 푸터로 재작성해 원본 디자인을 vanilla JS로 재현. 겸사겸사 `sync-guides-index.mjs`와 중복돼 있던 `STYLE_META`/`CATEGORY_ORDER`를 `scripts/guide-categories.mjs` 단일 출처로 추출(드리프트 방지) — 이 과정에서 41개 가이드 기준으로 갱신되지 않고 있던 `src/data/guides.json`(19개 가이드 기준 stale 데이터)도 재동기화됨 |
| 기능 이름(`grid.cards`)·서식 세트 도입 — pptgen 과 라이브러리 규칙 통일 (2026-10-14) | cs_v2 숏코드 이름·분류가 학습 콘텐츠(aidev·aitool) 설명용으로 붙어 범용성이 낮았고, pptgen 과 배치 이름·항목 규칙·색 이름이 달라 같은 md 를 양쪽에서 빌드할 수 없었음. 테마(색)와 배치(숏코드)는 분리됐지만 도형 서식(그림자·외곽선 굵기·보조 카드색)이 CSS/렌더러에 박혀 있었음 | 공용 카탈로그(`config/library/`, 원본 coding `_templates/slide-library/catalog`) 도입 + `library-names.mjs`(이름·정규식·색 이름 단일 출처) + `shape-set.mjs`(서식 세트) + `shortcode-guide.ts` 분류를 카탈로그 그룹으로. 고유 이름 비해석으로 기존 문서 마크업 동일(가이드·프레젠테이션 4종 비교 SAME), 테스트 204→288 |
| PPTX 에 "선 없음" 도형마다 1pt 짙은 회색 테두리 (2026-10-14 발견, 이전부터 존재) | 렌더러·변환기 49곳(pptx-renderers 37 + md-to-pptx·pptx-browser 12)이 `line: { width: 0 }` 으로 선을 없애려 했으나 pptxgenjs 는 `width || 1` 로 처리해 `<a:ln w="12700"><srgbClr 333333>` 을 씀(카드 상단 색 띠·배지·헤더 바 등에 검은 테두리) | 전부 pptxgenjs 공식 표기 `line: { type: "none" }` 로 교체 + 재발 방지 테스트(`library-catalog.test.ts`) |
| cs_v2 에 없는 배치·인수 — 카탈로그 38종을 "가장 가까운 숏코드"로 근사 (2026-10-14, 인계서 C) | 계단·기둥·게이지·막대·천칭·인용·이미지·회사 패턴 상자 등이 cs_v2 렌더러가 없어 모양이 다른 숏코드(level-grid·columns-grid·stat-grid…)로 그려졌고, pptgen 이 받는 인수(badge·emphasis·grow·header·caption·connector=line)와 항목 `tag: alt` 를 cs_v2 가 무시 | 기능 이름 구현 `scripts/shortcode-ext/`(그룹별 7파일 + 공용, `var(--*)`·서식 세트 변수만, CSS 는 SHORTCODE_CSS 로 합침) 36종 + 기존 분기에 인수 추가(기본값은 카탈로그 `args.default` → `layoutArgs()`, 기본값이면 예전 마크업 그대로). PPTX 는 카탈로그 `pptx_shortcode` 로 예전 근사 유지. md_src 150개 산출물 전후 동일, 66종 예시 가이드·슬라이드(라이트/다크) 헤드리스 확인. 테스트 355→410 |
| 브라우저 PPTX 에 발표스크립트 없음 (2026-10-14 발견) | `pptx-browser.ts` 가 `slide-config notes` 를 읽기만 하고 `addNotes` 를 부르지 않음(CLI `md-to-pptx.mjs` 만 넣음) | CLI 와 같게 섹션 첫 페이지에 `addNotes` + 실제 PPTX 노트 슬라이드 확인 테스트(`layout-ext.test.ts`) |
| 이름 이중 운영(옛 숏코드 이름 + 기능 이름) 정리 — 기능 이름 하나로 (2026-10-14) | 기능 이름 도입 뒤에도 옛 이름(`icon-grid` 등)이 md_src·스니펫·문서·테스트에 그대로 쓰여 이름이 둘이었고, 확장 시 이름 규칙이 흔들릴 위험. 옛 이름 중 `compare-grid`·`workflow-flow` 는 실제로 모양이 달라 단순 별칭이 아니었음 | 옛 이름 → 기능 이름 + 인수(카탈로그 `alias_args`: `compare-grid`=`grid.columns variant=plain`, `workflow-flow`=`process.track connector=arrow` …), 인수 → 구현 ID(`impl.cs_v2.variants`). `migrate-names.mjs` 로 md_src 466곳 이전 — 이전 전후 150개 산출물 비교: HTML 마크업 동일(showcase 의 문법 예시 글만 새 이름), PPTX 는 의도한 2곳만 변경(아래 2행). 가이드 스니펫은 카탈로그 example 에서. 테스트 288→355 |
| PPTX 에서 `before-after` 가 전·후 대조로 안 나옴 / `skill-list` 글자 겹침 (2026-10-14 발견, 이전부터 존재) | `compare-split.mjs` 가 `compare-diff`·`compare-before-after` 이름일 때만 전·후 모양을 그리고 정식 이름 `before-after` 는 일반 2단으로 그림. `skill-list` 는 PPTX 에서만 단계 목록 모듈(steps)로 가서 카드 글자가 겹침(같은 그림인 `icon-grid align=left` 는 카드 모듈) | 전·후 판정에 `before-after` 포함 / 이름 정규화로 `grid.cards align=left` 는 모두 카드 모듈 — 이름 하나 = 그림 하나 |


### 크기 수치 설정 규칙 (P2 — 상세, 규칙 1 보충)
- **모든 폰트/크기 수치는 매체별 config json에 둔다**: PPTX=`pptdesign.config.json`, HTML=`htmldesign.config.json`. 렌더러 코드에 폰트 크기 리터럴 금지.
- **캐스케이드 우선순위**: `config 기본 → styles.json(스타일별 선택 오버라이드) → frontmatter(문서) → 숏코드 블록 인자`. 뒤로 갈수록 우선.
- styles.json의 titleSize/bodySize는 **선택적 오버라이드**(색·폰트와 동일 패턴). 없으면 config 기본 사용.
