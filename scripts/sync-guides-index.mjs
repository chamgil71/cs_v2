#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { loadHubConfig, categoryMetaFor, sortByCategoryOrder } from "./hub-config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MD_SRC = path.join(ROOT, "md_src");
const DATA_FILE = path.join(ROOT, "src", "data", "guides.json");

// Ensure output directory exists
fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });

function readJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function walkMd(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkMd(full));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) out.push(full);
  }
  return out.sort((a, b) => a.localeCompare(b, "ko"));
}

function slugify(name) {
  return name
    .replace(/\.md$/i, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9가-힣._-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function mdInfo(file) {
  const raw = fs.readFileSync(file, "utf8");
  const parsed = matter(raw);
  const base = path.basename(file, ".md");
  const title = String(parsed.data.title || base).replace(/\s+/g, " ").trim();
  return {
    mdPath: path.relative(ROOT, file).replaceAll("\\", "/"),
    base,
    slug: String(parsed.data.slug || slugify(base)),
    title,
    subtitle: String(parsed.data.subtitle || "").replace(/\s+/g, " ").trim(),
    style: String(parsed.data.category || parsed.data.style || "uncategorized").trim() || "uncategorized",
    file: `${base}.html`
  };
}

// 카테고리 순서/라벨/색상은 더 이상 guides.json에 저장된 이전 상태를 보존하지 않는다 — md_src/guides/hub.config.json이
// 유일한 출처다(2026-09-02). 이렇게 해야 hub.config.json 하나만 고쳐도 이 파일과 오프라인 허브(build-guide-hub.mjs)
// 양쪽의 표시 순서가 함께 바뀐다. 개별 가이드의 slug/title/subtitle 수동 오버라이드만 기존 값을 보존한다.
function existingGuideOverrides(data) {
  const guideByFile = new Map();
  (data.categories || []).forEach((cat) => {
    (cat.guides || []).forEach((guide) => {
      guideByFile.set(String(guide.file || "").toLowerCase(), guide);
    });
  });
  return guideByFile;
}

function syncGuides() {
  const existing = readJson(DATA_FILE, { categories: [], collections: [], showcase: null });
  const hubConfig = loadHubConfig(path.join(MD_SRC, "guides"));
  const guideByFile = existingGuideOverrides(existing);
  const guideFiles = walkMd(path.join(MD_SRC, "guides"));
  const byStyle = new Map();

  for (const file of guideFiles) {
    const info = mdInfo(file);
    const existingGuide = guideByFile.get(info.file.toLowerCase());
    if (!byStyle.has(info.style)) byStyle.set(info.style, []);
    byStyle.get(info.style).push({
      slug: existingGuide?.slug || info.slug,
      title: existingGuide?.title || info.title,
      subtitle: existingGuide?.subtitle || info.subtitle,
      file: info.file,
      mdFile: info.mdPath,
      style: info.style
    });
  }

  const styleIds = sortByCategoryOrder([...byStyle.keys()], hubConfig);

  const categories = styleIds.map((style) => {
    const meta = categoryMetaFor(hubConfig, style);
    const guides = byStyle.get(style).sort((a, b) => a.title.localeCompare(b.title, "ko"))
      .map(({ style: _style, mdFile: _mdFile, ...guide }) => guide);
    return { id: style, label: meta.label, description: meta.description, color: meta.color, guides };
  });

  const collections = [];
  for (const entry of fs.readdirSync(MD_SRC, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const folderName = entry.name;
      if (folderName === "guides" || folderName === "showcase") continue;

      const current = (existing.collections || []).find((c) => c.folder === folderName);
      collections.push({
        id: current?.id || folderName,
        label: current?.label || (folderName === "vibecoding" ? "바이브코딩 & 에이전트 코딩" : `${folderName} 시리즈`),
        description: current?.description || (folderName === "vibecoding" ? "AI와 함께 코딩하는 장편 입문 가이드" : `${folderName} 가이드 컬렉션`),
        color: current?.color || (folderName === "vibecoding" ? "#0ea5e9" : "#6366f1"),
        folder: folderName,
        indexFile: current?.indexFile || "table-of-contents.html"
      });
    }
  }

  const showcasePath = path.join(MD_SRC, "showcase", "showcase.md");
  const showcase = fs.existsSync(showcasePath)
    ? {
        title: existing.showcase?.title || "숏코드 쇼케이스",
        subtitle: existing.showcase?.subtitle || "현재 지원 숏코드 문법 및 구현 예시",
        file: "showcase/showcase.html",
        pptxFile: "showcase/showcase.pptx",
        mdFile: "showcase/showcase.md"
      }
    : existing.showcase;

  const next = { categories, collections, showcase };
  fs.writeFileSync(DATA_FILE, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  console.log(`✅ synced ${path.relative(ROOT, DATA_FILE)}`);
  console.log(`   categories: ${categories.length}, guides: ${categories.reduce((n, c) => n + c.guides.length, 0)}`);
  console.log("   order: md_src/guides/hub.config.json 기준 (개별 가이드 slug/title 수동 오버라이드만 보존)");
}

syncGuides();
