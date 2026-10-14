#!/usr/bin/env node
/**
 * build-presentation.mjs  (CLI 래퍼)
 * Markdown -> Slide HTML (Full-screen, Horizontal Scrolling Presentation Mode).
 * 실제 변환(슬라이드 분할·페이지 템플릿·CSS·숏코드 렌더)은 환경 비의존 코어
 *   scripts/presentation-core.mjs 가 담당한다. (client-compiler.ts 와 공유 — standalone==server 보장)
 * 이 파일은 파일 수집(glob/dir) + config 로드 + 출력 경로 결정만 책임진다.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildPresentationHtml } from "./presentation-core.mjs";
import { reportAliasUse } from "./library-names.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONFIG_DIR = path.join(ROOT, "config");

// Load configs (코어에 주입)
function loadJsonWithComments(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const src = fs.readFileSync(filePath, "utf8").replace(/\/\/[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
  return JSON.parse(src);
}

const STYLES = loadJsonWithComments(path.join(CONFIG_DIR, "styles.json"));
const CONFIG = loadJsonWithComments(path.join(CONFIG_DIR, "pptdesign.config.json"));
const HTML_CONFIG = loadJsonWithComments(path.join(CONFIG_DIR, "htmldesign.config.json"));

// mermaid 스크립트 원문(3.3MB) — 덱 안에 mermaid 블록이 하나라도 있을 때만 코어가 인라인한다(오프라인 원칙).
const MERMAID_JS_PATH = path.join(ROOT, "node_modules/mermaid/dist/mermaid.min.js");
const MERMAID_SCRIPT = fs.existsSync(MERMAID_JS_PATH) ? fs.readFileSync(MERMAID_JS_PATH, "utf8") : null;

// 파일 경로 배열 → 사전 읽은 문서 배열 → 코어 호출 (CLI 전용 얇은 어댑터)
function buildDeckFromFiles(files, opts = {}) {
  const docs = [];
  for (const fp of files) {
    if (!fs.existsSync(fp)) {
      console.warn(`⚠️ Warning: 파일이 존재하지 않아 스킵합니다: ${fp}`);
      continue;
    }
    const raw = fs.readFileSync(fp, "utf8");
    docs.push({ raw, basename: path.basename(fp, ".md") });
  }
  return buildPresentationHtml(docs, { styles: STYLES, config: CONFIG, htmlConfig: HTML_CONFIG, style: opts.style || null, mermaidScript: MERMAID_SCRIPT });
}

// 하위 호환: 기존 import 경로 보존 (core 재노출)
export { buildPresentationHtml };

// CLI entry
const isMain = fileURLToPath(import.meta.url) === path.resolve(process.argv[1] || "");
if (isMain) {
  const argv = process.argv.slice(2);

  if (argv.includes("--help") || argv.includes("-h") || !argv.length) {
    console.log([
      "",
      "사용법:",
      "  node scripts/build-presentation.mjs <input1.md> [input2.md ...] [output.html]",
      "  node scripts/build-presentation.mjs <directory_path> [output.html]",
      "  node scripts/build-presentation.mjs <glob_pattern> [--out path.html] [--style key]",
      "",
      "옵션:",
      "  --out <path>   출력 HTML 경로 (기본: public/presentation/<이름>.html 또는 unified-deck.html)",
      "  --style <key>  색상 프리셋 지정",
      "",
    ].join("\n"));
    process.exit(0);
  }

  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--out")   flags.out = argv[++i];
    else if (argv[i] === "--style") flags.style = argv[++i];
    else if (!argv[i].startsWith("--")) positional.push(argv[i]);
  }

  // Gather all matching markdown files
  const files = [];
  let explicitOut = flags.out;

  // Check if the last positional argument represents a manually specified output HTML file
  let possibleOutput = null;
  if (positional.length > 1) {
    const last = positional[positional.length - 1];
    if (last.toLowerCase().endsWith(".html") || last.toLowerCase().endsWith(".htm")) {
      possibleOutput = positional.pop();
    }
  }

  for (const arg of positional) {
    const abs = path.resolve(arg);
    if (fs.existsSync(abs)) {
      const stat = fs.statSync(abs);
      if (stat.isDirectory()) {
        // Search folder
        const found = fs.readdirSync(abs)
          .filter(f => f.toLowerCase().endsWith(".md"))
          .map(f => path.join(abs, f))
          .sort();
        files.push(...found);
      } else if (stat.isFile() && abs.toLowerCase().endsWith(".md")) {
        files.push(abs);
      }
    } else {
      // Glob pattern
      try {
        const { glob } = await import("node:fs/promises");
        const found = [];
        for await (const f of glob(arg)) {
          if (f.toLowerCase().endsWith(".md")) {
            found.push(path.resolve(f));
          }
        }
        files.push(...found.sort());
      } catch (err) {
        console.warn(`⚠️ Warning: glob scanning failed for ${arg}: ${err.message}`);
      }
    }
  }

  if (!files.length) {
    console.error("❌ 에러: 변환 대상이 되는 마크다운(*.md) 파일을 발견하지 못했습니다.");
    process.exit(1);
  }

  try {
    const { html } = buildDeckFromFiles(files, { style: flags.style || null });
    
    // Determine the default output name
    let outPath = explicitOut || possibleOutput;
    if (!outPath) {
      if (files.length === 1) {
        outPath = path.join("public", "presentation", path.basename(files[0], ".md") + ".html");
      } else {
        // If it was a folder scan, name it after the folder
        const firstAbs = files[0];
        const parentDir = path.dirname(firstAbs);
        const folderName = path.basename(parentDir);
        if (folderName && folderName !== "guides" && folderName !== "md_src") {
          outPath = path.join("public", "presentation", `${folderName}-presentation.html`);
        } else {
          outPath = path.join("public", "presentation", "unified-deck.html");
        }
      }
    } else {
      // Folder fallback matching templates/build-guide.mjs
      const ext = path.extname(outPath).toLowerCase();
      if (ext !== ".html" && ext !== ".htm") {
        if (files.length === 1) {
          outPath = path.join(outPath, path.basename(files[0], ".md") + ".html");
        } else {
          outPath = path.join(outPath, "unified-deck.html");
        }
      }
    }

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html, "utf8");
    console.log(`✅ 프레젠테이션 횡 슬라이드 병합 HTML 생성 완료 (${files.length}개 파일): ${outPath}`);
    reportAliasUse();
  } catch (e) {
    console.error("❌ 에러 발생:", e.message);
    process.exit(1);
  }
}
