import { Command, flags } from "@oclif/command";
import execa from "execa";
import path from 'path';
import cli from "cli-ux";
// import * as inquirer from 'inquirer'
import webpack from 'webpack';
import webpackConfig from "../../webpack.config.js";
import chalk from 'chalk';
import * as git from 'isomorphic-git'
import { CWD_PATH } from "../../index";
import http from 'isomorphic-git/http/node';
import fs from 'fs';

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

   run(): Promise<any> {
      const { args, flags } = this.parse(Create);

      const path = args.path ? args.path : CWD_PATH;

     return new Promise(async (resolve, reject) => {
      
        const name = await cli.prompt('What is the name of your site?');
      
        const template = await cli.prompt('What is the name of your template?');

       // @todo with inquirer when I can figure out how mock prompts
        // let template: any = await inquirer.prompt([{
        //   name: 'template',
        //   message: 'select a template',
        //   type: 'list',
        //   choices: [{ name: 'blog' }, { name: 'gallery' }, { name: 'barebones' }],
        // }]);

        const confirm = await cli.confirm(`The name of your site is ${chalk.keyword("green")(name)}. It is a ${template} and it will be installed at ${path}. Please confirm.`);
        
        cli.action.start('Installing your site...');

        const cloneResult = await git.clone({
          fs, http,
          corsProxy: 'https://cors.isomorphic-git.org', singleBranch: true,
          depth: 1, dir: path, url: 'https://github.com/jonascript/htmlgoddess-test'
        });
      
        cli.action.stop('Your site has been created!');
       
        resolve({ name, template, path });
     });
  }
}