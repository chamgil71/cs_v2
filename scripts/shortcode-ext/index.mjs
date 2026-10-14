/**
 * shortcode-ext/index.mjs — 기능 이름 배치 HTML 렌더러 묶음(2026-10-14, 인계서 C).
 *
 * 예전에 가장 가까운 옛 숏코드로 "근사"하던 배치(계단·기둥·게이지·회사 패턴 상자 등)를 모양 그대로 그린다.
 * 구현 ID = 기능 이름(카탈로그 impl.cs_v2.shortcode). PPTX 는 cs_v2 의 빠른 근사(impl.cs_v2.pptx_shortcode) 그대로 —
 * 정밀 PPTX 는 pptgen 몫(세 도구 역할 분담).
 * CSS 는 여기서 하나로 합쳐 shortcode-styles.mjs 의 SHORTCODE_CSS 에 들어간다(숏코드 CSS 단일 출처 유지).
 */
import * as common from "./common.mjs";
import * as grid from "./grid.mjs";
import * as process from "./process.mjs";
import * as flows from "./flows.mjs";
import * as compare from "./compare.mjs";
import * as data from "./data.mjs";
import * as text from "./text.mjs";
import * as media from "./media.mjs";
import * as native from "./native.mjs";

const MODULES = [grid, process, flows, compare, data, text, media];

/** 구현 ID(기능 이름) → (items, a, h) => HTML */
export const EXT_RENDERERS = Object.assign({}, ...MODULES.map((m) => m.renderers));

/** header 인수를 스스로 그리는 배치(공통 머리띠를 건너뜀) */
export const EXT_OWN_HEADER = new Set(MODULES.flatMap((m) => m.ownHeader || []));

/** 공용 조각(머리띠) — shortcode-render 가 기존 배치(grid.cards 등)의 header 인수에도 쓴다 */
export const headerBand = common.band;

export const EXT_CSS = [common, native, ...MODULES].map((m) => m.css).join("");
