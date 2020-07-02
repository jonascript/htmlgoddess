import { Command, flags } from "@oclif/command";
import execa from "execa";
import { CWD_PATH } from "../../index";

export default class Publish extends Command {
  static description = "publishes your saved changes to git";

  static examples = [
    `$ htmlgoddess publish
`,
  ];

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
  };

  static args = [{ name: "file" }];

  async run() {
    const { args, flags } = this.parse(Publish);
    this.log("Publishing work");
    await execa("git", ["push", "origin"]).stdout.pipe(process.stdout);
  }
}
