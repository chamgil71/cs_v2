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
      const htmlFile = Object.values(bundle).find(
        (file: any) => file.fileName && file.fileName.endsWith("standalone.html")
      ) as any;
      if (htmlFile && typeof htmlFile.source === "string") {
        htmlFile.source = htmlFile.source
          .replace(/<script type="module" crossorigin>/g, "<script defer>")
          .replace(/<script type="module">/g, "<script defer>");
      }
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
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
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "standalone.html"),
      },
    },
  },
}));
