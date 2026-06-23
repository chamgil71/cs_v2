# Creative Spark V2.0 Design Suite - Docs
## 📂 문서 시스템 홈

이 디렉토리(`docs/`)는 V2.0 디자인 시스템 및 PPTX 분석기를 단독 패키지로 구동하고 활용하기 위한 공식 기술 문서 보관 공간입니다. 

V2.0은 기존 V1.0의 파일들과 구조적으로 격리되어 설계되었으며, 독립형 보조 도구와 연계형 저작 도구가 조화롭게 패키징되어 있습니다.

---

## 📄 제공 문서 목록

| 문서 | 파일명 | 대상 독자 | 핵심 내용 |
| :--- | :--- | :--- | :--- |
| **인프라 홈** | [docs_index.md](file:///c:/ai/cs_v2/docs/docs_index.md) | 전체 실무진 | 문서 보관소 로드맵 및 V2.0 아키텍처 개요 |
| **사용자 가이드** | [guide.md](file:///c:/ai/cs_v2/docs/guide.md) | 디자이너, 콘텐츠 작성자 | PPTX 인스펙터 분석/리매퍼 사용법, 마크다운 가독성 린터 가이드 |
| **개발자 가이드** | [scripts_guide.md](file:///c:/ai/cs_v2/docs/scripts_guide.md) | 엔지니어, 개발자 | PPTX XML 파서 엔진 명세, 백엔드 API 및 무결성 린터 코드 해설 |
| **실효성 분석** | [project_feasibility_analysis.md](file:///c:/ai/cs_v2/docs/plan/project_feasibility_analysis.md) | 기획자, 의사 결정권자 | 아키텍처 대안(통합 vs 격리) 비교 분석 및 검증 테스트 설계안 |
| **코드 상태 분석** | [code_analysis_report.md](./report/code_analysis_report.md) | 개발자, 기술 검토자 | 치명적 버그·하드코딩·정합성·오류 가능성·개선 제안 종합 보고서 (2026-06-22) |
| **견고성·유연성 점검** | [robustness_flexibility_report.md](./report/robustness_flexibility_report.md) | 개발자, 기술 검토자 | 타입 안전성·테스트·에러 핸들링·코드 중복·환경 구성·기관 종속 로직 점검 보고서 (2026-06-22) |
| **전방위 종합 점검** | [comprehensive_audit_report.md](./report/comprehensive_audit_report.md) | 개발자, 보안 검토자 | 보안·성능·유지보수성·접근성·운영성·데이터무결성·법적준수·문서화 8개 영역 종합 점검 보고서 (2026-06-22) |
| **디자인 피드백 검토** | [design_redesign_review.md](./report/design_redesign_review.md) | 디자이너, UI 개발자 | 타이포그래피 스케일 상향, 하드코딩 토큰 정리, 이모지 아이콘 정비 검토서 |
| **운영 점검 지침서** | [project_operation_prompt.md](./report/project_operation_prompt.md) | 전체 개발진, AI 에이전트 | 취약점 스캔 및 코드 정밀 점검을 위한 운영용 체크리스트 & 프롬프트 지침 |
| **패치 결과 보고서** | [patch_report_2026-06-23.md](./report/patch_report_2026-06-23.md) | 개발자, 보안 검토자 | 1차: 보안 취약점 3종 수정·standalone 빌드·클라이언트 컴파일러·유닛 테스트 63개 / 2차(§7): ESLint 설정·ErrorBoundary·npm audit 위험 수용 (2026-06-23) |


---

## ⚙️ V2.0 핵심 아키텍처 개요

V2.0은 기술적 복잡성과 의존성에 따라 **단독 구동형 스위트**와 **연계형 빌드 체인** 2가지 영역으로 나누어 제공됩니다.

### 1. 단독 구동형: PPTX 디자인 인스펙터 & 리매퍼
* **동작 환경**: 브라우저 로컬 단독 (서버리스)
* **주요 기술**: JSZip을 이용한 브라우저 단의 PPTX XML 해체, 파싱 및 정규식 치환
* **안전 규격**: 저장을 위한 패키징 직전 `DOMParser`를 이용해 XML 구문의 무결성(Well-formed)을 검사하는 **Schema Validator** 탑재.

### 2. 연계형: HSL 스타일 조율기 & 마크다운 컴파일러
* **동작 환경**: Vite API 미들웨어 서버 연계 (로컬 파일 시스템 쓰기 및 Node.js exec 실행)
* **주요 기술**: `/api/save-styles`를 통한 `config/styles.json` 쓰기, `/api/preview` 및 `/api/save-generate`를 통한 백엔드 가이드북 컴파일, `/api/select-folder`를 통한 로컬 폴더 선택 탐색기 연동
* **안전 규격**: styles.json 세이브 시 키 규격을 사전 검증하는 **API 스키마 검증기**, 마크다운 컴파일 프리뷰 시 테마 색상 명도를 자동 판정하는 **가독성 Linter 배너** 탑재.
* **확장 기능**: 26종의 대화형 숏코드 드롭다운 스니펫 툴바와 HTML/Presentation/PPTX 멀티포맷 일괄 변환 파이프라인 탑재.
