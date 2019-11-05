const metadata = require("./metadata");
const mockfs = require("mock-fs");
const config = require("../config");

// override some configuration values
config.get = jest.fn(opt => {
  const fakeConfig = {
    webroot: "/fake/webroot"
  };
  return fakeConfig[opt];
});

// this is needed to allow console to continue working while the fs is mocked
global.console = require("../../../__mocks__/console");

describe("sync-service.metadata", () => {
  beforeEach(() => {
    mockfs({
      "/fake/webroot": {
        // some SPAs in the webroot
        foo: {
          "index.html": "<!doctype html><html></html>",
          "spaship.yaml": "name: Foo\npath: /foo\nref: v1.0.1\nsingle: true\ndeploykey: sehvgqrnyre"
        },
        foo_bar: {
          "index.html": "<!doctype html><html></html>",
          "spaship.yaml": "name: Foo Bar\npath: /foo/bar\nref: master\ndeploykey: zvapuhy"
        },
        baz: {
          "index.html": "<!doctype html><html></html>",
          "spaship.yaml": "name: Baz\npath: /baz\nref: a3eb124f\nsingle: true\ndeploykey: arfgrn"
        },
        // some non-SPAs in the webroot
        chrome: {},
        ".htaccess": "# global htaccess file"
      }
    });
  });
  afterEach(() => {
    mockfs.restore();
  });
  // test("should read configuration data from a spaship.yaml file", async () => {
  // // mock readFile
  // fs.promises.readFile = jest.fn();

  // const mockFileContent = "name: Foo\npath: /foo";
  // fs.promises.readFile.mockResolvedValue(mockFileContent);

  // const data = await read("./foo");
  // expect(data).toEqual({ name: "Foo", path: "/foo" });
  // });
  // describe("write", () => {});
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
          deploykey: "sehvgqrnyre"
        },
        {
          name: "Foo Bar",
          path: "/foo/bar",
          ref: "master",
          deploykey: "zvapuhy"
        },
        {
          name: "Baz",
          path: "/baz",
          ref: "a3eb124f",
          single: true,
          deploykey: "arfgrn"
        },
        // some non-SPAs in the webroot
        {
          path: "/.htaccess"
        },
        {
          path: "/chrome"
        }
      ];

      // test that the actual and expected arrays have the same items (couldn't find a jest matcher that does exactly
      // that, so I'm checking each array item one by one, and then checking the array lengths are the same)
      actuall.forEach(n => expect(expected).toContainEqual(n));
      expect(expected).toHaveLength(actuall.length);
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
        deploykey: "sehvgqrnyre"
      });
    });
  });
});
