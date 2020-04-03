const fs = require("fs");
const validate = require("./validate");

describe("common.config.validate", () => {
  test("should approve valid configurations", () => {
    expect(validate({ name: "Foo", path: "/foo" })).toHaveProperty("valid", true);
    expect(validate({ name: "Foo", path: "/foo", single: true })).toHaveProperty("valid", true);
    expect(validate({ name: "Foo", path: "/foo", single: false })).toHaveProperty("valid", true);
    expect(validate({ name: "Foo", path: "/foo", ref: "master" })).toHaveProperty("valid", true);
    expect(validate({ name: "Foo", path: "/foo", single: true, ref: "v1.0.0" })).toHaveProperty("valid", true);
  });
  test("should reject wrongly typed configuration values", () => {
    expect(validate({ name: 1, path: "/foo" })).toHaveProperty("valid", false);
    expect(validate({ name: "Foo", path: true })).toHaveProperty("valid", false);
    expect(validate({ name: "Foo", path: "/foo", single: "abcd" })).toHaveProperty("valid", false);
  });
  test("should reject missing required configuration properties", () => {
    expect(validate({ name: "Foo" })).toHaveProperty("valid", false);
    expect(validate({ path: "/foo" })).toHaveProperty("valid", false);
    expect(validate({ single: true })).toHaveProperty("valid", false);
  });
  test("should reject unrecognized configuration properties", () => {
    expect(validate({ name: "Foo", path: "/foo", UNRECOGNIZED_PROPERTY: 1 })).toHaveProperty("valid", false);
    expect(validate({ name: "Foo", path: "/foo", snigle: true })).toHaveProperty("valid", false);
  });
});
