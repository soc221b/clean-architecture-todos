import path from "path";
import Unimport from "unimport/dist/unplugin.mjs";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    Unimport.vite({
      include: [/\.ts$/],

      imports: [
        {
          from: "node-fetch",
          name: "default",
          as: "fetch",
        },
      ],

      dirs: [
        "./src/core/use-cases",
        "./src/core/repositories/implements",
        "./src/core/data-sources/implements",
      ],

      dts: "./unimport.d.ts",
    }),
  ],
});
