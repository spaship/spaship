const fs = require("fs");
const read = require("./read");

describe("common.config.read", () => {
  test("should read configuration data from a spaship.yaml file", async () => {
    // mock readFile
    fs.promises.readFile = jest.fn();

    const mockFileContent = "name: Foo\npath: /foo";
    fs.promises.readFile.mockResolvedValue(mockFileContent);

    const data = await read("./foo");
    expect(data).toEqual({ name: "Foo", path: "/foo" });
  });
});
