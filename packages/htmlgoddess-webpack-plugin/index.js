const fs = require('fs');
const path = require('path');
// If your plugin is direct dependent to the html webpack plugin:
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pretty = require('pretty');
const htmlToText = require('html-to-text');
const TextLintEngine = require('textlint').TextLintEngine;
const textLintEngine = new TextLintEngine();

// If your plugin is using html-webpack-plugin as an optional dependency
// you can use https://github.com/tallesl/node-safe-require instead:
const compileTemplate = (html, basePath = '') => {
  let output = html;
  const regex = /<([^\/>]+)\/>/gi;
  const matches = html.match(regex);

  if (!matches) {
    return output;
  }

  let templateFilename = '';
  for (let x = 0; x < matches.length; x++) {
    // look for footer.html or footer directory
    templateFilename = matches[x].replace('<', '').replace(/\s?\/>/, '');
    try {
      if (
        fs.existsSync(
          'src/templates/' +
            path.join(basePath, templateFilename) +
            '/index.html'
        )
      ) {
        output = output.replace(
          matches[x],
          compileTemplate(
            fs.readFileSync(
              'src/templates/' + templateFilename + '/index.html',
              'utf-8'
            ),
            path.join(basePath, templateFilename)
          )
        );
      } else if (
        fs.existsSync(
          'src/templates/' + path.join(basePath, templateFilename) + '.html'
        )
      ) {
        output = output.replace(
          matches[x],
          compileTemplate(
            fs.readFileSync(
              'src/templates/' +
                path.join(basePath, templateFilename) +
                '.html',
              'utf-8'
            ),
            path.join(basePath, templateFilename)
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  return output;
};

console.log('HtmlGoddessPlugin loading2', process.cwd());

class HtmlGoddessPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('HtmlGoddessPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tapAsync(
        'HtmlGoddessPlugin',
        async (data, cb) => {
          const { contentPath } = data.plugin.options.templateParameters;
          console.log('HtmlGoddessPlugin running...', contentPath);
          data.html = compileTemplate(data.html);
          let mainRegExp = /<(content+) \/>/i;
          data.html = data.html.replace(
            mainRegExp,
            fs.readFileSync(contentPath, 'utf-8')
          );

          data.html = pretty(data.html);

          // const results = await textLintEngine.executeOnFiles([contentPath]);

          // if (textLintEngine.isErrorResults(results)) {
          //   var output = textLintEngine.formatResults(results);
          //   console.log(output);
          // }

          cb(null, data);
        }
      );
    });
  }
}

HtmlGoddessPlugin.compileTemplate = compileTemplate;
module.exports = HtmlGoddessPlugin;
