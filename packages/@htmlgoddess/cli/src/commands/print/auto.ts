import { Command, flags } from "@oclif/command";
import Print from "../print";
import watch from "recursive-watch";
import path from "path";

export default class AutoPrint extends Command {
  static description = "describe the command here";

  static examples = [
    `$ htmlgoddess print
hello world wide web from ./src/hello.ts!
`,
  ];

  static flags = {
    help: flags.help({ char: "h" }),

    debounce: flags.integer({ char: "d", default: 500 }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: "n", description: "name to print" }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
  };

  static args = [{ name: "projectDir" }];

  async run() {
    const { args, flags } = this.parse(AutoPrint);

    const projectDir = args.projectDir
      ? args.projectDir
      : path.join(process.cwd());

    const projectSrcDir = path.join(projectDir, "/src");

    const { debounce } = flags;

    return new Promise((resolve, reject) => {
      this.log("Watching: ", projectSrcDir);
      // ... or a directory

      let timestamp = Date.now();

      const unwatch = watch(projectSrcDir, (filename) => {
        if (Date.now() - timestamp > debounce) {
          timestamp = Date.now();
          this.log(filename, "changed. Reprinting website to docs");
          Print.run([projectDir, "--no-a11y"]).then((results) => {
            this.log("Website auto printed.");
          });
        }
      });

      resolve(unwatch);
    });
  }
}
