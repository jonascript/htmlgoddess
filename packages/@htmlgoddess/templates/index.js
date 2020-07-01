const path = require('path');

module.exports.getTemplatePath = function (templateName) {
  if (!templateName) {
    return false;
  }

  return path.resolve(__dirname, templateName);
};
