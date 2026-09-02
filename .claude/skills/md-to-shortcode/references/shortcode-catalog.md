---
title: (md-to-shortcode) 숏코드 카탈로그 — 자체 완결 백업
type: 참조
연결: "cs_v2 프로젝트 안에서 작업 중이면 docs/shortcode-reference.md가 authoritative — 이 파일과 어긋나면 그쪽을 따르고, 가능하면 이 파일도 같이 갱신한다(README.md '동기화 절차' 참고). cs_v2 밖에서 이 스킬을 쓰거나 그 문서를 못 찾을 때만 이 파일 하나로 완결되게 작성됨."
기준일: 2026-09-01 (cs_v2 28종 정식 + 14종 alias)
---

# 기본 문법

```markdown
::: 숏코드명 [인수...]
- field1: "값"
  field2: "값"
- field1: "다음 항목"
:::
```

- 각 항목(`-`)은 YAML 리스트 형태.
- 문자열 값은 큰따옴표로 감싼다. 콜론(`:`)이 값에 포함되면 필수.
- `desc`/`note`/`meta`는 `\n`(또는 YAML `|` 블록)으로 멀티라인 가능. `meta`는 `|`로 여러 항목 구분.
- 표준 키(대부분의 숏코드가 공유): `icon`, `title`, `desc`, `tag`, `meta`, `note`, `color`, `bullet`, `featured`.
- 공통 선택 인수: `title-size=0.95`(비율) / `title-size=1.2rem`(절대값), `desc-size=` 동일 방식.

# 그룹별 카탈로그 (28종 정식)

## A. 콘텐츠 그리드
| 숏코드 | 용도 | 핵심 필드 |
|---|---|---|
| `plan-grid` | 요금제/플랜 비교 | `title`,`tag`,`meta`(\|구분),`note`,`featured`,`color` |
| `feature-grid` | 핵심 강점/기술 소개 | `icon`,`tag`,`title`,`desc`,`color` |
| `icon-grid` | 범용 이모지 카드 (`align=center\|left\|row`) | `icon`,`title`,`desc`,`color` |
| `badge-grid` | 기술 스택/태그 나열 | `icon`,`title`,`tag` |
| `stat-grid` | 수치 지표 강조 | `icon`(수치),`title`(라벨),`desc`,`color` |
| `columns-grid` | 다단 텍스트 카드 | `title`,`desc`,`note` |
| `level-grid` | 레벨/난이도 스펙트럼 | `title`,`desc`,`tag`(highlight 시 강조) |
| `tool-list` | 도구/앱 상세 소개 | `icon`,`title`,`desc`,`tag`,`meta`(\|구분),`color` |

## B. 비교 & 대조
| 숏코드 | 용도 | 핵심 필드 |
|---|---|---|
| `compare-split` | 좌우 2단 비교 | `title`,`desc`/`meta`,`tag`,`color` |
| `before-after` | Before/After 전후 대조 (alias: `compare-diff`) | `title`,`desc`,`tag`,`color` |

## C. 코드 & 터미널
| 숏코드 | 용도 |
|---|---|
| `editor-box` | 코드 에디터 형태 (`desc: \| \`\`\`lang ... \`\`\``) |
| `console-box` | 터미널 콘솔 출력 |
| `cmd-box` | Windows CMD 실행 |

## D. 시각 자료 & 흐름
| 숏코드 | 용도 | 핵심 필드 |
|---|---|---|
| `step-flow` | 가로 프로세스 흐름 (alias: `workflow-flow`) | `icon`,`title`,`desc`,`tag`; 화살표는 `type: "arrow"` 항목 |
| `git-flow` | Git 브랜치 흐름 | `title`,`tag`,`meta`,`color` |
| `network-box` | 중심-주변 네트워크/허브-스포크 다이어그램 | 첫 항목=중심(`title`,`color`), 나머지=주변 노드(`title`,`meta`) |
| `venn-diagram` | 벤 다이어그램 — 교집합에서 가치 발생 (alias: `venn`) | 항목 3개 고정: [0]왼쪽 원, [1]오른쪽 원, [2](선택)교집합(`icon`,`desc`) |
| `quadrant-chart` | 두 축(X/Y) 기준 상대 위치 비교 | 블록 인수 `xLabel="..." yLabel="..."`; 항목 `title`,`fx`,`fy`(0~1),`color` |
| `concentric-rings` | A⊃B⊃C 계층적 포함관계 | 항목을 바깥→안쪽 순서로, `title`,`color`; 마지막 항목의 `icon`이 중심 아이콘 |

## E. 정보 & 알림
| 숏코드 | 용도 |
|---|---|
| `alert-box` | 경고/팁/주의 (`tip`/`warn`/`success`/`danger`) |
| `summary-box` | 핵심 요약 (`meta`로 칩 나열) |
| `takeaway-banner` | 핵심 메시지 배너 |
| `part-banner` | Part/챕터 구분 배너 |
| `summary-bar` | 하단 수치 하이라이트 바 |

## F. 구조 & 내비게이션
| 숏코드 | 용도 |
|---|---|
| `step-list` | 수직형 순서 단계 목록 |
| `chapter-list` | 챕터 목록 (`tag`: 개념/도구/사례/가이드/실습/주의/핵심) |
| `faq-list` | FAQ 아코디언 |
| `os-tabs` | OS/플랫폼 탭 전환 |

# 하위 호환 alias (14종 — 신규 문서에는 쓰지 않는다)

| alias | 정식 명칭 |
|---|---|
| `compare-grid` | `columns-grid` |
| `workflow-flow`, `workflow-strip`, `flow` | `step-flow` |
| `skill-list` | `icon-grid align=left` |
| `checkpoint-grid` | `icon-grid align=row` |
| `compare-diff`, `compare-before-after` | `before-after` |
| `bottom-list` | `summary-box` |
| `git-flow-strip` | `git-flow` |
| `part-deck` | `part-banner` |
| `takeaway` | `takeaway-banner` |
| `tool-box` | `tool-list` |
| `venn` | `venn-diagram` |

# 특수 토큰

- `type: "arrow"` — `step-flow` 내부에서만 쓰는 방향 화살표 항목.
- `::: slide-config` — 화면에 렌더링되지 않는 설정 전용 블록. 키: `bg`(배경색 hex), `color`(글자색 hex), `titleSize`/`bodySize`(pt), `notes`(발표스크립트 — PPTX `addNotes()`로만 반영, HTML 무관, 한 줄 문자열+`\n` 리터럴로 여러 줄 표현).
- Mermaid 구조도 — 숏코드 아님, 표준 ` ```mermaid ` fenced code block. 가이드·프레젠테이션 HTML은 mermaid.js로 실제 렌더링되지만, **PPTX는 전용 렌더러가 없어 원문이 코드박스로 표시된다**(다이어그램 이미지로 변환 안 됨).

# PPTX 지원 현황

2026-09-01 기준 **28종 정식 + 14종 alias 전체가 PPTX 렌더러를 갖추고 있다**(⚠️ 표시 대상 없음). Mermaid만 예외(위 참조).
