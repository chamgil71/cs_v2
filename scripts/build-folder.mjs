#!/usr/bin/env node
/**
 * build-folder.mjs
 * "폴더 하나를 선택해서 필요한 산출물을 한 번에" 만드는 오케스트레이터.
 * 새 변환 로직을 만들지 않는다 — 이미 검증된 기존 스크립트(guide-core/presentation-core/md-to-pptx/
 * build-guide-hub)를 그대로 순차 호출만 한다. 각 스크립트는 지금처럼 단독 CLI로도 계속 쓸 수 있다.
 *
 * --dir은 "guides"처럼 짧은 이름이면 md_src/guides로 해석하고, 경로 구분자가 섞인 값이나 절대경로면
 * (예: "C:/Users/me/Desktop/my-docs") 그 경로를 그대로 소스로 쓴다 — md_src 밖 임의 폴더도 동일하게
 * 다룰 수 있어서, 웹 GUI에서 사용자가 OS 폴더 선택 다이얼로그로 고른 경로를 그대로 넘겨도 동작한다.
 *
 * 사용법:
 *   node scripts/build-folder.mjs --dir guides
 *     플래그 없이 실행하면 "기본 세트"(개별 종형 html + 개별 횡형 프레젠테이션 html + 개별 pptx + 폴더 목록 index.html)만 생성.
 *     <dir>/hub.config.json의 outputs.onepage / outputs.presentationBundle 이 true면 그 산출물도 함께 생성.
 *
 *   node scripts/build-folder.mjs --dir guides --all
 *     기본 세트 + onepage(단일파일 허브) + presentation-bundle(통합 슬라이드 덱)까지 전부.
 *
 *   개별 선택: --guide  --presentation  --pptx  --hub  --onepage  --presentation-bundle
 *     (하나라도 명시하면 "그것만" 생성 — hub.config.json 기본값은 --onepage/--presentation-bundle 미명시 시에만 적용)
 *   끄기: --no-onepage / --no-presentation-bundle (hub.config.json이 true여도 강제로 끔)
 *
 *   node scripts/build-folder.mjs --dir newFolder --init-config
 *     <dir>/hub.config.json이 아직 없으면, 그 폴더 md 전체의 frontmatter style을 스캔해
 *     "라벨=id, 색은 자동 순환"인 초안을 만들고 종료한다(이미 있으면 덮어쓰지 않고 건너뜀).
 *     초안의 label/color/order를 원하는 대로 고친 뒤 --init-config 없이 다시 실행하면 그 설정으로 빌드된다.
 *
 * 산출 위치(<base>는 --dir이 짧은 이름이면 그 이름, 명시적 경로면 마지막 폴더명):
 *   <out-dir>/<base>/<파일명>.html                (--guide)
 *   <out-dir>/<base>/<파일명>_presentation.html    (--presentation)
 *   <out-dir>/<base>/<파일명>.pptx                 (--pptx)
 *   <out-dir>/<base>/index.html                    (--hub, 폴더 안 산출물을 나열하는 가벼운 정적 링크 페이지)
 *   <out-dir>/<base>-onepage.html                  (--onepage, build-guide-hub.mjs와 동일 — 서버 없이 혼자 열리는 단일 파일)
 *   <out-dir>/<base>-presentation-bundle.html      (--presentation-bundle, 폴더 전체를 합친 횡슬라이드 덱)
 *   (--out-dir 기본값은 publish)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { buildHtml as buildGuideHtml } from "./guide-core.mjs";
import { buildPresentationHtml } from "./presentation-core.mjs";
import { convertMdToPptx } from "./md-to-pptx.mjs";
import { render as renderHubOnepage } from "./build-guide-hub.mjs";
import { loadHubConfig, categoryMetaFor, sortByCategoryOrder, hubConfigExists, writeStarterHubConfig, resolveFolderDir } from "./hub-config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function loadJsonWithComments(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const src = fs.readFileSync(filePath, "utf8").replace(/\/\/[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
  return JSON.parse(src);
}

const CONFIG_DIR = path.join(ROOT, "config");
const STYLES = loadJsonWithComments(path.join(CONFIG_DIR, "styles.json"));
const CONFIG = loadJsonWithComments(path.join(CONFIG_DIR, "pptdesign.config.json"));
const HTML_CONFIG = loadJsonWithComments(path.join(CONFIG_DIR, "htmldesign.config.json"));

function walkMd(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".md"))
    .map((e) => path.join(dir, e.name))
    .sort((a, b) => a.localeCompare(b, "ko"));
}

function slugify(name) {
  return name.trim().toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9가-힣._-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// <out-dir>/<base>/index.html — 그 폴더 안에 실제로 생긴 개별 산출물(html/presentation/pptx)로 바로 링크하는
// 가벼운 정적 목록 페이지. build-guide-hub.mjs의 onepage 허브(모든 본문을 한 파일에 내장)와는 다른 산출물이다.
function writeFolderIndex(outDir, folder, entries, hubConfig) {
  const byStyle = new Map();
  for (const e of entries) {
    if (!byStyle.has(e.style)) byStyle.set(e.style, []);
    byStyle.get(e.style).push(e);
  }
  const styleIds = sortByCategoryOrder([...byStyle.keys()], hubConfig);

  let body = "";
  for (const id of styleIds) {
    const meta = categoryMetaFor(hubConfig, id);
    const guides = byStyle.get(id).sort((a, b) => a.title.localeCompare(b.title, "ko"));
    body += `<section class="cat"><h2><span class="dot" style="background:${meta.color}"></span>${escapeHtml(meta.label)}</h2>`;
    if (meta.description) body += `<p class="desc">${escapeHtml(meta.description)}</p>`;
    body += `<ul>`;
    for (const e of guides) {
      body += `<li><span class="t">${escapeHtml(e.title)}</span><span class="links">`;
      if (e.htmlFile) body += `<a href="./${encodeURIComponent(e.htmlFile)}">가이드</a>`;
      if (e.presentationFile) body += `<a href="./${encodeURIComponent(e.presentationFile)}">프레젠테이션</a>`;
      if (e.pptxFile) body += `<a href="./${encodeURIComponent(e.pptxFile)}">PPTX</a>`;
      body += `</span></li>`;
    }
    body += `</ul></section>`;
  }

  const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapeHtml(folder)} 목록</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;padding:40px 24px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Pretendard","Noto Sans KR",sans-serif;background:#f7f8fb;color:#1a1d24;}
  .wrap{max-width:840px;margin:0 auto}
  h1{font-size:22px;margin:0 0 8px}
  p.lead{color:#5b6473;margin:0 0 32px;font-size:14px}
  .cat{margin-bottom:32px}
  .cat h2{font-size:16px;display:flex;align-items:center;gap:8px;margin:0 0 4px;padding-bottom:10px;border-bottom:1px solid #e3e6ee}
  .dot{width:9px;height:9px;border-radius:50%;flex:0 0 auto}
  .desc{color:#5b6473;font-size:12.5px;margin:8px 0 12px}
  ul{list-style:none;margin:0;padding:0}
  li{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 4px;border-bottom:1px solid #eef0f5;font-size:14px}
  .links{display:flex;gap:6px;flex:0 0 auto}
  .links a{font-size:12px;color:#fff;background:#6366f1;padding:4px 10px;border-radius:6px;text-decoration:none}
  .links a:hover{opacity:.85}
</style>
</head>
<body>
<div class="wrap">
  <h1>${escapeHtml(folder)} — 산출물 목록</h1>
  <p class="lead">이 폴더의 개별 가이드·프레젠테이션·PPTX 파일로 바로 이동합니다. 서버 없이도 열리지만, 한 파일로 다 담긴 버전이 필요하면 <code>${escapeHtml(folder)}-onepage.html</code>을 여세요.</p>
  ${body}
</div>
</body>
</html>
`;
  fs.writeFileSync(path.join(outDir, "index.html"), html, "utf8");
}

function printHelp() {
  console.log([
    "",
    "사용법:",
    "  node scripts/build-folder.mjs --dir <md_src 하위 폴더명> [플래그...]",
    "",
    "플래그 없이 실행 시 기본 세트: 개별 종형(--guide) + 개별 횡형(--presentation) + 개별 pptx(--pptx) + 폴더 index.html(--hub)",
    "",
    "옵션:",
    "  --dir <name|path>         md_src/<name> 대상, 또는 경로 구분자가 섞인 값/절대경로면 그 폴더를 그대로 대상 (기본: guides)",
    "  --out-dir <path>          출력 루트 (기본: publish)",
    "  --guide                   개별 종형 가이드 html만",
    "  --presentation            개별 횡형 프레젠테이션 html만",
    "  --pptx                    개별 pptx만",
    "  --hub                     폴더 index.html만",
    "  --onepage                 전체를 하나로 합친 self-contained 단일 파일(<dir>-onepage.html)도 생성",
    "  --no-onepage              hub.config.json의 outputs.onepage가 true여도 생성 안 함",
    "  --presentation-bundle     전체를 합친 횡슬라이드 통합 덱(<dir>-presentation-bundle.html)도 생성",
    "  --no-presentation-bundle  hub.config.json의 outputs.presentationBundle이 true여도 생성 안 함",
    "  --all                     위 6가지 전부",
    "  --init-config             hub.config.json이 없으면 md의 style frontmatter를 스캔해 초안을 생성(있으면 건너뜀).",
    "                            단독으로 쓰면 초안만 만들고 끝냄 — 라벨/색/순서를 검토·수정한 뒤 다시 실행하세요.",
    "  --help                    이 도움말",
    "",
  ].join("\n"));
}

function parseArgs(argv) {
  const flags = {
    dir: "guides", outDir: "publish",
    guide: false, presentation: false, pptx: false, hub: false,
    onepage: null, presentationBundle: null, all: false, initConfig: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dir") flags.dir = argv[++i];
    else if (a === "--out-dir") flags.outDir = argv[++i];
    else if (a === "--guide") flags.guide = true;
    else if (a === "--presentation") flags.presentation = true;
    else if (a === "--pptx") flags.pptx = true;
    else if (a === "--hub") flags.hub = true;
    else if (a === "--onepage") flags.onepage = true;
    else if (a === "--no-onepage") flags.onepage = false;
    else if (a === "--presentation-bundle") flags.presentationBundle = true;
    else if (a === "--no-presentation-bundle") flags.presentationBundle = false;
    else if (a === "--all") flags.all = true;
    else if (a === "--init-config") flags.initConfig = true;
    else if (a === "--help" || a === "-h") { printHelp(); process.exit(0); }
  }
  return flags;
}

async function run(flags) {
  const { srcDir: mdSrcDir, outBase } = resolveFolderDir(ROOT, flags.dir);
  const files = walkMd(mdSrcDir);
  if (!files.length) {
    console.error(`❌ ${path.relative(ROOT, mdSrcDir)} 안에 .md 파일이 없습니다.`);
    process.exit(1);
  }

  // --init-config: hub.config.json이 아직 없는 새 폴더를 위한 부트스트랩.
  // 폴더 안 md 전체의 frontmatter style을 스캔해 "라벨=id, 색은 팔레트 순환"인 초안을 만든다.
  // 이미 파일이 있으면 절대 덮어쓰지 않는다 — 수동으로 고친 라벨/순서를 보호하기 위함.
  if (flags.initConfig) {
    if (hubConfigExists(mdSrcDir)) {
      console.log(`ℹ️  ${path.relative(ROOT, mdSrcDir)}/hub.config.json 이미 존재 — 덮어쓰지 않고 건너뜀.`);
    } else {
      const seen = new Set();
      for (const f of files) {
        const { data: fm } = matter(fs.readFileSync(f, "utf8"));
        seen.add(String(fm.style || "uncategorized").trim() || "uncategorized");
      }
      const configPath = writeStarterHubConfig(mdSrcDir, [...seen]);
      console.log(`✅ 초안 생성: ${path.relative(ROOT, configPath)} — 라벨·색·순서를 원하는 대로 고친 뒤 다시 실행하세요.`);
      // --init-config만 단독으로 준 경우(다른 산출물 플래그가 전혀 없으면) 초안만 만들고 종료 —
      // 사용자가 라벨을 검토/수정할 시간을 주기 위함.
      const anyOtherFlag = flags.guide || flags.presentation || flags.pptx || flags.hub
        || flags.onepage !== null || flags.presentationBundle !== null || flags.all;
      if (!anyOtherFlag) return;
    }
  }

  const hubConfig = loadHubConfig(mdSrcDir);

  let { guide: doGuide, presentation: doPresentation, pptx: doPptx, hub: doHub } = flags;
  if (flags.all) { doGuide = doPresentation = doPptx = doHub = true; }
  const anyPerFileExplicit = flags.guide || flags.presentation || flags.pptx || flags.hub || flags.all;
  if (!anyPerFileExplicit) { doGuide = doPresentation = doPptx = doHub = true; }

  const doOnepage = flags.all || (flags.onepage !== null ? flags.onepage : hubConfig.outputs.onepage);
  const doPresentationBundle = flags.all || (flags.presentationBundle !== null ? flags.presentationBundle : hubConfig.outputs.presentationBundle);

  const outDir = path.resolve(ROOT, flags.outDir, outBase);
  if (doGuide || doPresentation || doPptx || doHub) fs.mkdirSync(outDir, { recursive: true });

  const entries = [];
  for (const file of files) {
    const base = path.basename(file, ".md");
    const raw = fs.readFileSync(file, "utf8");
    const { data: fm } = matter(raw);
    const title = String(fm.title || base).replace(/\s+/g, " ").trim();
    const subtitle = String(fm.subtitle || "").replace(/\s+/g, " ").trim();
    const style = String(fm.style || "uncategorized").trim() || "uncategorized";

    let htmlFile = null, presentationFile = null, pptxFile = null;

    if (doGuide) {
      const { html } = buildGuideHtml({ raw }, { styles: STYLES, config: CONFIG, htmlConfig: HTML_CONFIG });
      htmlFile = `${base}.html`;
      fs.writeFileSync(path.join(outDir, htmlFile), html, "utf8");
    }
    if (doPresentation) {
      const { html } = buildPresentationHtml([{ raw, basename: base }], { styles: STYLES, config: CONFIG, htmlConfig: HTML_CONFIG });
      presentationFile = `${base}_presentation.html`;
      fs.writeFileSync(path.join(outDir, presentationFile), html, "utf8");
    }
    if (doPptx) {
      pptxFile = `${base}.pptx`;
      await convertMdToPptx(file, { out: path.join(outDir, pptxFile) });
    }

    entries.push({ slug: slugify(base), title, subtitle, style, htmlFile, presentationFile, pptxFile });
    const madeFormats = [htmlFile && "html", presentationFile && "presentation", pptxFile && "pptx"].filter(Boolean);
    if (madeFormats.length) console.log(`  · ${base} (${madeFormats.join("/")})`);
  }

  if (doHub) {
    writeFolderIndex(outDir, outBase, entries, hubConfig);
    console.log(`✅ 폴더 목록 index.html 생성: ${path.relative(ROOT, path.join(outDir, "index.html"))}`);
  }

  if (doOnepage) {
    // flags.dir(원래 인자)를 그대로 넘긴다 — build-guide-hub.mjs도 같은 resolveFolderDir()로 해석하므로
    // "guides" 같은 짧은 이름이든 명시적 경로든 여기 build-folder.mjs와 항상 같은 폴더를 가리키게 된다.
    const html = renderHubOnepage(flags.dir);
    const outPath = path.resolve(ROOT, flags.outDir, `${outBase}-onepage.html`);
    fs.writeFileSync(outPath, html, "utf8");
    console.log(`✅ onepage 허브 생성: ${path.relative(ROOT, outPath)}`);
  }

  if (doPresentationBundle) {
    const docs = files.map((f) => ({ raw: fs.readFileSync(f, "utf8"), basename: path.basename(f, ".md") }));
    const { html } = buildPresentationHtml(docs, { styles: STYLES, config: CONFIG, htmlConfig: HTML_CONFIG });
    const outPath = path.resolve(ROOT, flags.outDir, `${outBase}-presentation-bundle.html`);
    fs.writeFileSync(outPath, html, "utf8");
    console.log(`✅ 통합 프레젠테이션 덱 생성: ${path.relative(ROOT, outPath)}`);
  }

  console.log(`\n✅ [${path.relative(ROOT, mdSrcDir)}] 빌드 완료 — 가이드 ${entries.length}개`);
}

const isMain = fileURLToPath(import.meta.url) === path.resolve(process.argv[1] || "");
if (isMain) {
  const flags = parseArgs(process.argv.slice(2));
  await run(flags);
}

export { run, parseArgs };
