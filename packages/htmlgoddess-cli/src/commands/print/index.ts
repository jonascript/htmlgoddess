import { Command, flags } from "@oclif/command";
import execa from "execa";
import cli from "cli-ux";
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

    const output = await execa("webpack", [
      "--config",
      "../htmlgoddess/webpack.config.js",
    ]);

    if (output.failed) {
      this.log(output.stderr);
    } else {
      cli.action.stop();
    }
  }
}
