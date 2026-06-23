# Creative Spark V2.0 — 코드 상태 분석 보고서

> 분석일: 2026-06-22  
> 분석 범위: `src/`, `scripts/`, `config/` 전체  
> 우선순위 기준: 🔴 즉시 수정 / 🟠 높음 / 🟡 중간 / 🟢 낮음

---

## 목차

1. [치명적 버그](#1-치명적-버그)
2. [하드코딩 문제](#2-하드코딩-문제)
3. [프로젝트 정합성 문제](#3-프로젝트-정합성-문제)
4. [오류 가능성](#4-오류-가능성)
5. [기능 개선 제안](#5-기능-개선-제안)
6. [수정 우선순위 요약](#6-수정-우선순위-요약)

---

## 1. 치명적 버그

### 🔴 1-1. `getBody()` TDZ ReferenceError

**파일:** `scripts/vite-api-plugin.ts`

`const getBody` 함수가 line 195에 정의되어 있지만, `/api/save-styles` 핸들러 블록(line 143)에서 먼저 호출됩니다. JavaScript/TypeScript의 `const`는 호이스팅되지 않기 때문에, `/api/save-styles` 요청이 오면 **`ReferenceError: Cannot access 'getBody' before initialization`** 이 발생합니다.

```typescript
// ❌ 문제 코드 (현재 상태)
// line 142~164: save-styles 핸들러
if (url.pathname === "/api/save-styles" && method === "POST") {
  const { styles } = await getBody();   // ← line 143, getBody 아직 미정의
  const schemaError = validateStylesSchema(styles); // ← line 151
  ...
}

// line 195~207: getBody 정의 (사용 이후에 등장)
const getBody = (): Promise<any> => { ... };
```

**영향 범위:** `/api/save-styles` 를 호출하는 모든 기능 — VisualAdjuster의 **[서버에 최종 저장]**, SubUtilities의 **테마 시스템 등록** 버튼이 실제로 동작하지 않습니다.

**수정 방법:** `getBody`와 `validateStylesSchema` 선언을 모든 라우트 `if` 블록보다 **위로** 이동합니다.

```typescript
// ✅ 수정 방향
export function viteApiPlugin(): Plugin {
  return {
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // ...공통 변수 설정...

        // ▶ 헬퍼 함수를 최상단에 정의
        const getBody = (): Promise<any> => { ... };
        const validateStylesSchema = (stylesObj: any): string | null => { ... };

        // ▶ 이후 라우트 핸들러들
        if (url.pathname === "/api/list-styles") { ... }
        if (url.pathname === "/api/save-styles") { await getBody(); ... }
        ...
      });
    }
  };
}
```

---

### 🔴 1-2. 커맨드 인젝션 취약점

**파일:** `scripts/vite-api-plugin.ts` — line 225, 277, 352, 553 등

`style`, `inputDir`, `outputDir` 파라미터가 검증 없이 셸 명령어에 직접 문자열로 삽입됩니다.

```typescript
// ❌ 취약 패턴 (여러 곳에 반복)
const styleFlag = style ? ` --style ${style}` : "";
cmd = `node scripts/build-guide.mjs "${tempMd}" --out "${tempHtml}"${styleFlag}`;
await execAsync(cmd);
```

`style` 값으로 `; rm -rf ~` 또는 `$(악성명령)`을 전달하면 서버에서 임의 명령이 실행될 수 있습니다. 개발 전용 서버라도 로컬 네트워크에 노출될 경우 위험합니다.

**수정 방법:** 화이트리스트 검증 후 사용하거나, `execAsync` 대신 `spawn`의 배열 인수 형태를 사용합니다.

```typescript
// ✅ 화이트리스트 검증
const ALLOWED_STYLES = new Set(Object.keys(await loadStyles()));
if (style && !ALLOWED_STYLES.has(style)) {
  res.statusCode = 400;
  res.end(JSON.stringify({ error: "허용되지 않는 스타일 ID입니다." }));
  return;
}
```

---

### 🔴 1-3. Windows 전용 폴더 선택 API

**파일:** `scripts/vite-api-plugin.ts` — line 458~480

```typescript
// ❌ Windows PowerShell 전용
await execAsync(`powershell -NoProfile -Command "...System.Windows.Forms..."`);
```

Linux/macOS 환경에서 `/api/select-folder`를 호출하면 500 오류가 발생합니다. 이 프로젝트가 Docker, Linux CI, macOS 개발 환경에서도 사용된다면 즉시 대응이 필요합니다.

**수정 방법:** OS를 감지하거나, 브라우저 File System Access API(`showDirectoryPicker`)로 교체합니다.

```typescript
// ✅ OS 분기 처리
if (process.platform === 'win32') {
  // PowerShell 사용
} else if (process.platform === 'darwin') {
  await execAsync(`osascript -e 'choose folder'`);
} else {
  await execAsync(`zenity --file-selection --directory`);
}
```

---

## 2. 하드코딩 문제

### 🟠 2-1. 슬라이드 치수 이중 관리

`pptdesign.config.json`에 이미 정의된 슬라이드 물리 치수가 `exportGuide.ts`에 상수로 중복 선언되어 있습니다. 한쪽만 수정하면 불일치가 발생합니다.

| 파일 | 값 |
|---|---|
| `config/pptdesign.config.json` | `"widthIn": 13.333`, `"heightIn": 7.5` |
| `src/lib/exportGuide.ts` line 54–57 | `const SLIDE_W_IN = 13.333`, `const SLIDE_H_IN = 7.5`, `const DPI = 96` |

**수정 방향:** `exportGuide.ts`에서 config를 `fetch` 또는 `import`로 읽어와 사용합니다.

---

### 🟠 2-2. 헤더 브랜드 컬러 인라인 하드코딩

**파일:** `src/main.tsx` line 18, 60; `scripts/vite-api-plugin.ts` line 423

```tsx
// ❌ 색상값 직접 삽입 (3곳에 걸쳐 반복)
<header className="bg-[#1e3a5f] ...">
<h2 className="text-[#1e3a5f] ...">
// vite-api-plugin.ts 포털 HTML에도
<header class="bg-[#1e3a5f] ...">
```

Tailwind CSS 커스텀 색상 토큰으로 등록하면 한 곳에서 관리할 수 있습니다.

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      brand: { navy: '#1e3a5f' }
    }
  }
}
// 사용: className="bg-brand-navy"
```

---

### 🟠 2-3. 기관 전용 기본값 하드코딩

**파일:** `src/components/PptxInspectorSuite.tsx` line 69–88

```typescript
// ❌ 특정 기관(NIPA) 색상 및 레이아웃이 기본값으로 고정
const DEFAULT_PALETTE = [
  { hex: '002060', name: 'NIPA 진한 네이비' },
  ...
];
const DEFAULT_LAYOUT = [
  { id: 'title', ..., source: 'NIPA 기본값' },
  ...
];
```

범용 도구가 특정 기관의 스펙을 기본값으로 가지면 재사용성이 떨어집니다. 별도 프리셋 파일(예: `config/presets/nipa.json`)로 분리하고 기본값은 중립적으로 설정하는 것이 좋습니다.

---

### 🟠 2-4. 삭제 불가 테마 하드코딩

**파일:** `src/components/VisualAdjuster.tsx` line 186, 276

```typescript
// ❌ 두 곳에서 중복으로 같은 키를 체크
if (keyToDelete === "custom-blue" || keyToDelete === "ai-chat") { ... }
// UI에서도 동일한 조건으로 삭제 버튼 숨김
{key !== 'custom-blue' && key !== 'ai-chat' && (<Trash2 />)}
```

**수정 방향:** `styles.json`에 `"locked": true` 속성을 추가하고 코드에서 이를 읽어 처리합니다.

```json
"custom-blue": { "label": "...", "locked": true, ... }
```

---

### 🟡 2-5. API 경로 상수화 미적용

**파일:** `scripts/vite-api-plugin.ts`

`"md_src"`, `"publish"`, `"scratch"`, `"storage"` 등의 경로 문자열이 함수 내 여러 곳에 반복 등장합니다. 파일 상단 상수로 분리해야 합니다.

```typescript
// ✅ 파일 상단에 상수 선언
const DIR_MD_SRC = "md_src";
const DIR_PUBLISH = "publish";
const DIR_SCRATCH = "scratch";
const DIR_STORAGE = "storage";
```

---

### 🟡 2-6. 포트 번호 하드코딩

**파일:** `vite.config.ts` line 10

```typescript
server: { port: 8080 }
```

환경변수로 오버라이드 가능하도록 수정합니다.

```typescript
server: { port: Number(process.env.PORT) || 8080 }
```

---

## 3. 프로젝트 정합성 문제

### 🟠 3-1. WCAG 유틸 함수 3중 복사

동일한 로직의 `getLuminance()`, `getContrast()`, `getWCAGRating()` 함수가 세 파일에 각각 복사되어 있으며, 일부 문구가 미묘하게 다릅니다.

| 파일 | AAA 등급 텍스트 |
|---|---|
| `src/components/SubUtilities.tsx` | `'AAA (매우 적합)'` |
| `src/components/VisualAdjuster.tsx` | `'AAA (아주 우수)'` |
| `src/components/MarkdownCompiler.tsx` | `'AAA (매우 우수)'` |

**수정 방향:** `src/lib/wcag.ts`로 분리하고 세 컴포넌트에서 `import`합니다.

```typescript
// src/lib/wcag.ts
export function getLuminance(hex: string): number { ... }
export function getContrast(hex1: string, hex2: string): number { ... }
export function getWCAGRating(contrast: number) { ... }
```

---

### 🟠 3-2. `PRESET_THEMES` vs `styles.json` 불일치

**파일:** `src/components/SubUtilities.tsx` line 38–119

`SubUtilities.tsx` 내 `PRESET_THEMES` 배열에 5개 테마가 하드코딩되어 있습니다. 실제 `styles.json`에는 12개 테마가 있으므로, SubUtilities의 프리셋 드롭다운에는 7개 테마가 누락된 상태입니다.

**수정 방향:** `PRESET_THEMES` 하드코딩을 제거하고 컴포넌트 마운트 시 `/api/list-styles`에서 동적으로 로드합니다.

---

### 🟠 3-3. `PptxAnalyzer.tsx` 미사용 파일

`src/components/PptxAnalyzer.tsx`(약 2,079줄)가 존재하지만 `main.tsx`에서 `import`되지 않습니다. `PptxInspectorSuite.tsx`로 대체된 것으로 보이며, 미사용 파일이 번들 분석과 유지보수를 복잡하게 만듭니다.

**조치:** 삭제 또는 `PptxInspectorSuite.tsx`와 병합합니다.

---

### 🟡 3-4. `useEffect` 의존성 누락

**파일:** `src/components/MarkdownCompiler.tsx` line 211–215

```typescript
// ❌ markdown, selectedStyle이 deps 배열에 없음
useEffect(() => {
  if (markdown) {
    triggerPreview(markdown, previewMode, selectedStyle);
  }
}, [previewMode]);
```

`markdown` 내용이나 `selectedStyle`이 바뀌어도 이 effect가 재실행되지 않아 프리뷰가 오래된 상태로 머무를 수 있습니다.

```typescript
// ✅ 수정
useEffect(() => {
  if (markdown) {
    triggerPreview(markdown, previewMode, selectedStyle);
  }
}, [previewMode, markdown, selectedStyle]);
```

---

### 🟡 3-5. 임시 파일명 충돌 가능성

**파일:** `scripts/vite-api-plugin.ts` line 218–219

```typescript
// ❌ 동일 ms 내 동시 요청 시 같은 이름 사용
const tempMd   = path.join(scratchDir, `preview_${Date.now()}.md`);
const tempHtml = path.join(scratchDir, `preview_${Date.now()}.html`);
```

두 번의 `Date.now()` 호출 사이에 ms가 바뀌면 `.md`와 `.html`의 타임스탬프가 달라집니다. 동시 요청 시에는 파일 덮어쓰기가 발생할 수 있습니다.

```typescript
// ✅ crypto.randomUUID() 사용
import { randomUUID } from "node:crypto";
const id = randomUUID();
const tempMd   = path.join(scratchDir, `preview_${id}.md`);
const tempHtml = path.join(scratchDir, `preview_${id}.html`);
```

---

### 🟡 3-6. `ThemeDetails` 인터페이스 미공유

`VisualAdjuster.tsx`에 정의된 `ThemeDetails` 인터페이스가 `MarkdownCompiler.tsx`와 `SubUtilities.tsx`에서는 `Record<string, any>`로 대체됩니다.

**수정 방향:** `src/types/theme.ts`로 분리하고 세 컴포넌트에서 공유합니다.

---

## 4. 오류 가능성

### 🟡 4-1. `getContext("2d")` 비null 단언

**파일:** `src/lib/exportGuide.ts` line 65

```typescript
const ctx = out.getContext("2d")!;  // ← 비null 단언
ctx.fillStyle = "#ffffff";
```

`getContext("2d")`는 드문 경우(메모리 부족, 오프스크린 Canvas 미지원 환경)에 `null`을 반환할 수 있습니다. 비null 단언 대신 명시적 null 체크가 안전합니다.

```typescript
const ctx = out.getContext("2d");
if (!ctx) throw new Error("Canvas 2D context를 생성할 수 없습니다.");
```

---

### 🟡 4-2. frontmatter 스타일 파싱 취약성

**파일:** `src/components/MarkdownCompiler.tsx` line 256, 288

```typescript
const styleMatch = data.content.match(/style:\s*([^\r\n]+)/);
```

- 본문 중간에 `style:` 문자열이 포함된 경우 잘못 매칭될 수 있습니다.
- YAML frontmatter 외부에서도 동작할 수 있습니다.

**수정 방향:** `---` 블록 내부에서만 파싱하도록 범위를 제한합니다.

```typescript
function extractFrontmatterStyle(content: string): string | null {
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) return null;
  const styleMatch = fmMatch[1].match(/^style:\s*(.+)$/m);
  return styleMatch ? styleMatch[1].trim() : null;
}
```

---

### 🟡 4-3. `build-publish.mjs` 스크립트 누락 가능성

**파일:** `scripts/vite-api-plugin.ts` line 509

```typescript
await execAsync("node scripts/build-publish.mjs");
```

`scripts/` 폴더에 `build-publish.mjs`가 존재하지 않으면 `guideHub` 저장 옵션 사용 시 오류가 발생합니다. 현재 scripts 폴더에 해당 파일이 확인되지 않습니다.

**조치:** 파일 존재 여부를 사전 확인하거나 `try/catch`에서 오류를 로깅하고 계속 진행하도록 처리합니다 (현재는 `catch`에서 `console.error` 후 계속 진행하므로 부분적으로 처리됨).

---

### 🟡 4-4. `localStorage` 키 네임스페이스 충돌

**파일:** `src/components/PptxInspectorSuite.tsx`

`v2_baseline_palette`, `v2_baseline_layout` 등의 키로 localStorage를 사용합니다. 같은 도메인에서 다른 프로젝트가 구동될 경우 키 충돌이 발생할 수 있습니다.

**수정 방향:** 앱 고유 prefix 추가 (예: `cs_v2__baseline_palette`).

---

## 5. 기능 개선 제안

### 🟢 5-1. 공통 타입 및 유틸 파일 구조 정립

```
src/
  lib/
    utils.ts          ← 기존 (cn 함수)
    wcag.ts           ← 신규: getLuminance, getContrast, getWCAGRating
    exportGuide.ts    ← 기존
  types/
    theme.ts          ← 신규: ThemeDetails 인터페이스
```

---

### 🟢 5-2. API 라우터 모듈화

현재 `viteApiPlugin.ts`의 단일 `middlewares.use()` 핸들러가 600줄이 넘습니다. 라우트별 핸들러를 별도 함수로 분리하면 `getBody` 순서 문제도 자연히 해결됩니다.

```typescript
// scripts/api/
//   handlers-styles.ts
//   handlers-preview.ts
//   handlers-convert.ts
//   handlers-files.ts
```

---

### 🟢 5-3. `styles.json` 스키마 확장 제안

```json
{
  "custom-blue": {
    "label": "페이퍼로지 오리지널",
    "locked": true,        // 삭제 보호
    "heroGradient": "...", // 현재 일부 테마에만 있음 → 전체 표준화
    "brand": "#2789F5",
    ...
  }
}
```

현재 일부 테마에만 `heroGradient` 속성이 있어 스키마 일관성이 없습니다.

---

### 🟢 5-4. 브라우저 File System Access API 활용

`/api/select-folder` PowerShell 의존성 대신 브라우저 네이티브 API를 활용하면 OS 독립적으로 동작합니다.

```typescript
// 클라이언트 측에서 직접 처리 (Chrome 86+)
const dirHandle = await window.showDirectoryPicker();
```

---

### 🟢 5-5. 실시간 프리뷰 디바운스

**파일:** `src/components/MarkdownCompiler.tsx`

마크다운 편집 시 키 입력마다 `/api/preview` 요청이 발생하면 서버 부하가 높아질 수 있습니다. 디바운스(500ms) 적용을 권장합니다.

---

### 🟢 5-6. WCAG 경계값 정확성 확인

현재 세 컴포넌트 모두 대비율 `3.0` 이상을 `"AA (큰 텍스트 전용)"`으로 표시합니다. WCAG 2.1 공식 기준은 18pt(또는 14pt Bold) 이상 텍스트에 **3:1**이므로 수치는 맞지만, 실제로는 `3.0 ≤ contrast < 4.5` 범위가 해당합니다. 코드는 현재 올바르게 동작하고 있으나, 문구를 통일하는 것이 권장됩니다.

---

## 6. 수정 우선순위 요약

| 우선순위 | 항목 | 파일 | 예상 작업량 |
|:---:|---|---|:---:|
| 🔴 즉시 | `getBody` TDZ 버그 | `vite-api-plugin.ts` | 소 (이동) |
| 🔴 즉시 | 커맨드 인젝션 취약점 | `vite-api-plugin.ts` | 중 (검증 추가) |
| 🔴 즉시 | Windows 전용 select-folder | `vite-api-plugin.ts` | 중 (분기 처리) |
| 🟠 높음 | WCAG 유틸 3중 복사 제거 | 3개 컴포넌트 | 소 (파일 분리) |
| 🟠 높음 | `PRESET_THEMES` 하드코딩 제거 | `SubUtilities.tsx` | 소 |
| 🟠 높음 | 슬라이드 치수 단일 소스화 | `exportGuide.ts` | 소 |
| 🟠 높음 | 삭제 불가 테마 config화 | `VisualAdjuster.tsx`, `styles.json` | 소 |
| 🟠 높음 | `PptxAnalyzer.tsx` 미사용 파일 정리 | `PptxAnalyzer.tsx` | 소 (삭제) |
| 🟡 중간 | `useEffect` 의존성 보완 | `MarkdownCompiler.tsx` | 소 |
| 🟡 중간 | 임시 파일 UUID화 | `vite-api-plugin.ts` | 소 |
| 🟡 중간 | frontmatter 파싱 강화 | `MarkdownCompiler.tsx` | 소 |
| 🟡 중간 | `ThemeDetails` 타입 공유 | `src/types/theme.ts` 신규 | 소 |
| 🟡 중간 | `getContext` null 체크 | `exportGuide.ts` | 소 |
| 🟢 낮음 | API 경로 상수화 | `vite-api-plugin.ts` | 소 |
| 🟢 낮음 | 헤더 컬러 토큰화 | `tailwind.config.ts`, `main.tsx` | 소 |
| 🟢 낮음 | 포트 환경변수화 | `vite.config.ts` | 소 |
| 🟢 낮음 | API 라우터 모듈화 | `scripts/api/` 신규 | 대 |
| 🟢 낮음 | `styles.json` 스키마 통일 | `config/styles.json` | 중 |
| 🟢 낮음 | 프리뷰 요청 디바운스 | `MarkdownCompiler.tsx` | 소 |

---

*이 보고서는 자동 생성이 아니라 전체 소스를 직접 검토하여 작성되었습니다. 수정 작업 진행 시 이 문서를 기준으로 항목별 체크리스트로 활용하세요.*
