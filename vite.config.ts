import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

function prefixPublicAssetPathsPlugin() {
  let base = "/";

  const prefixPaths = (source: string) => {
    if (!base || base === "/") return source;

    const basePath = base.endsWith("/") ? base : `${base}/`;

    return source
      .replace(/(["'`])\/(images|md)\//g, (_match, quote, dir) => {
        return `${quote}${basePath}${dir}/`;
      })
      .replace(/url\((["']?)\/(images|md)\//g, (_match, quote, dir) => {
        return `url(${quote}${basePath}${dir}/`;
      });
  };

  return {
    name: "prefix-public-asset-paths",
    configResolved(config: { base: string }) {
      base = config.base;
    },
    generateBundle(_options: unknown, bundle: Record<string, any>) {
      for (const file of Object.values(bundle)) {
        if (file.type === "chunk") {
          file.code = prefixPaths(file.code);
        }

        if (file.type === "asset" && typeof file.source === "string") {
          file.source = prefixPaths(file.source);
        }
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? "/",
  plugins: [react(), svgr(), tailwindcss(), prefixPublicAssetPathsPlugin()],
  resolve: {
    alias: {
      "@": path.join(__dirname, "src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 10000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // if (id.includes("node_modules")) {
            // if (id.includes("react")) return "react";
            // if (id.includes("lodash")) return "lodash";
            // return "vendor";
          // }
          if (id.includes("/Accordion/")) {
            return "accordion";
          }
        },
      },
    },
  },
});
