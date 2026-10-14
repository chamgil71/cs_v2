/**
 * registry.mjs
 * PPTX 숏코드 렌더러 레지스트리 및 공통 헬퍼 주입
 */

import { colorToken } from "../library-names.mjs";

// 1. 공통 유틸리티 헬퍼 정의
export const helpers = {
  splitMeta(meta) {
    if (!meta) return [];
    return String(meta)
      .split(/[|\n]/)
      .map(s => s.trim().replace(/^["']|["']$/g, "").trim())
      .filter(Boolean);
  },

  hexClean(hex, pal) {
    if (!hex) return null;
    const lower = (hex + "").trim().toLowerCase();
    if (pal) {
      // 색 이름 → 팔레트 키: 공용 카탈로그 color_tokens (HTML·pptgen 과 같은 이름)
      const key = colorToken(lower, "cs_v2_pptx");
      if (key && pal[key]) return this.hexClean(pal[key]);
      if (lower === "border") return this.hexClean(pal.border);
    }
    hex = (hex + "").replace(/^["']|["']$/g, "").replace(/^#/, "");
    if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
    return hex.length >= 6 ? hex.slice(0, 6).toUpperCase() : null;
  },

  stripMd(text) {
    return (text || "")
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/`(.+?)`/g, "$1")
      .replace(/\[(.+?)\]\(.+?\)/g, "$1")
      .replace(/~~(.+?)~~/g, "$1")
      .replace(/\s+/g, " ")
      .trim();
  },

  estimateLines(text, widthInch, fontSize) {
    const charsPerLine = Math.max(8, Math.floor(widthInch * 68 / (fontSize * 0.55)));
    return Math.max(1, Math.ceil((text || "").length / charsPerLine));
  },

  parseArg(args, key, defaultValue) {
    if (!args) return defaultValue;
    const match = String(args).match(new RegExp(`\\b${key}\\s*=\\s*["']?([^\\s"']+)["']?`));
    return match ? match[1] : defaultValue;
  },

  // 카드 서식 — 공용 서식 세트(pal.shape, scripts/shape-set.mjs)를 반영한 roundRect 옵션 묶음.
  //   template 세트(기본)이면 렌더러의 원래 서식(흰 채움 + 테두리 pptdesign card.borderWidth, 그림자 없음) 그대로 → 기존 출력과 같다.
  //   alt=true 면 채움만 서식 세트의 보조 카드색(블록 인수 bg=alt). 색 강조(it.color) 카드는 호출하는 쪽이 자기 서식을 쓴다.
  cardBox(pal, { alt = false, radius } = {}) {
    const s = pal && pal.shape;
    const fill = { color: alt && s ? s.altFill : (s && !s.inherit ? s.fill : pal.white) };
    if (!s || s.inherit) return { rectRadius: radius, fill, line: { ...((s && s.line) || { color: pal.border }) } };
    return { rectRadius: s.radius ?? radius, fill, line: { ...s.line }, ...(s.shadow ? { shadow: { ...s.shadow } } : {}) };
  },

  // 보조 카드색인가 — 블록 인수 bg=alt, 또는 그 항목 tag: alt(파서가 _alt 로 표시 — library-names.mjs markAltItems)
  isAltBlock(item, it) {
    return !!(it && it._alt) || /(?:^|\s)bg=["']?alt\b/.test(String((item && item.args) || ""));
  },

  // 연결선 전용 안전 그리기 — slide.addShape("line", {w, h, ...})에 음수 w/h를 그대로 넘기면
  // PowerPoint가 파일을 손상(E_FAIL)으로 처리한다(LibreOffice·validate.py로는 감지 불가).
  // 대각선 방향은 좌표를 정규화한 뒤 flipH/flipV로 표현해야 한다. 모든 렌더러는 좌표 차분으로
  // 만든 w/h를 slide.addShape("line", ...)에 직접 넘기지 말고 반드시 이 함수를 거칠 것.
  addSafeLine(slide, opts) {
    const { x, y, w, h, line, ...rest } = opts;
    const flipH = w < 0, flipV = h < 0;
    slide.addShape("line", {
      x: flipH ? x + w : x,
      y: flipV ? y + h : y,
      w: Math.abs(w),
      h: Math.abs(h),
      flipH,
      flipV,
      line,
      ...rest,
    });
  }
};

// 2. 개별 렌더러 모듈 정적 import
//    - workflow.mjs 제거: flow.mjs 가 workflow-flow/workflow-strip 타입도 처리
//    - compare-grid.mjs: compare-grid 타입은 columns.mjs로 이전. level-grid/part-banner/part-deck 담당
import * as iconGrid from "./icon-grid.mjs";
import * as featureGrid from "./feature-grid.mjs";
import * as steps from "./steps.mjs";
import * as columns from "./columns.mjs";
import * as toolList from "./tool-list.mjs";
import * as planGrid from "./plan-grid.mjs";
import * as summaryBox from "./summary-box.mjs";
import * as compareSplit from "./compare-split.mjs";
import * as alertBox from "./alert-box.mjs";
import * as faqList from "./faq-list.mjs";
import * as consoleBox from "./console-box.mjs";
import * as cmdBox from "./cmd-box.mjs";
import * as tabs from "./tabs.mjs";
import * as statGrid from "./stat-grid.mjs";
import * as gitFlow from "./git-flow.mjs";
import * as editorBox from "./editor-box.mjs";
import * as networkBox from "./network-box.mjs";
import * as flow from "./flow.mjs";
import * as takeaway from "./takeaway.mjs";
import * as compareGrid from "./compare-grid.mjs";
import * as venn from "./venn.mjs";
import * as quadrantChart from "./quadrant-chart.mjs";
import * as concentricRings from "./concentric-rings.mjs";

const renderers = [
  iconGrid,
  featureGrid,
  steps,
  columns,
  toolList,
  planGrid,
  summaryBox,
  compareSplit,
  alertBox,
  faqList,
  consoleBox,
  cmdBox,
  tabs,
  statGrid,
  gitFlow,
  editorBox,
  networkBox,
  flow,
  takeaway,
  compareGrid,
  venn,
  quadrantChart,
  concentricRings
];

// 3. 타입 맵핑 테이블 생성
const registryMap = new Map();

for (const module of renderers) {
  if (Array.isArray(module.type)) {
    for (const t of module.type) {
      registryMap.set(t, module);
    }
  } else if (typeof module.type === "string") {
    registryMap.set(module.type, module);
  }
}

export const pptxRegistry = {
  get(type) {
    return registryMap.get(type) || null;
  },
  has(type) {
    return registryMap.has(type);
  }
};
