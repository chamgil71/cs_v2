# 모듈1 (PPTX 디자인 인스펙터) 보완·완성 계획안

> 작성일: 2026-06-25
> 대상: 개발자
> 성격: 모듈1의 현 구현 상태 진단 + 미완성/결함 항목 + 단계별 보완 계획
> 범위: `PptxInspectorSuite.tsx` (실사용) · `scripts/pptx-analyzer.js` (변환 lib)

---

## 0. 요약

모듈1은 **PPTX 분석 → 조정(색상/폰트/도형/위치) → 새 PPTX 생성** 워크플로의 도구다. 핵심 변환 로직은 **스텁이 아니라 실제 구현**되어 있으나, ① 테스트가 거의 없고 ② 정규식 기반 XML 조작이라 일부 PPTX에서 **PowerPoint 복구 경고(손상 파일)**를 유발할 수 있으며 ③ 죽은 중복 파일이 존재한다.

---

## 1. 현 구현 상태 (워크플로 단계별)

### 1.1 분석(Analysis) 단계
- `processTargetFile()` / 기준설정 분석: 업로드 PPTX를 JSZip으로 해체 → 색상·폰트·도형·위치(placeholder) 추출.
- lib: `scripts/pptx-analyzer.js`의 `vld`(HEX 검증), `eh`(이스케이프), `e2p`(EMU→pt), `autoTo`/`palNm`(색상 매핑), `KNOWN`/`KEEP` 상수 — **23개 단위 테스트 통과**.

### 1.2 조정(Adjust) 단계 — 4개 카테고리 모두 백엔드 로직 존재
| 카테고리 | 핸들러/함수 | 구현 | 테스트 |
|---------|------------|:---:|:---:|
| 색상 | 전역 `srgbClr/lastClr` 치환 (handleExecuteTargetConversion §5) | ✅ | ❌ |
| 폰트 | `typeface` 치환 + `applyFontRunProps`(크기 배율·볼드) | ✅ | ❌ |
| 도형 | `applyShapeOps`(그림자/글로우/그라데이션) + `applyShapeFillLine`(채움·선) + `applyShapePresets` | ✅ | ❌ |
| 위치 | `applyLayoutToXml` + `phToRule`(placeholder→규칙 매핑) | ✅ | ❌ |

### 1.3 생성(Generate) 단계
- 변경 XML마다 `validateXmlStructure()`로 검사 후 `zip.file(...DEFLATE)` → `zip.generateAsync(blob)` → 다운로드.
- 변환 요약(`convSummary`)에 카테고리별 치환 카운트 집계.

---

## 2. 미완성·결함 항목 (보완 대상)

### G1. 죽은 중복 파일 `PptxAnalyzer.tsx` (2394줄) ★정리
- 어디서도 import되지 않음(완전 고아). `PptxInspectorSuite.tsx`가 후속본.
- 모듈2의 "렌더러 4벌 중복"과 동일한 드리프트 패턴. **제거 대상.**

### G2. 변환 로직 테스트 0건 ★검증 공백
- `applyFontRunProps`/`applyShapeOps`/`applyShapeFillLine`/`applyShapePresets`/`applyLayoutToXml` 등 **2772줄 컴포넌트 + lib 변환 함수 전체가 단위 테스트 없음**.
- lib 유틸(vld 등)만 테스트됨. 정작 PPTX를 변형하는 핵심 함수가 미검증.

### G3. "PPTX 생성 시 경고/오류 파일" ★핵심 버그
- **원인 1 (검증 한계)**: `validateXmlStructure()`는 DOMParser로 **well-formed(구문)만** 검사. OOXML **스키마 유효성(요소 순서·필수 속성·네임스페이스)은 미검증** → 정규식 편집이 구문상 정상이나 스키마 위반인 XML을 생성하면 통과되고, PowerPoint가 "복구가 필요합니다" 경고를 띄움.
- **원인 2 (정규식 취약성)**: `<p:sp>([\s\S]*?)</p:sp>` 류 비탐욕 매칭은 **그룹 도형(`<p:grpSp>`)·중첩 sp**에서 경계를 잘못 잡을 수 있음. 또 `applyShapeFillLine`의 spPr 분해, `solidFill` 단일 치환 가정 등 엣지 케이스에서 구조 훼손 가능.
- **원인 3 (재패키징)**: `generateAsync`가 모든 항목 DEFLATE. 일반적으로 OOXML은 문제없으나, 원본의 특정 part 누락/재정렬 여부 미점검.

### G4. 조정 세부 옵션의 UI↔로직 정합성 — **전수 점검 완료 (2026-06-25)**
UI 컨트롤 ↔ 백엔드 로직을 대조한 결과:

| 옵션 | UI | 로직 | 상태 |
|------|:--:|:--:|------|
| 색상 치환 | ✅ | ✅ | 구현 |
| 폰트 typeface/크기/볼드 | ✅ | ✅ | 구현 |
| 도형 효과 제거(그림자/글로우/그라데이션) | ✅ | ✅ | 구현 |
| **도형 테두리(Outline) 제거** | ✅ | ❌→**✅** | **미구현이었음 → 본 작업서 구현·테스트 완료** |
| 채움·선 색/투명도/두께 | ✅ | ✅ | 구현 (cfg 키 전부 소비) |
| placeholder 위치(title/chapter/body/pageNum) | ✅ | ✅ | 구현 |
| 도형 프리셋 생성·할당·적용 | ✅ | ✅ | 구현 |
| **로고(일반/배경) 삽입** | ✅(업로드·미리보기·위치규칙) | ❌ | **미구현 ★** — `handleExecuteTargetConversion`에 PPTX 삽입 코드 없음. `phToRule`도 logo 미매핑 → 업로드 로고가 출력에 안 들어감 |

- **removeOutline**: `applyShapeOps`에 `<a:ln>→<a:noFill/>` 치환 추가(테마 상속 윤곽선까지 무력화, a:lnRef/표테두리 제외, 멱등). 테스트 2건 추가.
- **로고 삽입(미해결)**: media 추가 + slide rels + `<p:pic>` 삽입 + `[Content_Types].xml` 갱신 필요. **PPTX 검증 없이 구현 시 "경고 파일" 유발 위험 큼 → 샘플 PPTX 확보 후 구현** 권장. (사용자가 언급한 "새 pptx 생성단계 미구현"의 정체로 추정)

---

## 3. 보완 계획 (단계별)

### Phase A — 정리 (저위험, 즉시)
- [ ] **G1**: 죽은 `PptxAnalyzer.tsx` 제거. 빌드/standalone 정상 확인.
- [ ] 모듈1 사양 문서 `docs/spec-module1.md` 신설(모듈2 `spec.md`와 대칭).

### Phase B — 검증 하네스 & 테스트 (G2·G4 특정)
- [ ] `scripts/pptx-analyzer.js`의 변환 함수를 대상으로 **단위 테스트** 작성: 대표 OOXML 조각 입력 → 기대 출력/카운트 검증.
- [ ] **왕복(round-trip) 테스트**: `md-to-pptx`로 샘플 PPTX 생성 → JSZip 해체 → 각 apply* 적용 → ① well-formed ② 재로드 가능 ③ 변경 카운트>0 검증. (실제 PowerPoint 손상 케이스를 CI에서 사전 검출)
- [ ] UI 옵션 ↔ 핸들러 매핑 표를 만들어 **백엔드 로직 없는 컨트롤(미구현)을 전수 식별**.

### Phase C — 생성 무결성 강화 (G3 수정)
- [ ] `validateXmlStructure`를 well-formed 검사 + **핵심 스키마 가드**(요소 순서·필수 속성 화이트리스트)로 보강, 또는 변환 후 **재파싱→재직렬화**로 정규화.
- [ ] 정규식 매칭을 그룹/중첩 도형 안전하게 보강(`<p:sp>`·`<p:grpSp>` 경계 처리). 가능하면 DOM 기반 조작으로 단계적 전환.
- [ ] 재패키징 시 원본 part 목록·`[Content_Types].xml`·관계(rels) 보존 점검.

### Phase D — 문서·정합성
- [ ] 변환 카테고리·옵션을 `spec-module1.md`에 규정.
- [ ] 모듈1도 정합성/회귀 테스트를 `npm test`에 포함.

---

## 4. 검증 하네스 설계 (Phase B 핵심)

```
md-to-pptx (샘플 생성)  →  fixture.pptx
        │
        ▼
JSZip 해체 → slideN.xml
        │  apply{FontRunProps,ShapeOps,ShapeFillLine,ShapePresets,LayoutToXml}
        ▼
검증: ① DOMParser well-formed  ② 카운트>0  ③ JSZip 재생성 후 재로드 OK
        │
        ▼ (실패 시)
손상 케이스 격리 → G3 수정 대상으로 등록
```

이 하네스가 "어떤 조정이 어떤 PPTX에서 손상을 내는지"를 **구체적으로 특정**한다. 사용자가 기억하는 미구현/오류 파일 케이스를 코드로 재현·고정한다.

---

## 4.1 하네스 가동 결과 (2026-06-25 1차)

`scripts/verify-pptx-roundtrip.mjs` (`npm run verify:pptx`) + `src/__tests__/pptx-transform.test.ts` 가동 결과:

| 검증 | 방법 | 결과 |
|------|------|------|
| 폰트 크기·볼드 | md-to-pptx 샘플 1812건 | ✅ well-formed |
| 채움·선 | 샘플 1272건 | ✅ well-formed |
| 전역 색상 치환 | 샘플 69건 | ✅ well-formed |
| 도형 효과 제거 | **수제 픽스처**(샘플엔 효과 없음) | ✅ well-formed + 제거 확인 |
| placeholder 좌표 | **수제 픽스처**(샘플엔 `<p:ph>` 없음) | ✅ well-formed + 좌표(pt×12700) 정확 |
| spPr 자식 순서 | DOM 직계자식 검사 | ✅ 순서 위반 없음 |
| **그룹도형/중첩 sp** | 수제 픽스처 | ✅ grpSp 경계 보존, 훼손 없음 |
| 전체 변환 후 재패키징·재로드 | 69 슬라이드 | ✅ 정상 |

**결론(1차):** 테스트한 범위에서 **변환 엔진은 well-formed + 스키마 순서 안전**. 정규식 기반이지만 그룹도형 경계도 보존됨. **G3 손상은 현 입력(생성 샘플 + 수제 픽스처)으로는 재현되지 않음.**

**남은 G3 리스크 (재현 입력 필요):**
- jsdom/직계순서 검사가 못 잡는 OOXML 영역: 필수 속성 누락, 관계(rels)·`[Content_Types].xml` 정합성, 네임스페이스.
- 실제 PowerPoint 템플릿(placeholder·테마·SmartArt·차트 포함)의 복잡 구조.
- 분석(읽기) 단계 또는 특정 UI 옵션의 미구현(§G4) — 하네스는 변환 함수만 검증.

→ **"경고 파일"을 정확히 고치려면 그 경고를 실제로 유발하는 샘플 PPTX 1개**가 필요. 확보 시 하네스에 픽스처로 추가해 재현·고정한다.

## 4.2 단위 테스트 커버리지 (G2 — 부분 해소)
`src/__tests__/pptx-transform.test.ts` 8케이스로 5개 변환 함수의 핵심·엣지 경로 검증 추가. (전체 156 테스트 통과)

## 5. 우선순위 권장

1. **Phase A** (정리·문서) — 즉시, 위험 없음
2. **Phase C-1** (생성 무결성: 재파싱 정규화) — "경고 파일" 직접 해결, 사용자 체감 큼
3. **Phase B** (테스트·하네스) — 재발 방지 + 미구현 옵션 특정
4. **Phase C-2/D** — 구조적 강화

> 참고: 정확한 "미구현 옵션"은 코드에 마커가 없어 단정 불가. §4 하네스 + UI↔로직 매핑표로 특정하거나, 사용자가 아는 케이스(예: "폰트 크기 조정이 특정 파일에서 안 먹음")를 지정하면 최단 경로로 처리 가능.
