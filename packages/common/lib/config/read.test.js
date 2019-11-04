const fs = require("fs");
const read = require("./read");
const mockfs = require("mock-fs");

describe("common.config.read", () => {
  beforeEach(() => {
    mockfs({
      "spaship.yaml": "name: Foo\npath: /foo\nref: v1.0.1\nsingle: true\ndeploykey: sehvgqrnyre"
    });
  });
  afterEach(() => {
    mockfs.restore();
  });
  test("should read configuration data from a spaship.yaml file", async () => {
    // mock readFile
    // fs.promises.readFile = jest.fn();

    // const mockFileContent = "name: Foo\npath: /foo";
    // fs.promises.readFile.mockResolvedValue(mockFileContent);

    const data = await read("./spaship.yaml");
    expect(data).toEqual({ name: "Foo", path: "/foo", deploykey: "sehvgqrnyre", single: true, ref: "v1.0.1" });
  });
});
