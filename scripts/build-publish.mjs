#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildHtml } from "./build-guide.mjs";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

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

function writeHtml(input, output) {
  const { html } = buildHtml(input);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  
  // Safe-Write mechanism to bypass Windows file locks
  try {
    if (fs.existsSync(output)) {
      fs.unlinkSync(output);
    }
  } catch (err) {
    // ignore lock resolution attempt failure
  }

  try {
    fs.writeFileSync(output, html, "utf8");
  } catch (err) {
    try {
      const tempPath = `${output}.tmp`;
      fs.writeFileSync(tempPath, html, "utf8");
      if (fs.existsSync(output)) {
        try { fs.unlinkSync(output); } catch {}
      }
      fs.renameSync(tempPath, output);
    } catch (nestedErr) {
      console.error(`❌ 에러: 파일 쓰기 실패 (${output}) - ${err.message}`);
      throw err;
    }
  }
  
  console.log(`✅ ${path.relative(ROOT, input)} → ${path.relative(ROOT, output)}`);
}

function runNode(args) {
  const result = spawnSync(process.execPath, args, { cwd: ROOT, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}

function buildGuides() {
  const dir = path.join(ROOT, "md_src", "guides");
  for (const file of walkMd(dir)) {
    const out = path.join(ROOT, "public", "guides", `${path.basename(file, ".md")}.html`);
    writeHtml(file, out);
  }
}

function buildCollection(folder) {
  const dir = path.join(ROOT, "md_src", folder);
  for (const file of walkMd(dir)) {
    const out = path.join(ROOT, "public", folder, `${path.basename(file, ".md")}.html`);
    writeHtml(file, out);
  }
}

function buildShowcase() {
  const md = path.join(ROOT, "md_src", "showcase", "showcase.md");
  if (!fs.existsSync(md)) return;
  writeHtml(md, path.join(ROOT, "public", "showcase", "showcase.html"));
  runNode(["scripts/md-to-pptx.mjs", "md_src/showcase/showcase.md", "--out", "public/showcase/showcase.pptx"]);
}

runNode(["scripts/sync-guides-index.mjs"]);
buildGuides();

// Dynamically compile all collection directories under md_src
const MD_SRC = path.join(ROOT, "md_src");
for (const entry of fs.readdirSync(MD_SRC, { withFileTypes: true })) {
  if (entry.isDirectory()) {
    const folderName = entry.name;
    if (folderName === "guides" || folderName === "showcase") continue;
    buildCollection(folderName);
  }
}

buildShowcase();
