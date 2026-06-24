# /md-to-shortcode — 마크다운/텍스트 → 숏코드 MD 변환

일반 마크다운 또는 텍스트 파일을 읽어, Creative Spark V2 숏코드 시스템으로 시각화된 MD 파일로 재작성합니다.

**사용법**: `/md-to-shortcode <파일경로>`  
예: `/md-to-shortcode md_src/guides/MyGuide.md`

---

## 에이전트 지시문

대상 파일: `$ARGUMENTS`

아래 순서대로 실행하십시오.

### 1단계: 숏코드 레퍼런스 숙지

`docs/shortcode-reference.md` 파일을 읽어 25종 정식 숏코드의 문법과 용도를 파악합니다.  
핵심 규칙:

```
::: 숏코드명 [인수]
- field: "값"
:::
```

**선택 기준 (콘텐츠 유형 → 숏코드 매핑)**:

| 콘텐츠 유형 | 적합한 숏코드 |
|------------|------------|
| 단계별 절차, 순서 목록 | `step-list` |
| 가로 흐름, 프로세스 단계 | `step-flow` |
| 특징/기능 나열 | `icon-grid`, `feature-grid` |
| 도구/앱 소개 | `tool-list` |
| 기술 스택, 태그 나열 | `badge-grid` |
| 수치/통계 강조 | `stat-grid` |
| 요금제/플랜 비교 | `plan-grid` |
| 좌우 대조 비교 | `compare-split` |
| Before/After 전후 대조 | `before-after` |
| 다단 텍스트 카드 | `columns-grid` |
| 코드 예시 | `editor-box`, `console-box`, `cmd-box` |
| 경고/팁/주의 | `alert-box` |
| 요약 정리 | `summary-box` |
| 핵심 메시지 강조 | `takeaway-banner` |
| Part/챕터 구분 | `part-banner` |
| 수치 하이라이트 바 | `summary-bar` |
| FAQ, 질답 | `faq-list` |
| OS/플랫폼 탭 | `os-tabs` |
| 챕터 목록 | `chapter-list` |
| 레벨/난이도 스펙트럼 | `level-grid` |
| 네트워크/레이어 구조 | `network-box` |
| Git 브랜치 흐름 | `git-flow` |

### 2단계: 원본 파일 분석

`$ARGUMENTS` 파일을 읽습니다.  
파일이 없으면 오류 메시지를 출력하고 중단합니다.

원본의 **구조와 의도**를 파악합니다:
- frontmatter(`---`) 유무 확인 → 없으면 적절한 frontmatter 생성
- 각 섹션(H2, H3)의 콘텐츠 유형 분류
- 단순 불릿 리스트 → 숏코드로 변환할 대상 식별
- 표(table) → `columns-grid` 또는 `compare-split`으로 변환 가능 여부 확인

### 3단계: 숏코드 변환 작성

다음 규칙을 준수하며 변환합니다:

- **frontmatter 보존**: 기존 `title`, `subtitle`, `style` 등은 그대로 유지. 없으면 추론해서 추가
- **원본 문장 보존**: 숏코드 필드 값은 원본 텍스트를 축약/요약하되 의미를 유지
- **H1/H2 헤딩 보존**: 섹션 제목(`#`, `##`)은 그대로 둠 — 숏코드로 대체하지 않음
- **긴 산문은 그대로**: 4줄 이상 연속 단락은 숏코드 강제 변환 비권장 → 원본 유지
- **slide 구분자 보존**: `<!-- slide -->` 구분자가 있으면 유지
- **폰트 크기 인수**: 필요 시 `title-size`, `desc-size` 인수 활용
  - 카드가 많거나 제목이 길 때: `title-size=0.95 desc-size=0.85`
  - 강조 블록: `title-size=1.2rem`

### 4단계: 출력 파일 저장

출력 경로: 원본 파일명에 `_sc` 접미사 추가  
예: `md_src/guides/MyGuide.md` → `md_src/guides/MyGuide_sc.md`

파일을 저장한 후 다음을 보고합니다:
- 변환된 숏코드 종류 및 개수 (예: "icon-grid 3개, step-list 2개, ...")
- 원본 섹션 중 숏코드로 변환하지 않은 항목과 이유
- 추천 빌드 명령어:
  ```
  node scripts/build-guide.mjs <출력파일> --out dist/<이름>.html
  ```

### 주의 사항

- alias(구형 명칭) 사용 금지: `compare-diff` 대신 `before-after`, `workflow-flow` 대신 `step-flow` 사용
- `title-size`/`desc-size` 인수: 숫자만 입력 시 배율, 단위 포함 시 절대값
- YAML 값에 콜론(`:`)이 포함되면 반드시 큰따옴표로 감쌀 것
