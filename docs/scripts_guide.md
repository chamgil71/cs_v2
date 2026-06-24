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

---

## 4. 숏코드 카드 폰트 크기 시스템 (`scripts/build-guide.mjs`)

### 4-1. CSS 변수 기반 통일 관리

`build-guide.mjs`가 생성하는 HTML의 `:root` 블록에는 모든 숏코드 카드 크기를 제어하는 전용 CSS 변수가 선언됩니다.

```css
/* build-guide.mjs — buildHtml() 내부 :root 블록 (약 984번째 줄) */
:root {
  --font-scale: 1.0;            /* config/htmldesign.config.json scale 값 */
  --size-card-title: 1.15rem;   /* 모든 숏코드 카드 제목 */
  --size-card-p:     0.92rem;   /* 모든 숏코드 카드 설명/본문 */
  --size-stat-val:   2.4rem;    /* stat-grid 수치 */
  --size-stat-name:  1.1rem;    /* stat-grid 라벨 */
  --size-stat-note:  0.8rem;    /* stat-grid 노트 */
  --size-plan-badge: 0.75rem;   /* plan-grid 뱃지 */
  --size-plan-features: 0.95rem;/* plan-grid 기능 목록 */
}
```

`--font-scale`은 `config/htmldesign.config.json`의 `htmlFont.scale` 값을 런타임에 주입합니다.  
나머지 `--size-*` 변수는 `build-guide.mjs`에 하드코딩되어 있으며, 전역 변경 시 직접 편집합니다.

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
