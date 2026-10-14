/**
 * shortcode-styles.mjs — 숏코드 컴포넌트 CSS 정본(공유).
 * build-guide 의 컴포넌트 CSS 를 추출. var(--*) 기반으로 테마 독립.
 * 각 셸(guide/presentation/client)이 :root 변수(--card-bg, --text, --border, --size-* 등)를
 * 자기 테마/프로파일에 맞게 정의하고 이 CSS 를 포함한다.
 * 카드 배경은 var(--card-bg, #fff) — guide=라이트(#fff), presentation/client=다크.
 * 카드 서식(외곽선 굵기·색, 그림자, 둥글기, 채움, 보조 채움)은 공용 서식 세트 변수(--set-card-bg·--card-alt-bg·
 * --card-border-width·--card-border-color·--card-shadow·--card-radius, scripts/shape-set.mjs)를 먼저 읽고,
 * 없으면(template 세트) 원래 값으로 떨어진다 → 기본 출력은 예전과 같다.
 */
import { EXT_CSS } from "./shortcode-ext/index.mjs";
import { CARDS_CSS } from "./shortcode-styles/cards.mjs";
import { DIAGRAMS_CSS } from "./shortcode-styles/diagrams.mjs";
import { TABLES_CSS } from "./shortcode-styles/tables.mjs";

// 부분 CSS(200줄 규칙으로 나눔) — 예전 한 덩어리와 글자 하나까지 같은 순서로 잇는다
export const SHORTCODE_CSS = `${CARDS_CSS}${DIAGRAMS_CSS}${TABLES_CSS}  /* 기능 이름 배치(근사였던 배치의 전용 모양) + 기존 숏코드의 새 배치 인수 — scripts/shortcode-ext/* (CSS 도 여기로 합쳐 단일 출처) */
${EXT_CSS}
`;
