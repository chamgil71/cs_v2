# Creative Spark V2.0 — 패치 결과 보고서

> 작업일: 2026-06-23  
> 작업자: Claude Sonnet 4.6 (AI 에이전트)  
> 기준 브랜치: `main`  
> 선행 감사: [code_analysis_report.md](./code_analysis_report.md), [comprehensive_audit_report.md](./comprehensive_audit_report.md), [robustness_flexibility_report.md](./robustness_flexibility_report.md)

---

## 작업 요약

감사 보고서(2026-06-22) 기반 즉시·높음 우선순위 항목을 순서대로 수정하였습니다.  
5개 태스크, 5개 커밋으로 완료. 63개 유닛 테스트 전부 통과.

| # | 태스크 | 커밋 | 결과 |
|---|---|---|---|
| 1 | TDZ 버그 수정 | `23859ea` | ✅ 완료 |
| 2 | 보안 취약점 패치 | `23859ea` | ✅ 완료 |
| 3 | 미커밋 변경사항 커밋 정리 | `23859ea–1333eb0` (5개) | ✅ 완료 |
| 4 | 핵심 기능 vitest 테스트 추가 | `1333eb0` | ✅ 완료 (63/63 pass) |
| 5 | 결과 문서화 | 본 문서 | ✅ 완료 |

---

## 1. 보안 수정 상세 (`fix(security)` · `23859ea`)

### 1-1. getBody() TDZ ReferenceError 해소

**이전 상태:**  
`getBody` 함수가 line 195에 `const`로 정의되어 있으나, `/api/save-styles` 핸들러(line 143)에서 먼저 호출됨 → 런타임에서 `ReferenceError: Cannot access 'getBody' before initialization` 발생. **[서버에 최종 저장]** 버튼 동작 불가.

**수정 내용:**  
`getBody`, `validateStylesSchema`, `assertPathUnderDir`, `validateStyleKeyword`, `validateFilename`, `validateFormat`, `escapeHtml` 헬퍼 함수 전체를 middleware 클로저 최상단(라우트 핸들러보다 앞)으로 이동.

```typescript
// ✅ 수정 후: middleware 최상단 정의
const getBody = (): Promise<any> => { ... };           // line 109
const validateStylesSchema = (stylesObj: any) => ...;  // line 123
const assertPathUnderDir = (target, parent, param) =>  // line 150
...
// ✅ 이후 라우트 핸들러
if (url.pathname === "/api/save-styles") { await getBody(); ... }
```

---

### 1-2. 커맨드 인젝션 방어

**이전 상태:**  
`style`, `filename`, `format` 파라미터가 검증 없이 셸 명령어 문자열에 직접 삽입됨.

```typescript
// ❌ 취약 패턴
const styleFlag = style ? ` --style ${style}` : "";
cmd = `node scripts/build-guide.mjs "${tempMd}"${styleFlag}`;
```

**수정 내용:**

| 함수 | 검증 방법 |
|---|---|
| `validateStyleKeyword(style)` | `config/styles.json` 파싱 후 키 목록 화이트리스트 조회 |
| `validateFilename(filename)` | 정규식 `/^[a-zA-Z0-9가-힣_\-\s.()]{1,100}$/` |
| `validateFormat(format)` | `["html", "presentation", "pptx"]` 허용 목록 |

적용 엔드포인트: `/api/preview`, `/api/convert`, `/api/bulk-convert`, `/api/save-generate`

---

### 1-3. 경로 탈출(Path Traversal) 방어

**이전 상태:**  
`/api/bulk-convert`의 `inputDir`/`outputDir`, `/api/save-generate`의 `outputPath`가 프로젝트 루트 외부로 탈출 가능.

**수정 내용:**  
`assertPathUnderDir` 헬퍼 추가. `path.resolve()` 후 부모 디렉터리 접두사 여부를 검사.

```typescript
const assertPathUnderDir = (targetPath: string, parentDir: string, paramName: string) => {
  const resolvedTarget = path.resolve(targetPath);
  const resolvedParent = path.resolve(parentDir);
  if (!resolvedTarget.startsWith(resolvedParent + path.sep) && resolvedTarget !== resolvedParent) {
    throw new Error(`[보안] ${paramName}: 상위 디렉토리 탈출 거부 → ${resolvedTarget}`);
  }
};
```

---

## 2. 신규 기능 (`feat` · `b60a9cd`, `3c6951e`)

### 2-1. Standalone 빌드 파이프라인

| 파일 | 역할 |
|---|---|
| `standalone.html` | 단일 HTML 파일 빌드 진입점 |
| `vite.config.standalone.ts` | `viteSingleFile` 플러그인 연동 — JS/CSS 인라인 |
| `scripts/build-publish.mjs` | md_src/guides 일괄 컴파일 + 가이드 허브 포털 생성 |
| `scripts/sync-guides-index.mjs` | 가이드 목록 인덱스 자동 동기화 |

빌드 명령: `npm run build:standalone`

### 2-2. 클라이언트 사이드 컴파일러

**파일:** `src/lib/client-compiler.ts`  

백엔드(Vite API 서버) 없이 브라우저에서 직접 마크다운 → HTML 변환.  
`MarkdownCompiler` 컴포넌트가 서버 연결 실패 시 이 컴파일러로 자동 폴백.

- 지원 숏코드: `icon-grid`, `feature-grid`, `badge-grid`, `stat-grid`, `tool-list`, `workflow-flow`, `step-list`, `compare-grid`, `plan-grid`, `compare-split`, `alert-box`, `console-box/cmd-box/editor-box`
- XSS 방어: 모든 사용자 입력값 `escapeHtml()` 처리
- `FALLBACK_STYLES`: 서버에서 `styles.json`을 못 불러올 경우 사용하는 5종 기본 테마

### 2-3. WCAG 유틸리티

**파일:** `src/lib/wcag.ts`  
`getLuminance`, `getContrast`, `getWCAGRating` 순수 함수 제공.  
`VisualAdjuster` 컴포넌트의 색상 대비 검증 기능에서 사용.

---

## 3. 테스트 현황 (`test` · `1333eb0`)

**설정:** `vitest.config.ts` 신설 (`environment: node`, `include: src/__tests__/**`)

| 테스트 파일 | 대상 | 케이스 수 |
|---|---|---|
| `wcag.test.ts` | `getLuminance`, `getContrast`, `getWCAGRating` | 18 |
| `pptx-analyzer.test.ts` | `vld`, `eh`, `e2p`, `autoTo`, `palNm`, `KNOWN/KEEP` | 27 |
| `client-compiler.test.ts` | `FALLBACK_STYLES`, `clientCompileMarkdown` 전체 | 18 |
| **합계** | | **63 / 63 PASS** |

실행: `npm test`

---

## 4. Standalone 빌드 동작 검증 (`fix` · `db631f0`)

`npm run build:standalone` 실행 후 `dist/standalone.html` (약 544 kB, gzip 148 kB) 생성.  
두 모듈의 동작 가능 여부를 바이너리 검사 및 코드 분석으로 검증.

### Module 1 — PPTX 디자인 인스펙터

| 항목 | 결과 |
|---|---|
| JSZip 번들 포함 여부 | ✅ 포함 |
| `/api/` 호출 유무 | ✅ 없음 |
| **종합 판정** | **✅ 서버 없이 100% 동작** |

### Module 2 — 마크다운 가이드북 컴파일러

| 기능 | Standalone 동작 |
|---|---|
| 스타일 로드 (`/api/list-styles` 실패) | `FALLBACK_STYLES` 자동 사용 ✅ |
| 미리보기 (`/api/preview` 실패) | `clientCompileMarkdown` 자동 폴백 ✅ |
| 단일 파일 저장 — HTML/Presentation | 브라우저 직접 다운로드 폴백 ✅ |
| 단일 파일 저장 — PPTX | "PPTX 불가" 안내 토스트 후 md/html 다운로드 ✅ |
| 일괄 변환 (`/api/bulk-convert`) | "백엔드 필요" 안내 토스트 ✅ |
| 폴더 선택 (`/api/select-folder`) | "경로 직접 입력" 안내 토스트 ✅ |
| **종합 판정** | **✅ 제한 사항 명시 하에 동작** |

### 발견된 문제 및 수정 내용 (`db631f0`)

**문제 1 — 프로덕션 번들에 디버그 `console.log` 5개 포함**
- `"Main script loaded"`, `"Root element found"`, `"Mounting React app..."` 등
- `main.tsx`에서 전부 제거, `mountApp()` 함수 구조 단순화

**문제 2 — "Vite Dev Server" 배지 standalone에서도 고정 출력**
- `import.meta.env.DEV`로 조건 분기 처리
- DEV 모드 → 파란색 "Vite Dev Server" / 프로덕션 빌드 → 초록색 "Standalone"

---

## 5. 전체 커밋 이력

```
db631f0 fix: standalone 빌드 대응 — 디버그 로그 제거 및 배지 조건 처리
317acef docs: 패치 결과 보고서 추가 및 docs_index 업데이트 (2026-06-23)
1333eb0 test: wcag, client-compiler, pptx-analyzer 유닛 테스트 63개 추가
e6da6a5 docs: 감사 리포트 docs/report/로 이동 및 인덱스 업데이트
3c6951e feat: 컴포넌트 전면 개선 및 신규 기능 추가
b60a9cd feat: standalone 빌드 파이프라인 및 클라이언트 사이드 컴파일러 추가
23859ea fix(security): vite-api-plugin TDZ 버그 및 보안 취약점 3종 수정
```

---

## 6. 잔여 과제 (이번 작업 범위 외)

이전 감사 보고서에서 식별됐으나 이번 작업에서 다루지 않은 항목입니다.

| 우선순위 | 항목 | 참조 |
|---|---|---|
| 🔴 위험 | A11y — 모든 `<button>`에 `aria-label` 누락 | `comprehensive_audit_report.md §4` |
| 🔴 위험 | DevOps — CI/CD 파이프라인 미구성, 빌드 검증 없음 | `comprehensive_audit_report.md §5` |
| 🟠 높음 | `PptxInspectorSuite.tsx`의 대용량 PPTX 처리 성능 최적화 | `comprehensive_audit_report.md §2` |
| 🟠 높음 | `any` 타입 남용 → 엄격 타입 정의 필요 | `robustness_flexibility_report.md §1` |
| 🟡 중간 | `puppet`er / `playwright` 의존성 정리 (devDep 이동) | `code_analysis_report.md §3` |
| 🟡 중간 | 통합 테스트(JSZip PPTX 파이프라인) 추가 필요 | — |
