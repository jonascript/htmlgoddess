const plugin = require('../index');
const fs = require('fs');

describe('plugin', () => {
  let footerTemplate, navTemplate;

  beforeAll(() => {
    footerTemplate = fs.readFileSync(
      './src/templates/footer/index.html',
      'utf-8'
    );

    console.log('footerTemplate', footerTemplate);
    navTemplate = fs.readFileSync('./src/templates/nav/index.html', 'utf-8');
  });

  it('can compile template', () => {
    const output = plugin.compileTemplate('<html>hello</html>');
    expect(output).toBe(`<html>hello</html>`);
  });

  it('can compile template', () => {
    const output = plugin.compileTemplate('<html><footer/></html>');
    expect(output).toBe(`<html>${footerTemplate}</html>`);
  });

  it('can compile template', () => {
    const output = plugin.compileTemplate('<html><footer /></html>');
    expect(output).toBe(`<html>${footerTemplate}</html>`);
  });

  it('can compile a nested template', () => {
    const output = plugin.compileTemplate('<html><nav /></html>');
    expect(output).toBe(
      `<html>${navTemplate.replace('<woot />', 'WootWoot')}</html>`
    );
  });
});
