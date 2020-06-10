"use strict";

import fs from "fs";
import path from "path";
import { run } from "../index";
import http from "http";

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

  it("can print:auto", async () => {});

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

  it("can serve", async () => {

    // @todo figure out how to test server
    // and kill gracefully.
    const request = require("supertest");
    const server = await run(["serve"]);
    console.log("server", server);
    const options = {
      port: 3000,
      host: "127.0.0.1",
      method: "GET",
      path: "",
    };

    const response = await http.get(options);
    expect(response).toBeTruthy();
  });

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
