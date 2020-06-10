"use strict";

import fs from "fs";
import path from "path";

import { run } from "../index";

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
    const output = fs.readFileSync(
      path.join("src/content/can-print.html"),
      "utf-8"
    );

    expect(output).toContain("<p>I am printed</p>");
  });

  it("can print:auto", async () => {});

  it("can format", async () => {});

  it("can format:auto", async () => {});

  it("can serve", async () => {});

  it("can serve:auto", async () => {});

  it("can save", async () => {});

  it("can publish", async () => {});
});

// describe("htmlgoddess-cli", () => {
//   it("needs tests", (done) => {
//     expect(htmlgoddessCli).toBeTruthy();
//     done();
//   });
// });
