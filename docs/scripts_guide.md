
# Creative Spark V2.0 개발자 스크립트 가이드
## 💻 엔지니어를 위한 API 및 스크립트 엔진 분석서

이 문서는 V2.0 디자인 스위트 내부의 스크립트 실행 아키텍처, PPTX XML 파싱 명세, 그리고 API 미들웨어 보안 규격에 관한 개발자 해설서입니다.

---

## 1. PPTX XML 분석 코어 엔진 (`scripts/pptx-analyzer.js`)

브라우저 내에서 PPTX 바이너리(zip) 데이터를 직접 해체하여 OpenXML 스펙에 따라 폰트/색상/레이아웃을 추출하는 코어 모듈입니다.

### 1) 주요 내부 API 명세
* **`extractThemeColors(zip)`**:
  - `ppt/theme/theme1.xml`을 파싱하여 테마 색상 맵(`dk1`, `lt1`, `dk2`, `lt2`, `accent1`~`accent6`)의 HEX 코드 값을 추출합니다.
* **`extractColors(zip)`**:
  - 개별 슬라이드 XML(`ppt/slides/slide*.xml`)을 순회하며 `srgbClr` 및 `schemeClr` 태그의 val 속성을 검출하고, 문서에 사용된 고유 색상(Unique Colors)의 빈도수를 집계합니다.
* **`extractFonts(zip)`**:
  - 각 슬라이드의 텍스트 런(`a:rPr/a:latin` 또는 `a:ea`)의 `typeface` 속성을 파싱하여 파워포인트 내에 사용된 모든 영문/동아시아 서체 목록을 감지합니다.
* **`applyLayoutToXml(xmlText, rules)`**:
  - XML 문서 안의 `<p:sp>`(도형/텍스트 프레임)의 위치 크기 규격인 `off` 및 `ext` 노드 값을 읽어와 NIPA 레이아웃 규칙 좌표(x, y, width, height)에 대응시켜 강제 변환합니다.

---

## 2. API 백엔드 미들웨어 명세 (`scripts/vite-api-plugin.ts`)

Vite 개발 서버 환경 하에서 스타일 저장, 실시간 미리보기 컴파일, 최종 빌드 저장을 담당하는 미들웨어 플러그인입니다.

### 1) API 엔드포인트 라우팅 명세

#### ① `GET /api/list-styles`
* **역할**: `config/styles.json` 디자인 시스템 스타일 프리셋 리스트 로드.
* **응답**: JSON 형태의 스타일셋 목록. 주석(`//`, `/* */`)을 정규식으로 안전하게 청소한 후 파싱합니다.

#### ② `POST /api/save-styles`
* **역할**: 스타일 조율 및 테마 빌더를 통해 구성한 색상/서체 설정을 `config/styles.json`에 영구 저장.
* **[안전 규격] API 스키마 검증기 (Schema Validator)**:
  - 수신된 JSON 데이터가 스키마 무결성을 위반하여 컴파일러 크래시를 유발하는 것을 차단하기 위해 저장 전 유효성을 강제 검사합니다:
  ```typescript
  // scripts/vite-api-plugin.ts 내 검증 로직
  const validateStylesSchema = (stylesObj: any): string | null => {
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    for (const key of Object.keys(stylesObj)) {
      const theme = stylesObj[key];
      if (!theme.label || typeof theme.label !== "string") {
        return `테마 '${key}'의 label이 누락되었습니다.`;
      }
      for (const colKey of ['brand', 'brandDark', 'brandLight']) {
        const colVal = theme[colKey];
        if (!colVal || !hexRegex.test(colVal)) {
          return `테마 '${key}'의 '${colKey}' 색상 포맷이 올바르지 않습니다.`;
        }
      }
    }
    return null;
  };
  ```

#### ③ `POST /api/preview`
* **역할**: 에디터 내 마크다운 텍스트를 임시 md 파일로 작성 후 `node scripts/build-guide.mjs` 또는 `node scripts/build-presentation.mjs`를 `exec`로 기동하여 컴파일된 HTML 문자열을 리턴.

#### ④ `POST /api/save-generate`
* **역할**: 최종 작성 완료된 가이드북 마크다운 파일을 지정한 아웃풋 경로(`dist-pptx`)에 저장하고, HTML, Presentation HTML, PPTX 3종 결과물을 동시에 로컬 빌드하여 생성함.

---

## 3. 백엔드 빌드 컴파일 스크립트와의 작동 관계

모듈 C(마크다운 컴파일러)가 빌드를 트리거할 때 실행되는 쉘 스크립트 체인입니다.

```text
MarkdownCompiler.tsx (UI)
       │
       ▼ (Fetch /api/save-generate)
vite-api-plugin.ts (API Router)
       │
       ├─► exec: "node scripts/build-guide.mjs" ────► [HTML 가이드 출력]
       ├─► exec: "node scripts/build-presentation.mjs" ──► [슬라이드 HTML 출력]
       └─► exec: "node scripts/md-to-pptx.mjs" ────► [PPTX 바이너리 출력]
                                    │
                                    ▼ (config/styles.json 읽기)
                          지정된 테마의 HSL/HEX 색상 및 
                          폰트 명세 규격을 템플릿에 직접 주입
```

* **스타일 주입 방식**:
  - `build-guide.mjs`는 `config/styles.json`에서 해당 테마의 HSL/HEX 컬러 코드를 불러와 변환 대상 HTML 문서의 `<style>` 태그(예: `:root { --brand: ... }`)에 CSS 변수 형태로 강제 임베딩합니다.
  - `md-to-pptx.mjs`는 마크다운 구문을 `pptxgenjs`가 해석할 수 있는 형태의 객체 구조로 파싱하면서, 서체 폰트맵(`typeface`)과 도형 배경색 파라미터에 styles.json의 설정값을 직접 대입하여 최종 PPTX 바이너리를 패키징합니다.

### 3-1. `hub-config.mjs` + `md_src/<dir>/hub.config.json` — 폴더별 카테고리·UI 설정 단일 출처

과거엔 카테고리 라벨·순서·색상이 `scripts/guide-categories.mjs`라는 **전역 JS 상수**(모든 폴더가 공유)에 하드코딩되어 있었다(CLAUDE.md 규칙 1 위반). **2026-09-02부터 폴더마다 자기 소유의 설정 파일**을 갖도록 바꿨다: `md_src/<dir>/hub.config.json`.

> **`categories.order`/`categories.meta`의 키는 `category` frontmatter 값이다(없으면 `style` 값으로 대체 — 하위호환).** 2026-09-03 이전에는 이 키가 항상 `style`(색상 테마) 값이었는데, `style`은 원래 색을 고르는 필드일 뿐 "카테고리"가 아니라서 개념이 꼬여 있었다(CLAUDE.md의 스타일 테마 목록 절 참고). `category`를 따로 지정하면 여러 문서가 같은 색 테마를 쓰면서도 다른 카테고리에 속하거나, 반대로 같은 카테고리가 서로 다른 색을 쓰는 것도 가능해진다.

```jsonc
{
  "categories": {
    "order": ["ai-usage", "ai-tools", "my-projects"],         // 표시 순서 (배열에 없는 카테고리는 뒤로, uncategorized는 항상 맨 뒤) — category(없으면 style) 값 기준
    "meta": {
      "ai-usage": { "label": "AI 사용 방법", "description": "...", "color": "#2789F5" }
    }
  },
  "sidebar": { "defaultOpen": true },                       // onepage 허브의 좌측 사이드바 초기 상태
  "outputs": { "onepage": true, "presentationBundle": false }, // build-folder.mjs가 플래그 없이 실행될 때 기본으로 만들 산출물
  "hero": {                                                 // onepage 허브 홈 화면 상단 문구(2026-09-03부터 폴더별 오버라이드 가능, 생략 시 "AI·생산성 도구" 기본 문구)
    "badge": "📚 AI 활용 강의 자료 3부작",
    "titleLine1": "AI를 제대로 쓰는 법,",
    "titleAccent": "원리부터 실전까지",
    "desc": "{count}개 문서로 ... 훑어볼 수 있습니다. 인터넷 없이도 작동합니다." // {count}는 그 폴더의 총 가이드 수로 치환됨
  }
}
```

* `scripts/hub-config.mjs`가 이 파일을 읽는 유일한 로더다. 모든 함수는 **폴더의 절대경로 1개**만 받는다(`loadHubConfig(folderAbsPath)`) — `resolveFolderDir(rootDir, dirArg)`가 `"guides"` 같은 짧은 이름은 `md_src/guides`로, 경로 구분자가 섞인 값이나 절대경로는 그대로 소스 폴더로 해석해 이 절대경로를 만들어준다(웹 GUI에서 사용자가 OS 폴더 다이얼로그로 고른, `md_src` 밖의 임의 폴더도 동일하게 다루기 위함). `sortByCategoryOrder()`/`categoryMetaFor()`로 정렬·메타 조회를 표준화한다. **파일이 없는 폴더는 안전한 기본값**(카테고리 없음=id를 그대로 라벨로 사용, 사이드바 항상 열림, onepage/presentation-bundle 기본 off)으로 동작하므로, 새 폴더를 만들 때 이 파일부터 준비할 필요는 없다.
* `build-guide-hub.mjs`(onepage 허브)와 `sync-guides-index.mjs`(React용 `src/data/guides.json`) **양쪽 다 이 로더 하나만 참조**한다 — 즉 `hub.config.json`을 고치고 재실행하면 두 산출물의 표시 순서가 항상 함께 바뀐다(과거엔 `sync-guides-index.mjs`가 `guides.json`에 저장된 이전 순서를 그대로 보존하는 별도 로직이라 서로 어긋날 수 있었음 — 이 드리프트를 없앴다).
* `md_src/guides/hub.config.json`·`md_src/claudeguide/hub.config.json` 둘 다 이미 만들어져 있다. 새 폴더를 추가하면 이 파일도 같이 만들어주는 게 좋다(안 만들어도 동작은 하지만 카테고리 라벨이 전부 id 그대로 나온다).

**새 폴더에 hub.config.json을 어떻게 처음 만드나** — 손으로 처음부터 쓸 필요 없다. `build-folder.mjs`의 `--init-config` 플래그가 그 폴더 md 전체의 `category`(없으면 `style`) frontmatter를 스캔해서 "라벨=id 그대로, 색은 팔레트 순환"인 초안을 만들어준다:

```bash
npm run build:folder -- --dir newFolder --init-config
# → md_src/newFolder/hub.config.json 생성하고 종료 (다른 산출물 플래그를 안 줬으면 빌드는 안 함)
```

이미 파일이 있으면 **절대 덮어쓰지 않는다**(수동으로 고친 라벨/색/순서 보호) — "이미 존재 — 건너뜀" 메시지만 찍고 넘어간다. 초안이 생기면 라벨·색·`order` 순서를 원하는 대로 고친 뒤, 플래그 없이(또는 원하는 산출물 플래그와 함께) 다시 실행하면 그 설정이 그대로 반영된다.

**json을 고친 뒤 다시 돌리는 법**(운영 중인 폴더, 이미 config가 있는 경우) — 새로 만들 필요 없이 `hub.config.json`을 직접 열어 `categories.order` 배열 순서를 바꾸거나 `meta`의 라벨/색/설명을 고친 뒤, 그 폴더를 다시 빌드하면 된다:

```bash
# hub.config.json 수정 후:
npm run build:onepage -- --dir guides    # onepage 허브만 다시
npm run build:folder -- --dir guides     # 폴더 index.html까지 포함해 전부 다시
node scripts/sync-guides-index.mjs        # React용 src/data/guides.json도 (guides 폴더 한정)
```
세 산출물 모두 같은 `hub.config.json`을 읽으므로 순서/라벨이 항상 같이 바뀐다 — 특정 산출물만 구식 순서로 남는 일은 구조적으로 없다.

### 3-2. `build-guide-hub.mjs` — 오프라인 가이드 허브 onepage 단일 HTML

`md_src/<dir>/*.md` 전체를 **서버 없이 파일 하나로 열리는 SPA**로 묶는다 (`npm run build:onepage`, 기본 출력 `publish/<dir>-onepage.html` — 기본 `--dir`은 `guides`라 `publish/guides-onepage.html`).

* 각 md의 `guide-core.buildHtml()` 결과에서 `<style>`/`<body>` 본문만 추출해 `guideContents[slug] = {styles, body}`로 JSON 직렬화, `<script id="appdata" type="application/json">`에 임베딩한다. `<` 문자는 전부 `<`로 이스케이프해 `</script>` 조기 종료를 방지한다.
* 카테고리 표시 순서·라벨·색상은 위 3-1의 `hub.config.json`에서 읽는다.
* 기본 출력 파일명에는 항상 `-onepage`가 붙는다(`defaultOutPath()` 헬퍼) — `--dir`로 폴더를 바꿔도 파일명 로직 한 곳에서 자동으로 붙는다. **"onepage"와 `npm run build:standalone`(웹앱 번들, `dist/webdesignsuite.html` 등)은 완전히 다른 파이프라인**이다 — onepage는 이미 렌더링된 콘텐츠(문서 본문 텍스트)를 한 파일에 담고, build:standalone은 React 앱(편집 로직 포함)을 한 파일로 번들링한다. 초기엔 이름이 겹쳐서(둘 다 "standalone"이라 불렀음) 혼동이 있었고, 2026-09-02에 콘텐츠 쪽만 "onepage"로 분리해 정리했다.
* 각 가이드 본문은 클릭 시 Shadow DOM에 주입되어 `:root`/`html`/`body` 셀렉터가 `:host`/`.guide-document`로 리라이트된 채 렌더링되므로, 가이드마다 다른 테마 CSS 변수가 서로 침범하지 않는다.
* **좌측 사이드바 열림/닫힘**: 헤더의 ☰ 버튼으로 토글, 초기 상태는 `hub.config.json`의 `sidebar.defaultOpen`, 사용자가 한 번 토글하면 `localStorage`(`onepage-sidebar`)에 저장되어 이후에도 유지된다. `#sidebar`/`#main` 둘 다 `grid-column`을 명시적으로 고정해 둔다(`.sa-sidebar{grid-column:1}` / `#main.sa-main{grid-column:2}`) — 이게 없으면 사이드바에 `display:none`이 걸릴 때 CSS Grid auto-placement가 남은 유일한 아이템인 `#main`을 1번(0px) 트랙으로 재배치해버려 본문 전체가 사라지는 버그가 있었다(2026-09-03 발견·수정).
* **홈 화면(사이드바에서 아무것도 선택하지 않았을 때)**은 히어로(배지+그라디언트 타이틀+검색창+CTA)·카테고리 필터 pill·카드형 그리드(상단 강조 바+화살표 hover)로 구성된다(`showHome()`). 검색창은 카드의 `data-q`(제목+부제 소문자)를 substring 매칭해 카드/카테고리 블록을 즉시 show/hide한다 — React가 없는 순수 vanilla JS 구현이라 프레임워크 없이도 동작한다. 히어로 배지/타이틀/설명 문구는 `hub.config.json`의 `hero`(2026-09-03 추가)로 폴더별 오버라이드 가능 — 생략하면 "AI·생산성 도구" 기본 문구(`hub-config.mjs`의 `DEFAULT_HERO`) 그대로 나온다.
* `render(folder)`를 export하므로 `build-folder.mjs`가 CLI를 거치지 않고 함수로 바로 재사용한다.

### 3-3. `build-folder.mjs` — 폴더 단위 통합 오케스트레이터

"이 폴더를 선택하면 필요한 걸 다 만들어줘"에 대응하는 스크립트. **새 변환 로직을 만들지 않고 기존 스크립트(`guide-core`/`presentation-core`/`md-to-pptx`/`build-guide-hub`)를 순서대로 호출만** 한다 — 각 스크립트는 지금처럼 단독 CLI로도 계속 쓸 수 있다. `--dir`은 `md_src` 하위 짧은 이름뿐 아니라 임의 경로(절대경로 등)도 받는다 — `resolveFolderDir()`가 자동으로 구분한다.

* **통합 프레젠테이션 덱(`--presentation-bundle`) 순서 = onepage와 동일 기준(2026-09-03)**: `hub.config.json`을 로드한 직후 `files` 배열을 `categories.order` 기준(1차)+제목 알파벳순(2차, onepage/`sync-guides-index.mjs`와 동일 tie-break)으로 재정렬한다. 그 전에는 통합 덱만 파일명 알파벳순으로 따로 놀아서, `categories.order`를 고쳐도 onepage 순서만 바뀌고 통합 덱은 그대로인 드리프트가 있었다 — 이제 `categories.order` 하나만 고치면 onepage·폴더 index.html·통합 덱 순서가 전부 같이 바뀐다.

```bash
npm run build:folder -- --dir guides              # 기본 세트: 개별 html + 개별 presentation html + 개별 pptx + 폴더 index.html
npm run build:folder -- --dir guides --all        # 위 4개 + onepage 허브 + 통합 프레젠테이션 덱까지 전부
npm run build:folder -- --dir guides --guide --presentation --pptx --onepage   # 원하는 산출물만 선택
npm run build:folder -- --dir guides --no-onepage   # hub.config.json의 outputs.onepage가 true여도 이번엔 끄기
npm run build:folder -- --dir "C:/Users/me/Desktop/my-docs" --out-dir public   # md_src 밖 임의 폴더 + 출력 위치 지정도 가능
```

산출 위치(`<base>`는 `--dir`이 짧은 이름이면 그 이름, 명시적 경로면 마지막 폴더명):

| 산출물 | 경로 | 플래그 |
| --- | --- | --- |
| 개별 종형 가이드 html | `<out-dir>/<base>/<파일명>.html` | `--guide` |
| 개별 횡형 프레젠테이션 html | `<out-dir>/<base>/<파일명>_presentation.html` | `--presentation` |
| 개별 pptx | `<out-dir>/<base>/<파일명>.pptx` | `--pptx` |
| 폴더 목록 index.html(가벼운 정적 링크 페이지) | `<out-dir>/<base>/index.html` | `--hub` |
| onepage 단일 파일 허브 | `<out-dir>/<base>-onepage.html` | `--onepage` (기본값은 `hub.config.json`의 `outputs.onepage`) |
| 통합 프레젠테이션 덱(폴더 전체를 합친 슬라이드) | `<out-dir>/<base>-presentation-bundle.html` | `--presentation-bundle` (기본값은 `outputs.presentationBundle`) |

(`--out-dir` 기본값은 `publish`.) 플래그를 하나도 안 주면 "기본 세트"(개별 3종 + 폴더 `index.html`)가 나가고, `--onepage`/`--presentation-bundle`은 `hub.config.json`의 `outputs`에 따라 자동으로 켜지거나 꺼진다. `<out-dir>/<base>/index.html`은 **onepage 허브와 다른 산출물**이다 — 본문을 전부 내장하는 게 아니라 그 폴더 안에 실제로 생긴 개별 파일(html/presentation/pptx)로 링크만 거는 가벼운 정적 페이지라, 폴더를 그대로 정적 호스팅할 때(예: GitHub Pages) 진입점으로 쓰기 좋다.

---

## 4. 숏코드 렌더링 & 폰트 크기 시스템 (2026-06-25 단일화)

> **HTML 숏코드 렌더링은 정본 공유 모듈로 통합됨.** `scripts/shortcode-render.mjs`(파서+렌더러) + `scripts/shortcode-styles.mjs`(컴포넌트 CSS, `var(--*)`)를 **`build-guide.mjs` · `build-presentation.mjs` · `src/lib/client-compiler.ts` 세 출력이 모두 import** 한다. 숏코드 동작/스타일 수정 시 이 두 모듈만 고치면 3개 HTML 출력에 동시 반영된다. (PPTX는 매체가 달라 `scripts/pptx-renderers/`로 별도 — 단, 같은 입력 파서를 공유)

### 4-1. CSS 크기 토큰 — config 단일 출처 (하드코딩 아님)

각 셸이 생성하는 HTML `:root` 블록의 `--size-*` 변수는 **`config/htmldesign.config.json`의 `htmlSize` 에서 로드**된다. 코드에는 폴백만 둔다(하드코딩 금지 규칙).

```jsonc
// config/htmldesign.config.json
"htmlSize": {
  "guide":        { "h1": "2.2rem", "card-title": "1.15rem", "card-p": "0.92rem", ... },
  "presentation": { "h1": "3rem",   "card-title": "1.45rem", "card-p": "1.2rem",  ... }
}
```

| 출력 | 사용 프로파일 | 주입 코드 |
|------|--------------|----------|
| 가이드 HTML (build-guide) | `htmlSize.guide` | `const sz = HTML_CONFIG?.htmlSize?.guide \|\| {}` → `--size-h1: ${sz['h1'] \|\| '2.2rem'}` |
| 슬라이드 HTML (build-presentation) | `htmlSize.presentation` | 동일 패턴 (presentation 프로파일) |
| 미리보기/standalone (client-compiler) | html=guide / presentation=presentation | `?raw` import + 주석제거 파싱 → `HSZ_GUIDE`/`HSZ_PRES` |

전역 크기 변경 시 **`config/htmldesign.config.json` 한 곳만 수정**하면 3개 출력에 반영된다. `--font-scale`은 `htmlFont.scale` 값을 주입한다.

### 4-2. 숏코드별 오버라이드 헬퍼 함수 (`scripts/shortcode-render.mjs`)

숏코드 선언부에 `title-size` / `desc-size` 인수가 있으면 해당 블록 컨테이너에  
`style="--size-card-title:X; --size-card-p:Y"` 인라인으로 CSS 변수를 오버라이드합니다. (PPTX도 `md-to-pptx.mjs`가 동일 인자를 지원 — 배수/절대 pt)

```js
// shortcode-render.mjs (build-guide 에서 추출된 정본 모듈)

const DEFAULT_TITLE_REM = 1.15;
const DEFAULT_P_REM     = 0.92;

function resolveSizeArg(val, defaultRem) {
  // 순수 숫자 → 비율 계산
  if (/^\d+(\.\d+)?$/.test(val)) return `${(parseFloat(val) * defaultRem).toFixed(3)}rem`;
  // 단위 포함 → 절대값 그대로
  return val;
}

function buildSizeOverrideStyle(argsStr) {
  const tm = argsStr.match(/title-size=(\S+)/);

### 4-2. 숏코드별 오버라이드 헬퍼 함수

숏코드 선언부에 `title-size` / `desc-size` 인수가 있으면 해당 블록 컨테이너에  
`style="--size-card-title:X; --size-card-p:Y"` 인라인으로 CSS 변수를 오버라이드합니다.

```js
// build-guide.mjs 약 243-260번째 줄

const DEFAULT_TITLE_REM = 1.15;
const DEFAULT_P_REM     = 0.92;

function resolveSizeArg(val, defaultRem) {
  // 순수 숫자 → 비율 계산
  if (/^\d+(\.\d+)?$/.test(val)) return `${(parseFloat(val) * defaultRem).toFixed(3)}rem`;
  // 단위 포함 → 절대값 그대로
  return val;
}

function buildSizeOverrideStyle(argsStr) {
  const tm = argsStr.match(/title-size=(\S+)/);
  const dm = argsStr.match(/desc-size=(\S+)/);
  // 매칭 결과를 인라인 CSS 변수 문자열로 조립
}
```

**call site** (`buildHtml()` 내부 정규식 치환부, 약 872번째 줄):

```js
let html = renderShortcode(type, body, rawArgs);
const sizeStyle = buildSizeOverrideStyle(rawArgs || "");
if (sizeStyle) html = `<div style="${sizeStyle}">${html}</div>`;
```

CSS 변수는 상속되므로 래퍼 `<div>`에 설정하면 내부 모든 자식 요소가 오버라이드된 값을 사용합니다. 다른 숏코드 블록에는 영향이 없습니다.

### 4-3. 새 숏코드 추가 시 폰트 크기 규칙

신규 숏코드를 `renderShortcode()` 안에 추가할 때 제목/설명 CSS에 반드시 변수를 사용합니다:

```css
/* 신규 숏코드 CSS 작성 시 규칙 */
.new-card-title { font-size: var(--size-card-title); font-weight: 700; }
.new-card-desc  { font-size: var(--size-card-p); color: var(--text-2); }
/* ❌ 하드코딩 금지: font-size: 1.0rem; font-size: calc(0.95rem * var(--font-scale)); */
```

`calc(... * var(--font-scale))` 패턴은 기존 내비게이션/히어로 영역에서만 사용하며,  
숏코드 카드 내부는 `var(--size-card-title)` / `var(--size-card-p)` 변수를 그대로 사용합니다.

---

## 5. 공용 배치 카탈로그 연결 (2026-10-14) — `library-names.mjs` · `shape-set.mjs`

pptgen(coding 저장소 `_templates/myskill/pptgen`)과 cs_v2 가 **같은 배치 이름·항목 규칙·색 이름·서식 세트**를 쓰도록 한 연결 층입니다.

```
coding/_templates/slide-library/catalog/   ← 원본(정본, ppt clone 산출물과 같이 관리)
  layouts.json · shape-sets.json
        │  npm run sync:library   (scripts/sync-library.mjs, --check 로 드리프트 검사)
        ▼
cs_v2/config/library/*.json (복사본)  →  scripts/library-map.mjs (생성본: LAYOUTS·LAYOUT_ALIASES·LAYOUT_GROUPS·SHAPE_SETS·COLOR_TOKENS)
        │
        ├─ scripts/library-names.mjs   resolveShortcode(name) · shortcodeBlockRe() · stripHeadingAttrs(md) · colorToken(name, medium) · wantsAltBg(args)
        │     ├─ shortcode-render.mjs  renderShortcode = 이름 해석 → layoutArgs(카탈로그 기본값 < 블록 인수) → renderNative(옛 숏코드 분기 | shortcode-ext 기능 이름 구현) → header 머리띠 → bg=alt 래퍼(.sc-bg-alt)
        │     ├─ guide-core / presentation-core / md-to-pptx / pptx-browser   ::: 정규식 · 제목 속성 제거 (같은 함수)
        │     ├─ registry.mjs hexClean   색 이름 → PPTX 팔레트 키 (cs_v2_pptx)
        │     └─ config/shortcode-guide.ts  분류(category)·기능 이름(layout)·스니펫 첫 줄
        └─ scripts/shape-set.mjs        pickShapeSet(테마 shapeSet, fm.shape) · shapeSetCss(name) · shapeSetPptx(name, pal)
              ├─ guide-core / presentation-core   SHORTCODE_CSS 뒤에 `:root, body {…}` 변수 묶음
              └─ md-to-pptx / pptx-browser        pal.shape → helpers.cardBox(pal, {alt, radius})
```

### 5-1. 이름 해석 규칙 (`resolveShortcode(name, args)`) — 이름은 하나로 운영

1. 내부 토큰(`slide-config`·`arrow`)은 그대로.
2. 카탈로그에서 기능 이름을 찾는다: 기능 이름이면 그대로, 옛 이름(별칭 — cs_v2 옛 숏코드·pptgen 구현 ID)이면 **기능 이름 + `ALIAS_ARGS[옛 이름]`** 으로 정규화(블록에 쓴 인수가 우선 — `mergeArgs`). 옛 이름 사용은 `ALIAS_SEEN` 에 기록 → CLI(`build-guide`·`build-presentation`·`md-to-pptx`)가 끝에 `reportAliasUse()` 로 경고.
3. **구현 ID 고르기**: `impl.cs_v2.variants`(예: `grid.columns` + `variant=plain` → `compare-grid`, `process.track` + `connector=arrow` → `workflow-flow`) → 없으면 `impl.cs_v2.shortcode` → 구현 상태가 `markdown`/`none` 이면 `PLAIN_FALLBACK`(카탈로그 `fallback.cs_v2`).
4. 모르는 이름은 입력 그대로 → 렌더러가 빈 문자열(기존 동작).
5. 반환 `{ type: 구현 ID, layout: 기능 이름, args: 정규화된 인수, status, alias }` — `renderShortcode`·`md-to-pptx`·`pptx-browser` 가 같은 결과를 쓴다(HTML·PPTX 같은 해석).
6. **매체**: 세 번째 인수 `medium = "pptx"`(md-to-pptx·pptx-browser) 면 기능 이름 구현(HTML 전용) 대신 카탈로그 `impl.cs_v2.pptx_shortcode`(옛 숏코드 근사 — 예 `process.staircase` → `level-grid`). cs_v2 PPTX 는 빠른 근사, 정밀 PPTX 는 pptgen.

### 5-1a. 기능 이름 구현 `scripts/shortcode-ext/` (2026-10-14, 인계서 C)

예전에 "가장 가까운 숏코드"로 근사하던 36종을 모양 그대로 그리는 HTML 렌더러. 구현 ID = 기능 이름(카탈로그 `impl.cs_v2.shortcode`).

| 파일 | 배치 |
|---|---|
| `common.mjs` | 공용 조각(`cls`·`num`·`clamp`·`glyph`·`bullets`·`pill`·`band`·`imageSlot`) + 공용 CSS(`.sx-card`·`.sx-emph`·`.sx-band`·`.sc-item-alt`…) |
| `grid.mjs` | `grid.box-1~4`·`narrow-wide`·`wide-narrow`(+`-titled`)·`main-plus-3`·`cards-icon-3`·`circle-3`·`band-box-3`, `structure.pillars`·`groups-2x3` — 상자형 패턴은 매개변수 하나(`boxes(cols, title, circle, main)`) |
| `process.mjs` | `process.staircase`·`growth`·`cycle-3`·`zigzag` |
| `flows.mjs` | `process.cards-arrow-4`·`input-circles-4`·`band-columns-3`·`steps-checklist-3` |
| `compare.mjs` | `compare.main-sub`·`balance`·`hbars`·`pair-summary`(header 를 아래 결론 띠로 — `ownHeader`) |
| `data.mjs` | `data.bars`(scale sqrt/linear)·`data.gauge`(SVG 반원) |
| `text.mjs` | `text.statement`·`body`·`quote`·`icon-statement`·`avatar` |
| `media.mjs` | `media.cards-image`·`banner`·`full` — 항목 `src` 면 그림, 없으면 프롬프트를 적은 이미지 자리 |
| `native.mjs` | 옛 숏코드가 새로 받는 인수의 CSS(`.sf-line`·`.lv-grow`·`.gf-arrow`·`.stat-card.sx-emph`·`.wf-step.active`) |
| `index.mjs` | `EXT_RENDERERS`·`EXT_OWN_HEADER`·`headerBand`·`EXT_CSS`(→ `shortcode-styles.mjs` 의 `SHORTCODE_CSS` 끝에 한 번) |

- 렌더러 시그니처 `(items, a, h)`: `items` = 표준 항목(+`_alt`), `a` = `layoutArgs(layout, args)`, `h` = `shortcode-render` 가 넘기는 텍스트 도구 `{ esc, inline, desc, meta, color }`(순환 import 회피).
- 색·글꼴·카드 서식은 `var(--*)` 와 서식 세트 변수만(테마·셸이 값을 정함). 기본 수치는 카탈로그 `args.default`.
- 새 배치 추가: 카탈로그에 `impl.cs_v2 = { status:"ready", shortcode:"<기능 이름>", pptx:false, pptx_shortcode:"<옛 숏코드>" }` → 해당 그룹 파일에 렌더러·CSS → `npm run sync:library` → `npm test`(`layout-ext.test.ts` 가 예시 렌더·CSS 커버리지·이스케이프를 자동 검사).
- 옛 숏코드 분기의 새 인수(`badge`·`connector`·`emphasis`·`grow`)는 `renderNative` 안에서 `a.*` 로 읽고, 인수가 기본값이면 예전 마크업을 그대로 낸다(md_src 150개 산출물 전후 동일).
- 항목 `tag: alt`: `markAltItems()`(library-names) 가 HTML·PPTX 세 파서에서 `_alt` 표시 → HTML `sc-item-alt` 클래스 / PPTX `helpers.isAltBlock(item, it)`.

구현 ID(`IMPL_SHORTCODES` — `shortcode-render.mjs` 분기·`pptx-renderers` 타입)는 **내부 이름**이라 문서·예시·화면에 쓰지 않는다(pptgen 의 `c01-p07` 과 같은 위치).
md 의 옛 이름 일괄 변환: `scripts/migrate-names.mjs`(`npm run migrate:names -- <경로>`, `--check`) — 대응표는 코드가 아니라 카탈로그에서 읽고, 코드 펜스·이스케이프한 문법 예시(`\:::`) 줄도 바꾼다.

### 5-2. 서식 세트 변수 (HTML)
| 변수 | template(기본) | 다른 세트 |
|---|---|---|
| `--card-alt-bg` | 보조 카드색 토큰(`secondary-light`) | 세트의 `card_alt.fill` |
| `--set-card-bg` | (넣지 않음 → `--card-bg`) | 세트의 `card.fill` |
| `--card-border-width` / `--card-border-color` | (넣지 않음 → `1px` / `--border`) | `outline.width_pt`(px 환산) / `outline.color` |
| `--card-shadow` | (넣지 않음 → `--shadow`) | `shadow`(soft·medium·strong 의 css) |
| `--card-radius` | (넣지 않음 → `--radius`) | `card.radius`(sm·md·lg px) |

- `:root, body` 두 곳에 넣는 이유: 프레젠테이션 셸은 `body.light-mode` 에서 `--card-bg` 를 바꾼다 → 세트 변수가 body 에서 다시 계산돼야 라이트/다크 모두 맞는 색.
- 색 토큰의 cs_v2 값은 `color-mix(… var(--card-bg))` 형태라 다크/라이트 어느 셸에서도 읽히는 색이 된다.
- 새 카드형 숏코드 CSS 는 `background: var(--set-card-bg, var(--card-bg, #fff))`, `border: var(--card-border-width, 1px) solid var(--card-border-color, var(--border))`, `box-shadow: var(--card-shadow, var(--shadow))`, `border-radius: var(--card-radius, var(--radius))` 를 쓴다.

### 5-3. PPTX 카드 서식 (`helpers.cardBox`)
- 색 강조가 없는 흰 카드(icon-grid·feature-grid·columns·compare-grid·stat-grid·tool-list·tabs·steps·summary-box·plan-grid 기본 카드)는 `...helpers.cardBox(pal, { alt: helpers.isAltBlock(item), radius: r })` 로 그린다.
- template 이면 `{ fill: 흰색, line: { color: pal.border, width: 0.75 } }` — 기존과 같다. 다른 세트는 채움·선·그림자(`shadow`)·둥글기를 세트에서.
- ⚠️ **선 없음은 `line: { type: "none" }`**. pptxgenjs 는 `line: { width: 0 }` 을 `width || 1` 로 처리해 1pt `#333333` 테두리를 그린다(2026-10-14 전 렌더러 교체, 테스트로 금지).

### 5-4. 카탈로그를 바꿀 때
원본(`slide-library/catalog`)을 고친 뒤 `npm run sync:library` → `npm test`(`library-catalog.test.ts` 가 생성본·복사본 일치, 66종 HTML·PPTX 커버리지를 확인) → 코어/렌더러가 바뀌었으면 `npm run build:standalone`.

