const uuid = require("uuid");
const mockfs = require("mock-fs");
const db_apikey = require("./db.apikey");
const config = require("../config");

// make uuid non-random while testing
jest.mock("uuid");
uuid.v4.mockResolvedValue("MOCK_KEY");

// override some configuration values
config.get = jest.fn(opt => {
  const fakeConfig = {
    webroot: "/fake/webroot"
  };
  return fakeConfig[opt];
});

// this is needed to allow console to continue working while the fs is mocked
global.console = require("../../../__mocks__/console");

describe("api.db.apikey", () => {
  beforeEach(() => {
    mockfs({});
  });
  afterEach(() => {
    mockfs.restore();
  });

  describe("attach", () => {
    test("should be able to attach to the collection", async () => {
      const apikeys = await db_apikey.attach();
      expect(apikeys).toBeDefined();
    });
  });
  describe("apikey CRUD", () => {
    test("should be able to create a new api key", async () => {
      const apikeys = await db_apikey.attach();

      // special mock key for this test
      uuid.v4.mockReturnValueOnce("fake.key");

      const doc = await apikeys.createKey("fake.name");

      expect(doc).toEqual({ userid: "fake.name", apikey: "fake.key" });
    });

    test("should be able to get api keys by userid", async () => {
      const apikeys = await db_apikey.attach();
      const userid = "bigbadogre";
      const apikey = "853626948149";
      const apikeyhash = "a8e998ee775645a42f5134aa26b7b55599b0924e7973b3561035ce4fdc526071";

      // special mock key for this test
      uuid.v4.mockReturnValueOnce(apikey);

      await apikeys.createKey(userid);

      const doc = await apikeys.getKeysByUser(userid);
      expect(doc).toMatchObject([{ userid, apikey: apikeyhash }]);
    });

    test("should be able to get userid by apikey", async () => {
      const apikeys = await db_apikey.attach();
      const userid = "babyyoda";
      const apikey = "018265271839";
      const apikeyhash = "fdf1fcb03dab8d28a97d2ab228225a196b9d99f0b3e1a2c1f6a05165ccb1d255";

      // special mock key for this test
      uuid.v4.mockReturnValueOnce(apikey);

      await apikeys.createKey(userid);

      const doc = await apikeys.getUserByKey(apikey);
      expect(doc).toMatchObject([{ userid, apikey: apikeyhash }]);
    });

    test("should be able to delete a key", async () => {
      const apikeys = await db_apikey.attach();
      const userid = "babyyoda";
      const apikey = "018265271839";

      // special mock key for this test
      uuid.v4.mockReturnValueOnce(apikey);

      // create key, delete it, then check for its existance

      await apikeys.createKey(userid);

      await apikeys.deleteKey(apikey);

      const doc = await apikeys.getUserByKey(apikey);
      expect(doc).not.toMatchObject([{ userid, apikey }]);
    });
    // return { getKeysByUser, getUserByKey, createKey, deleteKey };
  });
});
