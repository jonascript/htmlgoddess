"use strict";

import fs from "fs";
import path from "path";
import { run } from "../index";
import axios from "axios";
import execa from "execa";

const TEST_DIR_PATH = "../../test";

describe("htmlgoddess Command", () => {
  let result;

  beforeAll(() => {
    process.chdir("../test");
    process.env.CWD_PATH = "/Users/Jon/dev/htmlgoddess-monorepo/packages/test";
  });

  beforeEach(() => {
    // result = [];
    // // jest
    // //   .spyOn(process.stdout, "write")
    // //   .mockImplementation((val) => result.push(val));
  });

  afterEach(() => jest.restoreAllMocks());

  describe("print", () => {
    const time = Date.now();
    // beforeEach((done) => {

    //   done();
    // });

    it("can print", async () => {
      fs.writeFileSync(
        path.join("src/content/can-print.html"),
        `<p>I am printed ${time}</p>`
      );
      await run(["print"]);
      const output = fs.readFileSync(path.join("docs/can-print.html"), "utf-8");
      expect(output).toContain(`<p>I am printed ${time}</p>`);

      execa.sync("git", [
        "checkout",
        path.join(process.cwd(), "src/content/can-print.html"),
      ]);
    });

    afterEach((done) => {
      done();
    });
  });
  // it("can print:auto", async () => {});
  describe("format", () => {
    it("can format", async () => {
      fs.writeFileSync(
        path.join("src/content/can-format.html"),
        "<p>I <strong>am</strong>        formatted</p>"
      );
      await run(["format"]);
      const output = fs.readFileSync(
        path.join("docs/can-format.html"),
        "utf-8"
      );
      expect(output).toContain("<p>I <strong>am</strong> formatted</p>");
    });

    // it("can format:auto", async () => {});
  });

  describe("serve", () => {
    it("can serve", (done) => {
      run(["serve", "../test"]);
      // @todo fix test
      setTimeout(async () => {
        const response = await axios.get("http://127.0.0.1:3000");
        expect(response.status).toEqual(200);
        done();
      }, 3000);
    });

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

    it("can save", async (done) => {
      // @todo make sure this cleans up
      await run(["save", process.env.CWD_PATH]);
      setTimeout(() => {
        const output = execa.sync("git", ["diff", "HEAD~1", "HEAD"]);
        expect(output.stdout).toContain(`+<p>I am saved at ${time}</p>`);
        done();
      }, 1000);
    });

    afterEach((done) => {
      execa.sync("git", [
        "checkout",
        path.join(process.env.CWD_PATH, "src/content/can-save.html"),
      ]);
      done();
    });
  });
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

// describe("htmlgoddess-cli", () => {
//   it("needs tests", (done) => {
//     expect(htmlgoddessCli).toBeTruthy();
//     done();
//   });
// });
