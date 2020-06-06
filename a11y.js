// An example of running Pa11y on multiple URLS
'use strict';

const glob = require('glob');
const pa11y = require('pa11y');
const path = require('path');
const cli = require('pa11y-reporter-cli');
const htmlFiles = glob.sync('docs/**/*+(*.htm|*.html)');

// Workaround to suppress node event emitter warning
// @todo queue requests to avoid setting too many listeners at once
require('events').EventEmitter.defaultMaxListeners = 25;

run();

// Async function required for us to use await
async function run() {
  try {
    // Put together some options to use in each test
    const options = {
      standard: 'WCAG2AA',
    };

    // Run tests against multiple URLs
    const results = await Promise.all(
      htmlFiles.map((file) => {
        return pa11y(path.join(__dirname, file), options);
      })
    );

    const cliResults = cli.results(results[0]);

    const resultsWithIssues = results.filter((result) => result.issues.length);

    if (resultsWithIssues.length === 0) {
      console.info('\x1b[32m', 'A11Y Tests All Passed!');
    } else {
      resultsWithIssues.forEach((result) => {
        const cliResults = cli.results(result);
        console.log(cliResults);
      });
    }
  } catch (error) {
    // Output an error if it occurred
    console.error(error.message);
  }
}
