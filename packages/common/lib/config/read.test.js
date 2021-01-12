const read = require("./read");

describe("common.config.read", () => {
  test("should read configuration data from a spaship.yaml file", async () => {
    const data = await read(__dirname + "/mockDataTests/common.config.read/spaship.yaml");
    expect(data).toEqual({ name: "Bar", path: "/bar", deploykey: "sehvgqrnyre", single: true, ref: "v1.0.1" });
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
    let err;
    try {
      await read(__dirname + "/WRONG_PATH", { checkExtensionVariations: false });
    } catch (error) {
      err = error;
    }
    expect(err.message).toMatch(/no such file or directory/);

    let err1;
    try {
      await read(__dirname + "/mockDataTests/common.config.read/spaship.yml", { checkExtensionVariations: false });
    } catch (error) {
      err1 = error;
    }
    expect(err1.message).toMatch(/no such file or directory/);

    let err2;
    try {
      await read(__dirname + "/WRONG_PATH", { checkExtensionVariations: true });
    } catch (error) {
      err2 = error;
    }
    expect(err2.message).toMatch(/no such file or directory/);
  });
});
