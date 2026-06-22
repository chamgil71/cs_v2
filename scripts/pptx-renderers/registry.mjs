/**
 * registry.mjs
 * PPTX 숏코드 렌더러 레지스트리 및 공통 헬퍼 주입
 */

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
      if (lower === "main" || lower === "brand") return this.hexClean(pal.brand);
      if (lower === "sub" || lower === "branddark" || lower === "brand-dark") return this.hexClean(pal.brandDark);
      if (lower === "deep" || lower === "branddeep" || lower === "brand-deep") return this.hexClean(pal.brandDeep);
      if (lower === "light" || lower === "brandlight" || lower === "brand-light") return this.hexClean(pal.brandLight);
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
  }
};

// 2. 개별 렌더러 모듈 정적 import (21개 핵심 모듈)
import * as iconGrid from "./icon-grid.mjs";
import * as featureGrid from "./feature-grid.mjs";
import * as steps from "./steps.mjs";
import * as compareGrid from "./compare-grid.mjs";
import * as columns from "./columns.mjs";
import * as workflow from "./workflow.mjs";
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

const renderers = [
  iconGrid,
  featureGrid,
  steps,
  compareGrid,
  columns,
  workflow,
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
  takeaway
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
