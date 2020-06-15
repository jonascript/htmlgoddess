const PACKAGE = require('../htmlgoddess-cli/package.json');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const glob = require('glob');
const htmlFiles = glob.sync('src/content/**/*+(*.htm|*.html)');
const path = require('path');
const htmlPartialFiles = glob.sync('src/templates/partials/+(*.htm|*.html)');
const fs = require('fs');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin');
const HtmlGoddessPlugin = require('./html-goddess-webpack-plugin');
const plugins = [];

for (let x = 0; x < htmlFiles.length; x++) {
  const pathObj = path.parse(htmlFiles[x]);
  let templatePath = htmlFiles[x].replace('src/content/', '');
  let templateName = 'index.html';
  if (fs.existsSync('src/templates/' + path.dirname(templatePath) + '.html')) {
    templateName = path.dirname(templatePath) + '.html';
  }

  plugins.push(
    new HtmlWebpackPlugin({
      filename: templatePath,
      templateParameters: {
        contentPath: htmlFiles[x],
      },
      template: 'src/templates/' + templateName,
    })
  );
}

const CWD_PATH = process.env.CWD_PATH || process.cwd();

console.log('CWD_PATH', CWD_PATH);

module.exports = {
  entry: path.join(CWD_PATH, './src/css/index.css'), // Prevents unnecessary main.js from being included.
  output: {
    path: path.join(CWD_PATH, PACKAGE.htmlgoddess.output),
  },
  mode: 'development',
  stats: 'errors-warnings',
  module: {
    rules: [
      {
        test: /\.html$/i, // Enables live reload
        loader: 'html-loader',
      },
      {
        // For CSS modules
        // For pure CSS - /\.css$/i,
        // For Sass/SCSS - /\.((c|sa|sc)ss)$/i,
        // For Less - /\.((c|le)ss)$/i,
        test: /\.((c|sa|sc)ss)$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
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
        loader: 'url-loader',
        options: {
          limit: 8192,
        },
      },
    ],
  },
  plugins: [
    ...plugins,
    new HtmlGoddessPlugin(),
    new CleanWebpackPlugin({
      dry: false,
      cleanOnceBeforeBuildPatterns: ['**/*', '!CNAME'],
    }),
    new FixStyleOnlyEntriesPlugin({ silent: true }),
    new CopyPlugin({
      patterns: [
        {
          flatten: true,
          toType: 'dir',
          from: CWD_PATH + '/src/css/*.css',
          to: 'css',
        },
      ],
    }),
  ],
};
