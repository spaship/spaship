const Autosync = require("./autosync");
const mockfs = require("mock-fs");
const { config } = require("@spaship/common");
const { get } = require("lodash");
const axios = require("axios");
const fsp = require("fs").promises;

// jest.mock("axios");

// override some configuration values
config.get = jest.fn(opt => {
  const fakeConfig = {
    webroot: "/fake/webroot",
    autosync: {
      enabled: true,
      targets: [
        {
          name: "chrome-head",
          interval: "5s",
          source: {
            url: "https://access.redhat.com/services/chrome/head",
            sub_paths: ["/en", "/kr", "/ja", "/zh_CN"]
          },
          dest: {
            path: "/fake/webroot/spaship/chrome/head",
            filename: "head.html"
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
global.console = require("../../../../__mocks__/console");

describe("sync-service.autosync", () => {
  beforeEach(() => {
    mockfs({
      "/fake/webroot": {}
    });
  });

  afterEach(() => {
    mockfs.restore();
  });

  describe("syncTarget", () => {
    test("should fetch the correct URL for a sync target", async () => {
      const as = new Autosync();
      await as.syncTarget(config.get("autosync").targets[0]);
      const head = await fsp.readFile("/fake/webroot/spaship/chrome/head/en/head.html");
      console.log(head);
      expect(1).toEqual(1);
    });
  });
});
