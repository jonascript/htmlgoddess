import { Command, flags } from "@oclif/command";
import execa from "execa";
import { __await } from "tslib";
import prettier from "prettier";
import fs from "fs";
import glob from "glob";
import cli from "cli-ux";
import chalk from "chalk";

export default class Format extends Command {
  static description = "formats your HTML";

  static examples = [
    `$ htmlgoddess format
`,
  ];

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: "n", description: "name to print" }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
  };

  static strict = false;

  static args = [{ name: "projectDir", required: false }];

  async run() {
    const { args, flags } = this.parse(Format);

    const projectDir = args.projectDir ? args.projectDir : process.cwd();

    cli.action.start(
      `Formatting source files for your website in ${projectDir}...`
    );
    return new Promise(async (resolve, reject) => {
      glob(`${projectDir}/src/**/*+(.htm|.html|.css)`, (err, matches) => {
        for (let x = 0; x < matches.length; x++) {
          const html = fs.readFileSync(matches[x], "utf-8");
          if (!prettier.check(html, { filepath: matches[x] })) {
            const output = prettier.format(html, { filepath: matches[x] });
            fs.writeFileSync(matches[x], output);
            this.log("formatted", chalk.green(matches[x]));
          }
        }
        cli.action.stop(chalk.green(`done`));
        resolve(true);
      });
    });
  }
}
