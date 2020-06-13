import { Command, flags } from "@oclif/command";
import HTMLGoddess from "htmlgoddess";
import execa from "execa";
import { CWD_PATH } from "../../index";
import path from "path";
import express from "express";
import livereload from "livereload";
import fs from "fs";
import cli from "cli-ux";
import chalk from "chalk";

export default class Serve extends Command {
  static description = "serves your website and auto-reloads when changed.";

  static examples = [
    `$ htmlgoddess serve
`,
  ];

  public subprocess = null;

  static flags = {
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: "n", description: "name to print" }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
  };

  static args = [{ name: "basePath" }];

  async run() {
    const { args, flags } = this.parse(Serve);
    this.log("");

    const basePath  = args.basePath ?   args.basePath: CWD_PATH;

    cli.action.start(`Starting server from ${basePath}/docs`);
    const app = express();
    const port = 3000;

    const liveReloadScript = `
        <!-- LIVE RELOAD SCRIPT INJECTION -->
        <script>
        document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] +
        ':35729/livereload.js?snipver=1"></' + 'script>')
        </script>
        <!-- LIVE RELOAD SCRIPT INJECTION -->
    `;

    /**
     * Injects live reload script into all html GET requests.
     */
    app.get("*(.html|.htm|/)", (req, res, next) => {
      res.format({
        html: function () {
          let filename = path.join(basePath, "/docs", req.url);
          if (filename.charAt(filename.length - 1) === "/") {
            filename += "index.html";
          }

          if (fs.existsSync(filename)) {
            const content = fs
              .readFileSync(filename, "utf-8")
              .replace("</head>", `${liveReloadScript}</head>`);
            res.send(content);
          }
        },
        default: function () {
          next();
        },
      });
    });

    app.use(express.static("docs"));

    app.listen(port, () => {
      cli.action.stop(chalk.green(`started.`));
      this.log("");
      this.log(
        `Local server listening at: ${chalk.keyword("green")(
          `http://localhost:${port}`
        )}`
      );
      this.log("");
      const liveReloadServer = livereload.createServer();
      this.log(
        `Live reload server listening at: ${chalk.keyword("purple")(
          `http://localhost:${liveReloadServer.config.port}`
        )}`
      );
      liveReloadServer.watch(basePath + "/docs");
    });
  }
}
