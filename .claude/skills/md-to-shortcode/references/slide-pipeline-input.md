---
title: (md-to-shortcode) slide-pipeline 입력 처리 — 필드 매핑 및 데이터템플릿 대응표
type: 참조 (모드 B 전용)
연결: "slide-pipeline 스킬(C:\coding\_templates\myskill\slide-pipeline)의 stage3-assembly.md Part B가 만드는 {제목}_슬라이드.md 형식을 전제로 한다. 그 형식이 바뀌면 이 파일도 같이 갱신할 것(README.md 동기화 절차 참고)."
---

# slide-pipeline 산출물 구조 (입력 전제)

```
## 슬라이드 [번호]
### 슬라이드 제목:
- 슬라이드 부제:
- 핵심키워드:
- 주요내용:
- 슬라이드구성:
  - [메인 타이틀]:
  - [서브 타이틀]:
  - [메인]:

### 디자인가이드:
- 레이아웃 타입:
- 데이터템플릿:
- company_pattern:
- gen_mode:
- 구조:
- 시각적 중심 요소:
- 색상:
- AI 프롬프트(이미지 생성용, 해당 시): ...
- Mermaid 구조도(해당 시): ```mermaid ... ```

### 발표스크립트:
> "..."

### 출처(해당 시): ...
```

# 필드 → cs_v2 매핑

| slide-pipeline 필드 | cs_v2 대응 | 비고 |
|---|---|---|
| `슬라이드 제목` | `##` 헤딩 | 그대로 옮김 |
| `슬라이드 부제` | 헤딩 아래 평문 한 줄 | 숏코드로 감싸지 않음 |
| `핵심키워드` | (변환 안 함, 참고용) | 숏코드 선택 시 그룹 판단 힌트로만 사용 |
| `주요내용`/`슬라이드구성` | 아래 "데이터템플릿 대응표"로 고른 숏코드의 필드 값 원료 | 문장을 축약해 title/desc/meta로 분배 |
| `발표스크립트` | `::: slide-config` 의 `notes:` | 여러 줄이면 `\n` 리터럴로 이어붙임 |
| `색상`(color.primary 등) | **버림** | cs_v2는 `style:` frontmatter로 색을 관리. 원문 톤에 맞는 프리셋 하나를 대신 고름 |
| `company_pattern`/`gen_mode` | **버림** | cs_v2엔 대응 개념 없음(회사 템플릿 복제·template-slot 미지원) |
| `AI 프롬프트(이미지 생성용)` | **버림 + 보고** | cs_v2에 이미지 생성/자리표시자 숏코드 없음. 최종 보고에 "이미지 슬라이드 N개 생략" 명시 |
| `Mermaid 구조도` | 그대로 ` ```mermaid ` 블록 | 숏코드 변환 안 함 |
| `출처` | `note` 필드 또는 하단 각주 텍스트 | 해당 숏코드의 `note`에 붙이거나 평문으로 |

# 데이터템플릿(22종) → cs_v2 숏코드 대응표

slide-pipeline `references/layouts/data-templates.md`의 22패턴 기준. **직접 대응**은 그대로 쓰고, **근사 대응**은 표현력이 100% 같지 않다는 걸 최종 보고에 남긴다. **미대응**은 가장 가까운 카드형으로 낮추고, 반복적으로 필요하면 cs_v2에 새 숏코드 추가를 제안한다(2026-09 `structure.venn`·`data.quadrant`·`structure.rings` 추가가 이 절차의 실제 사례).

| slide-pipeline 패턴 | cs_v2 대응 | 대응 수준 |
|---|---|---|
| `compare.pair` | `compare.pair` | 직접 |
| `compare.main-sub` | `compare.pair` | 근사 (비율 강조 불가) |
| `compare.balance` | `compare.pair` | 근사 (저울 시각 없음) |
| `compare.hbars` | `grid.list` 또는 `grid.columns` | 근사 |
| `process.track` | `process.track connector=none` | 직접 |
| `process.growth` | `data.stats`(2항목) | 근사 |
| `process.cycle-3` | `process.track connector=none`(순환을 선형으로) | 근사 (순환 화살표 없음) |
| `process.zigzag` | `process.track connector=none` | 근사 (지그재그 시각 없음) |
| `staircase` | `process.levels` | 근사 (계단 시각 없음, 단계 의미는 보존) |
| `structure.hub` | `structure.hub` | 직접 |
| `structure.pillars` | `grid.list` 또는 `grid.columns` | 근사 |
| `structure.rings` | `structure.rings` | 직접 |
| `venn` | `structure.venn` | 직접 |
| `data.stats` | `data.stats` | 직접 |
| `data.bars` | `data.stats` | 근사 (막대 길이 비교 없음, 수치만) |
| `data.quadrant` | `data.quadrant` | 직접 |
| `data.gauge` | `process.levels` 또는 `data.stats` | 근사 (스펙트럼 위치 표현 안 됨) |
| `media.cards-image` | `grid.columns` + 마크다운 이미지 | 근사 (이미지는 `![](경로)`로 별도 삽입) |
| `media.banner` | `grid.columns`(상단) + 마크다운 이미지(하단) | 근사 |
| `placeholder` | (변환 안 함) | 미대응 — 이미지 자리표시자 개념 자체가 cs_v2에 없음 |
| `text.icon-statement` | `grid.cards`(단일 항목) | 직접 |
| `text.statement` | 순수 마크다운 문단 | 직접(숏코드 강제 변환 안 함, 원문 모드 규칙과 동일) |

# 사용 순서

1. `{제목}_슬라이드.md`를 슬라이드 블록 단위로 분리.
2. 각 블록의 `데이터템플릿` 값을 위 표에서 찾아 cs_v2 숏코드 ID를 확정.
3. `주요내용`/`슬라이드구성`을 그 숏코드가 요구하는 필드(`shortcode-catalog.md` 참조)로 분배.
4. `발표스크립트` → `notes:`, `Mermaid 구조도` → 코드펜스 그대로.
5. 색상/company_pattern/AI 프롬프트는 버리고, 문서 최상단 `style:` 프리셋 하나로 대체.
6. 슬라이드 순서·개수는 절대 바꾸지 않는다.
