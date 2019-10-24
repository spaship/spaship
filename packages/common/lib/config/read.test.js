const fs = require("fs");
const read = require("./read");

describe("common/read", () => {
  test("should read configuration data from a spaship.yaml file", async () => {
    // mock readFile
    fs.promises.readFile = jest.fn();

    const mockFileContent = "name: Foo\npath: /foo";
    // console.log(fs.promises);
    fs.promises.readFile.mockResolvedValue(mockFileContent);

    const data = await read("./foo");
    expect(data).toEqual({ name: "Foo", path: "/foo" });
  });
});
