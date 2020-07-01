import { Command, flags } from "@oclif/command";
import execa from "execa";
import path from "path";
import cli from "cli-ux";
import * as inquirer from "inquirer";
import chalk from "chalk";
import * as git from "isomorphic-git";
import { CWD_PATH } from "../../index";
import http from "isomorphic-git/http/node";
import { getTemplatePath } from "@htmlgoddess/templates";
import fs from "fs-extra";

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

  static args = [{ name: "projectDir" }];

  // async catch(error) {
  //   this.log("error", "error");
  //   // do something or
  //   // re-throw to be handled globally
  //   throw error;
  // }

  run(): Promise<any> {
    const { args, flags } = this.parse(Create);

    const projectDir = args.projectDir ? args.projectDir : process.cwd();

    return new Promise(async (resolve, reject) => {
      const name = await cli.prompt("What is the name of your site?");

      const template = await cli.prompt("What is the name of your template?");

      // @todo with inquirer when I can figure out how mock prompts
      // let template: any = await inquirer.prompt([{
      //   name: 'template',
      //   message: 'select a template',
      //   type: 'list',
      //   choices: [{ name: 'blog' }, { name: 'gallery' }, { name: 'barebones' }],
      // }])

      let templateDir;

      templateDir = getTemplatePath(template);

      if (!templateDir) {
        this.log(chalk.red(`Template does not exist. ${templateDir}`));
        return reject(`Template does not exist. ${templateDir}`);
      }

      // const templateDir = path.join(
      //   __dirname,
      //   `../../../../templates/${template}`
      // );

      this.log("");

      const confirm = await cli.confirm(
        `The name of your site is ${chalk.keyword("green")(
          name
        )}. It is a ${template} and it will be installed at ${path.join(
          CWD_PATH,
          projectDir
        )}. Please confirm. (y/n)`
      );

      this.log("");

      cli.action.start("Installing your site...");

      const templateExists = await fs.existsSync(templateDir);

      if (!templateExists) {
        throw new Error(`Template does not exist. ${templateDir}`);
      }

      fs.copySync(templateDir, projectDir, { errorOnExist: true });

      if (!fs.existsSync(projectDir)) {
        throw new Error("Something went wrong when creating site files");
      }

      // const cloneResult = await git.clone({
      //   fs,
      //   http,
      //   corsProxy: "https://cors.isomorphic-git.org",
      //   singleBranch: true,
      //   depth: 1,
      //   dir: projectDirectory,
      //   url: `https://github.com/jonascript/htmlgoddess-template-${}`,
      // });

      cli.action.stop("done!");
      this.log("");
      this.log(`✨  Successfully created project: ${name}`);
      this.log("");
      this.log(`👉  Get started with the following commands:`);
      this.log("");
      this.log(chalk.green(`cd ${projectDir}`));
      this.log(chalk.green(`htmlgoddess print`));
      this.log(chalk.green(`htmlgoddess serve`));
      this.log("");

      resolve({ name, template, path: projectDir });
    });
  }
}
