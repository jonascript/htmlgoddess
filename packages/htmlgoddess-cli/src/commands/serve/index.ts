import { Command, flags } from "@oclif/command";
import HTMLGoddess, { serve } from "htmlgoddess";
import execa from "execa";
import { CWD_PATH } from "../../index";
import path from "path";

export default class Serve extends Command {
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
    const { args, flags } = this.parse(Serve);
    const output = await execa("node", [
      "../htmlgoddess/scripts/server.js",
    ]).stdout.pipe(process.stdout);
  }
}
