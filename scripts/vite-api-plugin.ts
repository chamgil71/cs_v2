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

        const method = req.method;
        const rootDir = process.cwd();
        const mdSrcDir = path.join(rootDir, "md_src");
        const scratchDir = path.join(rootDir, "scratch");

        if (!fs.existsSync(scratchDir)) {
          fs.mkdirSync(scratchDir, { recursive: true });
        }

        try {
          // 1. GET /api/list-styles
          if (url.pathname === "/api/list-styles" && method === "GET") {
            const stylesPath = path.join(rootDir, "config", "styles.json");
            if (fs.existsSync(stylesPath)) {
              const src = fs.readFileSync(stylesPath, "utf8")
                .replace(/\/\/[^\n]*/g, "")
                .replace(/\/\*[\s\S]*?\*\//g, "");
              res.setHeader("Content-Type", "application/json; charset=utf-8");
              res.end(JSON.stringify(JSON.parse(src)));
            } else {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: "styles.json not found" }));
            }
            return;
          }

          // Helper function to validate styles.json schema integrity
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
            fs.writeFileSync(stylesPath, JSON.stringify(styles, null, 2), "utf8");
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

          // Helper to parse JSON body
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

          // 4. POST /api/preview
          if (url.pathname === "/api/preview" && method === "POST") {
            const { markdown, mode, style } = await getBody();
            if (!markdown || !mode) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "Missing markdown or mode parameter" }));
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
              } else {
                throw new Error("Invalid preview mode");
              }

              await execAsync(cmd);

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
              } else {
                throw new Error("Invalid format");
              }

              await execAsync(cmd);

              if (fs.existsSync(tempOut)) {
                const downloadName = filename || `converted_file.${outExt}`;
                const contentType = format === "pptx" 
                  ? "application/vnd.openxmlformats-officedocument.presentationml.presentation"
                  : "text/html; charset=utf-8";

                res.setHeader("Content-Type", contentType);
                res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(downloadName)}"`);
                
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
            
            const inPath = path.join(rootDir, inputDir || "md_src");
            const outPath = path.join(rootDir, outputDir || "publish");
            
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
            
            // Generate portal index.html inside the outputDir (e.g. publish/index.html)
            const portalTitle = "Creative Spark - 가이드북 포털";
            const portalItemsHtml = convertedFiles.map(f => {
              const linksHtml = f.formats.map(fmt => {
                const linkPath = path.relative(outPath, path.join(rootDir, fmt.relPath)).replace(/\\/g, "/");
                return `
                <a href="./${linkPath}" target="_blank" class="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-600 rounded-lg text-xs font-semibold transition-all">
                  <span>${fmt.label}</span>
                </a>`;
              }).join("\n");

              return `
              <div class="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div class="flex items-center gap-3 mb-4">
                  <span class="text-2xl">📄</span>
                  <h3 class="font-bold text-slate-800 text-base">${f.name}</h3>
                </div>
                <div class="flex flex-wrap gap-2">
                  ${linksHtml}
                </div>
              </div>`;
            }).join("\n");
            
            const portalHtml = `
<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${portalTitle}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 min-h-screen font-sans">
  <header class="bg-[#1e3a5f] text-white px-6 py-8 shadow-md">
    <div class="max-w-5xl mx-auto flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">📚 Creative Spark V2.0 가이드 허브</h1>
        <p class="text-xs text-blue-200 mt-1">마크다운에서 일괄 변환된 가이드북 포털 목록</p>
      </div>
      <div class="text-[11px] bg-blue-500/30 text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full font-semibold">
        생성일: ${new Date().toLocaleString("ko-KR")}
      </div>
    </div>
  </header>
  <main class="max-w-5xl mx-auto p-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      ${portalItemsHtml}
    </div>
  </main>
</body>
</html>
            `;
            
            const portalIndexPath = path.join(outPath, "index.html");
            fs.writeFileSync(portalIndexPath, portalHtml.trim(), "utf8");
            
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify({
              success: true,
              message: `총 ${convertedFiles.length}개의 가이드 파일이 일괄 변환되었습니다.`,
              convertedFiles,
              portalIndex: `/${path.relative(rootDir, portalIndexPath).replace(/\\/g, "/")}`
            }));
            return;
          }

          // 5-3. POST /api/select-folder
          if (url.pathname === "/api/select-folder" && method === "POST") {
            try {
              const rootDirEscaped = rootDir.replace(/\\/g, "\\\\");
              const psCommand = `Add-Type -AssemblyName System.Windows.Forms; $f = New-Object System.Windows.Forms.FolderBrowserDialog; $f.Description = '변환 또는 저장할 폴더를 선택하십시오.'; $f.SelectedPath = '${rootDirEscaped}'; if ($f.ShowDialog() -eq 'OK') { Write-Output $f.SelectedPath }`;
              const { stdout } = await execAsync(`powershell -NoProfile -Command "${psCommand}"`);
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

            // Ensure filename has .md extension
            let baseName = filename.replace(/\.[^/.]+$/, "");
            const mdFilename = baseName + ".md";

            const savedFiles: string[] = [];

            // 1. If saveOption is guideHub, save to md_src/guides and trigger build-publish
            if (saveOption === "guideHub") {
              const guideMdPath = path.join(mdSrcDir, "guides", mdFilename);
              fs.mkdirSync(path.dirname(guideMdPath), { recursive: true });
              fs.writeFileSync(guideMdPath, markdown, "utf8");
              savedFiles.push(guideMdPath);
              
              // Run build-publish to compile guide hub & update standalone.html
              try {
                console.log(`[API] Rebuilding guide hub for ${mdFilename}...`);
                await execAsync("node scripts/build-publish.mjs");
              } catch (buildErr: any) {
                console.error("Error building guides:", buildErr);
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
                
                if (!fs.existsSync(formatOutDir)) {
                  fs.mkdirSync(formatOutDir, { recursive: true });
                }
                
                if (format === "html") {
                  outFilename = `${baseName}.html`;
                  const outPath = path.join(formatOutDir, outFilename);
                  cmd = `node scripts/build-guide.mjs "${tempMd}" --out "${outPath}"${styleFlag}`;
                  await execAsync(cmd);
                  savedFiles.push(outPath);
                } else if (format === "presentation") {
                  outFilename = `${baseName}_presentation.html`;
                  const outPath = path.join(formatOutDir, outFilename);
                  cmd = `node scripts/build-presentation.mjs "${tempMd}" "${outPath}"${styleFlag}`;
                  await execAsync(cmd);
                  savedFiles.push(outPath);
                } else if (format === "pptx") {
                  outFilename = `${baseName}.pptx`;
                  const outPath = path.join(formatOutDir, outFilename);
                  const noCoverFlag = (options && options.noCover) ? " --no-cover" : "";
                  cmd = `node scripts/md-to-pptx.mjs "${tempMd}" --out "${outPath}"${styleFlag}${noCoverFlag}`;
                  await execAsync(cmd);
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
          res.end(JSON.stringify({ error: e.message || "Internal Server Error" }));
        }
      });
    }
  };
}
