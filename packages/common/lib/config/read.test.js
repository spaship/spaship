const fs = require("fs");
const read = require("./read");
const mockfs = require("mock-fs");

describe("common.config.read", () => {
  // beforeAll(() => {
  //   mockfs({
  //     "spaship.yaml": "name: Foo\npath: /foo\nref: v1.0.1\nsingle: true\ndeploykey: sehvgqrnyre"
  //   });
  // });
  afterAll(() => {
    // mockfs.restore();
  });
  test("should read configuration data from a spaship.yaml file", async () => {
    // mock readFile
    fs.promises.readFile = jest.fn();
    const mockFileContent = "name: Foo\npath: /foo\nref: v1.0.1\nsingle: true\ndeploykey: sehvgqrnyre";
    fs.promises.readFile.mockResolvedValue(mockFileContent);

    const data = await read("./spaship.yaml");
    expect(data).toEqual({ name: "Foo", path: "/foo", deploykey: "sehvgqrnyre", single: true, ref: "v1.0.1" });

    fs.promises.readFile.mockRestore();
  });
});
