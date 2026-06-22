# 숏코드 시스템 리팩터링 계획

> 작성일: 2026-05-31 (md_src/ 실분석 기반 전면 개정)  
> 분석 범위: 네이밍 통일 / 필드 역할 재정립 / HTML↔PPTX 정합 / 디자인 파괴 여부 / MD 파일 영향도

---

## 전체 상태 요약

| 항목 | 상태 | 설명 |
|------|:----:|------|
| 숏코드 네이밍 통일 | ✅ 완료 | md_src/ 파일들이 현행 이름 사용 중 |
| 필드 역할 재정립 | ✅ 완료 | `plan-grid` 가격 배지 필드를 `note`로 통일 |
| HTML↔PPTX 클래스 일치 | 🔶 부분 해소 | 타입명↔CSS 클래스명 9건 불일치 (의도적 유지 결정) |
| HTML↔PPTX 구현 격차 | 🔶 부분 해소 | 10종 HTML 전용 숏코드 — PPTX 경고 로그 출력 후 제외 |
| 기존 디자인 파괴 여부 | ✅ 없음 | 컴파일된 HTML은 영향 없음. 재빌드 시만 적용 |
| MD 파일 개별 영향도 | ✅ 반영 | devtools.md(구문) + plan-grid 3개 파일(필드명) 수정 완료 |

**코드 변경 작업: Phase 1~3 완료, Phase 4는 선택 보류**

---

## 1. 숏코드 네이밍 Before → After 전체 비교

> 이전에 사용하던 이름(구 pipeline.md / 구 HTML 기준) → 현행 이름(현재 build-guide.mjs 기준)

| 이전 이름 | 현행 이름 | 변경 이유 | md_src 사용 수 | 상태 |
|-----------|----------|---------|:---:|:----:|
| `steps` | `step-list` | `-list` 접미사 일관성 | 23 | ✅ 전환 완료 |
| `compare-2col` | `compare-split` | 기능 설명적 이름 | 2 | ✅ 전환 완료 |
| `tool-card` | `tool-list` | `-box` 접미사 일관성 | 7 | ✅ 전환 완료 |
| `workflow` | `workflow-flow` | HTML 클래스명 정합 | 7 | ✅ 전환 완료 |
| `prompt-example` | `console-box` | 기능 설명적 이름 | 8 | ✅ 전환 완료 |
| `stat-highlight` | `stat-grid` | `-grid` 접미사 일관성 | 2 | ✅ 전환 완료 |
| `command-block` | `cmd-box` | `-box` 접미사 일관성 | 3 | ✅ 전환 완료 |
| `tabs` | `os-tabs` | 플랫폼 명시 | 2 | ✅ 전환 완료 |
| `faq-accordion` | `faq-list` | `-list` 접미사 일관성 | 2 | ✅ 전환 완료 |
| `columns` | `columns-grid` | `-grid` 접미사 일관성 | 3 | ✅ 전환 완료 |
| `badge-grid` | `badge-grid` | 변경 없음 | 2 | ✅ 유지 |
| `skill-list` | `skill-list` | 변경 없음 | 1 | ✅ 유지 |
| `summary-box` | `summary-box` | 변경 없음 | 1 | ✅ 유지 |
| `alert-box` | `alert-box` | 변경 없음 | 25 | ✅ 유지 |
| `icon-grid` | `icon-grid` | 변경 없음 | 36 | ✅ 유지 |
| `feature-grid` | `feature-grid` | 변경 없음 | 25 | ✅ 유지 |
| `compare-grid` | `compare-grid` | 변경 없음 | 19 | ✅ 유지 |
| `plan-grid` | `plan-grid` | 변경 없음 | 4 | ✅ 유지 |

**신규 추가된 숏코드** (이전 pipeline.md에 없던 것들):

| 이름 | md_src 사용 수 | PPTX 지원 |
|------|:---:|:---:|
| `step-flow` | 8 | ❌ |
| `part-banner` | 2 | ❌ |
| `chapter-list` | 2 | ❌ |
| `editor-box` | 3 | ✅ |
| `network-box` | 2 | ⚠️ 우회 |
| `git-flow` | 1 | ⚠️ 우회 |
| `level-grid` | 2 | ❌ |
| `checkpoint-grid` | 2 | ❌ |
| `compare-diff` | 2 | ❌ |
| `takeaway-banner` | 3 | ❌ |
| `summary-bar` | 2 | ❌ |

> PPTX alias는 양방향 지원: 구 이름(`compare-2col`, `steps` 등)도 여전히 PPTX에서 동작함.  
> HTML 렌더러는 현행 이름만 처리함.

---

## 2. 필드 역할 Before → After 전체 비교

### 2-1. 표준 6대 필드 역할 정의

| 필드 | Before (혼용 상태) | After (통일 규칙) | 비고 |
|------|-------------------|-------------------|------|
| `icon` | 이모지/아이콘 | 이모지/아이콘 | 변경 없음 |
| `title` | 카드 제목 | 카드 제목 | 변경 없음 |
| `desc` | 설명 OR 하단 배지 (숏코드마다 다름) | **항상 설명 문단** (`\n` 줄바꿈 지원) | plan-grid 정리 완료 |
| `tag` | 상단 배지/레이블 | 상단 배지/레이블 | 변경 없음 |
| `meta` | `\|` 구분 목록 | `\|` 구분 불릿 목록 | 변경 없음 |
| `note` | 하단 배지 (일부 숏코드만) | **하단 배지/요약 메모** | plan-grid에서 새로 사용 |
| `color` | 강조 색상 Hex | 강조 색상 Hex | 변경 없음 |
| `featured` | plan-grid 전용 | plan-grid 전용 | 변경 없음 |

### 2-2. 숏코드별 필드 역할 Before → After

| 숏코드 | 필드 | Before | After | 변경 필요 |
|--------|------|--------|-------|:--------:|
| `icon-grid` | desc | 설명 `<p>` | 설명 `<p>` | ✅ 없음 |
| `feature-grid` | desc | 설명 `<p>` | 설명 `<p>` | ✅ 없음 |
| `step-list` | desc | 설명 `<p>` | 설명 `<p>` | ✅ 없음 |
| `compare-grid` | desc / note | desc=설명, note=하단 메모 | desc=설명, note=하단 메모 | ✅ 없음 |
| `tool-list` | desc / meta | desc=부제목, meta=기능목록 | desc=부제목, meta=기능목록 | ✅ 없음 |
| `compare-split` | desc / note / meta | HTML: desc=단락, note=footer, meta=목록 / PPTX: 동일 | HTML: desc=단락, note=배지, meta=목록 / PPTX: 동일 | ✅ 없음 (이미 정합) |
| `columns-grid` | desc / note | desc=설명, note=하단 메모 | desc=설명, note=하단 메모 | ✅ 없음 |
| `faq-list` | desc | desc=답변 | desc=답변 | ✅ 없음 |
| `alert-box` | desc | desc=설명 | desc=설명 | ✅ 없음 |
| `console-box` | desc | desc=프롬프트 본문 | desc=프롬프트 본문 | ✅ 없음 |
| `cmd-box` | desc | desc=코드 본문 (예외적 사용) | desc=코드 본문 | ✅ 없음 |
| `editor-box` | desc | desc=코드 본문 | desc=코드 본문 | ✅ 없음 |
| `stat-grid` | icon | icon=수치값 (이모지 아님) | icon=수치값 | ✅ 없음 (의도적 예외) |
| **`plan-grid`** | **desc / note** | **HTML: desc=하단 배지 / PPTX: note=하단 배지** | **HTML+PPTX 모두: desc=미사용, note=하단 배지** | ✅ **수정 완료** |

---

## 3. HTML ↔ PPTX 타입명·클래스명 불일치 현황

### 3-1. 타입명과 HTML CSS 클래스명 불일치 (의도적 유지)

| 숏코드 타입명 | HTML 클래스명 | 불일치 이유 | 조치 |
|-------------|-------------|-----------|------|
| `compare-split` | `.compare-2col` | 구 이름이 클래스로 고착 | 유지 (변경 시 CSS 파급 큼) |
| `cmd-box` | `.cmd-block` | `-box` vs `-block` | 유지 |
| `console-box` | `.prompt-box` | 의미 다름 | 유지 |
| `editor-box` | `.editor-sim` | `-box` vs `-sim` | 유지 |
| `network-box` | `.graph-visual` | 의미 다름 | 유지 |
| `part-banner` | `.part` | 축약 | 유지 |
| `summary-box` | `.summary-box-card` | `-card` 과잉 | 유지 |
| `os-tabs` | `.tabs-wrap` | `os-` 불필요 | 유지 |
| `git-flow` | `.git-flow-container` | `-strip` vs `-container` | 유지 |

> CSS 클래스명 변경은 기존 컴파일된 HTML 파일을 파괴하므로 변경하지 않음.  
> 내부 불일치는 이 문서로 대체.

### 3-2. PPTX 미구현 숏코드 (HTML 전용)

| 숏코드 | md_src 사용 수 | PPTX 현재 동작 | 조치 |
|--------|:---:|--------|------|
| `step-flow` | 8 | 경고 후 제외 | Phase 4 구현 보류 |
| `takeaway-banner` | 3 | 경고 후 제외 | Phase 4 구현 보류 |
| `part-banner` | 2 | 경고 후 제외 | 필요 시 구현 |
| `level-grid` | 2 | 경고 후 제외 | 필요 시 구현 |
| `compare-diff` | 2 | 경고 후 제외 | Phase 4 구현 보류 |
| `checkpoint-grid` | 2 | 경고 후 제외 | 필요 시 구현 |
| `chapter-list` | 2 | 경고 후 제외 | 필요 시 구현 |
| `badge-grid` | 2 | 경고 후 제외 | 필요 시 구현 |
| `summary-bar` | 2 | 경고 후 제외 | 필요 시 구현 |
| `skill-list` | 1 | 경고 후 제외 | 필요 시 구현 |

---

## 4. 기존 디자인 파괴 여부

| 변경 항목 | `public/guides/` 기존 HTML | MD 재빌드 시 | 새 MD 파일 |
|-----------|:---:|:---:|:---:|
| devtools.md 구문 수정 | **파괴 없음** | devtools.html 숏코드 정상 출력 | - |
| plan-grid HTML `desc→note` | **파괴 없음** | plan-grid 사용 3개 파일 재빌드 시 `note` 필드 필요 | 새 규칙 따름 |
| plan-grid MD 파일 `desc→note` | **파괴 없음** | 동일 내용, 필드명만 변경 | - |
| PPTX fallback 로그 추가 | **파괴 없음** | 경고 로그만 추가, 출력 동일 | - |
| PPTX `step-flow`/`takeaway-banner` 구현 | **파괴 없음** | PPTX에 슬라이드 추가됨 | - |

**결론: 어떤 변경도 기존 컴파일된 HTML을 파괴하지 않음.**

---

## 5. MD 파일 개별 수정 영향도

### 5-1. devtools.md — 구문 오류 수정 (Phase 1)

**파일:** `md_src/guides/devtools.md`

| 현재 (오류) | 수정 후 |
|------------|--------|
| `:::badge-grid` | `::: badge-grid` |
| `:::command-block` | `::: cmd-box` |
| `:::feature-grid` | `::: feature-grid` |
| `:::compare-2col` | `::: compare-split` |
| `:::compare-grid` | `::: compare-grid` |
| `:::alert-box` | `::: alert-box` |

> 총 10개 라인 수정 (스페이스 추가 + 구 이름 2개 교체)

---

### 5-2. plan-grid 사용 파일 — 필드명 수정 (Phase 2)

**영향 파일 3개** (showcase.md는 이미 `note` 사용 중 → 수정 불필요)

#### `md_src/guides/perplexity.md`
```yaml
# BEFORE
- title: "무료"
  tag: "Free"
  desc: "₩0"           ← 하단 배지 용도
  meta: "..."

# AFTER
- title: "무료"
  tag: "Free"
  note: "₩0"           ← note로 교체
  meta: "..."
```
변경 항목 수: `desc:` → `note:` 3곳

#### `md_src/guides/Grok.md`
```yaml
# BEFORE
- title: "무료"
  tag: "Free"
  desc: "₩0"
  meta: "..."

# AFTER
- title: "무료"
  tag: "Free"
  note: "₩0"
  meta: "..."
```
변경 항목 수: `desc:` → `note:` 3곳

#### `md_src/guides/chatGPT.md`
```yaml
# BEFORE
- title: "무료 플랜"
  tag: "Free"
  desc: "₩0 / 월"
  meta: "..."

# AFTER
- title: "무료 플랜"
  tag: "Free"
  note: "₩0 / 월"
  meta: "..."
```
변경 항목 수: `desc:` → `note:` 4곳

---

### 5-3. 영향 없는 파일

| 대상 | 이유 |
|------|------|
| 나머지 37개 MD 파일 | plan-grid 미사용 + 현행 이름 이미 사용 중 |
| `md_src/showcase/showcase.md` | plan-grid에서 이미 `note` 사용 중 (정상) |

---

## 6. 숏코드별 필드 역할 레퍼런스 (After 기준)

| 숏코드 | icon | title | desc | tag | meta | note | color |
|--------|:----:|:-----:|:----:|:---:|:----:|:----:|:-----:|
| `icon-grid` | 이모지 | 카드 제목 | 설명 | - | - | - | 강조색 |
| `feature-grid` | 이모지 | 카드 제목 | 설명 | 상단 레이블 | - | - | 강조색 |
| `badge-grid` | 이모지 | 카드 제목 | - | 배지 텍스트 | - | - | 강조색 |
| `stat-grid` | **수치값** | 지표명 | 설명 | - | - | - | 강조색 |
| `tool-list` | 이모지 | 도구명 | 부제목 | 버전/레이블 | `\|`기능 목록 | - | 배경색 |
| `workflow-flow` | 이모지 | 단계명 | - | - | 도구/부연 | - | 강조색 |
| `step-list` | - | 단계 제목 | 단계 설명 | - | - | - | 강조색 |
| `compare-grid` | - | 항목명 | 설명 | - | - | 하단 메모 | 강조색 |
| `compare-split` | - | 제목 | 단락 텍스트 | - | `\|`불릿 목록 | 하단 배지 | 강조색 |
| `plan-grid` ✏️ | - | 플랜명 | **-** | 배지 레이블 | `\|`기능 목록 | **하단 배지** | 강조색 |
| `columns-grid` | - | 칼럼 제목 | 설명 | - | - | 하단 메모 | 강조색 |
| `summary-box` | - | 섹션 제목 | 설명 | - | `\|`칩 항목 | - | 강조색 |
| `alert-box` | 이모지 | 제목 | 설명 | 타입(tip/warn) | - | - | - |
| `cmd-box` | - | 라벨 | **코드 본문** | - | 언어(bash 등) | - | - |
| `editor-box` | - | 파일명 | **코드 본문** | 언어 | - | - | - |
| `os-tabs` | - | 탭 라벨 | 탭 내용(md) | OS | - | - | - |
| `faq-list` | - | 질문 | 답변 | - | - | - | 강조색 |
| `console-box` | - | 제목 | 프롬프트 본문 | - | - | - | 강조색 |
| `step-flow` | 이모지 | 단계명 | 설명 | 레이블 | - | - | 강조색 |
| `level-grid` | - | 레벨명 | 레벨 설명 | - | 도구명 | 부연 | 강조색 |
| `takeaway-banner` | 이모지 | 제목 | 설명 | - | - | - | 강조색 |
| `network-box` | - | 노드명 | - | - | **자식 노드** | - | 강조색 |
| `git-flow` | - | 브랜치명 | - | 타입 | `\|`커밋 목록 | - | 강조색 |
| `compare-diff` | - | 상태 제목 | 설명 | - | - | - | 강조색 |
| `checkpoint-grid` | 이모지 | 체크포인트 | 설명 | - | - | - | 강조색 |
| `summary-bar` | 번호 | 요약 제목 | - | - | - | - | - |
| `skill-list` | 이모지 | 스킬명 | 설명 | - | - | - | 강조색 |
| `part-banner` | 이모지 | 파트 제목 | 태그라인 | 번호 | - | - | 강조색 |
| `chapter-list` | 이모지 | 챕터 제목 | 설명 | 번호 | - | - | 강조색 |

> ✏️ = 이번 리팩터링에서 변경되는 항목

---

## 7. 실행 계획 (단계별)

### Phase 1: devtools.md 구문 오류 수정 — 완료

**수정 대상:** `md_src/guides/devtools.md`  
**내용:** 스페이스 누락 수정 + `command-block` → `cmd-box`, `compare-2col` → `compare-split`

```bash
node scripts/build-guide.mjs md_src/guides/devtools.md
# → public/guides/devtools.html 정상 렌더 확인
```

---

### Phase 2: plan-grid 필드 역할 통일 — 완료

**수정 대상:**
1. `scripts/build-guide.mjs` — plan-grid 렌더링 섹션은 `it.note` 기준 유지
2. `md_src/guides/perplexity.md` — `desc:` → `note:` 3곳
3. `md_src/guides/Grok.md` — `desc:` → `note:` 3곳
4. `md_src/guides/chatGPT.md` — `desc:` → `note:` 4곳

```bash
node scripts/build-guide.mjs md_src/guides/Grok.md
node scripts/build-guide.mjs md_src/guides/perplexity.md
node scripts/build-guide.mjs md_src/guides/chatGPT.md
# → plan-grid에서 요금(₩0, $20 등)이 하단에 배지로 출력되는지 확인
```

---

### Phase 3: PPTX silent drop → fallback 로그 — 완료

**수정 대상:** `scripts/md-to-pptx.mjs` `renderItem()` 마지막 줄

```javascript
console.warn(`  ⚠️  PPTX 미구현 숏코드: "${item.type}" — 슬라이드에서 제외됨`);
return 0;
```

---

### Phase 4 (선택 보류): 고빈도 PPTX 미구현 숏코드 구현

| 우선순위 | 숏코드 | 기반 함수 |
|:---:|--------|---------|
| 1 | `step-flow` | `renderWorkflow()` 구조 확장 |
| 2 | `takeaway-banner` | `renderAlertBox()` 구조 확장 |
| 3 | `compare-diff` | `renderCompare2Col()` 2열 구조 활용 |

---

## 8. 변경 파일 목록

| 파일 | Phase | 변경 내용 |
|------|:-----:|---------|
| `md_src/guides/devtools.md` | 1 | 구문 오류 수정, `command-block→cmd-box`, `compare-2col→compare-split` |
| `scripts/build-guide.mjs` | 2 | plan-grid: `it.desc` → `it.note` (1줄) |
| `md_src/guides/perplexity.md` | 2 | `desc:` → `note:` 3곳 |
| `md_src/guides/Grok.md` | 2 | `desc:` → `note:` 3곳 |
| `md_src/guides/chatGPT.md` | 2 | `desc:` → `note:` 4곳 |
| `scripts/md-to-pptx.mjs` | 3 | fallback 로그 추가 |
