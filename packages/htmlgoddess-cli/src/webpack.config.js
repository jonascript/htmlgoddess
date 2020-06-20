// const PACKAGE = require('../../../package.json');
const glob = require("glob");
const fs = require("fs");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlReplaceWebpackPlugin = require("html-replace-webpack-plugin");
const HtmlBeautifyPlugin = require("html-beautify-webpack-plugin");
const HtmlGoddessPlugin = require("htmlgoddess-webpack-plugin");
const htmlLoader = require("html-loader");
const styleLoader = require("style-loader");
const path = require("path");
const CWD_PATH = process.env.CWD_PATH || process.cwd();

function getWebpackConfig() {
  const plugins = [];
  const htmlFiles = glob.sync(CWD_PATH + "/src/content/**/*+(*.htm|*.html)");

  for (let x = 0; x < htmlFiles.length; x++) {
    const pathObj = path.parse(htmlFiles[x]);
    let templatePath = htmlFiles[x].replace(/.+src\/content\//, "");
    let templateName = "index.html";
    if (
      fs.existsSync("src/templates/" + path.dirname(templatePath) + ".html")
    ) {
      templateName = path.dirname(templatePath) + ".html";
    }

    plugins.push(
      new HtmlWebpackPlugin({
        filename: templatePath,
        templateParameters: {
          contentPath: htmlFiles[x],
        },
        template: "src/templates/" + templateName,
      })
    );
  }

  return {
    entry: path.join(CWD_PATH, "./src/css/index.css"), // Prevents unnecessary main.js from being included.
    output: {
      path: path.join(CWD_PATH, "./docs"),
    },
    mode: "development",
    stats: "errors-warnings",
    module: {
      rules: [
        {
          test: /\.html$/i, // Enables live reload
          loader: "html-loader",
        },
        {
          // For CSS modules
          // For pure CSS - /\.css$/i,
          // For Sass/SCSS - /\.((c|sa|sc)ss)$/i,
          // For Less - /\.((c|le)ss)$/i,
          test: /\.((c|sa|sc)ss)$/i,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                // Run `postcss-loader` on each CSS `@import`, do not forget that `sass-loader` compile non CSS `@import`'s into a single file
                // If you need run `sass-loader` and `postcss-loader` on each CSS `@import` please set it to `2`
                importLoaders: 1,
                // Automatically enable css modules for files satisfying `/\.module\.\w+$/i` RegExp.
                modules: { auto: true },
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
          loader: "url-loader",
          options: {
            limit: 8192,
          },
        },
      ],
    },
    plugins: [
      new HtmlGoddessPlugin(),
      ...plugins,
      new CleanWebpackPlugin({
        dry: false,
        cleanOnceBeforeBuildPatterns: ["**/*", "!CNAME"],
      }),
      new FixStyleOnlyEntriesPlugin({ silent: true }),
      new CopyPlugin({
        patterns: [
          {
            flatten: true,
            toType: "dir",
            from: CWD_PATH + "/src/css/*.css",
            to: "css",
          },
        ],
      }),
    ],
  };
}

module.exports = getWebpackConfig;
