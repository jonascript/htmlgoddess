"use strict";

const htmlgoddessCli = require("../lib");

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
    await htmlgoddessCli.run(["print"]);
    expect(result[0]).toContain("Printing your website from ./src to ./docs");
    expect(result[1]).toContain("Your website has been printed");
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
