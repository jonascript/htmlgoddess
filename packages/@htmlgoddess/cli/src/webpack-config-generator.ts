import glob from "glob";
import fs from "fs";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import FixStyleOnlyEntriesPlugin from "webpack-fix-style-only-entries";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import HtmlReplaceWebpackPlugin from "html-replace-webpack-plugin";
import HtmlBeautifyPlugin from "html-beautify-webpack-plugin";
import HtmlGoddessPlugin from "@htmlgoddess/webpack-plugin";
import htmlLoader from "html-loader";
import styleLoader from "css-loader";
import path from "path";

function getWebpackConfig(projectDir: string): any {
  const plugins = [];
  const htmlFiles = glob.sync(projectDir + "/src/content/**/*+(*.htm|*.html)");

  for (let x = 0; x < htmlFiles.length; x++) {
    const pathObj = path.parse(htmlFiles[x]);
    let templateRelPath = htmlFiles[x].replace(
      /.+src\/content\//,
      "src/templates/"
    );
    let relOutputPath = htmlFiles[x].replace(/.+src\/content\//, "");
    let templateFilename = "index.html";
    let templateAbsolutePath;

    // If the file is not in a directory, make it the name of the timeplate
    if (
      fs.existsSync(
        path.join(projectDir, path.dirname(templateRelPath) + ".html")
      )
    ) {
      templateAbsolutePath = path.join(
        projectDir,
        path.dirname(templateRelPath) + ".html"
      );
    } else {
      templateAbsolutePath = path.join(
        projectDir,
        path.dirname(templateRelPath),
        "index.html"
      );
    }

    plugins.push(
      new HtmlWebpackPlugin({
        filename: relOutputPath,
        templateParameters: {
          contentPath: htmlFiles[x],
        },
        template: templateAbsolutePath,
      })
    );
  }

  return {
    entry: path.join(projectDir, "src/css/index.css"), // Prevents unnecessary main.js from being included.
    output: {
      path: path.join(projectDir, "docs"),
    },
    context: projectDir,
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
      new HtmlGoddessPlugin({ projectDir }),
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

export = getWebpackConfig;
