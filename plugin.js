const fs = require('fs');
const path = require('path');
// If your plugin is direct dependent to the html webpack plugin:
const HtmlWebpackPlugin = require('html-webpack-plugin');
var pretty = require('pretty');

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

class MyPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
      console.log('The compiler is starting a new compilation...');
      // Static Plugin interface |compilation |HOOK NAME | register listener
      //   HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
      //     'MyPlugin', // <-- Set a meaningful name here for stacktraces
      //     (data, cb) => {
      //       console.log(data);
      //       // Manipulate the content
      //       data.html += 'The Magic Footer';
      //       // Tell webpack to move on
      //       cb(null, data);
      //     }
      //   );

      HtmlWebpackPlugin.getHooks(compilation).afterTemplateExecution.tapAsync(
        'MyPlugin', // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
          //   console.log('data', data);
          // Manipulate the content

          console.log('data.outputName', data.outputName, data.plugin.options);

          const { templatePath } = data.plugin.options.templateParameters;

          data.html = compileTemplate(data.html);

          let mainRegExp = /<(content+) \/>/i;
          data.html = data.html.replace(
            mainRegExp,
            fs.readFileSync(templatePath, 'utf-8')
          );

          // Tell webpack to move on
          data.html = pretty(data.html);
          cb(null, data);
        }
      );
    });
  }
}

MyPlugin.compileTemplate = compileTemplate;
module.exports = MyPlugin;
