import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { viteApiPlugin } from "./scripts/vite-api-plugin";
import { viteSingleFile } from "vite-plugin-singlefile";

const removeModuleScript = () => {
  return {
    name: "remove-module-script",
    enforce: "post" as const,
    generateBundle(options: any, bundle: any) {
      // 인라인된 모든 .html 산출물에서 type="module" 스크립트를 defer로 전환하여
      // file:// 프로토콜(서버 없이 브라우저 직접 오픈)에서도 동작하도록 한다.
      // 또한 번들에 남아 있는 import.meta.url을 location.href로 교체한다.
      // (일반 스크립트에서 import.meta는 사용 불가 → "Cannot use 'import.meta' outside a module" 오류 방지)
      for (const file of Object.values(bundle) as any[]) {
        if (file.fileName && file.fileName.endsWith(".html") && typeof file.source === "string") {
          file.source = file.source
            .replace(/<script type="module" crossorigin>/g, "<script defer>")
            .replace(/<script type="module">/g, "<script defer>")
            .replace(/\bimport\.meta\.url\b/g, "(document.currentScript?.src||location.href)");
        }
      }
    },
  };
};

// vite-plugin-singlefile은 코드 스플리팅을 비활성화하므로 다중 입력을 지원하지 않는다.
// 따라서 엔트리를 환경변수(SA_ENTRY)로 선택해 한 번에 하나씩 빌드하고, dist에 누적한다.
//   - suite          : webdesignsuite.html (모듈 1+2+3 통합, 탭 전환) — 기본값
//   - designSystem   : design-system.html  (모듈 1: 테마 조율 & 보조 유틸리티, 저장은 서버 연계 전용)
//   - guideAuthoring : guide-authoring.html(모듈 2: 가이드북 컴파일러, 클라이언트 컴파일 폴백)
//   - pptxInspector  : pptx-inspector.html (모듈 3: PPTX 디자인 인스펙터, 서버리스)
const ENTRY_MAP: Record<string, string> = {
  suite: "webdesignsuite.html",
  designSystem: "design-system.html",
  guideAuthoring: "guide-authoring.html",
  pptxInspector: "pptx-inspector.html",
};

const saEntry = process.env.SA_ENTRY && ENTRY_MAP[process.env.SA_ENTRY] ? process.env.SA_ENTRY : "suite";
const entryHtml = ENTRY_MAP[saEntry];

// 기본(suite) 빌드만 dist를 비우고, 나머지 모듈 빌드는 산출물을 누적한다.
const shouldEmptyOutDir = saEntry === "suite";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  base: "./",
  plugins: [
    react(),
    viteApiPlugin(),
    viteSingleFile({ removeViteModuleLoader: true }),
    removeModuleScript()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "buffer": path.resolve(__dirname, "./node_modules/buffer/index.js"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    emptyOutDir: shouldEmptyOutDir,
    rollupOptions: {
      input: path.resolve(__dirname, entryHtml),
    },
  },
}));
