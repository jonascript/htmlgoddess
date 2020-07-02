import { Command, flags } from "@oclif/command";
import execa from "execa";

export default class FormatAuto extends Command {
  static description = "watches for changes and formats your HTML";

  static examples = [
    `$ htmlgoddess format:auto
`,
  ];

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with no value (-f, --force)
  };

  static args = [{ name: "projectDir" }];

  async run() {
    const { args, flags } = this.parse(FormatAuto);

    const projectDir = args.projectDir ? args.projectDir : process.cwd();

    execa("onchange", [
      `${projectDir}/src/**/*.html`,
      `${projectDir}/src/**/*.css`,
      "--",
      "prettier",
      "{{changed}}",
      "--write",
    ]).stdout.pipe(process.stdout);
  }
}
