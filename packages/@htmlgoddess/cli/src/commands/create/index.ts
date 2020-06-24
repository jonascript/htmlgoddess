import { Command, flags } from "@oclif/command";
import execa from "execa";

import path from 'path';
import cli from "cli-ux";
import webpack from 'webpack';
import webpackConfig from "../../webpack.config.js";
import chalk from 'chalk';
import { CWD_PATH } from "../../index";
import * as inquirer from 'inquirer'


export default class Create extends Command {
  static description = "describe the command here";

  static examples = [
    `$ htmlgoddess create
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

  static args = [{ name: "path" }];

  async run() {
    const { args, flags } = this.parse(Create);
    const { path } = args;
     return new Promise(async (resolve, reject) => {
  

       const name = await cli.prompt('hey What is the name of your site?');
       
       this.log(`Your site will be named:  ${name}`);

       const type = await cli.prompt('Your site is named ' + name + '. What is the type of site you want?');
      // let template: any = await inquirer.prompt([{
      //   name: 'template',
      //   message: 'select a template',
      //   type: 'list',
      //   choices: [{ name: 'blog' }, { name: 'gallery' }, { name: 'barebones' }],
      // }]);

      // this.log(`Your site is named ${name}, and will be a ${template}`);

  //  return true;
       resolve('done');
     });
  }
}
