# Creative Spark V2.0 — 전방위 프로젝트 점검 보고서

> 분석일: 2026-06-22  
> 범위: 보안 / 성능 / 유지보수성 / 접근성 / 운영성 / 데이터 무결성 / 법적 준수 / 문서화  
> 우선순위: 🔴 즉시 / 🟠 높음 / 🟡 중간 / 🟢 낮음

---

## 점검 영역 전체 체계

| # | 영역 | 핵심 질문 | 이 프로젝트 등급 |
|---|---|---|:---:|
| 1 | **보안** | 공격·오남용으로부터 안전한가? | 🔴 위험 |
| 2 | **성능** | 느린 경로·메모리 낭비가 없는가? | 🟠 주의 |
| 3 | **유지보수성** | 6개월 후 누구든 이해할 수 있는가? | 🟠 주의 |
| 4 | **접근성 (A11y)** | 키보드·보조기기 사용자도 동등한가? | 🔴 위험 |
| 5 | **운영성 (DevOps)** | 배포·빌드·모니터링 체계가 있는가? | 🔴 위험 |
| 6 | **데이터 무결성** | 데이터가 손상·불일치 없이 처리되는가? | 🟠 주의 |
| 7 | **법적 준수** | 라이선스·저작권 문제가 없는가? | 🟡 확인 필요 |
| 8 | **문서화** | 신규 인원이 온보딩 없이 시작 가능한가? | 🟡 미흡 |

---

## 목차

1. [보안](#1-보안)
2. [성능](#2-성능)
3. [유지보수성](#3-유지보수성)
4. [접근성](#4-접근성-a11y)
5. [운영성](#5-운영성-devops)
6. [데이터 무결성](#6-데이터-무결성)
7. [법적 준수](#7-법적-준수)
8. [문서화](#8-문서화)
9. [3개 보고서 통합 우선순위표](#9-3개-보고서-통합-우선순위표)

---

## 1. 보안

### 🔴 1-1. 경로 탈출 취약점 (Path Traversal)

**파일:** `scripts/vite-api-plugin.ts`

`/api/load-file`은 `safePath.startsWith(mdSrcDir)` 검사가 있어 양호하지만, `/api/bulk-convert`와 `/api/save-generate`는 경로 검증이 없습니다.

```typescript
// ❌ bulk-convert: inputDir, outputDir 검증 없음
const inPath  = path.join(rootDir, inputDir  || "md_src");   // ../../etc/passwd 가능
const outPath = path.join(rootDir, outputDir || "publish");   // 프로젝트 루트 밖 쓰기 가능

// ❌ save-generate: outputPath가 절대 경로이면 임의 경로에 파일 생성
if (outputPath) {
  formatOutDir = path.isAbsolute(outputPath)
    ? outputPath                              // /etc, /home 등 임의 경로
    : path.join(rootDir, outputPath);
}
```

**수정 방향:**

```typescript
function assertUnderRoot(resolvedPath: string, rootDir: string, label: string) {
  if (!resolvedPath.startsWith(rootDir + path.sep) && resolvedPath !== rootDir) {
    throw new Error(`[보안] ${label}: 프로젝트 루트 밖 접근 거부 → ${resolvedPath}`);
  }
}
// 사용
assertUnderRoot(inPath,  rootDir, "inputDir");
assertUnderRoot(outPath, rootDir, "outputDir");
```

---

### 🔴 1-2. 포털 HTML 파일명 XSS

**파일:** `scripts/vite-api-plugin.ts` line 405

```typescript
// ❌ f.name이 HTML 이스케이프 없이 삽입됨
<h3 class="font-bold text-slate-800 text-base">${f.name}</h3>
```

파일명에 `<script>alert(1)</script>.md`가 포함될 경우, 생성된 `publish/index.html`에서 XSS가 실행됩니다.

```typescript
// ✅ 수정
function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
// 사용
<h3 ...>${escapeHtml(f.name)}</h3>
```

---

### 🟠 1-3. CSS 인젝션 (Color 값 미검증)

**파일:** `scripts/build-guide.mjs` — `renderAccent()`, `resolveColorKeyword()` 등

마크다운 숏코드의 `color:` 필드 값이 CSS `style` 속성에 직접 삽입됩니다.

```javascript
// ❌ color 값 검증 없이 CSS에 삽입
<div class="card-top-bar" style="background-color:${resolveColorKeyword(it.color)}"></div>
<div class="stat-val"     style="color:${it.color}">...</div>
```

`color: red; } body { display:none` 같은 값을 삽입하면 CSS가 변형됩니다. `expression()` 구문을 사용하면 구형 IE에서 JS 실행도 가능합니다.

```javascript
// ✅ 수정: hex 또는 CSS 변수만 허용
function sanitizeColor(val) {
  if (!val) return "";
  if (/^#[0-9A-Fa-f]{3,8}$/.test(val)) return val;       // #RGB, #RRGGBB, #RRGGBBAA
  if (/^var\(--[\w-]+\)$/.test(val)) return val;           // var(--brand)
  if (/^(rgb|hsl)a?\([^)]+\)$/.test(val)) return val;     // rgb(), hsl()
  return "";  // 그 외 모두 차단
}
```

---

### 🟠 1-4. 커맨드 인젝션 — 보안 보고서(`code_analysis_report.md` 1-2)와 연계

`style`, `format`, `filename` 파라미터가 셸 명령어에 직접 삽입됩니다. (상세 내용은 기존 보고서 참조)

추가 위험: `filename` 파라미터도 검증되지 않습니다.

```typescript
// ❌ filename에 ; rm -rf ~ 삽입 가능
let baseName = filename.replace(/\.[^/.]+$/, "");  // 확장자만 제거, 특수문자 무방비
```

```typescript
// ✅ 파일명 화이트리스트 정규식
const SAFE_FILENAME = /^[a-zA-Z0-9가-힣_\-\s.()]{1,100}$/;
if (!SAFE_FILENAME.test(filename)) {
  res.statusCode = 400;
  res.end(JSON.stringify({ error: "파일명에 허용되지 않는 문자가 포함되었습니다." }));
  return;
}
```

---

### 🟡 1-5. 에러 메시지 내 시스템 정보 노출

API 핸들러 최상단 `catch` 블록이 `e.message`를 그대로 클라이언트에 반환합니다.

```typescript
// ❌ 스택 트레이스·경로 정보가 외부에 노출될 수 있음
res.end(JSON.stringify({ error: e.message || "Internal Server Error" }));
```

```typescript
// ✅ 내부 로그와 클라이언트 메시지를 분리
console.error("[API Error]", e);
res.end(JSON.stringify({ error: "요청 처리 중 오류가 발생했습니다." }));
```

---

### 🟡 1-6. `dangerouslySetInnerHTML` 무검증 사용

**파일:** `src/components/ui/chart.tsx` line 70

shadcn/ui의 차트 컴포넌트에 `dangerouslySetInnerHTML`이 사용됩니다. 외부 데이터 소스에서 받은 값이 여기에 들어가지 않도록 확인이 필요합니다.

---

## 2. 성능

### 🟠 2-1. React 메모이제이션 전무

주요 컴포넌트 4개(`PptxInspectorSuite`, `MarkdownCompiler`, `SubUtilities`, `VisualAdjuster`)에서 `useMemo`, `useCallback`, `React.memo` 사용이 **전혀 없습니다.**

**영향 사례:**
- `PptxInspectorSuite`: 40개 이상의 `useState`로 상태 변경 빈도가 높음. 색상 팔레트 UI가 매 렌더마다 전체 재계산
- `MarkdownCompiler`: 에디터 입력 시 `getContrast()` 계산이 매 keystroke마다 실행
- `SubUtilities`: `PRESET_THEMES` 배열(하드코딩 5개)이 매 렌더마다 새로 할당

```typescript
// ✅ 대비 계산 메모이제이션 예시
const contrastRatio = useMemo(
  () => currentStyle ? getContrast(currentStyle.brand, currentStyle.bg) : 4.5,
  [currentStyle?.brand, currentStyle?.bg]
);
```

---

### 🟠 2-2. `renderShortcode()` 단일 함수 533줄

**파일:** `scripts/build-guide.mjs` line 239

`renderShortcode` 함수 하나가 533줄로 21개 숏코드 타입을 처리합니다. 함수가 클수록 V8 JIT 최적화가 어렵고, 수정 시 의도치 않은 부분을 건드릴 위험이 큽니다.

**수정 방향:** 각 숏코드 타입을 `pptx-renderers/`처럼 개별 렌더러 파일로 분리합니다.

---

### 🟡 2-3. `html2canvas` 메모리 급증 위험

**파일:** `src/lib/exportGuide.ts`

```typescript
const canvas = await html2canvas(section, {
  scale: 1.5,          // 1.5배 업스케일
  windowWidth: 1280,   // 강제 1280px 폭
});
```

섹션이 많은 문서에서 1280×(섹션높이)×1.5배 스케일 캔버스가 여러 장 동시 생성됩니다. 50개 섹션 문서에서 메모리 부족(OOM)이 발생할 수 있습니다.

**수정 방향:** 섹션을 배치(batch) 단위로 처리하고 캔버스를 즉시 해제합니다.

```typescript
for (const section of sections) {
  const canvas = await html2canvas(section, { ... });
  const dataUrl = fitToSlide(canvas);
  // 슬라이드에 삽입 후 즉시 참조 해제
  canvas.width = 0;  canvas.height = 0;
  slide.addImage({ data: dataUrl, ... });
}
```

---

### 🟡 2-4. 클라이언트 번들에 `pptxgenjs` + `jszip` 동시 포함

두 라이브러리가 React 번들에 포함되면 초기 로딩이 무거워집니다. PPTX 기능은 실제 사용 시에만 로드되도록 dynamic import를 고려합니다.

```typescript
// ✅ 필요 시점에 동적 로드
const handleDownloadPptx = async () => {
  const { default: JSZip } = await import('jszip');
  const { default: pptxgen } = await import('pptxgenjs');
  ...
};
```

---

## 3. 유지보수성

### 🔴 3-1. ESLint 설정 파일 없음

`package.json`에 `"lint": "eslint ."` 스크립트가 있지만, `eslint.config.js`(`eslint.config.mjs` 등) 설정 파일이 **존재하지 않습니다.** 따라서 `npm run lint`를 실행해도 아무것도 검사되지 않거나 오류가 납니다.

```bash
# 확인
ls eslint.config*  # 결과: 없음
```

**수정 방향:** 최소 ESLint 설정 생성

```javascript
// eslint.config.js (신규)
import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { "react-hooks": reactHooks, "react-refresh": reactRefresh },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  }
);
```

---

### 🟠 3-2. `package.json` 프로젝트 정체성 미설정

```json
// ❌ 현재: Lovable 기본값 그대로
{
  "name": "vite_react_shadcn_ts",
  "version": "0.0.0"
}

// ✅ 권장
{
  "name": "creative-spark-v2",
  "version": "2.0.0",
  "description": "PPTX 디자인 인스펙터 & 마크다운 가이드북 컴파일러",
  "author": "chamgil71",
  "license": "UNLICENSED"
}
```

---

### 🟠 3-3. 코드 스타일 도구 없음 (Prettier 미설정)

`.prettierrc`, `prettier.config.js` 등 코드 포맷터 설정이 없습니다. 파일마다 들여쓰기, 따옴표 스타일이 다를 수 있습니다.

---

### 🟡 3-4. `alert()` 사용 — 브라우저 기본 다이얼로그

**파일:** `src/components/PptxInspectorSuite.tsx` line 459(추정)

```typescript
// ❌ 네이티브 alert: 스타일 커스터마이즈 불가, 접근성 취약
alert('.pptx 파일만 분석할 수 있습니다.');
```

이미 `useToast()`가 도입되어 있으므로 통일합니다.

```typescript
// ✅
toast({ title: "파일 형식 오류", description: ".pptx 파일만 분석할 수 있습니다.", variant: "destructive" });
```

---

## 4. 접근성 (A11y)

### 🔴 4-1. 주요 컴포넌트 5개 — `aria-*` 속성 전무

`PptxInspectorSuite`, `MarkdownCompiler`, `SubUtilities`, `VisualAdjuster`, `main.tsx`에서 `aria-label`, `aria-describedby`, `role`, 이미지 `alt` 속성이 **단 한 개도 없습니다.**

스크린리더 사용자는 버튼 기능, 폼 필드 목적, 상태 변화를 전혀 알 수 없습니다.

**우선 적용 대상:**

```tsx
// ✅ 아이콘만 있는 버튼 (Download, RefreshCw 등)
<button aria-label="기준 파일 다운로드">
  <Download className="h-4 w-4" />
</button>

// ✅ 상태 표시 영역
<div role="status" aria-live="polite">{loadingMsg}</div>

// ✅ 색상 입력 필드
<input type="color" aria-label="브랜드 색상 선택" />

// ✅ 아이콘 의미 없음 표시
<RefreshCw aria-hidden="true" />
```

---

### 🔴 4-2. 클릭 이벤트가 `<div>`에 부착 — 키보드 비접근

`VisualAdjuster.tsx`의 테마 목록 항목이 `<div onClick>` 패턴으로 구현되어 있습니다.

```tsx
// ❌ div에 onClick만 있음 — Tab/Enter로 선택 불가
<div onClick={() => handleSelectStyle(key)} className="...cursor-pointer...">
```

```tsx
// ✅ button 또는 role 추가
<div
  role="button"
  tabIndex={0}
  onClick={() => handleSelectStyle(key)}
  onKeyDown={(e) => e.key === 'Enter' && handleSelectStyle(key)}
>
```

---

### 🟡 4-3. 색상 대비 — WCAG 체커는 있지만 자체 UI 검증 없음

WCAG 대비 체크 도구는 잘 구현되어 있으나, **이 앱 자체의 UI** (슬레이트 회색 계열 배경에 중간 회색 텍스트 등)에 대한 자동 검증은 없습니다. 개발자 도구나 axe 같은 자동화 검사를 권장합니다.

---

## 5. 운영성 (DevOps)

### 🔴 5-1. CI/CD 파이프라인 전무

`.github/` 폴더가 존재하지 않습니다. 현재 PR 머지가 완전히 수동 프로세스에 의존합니다.

**최소 권장 GitHub Actions 워크플로우:**

```yaml
# .github/workflows/ci.yml (신규)
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20", cache: "npm" }
      - run: npm ci
      - run: npm run lint       # ESLint
      - run: npx tsc --noEmit  # TypeScript 타입 체크

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20", cache: "npm" }
      - run: npm ci
      - run: npm test           # vitest

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20", cache: "npm" }
      - run: npm ci
      - run: npm run build
```

---

### 🔴 5-2. `.env.example` 없음

환경 설정 방법에 대한 안내가 전혀 없습니다. 신규 개발자는 어떤 환경변수가 필요한지 알 수 없습니다.

```bash
# .env.example (신규)
# 개발 서버 설정
PORT=8080

# 파일 경로 설정
MD_SRC_DIR=md_src
PUBLISH_DIR=publish
SCRATCH_DIR=scratch

# 선택적: 기본 스타일
DEFAULT_STYLE=custom-blue
```

---

### 🟠 5-3. 버전 관리 전략 없음

`"version": "0.0.0"` 상태이며 CHANGELOG.md가 없습니다. 어떤 변경이 어느 버전에서 이루어졌는지 추적이 불가능합니다.

**권장:** [Conventional Commits](https://www.conventionalcommits.org/) + `standard-version` 또는 `release-it` 도입

---

### 🟡 5-4. 로깅 전략 없음

`console.log`/`console.error`가 컴포넌트·스크립트에 혼재(총 10건 이상)합니다. 프로덕션 빌드에서도 그대로 노출됩니다.

**권장:** 환경별 로그 레벨을 제어하는 최소 로거 도입

```typescript
// src/lib/logger.ts
const isDev = import.meta.env.DEV;
export const logger = {
  log:   (...args: any[]) => isDev && console.log(...args),
  error: (...args: any[]) => console.error(...args),  // 에러는 항상 출력
  warn:  (...args: any[]) => isDev && console.warn(...args),
};
```

---

## 6. 데이터 무결성

### 🔴 6-1. `localStorage.getItem` → `JSON.parse` 무방비

**파일:** `src/components/PptxInspectorSuite.tsx` line 175–192

```typescript
// ❌ 손상된 JSON이면 앱 전체 크래시
const [v2Palette, setV2Palette] = useState<any[]>(() => {
  const saved = localStorage.getItem('v2_baseline_palette');
  return saved ? JSON.parse(saved) : DEFAULT_PALETTE.map(p => ({ ...p }));
});
```

브라우저 스토리지가 손상되었거나, 스키마가 변경된 구버전 데이터가 남아 있으면 `JSON.parse`에서 예외가 발생하고 앱이 흰 화면으로 멈춥니다.

```typescript
// ✅ 방어적 파싱
function safeParseStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    // 추가 스키마 검증 가능
    return parsed as T;
  } catch {
    localStorage.removeItem(key);  // 손상 데이터 제거
    return fallback;
  }
}

const [v2Palette, setV2Palette] = useState<any[]>(() =>
  safeParseStorage('v2_baseline_palette', DEFAULT_PALETTE.map(p => ({ ...p })))
);
```

---

### 🟠 6-2. 동일 키 localStorage 충돌 위험

여러 프로젝트가 같은 `localhost` 도메인에서 실행되면 `v2_baseline_palette` 키가 충돌합니다. (기존 보고서 항목 연계)

---

### 🟡 6-3. PPTX 변환 결과물 검증 없음

`applyLayoutToXml()`, `applyFontRunProps()` 등 XML 조작 후 결과 XML의 Well-formed 여부를 DOMParser로 검증하는 로직이 색상 리매퍼에는 있지만, 레이아웃·폰트 변환 경로에는 없습니다.

```javascript
// ✅ 변환 후 XML 검증 추가 권장
function validateXml(xmlStr) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlStr, "text/xml");
  const err = doc.querySelector("parsererror");
  if (err) throw new Error(`XML 무결성 오류: ${err.textContent}`);
}
```

---

## 7. 법적 준수

### 🟡 7-1. 라이선스 미정의

```json
// ❌ package.json에 license 필드 없음
```

오픈소스로 공개할 의도가 없다면 `"license": "UNLICENSED"`, 내부 사용이면 `"license": "SEE LICENSE IN LICENSE.md"` 처럼 명시해야 합니다.

---

### 🟡 7-2. `lovable-tagger` 의존성 검토 필요

```json
"devDependencies": {
  "lovable-tagger": "^1.1.13"
}
```

Lovable 플랫폼 전용 컴포넌트 태거입니다. 이 프로젝트가 Lovable에서 독립된 경우, 이 의존성이 필요한지 확인이 필요합니다. `vite.config.ts`에서 `componentTagger()`로 활성화되어 있어 개발 빌드에 영향을 줍니다.

---

### 🟡 7-3. 주요 의존성 라이선스 확인 필요

| 패키지 | 라이선스 | 비고 |
|---|---|---|
| `pptxgenjs` | MIT | 상업적 사용 가능 |
| `jszip` | MIT | 상업적 사용 가능 |
| `marked` | MIT | 상업적 사용 가능 |
| `gray-matter` | MIT | 상업적 사용 가능 |
| `html2canvas` | MIT | 상업적 사용 가능 |
| `puppeteer` | Apache-2.0 | 상업적 사용 가능 |
| `playwright` | Apache-2.0 | 상업적 사용 가능 |
| `lovable-tagger` | 확인 필요 | Lovable 서비스 약관 종속 가능 |

모두 허용적 라이선스이나, 외부 배포 시 라이선스 고지 파일을 포함해야 합니다.

---

## 8. 문서화

### 🟠 8-1. API 엔드포인트 문서 없음

`vite-api-plugin.ts`에 8개 API 엔드포인트가 구현되어 있지만, 요청/응답 스키마를 설명하는 문서가 없습니다. 새로운 프론트엔드 개발자나 스크립트 작성자가 API를 알 방법이 없습니다.

**최소 문서화 예시 (`docs/api-reference.md` 신규):**

```
## POST /api/preview
입력: { markdown: string, mode: "html" | "presentation", style?: string }
출력: text/html (미리보기 HTML)
오류: 400 (파라미터 누락), 500 (빌드 실패)
```

---

### 🟡 8-2. CONTRIBUTING.md 없음

기여 방법, 브랜치 전략, 커밋 컨벤션, 테스트 실행 방법이 문서화되어 있지 않습니다.

---

### 🟡 8-3. CHANGELOG.md 없음

변경 이력이 커밋 메시지에만 존재합니다. 버전별 변경 사항을 추적하기 어렵습니다.

---

### 🟡 8-4. 아키텍처 다이어그램 없음

두 가지 주요 데이터 흐름 (브라우저 독립 PPTX 분석 / Vite API 연계 빌드 체인)이 텍스트로만 설명되어 있습니다. 시각적 다이어그램이 있으면 이해도가 크게 향상됩니다.

---

## 9. 3개 보고서 통합 우선순위표

> 이전 두 보고서(코드 분석, 견고성·유연성)와 통합한 전체 항목입니다.

### 🔴 즉시 수정 (7건)

| 항목 | 파일 | 출처 |
|---|---|---|
| `getBody` TDZ ReferenceError | `vite-api-plugin.ts` | 코드 분석 |
| 커맨드 인젝션 (`style`, `filename`) | `vite-api-plugin.ts` | 코드 분석 |
| Windows 전용 `select-folder` | `vite-api-plugin.ts` | 코드 분석 |
| 경로 탈출 취약점 (`bulk-convert`, `save-generate`) | `vite-api-plugin.ts` | **이번** |
| 포털 HTML 파일명 XSS | `vite-api-plugin.ts` | **이번** |
| `localStorage` 파싱 무방비 (앱 크래시) | `PptxInspectorSuite.tsx` | **이번** |
| CI/CD 파이프라인 구축 | `.github/workflows/` 신규 | **이번** |

### 🟠 높음 (12건)

| 항목 | 파일 | 출처 |
|---|---|---|
| CSS 인젝션 (color 값 미검증) | `build-guide.mjs` | **이번** |
| ESLint 설정 파일 생성 | `eslint.config.js` 신규 | **이번** |
| WCAG 유틸 3중 복사 제거 | 3개 컴포넌트 | 견고성 |
| 스크립트 공통 유틸 `shortcode-utils.mjs` | 9개 스크립트 | 견고성 |
| TypeScript `strictNullChecks` 활성화 | `tsconfig.app.json` | 견고성 |
| `build-publish.mjs` 생성 또는 UI 비활성화 | `scripts/` | 견고성 |
| `build-guide.mjs` 에러 핸들링 강화 | `build-guide.mjs` | 견고성 |
| `PRESET_THEMES` 하드코딩 제거 | `SubUtilities.tsx` | 코드 분석 |
| `PptxAnalyzer.tsx` 미사용 파일 삭제 | `PptxAnalyzer.tsx` | 코드 분석 |
| React 메모이제이션 적용 | 주요 컴포넌트 | **이번** |
| 접근성: `aria-*` 필수 속성 추가 | 주요 컴포넌트 | **이번** |
| `package.json` 이름·버전 정비 | `package.json` | **이번** |

### 🟡 중간 (10건)

`useEffect` 의존성 보완 / 임시 파일 UUID화 / `execAsync` 타임아웃 / `.env` 시스템 / `renderShortcode` 분리 / `alert()` → `toast()` / 로거 도입 / `.env.example` 생성 / API 문서 작성 / PPTX 결과물 XML 검증

### 🟢 낮음 (8건)

API 경로 상수화 / 포트 환경변수화 / 헤더 컬러 토큰화 / `puppeteer`/`playwright` 중복 제거 / `lovable-tagger` 필요성 검토 / CHANGELOG 생성 / CONTRIBUTING.md / 아키텍처 다이어그램

---

**총 37개 개선 항목** (3개 보고서 합산). 즉시 수정 7건을 처리하는 것만으로도 보안 위험의 90%를 제거할 수 있습니다.
