#!/usr/bin/env node
/**
 * build-guide.mjs  (CLI 래퍼)
 * Markdown -> 가이드 HTML. 실제 변환은 환경 비의존 코어 scripts/guide-core.mjs 가 담당
 *   (client-compiler.ts html 모드와 공유 — standalone==server 보장).
 * 이 파일은 파일 수집 + config 로드 + 출력 경로 결정만 책임진다.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildHtml as buildGuideHtmlCore } from "./guide-core.mjs";
import { reportAliasUse } from "./library-names.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function loadJsonWithComments(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const src = fs.readFileSync(filePath, "utf8").replace(/\/\/[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
  return JSON.parse(src);
}

const CONFIG_DIR = path.join(__dirname, "../config");
const STYLES = loadJsonWithComments(path.join(CONFIG_DIR, "styles.json"));
const CONFIG = loadJsonWithComments(path.join(CONFIG_DIR, "pptdesign.config.json"));
const HTML_CONFIG = loadJsonWithComments(path.join(CONFIG_DIR, "htmldesign.config.json"));

// mermaid 스크립트 원문(3.3MB) — 문서가 실제로 mermaid 블록을 쓸 때만 코어가 인라인한다(규칙 1: 오프라인 원칙).
// 없는 문서에 매번 인라인하면 낭비이므로, 파일 존재 시 1회만 읽어 캐시(모듈 스코프)한다.
const MERMAID_JS_PATH = path.join(ROOT, "node_modules/mermaid/dist/mermaid.min.js");
const MERMAID_SCRIPT = fs.existsSync(MERMAID_JS_PATH) ? fs.readFileSync(MERMAID_JS_PATH, "utf8") : null;

// 파일 경로 → 사전 읽은 문서 → 코어 호출 (기존 buildHtml 과 동일한 외부 계약: (path, opts) → {html,...})
export function buildHtml(inputPath, opts = {}) {
  const raw = fs.readFileSync(inputPath, "utf8");
  return buildGuideHtmlCore({ raw }, { styles: STYLES, config: CONFIG, htmlConfig: HTML_CONFIG, style: opts.style || null, mermaidScript: MERMAID_SCRIPT });
}

const isMain = fileURLToPath(import.meta.url) === path.resolve(process.argv[1] || "");
if (isMain) {
  // ── CLI 인수 파싱 ──────────────────────────────────────────────
  // 지원 플래그:
  //   --all          위치 인수를 glob 패턴으로 처리, 매칭된 모든 .md 일괄 변환
  //   --out <path>   단일 파일 변환 시 출력 경로 지정
  //   --style <key>  styles.json 색상 프리셋 강제 지정 (frontmatter보다 우선)
  //   --help         사용법 출력
  const argv = process.argv.slice(2);

  // --help: 사용법 안내 후 종료
  if (argv.includes("--help") || argv.includes("-h")) {
    console.log([
      "",
      "사용법:",
      "  node scripts/build-guide.mjs <input.md> [output.html]",
      "  node scripts/build-guide.mjs <input.md> [--out path.html] [--style key]",
      "  node scripts/build-guide.mjs --all \"md_src/guides/*.md\" [--style key]",
      "",
      "옵션:",
      "  --out <path>   출력 HTML 경로 (기본: public/guides/<이름>.html)",
      "  --style <key>  색상 프리셋 강제 지정 (frontmatter보다 우선)",
      "  --all          위치 인수를 glob 패턴으로 처리, 일괄 변환",
      "  --help         이 도움말 출력",
      "",
      `스타일 키: ${Object.keys(STYLES).filter(k => !k.startsWith("$")).join(" | ")}`,
      "",
    ].join("\n"));
    process.exit(0);
  }

  // 플래그와 위치 인수 분리
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--all")        flags.all = true;
    else if (argv[i] === "--out")   flags.out = argv[++i];
    else if (argv[i] === "--style") flags.style = argv[++i];
    else if (!argv[i].startsWith("--")) positional.push(argv[i]);
  }

  // 인수 없으면 간단한 안내
  if (!positional.length) {
    console.error("사용법: node scripts/build-guide.mjs <input.md>  (--help 로 전체 옵션 확인)");
    process.exit(1);
  }

  // --all: glob 패턴으로 여러 파일 일괄 변환
  // 출력은 항상 public/guides/<이름>.html (--out 무시)
  if (flags.all) {
    const { glob } = await import("node:fs/promises");
    for (const pattern of positional) {
      const files = [];
      for await (const f of glob(pattern)) files.push(f);
      if (!files.length) { console.warn(`매칭 파일 없음: ${pattern}`); continue; }
      for (const f of files) {
        try {
          const abs = path.resolve(f);
          const { html } = buildHtml(abs, { style: flags.style || null });
          const outPath = path.join("public/guides", path.basename(abs, ".md") + ".html");
          fs.mkdirSync(path.dirname(outPath), { recursive: true });
          fs.writeFileSync(outPath, html, "utf8");
          console.log(`✅ ${path.basename(abs)} → ${outPath}`);
          reportAliasUse();
        } catch (e) {
          console.error(`❌ ${f}: ${e.message}`);
        }
      }
    }
  } else {
    // 단일 파일 변환
    // 출력 경로 우선순위: --out > 두 번째 위치 인수 > 기본 경로 (폴더 지정 시 자동 파일네이밍 대응)
    try {
      const abs = path.resolve(positional[0]);
      const { html } = buildHtml(abs, { style: flags.style || null });
      
      let outPath = flags.out || positional[1];
      if (outPath) {
        // 지정된 경로가 .html / .htm 확장자가 아니면 폴더명으로 판단하고 파일명을 합성하여 넣어줌
        const ext = path.extname(outPath).toLowerCase();
        if (ext !== ".html" && ext !== ".htm") {
          outPath = path.join(outPath, path.basename(abs, ".md") + ".html");
        }
      } else {
        // 출력 경로가 누락된 경우의 스마트 기본값
        // 입력 파일이 md_src/<folder>/<name>.md 형태라면 자동으로 public/<folder>/<name>.html로 설정
        const mdSrcRoot = path.join(ROOT, "md_src");
        const relToMdSrc = path.relative(mdSrcRoot, abs);
        if (!relToMdSrc.startsWith("..") && !path.isAbsolute(relToMdSrc)) {
          const parts = relToMdSrc.split(path.sep);
          if (parts.length >= 2) {
            outPath = path.join("public", parts[0], path.basename(abs, ".md") + ".html");
          }
        }
        
        // 위의 조건에 해당하지 않으면 기본 guides 폴더로 낙점
        if (!outPath) {
          outPath = path.join("public/guides", path.basename(abs, ".md") + ".html");
        }
      }

      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, html, "utf8");
      console.log(`✅ 가이드 HTML 생성 완료: ${outPath}`);
      reportAliasUse();
    } catch (e) {
      console.error("❌ 에러 발생:", e.message);
      process.exit(1);
    }
  }
}
