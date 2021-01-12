const fs = require("fs");
const read = require("./read");

describe("common.config.read", () => {
  test("should read configuration data from a spaship.yaml file", async () => {
    const fsPromisesRef = fs.promises.readFile;
    fs.promises.readFile = jest.fn();
    const mockFileContent = "name: Foo\npath: /foo\nref: v1.0.1\nsingle: true\ndeploykey: sehvgqrnyre";
    fs.promises.readFile.mockResolvedValue(mockFileContent);

    const data = await read("./spaship.yaml");
    expect(data).toEqual({ name: "Foo", path: "/foo", deploykey: "sehvgqrnyre", single: true, ref: "v1.0.1" });
    await fs.promises.readFile.mockRestore();
    fs.promises.readFile = fsPromisesRef;
  });

  test("should read configuration data from a spaship.yaml file when input filename is spaship.yml OR spaship.YAML OR spaship.YML and checkExtensionVariations flag is true", async () => {
    const data = await read(__dirname + "/mockDataTests/common.config.read/spaship.yml", {
      checkExtensionVariations: true,
    });
    expect(data).toEqual({ name: "Bar", path: "/bar", deploykey: "sehvgqrnyre", single: true, ref: "v1.0.1" });

    const data1 = await read(__dirname + "/mockDataTests/common.config.read/spaship.YAML", {
      checkExtensionVariations: true,
    });
    expect(data1).toEqual({ name: "Bar", path: "/bar", deploykey: "sehvgqrnyre", single: true, ref: "v1.0.1" });

    const data2 = await read(__dirname + "/mockDataTests/common.config.read/spaship.YML", {
      checkExtensionVariations: true,
    });
    expect(data2).toEqual({ name: "Bar", path: "/bar", deploykey: "sehvgqrnyre", single: true, ref: "v1.0.1" });
  });

  test("should throw file doesn't exist for (spaship.yml) when checkExtensionVariations is false", async () => {
    try {
      await read(__dirname + "/mockDataTests/common.config.read/spaship.yml", { checkExtensionVariations: false });
    } catch (err) {
      expect(err.message).toMatch(/no such file or directory/);
    }
  });

  test("should throw file doesn't exist", async () => {
    try {
      await read(__dirname + "/WRONG_PATH");
    } catch (err) {
      expect(err.message).toMatch(/no such file or directory/);
    }
    try {
      await read(__dirname + "/mockDataTests/common.config.read/spaship.yml");
    } catch (err) {
      expect(err.message).toMatch(/no such file or directory/);
    }
  });
});
