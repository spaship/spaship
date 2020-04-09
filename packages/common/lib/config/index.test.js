const common = require("./index");

describe("common.config exports", () => {
  ["read", "validate", "write", "append"].forEach((m) => {
    test(`should export ${m}`, () => {
      expect(common).toHaveProperty(m);
    });
  });
});
