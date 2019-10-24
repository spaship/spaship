const fs = require("fs");
const write = require("./write");

let fileData = {};

fs.promises.writeFile = jest.fn((filename, content) => {
  fileData[filename] = content;
});
// fs.promises.readFile = jest.fn(filename => fileData[filename]);

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

describe("common/write", () => {
  beforeEach(() => {
    fileData = {};
  });
  test("should write configuration data to a spaship.yaml file", async () => {
    const mockFileContent = "name: Foo\npath: /foo\nsingle: true";
    // console.log(fs.promises);
    // fs.promises.readFile.mockResolvedValue(mockFileContent);

    const fn = "spaship.yaml";
    const conf = { name: "Foo", path: "/foo", single: true };

    await write(fn, conf);
    expect(trimYaml(fileData[fn])).toEqual(mockFileContent);
  });
});
