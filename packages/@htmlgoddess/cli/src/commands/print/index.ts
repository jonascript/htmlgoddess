import { Command, flags } from "@oclif/command";
import execa from "execa";
import path from 'path';
import cli from "cli-ux";
import webpack from 'webpack';
import A11y from '../a11y';
import getWebpackConfig from "../../webpack-config-generator";
import chalk from 'chalk';
export default class Print extends Command {
  static description = "describe the command here";

  static examples = [
    `$ htmlgoddess print
hello world wide web from ./src/hello.ts!
`,
  ];

  static flags = {
    help: flags.help({ char: "h" }),

    a11y: flags.boolean({ char: "a", default: true, allowNo: true}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: "n", description: "name to print" }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
  };

  static args = [{ name: "projectDir", hidden: true,  required: false }];

  async run() {
    const { args, flags } = this.parse(Print);
    
    const projectDir = args.projectDir ? args.projectDir : process.cwd();

    const { a11y } = flags;

    cli.action.start(`Printing your website from ${projectDir} to ./docs`);
    return new Promise((resolve, reject) => {
      const compiler = webpack(getWebpackConfig(projectDir), (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }

  
        cli.action.stop(chalk.green('done.'));

        if (a11y) {
          A11y.run([]).then(results => { 
            // this.log(stats.toString({
            //   chunks: false,  // Makes the build much quieter
            //   colors: true    // Shows colors in the console
            // }));
            resolve(stats); 
          }, (results) => {
            // this.log(stats.toString({
            //   chunks: false,  // Makes the build much quieter
            //   colors: true    // Shows colors in the console
            // }));
            resolve(stats); 
          })
        } else {
          // this.log(stats.toString({
          //   chunks: false,  // Makes the build much quieter
          //   colors: true    // Shows colors in the console
          // }));
          resolve(stats); 
        }
    
      });
    });
  }
}
