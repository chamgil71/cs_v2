# /build-guide — 숏코드 MD → HTML + PPTX 빌드

숏코드가 적용된 마크다운 파일을 HTML 가이드와 PPTX 파일로 변환합니다.

**사용법**: `/build-guide <파일경로> [--html-only | --pptx-only]`  
예: `/build-guide md_src/guides/MyGuide.md`  
예: `/build-guide md_src/showcase/showcase.md --html-only`

---

## 에이전트 지시문

대상 파일: `$ARGUMENTS`

### 1단계: 인수 파싱

`$ARGUMENTS`에서 다음을 추출합니다:

- **파일경로**: 첫 번째 인수 (필수)
- **`--html-only`**: HTML만 빌드
- **`--pptx-only`**: PPTX만 빌드
- 플래그 없음: HTML + PPTX 둘 다 빌드

파일이 존재하지 않으면 즉시 오류를 출력하고 중단합니다.

### 2단계: 출력 경로 결정

입력: `<dir>/<name>.md`  
출력 규칙:

```
HTML  → dist/<name>.html
PPTX  → dist/<name>.pptx
```

`dist/` 디렉토리가 없으면 자동 생성됩니다.

입력 경로가 `md_src/<subdir>/` 형태이면 서브디렉토리 구조를 유지합니다:
```
md_src/guides/MyGuide.md → dist/guides/MyGuide.html
                         → dist/guides/MyGuide.pptx
```

### 3단계: 빌드 실행

#### HTML 빌드 (`--pptx-only`가 아닌 경우)

```bash
node scripts/build-guide.mjs <입력파일> --out <출력html경로>
```

빌드 성공 시: 출력 파일 경로와 파일 크기를 보고합니다.  
빌드 실패 시: 에러 메시지 전체를 출력하고 원인을 분석합니다.

#### PPTX 빌드 (`--html-only`가 아닌 경우)

```bash
node scripts/md-to-pptx.mjs <입력파일> --out <출력pptx경로>
```

빌드 성공 시: 출력 파일 경로와 파일 크기를 보고합니다.  
빌드 실패 시: 에러 메시지 전체를 출력하고 원인을 분석합니다.

### 4단계: 결과 보고

빌드 완료 후 다음 형식으로 보고합니다:

```
✅ 빌드 완료

📄 HTML  → dist/guides/MyGuide.html  (245 KB)
📊 PPTX  → dist/guides/MyGuide.pptx (1.2 MB)

⚠️ 주의: [있을 경우 경고 내용]
```

빌드 중 PPTX 전용 렌더러가 없는 숏코드(`before-after`, `network-box`, `git-flow`, `step-flow`, `level-grid`)가 사용된 경우:
> "PPTX 지원 없는 숏코드 N종이 포함되어 있어 해당 슬라이드는 PPTX에서 제외됩니다."

### 오류 처리 기준

| 오류 유형 | 조치 |
|----------|------|
| 파일 없음 | 즉시 중단, 파일 경로 확인 안내 |
| 숏코드 문법 오류 | 에러 라인 번호와 문법 수정 방법 안내 |
| 폰트 없음 (PPTX) | `config/font-aliases.json` 확인 안내 |
| 빌드 스크립트 없음 | `npm install` 후 재시도 안내 |

### 추가 옵션 안내

필요 시 다음 빌드도 안내합니다:
- **웹 슬라이드**: `node scripts/build-presentation.mjs <파일> --out dist/<이름>_slides.html`
- **스탠드얼론 앱 빌드**: `npm run build:standalone` (dist/ 에 독립 HTML 3종 생성)
