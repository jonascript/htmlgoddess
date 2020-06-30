"use strict";
import * as fs from "fs";
import * as path from "path";
import { run } from "../index";
import Create from "../commands/create/index";
import Format from "../commands/format/index";
import A11y from "../commands/a11y/index";
import { test } from "@oclif/test";
import axios from "axios";
import * as execa from "execa";
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
  let cliOutput = [],
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

  afterAll((done) => {
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
    
    done();
  });

  beforeEach(() => {
    cliOutput = [];
    // jest
    // .spyOn(process.stdout, "write")
    // .mockImplementation((str, encoding, cb) => {
    //   cliOutput.push(str);
    //   return false;
    // });
    //   jest
    //   .spyOn(process.stdin, "write")
    //   .mockImplementation((val) => stdin.push(val));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

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

    it("can print:auto", async (done) => {
      run(["print:auto", '--debounce=800']).then(() => {
        // Gives some time for print:auto debounce
        setTimeout(() => {
          fs.writeFileSync(
            path.join(process.env.CWD_PATH, "src/content/can-print.html"),
            `<p>I am auto printed ${time}</p>`
          );

          setTimeout(() => {
            const output = fs.readFileSync(
              path.join(process.env.CWD_PATH, "docs/can-print.html"),
              "utf-8"
            );
            expect(output).toContain(`<p>I am auto printed ${time}</p>`);
            done();
          }, 3000);
        }, 1000);
      });
    });
  });

  describe("format", () => {
    beforeEach((done) => {
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

  // @todo
  describe("a11y", () => {
    const time = Date.now();
    beforeEach((done) => {
      run(["print", process.env.CWD_PATH, '--no-a11y']).then((results) => {
        done();
      });
    });

    it("can validate accesibility", (done) => {
      A11y.run([]).then((results) => {
        done();
      });
    });

    it("can validate against one url", (done) => {
      A11y.run([
        "/Users/Jon/dev/htmlgoddess/packages/test/docs/index.html",
      ]).then((results) => {
        console.log("results", results);
        done();
      });
    });

    it("will catch errors", (done) => {
      fs.writeFileSync(
        path.join(process.env.CWD_PATH, "src/content/not-a11y.html"),
        `<p>I am not accessible ${time}. <img src="./bad-image.jpg" /></p>`
      );

      run(["print", process.env.CWD_PATH, '--no-a11y']).then((results) => {
        A11y.run([]).then(
          (results) => {
            expect(results.length).toBe(0);
            done();
          },
          (results) => {
            expect(results.length).toEqual(1);
            expect(results[0].issues[0].message).toEqual("Img element missing an alt attribute. Use the alt attribute to specify a short text alternative.");
            done();
          }
        );
      });
    });
    // it("can serve without param passed", (done) => {
    // })
    // it("can serve:auto", async () => {});
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
