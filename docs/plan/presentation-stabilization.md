# 프레젠테이션/미리보기 안정화 — 되돌리기 결정 및 이후 일관 작업 계획

> 작성일: 2026-06-25
> 결정: **Option 1 (안정화 우선 되돌리기)** 채택. 일관된 통합(옛 CSS 제거)은 안정화 후 재추진.

---

## 1. 배경 — 무엇이 깨졌나

Phase 3(숏코드 단일화)에서 `build-presentation.mjs`와 `client-compiler.ts`(presentation·preview)를 **공유 렌더러(`shortcode-render.mjs`) + 공유 CSS(`shortcode-styles.mjs`)** 로 전환하면서, 공유 CSS를 기존 컴포넌트 CSS 위에 **append** 하는 방식을 썼다. 그 결과 회귀 발생:

- **라이트모드 흰글자**: 공유 렌더러가 emit 하는 클래스 중 프레젠테이션의 `body.light-mode` 오버라이드 "목록"에 없던 것(`.fs-title`, `.level-name`, `.ci-text strong` 등)이 `#fff` 하드코딩으로 남아 흰배경에 흰글자.
- **상하 여백·하단 잘림**: 공유 CSS(가이드용 큰 margin)가 슬라이드 컴포넌트에 덮여 콘텐츠가 길어져 16:9 프레임에서 잘림.
- **도형 서식 깨짐**: 공유 렌더러의 HTML 구조 ↔ 기존 프레젠테이션 CSS 불일치(예: "커넥터 활용 예시" 도형).
- **16:9 미리보기 깨짐**: 위 콘텐츠 회귀가 축소(scale-to-fit) 미리보기에 그대로 반영.

근본 원인: **기존 (자체 렌더러 ↔ 자체 CSS) 짝**과 **(공유 렌더러 ↔ 공유 CSS) 짝**을 섞고, 옛 CSS를 제거하지 않은 채 append 한 것. 옛 CSS는 다크-우선 설계 + class별 light-mode 땜질로 되어 있어 공유 CSS와 충돌.

---

## 2. 결정 (2026-06-25)

| 대상 | 조치 |
|------|------|
| `scripts/build-presentation.mjs` | **aa45901(Phase 3 직전)로 전체 복원.** 자체 `renderShortcode` + 자체 CSS + light-mode 오버라이드 40개 완비 |
| `src/lib/client-compiler.ts` | **외과적 복원** — `renderClientShortcode` 호출 복귀, `${SHORTCODE_CSS}` append 2곳 제거, 공유 모듈 import 제거. (htmlSize config 주입은 유지) |
| `scripts/build-guide.mjs` | **그대로 유지** — 공유 모듈 사용(검증된 정상). 가이드 HTML 은 정상 |
| `shortcode-render.mjs` / `shortcode-styles.mjs` | **유지** (build-guide 가 사용). 추후 통합 재추진의 자산 |
| PPTX config 작업(Phase 1·2), 모듈1 작업 | 영향 없음, 유지 |

### 복원의 대가(수용)
- 프레젠테이션에서 `before-after`·`os-tabs` 미지원으로 복귀(드물게 사용). client 는 자체 렌더러가 before-after/network-box/os-tabs 보유하므로 영향 없음.
- 가이드 ↔ 프레젠테이션 렌더러 **드리프트 재발**(의도적, 한시적).
- 정합성 테스트의 client 가드는 "자체 렌더러가 비어있지 않은 출력 생성" 수준으로 완화(공유 일치 검증 아님). console-box 테스트는 client 자체 출력(`#0F172A`) 기준으로 환원.

---

## 3. 이후 일관 작업 (안정화 후 재추진)

**목표: 프레젠테이션·client 도 공유 렌더러+공유 CSS 로 완전 통합 — 단, 옛 CSS를 제거하는 방식으로.**

1. 프레젠테이션/client 의 **기존 컴포넌트 CSS를 제거**하고 `SHORTCODE_CSS` 만 사용(append 가 아니라 대체).
2. `SHORTCODE_CSS`(가이드 출신, 라이트 기준)를 **다크/라이트 양 테마에서 검증** — 카드 배경 `var(--card-bg)`, 텍스트 `var(--text)` 가 양 테마에서 올바른지.
3. 슬라이드용 **여백/크기 프로파일**을 `htmldesign.config.json htmlSize.presentation` 으로 제어(가이드 여백이 슬라이드에 그대로 들어가지 않게).
4. 미리보기(16:9)는 **scale-to-fit 축소 표시**가 정상 동작임을 기준으로 회귀 검증.
5. 통합 후 정합성 테스트의 client 가드를 공유-일치 검증으로 복원.

> 핵심 교훈: 공유 CSS는 **append 가 아니라 기존 CSS 대체(제거 후 단일화)** 로 적용해야 한다. 두 CSS 체계 공존은 충돌을 부른다.

---

## 4. 현재 상태 (복원 후)
- 전체 테스트 **158건 통과**.
- 가이드 HTML: 공유 모듈(정상). 프레젠테이션 HTML·standalone·preview: 자체 렌더러(복원, 정상).
- 별개 확인 필요: **PPTX 글자 깨짐(폰트)** — 본 되돌리기와 무관. 확인 결과 PPTX 폰트명은 한글 페이퍼로지("페이퍼로지 4/6/8")로 **정상 해석**됨 → 깨짐은 **보는 PC 의 페이퍼로지 미설치**(대체 폰트 치환)이 원인. 해결: 폰트 설치 또는 공통폰트 스타일(pretendard/malgun) 사용.

## 5. ★ standalone(client) vs server(CLI) 프레젠테이션 출력 점검 결과 (2026-06-25)

`clientCompileMarkdown(presentation)` (standalone 브라우저 경로) 과 `build-presentation.mjs` (server/CLI 경로) 를 같은 `showcase.md` 로 생성·대조:

| 항목 | client (standalone) | CLI (server) |
|------|:---:|:---:|
| **슬라이드 수** | **4** | **40** |
| 컴포넌트 렌더 | **인라인 style 위주** (style= 294) | **CSS 클래스 위주** (style= 195) |
| 컴포넌트 클래스 | 거의 없음 | icon-grid/feature-card/… 전체 |

**결론: 둘은 동일하지 않다. 차이가 크다(슬라이드 10배 차이).**

원인: standalone(`client-compiler.ts`)과 server(`build-presentation.mjs`)는 **숏코드 렌더러뿐 아니라 슬라이드 분할·페이지 생성 전체가 별개 구현**이다. (둘 다 h1→cover/h2→content/hr→break 로직이지만, client 는 숏코드를 HTML 로 먼저 치환 후 재토큰화하는 과정에서 HTML 블록이 후속 heading 을 흡수해 분할이 거의 안 됨 — 4슬라이드로 뭉침.)

> 이 standalone↔server 불일치는 **Phase 3 통합이 노렸던 핵심 문제**이며, 숏코드 렌더러만 통합해서는 해결 안 됨(슬라이드 분할·CSS·페이지 생성까지 통합 필요). 안정화 후 일관 작업(§3)에 **"프레젠테이션 페이지 생성 파이프라인 자체의 단일화"** 를 포함한다.

### HTML(가이드) 모드도 동일하게 분기
- server = `build-guide.mjs`(공유 렌더러), standalone = `client-compiler.ts`(자체 렌더러) → 숏코드 출력이 클래스 vs 인라인으로 다름.
