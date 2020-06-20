import { Command, flags } from "@oclif/command";

export default class ServeAuto extends Command {
  static description = "serves your website and auto-reloads when changed.";

  static examples = [
    `$ htmlgoddess serve
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
    const { args, flags } = this.parse(ServeAuto);
    // serve();
  }
}
