const Autosync = require("./autosync");
const mockfs = require("mock-fs");
const { config } = require("@spaship/common");
const { find } = require("lodash");
const axios = require("axios");
const fsp = require("fs").promises;

jest.mock("axios");

// override some configuration values
config.get = jest.fn(opt => {
  const fakeConfig = {
    webroot: "/fake/webroot",
    autosync: {
      enabled: true,
      targets: [
        {
          name: "test-target-1",
          interval: "5s",
          source: {
            url: "https://fakeurl.foo"
          },
          dest: {
            path: "/fake/webroot/spaship/test-target-1",
            filename: "index.html"
          }
        },
        {
          name: "target-with-subpaths",
          interval: "5s",
          source: {
            url: "https://fakeurl.foo/path",
            sub_paths: ["/path1", "/path2", "/path3", "/path4"]
          },
          dest: {
            path: "/fake/webroot/spaship/target-with-subpaths",
            filename: "index.html"
          }
        },
        {
          name: "chrome-header",
          interval: "5s",
          source: {
            url: "https://access.redhat.com/services/chrome/header",
            sub_paths: ["/en", "/kr", "/ja", "/zh_CN"]
          },
          dest: {
            path: "/fake/webroot/spaship/chrome/header",
            filename: "header.html"
          }
        },
        {
          name: "chrome-footer",
          interval: "5s",
          source: {
            url: "https://access.redhat.com/services/chrome/footer",
            sub_paths: ["/en", "/kr", "/ja", "/zh_CN"]
          },
          dest: {
            path: "/fake/webroot/spaship/chrome/footer",
            filename: "footer.html"
          }
        }
      ]
    }
  };
  return fakeConfig[opt];
});

// this is needed to allow console to continue working while the fs is mocked
// global.console = require("../../../../__mocks__/console");

describe("sync-service.autosync", () => {
  beforeEach(() => {
    mockfs({
      // scaffold out the full directory structure because autosync uses fsp.mkdir with recursive:true, which does not
      // seem to be supported in mockfs.  In a real filesystem, the full directory structure does _not_ need to be
      // created ahead of time.  This could be reduced to `"/fake/webroot": {}` once mockfs supports the recusive option
      // in fsp.mkdir.
      "/fake/webroot": {
        spaship: {
          chrome: {
            head: {},
            header: {},
            footer: {}
          }
        }
      }
    });
  });

  afterEach(() => {
    mockfs.restore();
  });

  describe("syncTarget", () => {
    test("should save to disk the response from a sync target", async () => {
      const responseText = "TEST RESPONSE STRING";
      const as = new Autosync();
      axios.get.mockResolvedValue({
        status: 200,
        data: responseText
      });
      const target = find(config.get("autosync").targets, {
        name: "test-target-1"
      });
      await as.syncTarget(target);
      const cache = await fsp.readFile("/fake/webroot/spaship/test-target-1/index.html");
      expect(cache.toString()).toEqual(responseText);
    });

    test("should save to disk the response from a sync target with subpaths", async () => {
      const responseText = "TEST RESPONSE STRING";
      const as = new Autosync();
      axios.get.mockImplementation(url => {
        console.log(url);
        const [lang] = /\/[^/]*$/.exec(url);
        console.log(lang);
        return {
          status: 200,
          data: `${lang} ${responseText}`
        };
      });

      const target = find(config.get("autosync").targets, {
        name: "target-with-subpaths"
      });
      await as.syncTarget(target);

      for (let p of ["/path1", "/path2", "/path3", "/path4"]) {
        const cache = await fsp.readFile(`/fake/webroot/spaship/target-with-subpaths${p}/index.html`);
        expect(cache.toString()).toEqual(`${p} ${responseText}`);
      }
    });
  });
});
