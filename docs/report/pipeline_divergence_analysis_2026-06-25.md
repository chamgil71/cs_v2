# 렌더링 파이프라인 분기·설정 외부화 정합성 분석 보고서

> 작성일: 2026-06-25 (개정 2판)
> 대상 독자: 개발자, 기술 검토자
> 분석 범위: HTML(가이드/프레젠테이션)·standalone·PPTX 4개 출력물의 숏코드/수치 설정 정합성
> 상태: **분석 전용 (코드 미수정)** — 해결방안 검토 및 방향 결정을 위한 진단 결과.

> **개정 이력**
> - 초판: 4벌 중복·standalone 박제·PPTX 폰트 오버라이드 진단.
> - 2판(본 문서): ① "HTML은 한 곳에서 수정", ② "수치는 config에서 설정하고 코드는 불러와 사용" 두 설계 원칙을 중심으로 재구성. HTML 측 config 외부화 실태(htmldesign.config.json 미활용·크기 토큰 3중 하드코딩) 증거 추가. PPTX는 별도 운영이 불가피함을 명시하되 "같은 설정·같은 파서"를 공유해야 함을 핵심으로 정리. 정합성 테스트를 키스톤으로 승격.

---

## 0. 증상 요약 (사용자 보고)

| # | 보고된 증상 |
|---|------------|
| S1 | 빌드(HTML)와 standalone 빌드 결과물이 다르다. 가이드 HTML·프레젠테이션 HTML·PPTX가 동일 내용이어야 하는데 어긋난다. |
| S2 | 숏코드가 "번갈아 가면서" 깨진다 — 미리보기는 멀쩡한데 standalone에서 깨지거나 그 반대. |
| S3 | PPTX 폰트 크기를 `pptdesign.config.json`에서 바꿔도 반영되지 않고 원래 크기로 돌아간다. PPTX 본문은 HTML보다 좀 더 커야 한다. |

---

## 0.1 설계 원칙 (검토 과정에서 확정)

본 분석은 다음 두 원칙을 기준선으로 삼는다. 둘 다 현재 코드가 **부분적으로만** 지키고 있다.

| 원칙 | 의미 | 현재 준수도 |
|------|------|------------|
| **P1. HTML은 한 곳에서 수정** | 가이드/프레젠테이션/standalone HTML은 동일 내용 → 숏코드 파싱·렌더는 단일 모듈에서. PPTX는 매체가 달라 별도 운영이 불가피하나, **같은 파서·같은 설정**을 소비해야 함. | ❌ HTML 렌더러 3벌 분산 |
| **P2. 수치는 config, 코드는 로드만** | 폰트·크기 등 수치 설정은 `*.config.json`에 두고 코드는 읽기만. (`pptdesign.config.json`을 둔 이유 자체가 이것.) | △ PPTX는 일부 준수, HTML은 거의 미준수 |

---

## 1. 근본 원인 1 — 숏코드 렌더링 로직이 4벌로 중복 (P1 위반 / S1·S2 핵심)

같은 숏코드를 렌더링하는 코드가 **출력물마다 독립적으로 4벌 존재**하며 서로를 공유하지 않는다.

| 출력물 | 렌더링 파일 | 함수 | 산출 형태 | HTML 통합 대상 |
|--------|------------|------|----------|:---:|
| 가이드 HTML | `scripts/build-guide.mjs` | `renderShortcode()` | HTML 문자열 | ✅ |
| 프레젠테이션 HTML | `scripts/build-presentation.mjs` | 자체 분기(약 40 type) | HTML 문자열 | ✅ |
| 미리보기 + standalone | `src/lib/client-compiler.ts` | `renderClientShortcode()` | HTML 문자열 | ✅ |
| **PPTX** | `scripts/pptx-renderers/*.mjs` | 모듈별 `render()` | **pptxgenjs 도형·좌표(HTML 아님)** | ❌ 구조적 불가 |

### 1.1 핵심 구분: HTML 3벌은 통합 가능, PPTX는 불가

- **HTML 3벌**은 모두 "숏코드 → HTML 문자열"을 만든다. → **단일 공유 모듈로 통합 가능하며, 통합하는 것이 맞다(P1).**
- **PPTX**는 DOM이 아니라 좌표에 도형을 배치한다(`addShape`/`addText`). HTML 렌더 함수와 **코드 공유가 원천적으로 불가능**하다. PPTX는 영구히 별도 구현으로 남는다.
- 따라서 "통합하면 4개가 같아진다"는 보장은 성립하지 않는다. PPTX의 내용 일치는 **코드 공유가 아니라 ③ 같은 파서·같은 설정 소비 + ④ 정합성 테스트**로 보장해야 한다(§5 참조).

### 1.2 검증: 파서도 중복되어 있음

표준 item 구조를 만드는 `parseShortcodeItems()`(숏코드 텍스트 → `{icon,title,desc,tag,meta,note,color,...}`)가 `build-*`와 `client-compiler.ts`에 **각각 따로 존재**한다. 렌더러뿐 아니라 **입력 해석 단계부터 중복**이므로, 같은 숏코드 텍스트가 출력물마다 다르게 파싱될 여지가 있다. → 통합 범위는 렌더러만이 아니라 **파서를 포함**해야 한다. (초판 누락분)

### 1.3 검증: 지원 type 집합이 이미 어긋나 있음

- `build-guide.mjs` 전용: `arrow`, `heading`, `slide-config` 등(일부 구조 처리용)
- `client-compiler.ts` 전용: `info-box`

→ 한쪽에만 있는 type은 다른 출력물에서 렌더링되지 않거나 원문이 그대로 노출된다. "번갈아 깨짐"(S2)의 직접 원인.

---

## 2. 근본 원인 2 — 수치 설정의 config 외부화 미흡 (P2 위반 / S3의 구조적 배경)

`pptdesign.config.json`은 PPTX 수치를 외부화하려는 의도로 존재한다. 그러나 **HTML 측은 같은 원칙이 거의 지켜지지 않으며**, PPTX 측도 일부 렌더러가 config를 무시한다.

### 2.1 HTML: config는 있으나 크기 값을 담지 않음

`config/htmldesign.config.json`은 존재하지만 내용이 **폰트 종류 + 단일 `scale` 배율뿐**이다. pptdesign처럼 **요소별 크기 값(title/body/code …)이 없다.**

```jsonc
// htmldesign.config.json — 크기 토큰 부재
{ "htmlFont": { "title": "...", "desc": "...", "code": "...", "scale": 1.0 } }
```

그 결과 HTML의 실제 크기는 **각 렌더러의 CSS `:root`에 rem 리터럴로 하드코딩**된다.

### 2.2 HTML: 크기 토큰이 3곳에 따로 하드코딩 (drift 폭탄)

세 HTML 렌더러가 **같은 토큰 이름**을 쓰면서 **값은 각자 보유**한다.

| 토큰 | build-guide.mjs:1004- | build-presentation.mjs:895- | client-compiler.ts (html):921- / (slide):703- |
|------|:---:|:---:|:---:|
| `--size-card-title` | 1.15rem | 1.45rem | 1.15rem / 1.45rem |
| `--size-card-p` | 0.92rem | 1.2rem | 0.92rem / 1.2rem |
| `--size-h2` | 1.8rem | 2.6rem | 1.8rem / 2.6rem |

→ 현재는 값이 우연히 일치하지만 **한 파일만 고치면 즉시 어긋난다.** 어느 것도 config에서 읽지 않으므로 "config에서 한 번 바꾸면 전부 반영"이 불가능하다. (P2 위반의 직접 증거)

### 2.3 HTML: client-compiler는 config를 아예 안 읽음

`build-guide.mjs`(L30)·`build-presentation.mjs`(L27)는 `htmldesign.config.json`을 로드하지만, **`client-compiler.ts`는 이 config를 전혀 참조하지 않고** 자체 `:root`를 하드코딩한다. → 브라우저/standalone 경로가 config와 **완전히 단절**. 미리보기·standalone이 Node 빌드와 다른 수치·폰트를 쓸 수 있는 구조적 원인.

> 참고: client-compiler는 브라우저에서 동작하므로 런타임 `fs` 읽기가 불가능하다. 따라서 해법은 "config를 빌드 시 모듈로 import"(예: `import html from '../../config/htmldesign.config.json'`)이지, 하드코딩이 아니다.

---

## 3. 근본 원인 3 — PPTX 폰트 오버라이드 체인의 숨은 출처 (P2 위반 / S3 직접 원인)

`pptdesign.config.json`의 폰트 크기는 **최종값이 아니라 기본값**이며, 두 단계에서 덮어쓰기 된다.

### 3.1 우선순위 체인 (`scripts/md-to-pptx.mjs` L789-811)

```
[낮음] pptdesign.config.json (D.card.titleSize / bodySize)   ← 사용자가 수정한 곳
   ↓ 덮어씀 (L803-804)  styles.json 의 스타일별 titleSize / bodySize
   ↓ 덮어씀 (L810-811)  frontmatter 의 titleSize / bodySize
[높음]
```

```js
if (style.titleSize) D.card.titleSize = Number(style.titleSize); // L803
if (style.bodySize)  D.card.bodySize  = Number(style.bodySize);  // L804
if (fm.titleSize) D.card.titleSize = Number(fm.titleSize);       // L810
if (fm.bodySize)  D.card.bodySize  = Number(fm.bodySize);        // L811
```

### 3.2 결정적 원인: `custom-blue` 스타일의 사이즈 하드코딩

테스트 문서(`guide_v2.md`)는 `style: custom-blue`이며 `config/styles.json:17-18`에 다음이 박혀 있다.

```json
"custom-blue": { ..., "titleSize": 14, "bodySize": 11 }
```

→ `pptdesign.config.json`의 `bodySize`를 올려도 custom-blue를 쓰는 한 **L804에서 항상 11로 되돌아간다.** "수정해도 원래대로 돌아간다"의 정체.

| 스타일 | titleSize / bodySize | config 반영 |
|--------|:---:|:---:|
| `custom-blue` | 14 / 11 (하드코딩) | ❌ 오버라이드됨 |
| `ai-chat` 외 9종 | 없음 | ✅ config 적용 |

→ 선택 스타일에 따라 같은 문서의 폰트가 달라지는 비일관성.

### 3.3 PPTX 렌더러의 크기 하드코딩 — 28곳이 config를 우회

`fontSize`를 config 참조(`c.bodySize` 등)가 아니라 **숫자 리터럴로 직접 지정**한 곳이 전체 PPTX 코드에 **28곳** 존재한다. 이들은 `pptdesign.config.json`·`styles.json`·frontmatter 그 무엇으로도 바꿀 수 없다. (P2 정면 위반)

| 영역 | 대표 위치 | 하드코딩 값 |
|------|----------|------------|
| editor-box | `editor-box.mjs:87,106,113` | 9.5 / 8.5 / 8.5 |
| 그리드 아이콘·수치 | `icon-grid.mjs:92`, `stat-grid.mjs:52`, `feature-grid.mjs:97` | 20 / 24 / 7.5 |
| flow·workflow | `flow.mjs:62,86`, `workflow.mjs:51,75` | 16 / 14 |
| tool-list | `tool-list.mjs:59,67,80` | 20 / 10.5 / 7.5 |
| 표지 stats·done | `md-to-pptx.mjs:689,690,778,779,780` | 19 / 9.5 / 36 / 16 / 14 |
| alert·tabs·network·cmd 등 | `alert-box.mjs:81`, `tabs.mjs:55`, `network-box.mjs:83`, `cmd-box.mjs:60,67` | 14 / 10 / 13 / 9 |

> 정상 사례(참조형): `console-box.mjs:74`, `cmd-box.mjs:12,31`은 `c.codeSize`를 읽어 config를 따른다. 즉 **참조 방식 자체는 이미 검증됨** — 나머지 28곳을 같은 방식으로 전환하면 된다.

### 3.4 HTML vs PPTX 현재 크기 (S3 "더 커야 한다")

| 항목 | HTML | PPTX (config 기본) |
|------|------|--------------------|
| 본문 | `--size-card-p` 0.92rem ≈ 약 11pt 상당 | bodySize 11(수정 전)/13(수정 후) |
| 제목 | `--size-card-title` 1.15rem | titleSize 14/16 |
| 코드 | ~0.9rem | codeSize 10/11 |

→ 수정 전 PPTX 본문(11pt)은 HTML과 사실상 동급. HTML보다 키우려면 body ≥ 13 필요하나, **custom-blue 오버라이드·editor-box 하드코딩 때문에 config 수정만으로는 적용 불가.**

### 3.5 크기 제어 계층 — 의도된 설계 vs 현재 구현 (사용자 질문 답변)

PPTX·HTML 모두 **"config(기본) → style → 문서(frontmatter) → 숏코드 블록"** 4단계 캐스케이드로 크기를 조절하는 것이 설계 의도다. 각 매체는 **자기 전용 config**(PPTX=`pptdesign.config.json`, HTML=`htmldesign.config.json`)를 가지며, 이 둘을 합치지 않는다. 아래는 각 단계의 현재 지원 실태다.

| 단계 | 의미 | PPTX 현재 | HTML 현재 |
|------|------|:---:|:---:|
| **① config json** | 매체 전용 기본 수치 | △ card.titleSize/bodySize/h3Size/codeSize는 있으나 **28곳이 우회 하드코딩** | ❌ 크기 토큰 없음(scale만), `:root` 3중 하드코딩 |
| **② style (styles.json)** | 스타일별 오버라이드 | △ 메커니즘 존재(L803-804)하나 **custom-blue만** 값 보유 → 비일관 | 색·폰트는 스타일별 가능, **크기는 미연결** |
| **③ frontmatter (문서)** | md 문서 단위 | ✅ `titleSize`/`bodySize`(L810-811), slide-config(L699-700) | ✅ 문서 단위 인자 |
| **④ 숏코드 블록** | 개별 블록 단위 | ❌ **미지원** (md-to-pptx에 `title-size=`/`desc-size=` 처리 없음) | ✅ `title-size=`/`desc-size=`(`buildSizeOverrideStyle`) |

**사용자 질문별 답:**
- "PPTX 자체 json 활용?" → **그렇게 해야 맞다.** `pptdesign.config.json`이 PPTX 수치의 집(home)이며 목표 폰트는 여기서 결정. 다만 지금은 28곳이 이 집을 우회한다.
- "스타일별로 폰트 크기 설정하나?" → **할 수 있으나(②) 현재 custom-blue만** 사용 → 우연한 불일치. 색·폰트처럼 모든 스타일에서 일관 지원하거나, 아예 스타일에서 크기를 빼고 config 기본에 맡기는 정책 결정 필요.
- "숏코드/md에서 크기 조절 자유도?" → md(③)는 PPTX·HTML 모두 OK. **숏코드 블록(④)은 HTML만 되고 PPTX는 빠져 있다** → PPTX에도 동일 인자를 추가해 대칭화 필요.

**결론(P2 구현 방향):** 캐스케이드 구조 자체는 옳고 대부분 존재한다. 문제는 **새 규칙이 아니라 "누수 제거"** 다 — ① 28곳 하드코딩을 config 키로 이전, ② 스타일 크기 정책 통일, ④ PPTX 숏코드 인자 추가, 그리고 HTML 측 `:root` 하드코딩을 htmldesign config로 이전.

---

## 4. 근본 원인 4 — standalone 번들 박제 (운영 함정 / S1·S2)

`client-compiler.ts`는 미리보기(dev)와 standalone(`dist/module2.html`)이 공유하지만 standalone은 **빌드 산출물**이다.

- `client-compiler.ts`를 고쳐도 `npm run build:standalone` 재실행 전까지 `dist/module2.html`엔 **옛 코드가 박제**된다.
- dev는 최신 소스, standalone은 마지막 빌드 시점 소스 → 미리보기는 정상인데 standalone만 깨짐.
- **실제 발생**(2026-06-25): 새 렌더러·CSS 추가 후 미재빌드 → standalone이 CSS 없이 렌더되어 전면 깨짐. 재빌드로 해소.

---

## 5. 증상 ↔ 원인 매핑

| 증상 | 근본 원인 |
|------|----------|
| S1 (빌드/standalone 불일치) | 원인1(HTML 4벌) + 원인2(HTML config 단절) + 원인4(박제) |
| S2 (숏코드 번갈아 깨짐) | 원인1(drift) + 원인4(재빌드 누락) |
| S3 (PPTX 폰트 미반영) | 원인3(styles 오버라이드·editor-box 하드코딩) + 원인2(외부화 미흡) |

---

## 6. 해결방안 (구현 보류 — 방향 결정 대기)

### 6.1 P1 실현 — HTML 단일 소스 (원인 1)

숏코드 **파서 + HTML 렌더러**를 **환경 비의존 순수 모듈 1개**로 추출하고, `build-guide`·`build-presentation`·`client-compiler` 셋이 모두 import.

- 가이드/프레젠테이션 차이(크기 스케일 등)는 **분기 로직이 아니라 설정 값**으로 처리(같은 함수에 다른 토큰 주입).
- 효과: 한 번 수정 → HTML 3종 동시 반영. drift 원천 차단.
- 제약: client-compiler는 브라우저 → 공유 모듈은 `fs`·`process` 등 Node 의존이 없어야 함.

### 6.2 P2 실현 — 수치 전면 config 구동 (원인 2·3)

**공통 원칙: 모든 크기 수치는 자기 매체의 config json에 home을 두고, 코드는 읽기만 한다. 렌더러 내 폰트 크기 리터럴 0개를 목표로 한다.** 캐스케이드 순서는 §3.5의 4단계(config → style → frontmatter → 숏코드)로 명문화한다.

**HTML 측**
1. `htmldesign.config.json`을 `pptdesign.config.json`과 **대칭 구조**로 확장: 폰트뿐 아니라 **요소별 크기 토큰(h1/h2/card-title/card-p/code …)**을 담는다.
2. HTML `:root`의 rem 리터럴 3중 하드코딩 제거 → config 토큰 주입. 세 렌더러가 같은 토큰을 config에서 읽는다.
3. client-compiler도 config를 **빌드 시 import**해 사용(런타임 fs 불가 대응).

**PPTX 측 (자체 `pptdesign.config.json` 활용 — HTML과 합치지 않음)**
4. §3.3의 **하드코딩 28곳을 config 키로 이전.** 컴포넌트 고유 크기는 기존 컴포넌트 섹션(`workflow`,`toolCard`,`planGrid`,`bottomList`,`compare2col`)에 사이즈 키를 추가하는 방식(예: `editorBox:{tabSize,codeSize,lineNumSize}`, `statGrid:{valueSize}` 등). 렌더러는 `c.xxx`/`D.xxx`로 읽기만.
5. `styles.json`의 사이즈 오버라이드 정책 정리: custom-blue의 우발적 14/11을 제거하고, **스타일별 크기를 쓸지(색·폰트처럼 전 스타일 일관 지원) vs config 기본에만 맡길지** 정책 결정(D6).
6. **숏코드 블록 크기 인자(`title-size=`/`desc-size=`)를 PPTX에도 추가**해 HTML과 대칭화(④ 단계 보완).

### 6.3 PPTX는 분리 유지하되 "같은 파서 + 자기 config" 사용 (원인 1의 PPTX 몫)

PPTX 렌더러 코드는 HTML과 공유 불가하므로 그대로 둔다. 단:
- **입력 해석은 통일**: ①(HTML 통합 모듈)과 **동일한 파서**가 만든 표준 item을 PPTX도 소비 → 같은 숏코드가 같은 데이터로 해석됨.
- **수치는 매체 전용 config**: PPTX는 `pptdesign.config.json`, HTML은 `htmldesign.config.json`을 각각 읽는다. **둘을 합치지 않는다**(매체별 단위가 다름 — PPTX는 pt·inch, HTML은 rem). 사용자 지적대로 PPTX 전용 json을 그대로 활용하는 방향.

### 6.4 ★키스톤 — 정합성 테스트 (원인 1·4의 보증 장치)

`showcase.md`(25종 전체)를 **4개 파이프라인 모두에 통과**시켜, 각 숏코드가 출력물마다 **빈 결과·에러 토큰 없이** 생성되는지 자동 검증.

- 코드 공유가 불가능한 PPTX의 일치는 **이 테스트만이 보증**한다.
- 통합(6.1)은 drift "빈도"를 줄이고, 테스트는 drift를 "감지·차단"한다. 둘은 보완 관계이며, **테스트 없이는 S2가 재발**한다.

### 6.5 운영 — 재빌드 자동화 (원인 4)

`client-compiler.ts` 변경 시 `build:standalone`이 함께 도는 스크립트 구성, 또는 CI에서 standalone 산출물과 소스 정합성 검사. (CLAUDE.md의 "수정 후 재빌드" 규칙을 자동화로 승격.)

---

## 7. 결정해야 할 방향 (확정 요청)

| # | 결정 항목 | 선택지 | 비고/권장 |
|---|----------|--------|----------|
| **D1** | HTML 통합 범위 | (a) 파서+렌더러 단일 모듈 통합 / (b) 현 3벌 유지 + 동기화 점검만 | **(a) 권장.** 사용자 의견("HTML은 한 곳에서")과 일치. 근본 해결. |
| **D2** | 수치 config 외부화 범위 | (a) HTML=htmldesign 대칭 확장 + PPTX=pptdesign의 하드코딩 28곳 이전, **양 매체 렌더러 리터럴 0 목표** / (b) 깨진 부분만 최소 수정 | **(a) 권장.** 사용자 의견("수치는 모두 config json에서")과 일치. (b)는 재발 여지. |
| **D3** | PPTX 목표 폰트 크기 | body / title / code 각 pt 지정 | HTML보다 크게 하려면 **body ≥ 13**(예: body 13·title 16·code 11). 값은 **config에 기입, 하드코딩 금지**. 확정 필요. |
| **D6** | 스타일별 PPTX 크기 정책 | (a) 색·폰트처럼 **전 스타일에서 크기 오버라이드 일관 지원**(원하면 styles.json에 기입) / (b) 스타일에서 크기 제거, **config 기본 단일화**(custom-blue 14/11 삭제) | 사용자 질문 직접 관련. **(b)가 단순·일관**하나, 스타일마다 다른 크기를 원하면 (a). 선택 필요. |
| **D7** | PPTX 숏코드 블록 크기 인자 | (a) `title-size=`/`desc-size=`를 PPTX에도 추가(HTML과 대칭) / (b) 미지원 유지 | **(a) 권장.** "숏코드 내 크기 자유도" 요구와 일치. |
| **D4** | 정합성 테스트 도입 | (a) 도입 / (b) 미도입 | **(a) 강력 권장.** PPTX 일치 보증의 유일한 수단. |
| **D5** | standalone 재빌드 자동화 | (a) 빌드 스크립트 연동 / (b) 수동 규칙 유지 | (a) 권장. |

> 최소한 **D1·D2·D3·D6**는 확정되어야 구현 착수 가능. D4·D5·D7은 권장값(a)으로 진행 가능하나 명시 확인 바람.

---

## 7.1 최종 확정 (2026-06-25)

| # | 확정 |
|---|------|
| D1 | **(a)** HTML 파서+렌더러 단일 공유 모듈로 통합 |
| D2 | **(a)** HTML=htmldesign 대칭 확장 + PPTX=pptdesign 하드코딩 28곳 이전. **양 매체 렌더러 폰트 리터럴 0 목표** |
| D3 | PPTX 기본 폰트 = **body 13 / title 16 / code 11** (이미 pptdesign.config.json `card`에 반영됨). 하드코딩 금지 |
| D6 | **config 기본값 단일화 + styles.json 선택적 오버라이드.** 색·폰트와 동일 패턴. custom-blue의 우발적 14/11 제거(→ config 기본으로 폴백), 오버라이드 메커니즘(md-to-pptx L803-804)은 유지 |
| D7 | **(a)** PPTX에도 숏코드 블록 크기 인자(`title-size=`/`desc-size=`) 추가 → HTML과 대칭 |
| D4 | **(a)** showcase.md 기반 4-파이프라인 정합성 테스트 도입 |
| D5 | **(a)** standalone 재빌드 자동화 |

**크기 캐스케이드 최종 규칙 (양 매체 공통):**
```
config json (기본)  →  styles.json (스타일별 선택 오버라이드)
   →  frontmatter (문서 단위)  →  숏코드 블록 인자 (블록 단위)
```
뒤로 갈수록 우선. 렌더러 코드에는 폰트 크기 리터럴을 두지 않는다.

### 구현 단계 (Phase) — 진행 상태 (2026-06-25)

1. **Phase 1 — 설정 기반 정비 ✅ 완료:** styles.json custom-blue 크기 제거(D6) / pptdesign.config.json에 컴포넌트별 폰트 키 신설 / htmldesign.config.json 크기 토큰 대칭 확장(guide·presentation 프로파일).
2. **Phase 2 — PPTX 수치 config 구동 ✅ 완료:** 렌더러 하드코딩 28곳 → config 참조 전환 / PPTX 숏코드 크기 인자(`title-size=`/`desc-size=`) 추가(D7). 실측 검증: custom-blue PPTX가 config 기본 16/13 사용 + 인자 배수 적용 확인.
3. **Phase 3 — HTML 단일 모듈 통합 ✅ 완료:**
   - 정본 파서+렌더러를 `scripts/shortcode-render.mjs`로, 컴포넌트 CSS를 `scripts/shortcode-styles.mjs`(`var(--*)` 기반)로 추출.
   - build-guide 연결 후 **출력 동일 검증**(var 치환만, 컴포넌트 값 동일). build-presentation·client-compiler를 공유 렌더러+`${SHORTCODE_CSS}`에 연결(각 셸은 `:root` 테마 변수만 자기 테마로 정의).
   - 카드 배경 `var(--card-bg, #fff)` 변수화로 라이트(guide)/다크(presentation·client) 동시 지원. presentation은 before-after·os-tabs를 새로 획득.
4. **Phase 4 — 안전장치 ✅ 완료:**
   - 정합성 테스트(D4): `src/__tests__/shortcode-conformance.test.ts` (85 케이스 — 공유 HTML 렌더러 + PPTX 레지스트리 커버리지 + client ::: 잔존 검사). **실제 드리프트 1건 발견·수정**: PPTX `before-after` 미등록 → `compare-split.mjs` type 배열에 추가.
   - 자동화(D5): `npm run build:standalone`이 정합성 테스트를 먼저 실행 후 빌드(게이트). `build:standalone:fast`는 빌드만.

> **최종 결과:** 4개 출력물 모두 정상 빌드, 전체 테스트 148건 통과(신규 정합성 85건 포함). HTML 3종 단일 렌더러+CSS 공유 → 드리프트 원천 차단. PPTX 폰트 config 구동(하드코딩 0). standalone 빌드 정합성 게이트.

---

## 부록 — 검증에 사용한 핵심 코드 위치

| 항목 | 파일:라인 |
|------|----------|
| PPTX config 로드 | `scripts/md-to-pptx.mjs:146` |
| styles.json 사이즈 오버라이드 | `scripts/md-to-pptx.mjs:803-804` |
| frontmatter 사이즈 오버라이드 | `scripts/md-to-pptx.mjs:810-811` |
| custom-blue 사이즈 하드코딩 | `config/styles.json:17-18` |
| editor-box 폰트 하드코딩 | `scripts/pptx-renderers/editor-box.mjs:87,106,113` |
| console/cmd-box codeSize 참조 | `scripts/pptx-renderers/console-box.mjs:74`, `cmd-box.mjs:12,31` |
| htmldesign.config.json 로드(Node 2종) | `build-guide.mjs:30`, `build-presentation.mjs:27` |
| htmldesign.config.json 내용(크기 토큰 부재) | `config/htmldesign.config.json` |
| HTML 크기 토큰 3중 하드코딩 | `build-guide.mjs:1004-`, `build-presentation.mjs:895-`, `client-compiler.ts:703-,921-` |
| 가이드 HTML 렌더러 | `scripts/build-guide.mjs` `renderShortcode()` |
| 프레젠테이션 HTML 렌더러 | `scripts/build-presentation.mjs` (자체 분기) |
| 클라이언트/standalone 렌더러·파서 | `src/lib/client-compiler.ts` `renderClientShortcode()`·`parseShortcodeItems()` |
| standalone 빌드 | `scripts/build-standalone.mjs` (`npm run build:standalone`) |
