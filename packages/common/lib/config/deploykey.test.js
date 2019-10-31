const fs = require("fs");
const { flow, range, map, uniqWith, get, isEqual, isString } = require("lodash/fp");
const deploykey = require("./deploykey");

describe("common.config.deploykey", () => {
  test("should generate ids", () => {
    expect(isString(deploykey.generate())).toBe(true);
  });
  test("should generate unique ids", async () => {
    // generate a large array of deploykeys, uniq the array, and test that the array lengths match
    const count = 1000;

    const uniqCount = flow(
      range(),
      map(deploykey.generate),
      uniqWith(isEqual),
      get("length")
    )(0, count);

    expect(uniqCount).toEqual(count);
  });
});
