# 숏코드 시스템 변경 이력

> cs_v2 프로젝트의 숏코드 명칭·구조·기능 변경 내역을 기록합니다.  
> 원본 프로젝트: `c:\ai\creative-spark`

---

## PPTX 발표 노트 문단·굵게 (2026-10-26)

- `scripts/pptx-core/notes.mjs`: pptxgenjs 가 노트를 문단 하나에 넣고 `**굵게**` 를 별표 그대로 두던 것 → 줄마다 문단, `**…**` 는 굵은 글. `buildPptx` 가 `prs.exportPresentation` 을 감싸 CLI·브라우저(writeFile·write) 모두 적용. pptgen `lib/notes_format.py` 와 같은 규칙. 시험 `src/__tests__/notes-format.test.ts`.

## slide-config 노트 빈 줄 (2026-10-26)

- `parseSlideConfig`: `notes: |` 안의 빈 줄에서 값이 끝나 뒤 줄이 사라지던 버그 — 빈 줄 = 문단 나눔으로 이어 읽음(pptgen `lib/parse_v2.js` 와 같은 규칙). 시험 `src/__tests__/slide-config.test.ts`.

## Phase 12 — 공용 카탈로그 동기화(91종·서식 세트 10종) · media.video (2026-10-26)

### 바뀐 것
- **카탈로그 동기화**(pptgen 쪽 변경): 배치 87 → 91종 — `media.video`(영상·그림 화면) 추가, 데코 후보에서 만든 `grid.pill-cards-3`·`process.roadmap-circles`·`process.roadmap-circles-v`·`process.roadmap-chevron`(옛 이름 chevron-roadmap 별칭, cs_v2 는 근사 — `near` 배치의 구현), 보류였던 `structure.flow-hub-3`·`text.icon-tab-arch` 삭제. 서식 세트 `gradient-base` 추가.
- **`media.video` HTML 직접 구현**(`scripts/shortcode-ext/media.mjs`): 항목 `url`(읽기 호환 `src`·`image`) — 유튜브는 iframe(`embed/<id>?start=&end=`, 주소의 `t=` 도 시작), 영상 파일은 `<video>`(`#t=시작,끝`), 그림은 `<img>`. `cols` 1~3, `ratio`(쇼츠 9:16 자동). HTML 은 브라우저가 `end` 를 지킨다(PowerPoint 는 유튜브 end·전체 화면을 지원하지 않음 — pptgen 기록).
- **서식 세트 채움 배열 = 위→아래 그라데이션**(`scripts/shape-set.mjs`): HTML `linear-gradient(to bottom, …)`, PPTX 는 가운데 색(단색 카드).
- 테스트: 직접 구현 64 → 65종, `media.video` 렌더 1건 추가.

### 영향 없음(확인)
- 그 밖의 배치·서식 세트 출력 그대로 — `npm test` 564 · lint 오류 0 · typecheck.

---

## Phase 11 — PPTX 공용 코어 · CI (2026-10-14)

### 바뀐 것
- **MD → PPTX 변환을 공용 코어 하나로**: `scripts/pptx-core/`(fs 없음). `md-to-pptx.mjs`(CLI)·`src/lib/pptx-browser.ts`(웹)는 입출력 래퍼만. 예전 브라우저 쪽은 CLI 복사본이라 갈라져 있었다.
- **브라우저 PPTX 가 고쳐진 것**: 블록 인수 `title-size=`·`desc-size=` 반영(전엔 무시), 표지 stats·마무리·오류 글자 크기를 config 에서(전엔 숫자 하드코딩).
- **CI**: `.github/workflows/ci.yml` — lint·typecheck·test·`migrate:names:check`·`verify:pptx`·build·standalone. `npm run typecheck` 추가. 불필요한 `@ts-ignore` 34곳 제거, `ThemeFormShape` 단일 출처.

### 영향 없음(확인)
- CLI PPTX·HTML: md_src 150개 산출물 전후 동일. 브라우저 PPTX: md_src 50개가 CLI 와 같음(md_src 는 갈라진 기능을 쓰지 않아 예전 브라우저 출력과도 같음).

---

## Phase 10 — 설정·라이브러리·코드 층 정리 · 200줄 분리 (2026-10-14, 인계서 E)

### 바뀐 것
- **층 분리**: 공용 카탈로그 복사본 `config/library/` → 최상위 `library/`(사람이 고르는 설정과 여러 도구가 같이 쓰는 정의를 나눔). 아무도 읽지 않던 `config/layout.json` 삭제.
- **설명·기본값은 카탈로그 하나에서**: 가이드 패널의 배치 설명(`LAYOUT_DESC`)을 카탈로그 `emoji`·`desc` 로, 칸 안내는 `fields` + `args` 로. 배치 인수 기본값은 카탈로그 `args.default` 만(값이어야 함 — 빈 값·숫자·values 중 하나, 테스트로 잠금). `bg` 기본 = 빈 값(배치 원래 모양), `text.callout` 기본 종류 = `tip`(pptgen 도 같게).
- **파일 나눔(출력 동일)**: `shortcode-render.mjs`(1003줄) → 입구 + `shortcode-render/`(글자 도구·파서·옛 숏코드 분기 표 6개), `shortcode-styles.mjs`(469줄) → `SHORTCODE_CSS` 입구 + `shortcode-styles/` 3부분. 테스트 `library-catalog.test.ts` 의 서식 세트·선 없음·slide-config 묶음은 `shape-set.test.ts` 로.

### 영향 없음(확인)
- 숏코드 이름·인수·마크업·CSS 그대로: `SHORTCODE_CSS` 문자열 동일, 628블록 렌더 동일, md_src 150개 산출물 동일, `npm test` 485, standalone·Vite 빌드.

---

## Phase 9 — cs_v2 에 없던 배치·인수 추가: 근사 36종 전용 HTML + pptgen 과 같은 배치 인수 (2026-10-14)

### 배경
- 공용 카탈로그 66종 중 38종(계단·기둥·게이지·막대·천칭·인용·이미지·회사 패턴 상자 등)은 cs_v2 렌더러가 없어 모양이 다른 숏코드로 "근사"되었고, pptgen 이 받는 배치 인수(`badge`·`emphasis`·`grow`·`header`·`caption`·`connector=line`)와 항목 `tag: alt` 를 cs_v2 가 무시했다(인계서 C).

### 변경 1 — 기능 이름 구현 36종 (`scripts/shortcode-ext/`)
- 구현 ID = 기능 이름. 그룹별 파일(grid·process·flows·compare·data·text·media) + 공용 조각, 각 200줄 이하. CSS 는 `var(--*)`·서식 세트 변수만 쓰고 `SHORTCODE_CSS` 끝에 한 번 합쳐진다(숏코드 CSS 단일 출처 유지).
- 상자형 회사 패턴 12종은 매개변수 하나(`boxes(cols, title, circle, main)`)로, 단계형 4종은 `flows.mjs` 로 묶었다.
- PPTX 는 카탈로그 `impl.cs_v2.pptx_shortcode`(예전 근사 그대로) — `resolveShortcode(name, args, "pptx")`. 정밀 PPTX 는 pptgen 몫(역할 분담).
- 남은 근사: 견본 2종(`sample.chart-pair`·`sample.infographic-2`).

### 변경 2 — 배치 인수 (기본값 = 카탈로그 `args.default`)
| 인수 | 배치 |
|---|---|
| `badge=icon\|number\|none` | `grid.cards`·`process.track`·`process.steps`(기본 number) |
| `connector=line\|arrow\|none` | `process.track`(기본 line — 새로 그림)·`process.branch` |
| `emphasis=last\|first\|none\|<번호>` | `process.track`·`process.levels`·`data.stats` + 새 배치(staircase 기본 last·zigzag·bars·hbars) |
| `grow` | `process.levels`(기본 1.0)·`process.staircase`(기본 1.35) |
| `header` | `grid.cards`·`grid.features`·`grid.columns`·패턴 — 본문 위 머리띠(`compare.pair-summary` 는 아래 결론 띠) |
| 항목 `tag: alt` | 모든 카드형 — 그 카드만 보조 카드색(HTML `sc-item-alt`, PPTX `helpers.isAltBlock(item, it)`) |

- 카탈로그의 "배치마다" 기본값을 실제 값으로 확정(pptgen 렌더러와 같게). `sync:library` 가 `LAYOUTS[이름].defaults` 로 옮기고 렌더러는 `layoutArgs()` 로 읽는다 — 코드에 기본 수치 없음.
- 인수가 기본값이면 예전 마크업 그대로 → md_src 150개 산출물(가이드·프레젠테이션·PPTX) 전후 동일.

### 변경 3 — 브라우저 PPTX 발표스크립트
- `pptx-browser.ts` 가 `slide-config notes` 를 노트에 넣지 않던 문제 수정(CLI 와 같게).

### 테스트
- `layout-ext.test.ts`(54) 새로 — 36종 예시·변형 렌더, `sx-*` 클래스 CSS 커버리지, 이스케이프, 인수별 동작, `tag: alt`, 브라우저 PPTX 노트. 전체 355 → 410.

## Phase 8 — 이름은 하나로: 옛 숏코드 이름을 기능 이름 + 인수로 (2026-10-14)

### 배경
- Phase 7 에서 기능 이름을 도입했지만 옛 이름(`icon-grid` 등)을 "해석하지 않고 그대로" 두어 이름이 둘로 운영되고 있었다. 사용자 결정: 확장할 때 그룹·기능별 이름 규칙이 흔들리지 않도록 **기능 이름 하나로 운영**, 옛 이름은 읽기 호환만.
- 렌더러를 읽어 보니 옛 이름 대부분은 같은 그림의 다른 이름이었지만 `compare-grid`(상단 색 띠 없음)·`workflow-flow`(화살표로 이은 단계)는 실제로 모양이 달랐다 → 이 차이를 **인수**로 옮겨 손실 없이 합쳤다.

### 변경 1 — 옛 이름 → 기능 이름 + 인수
| 옛 이름 | 기능 이름 + 인수 |
|---|---|
| `compare-grid` | `grid.columns variant=plain` |
| `workflow-flow`·`workflow-strip` | `process.track connector=arrow` |
| `step-flow`·`flow` | `process.track connector=none` |
| `skill-list` / `checkpoint-grid` | `grid.cards align=left` / `align=row` |
| 그 밖의 옛 이름 | 인수 없이 기능 이름(예: `alert-box` → `text.callout`) |

- 표의 출처는 공용 카탈로그 `alias_args`(옛 이름 → 인수)·`impl.cs_v2.variants`(인수 → 구현 ID). 코드에 대응표를 두지 않는다.
- 옛 이름을 쓰면 빌드 CLI 가 경고: `⚠ 옛 이름 icon-grid → grid.cards`.

### 변경 2 — md_src·문서 일괄 전환
- `scripts/migrate-names.mjs`(`npm run migrate:names`, `--check`): md_src 50개 문서 466곳 + 문법 예시(`\:::`) 38곳 + 사용자 문서·스킬 문서 전환.
- 레퍼런스(`shortcode-reference.md`)를 카탈로그 그룹 순서·기능 이름 제목으로 재구성, 옛 이름은 맨 아래 표 한 곳에만.
- 가이드 패널·삽입 메뉴: 키가 기능 이름, 스니펫은 카탈로그 example(pptgen 견본과 같은 예시).

### 변경 3 — 함께 고친 것
- `text.callout`(옛 `alert-box`)이 인수 문자열 **전체**를 알림 종류로 쓰던 문제 → `variant=` 또는 첫 위치 인수만(다른 인수와 함께 써도 안전). `warning`/`caution` = `warn`.
- PPTX `before-after` 가 전·후 대조 모양으로 안 나오던 문제(옛 별칭 이름일 때만 나왔음).
- PPTX `skill-list` 가 단계 목록 모듈로 가서 글자가 겹치던 문제 → 카드 모듈로 통일(`icon-grid align=left` 와 같은 그림).

### 검증
- 이전 전후 산출물 150개(50문서 × 가이드·프레젠테이션·PPTX) 비교: HTML 마크업 동일(showcase 의 문법 예시 글 38줄만 새 이름), PPTX 는 변경 3 의 의도한 2곳만 다름(렌더로 확인).
- `npm test` 289 → 355.

---

## Phase 7 — 기능 이름(공용 배치 카탈로그) · 서식 세트 · 색 이름 통일 (2026-10-14)

### 배경
- 숏코드 이름·분류가 학습 콘텐츠(aidev·aitool 가이드) 설명용으로 시작돼 범용 문서에서 고르기 어려웠다.
- coding 저장소의 pptgen(슬라이드 md → PPTX)과 배치 이름·항목 규칙·색 이름이 달라 같은 md 를 양쪽에서 쓸 수 없었다.
- 테마(색)와 배치(숏코드)는 분리됐지만 카드의 그림자·외곽선 굵기·보조 카드색 같은 도형 서식이 CSS·렌더러에 박혀 있었다.

### 변경 1 — 기능 이름 `<그룹>.<형태>` (하위 호환)
- 공용 카탈로그(`config/library/layouts.json`, 원본 coding `_templates/slide-library/catalog`) 66종. cs_v2 28종 숏코드가 모두 기능 이름을 가진다(예: `icon-grid` → `grid.cards`, `compare-split` → `compare.pair`, `step-flow` → `process.track`, `alert-box` → `text.callout`).
- 고유 이름·기존 alias 는 해석하지 않고 그대로 동작(기존 문서 마크업 동일). pptgen 전용 배치·옛 이름은 가장 가까운 숏코드로 근사.
- `:::` 이름에 `.` 허용(4개 파서 공통 정규식 `shortcodeBlockRe`). pptgen md v2 제목 속성 `## 제목 {master=…}` 은 지우고 읽음.
- 가이드 패널·삽입 메뉴 분류를 카탈로그 그룹 8개(분할·카드/비교·대조/순서·흐름/구조·관계/데이터·수치/서술·강조/코드·터미널/탐색·목록)로 교체 — 이전엔 "데이터 다이어그램" 분류가 필터 버튼에 없어 venn 등이 분류로 안 보이던 문제도 함께 해소. 삽입 메뉴의 하드코딩 optgroup 을 데이터 기반으로 교체.

### 변경 2 — 서식 세트 (`shape:` · `bg=alt`)
- `template`(기본, 기존 모양)·`flat`·`soft`·`outline`·`elevated`·`tinted`. 모양만 정하고 색은 테마 색 이름으로 → 테마를 따른다.
- 고르는 곳: 카탈로그 기본 → `styles.json` 테마 `shapeSet` → frontmatter `shape:`. 블록 인수 `bg=alt` 로 보조 카드색.
- HTML: 카드 CSS 가 `--set-card-bg`·`--card-alt-bg`·`--card-border-width`·`--card-border-color`·`--card-shadow`·`--card-radius` 를 먼저 읽음. PPTX: `helpers.cardBox()`.

### 변경 3 — 색 이름 통일
- 항목 `color:` 의 이름을 카탈로그 `color_tokens` 하나로: `primary·secondary·accent·accent2·light·dark·ink·gray` (+ 옛 `main·sub·deep·mid·brand`). HTML(`resolveColorKeyword`)·PPTX(`hexClean`)·pptgen 이 같은 표를 읽음. 예전엔 `accent` 를 PPTX 가 몰라 검정(000000)으로 칠했다.

### 변경 4 — PPTX 선 없음 버그 수정
- `line: { width: 0 }` 이 pptxgenjs 에서 1pt `#333333` 테두리가 되던 문제(카드 상단 띠·배지·헤더 바 등 49곳) → `line: { type: "none" }`.

### 변경 5 — `::: slide-config` 여러 줄 값 규칙 통일
- `key: |` 다음 들여쓴 줄(pptgen 방식)과 한 줄 `\n` 리터럴(cs_v2 방식)을 **양쪽 모두** 줄바꿈으로 읽는다. 공용 파서 `parseSlideConfig`(shortcode-render.mjs)를 md-to-pptx·pptx-browser 가 같이 쓴다(이전엔 `notes: |` 가 `"|"` 한 글자로 읽혀 발표스크립트가 사라졌다).

### 검증
- `npm test` 204 → 288(신규 `library-catalog.test.ts` 83), 기존 문서 4종(가이드·프레젠테이션) 마크업 비교 동일, standalone 4종 빌드 + 헤드리스(기능 이름·`bg=alt`·elevated 그림자·다크/라이트) 확인, PPTX LibreOffice 렌더 확인.

---

## Phase 6 — 데이터 다이어그램 3종 이식 · 발표스크립트(notes) · Mermaid 지원 (2026-09-01)

### 배경
사용자가 별도로 만든 `slide-pipeline` 스킬(`C:\coding\_templates\myskill\slide-pipeline`)을 검토한 결과, 그 스킬의 pptx-lib(22패턴)에는 cs_v2 숏코드 카탈로그에 없는 "관계·위치·포함" 계열 기하학적 다이어그램이 다수 있었고, 발표스크립트(speaker notes)·Mermaid 구조도 지원도 없었음. 검토 과정에서 `network-box.mjs`의 PPTX 연결선 렌더링에 실제 버그(음수 extent → PowerPoint 파일 손상 위험)도 함께 발견해 수정.

### 변경 1 — PPTX `addSafeLine()` 버그 수정
- `slide-pipeline`이 문서화한 "`addShape('line', {w,h})`에 음수 w/h를 그대로 넘기면 PowerPoint가 파일 손상(E_FAIL) 처리하는데 LibreOffice·validate.py로는 못 잡는다"는 패턴이 `network-box.mjs`의 4방향 연결선 중 좌측 두 개에 실제로 존재함을 확인(offset이 음수인 경우 `w`/`h`가 음수로 계산되어 그대로 전달됨).
- `scripts/pptx-renderers/registry.mjs`의 공용 `helpers`에 `addSafeLine(slide, opts)` 추가(음수면 x/y 보정 + `flipH`/`flipV`로 정규화). `network-box.mjs`가 이를 사용하도록 교체. XML 검증(음수 extent 없음, well-formed)으로 확인.
- 겸사겸사 발견한 문서 드리프트도 정정: `docs/shortcode-reference.md`·`CLAUDE.md`가 network-box·git-flow·step-flow·level-grid·checkpoint-grid·compare-diff를 "PPTX 렌더러 없음"으로 잘못 표시하고 있었음(실제로는 이미 등록되어 있었음) → 표·예시 텍스트 정정.

### 변경 2 — 데이터 다이어그램 숏코드 3종 신설
`slide-pipeline`의 22패턴 카탈로그 중 cs_v2에 없던 유형을 선별 이식(hub-spoke는 기존 `network-box`와 개념이 겹쳐 제외):
- **venn-diagram**(alias `venn`) — 두 영역의 교집합에서 새 가치가 발생함을 표현.
- **quadrant-chart** — 두 축(X/Y) 기준 여러 항목의 상대 위치 비교. 블록 인수 `xLabel="..."` `yLabel="..."`, 항목 필드 `fx`/`fy`(0~1 비율).
- **concentric-rings** — A⊃B⊃C 계층적 포함관계. 항목을 바깥→안쪽 순서로 작성.
- 3종 모두 기존 아키텍처를 그대로 따름: HTML 렌더러는 `shortcode-render.mjs`(+CSS는 `shortcode-styles.mjs`)에 추가, PPTX 렌더러는 `scripts/pptx-renderers/venn.mjs`·`quadrant-chart.mjs`·`concentric-rings.mjs` 신설 후 `registry.mjs`에 등록. 폰트 크기는 `config/pptdesign.config.json`에 `venn`/`quadrant`/`rings` 섹션 추가(기하 구조 좌표는 network-box 선례를 따라 렌더러 코드에 직접 유지 — 이 프로젝트에서 도형 지오메트리는 config화 대상이 아님).
- `src/__tests__/shortcode-conformance.test.ts`의 `CASES`/`CANONICAL`에 3종 추가 → HTML·PPTX 레지스트리·CSS 커버리지·standalone 컴파일 4개 카테고리 자동 검증(117→129 테스트).
- `md_src/showcase/showcase.md`에 데모 섹션 추가, `config/shortcode-guide.ts` 삽입 툴바에 3종 등록.

### 변경 3 — 발표스크립트(speaker notes)
- 기존 `::: slide-config`(bg/color/titleSize/bodySize 지원)에 `notes` 키 추가. `md-to-pptx.mjs`가 섹션의 첫 PPTX 슬라이드에 `slide.addNotes()`로 반영(섹션이 여러 페이지로 자동분할되어도 첫 페이지에만 1회).
- 다른 필드와 동일하게 값은 한 줄 문자열이며, 여러 줄이 필요하면 프로젝트 기존 관례대로 `\n` 리터럴을 사용(`.replace(/\\n/g, "\n")`로 실제 줄바꿈 변환) — `slide-config`의 미니 파서는 YAML `|` 블록 스칼라를 지원하지 않음(한 줄당 하나의 `key: value`만 인식).
- HTML(가이드·프레젠테이션)에는 영향 없음 — PPTX 전용 기능.

### 변경 4 — Mermaid 구조도 지원 (HTML만)
- `guide-core.mjs`·`presentation-core.mjs`가 마크다운 토큰 처리 중 ```` ```mermaid ```` fenced code block을 감지해 `<pre class="mermaid">원문</pre>`로 출력(코드 하이라이팅 대신). `<head>`에 `mermaid.js`(jsdelivr CDN) 로드 + `mermaid.initialize({startOnLoad:true, theme:...})` 추가(가이드=`default`, 프레젠테이션=`dark`).
- PPTX는 전용 렌더러를 만들지 않음(mmdc 등 외부 바이너리 의존성 추가가 필요해 범위 밖으로 판단) — 기존 코드블록 렌더링 경로를 그대로 타서 원문이 코드박스로 표시됨(다이어그램 이미지로는 변환 안 됨, 콘텐츠 유실은 없음).
- `docs/shortcode-reference.md`에 "Mermaid 구조도 지원" 절 신설.

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
