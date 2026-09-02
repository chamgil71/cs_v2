#!/usr/bin/env node
/**
 * hub-config.mjs
 * <폴더>/hub.config.json 로더 — 카테고리 라벨·설명·색상·표시 순서, 사이드바 기본 상태,
 * 폴더 빌드 시 기본으로 만들 산출물(onepage/presentation-bundle) 옵션의 단일 출처.
 * "폴더마다 다른 카테고리 체계를 가질 수 있다" + "설정은 JSON, 코드에 안 박는다"(CLAUDE.md 규칙 1)를
 * 만족시키기 위해 scripts/guide-categories.mjs(전역 JS 상수)를 대체한다.
 *
 * hub.config.json이 없는 폴더는 안전한 기본값(카테고리 없음 → id를 그대로 라벨로 사용,
 * 사이드바 항상 열림, onepage/presentation-bundle 기본 off)으로 동작한다 — 즉 이 파일을
 * 새로 안 만들어도 build-guide-hub.mjs/build-folder.mjs는 기존처럼 동작한다.
 *
 * 모든 함수는 폴더의 "절대 경로 1개"만 받는다(md_src 하위 폴더든, 사용자가 고른 임의 경로든 동일하게
 * 다룰 수 있도록) — 폴더명을 md_src 밑에서 찾는 조립은 호출하는 쪽(build-folder.mjs 등)의 책임이다.
 */
import fs from "node:fs";
import path from "node:path";

const DEFAULT_CONFIG = {
  categories: { order: [], meta: {} },
  sidebar: { defaultOpen: true },
  outputs: { onepage: false, presentationBundle: false },
};

function loadJsonWithComments(filePath) {
  const src = fs.readFileSync(filePath, "utf8").replace(/\/\/[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
  return JSON.parse(src);
}

/**
 * dirArg("guides" 같은 짧은 이름, 또는 절대/상대 경로)를 실제 소스 폴더 절대경로로 해석한다.
 * 경로 구분자(`/`,`\`)를 포함하거나 `.`으로 시작하거나 절대경로면 "명시적 경로"로 보고 그대로 쓰고,
 * 아니면 지금까지처럼 rootDir/md_src/<dirArg>로 취급한다 — build-folder.mjs가 md_src 밖 임의
 * 폴더(예: GUI에서 사용자가 고른 폴더)도 같은 로직으로 다루기 위한 것.
 * outBase는 파일명(예: <outBase>-onepage.html)에 쓸 짧은 이름이다.
 */
export function resolveFolderDir(rootDir, dirArg) {
  const looksLikePath = path.isAbsolute(dirArg) || dirArg.includes("/") || dirArg.includes("\\") || dirArg.startsWith(".");
  const srcDir = looksLikePath ? path.resolve(rootDir, dirArg) : path.join(rootDir, "md_src", dirArg);
  const outBase = looksLikePath ? path.basename(srcDir) : dirArg;
  return { srcDir, outBase };
}

export function hubConfigPath(folderAbsPath) {
  return path.join(folderAbsPath, "hub.config.json");
}

export function hubConfigExists(folderAbsPath) {
  return fs.existsSync(hubConfigPath(folderAbsPath));
}

/** folderAbsPath(폴더 절대경로)의 hub.config.json을 읽는다. 없으면 안전한 기본값. */
export function loadHubConfig(folderAbsPath) {
  const file = hubConfigPath(folderAbsPath);
  if (!fs.existsSync(file)) {
    return structuredClone(DEFAULT_CONFIG);
  }
  const parsed = loadJsonWithComments(file);
  return {
    categories: {
      order: Array.isArray(parsed.categories?.order) ? parsed.categories.order : [],
      meta: parsed.categories?.meta && typeof parsed.categories.meta === "object" ? parsed.categories.meta : {},
    },
    sidebar: { defaultOpen: parsed.sidebar?.defaultOpen ?? true },
    outputs: {
      onepage: parsed.outputs?.onepage ?? false,
      presentationBundle: parsed.outputs?.presentationBundle ?? false,
    },
  };
}

/** 카테고리 id에 대한 표시 메타(라벨/설명/색상). 설정에 없으면 id를 라벨로 쓰는 안전한 폴백. */
export function categoryMetaFor(hubConfig, styleId) {
  return hubConfig.categories.meta[styleId] || { label: styleId, description: "", color: "#64748b" };
}

/** hubConfig.categories.order 기준으로 카테고리 id 배열을 정렬(순서 밖 항목은 뒤로, uncategorized는 항상 맨 뒤). */
export function sortByCategoryOrder(styleIds, hubConfig) {
  const order = hubConfig.categories.order;
  return [...styleIds].sort((a, b) => {
    const ao = order.indexOf(a); const bo = order.indexOf(b);
    const an = ao === -1 ? Number.MAX_SAFE_INTEGER : ao;
    const bn = bo === -1 ? Number.MAX_SAFE_INTEGER : bo;
    if (an !== bn) return an - bn;
    if (a === "uncategorized") return 1;
    if (b === "uncategorized") return -1;
    return a.localeCompare(b, "ko");
  });
}

const STARTER_PALETTE = ["#6366f1", "#10b981", "#0ea5e9", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4", "#D4A017", "#84CC16", "#475569", "#E11D48"];

/**
 * 새 폴더에 hub.config.json이 아직 없을 때 쓰는 부트스트랩.
 * 그 폴더 md 전체에서 실제로 쓰인 style id 목록(styleIds)을 받아 "라벨=id, 색은 팔레트 순환"인
 * 초안을 만들어 저장한다. 이미 파일이 있으면 절대 덮어쓰지 않는다(수동 편집 보호) — 호출 전에
 * hubConfigExists()로 먼저 확인할 것.
 */
export function writeStarterHubConfig(folderAbsPath, styleIds) {
  const order = styleIds.filter((id) => id !== "uncategorized");
  order.push("uncategorized");
  const meta = {};
  order.forEach((id, i) => {
    meta[id] = {
      label: id,
      description: "",
      color: id === "uncategorized" ? "#64748b" : STARTER_PALETTE[i % STARTER_PALETTE.length],
    };
  });
  const config = {
    categories: { order, meta },
    sidebar: { defaultOpen: true },
    outputs: { onepage: false, presentationBundle: false },
  };
  const file = hubConfigPath(folderAbsPath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  return file;
}
