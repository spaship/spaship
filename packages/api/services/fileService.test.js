const metadata = require("./metadata");
const mockfs = require("mock-fs");
const config = require("../config");
const fsp = require("fs").promises;
const fs = require("fs");

// override some configuration values
config.get = jest.fn((opt) => {
  const fakeConfig = {
    webroot: "/fake/webroot",
  };
  return fakeConfig[opt];
});

// this is needed to allow console to continue working while the fs is mocked
global.console = require("../../../__mocks__/console");

describe("api.metadata", () => {
  beforeEach(() => {
    mockfs({
      "/fake/webroot": mockfs.directory({
        items: {
          // some SPAs in the webroot
          foo: mockfs.directory({
            ctime: new Date("2020-02-02"),
            items: {
              "index.html": "<!doctype html><html></html>",
              "spaship.yaml": "name: Foo\npath: /foo\nref: v1.0.1\nsingle: true\ndeploykey: sehvgqrnyre",
            },
          }),
          foo_bar: mockfs.directory({
            ctime: new Date("2020-02-02"),
            items: {
              "index.html": "<!doctype html><html></html>",
              "spaship.yaml": "name: Foo Bar\npath: /foo/bar\nref: master\ndeploykey: zvapuhy",
            },
          }),
          baz: mockfs.directory({
            ctime: new Date("2020-02-02"),
            items: {
              "index.html": "<!doctype html><html></html>",
              "spaship.yaml": "name: Baz\npath: /baz\nsingle: true\ndeploykey: arfgrn",
            },
          }),
          // some non-SPAs in the webroot
          _include: {},
          _test1: {},
          ".htaccess": "# global htaccess file",
        },
      }),
    });
  });
  afterEach(() => {
    mockfs.restore();
  });

  describe("write", () => {
    test("should add metadata to a deployed SPA", async () => {
      await metadata.write("/fake/webroot/baz/spaship.yaml", { ref: "a3eb124f" });

      const yaml = await fsp.readFile("/fake/webroot/baz/spaship.yaml");
      expect(yaml.toString()).toMatch("ref: a3eb124f");
    });
  });

  describe("getAll", () => {
    test("should retrieve metadata for all deployed SPAs", async () => {
      const actuall = await metadata.getAll();
      const expected = [
        // some SPAs in the webroot
        {
          name: "Foo",
          path: "/foo",
          ref: "v1.0.1",
          single: true,
          deploykey: "sehvgqrnyre",
          timestamp: new Date("2020-02-02"),
        },
        {
          name: "Foo Bar",
          path: "/foo/bar",
          ref: "master",
          deploykey: "zvapuhy",
          timestamp: new Date("2020-02-02"),
        },
        {
          name: "Baz",
          path: "/baz",
          single: true,
          deploykey: "arfgrn",
          timestamp: new Date("2020-02-02"),
        },
      ];

      // test that the actual and expected arrays have the same items (couldn't find a jest matcher that does exactly
      // that, so I'm checking each array item one by one, and then checking the array lengths are the same)
      actuall.forEach((n) => expect(expected).toContainEqual(n));
      expect(expected).toHaveLength(actuall.length);
    });
    test("should return an empty array if the webroot can't be accessed", async () => {
      // "remove" the webroot
      mockfs.restore();
      mockfs({
        "/fake": {},
      });

      const all = await metadata.getAll();

      expect(all).toHaveLength(0);
    });
  });

  describe("get", () => {
    test("should retrieve metadata when given a spa's directory", async () => {
      const meta = await metadata.get("foo");

      expect(meta).toEqual({
        name: "Foo",
        path: "/foo",
        ref: "v1.0.1",
        single: true,
        deploykey: "sehvgqrnyre",
        timestamp: new Date("2020-02-02"),
      });
    });
  });
});
