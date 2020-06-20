import { Command, flags } from "@oclif/command";
import execa from "execa";
import { CWD_PATH } from "../../index";

export default class FormatAuto extends Command {
  static description = "formats your HTML.";

  static examples = [
    `$ htmlgoddess format:auto
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
    const { args, flags } = this.parse(FormatAuto);
    execa("onchange", [
      `${CWD_PATH}/src/**/*.html`,
      `${CWD_PATH}/src/**/*.css`,
      "--",
      "prettier",
      "{{changed}}",
      "--write",
    ]).stdout.pipe(process.stdout);
  }
}
