import { Command, flags } from "@oclif/command";
import execa from "execa";
import { CWD_PATH } from "../../index";
import * as git from "isomorphic-git";
import fs from "fs";
import cli from "cli-ux";

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

  static args = [{ name: "projectDir" }];

  async run() {
    const { args, flags } = this.parse(Save);

    const projectDir = args.projectDir ? args.projectDir : process.cwd();

    this.log("Saving work", projectDir);

    // const repo = {
    //   fs,
    //   dir: args.basePath,
    //   filter: (f) => f.startsWith("src/"),
    // };

    // await git.statusMatrix(repo).then((status) =>
    //   Promise.all(
    //     status.map(([filepath, headStatus, worktreeStatus, stageStatus]) => {
    //       return worktreeStatus
    //         ? git.add({ ...repo, filepath })
    //         : git.remove({ ...repo, filepath });
    //     })
    //   )
    // );
    //   await git.add({ fs, dir: args.basePath, filepath: "/" });
    // await git.commit({
    //   fs,
    //   dir: args.basePath,
    //   message: "Saving content edit.",
    // });
    await execa("git", ["add", projectDir]).stdout.pipe(process.stdout);
    await cli.wait(200);
    await execa("git", ["commit", "-m", "Saving content edit."]);
  }
}
