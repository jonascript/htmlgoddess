import { Command, flags } from "@oclif/command";
import execa from "execa";
import path from "path";
import cli from "cli-ux";
import webpack from "webpack";
import A11y from "../a11y";
import fs from "fs";
import glob from "glob";
import getWebpackConfig from "../../webpack-config-generator";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { config } from "process";
export default class Print extends Command {
  static description =
    "compiles source html/css files from src and prints to docs folder";

  static examples = [
    `$ htmlgoddess print`,
    `$ htmlgoddess print ./path/to/your/project`,
  ];

  static flags = {
    help: flags.help({ char: "h" }),

    a11y: flags.boolean({ char: "a", default: true, allowNo: true }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: "n", description: "name to print" }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
  };

  static strict = false;

  static args = [{ name: "projectDir", hidden: false, required: false }];

  async run() {
    const { args, flags } = this.parse(Print);
    const projectDir = args.projectDir ? args.projectDir : process.cwd();

    const { a11y } = flags;

    cli.action.start(
      `Printing your website from ${projectDir}/src to ${projectDir}/docs`
    );
    return new Promise(async (resolve, reject) => {
      // Check the last modified time of the folder and see if it matches
      if (fs.existsSync(`${projectDir}/docs`)) {
        const printedFiles = await glob.sync(
          `${projectDir}/docs/**/*+(*.htm|*.html)`
        );

        const filesModified = printedFiles.filter((file) => {
          const stats = fs.statSync(file);
          return stats.mtimeMs - stats.birthtimeMs > 2000;
        });

        if (filesModified.length) {
          const confirmPrint = await cli.confirm(
            chalk.yellowBright(
              `Hold on! It looks like someone has edited an html file in your docs folder. This folder is wiped every time you print which means any changes in docs will be ERASED.
              
Files changed:

${filesModified.join("\n")}
                
Are you sure you want to continue? (y/n)`
            )
          );

          this.log("CONFIRM PRINT", confirmPrint);
          if (!confirmPrint) {
            cli.action.stop(chalk.red("cancelled."));
            return reject("cancelled");
          }
        }
      }

      const compiler = webpack(getWebpackConfig(projectDir), (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }

        cli.action.stop(chalk.green("done."));

        if (a11y) {
          A11y.run([projectDir]).then(
            (results) => {
              resolve(stats);
            },
            (results) => {
              resolve(stats);
            }
          );
        } else {
          resolve(stats);
        }
      });
    });
  }
}
