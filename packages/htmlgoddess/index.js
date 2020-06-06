const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

exports.print = function () {
  webpack(webpackConfig, (err, stats) => {
    // Stats Object
    console.log('done');
    if (err || stats.hasErrors()) {
      // Handle errors here
    }
    // Done processing
  });
};

exports.default = function () {};
