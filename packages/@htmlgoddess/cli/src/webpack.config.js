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
const HtmlGoddessPlugin = require("@htmlgoddess/webpack-plugin");
const htmlLoader = require("html-loader");
const styleLoader = require("css-loader");
const path = require("path");

function getWebpackConfig(projectDir) {
  const plugins = [];
  const htmlFiles = glob.sync(projectDir + "/src/content/**/*+(*.htm|*.html)");

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
    entry: path.join(projectDir, "src/css/index.css"), // Prevents unnecessary main.js from being included.
    output: {
      path: path.join(projectDir, "docs"),
    },
    mode: "development",
    stats: "errors-warnings",
    module: {
      rules: [
        {
          test: /\.html$/i, // Enables live reload
          loader: require.resolve("html-loader"),
        },
        {
          // For CSS modules
          // For pure CSS - /\.css$/i,
          // For Sass/SCSS - /\.((c|sa|sc)ss)$/i,
          // For Less - /\.((c|le)ss)$/i,
          test: /\.((c|sa|sc)ss)$/i,
          //  include: paths.appSrc,
          loaders: [require.resolve("css-loader")],
        },
        {
          test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
          loader: require.resolve("url-loader"),
          options: {
            limit: 8192,
          },
        },
      ],
    },
    plugins: [
      new HtmlGoddessPlugin(),
      ...plugins,
      new FixStyleOnlyEntriesPlugin({ silent: true }),
      new CleanWebpackPlugin({
        dry: false,
        verbose: false,
        cleanOnceBeforeBuildPatterns: ["**/*", "!CNAME"],
      }),
      new CopyPlugin({
        patterns: [
          {
            flatten: true,
            toType: "dir",
            from: projectDir + "/src/css/*.css",
            to: "css",
          },
        ],
      }),
    ],
  };
}

module.exports = getWebpackConfig;
