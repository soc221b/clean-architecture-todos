const unimport = require("unimport/unplugin").default;
const path = require("path");

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: "./src/node/main.ts",

  target: "node",

  output: {
    clean: true,
  },

  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    unimport.webpack({
      include: [/\.ts$/],

      imports: [
        {
          from: "node-fetch",
          name: "default",
          as: "fetch",
        },
      ],

      dirs: [
        "./src/core/data-sources/implements",
        "./src/core/repositories/implements",
        "./src/node/data-sources/implements",
      ],

      dts: "./unimport.d.ts",
    }),
  ],
};
