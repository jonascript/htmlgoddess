const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');

const liveReloadScript = `
<script>
document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] +
':35729/livereload.js?snipver=1"></' + 'script>')
</script>
`;

app.get('*.html', (req, res, next) => {
  res.format({
    html: function () {
      const filename = path.join(__dirname, 'docs', req.url);
      console.log('filename', filename);
      if (fs.existsSync(filename)) {
        const content = fs
          .readFileSync(filename, 'utf-8')
          .replace('</head>', `${liveReloadScript}</head>`);
        console.log('SEND');
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
