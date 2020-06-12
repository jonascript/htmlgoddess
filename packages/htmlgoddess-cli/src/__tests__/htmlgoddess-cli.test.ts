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
  });

  beforeEach(() => {
    result = [];
    jest
      .spyOn(process.stdout, "write")
      .mockImplementation((val) => result.push(val));
  });

  afterEach(() => jest.restoreAllMocks());

  it("can print", async () => {
    fs.writeFileSync(
      path.join("src/content/can-print.html"),
      "<p>I am printed</p>"
    );

    await run(["print"]);
    const output = fs.readFileSync(path.join("docs/can-print.html"), "utf-8");
    expect(output).toContain("<p>I am printed</p>");
  });

  // it("can print:auto", async () => {});

  it("can format", async () => {
    fs.writeFileSync(
      path.join("src/content/can-format.html"),
      "<p>I <strong>am</strong>        formatted</p>"
    );
    await run(["format"]);
    const output = fs.readFileSync(path.join("docs/can-format.html"), "utf-8");
    expect(output).toContain("<p>I <strong>am</strong> formatted</p>");
  });

  it("can format:auto", async () => {});

  it("can serve", async (done) => {
    // @todo figure out how to test server
    // and kill gracefully.
    await run(["serve"]);
    setTimeout(async () => {
      try {
        let response = await axios.get("http://localhost:3000");
        expect(response).toBeTruthy();
      } catch (error) {
        expect(error).not.toBeTruthy();
      }

      done();
    }, 1000);
  });

  it("can serve:auto", async () => {});

  it("can save", async (done) => {
    execa.sync("git", ["checkout", "unit-test"]);

    const time = Date.now();

    fs.writeFileSync(
      path.join("src/content/can-save.html"),
      `<p>I am saved at ${time}</p>`
    );

    await run(["save"]);
    setTimeout(() => {
      const output = execa.sync("git", ["diff", "HEAD~1", "HEAD"]);
      expect(output.stdout).toContain(`+<p>I am saved at ${time}</p>`);
      execa.sync("git", ["checkout", "master"]);
      done();
    }, 1000);
  });

  it("can publish", async (done) => {
    execa.sync("git", ["checkout", "unit-test"]);
    const time = Date.now();

    fs.writeFileSync(
      path.join("src/content/can-publish.html"),
      `<p>I am published at ${time}</p>`
    );

    await run(["publish"]);

    execa.sync("git", ["checkout", "master"]);
    done();
  });
});

// describe("htmlgoddess-cli", () => {
//   it("needs tests", (done) => {
//     expect(htmlgoddessCli).toBeTruthy();
//     done();
//   });
// });
