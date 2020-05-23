const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const glob = require('glob');
const htmlFiles = glob.sync('src/**/+(*.htm|*.html)');
const path = require('path');

const htmlCompilers = htmlFiles.map((file) => {
  console.log('file', file);
  return new HtmlWebpackPlugin({
    filename: file.replace('src/', ''),
    template: file,
  });
});

console.log('htmlCompilers', htmlCompilers);

module.exports = {
  entry: './src/css/index.css',
  output: {
    path: __dirname + '/dist',
  },
  mode: 'development',
  module: {
    rules: [
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
    new CleanWebpackPlugin(),
    ...htmlCompilers,
    new FixStyleOnlyEntriesPlugin(),
    new CopyPlugin({
      patterns: [
        { flatten: true, toType: 'dir', from: './src/css/*.css', to: 'css' },
      ],
    }),
  ],
};
