const path = require('path');
const glob = require('glob');

module.exports.getTemplatePath = function (templateName) {
  if (!templateName) {
    return false;
  }

  return path.resolve(__dirname, templateName);
};

module.exports.getAllTemplateNames = function () {
  return glob.sync(__dirname + '/*/').map((directory) => {
    return path.basename(directory);
  });
};

module.exports.getAllStyleSheets = function () {
  return glob.sync(__dirname + '/basic/src/css/*.css').map((stylesheet) => {
    return path.basename(stylesheet);
  });
};
