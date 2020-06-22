"use strict";

import fs from "fs";
import path from "path";
import { run } from "../index";
import axios from "axios";
import execa from "execa";

describe("htmlgoddess Command", () => {
  let result;
  beforeAll(() => {
    console.log("Changing to test directory foo");
    process.chdir("../../test");
    process.env.CWD_PATH = process.cwd();
  });

  afterAll(() => {
    process.chdir("../@htmlgoddess/cli");
    console.log(
      `Reseting and stashing changes for test submodule at: ${process.cwd()}`
    );
    execa.sync('git', ['submodule', 'foreach', 'git', 'reset', 'origin/master']);
    execa.sync('git', ['submodule', 'foreach', 'git', 'reset', '--hard']);
  });

  beforeEach(() => {
    result = [];
    // jest
    //   .spyOn(process.stdout, "write")
    //   .mockImplementation((val) => result.push(val));
  });

  afterEach(() => jest.restoreAllMocks());

  describe("print", () => {
    const time = Date.now();
    it("can print",  (done) => {
      fs.writeFileSync(
        path.join(process.env.CWD_PATH, "src/content/can-print.html"),
        `<p>I am printed ${time}</p>`
      );
      run(["print"]).then((result)=> {
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
       run(["format"]).then(result => { 
        const output = fs.readFileSync(
          path.join(process.env.CWD_PATH, "docs/can-format.html"),
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
      run(["serve", process.env.CWD_PATH]).then(process => { 
        console.log('hello', process);
        // setTimeout(async () => {
        //   const response = await axios.get("http://127.0.0.1:3000");
        //   expect(response.status).toEqual(200);
        //   done();
        // }, 3000);
        done();
      })
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

    it("can save",  (done) => {
      // @todo make sure this cleans up
       run(["save", process.env.CWD_PATH]).then(result => { 
        const output = execa.sync("git", ["diff", "HEAD~1", "HEAD"]);
        expect(output.stdout).toContain(`+<p>I am saved at ${time}</p>`);
        done();
      });
    });
  });

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