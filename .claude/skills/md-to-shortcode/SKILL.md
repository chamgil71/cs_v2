---
name: md-to-shortcode
description: >
  일반 텍스트/마크다운, 또는 slide-pipeline 스킬이 만든 "{제목}_슬라이드.md"(슬라이드별
  콘텐츠+디자인가이드+발표스크립트 산출물)를 Creative Spark V2(cs_v2) 숏코드 마크다운으로
  변환한다. 입력이 무엇이든 결과는 cs_v2의 `::: 숏코드명` 문법을 쓰는 md_src 파일이며,
  실제 HTML/PPTX 생성은 이 스킬이 하지 않고 cs_v2의 build-guide.mjs/build-presentation.mjs/
  md-to-pptx.mjs(코드)가 담당한다. "숏코드로 바꿔줘", "이 문서 cs_v2 형식으로 변환해줘",
  "슬라이드 지침을 숏코드 md로 만들어줘", "md_src에 넣을 파일 만들어줘" 같은 요청,
  또는 슬라이드파이프라인 산출물을 cs_v2에 넣어야 하는 상황에서 사용한다.
---

# md-to-shortcode

원본 텍스트를 Creative Spark V2(cs_v2)의 숏코드 마크다운(`::: 타입 ... :::`)으로 변환하는 스킬이다. **cs_v2 프로젝트(`C:\ai\cs_v2`) 전용**이며, 이 스킬이 만드는 것은 항상 `md_src/` 밑에 놓일 `.md` 파일까지다 — 그 파일을 HTML/PPTX로 굽는 것은 스킬이 아니라 cs_v2의 빌드 스크립트(코드)가 한다(마지막 "출력 후 안내" 참조).

## 입력은 두 갈래 — 먼저 어느 쪽인지 판별한다

| 입력 형태 | 판별 기준 | 처리 방법 |
|---|---|---|
| **A. 원문 텍스트/마크다운** | 강의안·보고서·초안 등 슬라이드 구조화가 안 된 일반 글 | 이 문서의 [원문 모드] 절차 |
| **B. slide-pipeline 산출물** (`{제목}_슬라이드.md`) | `## 슬라이드 N` 헤더, `### 슬라이드 제목:` / `### 디자인가이드:` / `### 발표스크립트:` 같은 slide-pipeline 고유 구조가 이미 있음 | 이 문서의 [슬라이드파이프라인 모드] 절차, 상세 매핑은 `references/slide-pipeline-input.md` |
| **C. slide-md / pptgen md 형식 v2** (2026-10-14~) | 머리말(`---`)이 있고 `## 제목 {master=…}` 제목 + `::: grid.cards` 처럼 **점(.) 이름 블록**을 씀 | **변환하지 않는다** — cs_v2 가 그대로 읽는다(기능 이름·제목 속성·`shape:`·`bg=alt`·색 이름 모두 공용 카탈로그 규칙, `config/library/README.md`). 바로 빌드 명령만 안내 |

**둘 중 뭘 먼저 만들지 애매하면**: 원문이 길고(강의안·보고서급) 슬라이드 수·발표스크립트·레이아웃을 신중히 설계해야 하는 문서라면, 먼저 `slide-pipeline` 스킬(Stage1+2)로 `{제목}_슬라이드.md`를 만들고 나서 이 스킬을 B모드로 돌리는 편이 결과물 품질이 좋다. 짧은 문서나 이미 구조가 명확한 글은 A모드로 바로 처리해도 충분하다. 확신이 없으면 사용자에게 물어본다.

---

## [원문 모드] A — 텍스트/마크다운 직접 변환

### 1단계: 입력 파악
- **파일 경로**로 보이면 Read 툴로 읽는다. 없으면 오류 출력 후 중단.
- **텍스트 직접 입력**이면 그대로 사용.
- **비어있으면** 직전 대화의 텍스트/MD 블록을 사용.

### 2단계: 숏코드 카탈로그 숙지
`references/shortcode-catalog.md`를 읽는다(28종 정식 + 14종 alias, 필드·문법·PPTX 지원 여부 전부 포함). 2026-10-14부터 새로 쓰는 블록은 **기능 이름**(`::: grid.cards`, `::: compare.pair` — 대응표 `docs/shortcode-reference.md` 맨 앞 '기능 이름')을 권장한다(고유 이름도 동작). **cs_v2 프로젝트 안에서 작업 중이면 `docs/shortcode-reference.md`가 더 최신일 수 있으니 그쪽을 우선 신뢰**하고, 이 카탈로그는 cs_v2 밖에서 쓰거나 그 문서를 못 찾을 때의 자체 완결 백업으로 취급한다.

### 3단계: 구조 분석 및 그룹 판단
콘텐츠를 문장 단위가 아니라 **"모양"** 단위로 먼저 분류한다(slide-pipeline과 동일한 사고방식 — 22개를 한 번에 다 보지 말고 그룹부터 좁힌다):

| 그룹 | 판단 기준 | 우선 후보 숏코드 |
|---|---|---|
| 비교·나열형 | 대상 2~4개를 대등하게 비교, 순서 없음 | `compare-split`, `before-after`, `columns-grid`, `plan-grid` |
| 순서·흐름형 | 시간순·단계순 진행 | `step-flow`, `step-list`, `git-flow` |
| 구조·관계형 | 중심-주변, 포함관계, 겹침 | `network-box`(허브-스포크), `concentric-rings`(포함관계), `venn-diagram`(교집합) |
| 데이터·수치형 | 숫자·위치가 핵심 | `stat-grid`, `summary-bar`, `quadrant-chart`(2축 위치 비교) |
| 카드·나열형 | 특징/도구/기술스택 나열, 관계 없음 | `icon-grid`, `feature-grid`, `badge-grid`, `tool-list` |
| 코드·터미널 | 코드/명령/출력 예시 | `editor-box`, `console-box`, `cmd-box` |
| 정보·알림 | 경고/팁/요약/핵심 메시지 | `alert-box`, `summary-box`, `takeaway-banner` |
| 절차·목록형 | FAQ, 챕터, OS별 안내, 레벨 | `faq-list`, `chapter-list`, `os-tabs`, `level-grid` |
| 절차도(정확한 다이어그램 필요) | 순서도·상태전이 등 도형으로 정확히 보여줘야 함 | Mermaid fenced code block(숏코드 아님, `references/shortcode-catalog.md`의 "Mermaid" 절 참고) |
| 해당 없음 | 위 어디에도 안 맞는 4줄 이상 산문 | 변환하지 않고 원문 유지 |

그룹을 정했으면 그 안에서만 세부 숏코드를 고른다. 정확히 맞는 게 없으면 가장 가까운 걸 쓰고, 왜 완벽히 맞지 않는지 최종 보고에 남긴다(새 숏코드가 필요하다고 판단되면 스킬을 확장하는 대신 cs_v2 쪽에 숏코드 추가를 제안 — `docs/shortcode-changelog.md` Phase 6 참고 사례).

### 4단계: 변환 규칙
- **frontmatter 보존**: 기존 `title`/`subtitle`/`style` 등은 유지, 없으면 추론해서 생성(`style`은 색상 테마 — 기술/개발→`terracotta`, 비즈니스/금융→`amber`, 지식/교육→`indigo`, 창의/디자인→`orchid`, 범용 챗봇형→`emerald`. 문서를 그룹으로 묶고 싶으면 `style`과 별개로 `category` 필드를 추가).
- **원본 문장 보존**: 숏코드 필드 값은 원문을 축약/요약하되 의미는 유지. 새 사실을 지어내지 않는다.
- **헤딩 보존**: `#`/`##` 섹션 제목은 그대로 둔다 — 숏코드로 대체하지 않는다.
- **긴 산문은 그대로**: 4줄 이상 연속 단락은 숏코드로 강제 변환하지 않는다.
- **`<!-- slide -->` 구분자**: 원본에 있으면 유지. 새로 만들 필요는 없다(횡슬라이드 분할은 `##` 헤딩이 이미 담당).
- **표(table)**: 2열이면 `compare-split`, 3열 이상이고 항목이 대등하면 `columns-grid`로 변환 가능 여부를 검토.
- **alias 사용 금지**: 신규 문서는 정식 명칭만 쓴다(`compare-diff`❌→`before-after`✅, `workflow-flow`❌→`step-flow`✅ 등 — 전체 목록은 `references/shortcode-catalog.md`).
- **폰트 크기 인수**: 카드 많거나 제목 길면 `title-size=0.95 desc-size=0.85`(비율) 또는 `title-size=1.2rem`(절대값) 추가.
- **YAML 값에 콜론(`:`) 포함 시** 반드시 큰따옴표로 감싼다.

---

## [슬라이드파이프라인 모드] B — `{제목}_슬라이드.md` 변환

slide-pipeline이 만든 파일은 이미 슬라이드 단위로 콘텐츠·레이아웃·발표스크립트가 확정되어 있다. 이 모드는 **그 결정을 다시 판단하지 않고 기계적으로 옮긴다** — 슬라이드 수를 바꾸거나 콘텐츠를 재작성하지 않는다.

1. 파일을 읽고 `## 슬라이드 N` 블록 단위로 분리한다.
2. 각 블록에서 아래 필드를 추출한다(정확한 필드명·매핑 규칙·데이터템플릿 22종 → cs_v2 숏코드 대응표는 `references/slide-pipeline-input.md` 필수 참조):
   - `### 슬라이드 제목` / `부제` → cs_v2 `##` 헤딩 + 부제 텍스트
   - `주요내용`/`슬라이드구성` → 해당 숏코드의 필드 값 원료
   - `디자인가이드 → 데이터템플릿` → `references/slide-pipeline-input.md`의 매핑표로 cs_v2 숏코드 ID 확정
   - `발표스크립트` → cs_v2 `::: slide-config` 블록의 `notes:` 키(PPTX 발표자 노트로 반영됨, HTML에는 영향 없음). 여러 줄이면 `\n` 리터럴로 이어붙인다(YAML `|` 블록 스칼라는 지원 안 됨).
   - `Mermaid 구조도(해당 시)` → 그대로 ` ```mermaid ` fenced code block으로 옮긴다(숏코드로 변환하지 않음).
   - `색상`(color.primary 등 slide-pipeline 토큰) → **버린다**. cs_v2는 `style:` frontmatter + `config/styles.json` 프리셋으로 색을 관리하므로, slide-pipeline의 design.md 색상 토큰을 1:1로 가져오지 않는다. 대신 원문 톤에 맞는 `style` 프리셋 하나를 골라 문서 최상단에 지정한다.
   - `AI 프롬프트(이미지 생성용)` → cs_v2에는 대응 숏코드가 없다. 프롬프트 텍스트를 주석(`<!-- 이미지 프롬프트: ... -->`)으로 남기거나 최종 보고에서 "이미지 슬라이드 N개는 자리표시자 없이 생략됨"으로 명시한다.
3. 병합·최종 파일 조립은 A모드의 4단계 규칙(frontmatter, alias 금지 등)을 동일하게 따른다.
4. 슬라이드 순서·개수는 절대 바꾸지 않는다 — slide-pipeline Stage1에서 이미 사용자 확인을 거친 값이다.

---

## 출력

- **파일 경로 입력이었으면**: `<원본명>_sc.md`로 저장(예: `md_src/guides/MyGuide.md` → `md_src/guides/MyGuide_sc.md`). slide-pipeline 산출물(`{제목}_슬라이드.md`)이 입력이면 `{제목}_sc.md`로 저장.
- **텍스트 직접 입력이었으면**: 채팅창에 마크다운 코드블록으로 출력.

저장 후 다음을 보고한다:
1. 적용된 숏코드 종류·개수 (예: `icon-grid 3개, step-flow 2개, venn-diagram 1개`)
2. 변환하지 않고 원문 유지한 항목과 이유
3. (B모드) 색상/이미지프롬프트 등 버려진 slide-pipeline 필드 목록
4. 추천 빌드 명령 — **이 스킬은 여기까지만 하고, 아래는 사용자가 코드로 직접 실행**:
   ```bash
   node scripts/build-guide.mjs <출력파일> --out publish/guides/<이름>.html
   node scripts/build-presentation.mjs <출력파일> --out publish/guides/<이름>_presentation.html
   node scripts/md-to-pptx.mjs <출력파일> --out publish/guides/<이름>.pptx
   ```
