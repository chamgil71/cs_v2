# AGENTS.md — cs_v2 (Creative Spark V2)

Markdown → 가이드 HTML·횡슬라이드 HTML·PPTX 변환 저작 파이프라인 + React UI (독립형 서버리스 프레임워크). 이 문서는 이 레포에서 AI 에이전트 작업의 **최상위 진입점(SSOT)**입니다.

- **적용 프로필**: `standard` — [`agent/profiles/standard.md`](./agent/profiles/standard.md)
- **오케스트레이션**: [`agent/orchestration.md`](./agent/orchestration.md)의 라우팅·의존성·롤백 규칙을 따릅니다.
- **거버넌스 엔진**: 구현/검증 패턴이 필요할 때 [`agent/knowledge/`](./agent/knowledge/)를 `view_file`로 읽어 적용합니다.

## 문서 우선순위 (CLAUDE.md 공존)

- 이 레포에는 **강한 프로젝트 전용 규칙**을 담은 [`CLAUDE.md`](./CLAUDE.md)가 이미 존재합니다(config 단일 출처·하드코딩 금지·숏코드 정본 모듈 등).
- **역할 분리**: `AGENTS.md`(본 문서)는 거버넌스·프로필·오케스트레이션 **진입점**입니다. 실제 코딩 시 **config/렌더러 관련 MUST 규칙은 [`CLAUDE.md`](./CLAUDE.md)를 최우선**으로 준수합니다. 상충 시 `CLAUDE.md` 우선.

## Facts (무엇을 만드는가)

- 사양·빌드·규칙의 1차 출처는 [`CLAUDE.md`](./CLAUDE.md), [`README.md`](./README.md), [`docs/`](./docs/)입니다.
- 세션 진행 로그는 [`docs/worklog.md`](./docs/worklog.md)에 누적합니다.

## Project Shape

- `md_src/` 원본 / `scripts/` 빌더·정본 렌더러(`shortcode-render.mjs`, `shortcode-styles.mjs`)
- `config/` — `pptdesign.config.json`, `htmldesign.config.json`, `styles.json`, `font-aliases.json` (수치·스타일 단일 출처)
- `src/`, `index.html`, `standalone.html`, `module1/2.html` — React UI 및 독립 실행 셸

### 프론트엔드 기술 스택

React 18 + `react-router-dom` + Vite + Tailwind CSS 3.x + shadcn/ui(Radix) 조합입니다([`CLAUDE.md`](./CLAUDE.md) 상세 참조).
> ⚠️ 워크스페이스 신규 표준 체인(React → TanStack Start → Vite → Tailwind CSS → shadcn/ui)은 아직 도입되지 않았습니다. 라우터 교체는 별도 승인 후에만 진행합니다.

## Local Rules

- 수치·데이터를 코드에 직접 박지 않습니다. `config/`에 키를 추가하고 코드는 그 키를 읽습니다(캐스케이드 우선순위는 [`CLAUDE.md`](./CLAUDE.md)).
- 숏코드 렌더러/스타일/가이드는 정본 단일 모듈만 사용하고 셸별 중복 작성 금지.
- TypeScript strict, React 18+ 함수형 컴포넌트 준수. 단일 파일 200라인 초과 시 분리.

## Verification

```bash
npm install
npm run test        # vitest
npm run build       # Vite 번들
```

실행 불가 시 정확한 사유를 보고합니다.
