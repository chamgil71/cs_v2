# Creative Spark V2.0 — 견고성 & 유연성 점검 보고서

> 분석일: 2026-06-22  
> 점검 범위: `src/`, `scripts/`, `config/`, `tsconfig*.json`, `package.json` 전체  
> 우선순위 기준: 🔴 즉시 / 🟠 높음 / 🟡 중간 / 🟢 낮음

---

## 견고성·유연성 점검이란?

프로젝트가 **견고(Robust)** 하다는 것은 예상치 못한 입력, 파일 누락, 환경 변화, 동시 요청에도 오류 없이 또는 명확한 오류 메시지로 대응할 수 있다는 뜻입니다.  
**유연(Flexible)** 하다는 것은 기관 고유 설정, 폰트, 경로, 포트 등을 코드 변경 없이 설정 파일·환경변수만으로 교체할 수 있다는 뜻입니다.

---

## 목차

1. [점검 영역 체계](#1-점검-영역-체계)
2. [타입 안전성](#2-타입-안전성)
3. [테스트 커버리지](#3-테스트-커버리지)
4. [에러 핸들링 완성도](#4-에러-핸들링-완성도)
5. [누락 파일 및 데드 코드](#5-누락-파일-및-데드-코드)
6. [스크립트 코드 중복](#6-스크립트-코드-중복)
7. [환경 구성 외부화 부재](#7-환경-구성-외부화-부재)
8. [기관 종속 로직 분리](#8-기관-종속-로직-분리)
9. [exportGuide 테마 연동 단절](#9-exportguide-테마-연동-단절)
10. [의존성 관리 현황](#10-의존성-관리-현황)
11. [수정 우선순위 요약](#11-수정-우선순위-요약)

---

## 1. 점검 영역 체계

프로젝트를 더 견고하고 유연하게 운영하기 위해 점검해야 할 영역은 다음과 같습니다.

| 영역 | 견고성 관련 | 유연성 관련 |
|---|---|---|
| **타입 안전성** | 런타임 오류 조기 차단 | — |
| **테스트 커버리지** | 회귀 버그 방지 | 리팩토링 안전망 |
| **에러 핸들링** | 예외 상황 graceful 처리 | — |
| **누락 파일·데드 코드** | 런타임 참조 오류 방지 | 코드베이스 이해도 |
| **코드 중복** | 버그 수정 누락 위험 | 기능 확장 비용 |
| **환경 구성 외부화** | 배포 환경 이식성 | 설정만으로 환경 전환 |
| **기관 종속 로직** | — | 타 조직 재사용 가능성 |
| **테마·설정 연동** | UI·출력물 일관성 | 테마 변경 효과 범위 |
| **의존성 관리** | 설치 오류, 보안 취약점 | 업그레이드 용이성 |

---

## 2. 타입 안전성

### 🔴 TypeScript strict 모드 전면 비활성화

**파일:** `tsconfig.app.json`, `tsconfig.json`

```json
// tsconfig.app.json — 현재 상태 (모두 비활성화)
{
  "strict": false,
  "noUnusedLocals": false,
  "noUnusedParameters": false,
  "noImplicitAny": false,
  "noFallthroughCasesInSwitch": false
}

// tsconfig.json — 최상위 설정도 완화
{
  "noImplicitAny": false,
  "noUnusedParameters": false,
  "noUnusedLocals": false,
  "strictNullChecks": false
}
```

**영향:**
- `any` 타입이 무제한 허용되어 컴파일 타임에 타입 오류를 잡을 수 없음
- `strictNullChecks: false`로 인해 `null`/`undefined` 역참조가 런타임까지 감지되지 않음
- `VisualAdjuster.tsx`, `MarkdownCompiler.tsx` 등에서 `Record<string, any>` 광범위 사용 중

**수정 방향:**

```json
// tsconfig.app.json — 단계적 강화 (즉시 적용 가능한 최소 설정)
{
  "strictNullChecks": true,          // null/undefined 오류 즉시 탐지
  "noImplicitAny": true,             // any 암묵 허용 차단
  "noFallthroughCasesInSwitch": true // switch fall-through 오류 방지
}
```

> `strict: true`를 한 번에 켜면 기존 코드에서 대규모 오류가 발생하므로, `strictNullChecks` → `noImplicitAny` → `strict` 순으로 단계적으로 강화하는 것을 권장합니다.

---

### 🟠 스크립트 파일이 TypeScript 타입 검사 범위 밖

**파일:** `scripts/*.mjs`, `scripts/pptx-analyzer.js`

핵심 변환 로직이 담긴 스크립트 파일들이 순수 JavaScript(`.mjs`, `.js`)로 작성되어 있어 TypeScript 타입 검사 대상에서 완전히 제외됩니다. `tsconfig.app.json`의 `"include": ["src"]` 설정이 `scripts/`를 배제합니다.

**영향:**
- `pptx-analyzer.js`(562줄), `build-guide.mjs`(1,514줄), `md-to-pptx.mjs`(883줄) 등 핵심 변환 로직 전체가 타입 안전망 없음
- 함수 인자 타입 불일치나 반환값 구조 변경이 런타임 전까지 감지 불가

**수정 방향:**

```json
// tsconfig.node.json — scripts 폴더 포함
{
  "include": ["vite.config.ts", "scripts/**/*.ts", "scripts/**/*.mjs"]
}
```

또는 `.mjs` 파일에 JSDoc 타입 주석으로 최소 타입 정보 추가:

```javascript
/** @param {import('jszip').JSZip} zip */
export async function extractColors(zip) { ... }
```

---

## 3. 테스트 커버리지

### 🔴 테스트 파일 전무

**현황:**
- `package.json`에 `"test": "vitest run"` 스크립트 존재
- `@testing-library/react`, `@testing-library/jest-dom`, `vitest`, `jsdom` 모두 설치됨
- `.test.tsx`, `.spec.tsx` 파일이 **단 하나도 없음**

**위험:**
- 핵심 변환 로직(`pptx-analyzer.js`, `build-guide.mjs`)에 버그가 생겨도 자동 감지 불가
- 리팩토링 시 회귀 여부 확인을 수동으로만 할 수 있음
- CI/CD 파이프라인에 테스트 단계가 없어 PR 머지가 언제나 수동 검증에 의존

**최우선 테스트 대상 (높은 ROI 순):**

| 테스트 대상 | 파일 | 이유 |
|---|---|---|
| `getLuminance` / `getContrast` | `src/lib/wcag.ts` 예정 | WCAG 등급 판정의 핵심, 3곳 복사본 검증 |
| `autoTo()` 색상 매핑 | `scripts/pptx-analyzer.js` | 수십 개 매직 넘버 기반 알고리즘 |
| `validateStylesSchema()` | `scripts/vite-api-plugin.ts` | 데이터 무결성 게이트웨이 |
| `parseShortcodeItems()` | `scripts/build-guide.mjs` | 복잡한 YAML 라이크 파서 |
| `injectTOC()` | `scripts/vite-api-plugin.ts` | frontmatter 분할 로직 |

**최소 테스트 파일 구조 제안:**

```
src/
  lib/
    wcag.test.ts
    utils.test.ts
scripts/
  __tests__/
    pptx-analyzer.test.js
    shortcode-parser.test.js
    vite-api-plugin.test.ts
```

---

## 4. 에러 핸들링 완성도

### 🟠 빌드 스크립트 에러 핸들링 부족

**파일:** `scripts/build-guide.mjs` (1,514줄 중 `try/catch` 2개)

대부분의 파일 읽기, 파싱, 렌더링 로직이 `try/catch` 없이 실행됩니다. YAML 파싱 실패, 잘못된 숏코드 구문, 접근 불가 파일 등이 발생하면 전체 빌드가 알 수 없는 오류로 중단됩니다.

```javascript
// ❌ 현재: 에러 처리 없음
const raw = fs.readFileSync(inputFile, "utf8");
const { data: fm, content } = matter(raw);
const style = STYLES[fm.style || 'custom-blue'];
```

```javascript
// ✅ 권장 패턴
let raw;
try {
  raw = fs.readFileSync(inputFile, "utf8");
} catch (e) {
  console.error(`[Error] 파일 읽기 실패: ${inputFile}\n  → ${e.message}`);
  process.exit(1);
}

const { data: fm, content } = matter(raw);
const styleName = fm.style || 'custom-blue';
const style = STYLES[styleName];
if (!style) {
  console.warn(`[Warning] 정의되지 않은 스타일 "${styleName}", custom-blue로 대체합니다.`);
}
```

---

### 🟡 `vite-api-plugin.ts` — `execAsync` 타임아웃 미설정

**파일:** `scripts/vite-api-plugin.ts`

```typescript
await execAsync(cmd);  // 타임아웃 없음
```

마크다운 파일이 크거나 PPTX 변환 중 무한 루프가 발생하면 요청이 영구 대기합니다.

```typescript
// ✅ 타임아웃 설정 (예: 60초)
await execAsync(cmd, { timeout: 60_000 });
```

---

### 🟡 `scratch/` 임시 파일 정리 신뢰성

**파일:** `scripts/vite-api-plugin.ts` line 244–246

```typescript
// preview 엔드포인트는 finally에서 즉시 정리
} finally {
  try { if (fs.existsSync(tempMd)) fs.unlinkSync(tempMd); } catch {}
  try { if (fs.existsSync(tempHtml)) fs.unlinkSync(tempHtml); } catch {}
}
```

`convert` 엔드포인트(line 305)는 스트리밍 중 `setTimeout 5초` 후 정리하는데, 서버 재시작 시 이 타이머가 취소되어 임시 파일이 남습니다. `scratch/` 폴더가 gitignore되어 있어 조용히 쌓입니다.

**수정 방향:** 서버 시작 시 `scratch/` 폴더를 비우는 초기화 로직 추가.

```typescript
// viteApiPlugin 시작 시
if (fs.existsSync(scratchDir)) {
  fs.readdirSync(scratchDir).forEach(f => {
    try { fs.unlinkSync(path.join(scratchDir, f)); } catch {}
  });
}
```

---

## 5. 누락 파일 및 데드 코드

### 🔴 `build-publish.mjs` 파일 누락

**참조 위치:** `scripts/vite-api-plugin.ts` line 508

```typescript
await execAsync("node scripts/build-publish.mjs");
```

이 파일이 `scripts/` 폴더에 존재하지 않습니다. `saveOption: "guideHub"` 옵션으로 저장하면 500 오류가 발생합니다.

**조치:** 파일을 생성하거나, 해당 기능이 미구현 상태임을 UI에 표시해야 합니다.

---

### 🟠 `scripts/spec-parser.js` — 어디서도 import 되지 않음

**현황:** `README.md`와 `plan/master_refactoring_and_v2_plan.md`에는 언급되어 있지만 실제 코드에서 `import`되는 곳이 없습니다.

```
README.md:   "scripts/spec-parser.js: PPTX 디자인 스펙 데이터 파서"
실제 코드:   import 없음 (데드 코드)
```

**조치:** 기능이 완성된 경우 연결하고, 미완성이면 `docs/plan/`으로 이동하거나 주석 처리합니다.

---

### 🟠 `src/components/PptxAnalyzer.tsx` — 미사용 2,079줄

`main.tsx`에서 import되지 않습니다. (이전 분석 보고서 `1-3`과 동일, 간략 기재)

---

## 6. 스크립트 코드 중복

### 🟠 핵심 함수 9개 파일에 걸쳐 복사

다음 3개 함수가 `scripts/` 내 9개 파일에 각각 복사되어 있습니다.

| 함수 | 중복 파일 수 | 현황 |
|---|---|---|
| `splitMeta()` | 9개 | 메타 문자열 파이프 분리 |
| `standardizeItem()` | 9개 | 6대 표준 키 정규화 |
| `parseShortcodeItems()` | 9개 | YAML 라이크 파서 |

**중복 위치:**
```
scripts/build-guide.mjs
scripts/md-to-pptx.mjs
scripts/build-presentation.mjs
scripts/pptx-renderers/compare-split.mjs
scripts/pptx-renderers/compare-grid.mjs
scripts/pptx-renderers/plan-grid.mjs
scripts/pptx-renderers/tool-list.mjs
scripts/pptx-renderers/summary-box.mjs
scripts/pptx-renderers/registry.mjs (일부)
```

**위험:** 파서 버그를 수정할 때 9개 파일을 모두 수정해야 합니다. 하나라도 빠뜨리면 특정 숏코드만 오동작합니다.

**수정 방향:** 공통 유틸 파일로 분리하고 `export`합니다.

```javascript
// scripts/shortcode-utils.mjs (신규)
export function splitMeta(meta) { ... }
export function standardizeItem(item) { ... }
export function parseShortcodeItems(src) { ... }
export function loadJsonWithComments(filePath) { ... }
```

```javascript
// 각 파일에서 import
import { splitMeta, standardizeItem, parseShortcodeItems } from './shortcode-utils.mjs';
```

---

### 🟡 `loadJsonWithComments()` 함수도 중복

`build-guide.mjs`와 `md-to-pptx.mjs` 양쪽에 동일한 `loadJsonWithComments()` 함수가 구현되어 있습니다. 위 `shortcode-utils.mjs`에 함께 포함시켜 해결합니다.

---

## 7. 환경 구성 외부화 부재

### 🟠 환경변수 시스템 미존재

**현황:** `.env` 파일, `process.env` 참조, `dotenv` 라이브러리 사용이 전무합니다.

**영향 받는 고정값들:**

| 설정 항목 | 현재 위치 | 문제 |
|---|---|---|
| 서버 포트 `8080` | `vite.config.ts` | 포트 충돌 시 코드 수정 필요 |
| MD 소스 경로 `"md_src"` | `vite-api-plugin.ts` (7곳) | 프로젝트 경로 변경 시 전수 수정 |
| 출력 경로 `"publish"` | `vite-api-plugin.ts` (4곳) | 동일 |
| `scratch` 임시 경로 | `vite-api-plugin.ts` | 동일 |

**수정 방향:**

```bash
# .env.example (신규)
PORT=8080
MD_SRC_DIR=md_src
PUBLISH_DIR=publish
SCRATCH_DIR=scratch
```

```typescript
// vite.config.ts
import { loadEnv } from 'vite';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: { port: Number(env.PORT) || 8080 }
  };
});
```

```typescript
// vite-api-plugin.ts
const MD_SRC  = process.env.MD_SRC_DIR  || "md_src";
const PUBLISH = process.env.PUBLISH_DIR  || "publish";
const SCRATCH = process.env.SCRATCH_DIR  || "scratch";
```

---

## 8. 기관 종속 로직 분리

### 🟠 `pptx-analyzer.js` — NIPA 색상 매핑 테이블 내장

**파일:** `scripts/pptx-analyzer.js` line 12–24

```javascript
// ❌ 특정 기관의 색상 변환 규칙이 범용 라이브러리에 고정
export const KNOWN = {
  'C1001B': '002060',   // NIPA 특수 레드 → NIPA 네이비
  'FF0000': '2789F5',   // 빨강 → NIPA 파랑
  ...
};
```

이 파일은 `PptxInspectorSuite.tsx`에서 `import`되는 **범용** 분석 라이브러리입니다. 특정 기관의 매핑 테이블이 내장되어 있으면 다른 조직에서 재사용할 때 예기치 않은 색상 변환이 발생합니다.

**수정 방향:** `KNOWN` 맵을 config 파일로 분리합니다.

```json
// config/color-mappings.json (신규)
{
  "presets": {
    "nipa": {
      "label": "NIPA 기관 표준",
      "mappings": {
        "C1001B": "002060",
        "FF0000": "2789F5"
      }
    }
  }
}
```

```javascript
// pptx-analyzer.js
export function buildKnownMap(preset = null) {
  if (!preset) return {};
  const cfg = JSON.parse(fs.readFileSync('./config/color-mappings.json', 'utf8'));
  return cfg.presets[preset]?.mappings || {};
}
```

---

### 🟡 `autoTo()` 매직 넘버

**파일:** `scripts/pptx-analyzer.js` line 41–71

```javascript
export function autoTo(h, palette) {
  ...
  if (best && bd < 100) return best;     // ← 100: 색상 거리 임계값 (미설명)
  if (r + g + b > 690) return u;        // ← 690: 밝은 색상 기준 (미설명)
  if (r + g + b < 22) return '002060';  // ← 22: 거의 검정 기준 + 002060 하드코딩
  if (r > g + 60 && r > b + 60) ...     // ← 60: 빨간 계열 판별 임계값
  if (Math.abs(r - g) < 28 ...) ...     // ← 28: 무채색 판별 임계값
  ...
}
```

알고리즘의 의도를 이해하기 어렵고, 임계값 조정이 필요할 때 어느 값을 바꿔야 할지 불명확합니다.

```javascript
// ✅ 상수로 명명 및 상단 선언
const COLOR_DISTANCE_THRESHOLD = 100;   // 팔레트 유사색 최대 허용 거리 (0~441)
const NEAR_WHITE_SUM = 690;             // r+g+b > 이 값이면 흰색 계열로 보존
const NEAR_BLACK_SUM = 22;             // r+g+b < 이 값이면 검정 계열로 대체
```

---

## 9. exportGuide 테마 연동 단절

### 🟠 편집 가능한 PPTX가 테마와 무관하게 단일 색상으로 출력

**파일:** `src/lib/exportGuide.ts` line 117–182

```typescript
// ❌ 테마에서 받아오는 값 없음 — 모두 하드코딩
const E = {
  bgDark:    "0F172A",   // 다크 배경 고정
  accent:    "6366F1",   // 인디고 강조색 고정
  codeBg:    "0F172A",
  ...
};
const FONT      = "Malgun Gothic";  // 폰트 고정
const FONT_MONO = "Consolas";       // 모노 폰트 고정

cover.addText("AI 가이드 허브", {   // 텍스트도 고정
  color: "94A3B8", fontFace: "Arial",
});
```

사용자가 `styles.json`에서 `ai-dev` 테마(코랄 오렌지)를 선택해도, `exportIframeToEditablePptx()`로 생성된 PPTX는 항상 인디고 블루와 맑은고딕 폰트로 출력됩니다.

**수정 방향:** 함수 인자로 현재 테마를 받습니다.

```typescript
// exportGuide.ts
interface ExportTheme {
  brand: string;
  bg: string;
  pptxFont: string;
  pptxFontTitle?: string;
}

export async function exportIframeToEditablePptx(
  iframe: HTMLIFrameElement,
  docTitle: string,
  fileName: string,
  theme?: ExportTheme,         // ← 테마 추가
) {
  const accent = theme?.brand?.replace('#', '')   || "6366F1";
  const font   = theme?.pptxFont                  || "Malgun Gothic";
  ...
}
```

```typescript
// MarkdownCompiler.tsx 호출 측
const currentTheme = styles[selectedStyle];
exportIframeToEditablePptx(iframe, title, filename, currentTheme);
```

---

## 10. 의존성 관리 현황

### 🟠 현재 환경에서 node_modules 미설치

`npm list` 결과 모든 패키지가 `UNMET DEPENDENCY` 상태입니다. 이 환경(원격 컨테이너)에서 `npm install`이 실행되지 않았습니다.

```bash
# 설치 명령
npm install
```

---

### 🟡 `puppeteer`와 `playwright` 동시 설치

**파일:** `package.json`

```json
"dependencies": {
  "playwright": "^1.59.1",
  "puppeteer": "^24.43.0"
}
```

두 라이브러리는 기능이 중복되며 각각 수백 MB의 브라우저 바이너리를 다운로드합니다. 실제 사용하는 라이브러리만 남기고 나머지는 제거해야 합니다.

```bash
# 실제 사용 여부 확인
grep -rn "playwright\|puppeteer" /home/user/cs_v2/src /home/user/cs_v2/scripts
```

---

### 🟡 `jspdf` 미사용 가능성

`jspdf`가 `dependencies`에 포함되어 있지만 현재 PDF 내보내기는 `printGuideIframe()`(브라우저 인쇄)로만 구현되어 있습니다. 실제 사용 여부를 확인하고, 미사용이면 제거합니다.

---

### 🟡 `package.json` 버전 정보 및 이름 미설정

```json
{
  "name": "vite_react_shadcn_ts",  // Lovable 기본값 그대로
  "version": "0.0.0"               // 버전 관리 없음
}
```

```json
// ✅ 권장
{
  "name": "creative-spark-v2",
  "version": "2.0.0",
  "description": "PPTX 디자인 인스펙터 & 마크다운 가이드북 컴파일러"
}
```

---

## 11. 수정 우선순위 요약

| 우선순위 | 항목 | 분류 | 예상 작업량 |
|:---:|---|---|:---:|
| 🔴 즉시 | `build-publish.mjs` 파일 생성 또는 UI 비활성화 | 누락 파일 | 소~중 |
| 🔴 즉시 | TypeScript `strictNullChecks` 활성화 | 타입 안전성 | 중 |
| 🟠 높음 | 스크립트 공통 유틸 `shortcode-utils.mjs` 분리 | 코드 중복 | 중 |
| 🟠 높음 | `spec-parser.js` 연결 또는 데드 코드 제거 | 누락 파일 | 소 |
| 🟠 높음 | `build-guide.mjs` 에러 핸들링 추가 | 견고성 | 중 |
| 🟠 높음 | `exportGuide.ts` 테마 파라미터 연동 | 유연성 | 중 |
| 🟠 높음 | `KNOWN` 색상 맵 → `config/color-mappings.json` 분리 | 유연성 | 소 |
| 🟡 중간 | `.env` 시스템 도입 (포트, 경로) | 환경 구성 | 소 |
| 🟡 중간 | `execAsync` 타임아웃 설정 | 견고성 | 소 |
| 🟡 중간 | `scratch/` 시작 시 초기화 | 견고성 | 소 |
| 🟡 중간 | 핵심 유틸 단위 테스트 5종 작성 | 테스트 | 중 |
| 🟡 중간 | `autoTo()` 매직 넘버 상수화 | 가독성 | 소 |
| 🟢 낮음 | `package.json` 이름·버전 정비 | 관리 | 소 |
| 🟢 낮음 | `puppeteer`/`playwright` 중복 제거 | 의존성 | 소 |
| 🟢 낮음 | `jspdf` 사용 여부 확인 후 제거 | 의존성 | 소 |
| 🟢 낮음 | scripts TypeScript 타입 주석(JSDoc) 추가 | 타입 안전성 | 중 |

---

*이 보고서는 코드 분석 보고서(`code_analysis_report.md`)와 함께 활용하세요. 이 문서는 견고성·유연성에 특화된 추가 점검 결과이며, 두 보고서를 합산하면 총 34개 항목이 개선 대상으로 식별되었습니다.*
