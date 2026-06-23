#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MD_SRC = path.join(ROOT, "md_src");
const DATA_FILE = path.join(ROOT, "src", "data", "guides.json");
const STYLES_FILE = path.join(ROOT, "config", "styles.json");

// Ensure output directory exists
fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });

const STYLE_META = {
  "ai-chat": { label: "AI 챗봇 & 어시스턴트", description: "범용 AI 어시스턴트로 생각하고, 쓰고, 검색하기", colorVar: "--cat-chat", color: "#6366f1" },
  "ai-dev": { label: "AI 개발 도구", description: "AI가 코드를 쓰고 완성하는 개발 환경", colorVar: "--cat-dev", color: "#10b981" },
  "webdev": { label: "개발 & 배포 플랫폼", description: "앱을 만들고, 배포하고, 운영하는 클라우드 생태계", colorVar: "--cat-webdev", color: "#0ea5e9" },
  "knowledge": { label: "노트 & 지식 관리", description: "정보를 모으고 연결해 두 번째 뇌 만들기", colorVar: "--cat-knowledge", color: "#f59e0b" },
  "productivity": { label: "생산성 유틸리티", description: "PC 사용을 빠르게 만드는 필수 도구", colorVar: "--cat-prod", color: "#ec4899" },
  "creative": { label: "크리에이티브 AI", description: "이미지 · 영상 · 디자인을 AI로 만들기", colorVar: "--cat-creative", color: "#8b5cf6" },
  "security": { label: "보안 & 인프라", description: "보안, 네트워크, 인프라 운영 가이드", colorVar: "--cat-security", color: "#06b6d4" },
  "finance": { label: "재테크 & 금융", description: "금융·재테크 도구와 워크플로우", colorVar: "--cat-finance", color: "#D4A017" },
  "future": { label: "퓨처 AI", description: "새로운 AI 실험과 미래형 도구", colorVar: "--cat-future", color: "#84CC16" },
  "enterprise": { label: "엔터프라이즈", description: "조직 운영과 기업형 도구", colorVar: "--cat-enterprise", color: "#475569" },
  "media": { label: "미디어 & 콘텐츠", description: "미디어 제작과 콘텐츠 운영 도구", colorVar: "--cat-media", color: "#E11D48" },
  uncategorized: { label: "미분류", description: "style frontmatter가 없는 문서", colorVar: "--cat-uncategorized", color: "#64748b" }
};

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
    style: String(parsed.data.style || "uncategorized").trim() || "uncategorized",
    file: `${base}.html`
  };
}

function existingOrder(data) {
  const categoryOrder = new Map();
  const guideOrder = new Map();
  const guideByFile = new Map();
  (data.categories || []).forEach((cat, catIdx) => {
    categoryOrder.set(cat.id, catIdx);
    (cat.guides || []).forEach((guide, guideIdx) => {
      guideOrder.set(guide.slug, guideIdx);
      guideByFile.set(String(guide.file || "").toLowerCase(), guide);
    });
  });
  return { categoryOrder, guideOrder, guideByFile };
}

function categoryMeta(style, stylesConfig, existing) {
  const current = existing?.categories?.find((cat) => cat.id === style);
  const predefined = STYLE_META[style];
  const styleLabel = stylesConfig?.[style]?.label;
  return {
    id: style,
    label: current?.label || predefined?.label || styleLabel || style,
    description: current?.description || predefined?.description || `${style} 스타일 문서`,
    colorVar: current?.colorVar || predefined?.colorVar || "--cat-uncategorized",
    color: current?.color || predefined?.color || stylesConfig?.[style]?.brand || "#64748b",
    guides: []
  };
}

function syncGuides() {
  const existing = readJson(DATA_FILE, { categories: [], collections: [], showcase: null });
  const stylesConfig = readJson(STYLES_FILE, {});
  const { categoryOrder, guideOrder, guideByFile } = existingOrder(existing);
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

  const styleIds = [...byStyle.keys()].sort((a, b) => {
    const ao = categoryOrder.has(a) ? categoryOrder.get(a) : Number.MAX_SAFE_INTEGER;
    const bo = categoryOrder.has(b) ? categoryOrder.get(b) : Number.MAX_SAFE_INTEGER;
    if (ao !== bo) return ao - bo;
    if (a === "uncategorized") return 1;
    if (b === "uncategorized") return -1;
    return a.localeCompare(b);
  });

  const categories = styleIds.map((style) => {
    const cat = categoryMeta(style, stylesConfig, existing);
    cat.guides = byStyle.get(style).sort((a, b) => {
      const ao = guideOrder.has(a.slug) ? guideOrder.get(a.slug) : Number.MAX_SAFE_INTEGER;
      const bo = guideOrder.has(b.slug) ? guideOrder.get(b.slug) : Number.MAX_SAFE_INTEGER;
      if (ao !== bo) return ao - bo;
      return a.title.localeCompare(b.title, "ko");
    }).map(({ style: _style, mdFile: _mdFile, ...guide }) => guide);
    return cat;
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
  console.log("   order: existing guides.json order preserved; new files appended by title");
}

syncGuides();
