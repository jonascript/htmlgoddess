import { Command, flags } from "@oclif/command";
import chalk from "chalk";
import glob from "glob";
import pa11y from "pa11y";
import pa11yReportCLI from "pa11y-reporter-cli";
import path from "path";
import fs from "fs";
import cli from "cli-ux";

// Workaround to suppress node event emitter warning
// @todo queue requests to avoid setting too many listeners at once
require("events").EventEmitter.defaultMaxListeners = 25;

export default class A11y extends Command {
  static description = "describe the command here";

  static examples = [
    `$ htmlgoddess a11y
`,
  ];

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: "n", description: "name to print" }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
  };

  static args = [
    { name: "url" },
    {
      name: "standard",
      default: "WCAG2AA",
    },
  ];

  async run() {
    const { args, flags } = this.parse(A11y);

    const projectDir = args.projectDir ? args.projectDir : process.cwd();
    const { standard, url } = args;

    cli.action.start(`Validating site to Accessibility standard: ${standard}`);

    return new Promise(async (resolve, reject) => {
      const htmlFiles = url
        ? [url]
        : glob.sync(projectDir + "/docs/**/*+(*.htm|*.html)");

      const options = {
        standard,
      };
      // this.log(htmlFiles);
      // Run tests against multiple URLs
      const results = await Promise.all(
        htmlFiles.map((file) => {
          return pa11y(file, options);
        })
      );

      cli.action.stop("done");

      const cliResults = pa11yReportCLI.results(results[0]);

      const resultsWithIssues = results.filter(
        (result) => result.issues.length
      );

      if (resultsWithIssues.length === 0) {
        this.log(chalk.green("A11Y Tests All Passed!"));
        resolve(htmlFiles);
      } else {
        resultsWithIssues.forEach((result) => {
          const cliResults = pa11yReportCLI.results(result);
          this.log(chalk.red(cliResults));
        });
        reject(resultsWithIssues);
      }
    });
  }
}
