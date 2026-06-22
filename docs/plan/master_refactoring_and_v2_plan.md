# [통합 마스터 계획서] 프로젝트 리팩토링 및 V2 개발 계획 (v5)

본 문서는 기존 1.0 컴파일러 파이프라인의 안전성을 100% 보장하면서, 새로운 V2 포맷-디자인 교차 변환 프레임워크를 설계·구현하기 위한 종합 타당성 분석 및 리팩토링 마스터 계획서입니다.

---

## 1. 개요 및 V2 지향점

V2 프레임워크는 지식 문서의 생산성과 디자인의 일관성을 강화하기 위해 **"콘텐츠 포맷(MD, HTML, PPTX)"**과 **"디자인 스타일(styles.json, layout.json)"**을 독립 분리하고, 이를 파서를 통해 동적으로 상호 결합하는 구조를 지향합니다.

### 🔄 V2 핵심 데이터 흐름 (Core Data Flow)
디자인 지침서 및 기존 PPTX 양쪽에서 디자인 토큰을 양방향으로 추출하여 변환 엔진에 주입하는 순환 아키텍처입니다.

```
1) 디자인 지침 추출 단계
[디자인 지침서 (Text/MD)] ──▶ [디자인 가이드 파서] ─────┐
                                                          ▼
[기존 PPTX 템플릿 파일] ───────▶ [PPTX 디자인 분석기] ──▶ [디자인 토큰 (v2/styles.json)]
                                                          │ (디자인 적용)
                                                          ▼
2) 콘텐츠 교차 변환 단계
[마크다운 원본 (MD)] ───────────(숏코드 변환)─────────▶ [V2 컴파일러 엔진 (JS)]
                                                          │
                                                          ▼
                                                  [HTML / Slide HTML / PPTX]
```

---

## 2. V1.0 보존 및 V2.0 격리 구조 (1.0 무영향 원칙)

기존 1.0의 변환 스크립트들과 설정(CLI 구동 내용)은 실시간 서비스 운영을 위해 전혀 건드리지 않고 그대로 보존합니다. V2.0은 별도의 격리된 폴더 스키마로 분리 개발하여 상호 영향도를 0%로 제한합니다.

```
creative-spark/
├── scripts/                    # V1.0 컴파일러 스크립트 보관소 (보존)
│   ├── build-guide.mjs
│   ├── build-presentation.mjs
│   └── md-to-pptx.mjs
│
├── config/                     # V1.0 설정 및 토큰 (보존)
│   ├── styles.json
│   └── pptdesign.config.json
│
├── scripts/v2/                 # [신설] V2.0 엔진 핵심 코드 (서버리스 지향)
│   ├── spec-parser.js          # 디자인 지침서 ──> styles.json 추출기
│   ├── pptx-analyzer.js        # PPTX 템플릿 ──> XML 테마 분석기
│   └── standalone-builder.js   # V2.0 원파일 HTML 패키저
│
├── config/v2/                  # [신설] V2.0 설정 및 레이아웃 제어
│   ├── styles.json             # V2.0 동적 테마 프리셋 테이블 (현대적 11종 폰트 스펙 포함)
│   └── layout.json             # V2.0 컴포넌트 세부 좌표 규격
│
├── src/v2/                     # [신설] V2.0 웹뷰 및 디자인 분석기 GUI (React)
│   ├── components/
│   │   ├── VisualAdjuster.tsx  # Module B. 스타일 미세 조율 웹뷰
│   │   ├── PptxAnalyzer.tsx    # Module C. PPTX 파일 파서 및 이식기 UI
│   │   └── SubUtilities.tsx    # 부가서비스 (색상검사기/컬러리매퍼)
│   └── main-v2.tsx             # V2.0 통합 에디터 진입점
│
└── md_src/designspec/          # 형상 관리되는 디자인 지침 및 명세서
    ├── sample-content.md
    └── template.json
```

> **storage/ 폴더의 제한적 참조 규칙**:
> `storage/` 폴더는 `.gitignore` 처리되어 깃허브 형상 관리에 포함되지 않는 로컬 보관소 전용입니다. 따라서 이 폴더 하위에 위치한 디자인 분석기 스크립트 및 컬러 컨버터 소스는 오직 **"알고리즘 참조용"**으로만 사용하며, 프로젝트 결합 시 V2용 정규 아키텍처 (`src/v2/`, `scripts/v2/`)에 맞추어 완전하게 재구축 및 정리하여 이식합니다.

---

## 3. V2.0 현대적 한글·영문 폰트 프리셋 명세

사용자 인터페이스의 심미성과 가독성을 위해 V2 테마 프리셋 (`config/v2/styles.json`) 및 PPTX 폰트 매핑 파서에 아래 11종의 현대적 서체를 등록하고 자동 이식을 보증합니다.

| 서체명 | 추천 용도 | 웹용 CDN 웹폰트 주소 | PPTX 렌더링 글꼴명 |
| :--- | :--- | :--- | :--- |
| **Pretendard** | 본문 및 UI 표준 | `https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css` | `Pretendard`, `Pretendard SemiBold` |
| **SUIT** | UI 인터페이스용 | `https://cdn.jsdelivr.net/gh/sun-typeface/SUIT/fonts/static/woff2/SUIT.css` | `SUIT` |
| **Wanted Sans** | 굵고 현대적인 타이틀 | `https://cdn.jsdelivr.net/gh/wanteddev/wanted-sans/packages/wanted-sans/dist/expert/style.css` | `Wanted Sans` |
| **Paperlogy** | 가독성 위주의 본문 | `https://cdn.jsdelivr.net/gh/fontmon/paperlogy/web/css/paperlogy.css` | `Paperlogy` |
| **Gmarket Sans** | 제목 강조용 헤드라인 | `https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/GmarketSansMedium.woff` | `Gmarket Sans Bold` |
| **LINE Seed KR** | 네이버 라인 계열 본문 | `https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2403-2@1.0/LINESeedKR-Bd.woff` | `LINE Seed KR` |
| **Spoqa Han Sans Neo** | 모던 서비스 본문 | `https://spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css` | `Spoqa Han Sans Neo` |
| **Noto Sans KR** | 구글 표준 무채색 | `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap` | `Noto Sans KR` |
| **IBM Plex Sans KR** | 개발자 문서 / 코드 | `https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;600&display=swap` | `IBM Plex Sans KR` |
| **NanumSquare Neo** | 세련된 네이버 폰트 | `https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2302@1.0/NanumSquareNeo-Variable.woff2` | `NanumSquare Neo` |
| **Sunghyun Sans** | SF Pro 라운드 느낌 | `https://cdn.jsdelivr.net/gh/sunghyun-cho/sunghyun-sans/sunghyun-sans.css` | `Sunghyun Sans` |

---

## 4. 3대 독립 모듈의 설계 및 유기적 연동 방안

각 모듈은 독자적인 GUI와 기능을 가지고 브라우저 단독 컴포넌트로 동작하지만, **디자인 토큰(styles.json) 및 레이아웃 설정(layout.json)**을 매개체로 연결되어 유기적인 통합 파이프라인을 이룹니다.

### 1) Module A — MD 변환 엔진 (Markdown Converter)
* **기능**: 마크다운 숏코드를 분석하여 일반 HTML 문서, 횡형 HTML 슬라이드, 파워포인트(PPTX) 파일로 컴파일.
* **연동**: **Module B**에서 조정한 스타일 매개변수와 **Module C**에서 추출된 PPTX 색상/폰트 토큰을 주입받아 컴파일 런타임에 직접 투입합니다.

### 2) Module B — 웹뷰 실시간 스타일 조율기 (Visual Adjuster)
* **기능**: 생성된 HTML/횡 HTML을 iframe 또는 Shadow DOM 뷰포트로 렌더링하고, 사이드바 GUI를 통해 CSS 변수(HSL 테마, 타이포그래피, 숏코드 여백)를 마우스 조작으로 미세 조정.
* **연동**: 조정된 값은 실시간으로 CSS Custom Property로 웹뷰에 바인딩되어 시각 반영되며, 즉석에서 새로운 V2 `styles.json`으로 저장되어 **Module A**의 빌드 옵션으로 동기화됩니다.

### 3) Module C — PPTX 디자인 분석 및 이식기 (PPTX Analyzer)
* **기능**: 기존 PPTX 파일의 압축을 해제하고 XML 구조(특히 `theme1.xml`, `slideLayouts`)를 직접 읽어 **디자인 기준(색상 스키마, 주요 폰트, 플레이스홀더 위치)**을 추출하고, 타깃 PPTX의 요소들을 분석 결과에 따라 치환 후 재압축(Zip).
* **연동**: 추출된 PPTX 디자인 데이터(컬러 스키마 등)를 **Module B**에 스타일 프리셋으로 공급하여 가이드북 디자인을 PPTX의 테마 색상으로 순식간에 통일시키고, **Module A**가 생성하는 새 PPTX에 적용할 스타일 마스터로 이식합니다.

---

## 5. 원파일 HTML (오프라인 독립형) 구현 방안

V2에서는 브라우저에 파서 라이브러리를 직접 임베딩하여 **완전한 클라이언트 독립 실행(서버리스) 모델**을 구축합니다.

1. **마크다운 렌더링**: Node.js의 marked 의존성을 브라우저용 `marked.min.js` (CDN 혹은 번들 임베딩)로 변경하여 브라우저 로컬에서 직접 숏코드 구문을 AST로 파싱하고 HTML 스트링으로 변환합니다.
2. **PPTX 생성**: `pptxgenjs` 웹 버전 및 `jszip.min.js`를 HTML에 탑재하여, 서버 백엔드를 호출하지 않고 브라우저 상에서 직접 PPTX를 zip 연산해 `Blob` 파일로 즉시 다운로드(`saveAs`)하도록 구현합니다.
3. **독립 배포 모델**: `dist/v2-standalone.html` 단 하나의 파일 안에 핵심 JS 라이브러리(`jszip`, `marked`, `pptxgenjs`), 에디터 React 런타임, 그리고 가이드 데이터셋을 통합 패키징하여 배포합니다.

---

## 6. 부가 서비스 (Sub-tools) 병합 아키텍처

`pptdesignsystem`의 팁과 보조 도구들을 V2 프로젝트의 메인 대시보드 하위 **[도구 / 부가서비스]** 영역에 독립형 유틸리티 탭으로 통합 병합합니다.

* **색상표 미리보기 및 검사기 (`color_palette_preview.html` 통합)**
  * **기능**: 색상을 입력하면 테마 적합성(보조 텍스트 가독성 대비, HSL 보완도)을 검사해 줍니다.
  * **통합**: V2 테마 매니저 하위 탭으로 내장하여 검사 결과를 즉시 styles.json 프리셋으로 원클릭 등록할 수 있게 보완합니다.
* **PPTX 색상 변환기 (`pptx_Color_Converter.html` / `NIPA_색상변환기.html` 통합)**
  * **기능**: PPTX 내 XML 구조에서 특정 HSL/Hex 코드를 타깃 컬러로 일괄 치환하는 기능.
  * **통합**: PPTX 전체 컴파일러와 별개로, 기존 PPTX 파일만 업로드해서 특정 색상만 신속히 치환해 주는 **"초경량 PPTX 컬러 리매퍼"** 패널로 병합 제공합니다.

---

## 7. 타당성 분석 및 한계점 대안 (Feasibility & Alternatives)

### A. 기성 도구(Marp, Pandoc) 대비 타당성
* **Marp**: PPTX 출력 시 모든 슬라이드를 이미지로 처리하여 텍스트 수정이 불가능하지만, 본 V2 엔진은 `pptxgenjs`를 직접 호출하여 실제 편집 가능한 파워포인트 객체로 변환하므로 비즈니스 협업 가치가 압도적으로 높습니다.
* **Pandoc**: 레이아웃 컴포넌트(2단 카드, 콘솔창 래퍼 등)의 시각적 형태를 변환할 수 없으나, V2의 숏코드 파서는 컴포넌트 구조를 분해하여 완벽한 UI 객체로 이식합니다.

### B. 시스템 비대화 방지 (Lightweight Constraints)
* 가상 브라우저 제어 라이브러리(Puppeteer, Playwright 등)를 본선 빌드 파이프라인에서 완전히 제외합니다.
* 파이썬 런타임 의존성을 차단하고, 100% 자바스크립트/Node.js 네이티브 패키지로 컴파일을 완결 지어 빌드 타임을 1초 미만으로 단축하고 디스크 용량 오버헤드를 예방합니다.

---

## 8. V2.0 개발 및 리팩토링 단계별 로드맵

1. **Phase 1 (V1 보호 및 V2 디렉토리 분리)**: `config/v2/`, `scripts/v2/`, `src/v2/` 뼈대를 구축하고 V1 동작 검증.
2. **Phase 2 (Module C PPTX 분석 및 이식기 이식)**: JSZip 및 XML 파서를 이식해 브라우저 단독 PPTX 분석 및 생성 기능 통합.
3. **Phase 3 (Module B 실시간 웹뷰 조율 및 layout.json 바인딩)**: iframe/Shadow DOM 기반 HSL 스타일 실시간 미세조정 UI 개발.
4. **Phase 4 (원파일 번들러 및 부가서비스 통합)**: `dist/v2-standalone.html` 생성 패키저 구축 및 색상 변환기 등 부가 서비스 탑재.
이드북 디자인을 PPTX의 테마 색상으로 순식간에 통일시키고, **Module A**가 생성하는 새 PPTX에 적용할 스타일 마스터로 이식합니다.

---

## 4. 원파일 HTML (오프라인 독립형) 구현 방안

V2에서는 브라우저에 파서 라이브러리를 직접 임베딩하여 **완전한 클라이언트 독립 실행(서버리스) 모델**을 구축합니다.

1. **마크다운 렌더링**: Node.js의 marked 의존성을 브라우저용 `marked.min.js` (CDN 혹은 번들 임베딩)로 변경하여 브라우저 로컬에서 직접 숏코드 구문을 AST로 파싱하고 HTML 스트링으로 변환합니다.
2. **PPTX 바이너리 직접 생성**: `pptxgenjs` 웹 버전 및 `jszip.min.js`를 HTML에 탑재하여, 서버 백엔드를 호출하지 않고 유저 브라우저 메모리상에서 직접 PPTX를 zip 연산해 `Blob` 파일로 즉시 다운로드(`saveAs`)하도록 구현합니다.
3. **독립 배포 모델**: `dist/v2-standalone.html` 단 하나의 파일 안에 핵심 JS 라이브러리(`jszip`, `marked`, `pptxgenjs`), 에디터 React 런타임, 그리고 가이드 데이터셋을 통합 패키징하여 배포합니다.

---

## 5. 부가 서비스 (Sub-tools) 병합 아키텍처

`pptdesignsystem`의 팁과 보조 도구들을 V2 프로젝트의 메인 대시보드 하위 **[도구 / 부가서비스]** 영역에 독립형 유틸리티 탭으로 통합 병합합니다.

* **색상표 미리보기 및 검사기 (`color_palette_preview.html` 통합)**
  * **기능**: 색상을 입력하면 테마 적합성(보조 텍스트 가독성 대비, HSL 보완도)을 검사해 줍니다.
  * **통합**: V2 테마 매니저 하위 탭으로 내장하여 검사 결과를 즉시 styles.json 프리셋으로 원클릭 등록할 수 있게 보완합니다.
* **PPTX 색상 변환기 (`pptx_Color_Converter.html` / `NIPA_색상변환기.html` 통합)**
  * **기능**: PPTX 내 XML 구조에서 특정 HSL/Hex 코드를 타깃 컬러로 일괄 치환하는 기능.
  * **통합**: PPTX 전체 컴파일러와 별개로, 기존 PPTX 파일만 업로드해서 특정 색상만 신속히 치환해 주는 **"초경량 PPTX 컬러 리매퍼"** 패널로 병합 제공합니다.

---

## 6. 타당성 분석 및 한계점 대안 (Feasibility & Alternatives)

### A. 기성 도구(Marp, Pandoc) 대비 타당성
* **Marp**: PPTX 출력 시 모든 레이아웃을 이미지로 고정하여 텍스트 수정이 불가능하지만, 본 V2 엔진은 `pptxgenjs`를 직접 호출하여 실제 편집 가능한 파워포인트 객체로 변환하므로 비즈니스 협업 가치가 압도적으로 높습니다.
* **Pandoc**: 레이아웃 컴포넌트(2단 카드, 콘솔창 래퍼 등)의 시각적 형태를 변환할 수 없으나, V2의 숏코드 파서는 컴포넌트 구조를 분해하여 완벽한 UI 객체로 이식합니다.

### B. 시스템 비대화 방지 (Lightweight Constraints)
* 가상 브라우저 제어 라이브러리(Puppeteer, Playwright 등)를 본선 빌드 파이프라인에서 완전히 제외합니다.
* 파이썬 런타임 의존성을 차단하고, 100% 자바스크립트/Node.js 네이티브 패키지로 컴파일을 완결 지어 빌드 타임을 1초 미만으로 단축하고 디스크 용량 오버헤드를 예방합니다.

---

## 7. V2.0 개발 및 리팩토링 단계별 로드맵

1. **Phase 1 (V1 보호 및 V2 디렉토리 분리)**: `config/v2/`, `scripts/v2/`, `src/v2/` 뼈대를 구축하고 V1 동작 검증.
2. **Phase 2 (Module C PPTX 분석 및 이식기 이식)**: JSZip 및 XML 파서를 이식해 브라우저 단독 PPTX 분석 및 생성 기능 통합.
3. **Phase 3 (Module B 실시간 웹뷰 조율 및 layout.json 바인딩)**: iframe/Shadow DOM 기반 HSL 스타일 실시간 미세조정 UI 개발.
4. **Phase 4 (원파일 번들러 및 부가서비스 통합)**: `dist/v2-standalone.html` 생성 패키저 구축 및 색상 변환기 등 부가 서비스 탑재.

