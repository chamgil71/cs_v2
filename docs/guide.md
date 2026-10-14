# Creative Spark V2.0 사용자 기능 가이드
## 📖 디자이너 & 콘텐츠 작성자를 위한 실무 안내서

이 가이드는 V2.0 디자인 스위트에 탑재된 기능들의 상세한 실무 활용법을 디자이너와 작성자의 관점에서 설명합니다.

---

## 1. 디자인 시스템 (모듈 1)

콘텐츠를 쓰기 전에 먼저 테마·배색을 확정하는 모듈입니다. `dashboard.html`/`webdesignsuite.html`의 **[1. 디자인 시스템]** 탭, 또는 단독 배포판 `design-system.html`에서 접근합니다. 내부에 서브탭 2개(테마 조율 & 배색 빌더 / 보조 유틸리티)가 있습니다.

### 1) HSL 디자인 시스템 테마 미세 조율 (Visual Adjuster)
1. **[테마 조율 & 배색 빌더]** 서브탭으로 이동합니다.
2. 좌측 프리셋 목록에서 수정할 테마 키(예: `sky-blue`)를 선택합니다.
3. 가운데 세부 조율 영역에서 브랜드 주컬러, 어두운톤, 중간톤, 배경색 및 폰트 패밀리 값을 미세 조율합니다.
4. **[현재 테마 설정에 임시 저장 (로컬)]**을 클릭하여 반영합니다.
5. 조율을 끝내고 **[서버에 최종 저장하기]**를 누르면 실제 `config/styles.json` 파일에 영구 기록되어 마크다운 컴파일 빌드에 투입됩니다.

### 2) 나만의 커스텀 배색 조합 빌더 (Theme Creator)
* 주어진 기본 테마 외에, 메인/서브/강조색 조합을 완전히 새로 구성하여 신규 테마로 등록하는 방법입니다.
1. 조율 서브탭 좌측 하단 **[새 테마 추가]** 입력창에 신규 테마 영문 키(예: `stripe-indigo`)를 작성하고 [추가]를 누릅니다.
2. 색상 피커를 이용해 브랜드 메인색(Brand), 서브 어두운색(Dark), 강조색(Deep/Light) 등을 마음대로 조합합니다.
3. 조작 즉시 우측의 **[실시간 컴포넌트 프리뷰]**와 **[WCAG 명도 가독성 실시간 판정 판넬]**이 반응합니다.
4. 흰색 배경(White BG) 및 검정 배경(Black BG) 대비 테스트 칩들의 **AA 통과 여부**를 눈으로 실시간 확인하며 색상을 튜닝합니다.
5. 조율을 끝마치고 **[서버에 최종 저장하기]**를 누르면 시스템 테마에 등록되어 마크다운 문서 Frontmatter 영역에 `style: stripe-indigo`로 지정하여 사용할 수 있게 됩니다.

### 3) 보조 유틸리티 — 대비 검사기 · 팔레트 빌더 · 컬러 리매퍼 (SubUtilities)
**[보조 유틸리티]** 서브탭에서 접근합니다(2026-09 재편 전까지는 UI에 연결되어 있지 않던 기능입니다).
1. **개별 색상 사전 및 대비 검사기**: `styles.json`에 등록된 모든 단색 칩이 목록으로 뜹니다. 칩을 클릭하거나 HEX를 직접 입력하면 흰색/검은색 배경 대비, 그리고 컬러 블록 배경 위 흰/검 글자 대비를 동시에 계산해 WCAG AA/AAA 등급을 즉시 보여줍니다.
2. **추천 테마 프리셋 & 커스텀 배색 빌더**: Visual Adjuster의 프리셋 목록과 연동된 빠른 팔레트 선택·비교 도구입니다.
3. **컬러 리매퍼**: 특정 색상 하나를 다른 색상으로 일괄 치환할 대상을 미리 검토할 때 사용합니다(실제 PPTX 파일에 대한 리매핑 실행은 모듈 3의 초경량 컬러 리매퍼를 사용).

---

## 2. 가이드북 저작 (모듈 2)

마크다운 텍스트 원본 소스를 가지고 가이드 HTML과 16:9 슬라이드 PPTX를 유기적으로 자동 조율 및 빌딩하는 저작 파이프라인입니다. `dashboard.html`/`webdesignsuite.html`의 **[2. 가이드북 저작]** 탭, 또는 단독 배포판 `guide-authoring.html`에서 접근합니다. 컴파일 시 **모듈 1에서 정한 `styles.json` 테마**를 그대로 가져다 씁니다.

### 1) 실시간 가독성 린터 (Contrast Linter) 피드백
* 우측 [Live Preview] 영역은 에디터 본문의 내용을 실시간 HTML로 미리 보여줍니다.
* 이때 **가독성 Linter**가 본문에 설정된 테마의 주컬러(Brand)와 본문 배경(Bg)의 명도 대비율을 자동으로 검사합니다.
* 대비율이 **WCAG AA 기준인 4.5:1 미만**으로 감지될 경우, 미리보기 창 상단에 주황색 경고 배너가 나타납니다:
  > **⚠️ 가독성 대비 경고 (WCAG AA 미달)**
  > 대비율이 3.4:1로 낮으므로 가독성을 위해 모듈 1의 테마 조율 탭에서 색상의 밝기(L값)를 수정할 것을 권장합니다.

### 2) 🧩 28종 숏코드 에디터 툴바 활용
* **기능 설명**: 에디터 상단에 위치한 `🧩 숏코드 삽입` 드롭다운 선택상자에서 **분할·카드 / 비교·대조 / 순서·흐름 / 구조·관계 / 데이터·수치 / 서술·강조 / 코드·터미널 / 탐색·목록** 8개 기능 그룹(2026-10-14, pptgen 과 같은 공용 배치 카탈로그 그룹 — 예전의 학습 콘텐츠용 분류를 대체)으로 구성된 **28종 배치**를 한눈에 찾고 원클릭으로 주입할 수 있습니다. 이름은 **기능 이름 하나**(`::: grid.cards`, `::: compare.pair` …)만 씁니다 — 스니펫은 pptgen 과 같은 공용 카탈로그 예시에서 나옵니다. 예전 이름(`icon-grid` 등)으로 쓴 문서도 빌드는 되지만 경고가 나오며, `npm run migrate:names` 로 한 번에 바꿀 수 있습니다.
* **작성법**: 삽입을 원하는 위치에 커서를 둔 뒤, 드롭다운에서 요소를 선택하면 V2 엔진에 부합하는 YAML 표준 템플릿(예: `- title: ... / desc: |`) 코드가 자동으로 입력됩니다.
* **카드 모양 바꾸기(서식 세트)**: 문서 머리말에 `shape: soft`(또는 `flat`·`outline`·`elevated`·`tinted`)를 쓰면 카드의 외곽선·그림자·둥글기·채움이 바뀝니다. 색은 고른 테마(`style:`)를 그대로 따릅니다. 블록 첫 줄에 `bg=alt` 를 붙이면 그 블록 카드만 보조 색으로 칠해져 한 화면에 카드 배경 2종을 쓸 수 있습니다(예: `::: data.stats bg=alt`). 상세: `config/library/README.md`.
* **Mermaid 구조도**: 숏코드는 아니지만 표준 ` ```mermaid ` 코드 블록을 그대로 쓰면 미리보기·가이드북 HTML에서 실제 다이어그램으로 렌더링됩니다(PPTX는 원문 코드박스로만 표시).

### 3) 📁 멀티포맷 일괄 폴더 컴파일 & 네이티브 폴더 선택
* **일괄 변환 방식**: 대시보드 중단 `📁 폴더 일괄 변환` 체크박스를 활성화하면 개별 파일이 아닌 폴더 내 마크다운 파일들의 통치 컴파일 파이프라인으로 작동합니다.
* **네이티브 폴더 선택**: 입력 폴더, 출력 폴더 및 개별 저장 위치 텍스트박스 우측 상단의 `선택...`을 클릭하면, 윈도우 OS의 네이티브 폴더 선택 탐색기 창이 나타나 수동 경로 텍스트 입력의 불편함을 덜어주고 최적화된 상대 경로를 자동 기입해 줍니다.
* **다중 포맷 출력**: 일괄 변환 시 `html` (가이드북), `presentation` (웹 슬라이드), `pptx` (파워포인트) 중 여러 포맷을 동시에 체크하여 한 번에 변환할 수 있습니다. 변환이 완료되면 출력 폴더 하위에 포털 인덱스 목차 페이지(`index.html`)가 동적 빌드되어, 각 파일별로 생성된 다양한 포맷 결과물의 새 창 보기 및 다운로드 바로가기 링크 버튼들을 카드 리스트 형태로 제공합니다.

---

## 3. PPTX 인스펙터 (모듈 3)

이 도구는 벤치마킹할 기존 PPTX 파일의 디자인 유전자를 추출하거나, 특정 PPTX 파일의 색상을 일괄 교정할 때 사용하는 **완전 독립형 브라우저 유틸리티**입니다. `dashboard.html`/`webdesignsuite.html`의 **[3. PPTX 인스펙터]** 탭, 또는 단독 배포판 `pptx-inspector.html`에서 접근합니다. 모듈 1·2와 완전히 독립된 별개 워크플로입니다.

### 1) PPTX 디자인 분석 및 이식 (Module A & B)
1. **[Module A — 기준 설정]** 영역으로 진입합니다.
2. 분석하고자 하는 기준 PPTX 파일을 업로드 영역에 드롭합니다.
3. 파일 로드가 완료되면 PPTX에 내장된 색상 칩 세트, 폰트 종류, 그리고 타이틀/본문/로고 등의 레이아웃 구성 좌표가 시각화되어 노출됩니다.
4. **[Module B — 변환 실행]**으로 이동하여 변환 대상 타겟 PPTX 파일을 업로드합니다.
5. 치환 테이블에서 감지된 원래 폰트나 색상을 분석된 기준 설정(Baseline) 정보에 맞추어 매핑해 줍니다.
6. **[기준 테마 이식 실행 및 다운로드]**를 클릭하면 폰트와 컬러가 일괄 교정된 새 PPTX 파일이 저장됩니다.

### 2) 초경량 컬러 리매퍼 (일괄 색상 강제 교체)
* **목적**: 문서 가이드 변환과 무관하게, 특정 파워포인트 파일의 구형 로고색 등 원치 않는 특정 색상을 새 색상으로 1:1 강제 교체할 때 사용합니다.
1. 상단 탭에서 **[초경량 컬러 리매퍼]** (HelpCircle 아이콘) 버튼을 클릭합니다.
2. 가공할 PPTX 파일을 드래그하여 업로드합니다.
3. 감지된 색상 목록과 빈도수가 테이블로 노출되면, 각 행 우측의 타겟 컬러 피커나 HEX 입력창을 이용해 교체할 신규 색상을 지정합니다.
4. **[리매핑 일괄 실행 및 다운로드]**를 누르면 내부 색상이 1:1 일괄 치환되어 즉시 다운로드됩니다.

### 🛡️ [안전 규격] XML 무결성 검증기 (Schema Validator) 작동
* 파워포인트 파일은 내부적으로 여러 XML 파일들의 압축체입니다. 문자열 교체 작업 중 태그가 깨지거나 잘못된 문자가 주입되면 파일이 깨집니다.
* V2.0 인스펙터/리매퍼는 zip으로 다시 패킹하기 직전 **무결성 검사기**를 작동시켜 XML 문법을 자동 스캔합니다. 만약 구문이 깨진 것이 감지되면 변환을 즉각 중단하고 에러가 발생한 위치를 보고하여 **손상된 PPTX 파일 생성을 원천 방지**합니다.

---

## 4. 설정 파일 유지보수 가이드

이 섹션은 실무 유지보수 담당자가 폰트·색상·레이아웃 등 각 설정값을 직접 수정하는 방법을 정확히 설명합니다.

---

### 4-1. 전역 폰트 패밀리 변경 — `config/htmldesign.config.json`

HTML 가이드 출력 전체에 적용되는 **웹폰트 패밀리**를 지정합니다.

```json
// config/htmldesign.config.json
{
  "htmlFont": {
    "title": "'Noto Serif KR', serif",    // 제목 영역 폰트
    "desc":  "'Noto Sans KR', sans-serif", // 본문/설명 폰트
    "note":  "'JetBrains Mono', monospace",// 노트/보조 폰트
    "code":  "'JetBrains Mono', monospace",// 코드 블록 폰트
    "tag":   "'Noto Sans KR', sans-serif", // 배지/태그 폰트
    "scale": 1.0                           // 전역 폰트 크기 배율 (기본 1.0)
  }
}
```

**`scale` 필드 활용법**: `0.9` → 전체 10% 축소, `1.1` → 전체 10% 확대.  
이 배율은 빌드 시 CSS 변수 `--font-scale`로 삽입되어 모든 크기 계산에 곱해집니다.  
숏코드 카드 제목·설명 폰트는 별도 변수로 관리됩니다(아래 4-2 참고).

**수정 후**: `node scripts/build-guide.mjs <파일>.md --out <출력>.html` 로 재빌드하면 반영됩니다.

---

### 4-2. 전역 숏코드 카드 폰트 크기 변경 — `scripts/build-guide.mjs`

모든 숏코드의 **카드 제목(title)과 카드 설명(desc) 크기**는 `build-guide.mjs` 내부 CSS 변수 두 개로 통일 관리됩니다.

**위치**: `scripts/build-guide.mjs` 약 984~985번째 줄, `:root { }` 블록 안

```css
/* scripts/build-guide.mjs — :root CSS 변수 블록 */
--size-card-title: 1.15rem;   /* 모든 숏코드 카드 제목 크기 */
--size-card-p:     0.92rem;   /* 모든 숏코드 카드 설명/본문 크기 */

/* 특수 목적 별도 변수 (data.stats, grid.tiers 전용) */
--size-stat-val:      2.4rem;
--size-stat-name:     1.1rem;
--size-stat-note:     0.8rem;
--size-plan-badge:    0.75rem;
--size-plan-features: 0.95rem;
```

**수정 방법**: 해당 줄의 숫자(rem 값)를 직접 변경합니다.  
예) 카드 제목을 더 크게: `--size-card-title: 1.25rem;`

**수정 후**: 재빌드 필요 (`node scripts/build-guide.mjs ...`).

---

### 4-3. 특정 숏코드만 폰트 크기 변경 — `title-size` / `desc-size` 인수

전역 기본값을 유지하면서 **특정 숏코드 블록만** 크기를 다르게 지정할 수 있습니다.  
숏코드 선언 줄에 `title-size` 또는 `desc-size` 인수를 추가합니다.

#### 비율 지정 (숫자만 입력 → 기본값 대비 배율)

```markdown
::: grid.cards title-size=0.9 desc-size=0.85
- icon: 🔵
  title: 작은 타이틀 (기본의 90%)
  desc: 작은 설명 (기본의 85%)
:::
```

- `title-size=0.9` → `0.9 × 1.15rem = 1.035rem`
- `desc-size=0.85` → `0.85 × 0.92rem = 0.782rem`

#### 절대값 지정 (단위 포함 → 그대로 적용)

```markdown
::: nav.faq title-size=1.0rem desc-size=0.8rem
- title: 질문
  desc: 답변
:::
```

#### 하나만 변경도 가능

```markdown
::: process.track title-size=1.3rem connector=none
- icon: 📥
  title: 큰 단계 제목
  desc: 설명은 기본 크기
:::
```

**적용 범위**: 해당 숏코드 블록 내부에만 적용되며 다른 블록에 영향을 주지 않습니다.  
**모든 28종 숏코드**에서 사용 가능합니다.

---

### 4-4. 테마 색상 변경 — `config/styles.json`

HTML/PPTX 양쪽에 적용되는 테마 팔레트를 정의합니다.

```jsonc
// config/styles.json (예시 — sky-blue 테마)
{
  "sky-blue": {
    "label": "커스텀 블루",
    "brand":      "#3b82f6",   // 주 강조색 (버튼, 아이콘, 링크)
    "brandDark":  "#1d4ed8",   // 어두운 강조색 (호버, 헤더 배경)
    "brandLight": "#eff6ff",   // 밝은 강조색 (카드 배경, 하이라이트)
    "bg":         "#ffffff",   // 페이지 배경
    "text":       "#1e293b",   // 기본 텍스트
    "text2":      "#64748b",   // 보조 텍스트
    "pptxFont":   "paperlogy-regular"  // PPTX 폰트 alias
  }
}
```

**수정 방법**:
- React UI 개발 서버(`npm run dev`) 실행 중 → 디자인 시스템 탭의 테마 빌더에서 색상 피커로 직접 수정 후 **[서버에 최종 저장하기]** 클릭
- 직접 편집 → `config/styles.json` 파일을 텍스트 에디터로 열어 HEX 코드 수정

**반영**: 재빌드 없이 `node scripts/build-guide.mjs ...` 실행 시 자동 적용됩니다.

---

### 4-5. PPTX 레이아웃 기본값 변경 — `config/pptdesign.config.json`

PPTX 출력의 슬라이드 크기, 여백, 기본 폰트, 둥글기 등을 설정합니다.

```jsonc
// config/pptdesign.config.json (주요 키)
{
  "slide": {
    "width": 13.33,           // 슬라이드 너비 (인치, 16:9 기준)
    "height": 7.5,            // 슬라이드 높이 (인치)
    "globalRadius": 0.08      // 도형 둥글기 (인치, 0 = 각진 형태)
  },
  "font": {
    "body": "malgun",         // 본문 폰트 alias
    "title": "malgun",        // 제목 폰트 alias
    "subtitle": "malgun"      // 부제목 폰트 alias
  }
}
```

폰트 alias 전체 목록은 `config/font-aliases.json` 참고 (예: `paperlogy-regular` → `페이퍼로지 4 Regular`).

---

### 4-6. 독립형 HTML 파일 빌드 — `npm run build:standalone`

서버 없이 브라우저에서 직접 열 수 있는 자체 완결 HTML **4종**을 빌드합니다(2026-09 3모듈 재편 이후).

```bash
npm run build:standalone
# 출력물:
#   dist/webdesignsuite.html — 모듈 1+2+3 통합 (탭 전환)
#   dist/design-system.html  — 모듈 1: 디자인 시스템 (테마 조율 & 보조 유틸리티, 저장은 서버 연계 전용)
#   dist/guide-authoring.html — 모듈 2: 가이드북 컴파일러 (클라이언트 컴파일 폴백)
#   dist/pptx-inspector.html — 모듈 3: PPTX 인스펙터 단독 (서버리스)
```

- 외부 CDN/서버 의존성 없음 — 오프라인 환경에서도 동작
- 모듈 2는 클라이언트 사이드 컴파일 폴백 내장 → 브라우저에서 MD → HTML/PPTX 변환 가능
- 모듈 1은 조회(폴백 프리셋 표시·대비 검사 등)는 오프라인에서도 되지만, `styles.json`에 실제 저장하는 것은 서버 연계 모드(`npm run dev`)에서만 가능

---

### 4-7. 가이드 원고(md) 자체를 배포용 HTML/PPTX로 내보내기

위 4-6은 **에디터 도구**를 오프라인 앱으로 만드는 것이고, 아래는 **작성한 가이드 원고**를 독자에게 나눠줄 결과물(HTML/PPTX)로 뽑는 명령입니다. UI의 "저장 & 생성" 버튼과 동일한 작업을 터미널에서 직접 할 때 사용합니다.

**A. md 파일 1개 → 3종 포맷 중 원하는 것만**

```bash
# 종형(위→아래 스크롤) 가이드 문서
node scripts/build-guide.mjs md_src/guides/Claude.md --out publish/guides/Claude.html

# 횡형(좌→우 슬라이드) 프레젠테이션 — 좌상단 ☰ 버튼으로 목차 열림
node scripts/build-presentation.mjs md_src/guides/Claude.md --out publish/guides/Claude_presentation.html

# 파워포인트(PPTX)
node scripts/md-to-pptx.mjs md_src/guides/Claude.md --out publish/guides/Claude.pptx
```

**B. md_src 하위 폴더 전체 → 통합 1개 파일 (허브)**

폴더 안의 모든 md를 하나로 묶어 "가이드북 한 권"처럼 배포하고 싶을 때는 목적에 따라 둘 중 하나를 씁니다.

```bash
# 횡형 통합 — 슬라이드를 넘기며 훑어보는 발표/데모용 (문서마다 표지가 챕터 구분점)
node scripts/build-presentation.mjs "md_src/guides/*.md" --out publish/guides_slides.html

# 종형 통합 — 좌측 사이드바에서 필요한 도구를 찾아 읽는 레퍼런스/오프라인 가이드북용(onepage, 서버 없이 파일 하나로 열림)
npm run build:onepage -- --dir guides   # 기본 출력: publish/guides-onepage.html

# 폴더 하나를 통째로: 개별 html/presentation/pptx + 폴더 index.html + (설정에 따라) onepage·통합 프레젠테이션 덱까지
npm run build:folder -- --dir guides
```

`--dir` 값을 `claudeguide` 등 다른 `md_src` 하위 폴더명으로 바꾸면 그 폴더 전체가 같은 방식으로 처리됩니다(기본 출력도 `publish/claudeguide-onepage.html`처럼 자동으로 맞춰짐 — "-onepage" 표시는 파일명 로직에 항상 붙습니다). `--out`을 여러 번 쓰면 같은 내용을 여러 경로에 동시 저장합니다.

카테고리 라벨·표시 순서·사이드바 기본 열림 상태·기본 산출물 옵션은 `md_src/<폴더>/hub.config.json`에서 폴더별로 관리합니다(파일이 없으면 안전한 기본값으로 동작). 예:

```json
{
  "categories": {
    "order": ["ai-usage", "ai-tools", "my-projects"],
    "meta": { "ai-usage": { "label": "AI 사용 방법", "color": "#2789F5" } }
  },
  "sidebar": { "defaultOpen": true },
  "outputs": { "standalone": true, "presentationBundle": false }
}
```

> 💡 두 방식 모두 인터넷 연결 없이 파일 하나만으로 열립니다. 어느 쪽을 언제 쓸지는 [`README.md` 2-1절](../README.md#2-1-빌드-파이프라인-개별-파일-출력-vs-폴더-전체-허브통합-출력)에 비교표로 정리되어 있습니다.
