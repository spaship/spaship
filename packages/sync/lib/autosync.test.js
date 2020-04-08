const Autosync = require("./autosync");
const mockfs = require("mock-fs");
const config = require("../config");
const { find, get } = require("lodash");
const axios = require("axios");
const fsp = require("fs").promises;

jest.mock("axios");
jest.mock("../config");

// override some configuration values
config.get = jest.fn((opt) => {
  const fakeConfig = {
    autosync: {
      enabled: true,
      targets: [
        {
          name: "test-target-1",
          interval: "5s",
          source: {
            url: "https://fakeurl.foo",
          },
          dest: {
            path: "/fake/webroot/spaship/test-target-1",
            filename: "index.html",
          },
        },
        {
          name: "target-with-subpaths",
          interval: "5s",
          source: {
            url: "https://fakeurl.foo/path",
            sub_paths: ["/path1", "/path2", "/path3", "/path4"],
          },
          dest: {
            path: "/fake/webroot/spaship/target-with-subpaths",
            filename: "index.html",
          },
        },
      ],
    },
  };
  const prop = opt.replace(":", ".");
  const val = get(fakeConfig, prop);
  return val;
});

// this is needed to allow console to continue working while the fs is mocked
global.console = require("../../../__mocks__/console");

describe("autosync", () => {
  beforeEach(() => {
    mockfs({
      // scaffold the mock filesystem, just a webroot directory
      "/fake/webroot": {},
    });
  });

  afterEach(() => {
    mockfs.restore();
  });

  describe("syncTarget", () => {
    describe("lifecycle", () => {
      test("should start and stop", async () => {
        const as = new Autosync();
        expect(as.isRunning()).toEqual(false);
        as.start();
        expect(as.isRunning()).toEqual(true);
        as.stop();
        expect(as.isRunning()).toEqual(false);
        as.start();
        expect(as.isRunning()).toEqual(true);
        as.stop();
        expect(as.isRunning()).toEqual(false);
      });
      test("should sync targets while running", async () => {});
      test("should sync targets periodically per target's timer", async () => {});
    });
    describe("disk cache", () => {
      test("should save to disk the response from a sync target", async () => {
        const responseText = "TEST RESPONSE STRING";
        const as = new Autosync();
        axios.get.mockResolvedValue({
          status: 200,
          data: responseText,
        });
        const target = find(config.get("autosync:targets"), {
          name: "test-target-1",
        });
        await as.syncTarget(target);
        const cache = await fsp.readFile("/fake/webroot/spaship/test-target-1/index.html");
        expect(cache.toString()).toEqual(responseText);
      });

      test("should save to disk the response from a sync target with subpaths", async () => {
        const responseText = "TEST RESPONSE STRING";
        const as = new Autosync();
        axios.get.mockImplementation((url) => {
          // extract the lang and add it to the HTTP response, so that each endpoint has a unique response.
          const [lang] = /\/[^/]*$/.exec(url);
          return {
            status: 200,
            data: `${lang} ${responseText}`,
          };
        });

        const target = find(config.get("autosync:targets"), {
          name: "target-with-subpaths",
        });
        await as.syncTarget(target);

        // make sure each autosync'd file has the expected contents.
        for (let p of ["/path1", "/path2", "/path3", "/path4"]) {
          const cache = await fsp.readFile(`/fake/webroot/spaship/target-with-subpaths${p}/index.html`);
          expect(cache.toString()).toEqual(`${p} ${responseText}`);
        }
      });
    });
  });
});
