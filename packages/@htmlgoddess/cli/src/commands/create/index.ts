import { Command, flags } from "@oclif/command";
import execa from "execa";
import path from "path";
import cli from "cli-ux";
import inquirer from "inquirer";
import chalk from "chalk";
import * as git from "isomorphic-git";
import http from "isomorphic-git/http/node";
import { getTemplatePath, getAllTemplateNames, getAllStyleSheets } from "@htmlgoddess/templates";
import fs from "fs-extra";


export default class Create extends Command {
  static description =
    "creates a new website project under the grace of the HTML Goddess";

  static examples = [
    `$ htmlgoddess create ./path/to/directory`,
    `$ htmlgoddess create`,
  ];

  static flags = {
    help: flags.help({ char: "h" }),
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
      this.log("");
      this.log(chalk.green("HTML Goddess CLI"));
      this.log("");
      const name = await cli.prompt("What is the name of your site?");
      this.log("");
      // const template = await cli.prompt("What is the name of your template?");
      // this.log("");

      // @todo with inquirer when I can figure out how mock prompts
      const { template } = await inquirer.prompt([
        {
          name: "template",
          message: "select a template",
          type: "list",
          choices: getAllTemplateNames(),
        },
      ]);

      const basicTemplateDir = getTemplatePath('basic');
      const templateDir = getTemplatePath(template);

      const { stylesheet } = await inquirer.prompt([
        {
          name: "stylesheet",
          message: "select a stylesheet",
          type: "list",
          choices: getAllStyleSheets(),
        },
      ]);

      if (!templateDir) {
        this.log(chalk.red(`Template does not exist. ${templateDir}`));
        return reject(`Template does not exist. ${templateDir}`);
      }

      this.log("");

      const confirm = await cli.confirm(
        `The name of your site is ${chalk.keyword("orange")(
          name
        )}. It is a ${template} and it will be installed at ${projectDir}. Please confirm. (y/n)`
      );

      this.log("");

      cli.action.start("Installing your site...");

      try {
        // Basic template is used as base and merged with 
        // selected template
        fs.copySync(basicTemplateDir, projectDir, {
          errorOnExist: true,
          overwrite: false,
        });
        fs.copySync(templateDir, projectDir, {
          errorOnExist: false,
          overwrite: true,
        });
      } catch (error) {
        cli.action.stop(chalk.red("error"));
        this.log("");
        this.log(chalk.red(error));
        this.log("");

        return reject("Destination directory already exists");
      }

      if (!fs.existsSync(path.join(projectDir, "src/content/index.html"))) {
        cli.action.stop(chalk.red("error"));
        this.log("");
        this.log(chalk.red("Something went wrong when creating site files"));
        this.log("");

        return reject("Something went wrong when creating site files");
      }

      await execa("git", ["init", '--quiet', projectDir]);
      await execa("git", ["add", projectDir]);
      await execa("git", ["commit", "-m", "Saving content edit."]);

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
