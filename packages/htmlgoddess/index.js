const webpack = require('webpack');
const serve = require('./scripts/server');
const path = require('path');
const prettier = require('prettier');
const PrettierPlugin = require('prettier-webpack-plugin');
const webpackConfig = require('./webpack.config.js');
const { exec, spawn } = require('child_process');

exports.print = function () {
  webpack(webpackConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      console.log('Errors while compiling...', err, stats.hasErrors());
      // Handle errors here
    }
    // Done processing
  });
};

exports.printAuto = async function () {
  console.log('AUTO PRINT');

  console.log(`onchange '${process.env.PWD}/src/**/*.html' -- echo 'woot'`);
  exec(`onchange 'src/**/*.html'-- echo 'woot'`, function (
    error,
    stdout,
    stderr
  ) {
    if (error) {
      console.log(error.stack);
      console.log('Error code: ' + error.code);
      console.log('Signal received: ' + error.signal);
    }
    console.log('Child Process STDOUT: ' + stdout);
    console.log('Child Process STDERR: ' + stderr);
  });
};

exports.serve = function () {
  serve();
};

exports.format = function () {
  exec(
    `prettier "${process.cwd()}/src/content/**/*?(.html|.htm)" --write`,
    function (err, stdout, stdin) {
      if (err) {
        console.error(err);
      } else {
        console.log('\nPrettier formatting complete.\n');
        console.log('Files modified...\n');
        console.log(stdout);
      }
    }
  );
  // prettier.format('src/**/*.html', {
  //   semi: false,
  //   parser: 'babel',
  // });
};

exports.default = function () {};
