"use strict";
import * as fs from "fs";
import * as path from "path";
import rimraf from "rimraf";
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
import { isExportDeclaration } from "typescript";

const TEST_DIR_RELATIVE_PATH = './packages/test';

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

let cliAnswerQueue = [];

/**
 * @todo this function does not work as expected. When it's called multiple times it doesnt' keep scope.
 * Mocking for interactive prompts.
 * @param answers
 */
function mockCLIAnswers() {
  // Mocking inquirier answer for create
  // @todo questions come in as arrays. Currently only using one 
  // question at a time but should make this handle all cases.
  inquirer.prompt = (questions) => {
    const answer = cliAnswerQueue.shift();
    return Promise.resolve({ [`${questions[0].name}`]: answer });
  };

  jest.mock("../../node_modules/cli-ux/lib/prompt.js", () => {
    return {
      ...prompt,
      confirm: (message) => {
        console.log(message);
        return cliAnswerQueue.shift();
      },
      prompt: async (prompt, icon) => {
        console.log(prompt);
        return new Promise((resolve, reject) => {
          resolve(cliAnswerQueue.shift());
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
    TEST_PRINT_DIR,
    TEST_SAVE_DIR,
    TEST_SERVE_DIR;

  beforeAll((done) => {
    mockCLIAnswers();
    console.log("Changing to test directory.");
    process.chdir("../..");
    fs.mkdirSync('test');
    process.chdir("test");
    TEST_DIR = process.cwd();

    TEST_PROJECT_DIR = path.join(TEST_DIR, "testproject");
    TEST_PRINT_DIR = path.join(TEST_DIR, "testprint");
    TEST_SAVE_DIR = path.join(TEST_DIR, "testsave");
    TEST_SERVE_DIR = path.join(TEST_DIR, 'testserve');
    mockCLIOpen();
    done();
  });

  afterAll((done) => {
    jest.restoreAllMocks();
    // Make sure it's the right dir before deleting the directory.
    if (/packages\/test/.test(TEST_DIR)) {
      rimraf.sync(TEST_DIR)
    } else {
      throw new Error('@htmlgoddess/cli test directory does match test. aborting delete. Please delete your test direcory manually')
    }
    done();
  });

  beforeEach(() => {
    cliAnswerQueue = [];
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
    cliAnswerQueue = [];
    jest.restoreAllMocks();
  });

  describe("create", () => {
    it("can create a new site", async (done) => {

      const mockAnswers = ["My Test Site", "blog", "latex.css", "Y"]

      cliAnswerQueue.push(...mockAnswers);

      Create.run([TEST_PROJECT_DIR]).then((results) => {
        // @todo test console messages from stdout
        expect(results.name).toEqual(mockAnswers[0]);
        expect(results.template).toEqual(mockAnswers[1]);
        expect(results.path).toEqual(TEST_PROJECT_DIR);
        expect(
          fs.existsSync(path.join(results.path, "src/content/index.html"))
        ).toEqual(true);

        expect(
          fs.existsSync(path.join(results.path, "src/content/blog/post/hello-world.html"))
        ).toEqual(true);


        expect(
          fs.readFileSync(
            path.join(results.path, "src/templates/head/index.html"),
            "utf-8"
          )
        ).toContain('latex.css');


        done();
      });
    });

    it("will throw error when non existent template is given", (done) => {
      const mockAnswers = ["My Test Site", "clog", "latex.css", "Y"];
      cliAnswerQueue.push(...mockAnswers)
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
      const mockAnswers = ["My Test Site", "blog","latex.css", "Y"];
      cliAnswerQueue.push(...mockAnswers)
      Create.run([TEST_PRINT_DIR]).then((results) => {
        done();
      });
    });
    
    describe("can print", () => {
      beforeEach(() => {
        fs.writeFileSync(
          path.join(TEST_PRINT_DIR, "src/content/can-print.html"),
          `<p>I am printed ${time}</p>`
        );
      })

      afterEach(() => {
        fs.unlinkSync(
          path.join(TEST_PRINT_DIR, "src/content/can-print.html")
        )
        fs.unlinkSync(
          path.join(TEST_PRINT_DIR, "docs/can-print.html")
        )
      });

      it("can print", (done) => {
        Print.run([TEST_PRINT_DIR]).then((result) => {
          const output = fs.readFileSync(
            path.join(TEST_PRINT_DIR, "docs/can-print.html"),
            "utf-8"
          );
          expect(output).toContain(`<p>I am printed ${time}</p>`);
          done();
        });
      });
    });
    describe('print:auto', () => {
      beforeEach((done) => {
        PrintAuto.run([TEST_PRINT_DIR, "--debounce=800"]).then(() => {
          done();
        })
      });
      afterEach(() => {
        rimraf.sync(path.join(TEST_PRINT_DIR, 'docs'));
      });
      it("can print:auto",  async (done) => {
        // Gives some time for print:auto debounce
        setTimeout(() => {
          fs.writeFileSync(
            path.join(TEST_PRINT_DIR, "src/content/can-print.html"),
            `<p>I am auto printed ${time}</p>`
          );

          setTimeout(() => {
            const output = fs.readFileSync(
              path.join(TEST_PRINT_DIR, "docs/can-print.html"),
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
        cliAnswerQueue.push('n')
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

          cliAnswerQueue.push("yes");
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
    beforeEach(async () => {
      const mockAnswers = ["My Test Site", "blog", "latex.css", "Y"]
      cliAnswerQueue.push(...mockAnswers);
      await Create.run([TEST_SERVE_DIR]);
      await Print.run([TEST_SERVE_DIR])
    })
    it("can serve", (done) => {
      Serve.run([TEST_SERVE_DIR]).then((process) => {
        console.log('serving', TEST_SERVE_DIR)
        setTimeout(async () => {
          const response = await axios.get("http://127.0.0.1:3000");
          expect(response.status).toEqual(200);
          done();
        }, 2000);
      });
    });
    // it("can serve without param passed", (done) => {
    // })
    // it("can serve:auto", async () => {});
  });

  describe("save", () => {
    const time = Date.now();
    beforeEach(async () => {
      const mockAnswers = ["My Test Site", "blog", "latex.css", "Y"]
      cliAnswerQueue.push(...mockAnswers);
      await Create.run([TEST_SAVE_DIR]);
      fs.writeFileSync(
        path.join(TEST_SAVE_DIR, "src/content/can-save.html"),
        `<p>I am saved at ${time}</p>`
      );
    });

    afterEach((done) => {
      done();
    });

    it("can save", (done) => {
      // @todo make sure this cleans up
      Save.run([TEST_SAVE_DIR]).then((result) => {
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

    it("will catch errors", async () => {
      fs.writeFileSync(
        path.join(TEST_PROJECT_DIR, "src/content/not-a11y.html"),
        `<p>I am not accessible ${time}. <img src="./bad-image.jpg" /></p>`
      );

      await run(["print", TEST_PROJECT_DIR, "--no-a11y"]);
      let results;
      try {
        results = await A11y.run([TEST_PROJECT_DIR]);
      } catch (error) {
        results = error;
      }
  
      expect(results.length).toEqual(1);
      expect(results[0].issues[0].message).toEqual(
           "Img element missing an alt attribute. Use the alt attribute to specify a short text alternative."
        );
      
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
