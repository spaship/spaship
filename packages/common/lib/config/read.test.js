const fs = require("fs");
const read = require("./read");

describe("common.config.read", () => {
  beforeAll(() => {
    fs.promises.readFile = jest.fn();
  });
  afterAll(() => {
    fs.promises.readFile.mockRestore();
  });
  test("should read configuration data from a spaship.yaml file", async () => {
    const mockFileContent = "name: Foo\npath: /foo\nref: v1.0.1\nsingle: true\ndeploykey: sehvgqrnyre";
    fs.promises.readFile.mockResolvedValue(mockFileContent);

    const data = await read("./spaship.yaml");
    expect(data).toEqual({ name: "Foo", path: "/foo", deploykey: "sehvgqrnyre", single: true, ref: "v1.0.1" });
  });
});
