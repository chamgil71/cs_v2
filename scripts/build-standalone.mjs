#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════
//  build-standalone.mjs
//  vite-plugin-singlefile은 다중 입력을 지원하지 않으므로, standalone 패키지를
//  엔트리별로 순차 빌드하여 dist/ 에 누적한다. (크로스 플랫폼: Windows/macOS/Linux)
//
//  산출물 (모두 서버 없이 file:// 로 브라우저에서 직접 열어 동작):
//    dist/standalone.html  — 모듈 1 + 2 통합 (탭 전환)
//    dist/module1.html     — 모듈 1: PPTX 디자인 인스펙터 (서버리스)
//    dist/module2.html     — 모듈 2: 가이드북 컴파일러 & 배색 빌더 (클라이언트 컴파일 폴백)
// ════════════════════════════════════════════════════════════════
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const configPath = path.join(rootDir, "vite.config.standalone.ts");

// 빌드 순서: main이 가장 먼저 실행되어 dist를 비우고(emptyOutDir),
// 이후 module1/module2가 동일 dist에 누적된다.
const TARGETS = ["main", "module1", "module2"];

const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";

function buildOne(entry) {
  return new Promise((resolve, reject) => {
    console.log(`\n▶ [${entry}] standalone 빌드 시작...`);
    const child = spawn(npxCmd, ["vite", "build", "--config", configPath], {
      cwd: rootDir,
      stdio: "inherit",
      shell: process.platform === "win32",
      env: { ...process.env, SA_ENTRY: entry },
    });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`[${entry}] 빌드 실패 (exit ${code})`));
    });
    child.on("error", reject);
  });
}

for (const entry of TARGETS) {
  await buildOne(entry);
}

console.log("\n✅ standalone 패키지 3종 빌드 완료 → dist/{standalone,module1,module2}.html");
