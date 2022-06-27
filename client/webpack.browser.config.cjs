const unimport = require("unimport/unplugin").default;
const htmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: "./src/browser/main.ts",

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
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  plugins: [
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html"),
    }),

    unimport.webpack({
      include: [/\.ts$/],

      dirs: [
        "./src/core/data-sources/implements",
        "./src/core/repositories/implements",
        "./src/browser/data-sources/implements",
      ],

      dts: "./unimport.d.ts",
    }),
  ],

  devServer: {
    port: 3000,
  },
};
