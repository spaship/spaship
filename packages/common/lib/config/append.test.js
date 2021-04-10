const fs = require("fs");
const yaml = require("js-yaml");
const append = require("./append");
const write = require("./write");
const validate = require("./validate");

// mock filesystem
let fileData = {};

describe("common.config.append", () => {
  beforeEach(() => {
    fileData = {};
  });
  beforeAll(() => {
    fs.promises.writeFile = jest.fn((filename, content) => {
      fileData[filename] = content;
    });

    fs.promises.readFile = jest.fn((filename) => fileData[filename]);
    fs.promises.access = jest.fn((filename) => true);
  });
  afterAll(() => {
    fs.promises.writeFile.mockRestore();
    fs.promises.readFile.mockRestore();
  });
  test("should be able to append properties to an existing spaship.yaml file", async () => {
    const filename = "spaship.yaml";
    fileData[filename] = "name: Foo\npath: /foo";
    await append(filename, { ref: "v1.0.0" });
    const appended = yaml.load(fileData[filename]);
    expect(appended).toEqual({ name: "Foo", path: "/foo", ref: "v1.0.0" });
  });
  test("should be able to append existing properties to update them", async () => {
    const filename = "spaship.yaml";
    fileData[filename] = "name: Foo\npath: /foo";
    await append(filename, { path: "/bar" });
    const appended = yaml.load(fileData[filename]);
    expect(appended).toEqual({ name: "Foo", path: "/bar" });
  });
  test("should be able to create file if a file by the given name doesn't already exist", async () => {
    const filename = "spaship.yaml";
    const data = { name: "Foo", path: "/foo", ref: "v1.0.0" };

    // make readFile throw an error to simulate a nonexistant file
    fs.promises.readFile = jest.fn(async function () {
      throw new Error();
    });

    await append(filename, data);
    const appended = yaml.load(fileData[filename]);
    expect(appended).toEqual(data);

    fs.promises.readFile.mockRestore();
  });
});
