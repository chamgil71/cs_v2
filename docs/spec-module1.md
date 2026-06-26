# 모듈1 (PPTX 디자인 인스펙터 & 리매퍼) — 사양서

> 버전: 2026-06-25 기준
> 대상: 개발자, 기여자
> 성격: 모듈1의 동작·구조·변환 계약 규정. 모듈2 사양은 `docs/spec.md` 참조.
> 관련: 보완·완성 계획 `docs/plan/module1-completion-plan.md`

---

## 1. 개요

업로드한 **PPTX의 XML을 해체해 디자인(색상·폰트·도형·위치)을 분석**하고, 기준(baseline)에 맞춰 **1:1 리매핑하여 새 PPTX를 생성**하는 **서버리스(브라우저 단독)** 도구.

- 진입점: `src/standalone/module1-main.tsx` → `src/components/PptxInspectorSuite.tsx` (단일 컴포넌트)
- 변환 코어: `scripts/pptx-analyzer.js` (순수 함수 lib, JSZip 기반)
- 통합 대시보드: `src/main.tsx`의 탭에서도 동일 컴포넌트 사용
- 외부 서버 API 없음. 모든 처리는 브라우저 내 JSZip + DOMParser.

---

## 2. 워크플로

```
PPTX 업로드 ─► JSZip 해체 ─► XML 분석(색상/폰트/도형/위치)
                                   │
                  ┌────────────────┴───────────────┐
                  ▼                                ▼
        Module A: 기준(baseline) 설정      Module B: Target 변환 매핑
        (색상/위치/폰트 + 프리셋 + 로고)    (from→to 색·폰트·도형·위치)
                  └────────────────┬───────────────┘
                                   ▼
               XML 정규식 치환 (apply* 함수) + well-formed 검증
                                   ▼
               JSZip 재패키징 ─► 새 PPTX 다운로드 (_변환_v2.pptx)
```

추가 모드: **초경량 리매퍼**(`handleRunRemap`) — 색상만 빠르게 일괄 치환.

---

## 3. UI 구조

- **상단 탭**: `baseline`(Module A) · `convert`(Module B) · `remapper`(리매퍼)
- **Module A 서브탭**: `color` · `layout` · `font` (+ 로고 등록)
- **Module B 서브탭**: `clr`(색상) · `fnt`(폰트) · `lyt`(위치) · `shp`(도형)

---

## 4. 변환 계약 (`scripts/pptx-analyzer.js`)

### 4.1 유틸 (테스트 완료)
| 함수 | 역할 |
|------|------|
| `vld(hex)` | 6자리 HEX 검증 |
| `eh(s)` | XML 엔티티 이스케이프 |
| `e2p(emu)` | EMU→pt (12700 EMU = 1pt) |
| `autoTo` / `palNm` | 색상 자동 매핑 / 팔레트 이름 |
| `KNOWN` / `KEEP` | 매핑 사전 / 보존 색상 |

### 4.2 치환 함수 (apply*)
| 함수 | 입력 | 동작 | 상태 |
|------|------|------|:--:|
| `applyFontRunProps(txt, maps)` | typeface별 sizeScale·boldMode | `rPr/defRPr/endParaRPr`의 `sz` 배율·`b` 토글 | ✅ |
| `applyShapeOps(txt, ops)` | removeShadow/Glow/flattenGradient/**removeOutline** | 효과 요소 제거, 그라데이션→단색, **윤곽선→noFill** | ✅ |
| `applyShapeFillLine(txt, cfg)` | fill/line 색·투명도·두께 | `spPr`의 solidFill·`a:ln` 조정 (자식 순서 보존) | ✅ |
| `applyShapePresets(txt, map, presets)` | shapeId→preset | `a:ln`/`a:effectLst` 교체 | ✅ |
| `applyLayoutToXml(txt, rules)` | placeholder별 좌표 규칙 | `a:off`/`a:ext` 좌표 치환 (단위 **pt** ×12700) | ✅ |
| `phToRule(type, idx)` | placeholder type/idx | → `title`/`chapter`/`body`/`pageNum` 규칙 | ✅ (logo 미매핑) |

### 4.3 좌표 단위
레이아웃 규칙 x/y/w/h는 **point** 단위. 슬라이드 기본 720pt(=10인치, 9,144,000 EMU). EMU = pt × 12700.

### 4.4 무결성 검증
- 변경된 XML마다 `validateXmlStructure()`(DOMParser)로 **well-formed(구문)** 검사. 실패 시 변환 중단.
- ⚠️ **한계**: well-formed만 검사하며 **OOXML 스키마(요소 순서·필수 속성·관계 정합성)는 미검증.** 스키마 위반 시 PowerPoint "복구" 경고 가능 → `module1-completion-plan.md` G3 참조.

---

## 5. 검증 (테스트 · 하네스)

| 항목 | 위치 | 내용 |
|------|------|------|
| lib 유틸 | `src/__tests__/pptx-analyzer.test.ts` | vld/eh/e2p/autoTo/palNm/KNOWN/KEEP (23건) |
| 변환 함수 | `src/__tests__/pptx-transform.test.ts` | apply* 엣지(효과·채움/선·레이아웃·폰트·그룹도형·outline·spPr순서) (10건) |
| 라운드트립 하네스 | `scripts/verify-pptx-roundtrip.mjs` (`npm run verify:pptx`) | md-to-pptx 샘플 → apply* 적용 → well-formed + 재패키징 검증 |

**1차 검증 결론**: 테스트 범위 내 변환 엔진은 well-formed·스키마 순서·그룹도형 경계 안전. 실제 PowerPoint "경고 파일"은 재현 입력(샘플 PPTX) 미확보로 미재현.

---

## 6. 알려진 미구현·한계 (요약, 상세는 completion-plan)

| 항목 | 상태 |
|------|------|
| 도형 테두리(Outline) 제거 | **구현 완료** (2026-06-25) |
| **로고(일반/배경) PPTX 삽입** | **미구현** — 업로드·미리보기·위치규칙만 있고 생성 단계 삽입 없음. media+rels+`<p:pic>`+Content_Types 필요, PPTX 검증 후 구현 권장 |
| 변환 함수 테스트 | 부분 완료(엣지 10건). 실파일 회귀 미포함 |
| OOXML 스키마 검증 | well-formed만. 순서/필수속성/관계 미검증 |
| 컴포넌트 통합 테스트 | 없음 (변환 lib만 테스트) |

---

## 7. 파일 레퍼런스

| 영역 | 경로 |
|------|------|
| 메인 컴포넌트 | `src/components/PptxInspectorSuite.tsx` |
| 변환 lib | `scripts/pptx-analyzer.js` |
| 스펙 파서 | `scripts/spec-parser.js` |
| standalone 진입점 | `src/standalone/module1-main.tsx` |
| 테스트 | `src/__tests__/pptx-analyzer.test.ts`, `pptx-transform.test.ts` |
| 검증 하네스 | `scripts/verify-pptx-roundtrip.mjs` |
| 보완 계획 | `docs/plan/module1-completion-plan.md` |

> 모듈1 구조 변경 시 본 문서와 `module1-completion-plan.md`를 함께 갱신할 것 (CLAUDE.md 작업 규칙 §11-2).
