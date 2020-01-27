const fs = require("fs");
const write = require("./write");
const validate = require("./validate");
const logger = require("../logging/pino");

/**
 * Remove comments and empty lines from a yaml string.
 */
function trimYaml(yml) {
  return yml
    .split("\n")
    .filter(line => !/^\s*#/.test(line)) // remove comments
    .filter(line => !/^\s*$/.test(line)) // remove empty lines
    .join("\n");
}

// mock filesystem
let fileData = {};
jest.mock("./validate");

describe("common.config.write", () => {
  beforeAll(() => {
    validate.mockImplementation(() => ({ valid: true }));

    fs.promises.writeFile = jest.fn((filename, content) => {
      fileData[filename] = content;
    });
  });
  afterAll(() => {
    jest.unmock("./validate");
    fs.promises.writeFile.mockRestore();
  });
  beforeEach(() => {
    fileData = {};
  });
  test("should write configuration data to a spaship.yaml file", async () => {
    const mockFileContent = "name: Foo\npath: /foo\nsingle: true";

    const fn = "spaship.yaml";
    const conf = { name: "Foo", path: "/foo", single: true };

    await write(fn, conf);
    expect(trimYaml(fileData[fn])).toEqual(mockFileContent);
  });
  test("should print a warning only when asked to write invalid configuration data", async () => {
    validate.mockImplementationOnce(() => ({
      valid: false
    }));
    logger.log.warn = jest.fn();

    // call write to test whether it responds to validate saying "no!"
    await write("", {});

    expect(logger.log.warn).toHaveBeenCalled();
    logger.log.warn.mockRestore();
  });
});
