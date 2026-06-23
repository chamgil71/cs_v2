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

---

## 7. 후속 패치 (2차) — 감사 잔여 3건 처리

> 작업일: 2026-06-23 (2차)  
> 검토 결과 미처리로 확인된 감사 항목 3건을 추가 처리하였습니다.

### 7-1. 🟠 ESLint 설정 파일 생성 (감사 5-4)

`package.json`에 `"lint": "eslint ."` 스크립트는 있었으나 ESLint 9 flat config 파일(`eslint.config.js`)이 없어 `npm run lint` 실행이 불가능했습니다.

- `eslint.config.js` 신규 작성 (이미 설치된 `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` 활용)
- 점진적 도입을 위해 `no-explicit-any`/미사용 변수는 경고로 완화, 정리용 빈 `catch`는 허용(`allowEmptyCatch`)
- shadcn/ui 생성 컴포넌트(`src/components/ui/**`)와 설정 파일은 템플릿 보일러플레이트 규칙 완화
- `--fix`로 자동 교정 가능한 `let`→`const` 3건 적용 (`client-compiler.ts`, `vite-api-plugin.ts`)
- **결과:** `npm run lint` → **0 errors** (51 warnings, 점진적 정리 대상), exit 0

### 7-2. 🟠 React ErrorBoundary 추가 (감사 3-3-1)

런타임 예외 발생 시 React가 전체 트리를 언마운트하여 **빈 화면**이 되는 문제를 해소했습니다.

- `src/components/ErrorBoundary.tsx` 신규 작성 — **외부 의존성 없이** React 표준 API(`getDerivedStateFromError`/`componentDidCatch`)로 구현
- `aria-live="assertive"` + `role="alert"` 복구 UI(다시 시도 / 새로고침) 제공
- `main.tsx`에서 3개 핵심 도구(인스펙터·컴파일러·배색 빌더)를 **개별 경계로 래핑** → 한 탭이 죽어도 나머지 도구는 정상 동작
- **결과:** `tsc --noEmit` 통과, 빌드 정상

### 7-3. 🟠 npm 의존성 취약점 (감사 1-9) — 위험 수용 결정

`npm audit fix`(비파괴) 실행 결과 **자동 수정 가능한 항목 없음**. 남은 3건은 모두 `--force`(주요 버전 후퇴)로만 해소됩니다.

| 패키지 | 심각도 | 조치 | 사유 |
|---|:---:|---|---|
| `gray-matter` → `js-yaml` | 🟠 MODERATE | **보류** | 유일한 픽스가 `gray-matter@2.0.1`로의 **다운그레이드**. 현재 4.0.3을 4개 빌드 스크립트(`build-guide`, `md-to-pptx`, `build-presentation`, `sync-guides-index`)가 의존 → frontmatter 파싱 파이프라인 파괴. js-yaml DoS는 **악의적으로 조작된 YAML 머지 키**가 필요하나, `.md` 입력은 프로젝트 소유자가 로컬에서 직접 저작 → 실제 악용 가능성 ≈ 0 |
| `esbuild` | 🟢 LOW | **보류** | "Windows 개발 서버에서 임의 파일 읽기"로 **개발 의존성·개발 서버 한정**. 배포 산출물에 미포함. 픽스는 vite/vitest 메이저 변경 유발 |

**결정:** 스캐너 통과만을 위해 빌드를 깨뜨리는 강제 다운그레이드 대신, 위 사유로 **잔여 위험을 문서화하여 수용**. 향후 `gray-matter` 상위 호환 픽스 릴리스 시 재평가.

### 7-4. 후속 검증 요약

| 검증 | 결과 |
|---|:---:|
| `npx vitest run` | ✅ 63/63 통과 |
| `npm run lint` | ✅ 0 errors |
| `npx tsc --noEmit` | ✅ 통과 |
| `vite build` (일반) | ✅ 472 KB (gzip 135 KB) |
| `vite build` (standalone) | ✅ 단일 파일 빌드 정상 |

---

## 8. 모듈 분리 standalone 패키징 (3차)

> 작업일: 2026-06-23 (3차)  
> 요청: `build:standalone` 산출물의 서버리스 동작 검증 + 모듈 1·2를 각각 별도 HTML로 분리

### 8-1. 서버리스 동작 검증

`dist/standalone.html`을 **네트워크를 전부 차단한 file:// 환경**(puppeteer headless)에서 로드하여 검증:

- React 마운트 성공(root 17KB 렌더), 모듈 1·2 모두 표시, **치명 콘솔/페이지 에러 0건**
- 외부 의존성은 Google Fonts(`fonts.googleapis.com`) 1건뿐 — 오프라인 시 시스템 폰트로 자동 폴백, 기능 영향 없음
- JS/CSS는 `vite-plugin-singlefile`로 전량 인라인됨

### 8-2. 모듈 1·2 분리 빌드

`vite-plugin-singlefile`은 코드 스플리팅을 끄므로 다중 입력을 지원하지 않는다. 따라서 엔트리를 환경변수(`SA_ENTRY`)로 선택해 **순차 빌드 후 dist에 누적**하는 구조로 전환.

| 산출물 | 내용 | 크기 | 서버 의존 |
|---|---|---:|---|
| `dist/standalone.html` | 모듈 1 + 2 통합 (탭 전환) | 548 KB | 없음 |
| `dist/module1.html` | **모듈 1** — PPTX 디자인 인스펙터 | 415 KB | 없음 (완전 서버리스) |
| `dist/module2.html` | **모듈 2** — 가이드북 컴파일러 & 배색 빌더 | 357 KB | 없음 (클라이언트 컴파일 폴백) |

- 신규: `src/standalone/module1-main.tsx`, `module2-main.tsx`, `module1.html`, `module2.html`, `scripts/build-standalone.mjs`
- 트리 셰이킹으로 각 모듈은 필요한 라이브러리만 포함 (모듈 1은 JSZip/pptxgenjs/html2canvas 포함으로 더 큼)
- `npm run build:standalone` 한 번으로 3종 모두 생성

### 8-3. 모듈 2의 서버리스 개선

`file://` 환경(`window.location.protocol === 'file:'`)을 감지하여 백엔드 API 호출을 생략하도록 `MarkdownCompiler`·`VisualAdjuster` 개선:

- 마운트 시 `list-styles`/`list-files` 호출 생략 → 내장 `FALLBACK_STYLES` 즉시 사용
- 미리보기는 API 시도 없이 `clientCompileMarkdown`으로 직접 생성
- 서버 전용 기능(styles.json 디스크 저장)은 안내 토스트 후 비활성화
- **결과:** 분리 전 발생하던 마운트 시 CORS/fetch 에러 → **0건**으로 제거

### 8-4. 검증 요약 (puppeteer headless, 네트워크 차단)

| 산출물 | 마운트 | 모듈 격리 | 치명 에러 |
|---|:---:|:---:|:---:|
| `module1.html` | ✅ | ✅ 컴파일러 미포함 | 0건 |
| `module2.html` (작성 탭) | ✅ | — | 0건 |
| `module2.html` (배색 빌더 탭) | ✅ | — | 0건 |
| `standalone.html` (통합) | ✅ | — | 0건 |
