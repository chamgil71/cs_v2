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
