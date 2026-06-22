# 📋 Marp 기능 통합 및 커스텀 슬라이드 설정 구현 계획서

본 계획서는 Marp 프레젠테이션 엔진의 강점(슬라이드 분할 규칙, 스타일 오버라이드)을 Creative Spark 프로젝트에 이식하여 문서 작성 편의성과 시각적 통제력을 강화하는 구현 방안을 다룹니다.

---

## 1. 주요 변경 및 개선 사항

### 1) 슬라이드 분할 규칙 병행 지원 (H1, H2 및 `---` 공존)
H1(`#`), H2(`##`) 기반 자동 슬라이드 분할과 `---` 수평선 기준 수동 분할이 한 문서 내에서 혼용되어도 빈 페이지(빈 슬라이드)가 생성되지 않도록 유효성 검증 단계를 추가합니다.

#### [MODIFY] [md-to-pptx.mjs](file:///c:/ai/creative-spark/scripts/md-to-pptx.mjs)
* **목표**: 헤더 분할과 `---` 분할이 연속해서 일어날 때 발생하는 빈 슬라이드 스킵 처리.
* **로직**:
  * 슬라이드를 생성하는 구분자(H1, H2, `---`)가 감지되었을 때, 현재 작업 중인 슬라이드 객체에 내용(카드, 숏코드, 리스트 등)이 비어있다면 물리적으로 새 페이지를 생성하지 않고 기존 슬라이드 정보(예: 타이틀 등)를 덮어쓰거나 무시합니다.

#### [MODIFY] [build-presentation.mjs](file:///c:/ai/creative-spark/scripts/build-presentation.mjs)
* **목표**: 횡형 HTML 슬라이드 빌더 스크립트에서도 동일한 슬라이드 스킵 및 병행 구분자 처리 적용.

---

### 2) 프론트메터 전역 스타일 오버라이드
개별 문서별로 고유한 폰트 패밀리나 제목/본문 글자 크기를 적용할 수 있도록 마크다운 상단 Frontmatter 옵션을 지원합니다.

#### [MODIFY] [md-to-pptx.mjs](file:///c:/ai/creative-spark/scripts/md-to-pptx.mjs)
* Frontmatter 파싱 데이터(`fm` 객체)로부터 `fontFace`, `titleSize`, `bodySize` 값을 읽습니다.
* 해당 설정이 지정되어 있다면 전역 기본 설정인 `config/pptdesign.config.json` 값 대신 최우선 반영합니다.
* 예시:
  ```javascript
  const slideFont = fm.fontFace || D.slide.font;
  const slideTitleSize = fm.titleSize || D.card.titleSize;
  const slideBodySize = fm.bodySize || D.card.bodySize;
  ```

---

### 3) 로컬 슬라이드 스타일 지시어 `::: slide-config` 도입
특정 슬라이드 영역에만 배경색, 글자색 등을 임시 변경할 수 있는 단발성 설정 블록을 추가합니다. 이 블록은 다음 슬라이드 분할 트리거(H1, H2, `---`)를 만나는 즉시 소멸(기본값 복원)됩니다.

#### 지원 옵션 규격
* `bg`: 슬라이드 배경색 지정 (Hex 컬러코드, 예: `"#0F172A"`)
* `color`: 슬라이드 본문 글자색 지정 (Hex 컬러코드, 예: `"#FFFFFF"`)
* `titleSize`: 해당 슬라이드 한정 제목 크기 지정 (숫자, 예: `22`)
* `bodySize`: 해당 슬라이드 한정 본문 크기 지정 (숫자, 예: `12`)

#### [MODIFY] [md-to-pptx.mjs](file:///c:/ai/creative-spark/scripts/md-to-pptx.mjs)
* 파서가 `::: slide-config` 블록을 감지하면 내부 인자값을 파싱하여 현재 작업 중인 슬라이드의 스타일 옵션에 바인딩합니다.
* 새 슬라이드를 닫고 새로 시작하는 `closeSection()` 또는 `closeCard()` 시점에 이 로컬 설정 변수들을 초기화(리셋)합니다.

#### [MODIFY] [build-guide.mjs](file:///c:/ai/creative-spark/scripts/build-guide.mjs)
* HTML 가이드 빌더에서도 `::: slide-config` 숏코드를 감지하여 해당 슬라이드 HTML 컨테이너 요소에 인라인 CSS 변수(예: `--slide-bg`, `--slide-color`)를 주입하는 렌더링 요소를 추가합니다.

---

## 2. 검증 계획

### 1) 자동 테스트 수행
* 파이프라인 컴파일러 빌드에 문법 오류가 없는지 유닛 테스트 실행:
  ```bash
  npm run test
  ```

### 2) 수동 검증 단계
1. 검증용 마크다운 파일 `md_src/guides/test-marp-features.md`를 생성하고 아래 요소를 작성합니다:
   - 전역 폰트 크기 조정을 포함한 프론트메터 설정.
   - H1 헤더와 `---` 수평선이 연속하거나 혼용된 페이지 분할 구조.
   - `::: slide-config` 숏코드가 적용된 검은색 다크 모드 슬라이드 페이지.
2. 빌드 스크립트 일괄 가동:
   ```bash
   npm run sync:guides
   npm run build:publish
   ```
3. `public/presentation/` 및 `public/guides/` 하위의 HTML 결과물을 브라우저로 열어 슬라이드가 정상 개수만큼 나누어졌는지, 배경색이 특정 슬라이드만 바뀌었는지 확인합니다.
4. `public/pptx/test-marp-features.pptx` 파워포인트 파일을 실행하여 슬라이드 분할 정합성과 글자 오버라이드가 네이티브 도형으로 편집 가능한 형태로 올바르게 적용되었는지 교차 검증합니다.
