"use strict";
import * as fs from "fs";
import * as path from "path";
import { run } from "../index";
import Create from "../commands/create/index";
import Format from "../commands/format/index";
import { test } from "@oclif/test";
import axios from "axios";
import * as execa from "execa";
import { idText, JsxEmit } from "typescript";
import cli, { ActionBase } from "cli-ux";
import prompt from "../../node_modules/cli-ux/lib/prompt.js";

/**
 * Mocks the "open" function so that a browser doesn't open while unit testing.
 */
function mockCLIOpen() {
  jest.mock("cli-ux", () => {
    return {
      ...cli,
      open: () => {
        return;
      },
    };
  });
}

/**
 * Mocking for interactive prompts.
 * @param answers
 */
function mockCLIAnswers(answers: string[]) {
  jest.mock("../../node_modules/cli-ux/lib/prompt.js", () => {
    return {
      ...prompt,
      confirm: (message) => {
        return answers.shift();
      },
      prompt: async (prom, icon) => {
        return new Promise((resolve, reject) => {
          resolve(answers.shift());
        });
      },
    };
  });
}

describe("htmlgoddess Command", () => {
  let result,
    io = null;

  beforeAll((done) => {
    console.log("Setting test submodule to clean state");
    execa.sync("git", [
      "submodule",
      "foreach",
      "git",
      "reset",
      "origin/master",
    ]);
    execa.sync("git", ["submodule", "foreach", "git", "reset", "--hard"]);
    execa.sync("git", ["submodule", "foreach", "git", "clean", "-fxd"]);

    console.log("Changing to test directory.");
    process.chdir("../../test");
    process.env.CWD_PATH = process.cwd();
    mockCLIOpen();
    done();
  });

  afterAll(() => {
    process.chdir("../@htmlgoddess/cli");
    console.log(
      `Reseting and stashing changes for test submodule at: ${process.cwd()}`
    );

    // Resets the submodule test repo to orinal state
    execa.sync("git", [
      "submodule",
      "foreach",
      "git",
      "reset",
      "origin/master",
    ]);
    execa.sync("git", ["submodule", "foreach", "git", "reset", "--hard"]);
    execa.sync("git", ["submodule", "foreach", "git", "clean", "-fxd"]);
  });

  beforeEach(() => {
    result = [];
    // jest
    //   .spyOn(process.stdout, "write")
    //   .mockImplementation((str, encoding, cb) => {
    //     result.push(str);
    //     return true;
    //   });

    //   jest
    //   .spyOn(process.stdin, "write")
    //   .mockImplementation((val) => stdin.push(val));
  });

  afterEach(() => {});

  describe("create", () => {
    it("can create a new site", async (done) => {
      const mockAnswers = ["My Test Site", "blog", "Y"];

      mockCLIAnswers([...mockAnswers]);
      Create.run([process.env.CWD_PATH]).then((results) => {
        // @todo test console messages from stdout
        expect(results.name).toEqual(mockAnswers[0]);
        expect(results.template).toEqual(mockAnswers[1]);
        expect(results.path).toEqual(process.env.CWD_PATH);
        expect(
          fs.existsSync(path.join(results.path, "src/content/index.html"))
        ).toEqual(true);

        done();
      });
    });
  });

  describe("print", () => {
    const time = Date.now();
    it("can print", (done) => {
      fs.writeFileSync(
        path.join(process.env.CWD_PATH, "src/content/can-print.html"),
        `<p>I am printed ${time}</p>`
      );
      run(["print"]).then((result) => {
        const output = fs.readFileSync(
          path.join(process.env.CWD_PATH, "docs/can-print.html"),
          "utf-8"
        );
        expect(output).toContain(`<p>I am printed ${time}</p>`);
        done();
      });
    });
  });

  // it("can print:auto", async () => {});

  describe("format", () => {
    beforeEach((done) => {
      console.log("CWD", process.cwd());
      fs.writeFileSync(
        path.join(process.env.CWD_PATH, "src/content/can-format.html"),
        "<p>I <strong>am</strong>        formatted</p>"
      );
      done();
    });

    // afterEach((done) => {
    //   done();
    // });

    it("can format", (done) => {
      console.log(process.env.CWD_PATH);

      Format.run([]).then((result) => {
        const output = fs.readFileSync(
          path.join(process.env.CWD_PATH, "src/content/can-format.html"),
          "utf-8"
        );
        expect(output).toContain("<p>I <strong>am</strong> formatted</p>");

        done();
      });
    });

    it("can format with a path", (done) => {
      Format.run([process.env.CWD_PATH]).then((result) => {
        const output = fs.readFileSync(
          path.join(process.env.CWD_PATH, "src/content/can-format.html"),
          "utf-8"
        );
        expect(output).toContain("<p>I <strong>am</strong> formatted</p>");

        done();
      });
    });

    // it("can format:auto", async () => {});
  });

  // @todo
  describe("serve", () => {
    it("can serve", (done) => {
      run(["serve", process.env.CWD_PATH]).then((process) => {
        setTimeout(async () => {
          const response = await axios.get("http://127.0.0.1:3000");
          expect(response.status).toEqual(200);
          done();
        }, 1000);
      });
    });
    // it("can serve without param passed", (done) => {
    // })
    // it("can serve:auto", async () => {});
  });

  describe("save", () => {
    const time = Date.now();
    beforeEach((done) => {
      fs.writeFileSync(
        path.join(process.env.CWD_PATH, "src/content/can-save.html"),
        `<p>I am saved at ${time}</p>`
      );
      done();
    });

    afterEach((done) => {
      // execa.sync("git", ["reset", "origin/master"]);
      // execa.sync("git", ["stash"]);
      done();
    });

    it("can save", (done) => {
      // @todo make sure this cleans up
      run(["save", process.env.CWD_PATH]).then((result) => {
        const output = execa.sync("git", ["diff", "HEAD~1", "HEAD"]);
        expect(output.stdout).toContain(`+<p>I am saved at ${time}</p>`);
        done();
      });
    });
  });

  // @todo keeping for reference
  // describe('cli-ux', () => {
  //   it("can test cli-ux", async (done) => {

  //     const promptPromise = cli.prompt('Require input?')
  //     process.stdin.emit('data', '')
  //     process.stdin.emit('data', 'answer');
  //     const answer = await promptPromise;
  //     expect(answer).toEqual('answer');
  //     await cli.done();
  //     done();
  //   })
  // })
  // });

  //
  // @todo mock origin so that publish can be tested
  //
  // describe("publish", () => {
  //   it("can publish", async (done) => {
  //     const time = Date.now();

  //     fs.writeFileSync(
  //       path.join("src/content/can-publish.html"),
  //       `<p>I am published at ${time}</p>`
  //     );

  //     await run(["publish"]);

  //     execa.sync("git", ["checkout", "master"]);

  //     //@todo gracefully handle commits and rollbacks
  //     done();
  //   });
  // });
});
