import { Command, flags } from "@oclif/command";
import HTMLGoddess, { format } from "htmlgoddess";
import execa from "execa";
import { CWD_PATH } from "../../index";

export default class Save extends Command {
  static description = "formats your HTML.";

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

  static args = [{ name: "file" }];

  async run() {
    const { args, flags } = this.parse(Save);
    this.log("Saving work");
    await execa("git", ["add", "src"]).stdout.pipe(process.stdout);
    await execa("git", ["commit", "-m", '"saving content edit"']);
  }
}
