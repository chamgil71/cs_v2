# /audit — 전방위 코드베이스 점검 에이전트

이 명령어는 어떤 프로젝트에도 주입 가능한 **AI 코드 감사 에이전트 프롬프트**입니다.
Claude Code에서 `/audit` 로 실행하면 아래 9개 영역을 자동으로 점검하고 우선순위 보고서를 생성합니다.

---

## 에이전트 지시문

당신은 전문 코드 감사 에이전트입니다. 이 프로젝트 전체를 아래 순서대로 점검하고,
각 항목에 대해 **파일명:라인번호**, **코드 스니펫**, **심각도**, **수정 방향**을 포함한
보고서를 `docs/audit-YYYY-MM-DD.md` 파일로 작성하십시오.

심각도 기호:
- 🔴 즉시 수정 (보안·장애)
- 🟠 높음 (품질·정합성)
- 🟡 중간 (기술 부채)
- 🟢 낮음 (개선 사항)

---

## 점검 영역 1: 보안 (Security)

### 1-1. 명령어 주입 (Command Injection)
- `child_process.exec` / `execFile` / `spawn` 호출에서 사용자 입력이 직접 삽입되는가?
- 셸 메타문자(`;`, `|`, `&`, `` ` ``, `$()`)를 필터링하지 않고 명령어 문자열을 조합하는가?
- **확인법:** `grep -rn "exec\|execFile\|spawn" --include="*.ts" --include="*.js" .`

### 1-2. 경로 탈출 (Path Traversal)
- 사용자 제공 경로가 `path.join()` 전후에 프로젝트 루트 안에 있는지 검증하는가?
- `path.isAbsolute()` 를 사용하는 경우 절대 경로 우회를 막고 있는가?
- `../../` 시퀀스를 적절히 차단하는가?
- **수정 패턴:** `resolvedPath.startsWith(rootDir + path.sep)` 검사 필수

### 1-3. XSS (Cross-Site Scripting)
- 서버가 동적으로 HTML을 생성할 때 사용자 제공 문자열이 이스케이프 없이 삽입되는가?
- `innerHTML` / 템플릿 리터럴 HTML 조합 / `dangerouslySetInnerHTML` 사용처 확인
- **확인법:** `grep -rn "innerHTML\|dangerouslySetInner\|\${.*\.name\|\.title\|\.id}" .`

### 1-4. CSS 주입 (CSS Injection)
- 사용자 입력이 검증 없이 `style` 속성이나 `<style>` 태그에 삽입되는가?
- HEX 컬러 값이 `#?[0-9A-Fa-f]{3,8}` 정규식으로 검증되는가?

### 1-5. 로컬스토리지 안전성
- `JSON.parse(localStorage.getItem(...))` 호출이 `try/catch` 없이 사용되는가?
- 저장 데이터 스키마 검증(zod 등)이 있는가?

### 1-6. 의존성 취약점 (npm audit)
```bash
npm audit --json
```
- severity `moderate` 이상 항목을 모두 목록화
- `gray-matter` (js-yaml DoS), `esbuild` (임의 파일 읽기) 등 알려진 취약 패키지 확인

### 1-7. CORS 설정
- 커스텀 API 서버가 `Access-Control-Allow-Origin` 헤더를 명시적으로 제어하는가?
- `*` 와일드카드가 프로덕션에서도 허용되는가?

### 1-8. Content-Disposition 헤더 파일명 주입
- 다운로드 응답에 사용자 제공 파일명이 `encodeURIComponent()` 없이 삽입되는가?

---

## 점검 영역 2: 버그 & 런타임 오류

### 2-1. TDZ (Temporal Dead Zone)
- `const`/`let` 로 선언된 함수·변수가 선언 라인 이전에 호출되는가?
- **확인법:** 각 파일에서 함수 호출 라인 번호와 선언 라인 번호를 비교

### 2-2. 누락 파일 참조
- `import` / `require` / 쉘 명령어에서 참조하는 파일이 실제로 존재하는가?
- **확인법:** `grep -rn "require\|import\|exec.*\.mjs\|exec.*\.js" . | xargs -I{} ...`

### 2-3. 비동기 오류 처리
- `async/await` 블록에 `try/catch` 가 있는가?
- Promise rejection이 `.catch()` 없이 unhandled로 남는 케이스가 있는가?

### 2-4. React ErrorBoundary
- 최상위 또는 주요 기능 컴포넌트에 ErrorBoundary가 감싸져 있는가?
- 없다면 런타임 오류 시 전체 화면이 빈 화면이 된다.

### 2-5. useEffect 의존성 배열
- `useEffect` 의 deps 배열이 내부에서 사용하는 모든 변수를 포함하는가?
- `eslint-plugin-react-hooks/exhaustive-deps` 규칙 위반 여부 확인

---

## 점검 영역 3: 하드코딩 & 정합성

### 3-1. 기관·프로젝트 고유 값 노출
- 특정 기관명, 프로젝트명, 내부 색상 팔레트가 범용 유틸리티 코드 안에 박혀 있는가?
- **확인법:** 조직명·내부 코드를 키워드로 grep

### 3-2. 중복 상수
- 슬라이드 크기(너비/높이), 포트 번호, 기본 색상 등이 여러 파일에 중복 선언되는가?
- 단일 config 파일 또는 shared module로 분리되었는가?

### 3-3. 프리셋 불일치
- UI 드롭다운에 노출되는 프리셋 개수와 실제 `config/*.json` 의 항목 수가 다른가?

### 3-4. 삭제 방지 로직 하드코딩
- 특정 키/이름을 `if (key === "foo" || key === "bar")` 방식으로 보호하는가?
- config 파일의 `locked: true` 플래그 방식으로 전환 가능한가?

---

## 점검 영역 4: 성능

### 4-1. React 메모이제이션
- 큰 컴포넌트(500줄 이상)에 `React.memo`, `useMemo`, `useCallback` 이 전혀 없는가?
- 부모 리렌더 시 자식 전체가 재계산되는가?

### 4-2. 이미지·에셋 최적화
- 번들에 포함된 이미지가 WebP/AVIF로 압축되었는가?
- `import` 로 정적 로드 vs `<img>` lazy loading 여부

### 4-3. 번들 크기
```bash
npm run build 2>&1 | grep -E "dist|kB|MB"
```
- 단일 청크가 500 kB를 초과하는가?
- 동적 `import()` 로 코드 스플리팅이 적용되었는가?

### 4-4. 대용량 단일 함수
- 300줄 이상의 단일 함수가 있는가? (파싱·렌더링 함수는 성능 병목이 될 수 있음)

---

## 점검 영역 5: 유지보수성

### 5-1. TypeScript 엄격 모드
- `tsconfig.json` 에서 `"strict": false`, `"noImplicitAny": false`, `"strictNullChecks": false` 여부

### 5-2. 함수 중복
- 동일한 유틸 함수(`getLuminance`, `getContrast`, `parseShortcode` 등)가 여러 파일에 복사되어 있는가?
- shared 모듈 또는 `src/lib/` 로 추출 여부

### 5-3. 데드코드
- 어디서도 `import` 되지 않는 컴포넌트·스크립트가 있는가?
- `export` 되지만 외부 참조가 없는 함수

### 5-4. ESLint 설정
- `.eslintrc.*` 또는 `eslint.config.*` 파일이 실제로 존재하는가?
- `package.json` 의 `lint` 스크립트가 실행 가능한가?

### 5-5. 테스트 커버리지
- 테스트 파일(`*.test.ts`, `*.spec.ts`)이 존재하는가?
- 핵심 유틸 함수에 단위 테스트가 있는가?

---

## 점검 영역 6: 접근성 (A11y)

### 6-1. 시맨틱 HTML
- 버튼이 `<button>` 태그인가 vs `<div onClick>`인가?
- 제목 계층(`h1`→`h2`→`h3`)이 순서대로 사용되는가?

### 6-2. ARIA 속성
- 아이콘 전용 버튼에 `aria-label` 이 있는가?
- 동적으로 업데이트되는 영역에 `aria-live` 가 있는가?
- 모달/다이얼로그에 `role="dialog"`, `aria-modal="true"` 가 있는가?

### 6-3. 키보드 내비게이션
- 모든 인터랙티브 요소에 탭 포커스가 가능한가?
- 포커스 링(`outline`)이 CSS로 제거되지 않았는가?

### 6-4. 색상 대비
- 텍스트와 배경 색상의 WCAG AA 대비율(4.5:1 이상)을 만족하는가?
- **자동 도구:** `npx axe-cli <url>` 또는 Chrome DevTools > Lighthouse > Accessibility

---

## 점검 영역 7: 운영성 (DevOps)

### 7-1. CI/CD 파이프라인
- `.github/workflows/` 또는 동등 CI 설정이 존재하는가?
- PR 머지 전 자동 lint·build·test가 실행되는가?

### 7-2. 환경 변수
- 포트 번호, API 키, 경로 등이 `.env` 파일로 분리되어 있는가?
- `.env.example` 파일이 있는가?
- `.gitignore` 에 `.env` 가 포함되어 있는가?

### 7-3. 빌드 재현성
- `package-lock.json` 또는 `pnpm-lock.yaml` 이 커밋되어 있는가?
- 동일 환경에서 재실행 시 동일 결과가 나오는가?

### 7-4. 로깅 전략
- 프로덕션 코드에 `console.log` 가 디버그용으로 남아 있는가?
- 구조화된 로거(pino, winston 등) 사용 여부

---

## 점검 영역 8: 데이터 무결성

### 8-1. API 입력 유효성 검사
- API 엔드포인트가 수신 payload 스키마를 검증하는가? (zod, joi, ajv 등)
- 필수 필드 누락 시 적절한 400 오류를 반환하는가?

### 8-2. 파일 쓰기 원자성
- 설정 파일 저장 시 `write-then-rename` 패턴을 사용하는가?
- 저장 도중 프로세스가 중단되면 파일이 손상되는가?

### 8-3. 직렬화 안전성
- `JSON.parse()` 호출에 `try/catch` 가 있는가?
- `JSON.stringify()` 에 순환 참조 가능성이 있는가?

---

## 점검 영역 9: 법적 준수 & 문서화

### 9-1. 라이선스
- `package.json` 의 모든 의존성 라이선스가 상업 이용 가능한가?
- GPL 계열 라이선스가 있는 경우 소스 공개 의무가 있는가?
- **확인법:** `npx license-checker --summary`

### 9-2. 개인정보
- 사용자 데이터가 외부 서버에 전송되는가?
- `localStorage` / `sessionStorage` 에 개인정보가 저장되는가?
- 쿠키를 사용하는 경우 동의 배너가 있는가?

### 9-3. README & 온보딩
- README 에 설치→실행→빌드 명령어가 기술되어 있는가?
- 신규 개발자가 README 만으로 로컬 환경을 구성할 수 있는가?

---

## 보고서 출력 형식

점검 완료 후 아래 형식으로 `docs/audit-YYYY-MM-DD.md` 를 작성하십시오:

```markdown
# 코드베이스 감사 보고서 — YYYY-MM-DD

## 요약 대시보드

| 영역 | 등급 | 즉시 수정 | 높음 | 중간 | 낮음 |
|---|:---:|:---:|:---:|:---:|:---:|
| 보안 | 🔴/🟠/🟡/🟢 | N | N | N | N |
| ... | | | | | |

## 상세 발견 항목

### 🔴 [파일명:라인번호] 제목

**문제:** 설명  
**코드:**  
```코드 스니펫```  
**수정 방향:** 설명

...

## 우선순위 행동 목록

- [ ] 🔴 ...
- [ ] 🟠 ...
```

---

## 이 파일 사용 방법

1. 이 파일(`.claude/commands/audit.md`)을 점검할 프로젝트의 동일 경로에 복사
2. Claude Code 터미널에서 `/audit` 입력
3. 에이전트가 프로젝트 전체를 자동 점검하고 `docs/audit-YYYY-MM-DD.md` 생성
