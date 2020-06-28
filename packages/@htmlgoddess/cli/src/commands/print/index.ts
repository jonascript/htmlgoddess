import { Command, flags } from "@oclif/command";
import execa from "execa";
import path from 'path';
import cli from "cli-ux";
import webpack from 'webpack';
import webpackConfig from "../../webpack.config.js";
import chalk from 'chalk';
import { CWD_PATH } from "../../index";

export default class Print extends Command {
  static description = "describe the command here";

  static examples = [
    `$ htmlgoddess print
hello world wide web from ./src/hello.ts!
`,
  ];

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: "n", description: "name to print" }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
  };

  static args = [{ name: "basePath" }];

  async run() {
    const { args, flags } = this.parse(Print);
    const basePath = args.basePath ? args.basePath : CWD_PATH;

    cli.action.start(`Printing your website from ./src to ./docs`);
    return new Promise((resolve, reject) => {
      // @todo this is not compiling properly
      const compiler = webpack(webpackConfig(), (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }
        // console.log(stats.toString({
        //   chunks: false,  // Makes the build much quieter
        //   colors: true    // Shows colors in the console
        // }));
        cli.action.stop(chalk.green('done.'));
        resolve(stats); 
       
      });
    });
  }
}
