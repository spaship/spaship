const common = require("./index");

describe("common.config exports", () => {
  ["read", "validate", "write", "append", "deploykey"].forEach(m => {
    test(`should export ${m}`, () => {
      expect(common).toHaveProperty(m);
    });
  });
});
