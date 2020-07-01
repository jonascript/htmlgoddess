const path = require('path');

module.exports.getTemplatePath = function (templateName) {
  if (!templateName) {
    console.log('Yohoho', templateName);
    return false;
  }

  return path.resolve(__dirname, templateName);
};
