"use strict";
import * as fs from "fs";
import * as path from "path";
import { run } from "../index";
import Create from "../commands/create/index";
import Format from "../commands/format/index";
import A11y from "../commands/a11y/index";
import Print from "../commands/Print/index";
import PrintAuto from "../commands/Print/auto";
import Serve from "../commands/Serve/index";
import Save from "../commands/Save/index";
import axios from "axios";
import * as execa from "execa";
import cli, { ActionBase } from "cli-ux";
import prompt from "../../node_modules/cli-ux/lib/prompt.js";
import inquirer from "inquirer";

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
 * @todo this function does not work as expected. When it's called multiple times it doesnt' keep scope.
 * Mocking for interactive prompts.
 * @param answers
 */
function mockCLIAnswers(answers: any[]) {
  // Mocking inquirier answer for create
  // @todo this only works for one question
  inquirer.prompt = (questions) => {
    return Promise.resolve({ template: "blog" });
  };
  // Promise.resolve({
  //   template: () => {
  //     return answers.shift();
  //   },
  // });

  jest.mock("../../node_modules/cli-ux/lib/prompt.js", () => {
    return {
      ...prompt,
      confirm: (message) => {
        console.log(message);
        console.log("Mocking answer:", answers);
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
    io = null,
    TEST_DIR,
    TEST_PROJECT_DIR,
    TEST_PRINT_DIR;

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
    execa.sync("git", [
      "submodule",
      "foreach",
      "--recursive",
      "git",
      "clean",
      "-d",
      "-x",
      "-f",
    ]);
    console.log("Changing to test directory.");
    process.chdir("../../test");
    TEST_DIR = process.cwd();
    TEST_PROJECT_DIR = path.join(TEST_DIR, "testproject");
    TEST_PRINT_DIR = path.join(TEST_DIR, "testprint");
    mockCLIOpen();

    done();
  });

  afterAll((done) => {
    process.chdir("../@htmlgoddess/cli");
    console.log(
      `Resetting and stashing changes for test submodule at: ${process.cwd()}`
    );

    // Renames newly created .git folders so when reset command
    // is run on submodules it will automatically remove them.
    execa.sync("mv", [
      path.join(TEST_PRINT_DIR, ".git"),
      path.join(TEST_PRINT_DIR, "git-remove"),
    ]);

    execa.sync("mv", [
      path.join(TEST_PROJECT_DIR, ".git"),
      path.join(TEST_PROJECT_DIR, "git-remove"),
    ]);

    // Resets the submodule test repo to orinal state
    execa.sync("git", [
      "submodule",
      "foreach",
      "git",
      "reset",
      "origin/master",
    ]);
    execa.sync("git", ["submodule", "foreach", "git", "reset", "--hard"]);
    execa.sync("git", [
      "submodule",
      "foreach",
      "--recursive",
      "git",
      "clean",
      "-d",
      "-x",
      "-f",
    ]);
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
      Create.run([TEST_PROJECT_DIR]).then((results) => {
        // @todo test console messages from stdout
        expect(results.name).toEqual(mockAnswers[0]);
        expect(results.template).toEqual(mockAnswers[1]);
        expect(results.path).toEqual(TEST_PROJECT_DIR);
        expect(
          fs.existsSync(path.join(results.path, "src/content/index.html"))
        ).toEqual(true);

        done();
      });
    });

    it("will throw error when non existent template is given", (done) => {
      const mockAnswers = ["My Test Site", "clog", "Y"];
      Create.run([TEST_PROJECT_DIR]).then(
        () => {},
        (error) => {
          expect(error).toBeTruthy();
          done();
        }
      );
    });
  });

  describe("print", () => {
    const time = Date.now();
    jest.setTimeout(10000);

    beforeAll((done) => {
      Create.run([TEST_PRINT_DIR]).then((results) => {
        done();
      });
    });
    
    it("can print", (done) => {
      fs.writeFileSync(
        path.join(TEST_PRINT_DIR, "src/content/can-print.html"),
        `<p>I am printed ${time}</p>`
      );

      Print.run([TEST_PRINT_DIR]).then((result) => {
        const output = fs.readFileSync(
          path.join(TEST_PRINT_DIR, "docs/can-print.html"),
          "utf-8"
        );
        expect(output).toContain(`<p>I am printed ${time}</p>`);
        done();
      });
    });

    it("can print:auto", async (done) => {
      PrintAuto.run([TEST_PROJECT_DIR, "--debounce=800"]).then(() => {
        // Gives some time for print:auto debounce
        setTimeout(() => {
          fs.writeFileSync(
            path.join(TEST_PROJECT_DIR, "src/content/can-print.html"),
            `<p>I am auto printed ${time}</p>`
          );

          setTimeout(() => {
            const output = fs.readFileSync(
              path.join(TEST_PROJECT_DIR, "docs/can-print.html"),
              "utf-8"
            );
            expect(output).toContain(`<p>I am auto printed ${time}</p>`);
            done();
          }, 3000);
        }, 1000);
      });
    });

    it("will ask the user to confirm when docs html file has been modified", (done) => {
      fs.writeFileSync(
        path.join(TEST_PRINT_DIR, "src/content/can-print.html"),
        `<p>I am printed ${time}</p>`
      );

      Print.run([TEST_PRINT_DIR]).then(async (output) => {
        mockCLIAnswers(["n"]);
        setTimeout(() => {
          fs.appendFileSync(
            path.join(TEST_PRINT_DIR, "docs/can-print.html"),
            `<!-- I am edited outside of print ${time} --!>`,
            { flag: "a", encoding: "utf8" }
          );

          const stats = fs.statSync(
            path.join(TEST_PRINT_DIR, "docs/can-print.html")
          );

          Print.run([TEST_PRINT_DIR]).then(
            (output) => {
              done();
            },
            (err) => {
              const fileContent = fs.readFileSync(
                path.join(TEST_PRINT_DIR, "docs/can-print.html"),
                "utf-8"
              );
              expect(fileContent).toContain(
                `<!-- I am edited outside of print ${time} --!>`
              );
              done();
            }
          );
        }, 3000);
      });
    });

    it("lets the user confirm to overwrite changes to the docs folder", (done) => {
      fs.writeFileSync(
        path.join(TEST_PRINT_DIR, "src/content/can-print.html"),
        `<p>I am printed ${time}</p>`
      );

      Print.run([TEST_PRINT_DIR]).then(async (output) => {
        setTimeout(() => {
          fs.appendFileSync(
            path.join(TEST_PRINT_DIR, "docs/can-print.html"),
            `<!-- I am edited outside of print ${time} --!>`,
            { flag: "a", encoding: "utf8" }
          );

          const stats = fs.statSync(
            path.join(TEST_PRINT_DIR, "docs/can-print.html")
          );

          mockCLIAnswers(["yes"]);

          Print.run([TEST_PRINT_DIR]).then(
            (output) => {
              const fileContent = fs.readFileSync(
                path.join(TEST_PRINT_DIR, "docs/can-print.html"),
                "utf-8"
              );
              expect(fileContent).not.toContain(
                `<!-- I am edited outside of print ${time} --!>`
              );
              done();
            },
            (err) => {
              done();
            }
          );
        }, 3000);
      });
    });
  });

  describe("format", () => {
    beforeEach((done) => {
      fs.writeFileSync(
        path.join(TEST_PROJECT_DIR, "src/content/can-format.html"),
        "<p>I <strong>am</strong>        formatted</p>"
      );
      done();
    });

    // afterEach((done) => {
    //   done();
    // });

    it("can format", (done) => {
      Format.run([TEST_PROJECT_DIR]).then((result) => {
        const output = fs.readFileSync(
          path.join(TEST_PROJECT_DIR, "src/content/can-format.html"),
          "utf-8"
        );
        expect(output).toContain("<p>I <strong>am</strong> formatted</p>");

        done();
      });
    });

    it("can format with a path", (done) => {
      Format.run([path.join(TEST_PROJECT_DIR)]).then((result) => {
        const output = fs.readFileSync(
          path.join(TEST_PROJECT_DIR, "src/content/can-format.html"),
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
      Serve.run([TEST_PROJECT_DIR]).then((process) => {
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
        path.join(TEST_PROJECT_DIR, "src/content/can-save.html"),
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
      Save.run([TEST_PROJECT_DIR]).then((result) => {
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
      Print.run([TEST_PROJECT_DIR, "--no-a11y"]).then((results) => {
        done();
      });
    });

    it("can validate accesibility", (done) => {
      A11y.run([TEST_PROJECT_DIR]).then((results) => {
        done();
      });
    });

    it("can validate against one url", (done) => {
      A11y.run([
        TEST_PROJECT_DIR,
        `--url=${path.join(TEST_PROJECT_DIR, "/docs/index.html")}`,
      ]).then((results) => {
        done();
      });
    });

    it("will catch errors", (done) => {
      fs.writeFileSync(
        path.join(TEST_PROJECT_DIR, "src/content/not-a11y.html"),
        `<p>I am not accessible ${time}. <img src="./bad-image.jpg" /></p>`
      );

      run(["print", TEST_PROJECT_DIR, "--no-a11y"]).then((results) => {
        A11y.run([TEST_PROJECT_DIR]).then(
          (results) => {
            expect(results.length).toBe(0);
            done();
          },
          (results) => {
            expect(results.length).toEqual(1);
            expect(results[0].issues[0].message).toEqual(
              "Img element missing an alt attribute. Use the alt attribute to specify a short text alternative."
            );
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
