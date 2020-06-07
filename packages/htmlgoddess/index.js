const webpack = require('webpack');
const serve = require('./scripts/server');
const path = require('path');
const prettier = require('prettier');
const webpackConfig = require('./webpack.config.js');
const { exec } = require('child_process');

exports.print = function () {
  webpack(webpackConfig, (err, stats) => {
    // Stats Object

    if (err || stats.hasErrors()) {
      console.log(stats);
      // Handle errors here
    }
    // Done processing
  });
};

exports.serve = function () {
  serve();
};

exports.format = function () {
  console.log(process.cwd());
  exec(
    `prettier "${process.cwd()}/src/content/**/*?(.html|.htm)" --write`,
    function (err, stdout, stdin) {
      console.log(err, stdout);
    }
  );
  // prettier.format('src/**/*.html', {
  //   semi: false,
  //   parser: 'babel',
  // });
};

exports.default = function () {};
