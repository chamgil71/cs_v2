# [호환성 로그] V1.0 경로 이동 및 V2.0 호환 명세서

본 문서는 기존 V1.0 컴파일러 런타임 코드 및 설정을 100% 무수정 보존하기 위해, 리팩토링 과정에서 이동된 파일들의 경로 매핑과 가이드라인 문서의 영향도를 별도로 기록·추적한 문서입니다.

---

## 1. 파일 이동 기록 및 실행 경로 매핑 (relocation-map)

기존 `storage/designspec` 폴더는 로컬 임시 저장소 역할로 변경됨에 따라, 형상 관리가 필요한 주요 디자인 명세 소스 및 산출물 파일들이 아래와 같이 공식 경로로 이전되었습니다. 이로 인한 V1.0 컴파일러의 작동은 원본 그대로 유지되며 호출 인자만 변경됩니다.

| 과거 파일 경로 (V1.0) | 이전된 신규 파일 경로 (V2.0 호환) | 용도 및 성격 |
| :--- | :--- | :--- |
| `storage/designspec/sample-content.md` | **`md_src/designspec/sample-content.md`** | 디자인 명세서 원본 마크다운 소스 |
| `storage/designspec/template.json` | **`md_src/designspec/template.json`** | 디자인 사양서 전용 JSON 템플릿 |
| `storage/designspec/nipa_design_system_spec.html` | **`public/designspec/nipa_design_system_spec.html`** | NIPA 디자인 가이드 탭 웹 뷰어 |
| `storage/designspec/nipa-blue.html` | **`public/designspec/nipa-blue.html`** | NIPA 블루 테마 빌드 아웃풋 |
| `storage/designspec/teal-noto.html` | **`public/designspec/teal-noto.html`** | Teal + Noto Sans 테마 빌드 아웃풋 |
| `storage/designspec/violet-human.html` | **`public/designspec/violet-human.html`** | Violet + 휴먼명조 테마 빌드 아웃풋 |

### 🛠️ 실행 명령어 변경 내역 (CLI Usage Changes)
기존 파이썬 의존성을 대체하여 생성된 Node.js 독립 실행형 컴파일러(`designspec-md-to-html.mjs`) 구동 시, 인풋/아웃풋 경로는 위 표에 따라 다음과 같이 지정해야 합니다.

```bash
# V1.0 과거 실행 형태 (레거시)
node scripts/designspec-md-to-html.mjs --content storage/designspec/sample-content.md --template storage/designspec/template.json --output storage/designspec/nipa-blue.html

# V2.0 호환 최신 실행 형태 (1.0 무수정 보존)
node scripts/designspec-md-to-html.mjs --content md_src/designspec/sample-content.md --template md_src/designspec/template.json --output public/designspec/nipa-blue.html
```

---

## 2. 기존 가이드 및 리드미(README) 문서와의 정합성 기록

기존 문서들에서 옛 경로(`storage/designspec`)를 언급하고 있는 내용에 대한 호환 분석입니다. 기존 V1 문서의 원본 수정 없이 아래 매핑 규칙에 따라 대체 열람합니다.

### A. [README.md] (프로젝트 루트 리드미)
* **이동 영향**: 폴더 트리 구조 설명란 중 `storage/` 파트에서 `storage/designspec/` 언급이 삭제되고, `md_src/designspec/`과 `public/designspec/`으로 역할이 승계되었습니다.

### B. [docs/pipeline.md] (콘텐츠 파이프라인 명세)
* **이동 영향**: 디자인 사양 템플릿 로드 경로가 `storage/` 하위에서 `md_src/` 하위로 마이그레이션되었습니다.

### C. V1 1.0 컴파일러 엔진 보존 확인
* **대상 파일**: `scripts/build-guide.mjs`, `scripts/build-presentation.mjs`, `scripts/md-to-pptx.mjs`
* **보존 상태**: V2.0 개발 및 이식 시 해당 파일들의 파싱 정규식, CSS 템플릿 변수, pptxgenjs 마스터 슬라이드 생성 로직은 절대 직접 수정하지 않습니다. V2.0 전용 폴더(`scripts/v2/`, `config/v2/`) 하위의 신규 격리 파일들만을 대상으로 기능을 고도화합니다.

---

## 3. V2.0 폰트 매핑 및 로컬 참조 원칙 기록

### A. storage/ 디렉토리 알고리즘 참조 제한
* **정책**: `storage/PPT디자인 분석v1.1` 및 `storage/pptdesignsystem` 하위의 JSZip/XML 파서 로직과 색상 추천 프리셋 소스는 로컬 테스트 및 알고리즘 분석 용도로만 참조합니다. 
* **이식 규격**: 본 프로젝트 적용 시에는 V1.0을 해치지 않고 `scripts/v2/` 및 `src/v2/`에 정식으로 재코딩하여 이식합니다.

### B. 11종 현대적 한글/영문 폰트 목록 및 마크다운 바인딩
디자인 분석기 및 컴파일러 V2 런타임에 기본 포함되어 상호 운용성을 보증할 서체 구성표입니다.
* **Pretendard**, **SUIT**, **Wanted Sans**, **Paperlogy**, **Gmarket Sans**, **LINE Seed KR**, **Spoqa Han Sans Neo**, **Noto Sans KR**, **IBM Plex Sans KR**, **NanumSquare Neo**, **Sunghyun Sans**
* **구현방식**: `config/v2/styles.json` 폰트 슬롯 및 웹뷰 테마 설정 드로어에 구글 폰트(또는 해당 CDN)의 글꼴 스펙이 자동 탑재되며, PPTX 컴파일 시 해당 폰트 이름 정보가 pptxgenjs 객체에 전달되도록 구현합니다.

