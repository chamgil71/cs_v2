# worklog — cs_v2

> AI 에이전트 세션 누적 작업 로그. 기존 이력을 삭제·덮어쓰지 않고 날짜·세션별로 **아래로 누적**합니다.
> 형식: 날짜 / 수행 성과 / 테스트·검증 결과 / 다음 계획.

---

## 2026-07-02 — 거버넌스 스캐폴드 이식
- `AGENTS.md`(SSOT 진입점) 및 `agent/` 거버넌스 엔진(orchestration·prompts·knowledge·profiles·templates) 이식.
- 적용 프로필: 레포 성격에 맞게 AGENTS.md에 선언.
- 다음 계획: 실제 개발 세션에서 프로필·오케스트레이션 규칙 적용 개시.

## 2026-07-02 — 세션 2: 사양 앵커 확인
- 기존 `docs/spec.md`(401줄 실 사양서)를 그대로 유지(덮어쓰기 안 함).
- `agent/` 스캐폴드·`AGENTS.md`는 세션 1 이식분 유지. 사양 관련 별도 변경 없음.

## 2026-09-01 — md_src/guides 40종 콘텐츠 전면 최신화
- `md_src/guides/*.md` 전체(40개)를 웹서치로 팩트체크하며 2026-09 기준 현황으로 갱신. 주요 갱신: Claude 4종 모델(Fable/Opus 5/Sonnet 5/Haiku 4.5)·Cowork·MCP 레지스트리, ChatGPT GPT-5.6·Agent Mode(Atlas 통합 종료), Codex CLI(구 코드완성 설명을 실제 에이전틱 CLI로 전면 재작성), Copilot Agent Mode/Coding Agent/1M 컨텍스트, Cursor Composer·Cloud Agents, Grok 4.6·Grok Imagine, Perplexity Comet 브라우저 신규 반영, Gemini 3·Nano Banana Pro, NotebookLM→Gemini Notebook 리브랜딩, 이미지/영상/음악 AI 3종 문서의 모델 세대교체(GPT Image 2·Midjourney v7·Sora 2·Kling 3.0·Suno v5 등) 및 "Google step-flow" 오탈자(구 숏코드 리네이밍 잔재로 실제 제품명 "Google Flow"가 깨져 있던 버그) 수정.
- **신규 서비스 반영**: `Antigravity.md`가 실제로는 Google Antigravity(2026년 출시된 Gemini 3 기반 에이전트 IDE)와 무관한 범용 생산성 스택 글이었음을 확인 → 실제 Antigravity 제품 가이드로 전면 재작성. `devtools.md`도 `terminal-ai-tools.md`와 내용이 중복된 미정제 초안이었음을 확인 → Chrome DevTools MCP·Claude in Chrome·Playwright MCP를 다루는 별개의 "브라우저 자동화 AI" 가이드로 재작성.
- **정리**: 내용 없이 파일명만 다른 잔여 초안 `gemini-code-1778632757537.md`(Everything.md 중복)와 파이프라인 자체 테스트 픽스처 `test-marp-features.md`(AI 툴 가이드 아님, 테스트 스위트 미참조 확인 후 삭제)를 guides 컬렉션에서 제거. 결과 40 → 38개 파일.
- **검증**: `npm test`(192/192 통과) + 38개 파일 전체 `build-guide`/`build-presentation` 개별 실행으로 파싱 에러 없음 확인 + 헤드리스 브라우저로 `publish/guides.html`(236슬라이드 병합 덱)·`publish/guides/Claude.html` 렌더링 확인.
- **출력**: `publish/guides/`(38파일 × html·pptx·presentation.html = 114개) 전면 재생성, `md_src/guides/*.md` 전체를 하나로 합친 독립 실행형 `publish/guides.html`(횡슬라이드 프레젠테이션 코어 기반) 신규 생성. `publish/`는 `.gitignore` 대상이라 git 추적 없음.
- 다음 계획: 없음(콘텐츠 최신화 완료). 향후 빠르게 변하는 항목(모델 버전·가격)은 반기 단위 재점검 권장.

## 2026-09-01 — 세션 2: 신규 서비스 3종 추가
- 사용자 확인 후 완전히 빠져 있던 서비스 3건을 신규 가이드로 추가(40 → 41개 파일): `Windsurf.md`(2026.06 Cognition 인수로 Devin Desktop 리브랜딩된 사실 포함), `Replit.md`(효율 기반 과금·즉시 배포 에이전트), `한국AI서비스.md`(뤼튼·네이버 AI 브리핑·SKT 에이닷·카카오 카나나 4종 비교 — 네이버 클로바X/큐: 2026.04.09 종료 사실도 명시).
- `Ollama.md`가 1차 작업에서 누락됐던 것을 발견 → "Llama 3" 등 구형 모델 예시를 gpt-oss·qwen3-coder·Qwen3.5로 교체.
- 검증: `npm test`(192/192) + 신규 4개 파일 개별 build-guide/build-presentation 무오류 확인 + `publish/guides`(41×3=123개) 및 병합 `publish/guides.html` 재생성 + 헤드리스 브라우저로 `한국AI서비스.html` 렌더링 확인.
- 검토했으나 제외한 후보: 네이버 CLOVA X(2026.04.09 서비스 종료 예정이라 신규 가이드 대상에서 제외, 후속 전략은 한국AI서비스.md에 반영).

## 2026-09-01 — 세션 3: "독립 HTML" 산출물을 올바른 형식으로 교체
- 사용자 지적: 세션 1에서 만든 `publish/guides.html`은 `build-presentation.mjs`(횡슬라이드 덱) 산출물이었는데, 원래 기대한 "독립 HTML"은 과거 수작업 산출물 `publish/ai_guide_standalone.html`(사이드바 카테고리 내비 + 카드형 홈 + 가이드 클릭 시 Shadow DOM 렌더링되는 SPA 허브) 형식이었음. 저장소 전체를 뒤졌으나 그 형식을 만드는 생성 스크립트는 존재하지 않았음(수작업 또는 유실된 일회성 산출물, 2026-05-08 이식 커밋 이후 갱신 이력 없음, 어떤 코드에서도 참조되지 않는 고아 파일).
- **신규 스크립트 `scripts/build-guide-hub.mjs` 작성**: `guide-core.buildHtml()`로 각 가이드의 `<style>`/`<body>`만 추출해 JSON으로 직렬화하고, `scripts/sync-guides-index.mjs`와 동일한 카테고리(스타일별 라벨·색상) 기준으로 사이드바를 구성. `<` 문자를 유니코드로 이스케이프해 `</script>` 조기종료를 방지. `--out`을 여러 번 지정하면 여러 경로에 동시 출력 가능(`npm run guide:hub`).
- `publish/guides.html`과 `publish/ai_guide_standalone.html` 둘 다 이 스크립트로 재생성(41개 가이드, 6개 카테고리). 헤드리스 브라우저로 홈 화면 카드 그리드·사이드바 활성 상태·Shadow DOM 본문 렌더링·이전/다음 내비게이션 확인 완료.
- 문서 동기화: `README.md`·`CLAUDE.md`(scripts/ 목록에 `build-guide-hub.mjs` 추가), `docs/scripts_guide.md`(3-1절 신설, `sync-guides-index.mjs`와 카테고리 표 이중 관리 주의사항 명시), `package.json`(`guide:hub` 스크립트 추가).
- 검증: `npm test`(192/192) 통과, `node scripts/build-guide-hub.mjs` 기본 인자 실행 정상.

## 2026-09-01 — 세션 4: 종형/횡형 허브 문서화 + 횡형 목차 글자 안 보임 버그 수정
- **버그 재현·수정**: 여러 md를 병합한 횡형 프레젠테이션(`build-presentation.mjs "md_src/guides/*.md"`)에서 좌상단 ☰ 버튼으로 여는 목차(TOC)의 표지형 항목 글자가 거의 안 보이는 문제를 확인. 원인은 `.toc-cover .toc-title`이 **전역 `:root --brand-light`**(병합 시 첫 번째 문서 스타일로 고정)만 참조해, 41개 문서 모두의 표지 항목이 그 하나의 옅은 파스텔색을 공유하고 라이트모드의 거의 흰 배경과 겹쳐 대비가 사라졌기 때문. `scripts/presentation-core.mjs`에서 표지 항목마다 자신의 `brandDark`를 인라인 CSS 변수(`--cover-color`)로 주입하도록 수정(`.toc-cover .toc-title`이 `var(--cover-color, var(--brand-light, var(--brand)))` 참조) — 문서별로 구분되는 뚜렷한 색상이 되고 라이트/다크 모두 대비 확보. `CLAUDE.md` 주요 이슈 이력 표에 기록.
- `npm run build:standalone`으로 client-compiler 번들(dist/standalone·module1·module2.html) 재생성(핵심 코어 `presentation-core.mjs` 변경 시 필수 절차).
- **`build-guide-hub.mjs` 범용화**: `--dir <md_src 하위 폴더명>` 옵션 추가(기본 `guides`) → `md_src/claudeguide` 등 다른 폴더에도 동일하게 동작함을 실측 확인(4개 파일, uncategorized/custom-blue 카테고리로 정상 분류). 기본 출력 파일명도 `publish/<dir>.html`로 연동. `--help` 안내 추가.
- **문서화**: `README.md`에 "2-1. 빌드 파이프라인: 개별 파일 출력 vs 폴더 전체 허브(통합) 출력" 절 신설 — 파일 1개당 3종 포맷(종형 가이드/횡형 프레젠테이션/PPTX) 표와, 폴더 지정 시 두 가지 통합 허브 방식(횡형 통합 덱=`build-presentation.mjs` 글롭 / 종형 통합 허브=`build-guide-hub.mjs --dir`) 비교표 추가. `docs/scripts_guide.md` 3-1절, `CLAUDE.md` scripts 목록도 갱신 상태 유지.
- 검증: `npm test`(192/192), `md_src/guides` 41개 파일 3종 포맷 전량 재생성(123개) 무오류, `md_src/claudeguide`로 `--dir` 동작 확인, 헤드리스 브라우저로 병합 프레젠테이션 TOC 색상 수정 전/후 스크린샷 대조(수정 후 문서별 색상 뚜렷이 구분되고 가독성 확보).

## 2026-09-01 — 세션 5: slide-pipeline 스킬 검토 → 버그 수정 + 기능 3종 이식
- 사용자가 별도로 만든 `C:\coding\_templates\myskill\slide-pipeline`(원문→슬라이드.md→pptx 3단계 파이프라인 스킬)을 검토, cs_v2 숏코드 시스템과의 연계 가능성을 분석해 보고. 저작 워크플로 자체는 합칠 대상이 아니라 판단(선언형 마크다운 vs 대화형 단계별 저작이라 층위가 다름)했으나, 패턴/코드 자산 수준에서 3가지를 이식.
- **버그 수정**: slide-pipeline이 문서화한 "`addShape('line',{w,h})`에 음수 값을 그대로 넘기면 PowerPoint가 파일 손상 처리(LibreOffice·validate.py로는 미검출)" 패턴이 `scripts/pptx-renderers/network-box.mjs`에 실제로 존재함을 발견(4방향 연결선 중 좌측 두 개가 음수 w/h). `registry.mjs` 공용 helpers에 `addSafeLine()` 추가 후 교체, XML 검증(음수 extent 없음)으로 확인. 겸사겸사 `docs/shortcode-reference.md`·`CLAUDE.md`의 stale PPTX 지원 표(network-box 등 6종을 "렌더러 없음"으로 잘못 표기)도 정정.
- **데이터 다이어그램 숏코드 3종 신설**(`venn-diagram`/alias `venn`, `quadrant-chart`, `concentric-rings`) — slide-pipeline의 22패턴 카탈로그 중 cs_v2에 없던 유형만 선별(hub-spoke는 기존 network-box와 개념 중복이라 제외). HTML(`shortcode-render.mjs`+`shortcode-styles.mjs`)·PPTX(`pptx-renderers/venn.mjs`·`quadrant-chart.mjs`·`concentric-rings.mjs` 신설+`registry.mjs` 등록)·config(`pptdesign.config.json`에 폰트크기 섹션 3개) 전 계층 구현. `shortcode-conformance.test.ts`에 CASES/CANONICAL 추가(117→129 테스트).
- **발표스크립트(speaker notes)**: 기존 `::: slide-config`에 `notes` 키 추가, `md-to-pptx.mjs`가 섹션 첫 슬라이드에 `addNotes()`로 반영. "notes"라는 이름이 기존에 다른 용도로 쓰이지 않는지 사전 확인(전체 코드베이스 grep, 충돌 없음).
- **Mermaid 구조도 지원(HTML)**: `guide-core.mjs`·`presentation-core.mjs`가 코드펜스 ` ```mermaid `를 감지해 `<pre class="mermaid">`로 출력, `<head>`에 mermaid.js(jsdelivr CDN) 로드. PPTX는 전용 렌더러 없이 기존 코드블록 폴백(원문이 코드박스로 표시, 콘텐츠 유실 없음)으로 처리 — 새 바이너리 의존성(mmdc) 추가는 범위 밖으로 판단해 사용자에게 명시적으로 공유.
- **문서/쇼케이스 반영**: `docs/shortcode-reference.md`(7번 카테고리 신설, Mermaid 절 추가, 총계 25+13→28+14 갱신), `docs/shortcode-changelog.md`(Phase 6 신규), `config/shortcode-guide.ts`(삽입 툴바 3종 추가), `md_src/showcase/showcase.md`(섹션 30~33 데모 + slide-config notes 절 추가 + 상단 요약표 갱신).
- 검증: `npm test`(204/204), `npm run build:standalone:fast`(코어 변경 후 필수 절차) 2회 실행, 헤드리스 브라우저로 3개 신규 숏코드 HTML(가이드+프레젠테이션 다크모드) 렌더링·Mermaid 다이어그램 렌더링 확인, PPTX는 unzip 후 XML well-formed 검증 + ellipse 개수 대조.
- **최종 발행**: `publish/showcase/*`(3종), `publish/guides/*`(41개×3종=123개), `publish/guides.html`·`publish/ai_guide_standalone.html`(허브) 전량 재생성.

## 2026-09-01 — 세션 6: 웹 UI를 "웹 디자인 스위트" 3모듈로 재편
- 사용자가 프로젝트를 "콘텐츠 파이프라인"과 "웹 디자인 도구" 2파트로 인지 → 확인 과정에서 웹 UI가 실제로는 main.tsx 주석 그대로 "독립형 PPTX 분석 & 연계형 저작 시스템"으로 이미 2개 모듈(PPTX 인스펙터=독립, 가이드컴파일러+테마조율=연계)로 나뉘어 있었고, `SubUtilities.tsx`(대비검사기·팔레트빌더·컬러리매퍼, 1065줄)는 파일만 있고 어디에도 import되지 않은 죽은 코드임을 발견.
- 사용자 결정에 따라 CLI 엔진(scripts/*.mjs, md_src, config, publish)은 그대로 두고, 웹 쪽을 워크플로 순서의 **3개 동급 모듈**로 재편:
  - **모듈 1 — 디자인 시스템**: `VisualAdjuster.tsx` + `SubUtilities.tsx`를 신설 `DesignSystemSuite.tsx`로 통합(서브탭 2개). SubUtilities를 처음으로 실제 마운트 — 렌더링 확인 완료(대비검사기 정상 동작).
  - **모듈 2 — 가이드북 저작**: `MarkdownCompiler.tsx` 단독(테마 조율 서브탭은 모듈 1로 이관).
  - **모듈 3 — PPTX 인스펙터**: `PptxInspectorSuite.tsx`(기존 모듈 1 자리를 승계, 독립 워크플로).
  - `src/main.tsx`를 3개 동급 탭 대시보드로 전면 재작성(기존 중첩 main-tab/sub-tab 구조 제거).
- **엔트리 파일 재구성**(사용자 확인: 모듈별 단독 3개+통합 1개 유지, 파일명은 정체성에 맞게 리네이밍): `index.html`→`dashboard.html`로 실제 내용 이전 + `index.html`은 `dashboard.html`로 즉시 리디렉션하는 얇은 스텁으로 유지(Vite 기본 root 관례 보존). `module1.html`→`design-system.html`(내용도 PPTX인스펙터→디자인시스템으로 교체), `module2.html`→`guide-authoring.html`(테마조율 서브탭 제거), 신규 `pptx-inspector.html`(구 module1.html 내용 승계), `standalone.html`→`webdesignsuite.html`.
- `vite.config.ts`에 `build.rollupOptions.input`으로 index.html+dashboard.html 동시 빌드 추가. `vite.config.standalone.ts`의 `ENTRY_MAP`을 4개 키(suite/designSystem/guideAuthoring/pptxInspector)로 갱신, 기본값 `suite`. `scripts/build-standalone.mjs`의 `TARGETS`도 동일하게 4개로 갱신.
- **부수 수정**: `SubUtilities.tsx`가 import하는 `jszip`이 `package.json`에 직접 선언되어 있지 않고 pptxgenjs의 전이 의존성에 얹혀 우연히 동작하던 상태였음을 발견 → `package.json`에 `"jszip": "^3.10.1"` 명시 추가.
- **md-to-shortcode 스킬 통합**(같은 세션 앞부분에서 진행): 개인 스킬 원본 저장소 `C:\coding\_templates\myskill`에 이 스킬이 누락되어 있었음을 확인. cs_v2 안에 흩어져 있던 두 사본(`.claude/commands/md-to-shortcode.md`, `docs/skill/md-to-shortcode/SKILL.md`)을 하나로 통합해 `C:\coding\_templates\myskill\md-to-shortcode\`에 원본 신설(SKILL.md + references/shortcode-catalog.md + references/slide-pipeline-input.md + README.md), `cs_v2/.claude/skills/md-to-shortcode/`에 사본 배치, 구버전 2개는 삭제. slide-pipeline 산출물(`_슬라이드.md`)을 입력으로 받는 모드 B 신규 추가(22패턴→cs_v2 28숏코드 대응표 포함).
- **문서 동기화**: `README.md`(아키텍처·폴더구조 섹션 전면 갱신, 오래전에 이름이 바뀐 `PptxAnalyzer.tsx`→`PptxInspectorSuite.tsx` stale 참조도 함께 정정), `docs/guide.md`(1/2/3장을 모듈 1/2/3 순서로 재편 + SubUtilities 처음으로 문서화 + 이후 섹션 번호 3→4 및 하위 3-1~3-7→4-1~4-7 전체 재번호), `AGENTS.md`(entry 파일 목록 갱신).
- 검증: `npm test`(204/204), `npm run build`(index.html+dashboard.html 정상), `npm run build:standalone:fast`(4종 모두 정상), 헤드리스 브라우저로 대시보드 3개 탭 전부 확인(모듈1 테마조율/보조유틸리티 서브탭 포함, 모듈2 숏코드 쇼케이스 미리보기로 오늘 추가한 28종 반영 확인, 모듈3 PPTX 인스펙터).
- **후속 과제로 남긴 것(요청받지 않아 미착수)**: `SubUtilities.tsx`(1065줄)·`VisualAdjuster.tsx`(657줄) 모두 프로젝트 자체 규칙(파일당 200줄)과 React 가이드(500줄 God Component 기준) 초과 — 서브컴포넌트 분리는 별도 리팩토링으로 남김. `VisualAdjuster`의 테마 프리셋 목록에 `$comment`가 실제 테마처럼 노출되는 사소한 필터링 버그도 발견(신규 아님, 미수정).

## 2026-09-01 — 세션 7: VisualAdjuster/SubUtilities 200라인 리팩토링 + `$comment` 버그 수정
- 세션 6에서 후속 과제로 남긴 2건을 처리.
- **`$comment` 버그 원인 확정**: `config/styles.json`의 JSONC 주석 관용구 `"$comment"` 키가 두 ingestion 지점에서 필터 없이 그대로 노출되고 있었음 — ① `scripts/vite-api-plugin.ts`의 `GET /api/list-styles`(서버 모드), ② `src/lib/client-compiler.ts`의 `BUNDLED_STYLES`(standalone 폴백, `styles.json?raw` 번들). 두 지점 모두에서 `Object.entries().filter(([k]) => !k.startsWith("$"))`로 제외 처리 → VisualAdjuster·SubUtilities 등 모든 소비처가 자동으로 해소됨(단일 소비처 패치가 아닌 단일 출처 패치 방식 채택). 부수 효과로 `POST /api/save-styles`가 클라이언트가 더 이상 보내지 않는 `$comment`를 저장 시 유실시킬 뻔한 문제도 확인 — 저장 직전 기존 파일의 `$`-키를 읽어 병합·보존하도록 처리.
- **`VisualAdjuster.tsx`(657→48줄) 분리**: 상태·fetch/추가/수정/삭제/저장 로직을 `src/hooks/useThemeEditor.ts`(프리셋 로드·선택)+`useThemeMutations.ts`(추가/수정/삭제/서버저장)+`theme-defaults.ts`(타입+기본값 상수) 3개 훅/모듈로 추출. 렌더링은 기존 3패널 시각 경계 그대로 `src/components/visual-adjuster/`의 `ThemePresetPanel`(좌: 목록)·`ThemeEditorPanel`(중: HSL 편집폼)·`ThemeLivePreviewPanel`(우: 실시간 프리뷰+WCAG)로 분리. 컴포넌트 자체는 훅 호출+3패널 조합만 하는 순수 오케스트레이터로 축소.
- **`SubUtilities.tsx`(1065→13줄) 분리**: 3개 섹션(대비검사기/추천프리셋빌더/PPTX컬러리매퍼)의 상태가 서로 완전히 독립적임을 확인 → 각각을 자기완결형 컴포넌트로 승격(`sub-utilities/ContrastChecker.tsx`+`ContrastPreviewCards.tsx`, `ThemePresetBuilder.tsx`+`ThemePresetSelector.tsx`+`PaletteBuilderForm.tsx`+`PaletteLivePreview.tsx`, `PptxColorRemapper.tsx`+`PptxUploadZone.tsx`+`ColorMappingTable.tsx`). PPTX 내부 XML 색상 스캔/치환 로직(정규식 기반 색상 검출, DEFLATE 재압축)은 UI와 분리해 `src/lib/pptx-color-remap.ts`(`scanPptxColors`/`applyPptxColorRemap`)로 추출. `SubUtilities.tsx`는 3개 섹션을 나열만 하는 조합 셸로 축소.
- **동작 보존 검증**: "새 테마 추가" 버튼의 기존 클로저 순서(state 배치 업데이트 이전 값을 참조하는 실제 동작)를 정확히 재현하도록 `startNewTheme()`에서 동일한 호출 순서 유지 — 리팩토링 중 의도치 않게 동작을 "고치지" 않도록 주의.
- 검증: `npx tsc --noEmit`(에러 없음), `npm test`(204/204), `npm run build`, `npm run build:standalone:fast`(4종 모두 정상), 로컬 정적 서버(`python -m http.server`)로 `dist/design-system.html` 헤드리스 브라우저 실행 — 테마 조율 탭(프리셋 목록에 `$comment` 없음, 5개 폴백 테마만 정상 표시)과 보조 유틸리티 탭 3개 섹션(대비검사기·프리셋빌더 그리드+미리보기·PPTX업로드존) 전부 정상 렌더링 확인.
- 결과: 신규/수정 파일 전부 200라인 이하(최대 `useThemeMutations.ts` 119줄, `PptxColorRemapper.tsx` 158줄). `CLAUDE.md` 주요 이슈 이력에 2건 추가, `README.md` 폴더 구조 트리에 `hooks/`·`visual-adjuster/`·`sub-utilities/` 반영.

## 2026-09-02 — 세션 8: 오프라인 가이드 허브 홈 화면 복원 + `한국AI서비스.md` 팩트체크

- **커밋 부재 확인**: 세션 진입 시 세션 1~7(7개 세션 분량, 107개 파일)이 전부 staged 상태로 워킹트리에만 존재하고 마지막 커밋(`1df1fea`)이 2026-07-22임을 확인·보고. `npm test`(204/204)·`npx tsc --noEmit`·`npm run build:standalone:fast` 전부 정상 동작 확인(코드 자체는 완결 상태, 커밋만 누락).
- **오프라인 가이드 허브 홈 화면 회귀 진단**: 사용자가 "왼쪽 사이드바는 좋은데 첫 화면(오른쪽 메인 인덱스)이 이상하다"며 초기 버전 스크린샷(`aitoolguide-ms.netlify.app`)과 비교 요청. 브라우저로 라이브 사이트를 조사한 결과, 그 사이트는 cs_v2 파이프라인 산출물이 아니라 **이식 원본 프로젝트 `c:\ai\creative-spark`의 React 홈페이지(`src/pages/Index.tsx`, shadcn/ui 기반 히어로+검색+카테고리 pill+카드 그리드)**가 배포된 것임을 확인(19개 가이드 기준 구버전 카탈로그로 대조 확인). cs_v2가 자체적으로 만든 오프라인 허브(`build-guide-hub.mjs`)는 사이드바 내비게이션은 갖췄지만 홈 화면은 처음부터 이 리치 디자인 없이 단순 카드 나열로만 구현되어 있었음 — "이식 완료"라고 문서화됐던 것과 달리 실제로는 이 홈페이지가 이식되지 않았던 것.
- **수정**: `build-guide-hub.mjs`의 `showHome()`을 히어로(배지+그라디언트 타이틀+실시간 검색+CTA)·카테고리 pill(카운트 포함, 클릭 시 스무스 스크롤)·카드 그리드(상단 색상 강조 바+hover 화살표)+홈 푸터로 재작성해 원본 디자인을 vanilla JS로 재현(React/Tailwind 없이 기존 템플릿의 다크/라이트 CSS 변수 체계 그대로 확장). 검색은 카드 `data-q`(제목+부제 소문자) substring 매칭으로 카드/카테고리 블록을 즉시 show/hide.
- **부수 정리**: `sync-guides-index.mjs`와 `build-guide-hub.mjs`에 중복돼 있던 카테고리 라벨/설명/색상 표를 `scripts/guide-categories.mjs` 단일 출처로 추출(규칙 1 위반 해소, `docs/scripts_guide.md`에 이미 이 중복이 "의도적 복제"로 잘못 문서화돼 있던 것도 정정). 이 과정에서 `sync-guides-index.mjs`를 재실행하며 `src/data/guides.json`이 19개 가이드 기준 stale 데이터였다가 41개/6카테고리로 재동기화됨(현재 이 데이터를 읽는 소비처는 없음 — 향후 React 쪽에서 다시 쓰일 경우를 위해 최신 상태만 유지).
- **`한국AI서비스.md` 팩트체크 재작성**: 사용자가 "뤼튼이 가장 많이 쓰는 서비스"라는 서술과 EXAONE·국가 AI 프로젝트 누락을 지적 → 웹 리서치(와이즈앱 MAU 순위, LG AI연구원 공식 자료, 정부 독자 AI 파운데이션 모델 사업 보도) 기반으로 재작성.
  - 뤼튼: "가장 널리 쓰이는" 문구 삭제. 와이즈앱 기준 2026.07 국내 AI 앱 MAU 9위권(61만 명, 2026.02 135만·5위 대비 반년 새 절반 이하로 감소)이라는 실측 순위와, 회사 자체 발표(웹+앱 합산 700만+)를 함께 병기해 수치 해석 유의사항을 명시.
  - SKT 에이닷: "500만+"를 실제 최신 수치인 "가입자 1,000만+"(2025.12 기준, 2024.09 550만→2025.03 890만 추이 포함)로 갱신.
  - 카카오 카나나: 앱이 아직 베타임을 명시, 오픈소스 모델 항목에 Kanana-v 누적 다운로드 160만+ 수치 추가.
  - **신규 섹션 "삼성 갤럭시 AI(Gauss 2·빅스비)"** 추가 — 폰 기본 탑재로 설치 기반이 가장 넓은 국산 AI로 판단, 소비자 서비스 비교표에도 5번째 열로 반영.
  - **신규 섹션 "국가대표 AI — 정부 주도 독자 AI 파운데이션 모델 프로젝트"** 추가: 1차 선정 5팀(네이버클라우드·업스테이지·SKT·NC AI·LG AI연구원) → 2차 진출 3팀(LG·SKT·업스테이지, 네이버·NC 탈락) → 모티프테크놀로지스 추가 선정(2026.02)까지의 실제 경과를 `step-list`로 정리. EXAONE은 이 섹션에 배치(LG그룹 임직원 전용 비공개 베타 `ChatEXAONE` 언급) — 뤼튼/에이닷/카나나처럼 일반 소비자가 바로 가입하는 서비스가 아니라 모델/인프라 레이어이므로 소비자 서비스 카드로 넣지 않고 별도 섹션으로 구분(alert-box로 명시).
- 검증: `node scripts/build-guide.mjs`로 개별 렌더링 후 헤드리스 브라우저로 신규 섹션(히어로 5-stat, 국가대표 AI step-list+alert-box, 6열 비교표) 전부 정상 렌더링 확인. `build-guide-hub.mjs`는 로컬 정적 서버로 라이트/다크 테마·검색 필터(매치/무매치/초기화)·카드 클릭→Shadow DOM 가이드 전환·사이드바 연동을 JS 콘솔로 직접 검증. `npm test`(204/204) 통과.
- 다음 계획: 세션 1~8 전체(커밋 미완료 상태)를 언제 어떤 단위로 커밋할지 사용자 확인 필요. `publish/` 산출물(gitignore 대상)은 이번 세션에서 변경된 `한국AI서비스.md`·`guides.html`·`ai_guide_standalone.html`만 재생성했고 나머지 40개 가이드의 3종 산출물은 재생성하지 않음(내용 변경 없었으므로 불필요 판단).

## 2026-09-02 — 세션 9: `md_src/guides` 전체 재검증 (세션 1의 "40개 팩트체크"가 부실했음을 확인)

- **발단**: 사용자가 `Grabit.md`를 보고 "이미지 수집 프로그램이라는 설명이 잘못된 것 같고, 이름도 Grabbit 아니냐"고 지적. 확인해 보니 `Grabit.md`는 세션 1의 "md_src/guides 전체(40개) 팩트체크" 대상에서 **아예 누락**되어 있었음(git diff에 한 번도 등장한 적 없는 파일) — `Everything.md`·`Snipaste.md`도 같은 이유로 누락. "전체 40개"라는 세션 1 로그 자체가 부정확했던 것.
- **Grabit.md 실제 오류**: Chrome 웹스토어 확인 결과 실제 "Grabit"(개발자 digitalsoul)은 **스크린샷 캡처+주석(펜 드로잉)+AI 이미지 검색+링크 공유** 도구인데, 기존 문서는 완전히 다른 기능(페이지 내 이미지 대량 다운로드, 크기/형식 필터, "Grabify Image Downloader"라는 존재 확인 안 되는 별칭)을 서술하고 있었음 — 사실상 다른 도구를 지어낸 수준의 오류. 전면 재작성(정확한 4대 기능·설치법으로 교체, 이름이 비슷한 Grabbit/GrabText와 혼동 주의 alert-box 추가).
- **사용자가 지적한 국가대표 AI "3차 발표로 2개사 압축"도 재확인**: 실제로는 아직 3차 평가(최종 2팀 선정, 2027년 초 예정)가 진행되지 않았고, 2026-08-18에 발표된 것은 **2차 단계평가**로 4팀(LG·SKT·업스테이지·모티프)에서 모티프테크놀로지스가 탈락해 3팀(LG AI연구원·SK텔레콤·업스테이지)으로 좁혀진 것이었음. 어제(세션 8) 내가 작성한 "모티프 4번째 팀으로 합류"가 최종 상태인 것처럼 서술한 부분이 이미 부정확했던 것 — `한국AI서비스.md`의 국가대표 AI step-list를 4단계(1차 선정→모티프 합류→2차 평가 결과 3파전, 모티프 탈락→3차 평가 진행 전)로 재작성해 정확한 시점을 반영.
- **전체 재검증 실시**: 세션 1이 놓쳤을 다른 오류를 찾기 위해 나머지 39개 가이드 전체를 4개 그룹(AI 챗봇/어시스턴트 10개·AI 개발도구 9개·개발배포플랫폼 9개·지식노트/크리에이티브+유틸리티 11개)으로 나눠 병렬 웹 리서치 fork로 재검증. 확인된 실제 오류:
  - `chatGPT.md`: GPT-5.6 모델 변형명을 "Standard·Thinking·Pro"로 지어냈으나 실제는 **Sol·Terra·Luna**. Plus 플랜 설명에 "GPT-5.4 무제한"이라는 내부 모순(다른 곳은 전부 5.6)도 남아있었음 — compare-grid를 Sol/Terra/Luna 3단으로 재작성, Plus 플랜 문구 수정.
  - `Windsurf.md`: "2026년 6월 Cognition이 Windsurf를 인수" — **인수는 2025년 7월**, 2026년 6월 2일은 Devin Desktop으로의 **리브랜딩** 날짜였음(두 사건을 한 문장에 합쳐 날짜를 잘못 붙임). 두 날짜로 분리.
  - `v0.dev.md`: "2026년 1월 v0.app으로 개명" — 실제는 **2025년 8월 개명, 2026년 2월 3일 샌드박스 런타임 등 대규모 개편**. 두 시점으로 분리.
  - `Supabase.md`: "ChatGPT 계정으로 바로 로그인 가능"이 실제로는 원격 MCP 서버(OAuth2)를 ChatGPT 등 다른 MCP 클라이언트에서 연결하는 기능을 오해하기 쉽게 서술한 것이었음 — 정확한 표현으로 수정.
  - `Resend.md`: "Resend CLI 2.0"·"Agent Plugins 표준"이라는 출처 확인 불가능한 구체적 명칭 — 확인된 사실(Claude Code 공식 플러그인=MCP 서버+Skills 번들)만 남기고 미확인 버전명 삭제.
  - `notion.md`: "Custom Agents를 Free 플랜에서도 제한적으로 체험 가능"이 거짓 — 실제로는 **Business/Enterprise 플랜 전용**. 정정.
  - `영상음악AI.md`: Suno 무료 티어 "1일 5곡"이 실제(50크레딧/일 ≈ 10곡)와 다르고, 무료 플랜은 **v5에 접근 불가(v4.5 이하만)**라는 사실이 누락돼 있었음(스탯 헤더가 "Suno v5"라 무료로 v5를 쓸 수 있는 것처럼 오인 소지). Kling 3.0 "$6.99/월"은 **첫 달 한정 프로모션가**(실제 갱신가 $8.80~10)인데 상시가처럼 서술 — 3곳 모두 정정.
  - `디자인및시각화.md`: Canva "2.2억 사용자"는 2024년 수치, 2026년 기준 실제는 **2.65억+ MAU** — 갱신.
  - `NotebookLM Importer.md`: 실존하는 확장 프로그램의 정확한 이름은 **"NotebookLM Web Importer"**이고 단일 아티클 1-클릭 저장뿐 아니라 **열린 탭 전체·유튜브 재생목록·RSS 피드 대량 가져오기**가 핵심 기능인데, 기존 문서는 이름이 부정확하고 기능도 단일 저장으로 축소 서술 — 제목·기능·설치법 전면 정정.
  - `Codex.md`/`terminal-ai-tools.md`: `gpt-5-codex`가 이미 구형 — 현재는 ChatGPT 로그인 시 `GPT-5.5`, API 키 인증 시 `GPT-5.2-Codex`. `Copilot.md`: 2026-06-01 과금 방식 변경(Premium Request→AI Credits 토큰 기반)과 Pro+/Max 요금제 누락 — 추가. `Cursor.md`: `.cursorrules`는 deprecated, 현재 권장 방식은 `.cursor/rules/*.mdc` — 팁 교체. `Vscode.md`: "Codeium" 확장이 "Windsurf Plugin(구 Codeium)"으로 리브랜딩됐고 유지보수 모드 전환 사실 누락, 독립 에디터 Windsurf도 Devin Desktop으로 개명된 사실과 불일치 — 정정. (이 5개 파일은 병렬 리서치 fork가 조사 도중 스스로 수정까지 완료했고, 직접 diff를 검토해 적절함을 확인 후 그대로 채택.)
  - `Grok.md`/`perplexity.md`: 오류는 아니지만 실제 존재하는 요금제 누락 확인 — Grok에 SuperGrok Heavy($300/월), Perplexity에 Max($200/월) 티어 추가.
  - `Everything.md`·`Snipaste.md`: 세션 1에서 누락됐던 파일이지만 독립 재검증 결과 내용 정확함 확인(voidtools 검색 문법, Snipaste F1/F3 단축키 등 전부 사실과 일치) — 수정 불필요.
- **검증**: 수정된 18개 파일 전체를 개별 `build-guide.mjs`로 재빌드해 렌더링 오류 없음 확인, `npm test`(204/204) 통과.
- **후속 과제로 남긴 것**: 이번 재검증에서도 `Quartz.md`·`CapCut.md`는 시간 관계상 독립 검증을 못 했고, `Gemini.md`(Gemini 3 vs 3.1/3.5 세대차 가능성)·`Genspark.md`("80+ 도구" 수치 미확인) 등 저신뢰도 항목도 남아있음 — 다음 세션에서 이어서 확인 필요. 세션 1처럼 "전체 다 봤다"고 단정하지 않기 위해 명시적으로 기록.

## 2026-09-02 — 세션 10: Grabit→Grabbit 재정정, 원페이지 산출물 파일명 로직, 카테고리 표시 순서, storage/netlify 정체 확인

- **`Grabbit.md` 이름 재검증**: 세션 9에서 "Grabit"(단일 b, 스크린샷+주석+AI검색 도구)로 고쳤으나 사용자가 재차 "Grabbit 아니냐"고 지적 → 다시 조사한 결과 실제로는 **두 개의 서로 다른 실존 확장 프로그램**이 있었음: ① `Grabit`(단일 b, 개발자 digitalsoul, 설치 약 1,000) — 스크린샷+주석+AI 이미지 검색. ② `Grabbit`(더블 b, 개발사 MARCODE LTD, 설치 10만+, 4.0★) — 드래그로 링크 대량 선택 → 새 탭 일괄 열기/URL 복사/북마크, AI 스마트 필터링. 이 세션 중 브라우저 콘솔 로그에 `chrome-extension://madmdgpjgagdmmmiddpiggdnpgjglcdk`(=더블 b Grabbit의 확장 ID)가 실제로 찍힌 것을 확인 — 사용자가 실제 쓰고 있는 확장이 이쪽이었을 가능성이 높음. 설치 규모·인지도 모두 더블 b 쪽이 압도적으로 커서 이 문서가 다뤄야 할 도구로 판단, 전면 재작성 + 파일명도 `Grabit.md` → `Grabbit.md`로 `git mv`.
- **오류의 근원 확인**: `storage/netlify/guides/grabit.html`(2025년 푸터 표기)을 열어보니 md_src의 원래(틀린) "이미지 대량 다운로드" 서술과 토씨 하나 안 틀리고 동일함을 확인 — 이 오류는 cs_v2가 새로 만든 게 아니라 **2025년 원본 Lovable 사이트 콘텐츠부터 이미 틀려 있었고, cs_v2가 그대로 이식**한 것이었음.
- **`storage/netlify` 폴더 정체 확인**: `index.html`의 메타 태그(`<meta name="author" content="Lovable" />`, `og:image`가 `lovable.dev`)로 이 폴더가 **Lovable로 빌드된 React SPA의 정적 프로덕션 빌드 결과물**(해시된 Vite 번들 `assets/index-BnNkzIQV.js` 등)임을 확인 — `aitoolguide-ms.netlify.app`에 배포된 사이트의 원본이 맞음. `guides/` 하위에 가이드별 정적 HTML(`grabit.html` 등 21개)이 별도로 들어있어, React 셸이 이 정적 HTML을 iframe으로 불러 보여주는 구조로 추정됨(`c:\ai\creative-spark`의 `GuideViewer.tsx`가 `/guides/${file}`을 iframe src로 쓰는 코드와 일치). package.json·netlify.toml·_redirects 등 빌드/배포 설정 파일은 이 폴더 안에 없음 — **이미 완성된 정적 빌드 산출물**이라 `npm run dev` 같은 절차가 전혀 필요 없고, 정적 파일 서버(또는 Netlify의 정적 배포)로 그대로 서빙하면 됨. 다만 React Router 클라이언트 라우트(`/guide/:slug`)가 있는 SPA인데 `_redirects`/`netlify.toml`이 폴더 안에 없으므로, 실제 Netlify 사이트에서 새로고침 시 그 라우트들이 정상 동작하려면 Netlify 대시보드 쪽에 별도로 SPA 리다이렉트 설정이 되어 있어야 함(레포에서는 확인 불가, Netlify 사이트 설정에서 직접 확인 필요).
- **오프라인 허브 기본 출력 파일명에 "원페이지" 표시 도입**: `build-guide-hub.mjs`에 `defaultOutPath(folder)` 헬퍼 함수를 추가해 `--out` 미지정 시 기본 출력이 항상 `publish/<dir>-onepage.html` 형태가 되도록 변경(기존엔 `publish/<dir>.html`) — `--dir`로 폴더명이 바뀌어도 파일명 로직 한 곳에서 자동으로 "-onepage" 표시가 붙는다. `publish/guides.html`(구 기본 산출물)은 삭제하고 `publish/guides-onepage.html`로 재생성. `CLAUDE.md`·`README.md`·`docs/guide.md`·`docs/scripts_guide.md`의 기본 출력 경로 표기를 전부 갱신.
- **`ai_guide_standalone.html`은 "기본 로직"에 포함되지 않음을 확인·문서화**: 사용자 질문("같은 폴더에 standalone.html 파일명이 붙은게 있는데 기본 로직에 포함 안 되어 있나?")에 대한 답 — 맞음, `npm run guide:hub`(인자 없음)로는 생성되지 않고, `--out`을 두 번 넘기는 수동 실행(세션 3부터 이어온 관행)으로만 만들어짐. `docs/scripts_guide.md`에 이 사실을 명시.
- **카테고리 표시 순서 설정 위치 확인 + 재배치**: 사용자 질문("메뉴 순서 바꾸는 설정 어디서 하나, 예전에 json/yaml에서 한 것 같다")에 대한 답 — 현재는 `scripts/guide-categories.mjs`의 `CATEGORY_ORDER` 배열(세션 8에서 추출한 단일 출처)이 오프라인 허브(`build-guide-hub.mjs`)의 정렬 기준. "생산성 유틸리티"를 AI 연관성이 낮다는 이유로 맨 뒤(uncategorized 바로 앞)로 이동. ⚠️ 다만 `sync-guides-index.mjs`(React용 `src/data/guides.json`)는 `CATEGORY_ORDER`를 직접 참조하지 않고 **기존 `guides.json`에 저장된 순서를 그대로 보존**하는 로직이라 자동으로는 반영되지 않는 사실을 발견 — `docs/scripts_guide.md`에 이 괴리를 명시하고, `guides.json`의 `categories` 배열도 직접 재정렬해 두 산출물의 순서를 일치시킴.
- 검증: `Grabbit.md` 개별 빌드 무오류, `npm run guide:hub`(무인자) 실행 결과 파일명이 `publish/guides-onepage.html`로 나오는지 확인, 로컬 정적 서버로 열어 `DATA.categories` 순서(`productivity`가 마지막)와 `Grabbit (그랩잇)` 카드 정상 노출을 JS 콘솔로 직접 확인, `npm test`(204/204) 통과.

## 2026-09-02 — 세션 12: "standalone" 명명 재정리(onepage로 확정) + npm 스크립트 정리 + 웹 GUI를 새 파이프라인에 재연결

세션 11 직후 사용자가 "onepage와 standalone(웹앱 번들)은 원래 같은 개념이었다가 분리한 것 — 그렇다면 콘텐츠 쪽은 `-onepage.html`/`-spa.html`처럼 확실히 구분되는 이름으로 하자"고 확정, "3번째 standalone(GUI의 '독립 파일 단독 생성' 옵션)은 개별 md→html 생성이 이제 당연한 기능이 됐으니 이름에서 자연스럽게 빠져도 된다"고 판단. 이어서 "npm 스크립트 이름이 중구난방"이라는 지적과 "웹 GUI(폴더/파일 선택+3종+standalone 체크박스+출력폴더 변경)에 오늘 바꾼 게 반영되어 있냐"는 질문이 들어와 세 가지를 한 번에 정리.

- **`-standalone.html` → `-onepage.html`로 재확정**: `hub-config.mjs`(`outputs.standalone`→`outputs.onepage`), `build-guide-hub.mjs`(`defaultOutPath`, localStorage 키 `standalone-theme`/`standalone-sidebar`→`onepage-theme`/`onepage-sidebar`), `build-folder.mjs`(`--standalone`/`--no-standalone`→`--onepage`/`--no-onepage`), `md_src/guides`·`md_src/claudeguide`의 `hub.config.json`(`outputs.onepage`) 전부 갱신. `publish/guides-standalone.html`→`publish/guides-onepage.html`로 재생성.
- **`hub-config.mjs` API를 "폴더 절대경로 1개"로 단순화**: 기존 `loadHubConfig(mdSrcDir, folder)` 2-인자 방식을 `loadHubConfig(folderAbsPath)` 1-인자로 바꾸고, `resolveFolderDir(rootDir, dirArg)` 헬퍼를 신설 — `dirArg`가 짧은 이름("guides")이면 `md_src/<name>`으로, 경로 구분자가 섞였거나 절대경로면 그 경로를 그대로 소스로 해석한다. `build-guide-hub.mjs`·`build-folder.mjs`·`sync-guides-index.mjs` 전부 이 헬퍼를 공유. 목적: 웹 GUI에서 사용자가 OS 폴더 다이얼로그로 고른 `md_src` 밖 임의 폴더도 CLI와 동일한 로직으로 처리하기 위함. `build-folder.mjs`의 `path.join(ROOT, flags.outDir, ...)`가 절대경로 `--out-dir`을 잘못 이어붙이는 버그도 같이 발견해 `path.resolve`로 수정(임시 폴더로 실측 검증).
- **npm 스크립트 명명 규칙 통일**: "무슨 스크립트 파일을 부르는지"가 아니라 "무엇을 만드는지"로 통일 — `pptx:md`→`build:pptx`, `guide:hub`→`build:onepage`로 개명하고, 신규 `build:guide`(build-guide.mjs)·`build:presentation`(build-presentation.mjs) 별칭 추가. `build:standalone`(React 웹앱 번들)은 그대로 유지(이미 여러 시점기록 문서·리포트가 이 이름을 참조 중이라 이름을 바꾸면 손실이 더 큼 — 대신 "무엇이 다른지"를 CLAUDE.md에 표로 명시). `CLAUDE.md`에 6개 `build:*` 스크립트 전체를 정리한 표 신설.
- **웹 GUI 재연결 — 실제로 끊겨 있었음을 확인**: `MarkdownCompiler.tsx`(모듈 2)에 이미 파일/폴더 선택+3종 포맷 체크박스+저장위치 옵션+출력폴더 변경 UI가 있었지만, 뒤에서 호출하는 두 API(`/api/save-generate`의 `guideHub` 옵션, `/api/bulk-convert`)가 전부 오늘 이전에 만든 인프라와 무관하게 동작하고 있었음:
  - `guideHub` 저장 옵션이 부르던 `build-publish.mjs`는 `build-guide-hub.mjs`/`build-folder.mjs`를 전혀 호출하지 않아 코드 주석의 "update standalone.html"이 처음부터 거짓이었고(그런 산출물을 만드는 코드가 없음), 출력도 `publish/`가 아니라 Vite가 서빙하지 않는 별개 위치가 아닌 `public/guides/`(dev 서버가 서빙하는 폴더)로 향했음.
  - "빌드 완료: 가이드북 포털 허브 바로가기" 버튼이 `saveOption`과 무관하게 항상 `/publish/index.html`로 연결되도록 하드코딩돼 있었는데, 그 파일은 애초에 아무 스크립트도 만든 적이 없는 고아 파일(세션 10에서 `storage/legacy-standalone-pages/`로 이관한 바로 그 파일)이라 클릭해도 항상 404 — 오늘 이전부터 있던 버그.
  - `/api/bulk-convert`는 `build-guide.mjs`/`build-presentation.mjs`/`md-to-pptx.mjs`를 개별 `execAsync`로 직접 호출하며 포털 index.html도 자체 생성 — `build-folder.mjs`와 로직이 상당 부분 겹치는 4번째 독립 구현이었고, 포털 페이지는 Tailwind CDN 스크립트에 의존해 **인터넷 연결이 있어야만 정상적으로 보임**(이 프로젝트의 다른 오프라인 산출물들과 원칙이 어긋남).
  - 수정: `guideHub` 옵션은 이제 `sync-guides-index.mjs` + `build-folder.mjs --dir guides --out-dir public --guide --presentation --pptx --hub --onepage`를 호출하고, 성공 시 응답에 `portalUrl: "/guides-onepage.html"`을 실어 보낸다. 프론트는 서버가 준 `portalUrl`이 있을 때만 링크를 노출(하드코딩된 죽은 링크 제거). `/api/bulk-convert`는 로직 중복은 남겨뒀지만(입력/출력 폴더가 flat하게 매칭되는 기존 동작을 그대로 지키기 위해 `build-folder.mjs`로의 완전 이관은 보류 — 그러면 출력이 한 단계 더 중첩되는 구조 변경이 되어 사용자가 지정한 출력 폴더 의미가 바뀌기 때문), 포털 페이지의 Tailwind CDN 의존은 인라인 CSS로 제거하고, `outputDir`이 `public/` 밖일 때는 `portalIndex`를 `null`로 돌려줘 프론트가 죽은 링크를 만들지 않게 함.
  - `saveOption`의 세 번째 "standalone" 용례도 정리: `"standalone" | "guideHub"` → `"export" | "guideHub"`로 개명, 드롭다운 라벨도 "독립 파일 단독 생성"→"임시 내보내기 (컬렉션에 저장 안 함)", "가이드 허브 목록 추가 및 전체 빌드"→"가이드 컬렉션에 저장 + 전체 재빌드"로 변경.
  - `public/`이 지금까지 `.gitignore`에 없어 git status에 통째로 잡히고 있던 것도 발견 — `dist/`·`publish/`와 동일하게 `public/*` + `!public/.gitkeep` 패턴 추가.
- **실브라우저 E2E 검증**: `npm run dev`로 실제 Vite 개발서버를 띄우고, 모듈 2에서 테스트 문서를 작성해 "가이드 컬렉션에 저장 + 전체 재빌드"로 저장 → 저장 직후 `public/guides/*`(42→43개 파일) 전량 재생성, `public/guides-onepage.html` 재생성, "빌드 완료: 가이드북 포털 허브 바로가기" 버튼이 정확히 `/guides-onepage.html`로 연결되고 실제로 새 가이드가 포함되어 열리는 것을 JS 콘솔로 직접 확인. 이후 테스트 산출물 전부 정리(`md_src/guides`에서 임시 파일 삭제 + `sync-guides-index.mjs` 재실행으로 42개로 복귀).
- 검증: `npx tsc --noEmit`(에러 없음), `npm test`(204/204), 임시 폴더로 `build-folder.mjs`의 절대경로 `--dir`/`--out-dir` 지원 실측, 실제 dev 서버+브라우저로 GUI 저장 흐름 전체 E2E 확인.

## 2026-09-02 — 세션 11: 폴더 빌드 아키텍처 정리 — hub.config.json 도입 + `build-folder.mjs` 오케스트레이터 + Grabit/Grabbit 분리

세션 10 보고를 본 사용자가 "Grabit·Grabbit이 진짜 다른 도구다, 둘 다 넣어라" + "`-onepage`가 아니라 `-standalone`이 맞다(서버 없이 혼자 실행 가능하다는 의미)" + "카테고리 설정이 `guide-categories.mjs`(JS 코드)에 박혀있는 건 하드코딩에 가깝다, 폴더별로 분리하고 json 하나 고치면 index·standalone 순서가 같이 바뀌어야 한다" + "폴더 선택 시 개별 3종+묶음 index+standalone 옵션+프레젠테이션 통합덱까지 한 번에 되어야 한다, 기존 스크립트는 그대로 두고 순차 실행하는 오케스트레이터를 추가해라" + "고아 3종 파일은 지우지 말고 별도 폴더로 이관해라"는 5가지 결정을 내림에 따라 아키텍처를 다시 정리.

- **Grabit vs Grabbit 재확인 → 둘 다 복원**: 세션 10에서 "Grabbit(더블 b)가 맞다"며 `Grabit.md`를 삭제하고 `Grabbit.md`로 교체했었는데, 사용자가 "Grabit도 진짜 다른 도구다"라고 재지적. 다시 확인해도 결론은 동일(① `Grabit` 단일 b, digitalsoul, 스크린샷+주석+AI검색, 설치 ~1,000 ② `Grabbit` 더블 b, MARCODE LTD, 링크 대량 수집, 설치 10만+) — 이번엔 삭제하지 않고 `md_src/guides/Grabit.md`를 별도 파일로 복원해 둘 다 유지(총 42개 가이드).
- **`hub.config.json` 도입 — 카테고리 설정을 폴더별 JSON으로 분리**: `scripts/guide-categories.mjs`(전역 JS 상수, `md_src/guides`용으로 만든 걸 다른 폴더도 그대로 재사용하던 구조)를 삭제하고 `md_src/<dir>/hub.config.json`(폴더마다 독립)으로 대체. 새 로더 `scripts/hub-config.mjs`(`loadHubConfig`/`categoryMetaFor`/`sortByCategoryOrder`)가 유일한 접근 지점이며, 파일이 없는 폴더는 안전한 기본값으로 동작(하위호환). `md_src/guides/hub.config.json`(12개 카테고리, productivity 맨 뒤)·`md_src/claudeguide/hub.config.json`(3개 카테고리) 작성.
- **`sync-guides-index.mjs`도 같은 `hub.config.json`을 읽도록 통합**: 과거엔 `guides.json`에 저장된 기존 카테고리 순서를 그대로 보존하는 별도 로직이라 `guide-categories.mjs`를 바꿔도 반영이 안 되는 드리프트가 있었음(세션 10에서 발견) — 이제 `build-guide-hub.mjs`와 완전히 동일한 로더/정렬 함수를 공유해서, `hub.config.json` 하나만 고치면 두 산출물의 순서가 항상 같이 바뀐다. 개별 가이드의 slug/title/subtitle 수동 오버라이드 보존 기능은 유지.
- **파일명 로직 `-onepage` → `-standalone`**: "서버 없이 혼자 실행 가능한 형태"라는 의미를 정확히 담도록 재변경. `npm run build:standalone`이 만드는 React 웹앱 번들(`dist/webdesignsuite.html` 등)과 이름은 같지만 대상이 다르다는 점을 `docs/scripts_guide.md`에 명시(둘 다 "외부 파일 참조 없이 서버 없이 열린다"는 공통점은 있어 이름 자체는 일관성 있음).
- **`sidebar.defaultOpen` 옵션화**: standalone 허브 헤더에 ☰ 토글 버튼 추가, `hub.config.json`의 `sidebar.defaultOpen`이 초기 상태를 결정하고 사용자가 토글하면 `localStorage`에 저장되어 유지됨(테마 토글과 동일한 패턴).
- **`build-folder.mjs` 신설 — 폴더 단위 오케스트레이터**: 기존 4개 스크립트(`guide-core`/`presentation-core`/`md-to-pptx`/`build-guide-hub`)를 함수 레벨로 import해서 순차 호출만 하는 조합기. 플래그 없이 실행하면 "기본 세트"(개별 html+개별 presentation html+개별 pptx+폴더 `index.html`)가 나가고, `--all`이면 전부(+standalone+통합 프레젠테이션 덱), 개별 플래그(`--guide`/`--presentation`/`--pptx`/`--hub`/`--standalone`/`--presentation-bundle`)로 원하는 것만 선택 가능. `--standalone`/`--presentation-bundle`의 기본값은 `hub.config.json`의 `outputs`에서 가져오되 `--no-standalone`으로 강제로 끌 수 있음.
- **`publish/<dir>/index.html` 신설**: standalone 허브(본문 전체를 한 파일에 내장)와는 다른, 그 폴더 안에 실제로 생긴 개별 파일(html/presentation/pptx)로 링크만 거는 가벼운 정적 목록 페이지. `build-folder.mjs`의 `--hub` 플래그로 생성.
- **고아 3종 파일 이관**: `publish/ai-tools-guide.html`·`guide_v2.html`·`index.html`(제작 스크립트가 없는 고아 산출물, 개별 md에서 만들어진 것으로 추정)을 삭제하지 않고 `storage/legacy-standalone-pages/`로 이관 + 설명 README 추가. `publish/ai_guide_standalone.html`(내용이 새 `guides-standalone.html`과 100% 동일한 중복 파일)은 이제 기본 로직이 `-standalone` 이름으로 정확히 생성하므로 별도 유지할 이유가 없어져 삭제.
- **문서 동기화**: `CLAUDE.md`(scripts 목록·빌드 명령 예시), `README.md`(빌드 파이프라인 표에 `build-folder.mjs` 추가), `docs/guide.md`, `docs/scripts_guide.md`(3-1~3-3절로 확장: hub-config.mjs / build-guide-hub.mjs / build-folder.mjs), `package.json`(`build:folder` 스크립트 추가) 전부 갱신.
- 검증: `build-folder.mjs`를 `claudeguide`(4개 파일, 소규모)로 먼저 테스트 후 `guides`(42개 파일 전체)로 실행 — 개별 3종 85개 파일 + 폴더 index.html + standalone 허브 전부 정상 생성 확인. 로컬 정적 서버로 `publish/guides/index.html`(카테고리·링크 정상, productivity 마지막에 Grabit·Grabbit 둘 다 노출) 및 `publish/guides-standalone.html`(사이드바 토글 동작, DATA.ui.sidebarDefaultOpen 정상) 헤드리스 브라우저로 직접 확인. `npm test`(204/204) 통과.

## 2026-09-02 — 세션 13: 세션 1~12 커밋(c782f05) 후 문서화 재점검 — 실제로 놓친 게 있었음

사용자가 "문서화도 완료된건가? 더 오류사항이나 검증할 사항은 없는지 점검"이라고 요청 — 커밋 직후라 "다 됐다"고 낙관하지 않고 실제로 grep 기반 재점검을 수행. 결과적으로 세션 12의 `-onepage` 재개명이 일부 문서에는 반영되지 않은 채 커밋됐음을 확인.

- **`docs/guide.md`·`README.md`에 남아있던 `-standalone.html`(콘텐츠 번들) 표기**: 세션 12에서 `CLAUDE.md`·`docs/scripts_guide.md`는 onepage로 갱신했지만 이 두 파일은 빠뜨렸음 — `publish/guides-standalone.html` 등 실제로는 더 이상 만들어지지 않는 파일명이 예시 명령어에 그대로 남아있었음. `npm run build:onepage -- --dir guides`/`npm run build:folder -- --dir guides` 형태로 정정.
- **`README.md`의 카테고리 관리 설명이 구조 전(guide-categories.mjs 시절)에 머물러 있었음**: "라벨을 바꿀 땐 두 파일을 함께 수정" 같은, 세션 11에서 이미 해소한 드리프트를 여전히 안내하고 있던 문장을 `hub.config.json` 단일 출처 설명으로 교체.
- **`README.md`의 `scripts/` 폴더 트리에 `build-folder.mjs`·`hub-config.mjs`·`sync-guides-index.mjs`·`build-publish.mjs`가 통째로 빠져 있었음**: 이번 세션에 만들거나 역할이 바뀐 스크립트들이 트리에 반영 안 된 상태로 커밋됐던 것 — 전부 추가하고 각 npm 스크립트 이름도 주석에 병기. `publish/`·`storage/` 옆에 `public/`(신설, gitignore) 항목도 추가.
- **`CLAUDE.md`의 테스트 개수가 "117건/192개"로 굳어 있었음**: 실제로는 세션 5(2026-09-01)에 이미 117→129로 늘었는데 그 이후 한 번도 CLAUDE.md 본문 수치가 안 고쳐진 채 여러 세션을 거쳐온, 오늘 작업과 무관한 훨씬 오래된 드리프트. `npm test` 실측(204개 전체 = wcag 18 + pptx-analyzer 23 + client-compiler 24 + shortcode-conformance 129 + pptx-transform 10)으로 4곳 전부 정정. 특히 `wcag.test.ts (전체 192개)`는 "전체 스위트 총합을 wcag 파일 개수인 것처럼 잘못 라벨링"한 상태였던 것도 확인 — 파일별 정확한 개수로 재작성.
- **`src/standalone/` 트리 항목이 세션 6 리네이밍 이전 이름(`module1-main.tsx`/`module2-main.tsx`) 그대로였음**: 실제 파일은 `design-system-main.tsx`/`guide-authoring-main.tsx`/`pptx-inspector-main.tsx` 3개로 이미 바뀐 지 오래(세션 6~7)인데 `CLAUDE.md` 트리만 안 고쳐져 있었음 — 정정.
- **범위 밖으로 남겨둔 것(의도적)**: `docs/docs_index.md`의 "26종의 대화형 숏코드"(현재 정식 25+alias 13과 불일치)는 오늘 세션들이 손댄 적 없는 훨씬 이전(2026-06 이전 추정) 드리프트라 이번 점검 범위에서 제외 — 건드리면 관련 없는 변경이 섞여 들어갈 우려. 별도로 처리 필요.
- **콘텐츠 신뢰도 관련 오픈 아이템 재확인(수정 없음, 이미 정확히 기록돼 있음)**: `Quartz.md`·`CapCut.md`는 세션 9 재검증에서 독립 검증 못 함, `Gemini.md`(Gemini 3 vs 3.1/3.5)·`Genspark.md`("80+ 도구") 저신뢰 — 전부 세션 9 worklog 항목에 이미 명시돼 있고 "다 됐다"고 잘못 표시된 곳 없음을 확인.
- 검증: `npm test`(204/204), `npx tsc --noEmit`(에러 없음).

## 2026-09-02 — 세션 14: docs_index.md 숏코드 개수 정정 + Quartz/Gemini 콘텐츠 최신화(CapCut·Genspark는 검증 결과 정확했음)

세션 13에서 범위 밖으로 남겨뒀던 `docs/docs_index.md`의 "26종 숏코드"와, 세션 9부터 미확인으로 남아있던 4개 콘텐츠 항목(Quartz/CapCut/Gemini/Genspark)을 마저 처리해달라는 요청에 따라 진행.

- **`docs/docs_index.md` "26종" 정정**: `docs/shortcode-reference.md`를 직접 대조한 결과 세션 13에서 언급한 "25+13"조차 이미 구식이었음을 확인 — 실제로는 세션 5(2026-09-01)에 데이터 다이어그램 3종이 추가되며 **28종 정식 + 14종 alias**로 늘어나 있었음. 정확한 값으로 갱신.
- **Quartz.md 오류 수정**: 설치 명령이 `npm create quartz@latest`(존재하지 않는 명령)로 잘못 기재돼 있었음 — 실제로는 `git clone https://github.com/jackyzha0/quartz.git && cd quartz && npm i && npx quartz create`가 맞는 흐름(공식 문서 직접 확인). Node v22/npm v10.9.2 요구사항, "Quartz 5" 버전 표기, `npx quartz build --serve` 로컬 프리뷰 명령은 전부 정확한 것으로 확인돼 그대로 둠.
- **Gemini.md 세대 표기 최신화**: "Gemini 3"(Pro/Flash/Deep Think) 평평한 표기가 한 세대 뒤처져 있었음을 확인 — Google 공식 블로그 기준 Pro는 3.1로, Flash는 3.5→3.6을 거쳐 3.7로(2026.08) 이미 갱신됨. "Gemini 3.5 Pro"는 TechCrunch(2026.07.21) 보도대로 **출시된 적 없음**(일정 밀림). 모델 라인업 카드 3개(Pro/Flash/Deep Think)와 배지·통계 값을 3.1/3.7/3.1로 정정, Gemini Notebook의 "Gemini 3.5 기반" 단정도 근거 수준에 맞춰 "3.5세대 모델을 순차 도입 중"으로 완화. Nano Banana Pro의 "Gemini 3 Pro Image" 표기는 이번 리서치가 직접 다루지 않아 건드리지 않음(별도 세션에서 이미 출처 확인된 내용).
- **CapCut.md·Genspark.md는 검증 결과 정확했음, 수정 없음**: "AI Auto-Edit"·"Director Mode"는 둘 다 실제 CapCut 기능(2026년 보도 기준 거의 동일한 설명)으로 확인. Genspark "80+ 통합 도구"도 Genspark 자체 발표 외에 제3자 보도(blockchain.news 등)에서도 일관되게 확인되는 수치로, 과장이 아님을 확인.
- 검증: `build-guide.mjs`로 Gemini.md·Quartz.md 개별 재빌드 무오류, `npm test`(204/204) 통과, `build-folder.mjs --dir guides`로 전체 42개 재빌드 및 `guides-onepage.html` 갱신.

## 2026-09-03 — 세션 15: `md_src/study/` 신설 — claudeguide 4개 문서 + Obsidian 원고 통합해 3부작 강의 자료 재편

세션 14까지의 `md_src/claudeguide/`(claude_guide.md·ai-tools-guide.md·guide_summary.md·myproject_guide.md, 총 4개, 상당 부분 중복·구버전 표기 혼재) 및 훨씬 상세한 별도 원고(`C:\obsidian\msshin\10-Projects\myproject\myproject_guide\` 23챕터 12,090줄)를 사용자가 "중복 제거 + 최신화 + 범용화해서 새 강의 자료로 통합해달라"고 요청(전날 세션에서 목차까지 확정했으나 세션 한도로 콘텐츠 작성 전 중단 — `docs/report/study_planning_log_2026-09-02.md`로 이관한 로그가 그 경위 기록). 이번 세션에서 목차를 재검토·구체화한 뒤 실제 3개 파일을 작성하고 3종 포맷까지 publish.

- **목차 재확정 (사용자 피드백 반영)**: Part1(AI 사용법) §2에 `C:\obsidian\msshin\60-AI\프롬프트\(기본원칙) 프롬프트작성가이드.md`(프롬프트 5요소·CoT/ToT·설계 7대원칙·생성→개선→적용 프로세스·플랫폼별 등록법)를 추가 반영. Part3(내 프로젝트)는 원래 7섹션(Obsidian 7부 대표 챕터 1:1 매핑)에서 **6섹션으로 재편** — §2 "문서 자동화"를 `ch07_creative_spark` 대신 `ch06_slide_pipeline`+`ch04_ai_report`(SkillA/B/C 3종 스킬 조합)로, §5·§6 "업무자동화"+"인프라"를 병합해 `ch17_hr_automation`/`ch18_n8n_server` 대신 실제 운영 중인 별도 프로젝트 `C:\ai\mywiki`(README.md/AGENTS.md — Obsidian→Quartz→Vercel/GitHub Pages 이중배포 파이프라인)로 교체.
- **`guide_summary.md` 최신화 여부 확인**: 사용자가 "어제 기존 md파일 업데이트했다, guide_summary에 반영됐는지 확인 후 진행"이라고 요청 — 확인 결과 `guide_summary.md`는 2026-06-11 마지막 수정으로 **어제(9/2) 세션의 콘텐츠 팩트체크(커밋 `c782f05`)는 `md_src/guides/` 41개 문서만 대상**이었고 `claudeguide/`는 건드리지 않아 반영 안 된 상태임을 확인. guide_summary.md 자체는 고치지 않고, 새로 쓰는 study/ 원고에 최신 팩트를 직접 반영하는 방식으로 처리.
- **3개 파일 신규 작성** (fork 3개 병렬 실행 — 1개는 첫 실행에서 파일을 실제로 쓰지 않고 완료 보고만 남기는 이상 동작이 있어 재개(resume)시켜 완료):
  - `md_src/study/01-ai사용법.md`(732줄, 39.6KB) — 7섹션, `claude_guide.md`+`ai-tools-guide.md`(§1~5,7,12,13) 통합, Claude 전용 서술을 범용 원리로 재구성.
  - `md_src/study/02-도구종류.md`(476줄, 25.2KB) — 7섹션, `guide_summary.md`(6대 분류)+`ai-tools-guide.md`(§7~11) 통합.
  - `md_src/study/03-내프로젝트.md`(436줄, 21.5KB) — 6섹션, Obsidian 원고 하이라이트(핵심구조+코드 1개+트러블슈팅 1개+한줄요약 압축) + mywiki 위키발행시스템.
  - 팩트 정정 3개 파일 전체 반영: Claude 세대(Fable 5/Opus 5/Sonnet 5/Haiku 4.5), Gemini(3.1 Pro/3.7 Flash), Copilot 크레딧제 요금(Pro $10/Pro+ $39/Max $100), Quartz v4→v5(특히 mywiki 섹션), DALL-E 3→GPT Image 2.
- **`publish/study/` 3종 포맷 publish**: `build-guide.mjs`/`build-presentation.mjs`/`md-to-pptx.mjs`로 파일당 3종(html·presentation html·pptx) 총 9개 산출, 빌드 에러 없음.
- **`cha.md` 폴더 밖 이관**: 어제 세션 중단 시점의 대화 로그(전날 사용자가 직접 커밋)가 `md_src/study/cha.md`에 그대로 남아있었음 — frontmatter도 숏코드 문법도 없는 순수 텍스트 로그라, `build-folder.mjs`가 폴더 안 `.md`를 전수 glob하는 구조상(`scripts/build-folder.mjs:64-65`, 확장자 필터만 있고 제외 목록 없음) 향후 `npm run build:folder -- --dir study --all` 등을 돌리면 그대로 섞여 들어가 깨진 챕터를 만들 소지가 있었음. 삭제 대신 `git mv`로 `docs/report/study_planning_log_2026-09-02.md`로 이관해 이력 보존.
- 검증: `npm test`(204/204), `grep`으로 study/*.md 3개 파일 내 구버전 팩트 표기(4.6/DALL-E 3/Quartz v4/Gemini 3() 잔존 없음 확인(이관된 로그 파일에만 구표기가 남아있는 게 정상), `publish/study/*.html` 내 잔존 `:::` 전수 확인 — 전부 mermaid 다이어그램의 클래스 지정 문법(`node:::className`)이라 정상.
- 다음 계획: 사용자가 study/ 3파일 최종 검수(특히 03의 압축 과정에서 생략한 "향후 계획" 절, GitHub Actions YAML 등) 후 이상 없으면 커밋.

## 2026-09-03 — 세션 16: study/01 내용 검수 중 발견한 프로젝트 전역 렌더러 버그 3건 수정 + standalone `suite` 빌드 네이티브 크래시 조사(미해결, 기록만)

사용자가 `01-ai사용법.md`를 IDE에서 직접 읽다가 세 가지를 지적: ① 프롬프트가이드 인용 카드(`\"...\"` 백슬래시가 그대로 노출) ② CoT/ToT `feature-grid` 박스 안 글자 겹침 ③ 횡슬라이드에서 세로형 mermaid 하단이 고정 컨트롤에 가려짐 + 버튼에 마우스 올리면 텍스트가 흔들림. 개별 요청처럼 보였지만 조사 결과 전부 **이 파일만의 문제가 아니라 렌더링 파이프라인 자체의 기존 버그**였음.

- **`\"` 이스케이프 미처리 버그 (프로젝트 전역, study/01 국한 아님)**: 숏코드 파서의 `cleanValue()`가 앞뒤 따옴표 1글자만 벗기고 내부 `\"` 이스케이프는 전혀 처리하지 않아, desc 안에 인용구를 쓰면 백슬래시가 그대로 렌더링됨. `grep`으로 확인한 결과 `md_src/guides/Claude.md` 등 **기존 파일에도 이미 있던 버그**(`\"추가 확인 필요\"` 등)였음 — 이번에 처음 생긴 게 아니라 원래도 깨져 있었는데 아무도 눈치채지 못했던 것. `cleanValue`가 3곳에 중복 구현돼 있어(`scripts/shortcode-render.mjs`, `scripts/md-to-pptx.mjs`, `src/lib/pptx-browser.ts`) 세 곳 모두 동일하게 수정 — 앞뒤가 대칭된 큰따옴표로 감싸인 경우에 한해 `\"` → `"`, `\\` → `\` 언이스케이프를 추가.
- **`feature-grid`/`icon-grid` PPTX 렌더러의 제목 높이 고정값 버그**: 카드 제목이 몇 줄인지 계산하지 않고 항상 1줄 기준 고정 높이(`h += 0.34` 등)로 본문 시작 위치를 잡고 있어서, 4열처럼 카드 폭이 좁아 제목이 2줄로 넘어가면 본문 영역과 겹침. `helpers.estimateLines()`(desc에는 이미 쓰이고 있었음)를 제목에도 동일하게 적용해 실제 줄바꿈 수만큼 동적으로 높이를 확보하도록 `scripts/pptx-renderers/feature-grid.mjs`·`icon-grid.mjs` 수정.
- **프레젠테이션(횡슬라이드) 3개 버그**: (1) 테마토글·목차토글·이전/다음 버튼 3종이 전부 `backdrop-filter: blur()` + `:hover{transform:scale()}` 조합이라, 블러 필터가 걸린 요소를 확대할 때마다 뒤에 비치는 슬라이드 텍스트가 흔들리는 렌더링 아티팩트 발생 → 세 버튼 모두 hover의 `transform:scale()` 제거(배경/그림자 변화는 유지). (2) mermaid SVG에 크기 제한이 전혀 없어 세로로 긴 다이어그램이 자연 크기 그대로 렌더링 → `.mermaid svg { max-width:100%; height:auto; }` 추가(가이드 코어에도 동일 적용, 재발 방지). (3) 슬라이드는 `overflow-y:auto`로 스크롤은 되지만 화면 하단에 고정된 컨트롤(이전/다음 버튼+진행바)이 스크롤과 무관하게 항상 떠 있어 끝까지 스크롤해도 마지막 ~80px가 가려짐 → `.slide` 하단 패딩 80px→140px로 확대(`scripts/presentation-core.mjs`).
- **`build:standalone`(webdesignsuite.html, 모듈 1+2+3 통합 React 앱 번들) 네이티브 크래시 — 미해결, 조사 기록만 남김**: `npm run build:standalone`이 매번 "1676개 모듈 변환 완료" 직후 `0xC0000005`(Windows 접근위반)로 죽음. 격리 결과: 모듈 1/2/3 **개별** standalone 빌드(660KB/1.1MB/415KB)는 전부 정상, **셋을 `vite-plugin-singlefile`로 한 파일에 강제 병합하는 `suite` 엔트리만** 재현 크래시(총 3회 재현, 동일 지점). Vite 8은 내부적으로 Rust 기반 신생 번들러 Rolldown을 쓰는데(`vitejs/rolldown-vite`가 최근 Vite 코어로 편입), `vite-plugin-singlefile`이 강제하는 단일 거대 청크 병합 단계에서 네이티브 크래시가 나는 것으로 추정. vite 8.0.16→8.2.2(rolldown 1.0.3→1.2.7) 업그레이드 및 `--minify false` 둘 다 시도했으나 **동일하게 재현**되어 기존 버전 문제가 아님을 확인 — 업그레이드는 효과 없어 `git checkout`으로 원복(package.json/lock 변경 없음). 콘텐츠 발행 파이프라인(`build-guide`/`build-presentation`/`md-to-pptx`)과는 독립적이라 이 세션의 study/ 작업엔 영향 없음. **다음 조치가 필요하면**: ① Rolldown GitHub에 재현 조건(모듈 개수·`vite-plugin-singlefile` 사용·크래시 지점)을 이슈로 제보하거나 ② `suite` 빌드를 "3개 미리 빌드 후 탭 전환으로 갈아끼우기" 구조로 바꿔 애초에 단일 거대 청크 병합을 피하는 아키텍처 변경(범위가 커서 별도 설계·승인 필요) 중 택일.
- 검증: `npm test`(204/204, cleanValue·렌더러 수정 후에도 유지), study/ 3파일 전부 3종 재빌드(01은 PowerPoint에서 열려있어 `01-ai사용법_20260903012347.pptx`로 대체 저장됨 — 원 파일명 재저장은 사용자가 PowerPoint를 닫은 뒤 필요), 백슬래시·hover-scale 제거·`padding: 80px 100px 140px` 반영을 재빌드된 HTML에서 grep으로 직접 확인.
- 다음 계획: `01-ai사용법.pptx` 파일명 정리(PowerPoint 종료 후), study/ 3파일 최종 검수 후 커밋. `build:standalone` suite 크래시는 사용자 판단에 따라 이슈 제보 또는 아키텍처 변경 착수.

## 2026-09-03 — 세션 17: study/ onepage 허브 생성 + 프로젝트 전역 사이드바 붕괴 버그 발견·수정 + 히어로 문구 폴더별 오버라이드 + 3파일 통합 프레젠테이션 검증

사용자가 `md_src/study/` 폴더를 onepage HTML로 합쳐달라고 요청하면서 세 가지를 같이 확인해달라고 함: ① 히어로 섹션 문구("AI·생산성 도구를 카테고리별로...")가 study 콘텐츠와 안 맞는데 수정 가능한지 ② 3개 study md를 횡형 프레젠테이션 한 덱으로 합칠 수 있는지 ③ 최근 요청한 "onepage 왼쪽 메뉴 숨김/표시" 기능이 실제로는 토글 시 **내용 전체**가 사라진다고 보고.

- **③ 사이드바 토글 시 본문 전체 소실 — 프로젝트 전역 버그, 브라우저로 재현·확정**: `npm run build:onepage -- --dir study`로 빌드 후 Chrome에서 직접 클릭 재현. JS로 DOM 진단한 결과 `#main`의 `innerHTML`은 그대로 있는데(콘텐츠 안 사라짐) `getBoundingClientRect().width`가 0 — 원인은 `#sidebar`에 `display:none`이 걸리면 **CSS Grid auto-placement가 남은 유일한 grid item인 `#main`을 1번(0px) 트랙으로 재배치**하는 것(display:none인 grid item은 레이아웃에서 완전히 빠지고, 남은 아이템이 처음 트랙부터 다시 채워지는 CSS Grid의 잘 알려진 함정). `.sa-sidebar{grid-column:1}` / `#main.sa-main{grid-column:2}`를 명시적으로 고정해 해결(`scripts/build-guide-hub.mjs`) — `study`뿐 아니라 이미 배포된 `guides-onepage.html`·`claudeguide-onepage.html`도 동일 버그였으므로 둘 다 재빌드해 반영. Chrome MCP로 프로그래밍 클릭 토글 왕복(collapsed↔open, mainWidth 0→1924→1644px) 확인.
- **① 히어로 문구 폴더별 오버라이드 추가**: 기존엔 배지/타이틀/설명 3줄이 `build-guide-hub.mjs`에 리터럴 문자열로 박혀 있어(CLAUDE.md 규칙 1 위반, "AI·생산성 도구" 문구가 모든 폴더에 강제 적용됨) study처럼 성격이 다른 폴더엔 안 맞았음. `hub.config.json` 스키마에 `hero`(`badge`/`titleLine1`/`titleAccent`/`desc`, `desc`는 `{count}` 플레이스홀더로 가이드 수 자동 치환) 추가 — `scripts/hub-config.mjs`의 `DEFAULT_HERO`가 기존 문구를 기본값으로 유지해 `guides`/`claudeguide`는 무수정으로 그대로 동작. `md_src/study/hub.config.json` 신규 작성(카테고리 3종을 실제 study 파일의 style frontmatter (`custom-blue`/`productivity`/`ai-dev`)에 맞춰 라벨링 + 커스텀 히어로 문구 "📚 AI 활용 강의 자료 3부작" 등). `docs/scripts_guide.md`의 hub.config.json 예시·설명에도 반영.
- **② 3개 md → 통합 횡형 프레젠테이션 — 이미 지원되는 기능, 확인만**: `npm run build:presentation -- "md_src/study/*.md" --out publish/study_slides.html`로 glob 병합이 기존 `build-presentation.mjs`에서 그대로 되는 것을 확인(`✅ ... (3개 파일)`). 새 코드 불필요.
- 검증: `npm test`(204/204), Chrome에서 `study-onepage.html` 실사용 흐름(히어로 문구·카테고리 pill 라벨/색상/카운트·사이드바 토글 양방향) 스크린샷+DOM 진단으로 확인, `guides-onepage.html`·`claudeguide-onepage.html` 재빌드 무오류, `docs/scripts_guide.md` hub.config.json 문서 갱신.
- 다음 계획: study/ 3파일 최종 검수 후 커밋(이번 세션 변경분 포함 — `hub-config.mjs`·`build-guide-hub.mjs`·`md_src/study/hub.config.json` 등).

## 2026-09-03 — 세션 18: onepage 허브에서 mermaid가 완전히 렌더링 안 되던 버그 발견·수정 + 프론트엔드(Vite dev 서버) 기동 확인

사용자가 "프론트엔드도 반영되냐, 띄워봐" 요청 중 `publish/study-onepage.html`을 직접 열어보다가 "mermaid 플로우차트가 텍스트로 나온다"고 보고. `01-ai사용법_presentation.html`·`.html`은 정상 렌더링(직접 열어 SVG 변환·콘솔 무오류 확인)되는데 onepage 허브만 문제였음.

- **onepage 허브는 mermaid 스크립트 자체가 아예 없었음**: `build-guide-hub.mjs`가 각 가이드의 `guide-core.buildHtml()` 결과에서 `<style>`/`<body>`만 추출해 저장하는 구조라, 원본에 있던 `<script src=mermaid...>` 태그 자체가 애초에 onepage 산출물에 들어간 적이 없었다(가이드/프레젠테이션 단독 빌드에만 있던 것). `MERMAID_TAG` 상수로 CDN 스크립트+`mermaid.initialize({startOnLoad:false})`를 onepage HEAD에 추가.
- **Shadow DOM이라 `startOnLoad`로는 어차피 못 그림**: onepage 허브는 가이드 본문을 클릭 시마다 새 Shadow Root에 주입하는 SPA 구조라(`renderShadowContent()`), mermaid의 기본 `document.querySelectorAll('.mermaid')` 스캔은 shadow 경계를 못 넘어 애초에 동작 불가능한 구조였음 — `startOnLoad:true`로 스크립트만 추가했다면 여전히 안 그려졌을 것. `renderShadowContent()`에서 `innerHTML` 주입 직후 `mermaid.run({ nodes: [...shadow에서 찾은 .mermaid 요소들] })`을 직접 호출하도록 수정.
- **오프라인 원칙과의 긴장 관계(미해결, 사용자에게 별도 보고)**: mermaid가 여전히 `cdn.jsdelivr.net`에 의존해서, onepage 허브의 "인터넷 없이도 작동합니다" 문구와 진짜 무인터넷 환경에서는 어긋난다(과거 Tailwind CDN 제거와 동일 성격의 이슈). 이번 세션은 "렌더링 자체가 완전히 빠져있던 구조적 버그"만 고쳤고, "CDN 대신 mermaid를 로컬 번들로 인라인할지"는 새 npm 패키지 설치가 필요한 별도 결정이라 사용자 확인 후 진행하기로 보류.
- **프론트엔드(Vite dev 서버) 기동 확인**: `npm run dev`(포트 8080)로 실행, `dashboard.html`에서 모듈 1/2/3 탭 전환 정상 동작 확인. `client-compiler.ts`가 `guide-core.mjs`/`presentation-core.mjs`를, `pptx-browser.ts`가 `pptx-renderers/registry.mjs`를 **직접 import**하고 있어(코드로 확인), 오늘 고친 렌더러 수정사항(cleanValue 이스케이프, feature-grid/icon-grid 높이, mermaid 크기)이 CLI 빌드뿐 아니라 이 dev 서버의 실시간 미리보기에도 자동 반영됨을 확인. 단, `build-guide-hub.mjs`/`hub-config.mjs`(onepage 허브)는 Node 전용 스크립트라 React UI 자체에는 안 쓰이고, 웹 GUI의 "가이드 컬렉션 저장" 버튼이 API 경유로 호출할 때만 관여.
- 검증: `npm test`(204/204), Chrome MCP로 `study-onepage.html`에서 `route('guide:01-ai사용법')` 호출 후 Shadow Root 내부 `.mermaid` 2개 전부 `<svg>`로 변환됨을 JS로 직접 확인, `guides-onepage.html`·`claudeguide-onepage.html`도 동일 수정으로 재빌드(둘 다 mermaid 콘텐츠는 없지만 구조 일관성 유지).
- **[같은 세션, 후속] mermaid CDN → 로컬 조건부 인라인으로 전환 완료**: 사용자가 "진행"을 확정했으나, 처음 제시한 견적("300~400KB")이 실제로는 **3.3MB**(`node_modules/mermaid/dist/mermaid.min.js`, flowchart 외 모든 다이어그램 타입+katex 포함 UMD 번들)로 8~10배 틀렸음을 뒤늦게 발견해 사용자에게 정정 보고 후 재확인 — "mermaid 쓰는 문서에만 조건부 인라인"으로 확정.
  - `npm install mermaid@10`(CDN과 동일 메이저 버전 고정) 후 `dependencies`에 추가.
  - `guide-core.mjs`/`presentation-core.mjs`: 토큰 순회 중 mermaid 코드블록 존재 여부를 `hasMermaid` 플래그로 추적, `buildHtml()`/`buildPresentationHtml()`에 `mermaidScript`(원문 텍스트) 파라미터 추가 — `hasMermaid`가 true이고 `mermaidScript`가 주어지면 `<script>${mermaidScript}</script>`로 인라인, 없으면 기존 CDN 태그로 폴백(하위호환), `hasMermaid`가 false면 스크립트 자체를 아예 안 넣음. "환경 비의존(fs 없음)" 코어 계약을 지키기 위해 파일을 코어 안에서 직접 읽지 않고 **호출자가 문자열을 주입**하는 구조로 설계.
  - CLI 래퍼(`build-guide.mjs`/`build-presentation.mjs`): 모듈 로드 시 `node_modules/mermaid/dist/mermaid.min.js`를 1회만 읽어 캐시 후 코어 호출마다 주입.
  - `build-guide-hub.mjs`: 폴더 안 가이드 중 하나라도 `class="mermaid"` 본문을 포함하면(`hasMermaid`, `buildData()`에서 집계) onepage 공유 HEAD에 1회만 인라인 — 폴더 전체에 mermaid가 없으면 스크립트 자체가 안 들어가 파일 크기 영향 0.
  - `client-compiler.ts`(브라우저): `import mermaidScriptRaw from '.../mermaid.min.js?raw'`(기존 config `?raw` 패턴과 동일)로 같은 로컬 번들을 주입 — 서버(CLI)와 브라우저(dev 서버 미리보기)가 완전히 동일한 mermaid 소스를 쓰게 됨.
  - 결과: `study/01-ai사용법.html`(mermaid 2개 사용) 130KB→**3.47MB**, `study/03-내프로젝트.html`(mermaid 7개, 예상 못 했는데 실제로 있었음) 73KB→**3.41MB**, `study/02-도구종류.html`(mermaid 없음)는 **93KB 그대로**(영향 0) — 조건부 인라인이 의도대로 동작. `study-onepage.html` 3.69MB(스크립트 1회만 공유), `guides-onepage.html`(42개 가이드 중 mermaid 쓰는 문서 0개)·`claudeguide-onepage.html` 둘 다 **mermaid 스크립트 바이트 0**으로 확인.
- 검증: `npm test`(204/204, client-compiler 24개 포함 — `?raw` 3.3MB import에도 무관), Chrome에서 로컬 번들로 전환된 `study-onepage.html`을 다시 열어 `01-ai사용법`(2개)·`03-내프로젝트`(7개) 문서 mermaid 9개 전부 `<svg>` 렌더링 확인(CDN 없이, 콘솔 에러 없음), `grep`으로 02/guides/claudeguide에 mermaid 바이트 미포함 재확인.
- 다음 계획: study/ 3파일 + 이번 세션 스크립트 변경분(mermaid 오프라인화 포함) 전체 최종 검수 후 커밋.

## 2026-09-03 — 세션 19: study/ 3파일 전체 문체를 명사형 종결(개조식)로 전환 + 통합 프레젠테이션 덱 순서를 hub.config.json 기준으로 통일

사용자가 `01-ai사용법.md`의 특정 문단을 명사형 종결로 고쳐본 결과를 보고 "이 문단만이 아니라 study/ 전체 파일의 문체를 명사(명사형, 명사 우선) 종결어미로 바꾸자 (프롬프트 예시 등은 제외)"라고 범위를 확정. 또 "슬라이드형(통합 프레젠테이션)도 폴더/config 방식으로 통일해야 하지 않냐, order를 config로 조절하게"와 "hub.config.json의 categories.meta는 어디 쓰나, uncategorized는 왜 있나"를 질문.

- **문체 전환 — fork 3개 병렬 실행**: "~다/~한다/~된다/~해 준다/~이다" 서술어 종결을 명사형(개조식)으로 바꾸는 작업을 01/02/03 각 파일당 fork 1개로 병렬 처리. 세 fork 모두 실제 파일 크기 변화(01: 36.8KB→39.5KB, 02: 25.2KB→24.8KB, 03: 21.5KB→21.2KB)로 실물 반영을 재확인(지난 세션 fork 사고 재발 방지 차원에서 코디네이터가 직접 diff 확인). 총 변환 규모: 01번 약 90곳, 02번 약 40곳, 03번 약 22곳.
  - 제외 처리(3개 fork 공통 판단 기준, 일관되게 지켜짐): 큰따옴표로 감싼 프롬프트/대화 예시 원문, "실전 지침 예시 3종" 같은 복사해 쓰는 템플릿(`meta` 필드), `editor-box`/`cmd-box`의 실제 코드·명령어, mermaid/표 내부 텍스트, "AI 협업 레슨런 14원칙"처럼 검증된 원문을 승계한 섹션(어미만 조정, 내용 재해석 금지).
  - 경계 사례로 보고된 것: 02번의 `stat-grid` 4개 항목("무슨 상황인가/어떻게 돼야 하나" 등)은 의문형 프레이밍이라 명사형으로 바꾸면 "질문"이라는 의미 자체가 사라져 그대로 둠 — 타당한 판단으로 보고 승인.
- **통합 프레젠테이션 덱 순서 — `hub.config.json` 단일 기준으로 통일**: `build-folder.mjs`의 `--presentation-bundle`이 그동안 onepage 허브(카테고리 순서 적용)와 달리 **파일명 알파벳순**으로만 슬라이드를 배치하고 있었음(발견). `hubConfig.categories.order` 기준으로 `files` 배열 자체를 정렬하도록 수정 — 이제 onepage·폴더 index.html·통합 덱이 전부 같은 순서 기준을 공유. study의 `categories.order`를 일부러 `["ai-dev", ...]`로 뒤집어 통합 덱 첫 슬라이드가 실제로 바뀌는 것을 확인한 뒤 원래 순서로 복원해 검증. 겸사겸사 `build-folder.mjs`가 `presentation-core.mjs`/`guide-core.mjs`를 직접 호출하면서 세션 18에서 만든 `mermaidScript` 파라미터가 누락돼 있던 것도 발견해 3곳 모두 추가(오프라인 인라인 일관성 확보).
- **`categories.meta`/`uncategorized` 설명**: `meta`(label/description/color)는 파일 자체의 테마색(`config/styles.json`)과는 별개로, 여러 파일을 묶어 보여줄 때(onepage 사이드바·홈 카테고리 블록·필터 pill, 폴더 index.html, 통합 덱 순서)만 쓰는 그룹 UI 메타데이터임을 설명. `uncategorized`는 `style` frontmatter가 없거나 `categories.order`에 없는 값인 문서를 위한 안전망(현재 study 3파일엔 전부 style이 있어 비어있는 칸).
- 검증: `npm test`(204/204, 3회 반복), `node scripts/build-folder.mjs --dir study --all`로 개별 3종+폴더 index+onepage+통합 덱 전부 무오류 재생성, 임시 카테고리 순서 반전 테스트로 정렬 로직 실제 동작 확인. 중복된 구 산출물 `publish/study_slides.html`(세션 초반 수동 테스트 파일, `study-presentation-bundle.html`로 대체됨) 삭제.
- 다음 계획: study/ 3파일 + 이번 세션 스크립트 변경분(mermaid 오프라인화, presentation-bundle 순서 통일 포함) 전체 최종 검수 후 커밋 — 변경 파일이 많이 쌓여 있어 사용자 확인 후 진행.

## 2026-09-03 — 세션 20: `style`/`category` 완전 분리 + `config/styles.json` 11개 테마 키를 색 속성 기준으로 전면 개명

세션 19에서 "categories.order가 style 값을 재사용한다"고 지적한 뒤, 사용자가 근본 원인을 더 짚음: "`style`은 색상 테마를 정하는 필드지 카테고리(그룹핑)가 아니다", "`categories.meta`가 스타일명을 키로 써서 어떤 카테고리가 어떤 파일인지 알 수 없다", "통합 덱은 파일명순, onepage는 title순으로 그룹 내 정렬 기준이 서로 다르다". 이어서 "테마명 자체도 처음에 가이드 카테고리별로 만들다 보니 `productivity`/`ai-dev`처럼 모호하게 지어졌다, 속성(색)에 맞게 고치자"고 확장 — 개명 매핑표를 제시해 승인받고 진행.

- **`category` frontmatter 필드 신설 + 하위호환 폴백**: `fm.category || fm.style || "uncategorized"`를 `build-guide-hub.mjs`·`build-folder.mjs`(2곳: `--init-config` 스캔, 파일 정렬)·`sync-guides-index.mjs` 4곳에 동일하게 적용. `category`를 명시 안 한 기존 46개 문서(`guides`/`claudeguide`)는 지금처럼 `style` 값이 카테고리로 자동 대체되어 **마이그레이션 없이 그대로 동작**.
- **그룹 내 2차 정렬 기준 통일**: `build-folder.mjs`의 파일 정렬을 파일 경로가 아니라 **제목(title) 기준**으로 바꿔, onepage(`build-guide-hub.mjs`)·`sync-guides-index.mjs`와 동일한 기준을 쓰도록 통일(세션 19에서 놓쳤던 부분).
- **`config/styles.json` 11개 키 전면 개명**(팔레트·폰트 값은 무변경, 키·label만 교체): `custom-blue→sky-blue`, `ai-chat→emerald`, `ai-dev→terracotta`, `knowledge→indigo`, `productivity→cobalt-blue`, `creative→orchid`, `security→cyan`, `finance→amber`, `future→lime`, `enterprise→slate`, `media→rose`. 매핑표는 `CLAUDE.md`의 "스타일 테마 목록" 절에 반영(이전 키 컬럼 포함, 사용자 요청).
- **개명 전파 범위**: `md_src/guides`(38개)·`md_src/claudeguide`(4개)·`md_src/showcase/showcase.md`(1개) frontmatter의 `style:` 값 스크립트 일괄 치환. 코드 쪽 `"ai-chat"` 기본 폴백을 `"emerald"`로 8곳(`guide-core.mjs`·`presentation-core.mjs`·`md-to-pptx.mjs`) + 2곳(`pptx-browser.ts`) 교체, `client-compiler.ts`의 `FALLBACK_STYLES` 키 5개, `useThemeEditor.ts`/`useThemeMutations.ts`/`ThemePresetPanel.tsx`/`MarkdownCompiler.tsx`의 하드코딩된 기본/보호 테마 키 교체, 테스트 2개 파일(`client-compiler.test.ts`·`shortcode-conformance.test.ts`) 갱신, `.claude/skills/md-to-shortcode/SKILL.md`의 style 추천 문구 갱신.
- **개명 도중 발견한 별개의 사전 존재 버그**: `md_src/guides/`의 Cloudflare·Github·Lovable·Replit·Resend·Supabase·v0.dev·Vercel 8개 파일이 `style: "webdev"`를 쓰고 있었는데 `config/styles.json`엔 `webdev`라는 색 테마가 **원래 없었음**(오직 `hub.config.json`의 카테고리 라벨로만 존재) — 즉 이 8개는 지금까지 조용히 기본 테마(구 `ai-chat`)로 폴백되며 잘못된 초록색으로 렌더링되고 있었다. `category: "webdev"`(명시 필드로 분리)+`style: "cyan"`(실제 존재하는 새 테마)로 교정.
- **`hub.config.json` 3개 갱신**: `guides`/`claudeguide`는 `category` 미지정 문서 46개가 style-폴백 경로를 타므로 카테고리 키를 새 style명으로 교체(라벨/색/webdev/uncategorized는 그대로). `study`는 처음부터 이 세션에서 `category`를 명시 부여했으므로 `ai-usage`/`ai-tools`/`my-projects`라는 **진짜 의미 있는 카테고리 id**로 재작성(색상 이름에서 완전히 독립) — 사용자가 지적한 "JSON만 봐서 어떤 파일인지 모른다" 문제 해소.
- 검증: `npm test`(204/204), `node scripts/sync-guides-index.mjs`로 `src/data/guides.json` 재생성(6개 카테고리·42개 가이드, 카운트 일치 확인), `build-folder.mjs --all`로 guides(42)/claudeguide(4)/study(3) 3개 폴더 전부 무오류 재빌드, `showcase.md` 3종도 재빌드, 빌드된 HTML에서 개명 전후 브랜드 색상 hex 값이 정확히 동일함을 grep으로 확인(`terracotta`=`#D97757`, `emerald`=`#10A37F` — 개명이 시각적 산출물을 전혀 바꾸지 않았음 재확인), Chrome에서 `study-onepage.html`(카테고리 id가 `AI-USAGE`/`AI-TOOLS`/`MY-PROJECTS`로 읽기 쉽게 표시됨)·`guides-onepage.html`(6개 카테고리 pill·42개 가이드 정상, 히어로 문구 무변경 확인 — 폴백 하위호환 실증) 둘 다 스크린샷으로 확인. 코드/문서 전역 재검색(`grep`)으로 옛 키 잔존 0건 확인(역사 기록용 `docs/report/`·`docs/worklog.md`·`CLAUDE.md`의 "이전 키" 매핑 컬럼·이슈 이력 표는 의도적으로 보존).
- 다음 계획: 이번 세션(19~20) 변경분을 포함해 전체 최종 검수 후 커밋. 변경 파일이 스크립트 다수 + config 3종 + md_src 49개 파일 + 문서 다수로 매우 많이 쌓여 있음 — 커밋 시 논리 단위로 나눌지 한 번에 묶을지도 사용자와 상의 필요.

## 2026-10-14 — 세션 21: 공용 배치 카탈로그 연결(pptgen 과 라이브러리 규칙 통일) · 서식 세트 · 색 이름 · PPTX 선 없음 버그

사용자 요청: "cs_v2 와 pptgen 은 라이브러리 규칙이 동일해야", "학습콘텐츠용으로 만든 이름·그룹을 기능과 표현에 따라 범용으로 조정", "테마와 도형배치는 분리됐지만 도형 속성(그림자·외곽선 굵기 등)이 빠졌다 — 기본 테마를 따르되 그림자·외곽선·한 슬라이드 내 도형 배경색 2종", "카탈로그는 우선 slide-library 에 두되 cs_v2 로 통합(폴더 이동·연결)을 고려".

- **공용 카탈로그 연결**: `config/library/`(layouts.json·shape-sets.json 복사본 + README) · `scripts/sync-library.mjs`(원본 → 복사 + `library-map.mjs` 생성, `--check`) · `npm run sync:library(:check)`.
- **이름**: `scripts/library-names.mjs` — 기능 이름·별칭 해석, `:::` 정규식(점 허용) 4개 파서 공유, 제목 속성 제거, 색 이름(`colorToken`). `renderShortcode` = 해석 → `renderNative` → `bg=alt` 래퍼. md-to-pptx·pptx-browser 도 같은 해석.
- **분류**: `config/shortcode-guide.ts` 가 분류·기능 이름을 카탈로그에서 가져오고 스니펫 첫 줄을 기능 이름으로. `MarkdownCompiler.tsx` 의 하드코딩 optgroup·분류 버튼을 데이터 기반으로(이전엔 "데이터 다이어그램" 분류 버튼이 빠져 있었음).
- **서식 세트**: `scripts/shape-set.mjs` + `shortcode-styles.mjs` 카드 규칙 변수화 + PPTX `helpers.cardBox`/`isAltBlock` + 팔레트 `bgLight`·`brandMid`.
- **발견·수정한 기존 버그**: ① PPTX `line: { width: 0 }` 49곳이 1pt 짙은 테두리로 출력(pptxgenjs `width || 1`) → `type: "none"`. ② PPTX 가 색 이름 `accent` 를 몰라 검정으로 칠함 → 색 이름 표 통일.
- **slide-config 여러 줄 규칙 통일**: `notes: |`(pptgen)·`\n`(cs_v2) 둘 다 읽는 공용 `parseSlideConfig` — 이전엔 `notes: |` 가 "|" 로 읽혀 발표스크립트가 사라졌음.
- 검증: `npm test` 288/288, 기존 md(가이드 3개+showcase) 가이드·프레젠테이션 마크업 변경 전후 동일(CSS 만 변수화), `npm run build:standalone` 4종, 헤드리스로 standalone 모듈2 미리보기(기능 이름·제목 속성·`bg=alt`·elevated 그림자)와 프레젠테이션 다크/라이트 카드색, LibreOffice 로 PPTX 세트별(template·elevated·tinted) 렌더 확인. pptgen 견본(`examples/all-layouts.md`, 기능 이름 46종)을 cs_v2 3종으로 빌드 무오류.
- 남은 것: 항목 단위 `tag: alt`(pptgen 전용), pptgen 전용 인수(badge·header·connector·emphasis·grow)의 cs_v2 구현, 카탈로그 원본의 cs_v2 이동(지금은 경로만 준비).

## 2026-10-14 — 세션 22: 하드코딩 점검 · 이름 통일 결정 · CLI 인계

- **공용 md 의 종형·횡형 HTML 확인**: 가트너 v2 예시·pptgen `all-layouts.md` 를 `build-guide`·`build-presentation`·`md-to-pptx` 로 — 잔존 `:::`·제목 속성 없음, 헤드리스 화면 확인. (cs_v2 미지원 인수 `header=` 머리띠는 HTML 에 안 나옴 — 다음 작업 C)
- **하드코딩 제거**: 카드 테두리 0.75pt → `pptdesign.config.json card.borderWidth`, 근사 숏코드 정책 → 카탈로그 `fallback.cs_v2`. template PPTX XML 변경 전후 동일, `npm test` 289.
- **점검으로 확인한 남은 하드코딩·층 혼재**: pptgen v2 렌더러 수치 약 290개, cs_v2 `config/library`(라이브러리가 설정 폴더에), `shortcode-guide.ts` 설명 데이터, 미사용 `config/layout.json`.
- **사용자 결정**: 이름은 기능 이름 하나로 운영(옛 이름은 읽기 호환 별칭). 모양이 다른 옛 이름 2종(`compare-grid`·`workflow-flow`)은 렌더러를 읽어 확인 후 인수(`variant=plain`·`connector=arrow`)로 옮기는 설계 확정.
- **CLI 인계**: 남은 작업(이름 통일·이전 도구, cs_v2 미구현 기능, 카탈로그 example 단일 출처 → slide-library views·cs_v2 웹 라이브러리 화면, dev API → pptgen, 층 정리·200줄 분리)은 coding `_templates/skillreview/다음작업_CLI인계.md` 순서대로.

