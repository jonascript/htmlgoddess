const fs = require('fs');
const path = require('path');
// If your plugin is direct dependent to the html webpack plugin:
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pretty = require('pretty');
const htmlToText = require('html-to-text');
const writeGood = require('write-good');
// const Proofreader = require('proofreader');
const TextLintEngine = require('textlint').TextLintEngine;
const engine = new TextLintEngine();

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

class HtmlGoddessPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('HtmlGoddessPlugin', (compilation) => {
      console.log('The HtmlGoddessPlugin is starting a new compilation...');
      HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tapAsync(
        'HtmlGoddessPlugin', // <-- Set a meaningful name here for stacktraces
        async (data, cb) => {
          const { contentPath } = data.plugin.options.templateParameters;

          data.html = compileTemplate(data.html);

          let mainRegExp = /<(content+) \/>/i;
          data.html = data.html.replace(
            mainRegExp,
            fs.readFileSync(contentPath, 'utf-8')
          );

          data.html = pretty(data.html);

          const results = await engine.executeOnFiles([contentPath], '.html');
          // console.log(engine);
          if (engine.isErrorResults(results)) {
            // console.log(results[0].messages, text);
            var output = engine.formatResults(results);
            console.log(output);
          } else {
            console.log('textlint Passed', contentPath);
          }

          cb(null, data);
        }
      );
    });
  }
}

HtmlGoddessPlugin.compileTemplate = compileTemplate;
module.exports = HtmlGoddessPlugin;
