import { Plugin } from "vite";
import fs from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

// Helper to recursively find markdown files
function getMarkdownFiles(dir: string, baseDir: string = dir): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getMarkdownFiles(filePath, baseDir));
    } else if (file.toLowerCase().endsWith(".md")) {
      results.push(path.relative(baseDir, filePath));
    }
  });
  return results;
}

// Generate simple Markdown Table of Contents from markdown text
function generateTOC(markdown: string): string {
  const lines = markdown.split(/\r?\n/);
  const tocLines: string[] = [];
  let inFrontmatter = false;
  let skippedFrontmatter = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "---") {
      if (!inFrontmatter && !skippedFrontmatter) {
        inFrontmatter = true;
      } else if (inFrontmatter) {
        inFrontmatter = false;
        skippedFrontmatter = true;
      }
      continue;
    }
    if (inFrontmatter) continue;

    // Detect headers
    const h1Match = line.match(/^#\s+(.+)$/);
    const h2Match = line.match(/^##\s+(.+)$/);

    if (h1Match) {
      const title = h1Match[1].trim();
      const anchor = title.toLowerCase().replace(/[^a-z0-9ㄱ-ㅎㅏ-ㅣ가-힣\s-]/g, "").replace(/\s+/g, "-");
      tocLines.push(`- [${title}](#${anchor})`);
    } else if (h2Match) {
      const title = h2Match[1].trim();
      const anchor = title.toLowerCase().replace(/[^a-z0-9ㄱ-ㅎㅏ-ㅣ가-힣\s-]/g, "").replace(/\s+/g, "-");
      tocLines.push(`  - [${title}](#${anchor})`);
    }
  }

  if (tocLines.length === 0) return "";
  return "\n## 📋 목차\n" + tocLines.join("\n") + "\n\n---\n";
}

// Inject TOC right after frontmatter
function injectTOC(markdown: string): string {
  const parts = markdown.split("---");
  if (parts.length >= 3) {
    const toc = generateTOC(markdown);
    // parts[0] is empty before first ---, parts[1] is frontmatter content
    // We insert TOC at the start of parts[2]
    parts[2] = toc + parts[2];
    return parts.join("---");
  }
  return generateTOC(markdown) + markdown;
}

export function viteApiPlugin(): Plugin {
  return {
    name: "vite-api-plugin",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || "", `http://${req.headers.host}`);
        if (!url.pathname.startsWith("/api/")) {
          return next();
        }

        // Set CORS headers for local/cross-origin accessibility
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          res.end();
          return;
        }

        const method = req.method;
        const rootDir = process.cwd();
        const mdSrcDir = path.join(rootDir, "md_src");
        const scratchDir = path.join(rootDir, "scratch");

        if (!fs.existsSync(scratchDir)) {
          fs.mkdirSync(scratchDir, { recursive: true });
        }

        // Define helper functions at the top of middlewares to prevent TDZ errors
        const getBody = (): Promise<any> => {
          return new Promise((resolve, reject) => {
            let body = "";
            req.on("data", (chunk) => { body += chunk; });
            req.on("end", () => {
              try {
                resolve(body ? JSON.parse(body) : {});
              } catch (e) {
                reject(new Error("Invalid JSON body"));
              }
            });
          });
        };

        const validateStylesSchema = (stylesObj: any): string | null => {
          if (typeof stylesObj !== "object" || stylesObj === null) {
            return "styles는 반드시 객체 타입이어야 합니다.";
          }
          const hexRegex = /^#[0-9A-Fa-f]{6}$/;
          for (const key of Object.keys(stylesObj)) {
            const theme = stylesObj[key];
            if (typeof theme !== "object" || theme === null) {
              return `테마 '${key}'의 정의가 올바르지 않습니다.`;
            }
            if (!theme.label || typeof theme.label !== "string" || theme.label.trim() === "") {
              return `테마 '${key}'의 한글 명칭(label)이 누락되었거나 유효하지 않습니다.`;
            }
            
            // 필수 색상값 검사 (brand, brandDark, brandLight)
            const colorsToCheck = ['brand', 'brandDark', 'brandLight'];
            for (const colKey of colorsToCheck) {
              const colVal = theme[colKey];
              if (!colVal || typeof colVal !== "string" || !hexRegex.test(colVal)) {
                return `테마 '${key}'의 색상 속성 '${colKey}'가 누락되었거나 올바른 HEX 형태(#FFFFFF)가 아닙니다.`;
              }
            }
          }
          return null;
        };

        // Path validation helper for Path Traversal protection
        const assertPathUnderDir = (targetPath: string, parentDir: string, paramName: string) => {
          const resolvedTarget = path.resolve(targetPath);
          const resolvedParent = path.resolve(parentDir);
          if (!resolvedTarget.startsWith(resolvedParent + path.sep) && resolvedTarget !== resolvedParent) {
            throw new Error(`[보안] ${paramName}: 상위 디렉토리 탈출 거부 → ${resolvedTarget}`);
          }
        };

        // Validation helpers for Command Injection protection
        const validateStyleKeyword = async (style: string): Promise<boolean> => {
          if (!style) return true; // empty/falsy is allowed
          const stylesPath = path.join(rootDir, "config", "styles.json");
          if (fs.existsSync(stylesPath)) {
            try {
              const src = fs.readFileSync(stylesPath, "utf8")
                .replace(/\/\/[^\n]*/g, "")
                .replace(/\/\*[\s\S]*?\*\//g, "");
              const parsed = JSON.parse(src);
              return Object.keys(parsed).includes(style);
            } catch {
              return false;
            }
          }
          return false;
        };

        const SAFE_FILENAME = /^[a-zA-Z0-9가-힣_\-\s.()]{1,100}$/;
        const validateFilename = (filename: string): boolean => {
          if (!filename) return true;
          return SAFE_FILENAME.test(filename);
        };

        const validateFormat = (format: string): boolean => {
          if (!format) return false;
          return ["html", "presentation", "pptx"].includes(format);
        };

        const escapeHtml = (s: string): string => {
          return s.replace(/[&<>"']/g, c =>
            ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
        };

        try {
          // 1. GET /api/list-styles
          if (url.pathname === "/api/list-styles" && method === "GET") {
            const stylesPath = path.join(rootDir, "config", "styles.json");
            if (fs.existsSync(stylesPath)) {
              const src = fs.readFileSync(stylesPath, "utf8")
                .replace(/\/\/[^\n]*/g, "")
                .replace(/\/\*[\s\S]*?\*\//g, "");
              // "$"로 시작하는 키(예: "$comment")는 JSONC 주석 관용구 — 실제 테마가 아니므로 클라이언트에 노출하지 않는다.
              const parsed = JSON.parse(src);
              const themesOnly = Object.fromEntries(
                Object.entries(parsed).filter(([key]) => !key.startsWith("$"))
              );
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.end(JSON.stringify(themesOnly));
            } else {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: "styles.json not found" }));
            }
            return;
          }

          // 1-2. POST /api/save-styles
          if (url.pathname === "/api/save-styles" && method === "POST") {
            const { styles } = await getBody();
            if (!styles || typeof styles !== "object") {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "Missing or invalid styles object" }));
              return;
            }

            // Schema Validator 실행
            const schemaError = validateStylesSchema(styles);
            if (schemaError) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.end(JSON.stringify({ error: `디자인 규격 오류: ${schemaError}` }));
              return;
            }

            const stylesPath = path.join(rootDir, "config", "styles.json");
            // GET에서 "$"-키를 제외하고 내려주므로, 저장 시 기존 파일의 "$"-키(예: "$comment")를 병합해 보존한다.
            let preservedMetaKeys: Record<string, unknown> = {};
            if (fs.existsSync(stylesPath)) {
              try {
                const existingSrc = fs.readFileSync(stylesPath, "utf8")
                  .replace(/\/\/[^\n]*/g, "")
                  .replace(/\/\*[\s\S]*?\*\//g, "");
                const existing = JSON.parse(existingSrc);
                preservedMetaKeys = Object.fromEntries(
                  Object.entries(existing).filter(([key]) => key.startsWith("$"))
                );
              } catch { /* 기존 파일 파싱 실패 시 메타 키 보존을 건너뛴다 */ }
            }
            const merged = { ...preservedMetaKeys, ...styles };
            fs.writeFileSync(stylesPath, JSON.stringify(merged, null, 2), "utf8");
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify({ success: true, message: "테마가 성공적으로 저장되었습니다." }));
            return;
          }

          // 2. GET /api/list-files
          if (url.pathname === "/api/list-files" && method === "GET") {
            const files = getMarkdownFiles(mdSrcDir);
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify({ files }));
            return;
          }

          // 3. GET /api/load-file?path=...
          if (url.pathname === "/api/load-file" && method === "GET") {
            const relPath = url.searchParams.get("path");
            if (!relPath) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "Missing path query parameter" }));
              return;
            }
            const safePath = path.join(mdSrcDir, path.normalize(relPath).replace(/^(\.\.[\/\\])+/, ""));
            if (fs.existsSync(safePath) && safePath.startsWith(mdSrcDir)) {
              const content = fs.readFileSync(safePath, "utf8");
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.end(JSON.stringify({ content }));
            } else {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: "File not found" }));
            }
            return;
          }

          // 4. POST /api/preview
          if (url.pathname === "/api/preview" && method === "POST") {
            const { markdown, mode, style } = await getBody();
            if (!markdown || !mode) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "Missing markdown or mode parameter" }));
              return;
            }
            if (style && !(await validateStyleKeyword(style))) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "허용되지 않는 스타일 ID입니다." }));
              return;
            }
            if (mode !== "html" && mode !== "presentation") {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "허용되지 않는 미리보기 모드입니다." }));
              return;
            }

            const tempMd = path.join(scratchDir, `preview_${Date.now()}.md`);
            const tempHtml = path.join(scratchDir, `preview_${Date.now()}.html`);

            fs.writeFileSync(tempMd, markdown, "utf8");

            try {
              let cmd = "";
              const styleFlag = style ? ` --style ${style}` : "";
              if (mode === "html") {
                cmd = `node scripts/build-guide.mjs "${tempMd}" --out "${tempHtml}"${styleFlag}`;
              } else if (mode === "presentation") {
                cmd = `node scripts/build-presentation.mjs "${tempMd}" "${tempHtml}"${styleFlag}`;
              }

              await execAsync(cmd, { timeout: 60_000 });

              if (fs.existsSync(tempHtml)) {
                const htmlContent = fs.readFileSync(tempHtml, "utf8");
                res.setHeader("Content-Type", "text/html; charset=utf-8");
                res.end(htmlContent);
              } else {
                throw new Error("Preview generation failed - output file missing");
              }
            } finally {
              // Clean up temp files
              try { if (fs.existsSync(tempMd)) fs.unlinkSync(tempMd); } catch {}
              try { if (fs.existsSync(tempHtml)) fs.unlinkSync(tempHtml); } catch {}
            }
            return;
          }

          // 5. POST /api/convert
          if (url.pathname === "/api/convert" && method === "POST") {
            const { markdown, format, filename, style, options } = await getBody();
            if (!markdown || !format) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "Missing markdown or format parameter" }));
              return;
            }
            if (!validateFormat(format)) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "허용되지 않는 포맷입니다." }));
              return;
            }
            if (filename && !validateFilename(filename)) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "파일명에 허용되지 않는 문자가 포함되었습니다." }));
              return;
            }
            if (style && !(await validateStyleKeyword(style))) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "허용되지 않는 스타일 ID입니다." }));
              return;
            }

            // Apply options on markdown text
            let processedMarkdown = markdown;
            if (options && options.toc && format === "html") {
              processedMarkdown = injectTOC(markdown);
            }

            const tempMd = path.join(scratchDir, `convert_${Date.now()}.md`);
            const outExt = format === "pptx" ? "pptx" : "html";
            const tempOut = path.join(scratchDir, `convert_${Date.now()}.${outExt}`);

            fs.writeFileSync(tempMd, processedMarkdown, "utf8");

            try {
              let cmd = "";
              const styleFlag = style ? ` --style ${style}` : "";
              
              if (format === "html") {
                cmd = `node scripts/build-guide.mjs "${tempMd}" --out "${tempOut}"${styleFlag}`;
              } else if (format === "presentation") {
                cmd = `node scripts/build-presentation.mjs "${tempMd}" "${tempOut}"${styleFlag}`;
              } else if (format === "pptx") {
                const noCoverFlag = (options && options.noCover) ? " --no-cover" : "";
                cmd = `node scripts/md-to-pptx.mjs "${tempMd}" --out "${tempOut}"${styleFlag}${noCoverFlag}`;
              }

              await execAsync(cmd);

              if (fs.existsSync(tempOut)) {
                const downloadName = filename || `converted_file.${outExt}`;
                const contentType = format === "pptx" 
                  ? "application/vnd.openxmlformats-officedocument.presentationml.presentation"
                  : "text/html; charset=utf-8";

                res.setHeader("Content-Type", contentType);
                
                // Sanitize filename for Content-Disposition to prevent header injection
                const safeDownloadName = downloadName
                  .replace(/[^\w\s\-\.가-힣]/g, "_")
                  .slice(0, 200);
                res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(safeDownloadName)}`);
                
                const fileStream = fs.createReadStream(tempOut);
                fileStream.pipe(res);
              } else {
                throw new Error("Convert failed - output file missing");
              }
            } finally {
              // Clean up temp files after a slight delay to allow streaming
              setTimeout(() => {
                try { if (fs.existsSync(tempMd)) fs.unlinkSync(tempMd); } catch {}
                try { if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut); } catch {}
              }, 5000);
            }
            return;
          }

          // 5-2. POST /api/bulk-convert
          if (url.pathname === "/api/bulk-convert" && method === "POST") {
            const { inputDir, outputDir, style, formats, options } = await getBody();
            const targetFormats = (formats && Array.isArray(formats) && formats.length > 0) ? formats : ["html"];
            
            for (const fmt of targetFormats) {
              if (!validateFormat(fmt)) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "허용되지 않는 포맷이 포함되어 있습니다." }));
                return;
              }
            }
            if (style && !(await validateStyleKeyword(style))) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "허용되지 않는 스타일 ID입니다." }));
              return;
            }

            const inPath = path.join(rootDir, inputDir || "md_src");
            const outPath = path.join(rootDir, outputDir || "publish");
            
            // Validate Path Traversal
            assertPathUnderDir(inPath, rootDir, "inputDir");
            assertPathUnderDir(outPath, rootDir, "outputDir");

            if (!fs.existsSync(inPath)) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.end(JSON.stringify({ error: `입력 디렉토리(${inputDir})가 존재하지 않습니다.` }));
              return;
            }
            
            if (!fs.existsSync(outPath)) {
              fs.mkdirSync(outPath, { recursive: true });
            }
            
            // Find all .md files recursively
            const files = getMarkdownFiles(inPath);
            const convertedFiles: Array<{ name: string; formats: Array<{ format: string; label: string; relPath: string }> }> = [];
            const styleFlag = style ? ` --style ${style}` : "";
            
            for (const relFile of files) {
              const fullInFile = path.join(inPath, relFile);
              const baseName = relFile.replace(/\.[^/.]+$/, "");
              
              const fileFormats: Array<{ format: string; label: string; relPath: string }> = [];
              
              for (const format of targetFormats) {
                let outFilename = "";
                let cmd = "";
                
                if (format === "html") {
                  outFilename = `${baseName}.html`;
                  const fullOutFile = path.join(outPath, outFilename);
                  fs.mkdirSync(path.dirname(fullOutFile), { recursive: true });
                  cmd = `node scripts/build-guide.mjs "${fullInFile}" --out "${fullOutFile}"${styleFlag}`;
                  await execAsync(cmd);
                  fileFormats.push({
                    format: "html",
                    label: "📄 HTML Guide",
                    relPath: path.join(outputDir || "publish", outFilename).replace(/\\/g, "/")
                  });
                } else if (format === "presentation") {
                  outFilename = `${baseName}_presentation.html`;
                  const fullOutFile = path.join(outPath, outFilename);
                  fs.mkdirSync(path.dirname(fullOutFile), { recursive: true });
                  cmd = `node scripts/build-presentation.mjs "${fullInFile}" "${fullOutFile}"${styleFlag}`;
                  await execAsync(cmd);
                  fileFormats.push({
                    format: "presentation",
                    label: "🖥️ Presentation Slides",
                    relPath: path.join(outputDir || "publish", outFilename).replace(/\\/g, "/")
                  });
                } else if (format === "pptx") {
                  outFilename = `${baseName}.pptx`;
                  const fullOutFile = path.join(outPath, outFilename);
                  fs.mkdirSync(path.dirname(fullOutFile), { recursive: true });
                  const noCoverFlag = (options && options.noCover) ? " --no-cover" : "";
                  cmd = `node scripts/md-to-pptx.mjs "${fullInFile}" --out "${fullOutFile}"${styleFlag}${noCoverFlag}`;
                  await execAsync(cmd);
                  fileFormats.push({
                    format: "pptx",
                    label: "📊 PPTX Slides",
                    relPath: path.join(outputDir || "publish", outFilename).replace(/\\/g, "/")
                  });
                }
              }
              
              convertedFiles.push({
                name: path.basename(fullInFile),
                formats: fileFormats
              });
            }
            
            // Generate portal index.html inside the outputDir (e.g. publish/index.html).
            // 인라인 CSS만 사용 — 예전엔 Tailwind CDN 스크립트를 불러왔는데, 이 프로젝트의 다른 오프라인
            // 산출물들과 달리 인터넷 연결이 있어야만 정상적으로 보이는 상태였다(2026-09-02에 제거).
            const portalTitle = "Creative Spark - 가이드북 포털";
            const portalItemsHtml = convertedFiles.map(f => {
              const linksHtml = f.formats.map(fmt => {
                const linkPath = path.relative(outPath, path.join(rootDir, fmt.relPath)).replace(/\\/g, "/");
                return `<a href="./${linkPath}" target="_blank">${escapeHtml(fmt.label)}</a>`;
              }).join("\n");

              return `<div class="card"><div class="card-head"><span>📄</span><h3>${escapeHtml(f.name)}</h3></div><div class="links">${linksHtml}</div></div>`;
            }).join("\n");

            const portalHtml = `<!doctype html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${portalTitle}</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Pretendard","Noto Sans KR",sans-serif;background:#f8fafc;color:#1e293b;}
  header{background:#1e3a5f;color:#fff;padding:28px 24px;box-shadow:0 1px 4px rgba(0,0,0,.1)}
  .header-inner{max-width:960px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}
  h1{font-size:22px;margin:0;font-weight:700}
  .sub{font-size:12px;color:#bfdbfe;margin-top:4px}
  .stamp{font-size:11px;background:rgba(59,130,246,.25);border:1px solid rgba(96,165,250,.3);color:#bfdbfe;padding:4px 12px;border-radius:999px;font-weight:600}
  main{max-width:960px;margin:0 auto;padding:32px 24px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px}
  .card{padding:22px;background:#fff;border:1px solid #e2e8f0;border-radius:14px;box-shadow:0 1px 3px rgba(0,0,0,.04)}
  .card-head{display:flex;align-items:center;gap:10px;margin-bottom:14px}
  .card-head h3{font-size:15px;font-weight:700;margin:0;color:#1e293b}
  .links{display:flex;flex-wrap:wrap;gap:8px}
  .links a{font-size:12px;font-weight:600;color:#334155;background:#f1f5f9;border:1px solid #e2e8f0;padding:7px 12px;border-radius:8px;text-decoration:none}
  .links a:hover{background:#eff6ff;color:#2563eb}
</style>
</head>
<body>
<header><div class="header-inner">
  <div><h1>📚 Creative Spark V2.0 가이드 허브</h1><p class="sub">마크다운에서 일괄 변환된 가이드북 포털 목록</p></div>
  <div class="stamp">생성일: ${new Date().toLocaleString("ko-KR")}</div>
</div></header>
<main><div class="grid">
${portalItemsHtml}
</div></main>
</body>
</html>
`;

            const portalIndexPath = path.join(outPath, "index.html");
            fs.writeFileSync(portalIndexPath, portalHtml, "utf8");

            // Vite 개발서버는 public/ 만 정적으로 서빙한다 — outputDir이 public/ 밖이면(기본값 publish/가 그렇다)
            // 이 링크는 브라우저에서 열리지 않으므로, 그럴 때는 portalIndex를 null로 돌려줘 프론트가 죽은 링크를
            // 만들지 않게 한다. 파일 자체는 그대로 outPath에 생성된다 — 로컬 파일 탐색기로 열면 된다.
            const publicRoot = path.join(rootDir, "public");
            const isServable = outPath === publicRoot || outPath.startsWith(publicRoot + path.sep);
            const portalIndex = isServable
              ? `/${path.relative(publicRoot, portalIndexPath).replace(/\\/g, "/")}`
              : null;

            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify({
              success: true,
              message: isServable
                ? `총 ${convertedFiles.length}개의 가이드 파일이 일괄 변환되었습니다.`
                : `총 ${convertedFiles.length}개의 가이드 파일이 일괄 변환되었습니다.\n(${path.relative(rootDir, outPath)} 폴더에 저장됨 — 개발서버 미리보기는 public/ 하위 출력에서만 가능합니다.)`,
              convertedFiles,
              portalIndex
            }));
            return;
          }

          // 5-3. POST /api/select-folder
          if (url.pathname === "/api/select-folder" && method === "POST") {
            try {
              if (process.platform === "win32") {
                const rootDirEscaped = rootDir.replace(/\\/g, "\\\\");
                const psCommand = `Add-Type -AssemblyName System.Windows.Forms; $owner = New-Object System.Windows.Forms.Form; $owner.TopMost = $true; $f = New-Object System.Windows.Forms.FolderBrowserDialog; $f.Description = '변환 또는 저장할 폴더를 선택하십시오.'; $f.SelectedPath = '${rootDirEscaped}'; if ($f.ShowDialog($owner) -eq [System.Windows.Forms.DialogResult]::OK) { Write-Output $f.SelectedPath }`;
                const { stdout } = await execAsync(`powershell -NoProfile -Command "${psCommand}"`, { timeout: 120000 });
                const selectedPath = stdout.trim();
                
                if (selectedPath) {
                  let resultPath = selectedPath;
                  if (selectedPath.toLowerCase().startsWith(rootDir.toLowerCase())) {
                    resultPath = path.relative(rootDir, selectedPath).replace(/\\/g, "/");
                  }
                  res.setHeader("Content-Type", "application/json; charset=utf-8");
                  res.end(JSON.stringify({ selectedPath: resultPath }));
                } else {
                  res.setHeader("Content-Type", "application/json; charset=utf-8");
                  res.end(JSON.stringify({ selectedPath: null }));
                }
              } else if (process.platform === "darwin") {
                const appleScript = `osascript -e 'tell application "System Events" to activate' -e 'POSIX path of (choose folder with prompt "변환 또는 저장할 폴더를 선택하십시오." default location "${rootDir}")'`;
                const { stdout } = await execAsync(appleScript);
                const selectedPath = stdout.trim();
                
                if (selectedPath) {
                  let resultPath = selectedPath;
                  if (selectedPath.toLowerCase().startsWith(rootDir.toLowerCase())) {
                    resultPath = path.relative(rootDir, selectedPath).replace(/\\/g, "/");
                  }
                  res.setHeader("Content-Type", "application/json; charset=utf-8");
                  res.end(JSON.stringify({ selectedPath: resultPath }));
                } else {
                  res.setHeader("Content-Type", "application/json; charset=utf-8");
                  res.end(JSON.stringify({ selectedPath: null }));
                }
              } else {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json; charset=utf-8");
                res.end(JSON.stringify({ error: "이 운영체제에서는 폴더 다이얼로그를 지원하지 않습니다. 경로를 수동으로 입력해 주세요." }));
              }
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.end(JSON.stringify({ error: err.message }));
            }
            return;
          }

          // 6. POST /api/save-generate
          if (url.pathname === "/api/save-generate" && method === "POST") {
            const { markdown, filename, outputPath, saveOption, formats, style, options } = await getBody();
            if (!markdown || !filename || !formats || !Array.isArray(formats)) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "Missing required parameters: markdown, filename, formats" }));
              return;
            }
            if (filename && !validateFilename(filename)) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "파일명에 허용되지 않는 문자가 포함되었습니다." }));
              return;
            }
            for (const fmt of formats) {
              if (!validateFormat(fmt)) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "허용되지 않는 포맷이 포함되어 있습니다." }));
                return;
              }
            }
            if (style && !(await validateStyleKeyword(style))) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "허용되지 않는 스타일 ID입니다." }));
              return;
            }

            // Ensure filename has .md extension
            const baseName = filename.replace(/\.[^/.]+$/, "");
            const mdFilename = baseName + ".md";

            const savedFiles: string[] = [];
            let portalUrl: string | null = null;

            // 1. saveOption "guideHub": md_src/guides에 영구 저장하고 가이드 컬렉션 전체를 재빌드.
            //    출력은 public/ 로 향한다 — Vite 개발서버는 public/ 만 정적으로 서빙하므로(publish/는 안 됨),
            //    저장 직후 바로 미리볼 수 있는 링크(portalUrl)를 만들려면 여기로 빌드해야 한다.
            if (saveOption === "guideHub") {
              const guideMdPath = path.join(mdSrcDir, "guides", mdFilename);
              fs.mkdirSync(path.dirname(guideMdPath), { recursive: true });
              fs.writeFileSync(guideMdPath, markdown, "utf8");
              savedFiles.push(guideMdPath);

              try {
                console.log(`[API] Rebuilding guide collection for ${mdFilename}...`);
                await execAsync("node scripts/sync-guides-index.mjs", { timeout: 60_000 });
                await execAsync(
                  "node scripts/build-folder.mjs --dir guides --out-dir public --guide --presentation --pptx --hub --onepage",
                  { timeout: 180_000 }
                );
                portalUrl = "/guides-onepage.html";
              } catch (buildErr: any) {
                console.error("Error building guide collection:", buildErr);
                // Continue despite build error so files are still created in output directory
              }
            }

            // 2. Generate formats in the output directory
            const tempMd = path.join(scratchDir, `save_gen_${Date.now()}.md`);
            
            // Inject TOC for HTML format if selected
            let processedMarkdown = markdown;
            if (options && options.toc) {
              processedMarkdown = injectTOC(markdown);
            }
            fs.writeFileSync(tempMd, processedMarkdown, "utf8");

            try {
              const styleFlag = style ? ` --style ${style}` : "";
              
              for (const format of formats) {
                let outFilename = "";
                let cmd = "";
                
                // Determine format-specific outDir if not globally specified
                let formatOutDir = rootDir;
                if (outputPath) {
                  formatOutDir = path.isAbsolute(outputPath) ? outputPath : path.join(rootDir, outputPath);
                } else {
                  if (format === "html") {
                    formatOutDir = path.join(rootDir, "publish");
                  } else if (format === "presentation") {
                    formatOutDir = path.join(rootDir, "storage", "presentation");
                  } else if (format === "pptx") {
                    formatOutDir = path.join(rootDir, "storage", "pptx");
                  }
                }
                
                // Validate Path Traversal
                assertPathUnderDir(formatOutDir, rootDir, "outputPath");

                if (!fs.existsSync(formatOutDir)) {
                  fs.mkdirSync(formatOutDir, { recursive: true });
                }
                
                const EXEC_TIMEOUT = { timeout: 120_000 }; // 120초 타임아웃
                if (format === "html") {
                  outFilename = `${baseName}.html`;
                  const outPath = path.join(formatOutDir, outFilename);
                  cmd = `node scripts/build-guide.mjs "${tempMd}" --out "${outPath}"${styleFlag}`;
                  await execAsync(cmd, EXEC_TIMEOUT);
                  savedFiles.push(outPath);
                } else if (format === "presentation") {
                  outFilename = `${baseName}_presentation.html`;
                  const outPath = path.join(formatOutDir, outFilename);
                  cmd = `node scripts/build-presentation.mjs "${tempMd}" "${outPath}"${styleFlag}`;
                  await execAsync(cmd, EXEC_TIMEOUT);
                  savedFiles.push(outPath);
                } else if (format === "pptx") {
                  outFilename = `${baseName}.pptx`;
                  const outPath = path.join(formatOutDir, outFilename);
                  const noCoverFlag = (options && options.noCover) ? " --no-cover" : "";
                  cmd = `node scripts/md-to-pptx.mjs "${tempMd}" --out "${outPath}"${styleFlag}${noCoverFlag}`;
                  await execAsync(cmd, EXEC_TIMEOUT);
                  savedFiles.push(outPath);
                }
              }
            } finally {
              try { if (fs.existsSync(tempMd)) fs.unlinkSync(tempMd); } catch {}
            }

            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify({
              success: true,
              savedFiles,
              portalUrl,
              message: `성공적으로 파일이 생성 및 저장되었습니다.\n생성 파일: ${savedFiles.map(f => path.basename(f)).join(", ")}`
            }));
            return;
          }

          // Fallthrough
          res.statusCode = 404;
          res.end(JSON.stringify({ error: "Not Found" }));

        } catch (e: any) {
          console.error("API error:", e);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify({ error: "요청 처리 중 오류가 발생했습니다." }));
        }
      });
    }
  };
}
