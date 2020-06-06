const express = require('express');
const app = express();
const port = 3000;
const livereload = require('livereload');
const fs = require('fs');
const path = require('path');

const liveReloadScript = `
    <!-- LIVE RELOAD SCRIPT INJECTION -->
    <script>
    document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] +
    ':35729/livereload.js?snipver=1"></' + 'script>')
    </script>
    <!-- LIVE RELOAD SCRIPT INJECTION -->
`;

/**
 * Injects live reload script into all html GET requests.
 */
app.get('*(.html|.htm|/)', (req, res, next) => {
  res.format({
    html: function () {
      let filename = path.join(__dirname, 'docs', req.url);

      if (filename.charAt(filename.length - 1) === '/') {
        filename += 'index.html';
      }

      if (fs.existsSync(filename)) {
        const content = fs
          .readFileSync(filename, 'utf-8')
          .replace('</head>', `${liveReloadScript}</head>`);
        res.send(content);
      }
    },
    default: function () {
      next();
    },
  });
});
app.use(express.static('docs'));

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

var server = livereload.createServer();
server.watch(__dirname + '/docs');
