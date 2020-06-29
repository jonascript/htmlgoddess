import { Command, flags } from "@oclif/command";
import Print from '../print';
import watch from 'recursive-watch';
import path from 'path';

export default class AutoPrint extends Command {
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

  static args = [{ name: "projectSrcDir" }];

  async run() {
    const { args, flags } = this.parse(AutoPrint);

    const projectSrcDir = args.projectSrcDir ? args.projectSrcDir : path.join(process.cwd(), '/src');

    return new Promise((resolve, reject) => {
      this.log('Watching: ', projectSrcDir);
      // ... or a directory
      
     const unwatch = watch(projectSrcDir, (filename) => {
        this.log(filename, 'changed. Reprinting website to docs');

        Print.run([]).then(results => {
          this.log('Website auto printed.')
        })
      });

      resolve(unwatch);
    });
  }
}
