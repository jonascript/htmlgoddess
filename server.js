const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

compiler.plugin('done', function () {
  console.log('IT IS DONE');
});
// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
const instance = webpackDevMiddleware(compiler, { forceRebuild: true });
app.use(instance);

console.log(instance.context.watching);

instance.waitUntilValid((evt) => {
  console.log('evt', evt);
  instance.invalidate();
});

console.log(config.output.publicPath);

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
