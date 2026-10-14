#!/usr/bin/env node
/**
 * md-to-pptx.mjs — MD → PPTX 변환 CLI (얇은 래퍼: 파일 읽기 + config 로드 + 코어 호출 + 파일 저장)
 * 변환 자체는 공용 코어 scripts/pptx-core/(브라우저 src/lib/pptx-browser.ts 와 같은 코드) — HTML 의 guide-core 와 같은 구조.
 * Universal Schema(6대 표준 키: icon, title, desc, tag, meta, color) 기반.
 */

import { readFileSync, mkdirSync } from "node:fs";
import { join, dirname, basename, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "node:fs/promises";
import { reportAliasUse } from "./library-names.mjs";
import { buildPptx, parseJsonc } from "./pptx-core/index.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ════════════════════════════════════════════════════════════════
//  1. 설정 로드
// ════════════════════════════════════════════════════════════════

const loadJsonWithComments = (filePath) => parseJsonc(readFileSync(filePath, "utf8"));

const CONFIG_DIR = resolve(__dirname, "../config");
const STYLES       = loadJsonWithComments(resolve(CONFIG_DIR, "styles.json"));
const FONT_ALIASES = loadJsonWithComments(resolve(CONFIG_DIR, "font-aliases.json"));
const DESIGN       = loadJsonWithComments(resolve(CONFIG_DIR, "pptdesign.config.json"));

// ════════════════════════════════════════════════════════════════
//  2. CLI 파서
// ════════════════════════════════════════════════════════════════

function parseCLI(argv) {
  const flags = { noCover: false, all: false, verbose: false };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--no-cover") { flags.noCover = true; continue; }
    if (a === "--all")      { flags.all = true; continue; }
    if (a === "--verbose")  { flags.verbose = true; continue; }
    if (a.startsWith("--")) {
      const key = a.slice(2);
      flags[key] = (!argv[i + 1] || argv[i + 1].startsWith("--")) ? true : argv[++i];
    } else {
      positional.push(a);
    }
  }
  return { positional, ...flags };
}

// ════════════════════════════════════════════════════════════════
//  3. 메인 변환 함수 — 코어로 만들고 파일로 저장
// ════════════════════════════════════════════════════════════════

export async function convertMdToPptx(mdPath, opts = {}) {
  const { out, styleOverride, noCover, verbose } = opts;
  const raw = readFileSync(mdPath, "utf8");
  const { prs, sections, D } = buildPptx(raw, { styles: STYLES, design: DESIGN, fontAliases: FONT_ALIASES, styleOverride, noCover, verbose, label: basename(mdPath) });
  const name = basename(mdPath, extname(mdPath));
  const outPath = out || join(D.output.dir, `${name}${D.output.suffix || ""}.pptx`);

  try {
    mkdirSync(dirname(resolve(outPath)), { recursive: true });
    await prs.writeFile({ fileName: outPath });
    console.log(`✅ ${basename(mdPath)} → ${outPath}  (섹션 ${sections.length}개)`);
    reportAliasUse();
    return outPath;
  } catch (err) {
    if (err.code === "EBUSY" || err.code === "EPERM") {
      const ts = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
      const altPath = outPath.replace(/\.pptx$/i, `_${ts}.pptx`);
      try {
        await prs.writeFile({ fileName: altPath });
        console.warn(`⚠️  원본 파일 잠김 → 대체 저장: ${basename(altPath)}`);
        return altPath;
      } catch {
        console.error(`❌ 대체 저장도 실패 (${altPath}): 파일을 닫고 다시 시도해 주세요.`);
        throw err;
      }
    } else {
      console.error(`❌ PPTX 쓰기 실패 (${outPath}): ${err.message}`);
      throw err;
    }
  }
}

// ════════════════════════════════════════════════════════════════
//  4. CLI 진입점
// ════════════════════════════════════════════════════════════════

const isMain = process.argv[1] &&
  resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));

if (isMain) {
  const args = parseCLI(process.argv.slice(2));

  if (!args.positional.length) {
    console.error([
      "사용법:",
      "  node scripts/md-to-pptx.mjs <input.md> [--out path.pptx] [--style key] [--no-cover] [--verbose]",
      "  node scripts/md-to-pptx.mjs --all \"mddata/*.md\"",
      "",
      `스타일 키: ${Object.keys(STYLES).filter(k => !k.startsWith("$")).join(" | ")}`,
    ].join("\n"));
    process.exit(1);
  }

  const convOpts = { out: args.out || null, styleOverride: args.style || null, noCover: !!args.noCover, verbose: !!args.verbose };

  if (args.all) {
    for (const pattern of args.positional) {
      const files = [];
      for await (const f of glob(pattern)) files.push(f);
      if (!files.length) { console.warn(`매칭 파일 없음: ${pattern}`); continue; }
      for (const f of files) await convertMdToPptx(resolve(f), { ...convOpts, out: null });
    }
  } else {
    for (const mdPath of args.positional) {
      await convertMdToPptx(resolve(mdPath), convOpts);
    }
  }
}
