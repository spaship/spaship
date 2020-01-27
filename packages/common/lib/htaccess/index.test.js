const fs = require("fs");
const htaccess = require("./index");

// mock filesystem
let fileData = {};

describe("common/htaccess", () => {
  beforeAll(() => {
    fs.promises.writeFile = jest.fn((dir, content) => {
      fileData[dir] = content;
    });
  });
  afterAll(() => {
    fs.promises.writeFile.mockRestore();
  });
  beforeEach(() => {
    fileData = {};
  });
  describe("common/htaccess.generate", () => {
    test("should generate an htaccess file which sets 'X-Spaship-Name' header", async () => {
      const hta = await htaccess.generate({ name: "Foo", path: "/foo" });
      expect(hta).toMatch(/x-spaship-name/i);
    });
    test("should generate an htaccess file with index.html path rewrite when 'single' true", async () => {
      const hta = await htaccess.generate({ name: "Foo", path: "/foo", single: true });
      expect(hta).toMatch(/x-spaship-single/i);
      expect(hta).toMatch(/RewriteRule.*index.html/);
      expect(hta).toMatch(/RewriteEngine\s+On/);
    });
    test("should error when given invalid configuration", async () => {
      expect(htaccess.generate({})).rejects.toThrow();
    });
  });
  describe("common/htaccess.write", () => {
    test("should write a file with provided configuration", async () => {
      await htaccess.write("foo", { name: "Foo", path: "/foo" });
      expect(fileData["foo/.htaccess"]).toMatch(/x-spaship-name/i);
    });
  });
});
