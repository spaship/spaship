const apiKeyService = require("./apiKeyService");
describe("api.apiKey", () => {
  describe("getAPIKeyFromRequest", () => {
    test("should get api key from authentication header", async () => {
      const apiKey = "abcdefg";
      const req = {
        headers: {
          authorization: `APIKey ${apiKey}`,
        },
        query: {},
      };
      const result = apiKeyService.getAPIKeyFromRequest(req);

      expect(result).toMatch(apiKey);
    });

    test("should get api key from query parameter", async () => {
      const apiKey = "abcdefg";
      const req = {
        headers: {},
        query: {
          api_key: apiKey,
        },
      };
      const result = apiKeyService.getAPIKeyFromRequest(req);

      expect(result).toMatch(apiKey);
    });

    test("should get api key from query even the header have it", async () => {
      const apiKeyInHeader = "abcdefg";
      const apiKeyInQuery = "hijklmn";
      const req = {
        headers: {
          authorization: apiKeyInHeader,
        },
        query: {
          api_key: apiKeyInQuery,
        },
      };
      const result = apiKeyService.getAPIKeyFromRequest(req);

      expect(result).toMatch(apiKeyInQuery);
    });

    test("should not get api key ", async () => {
      const req = {
        headers: {},
        query: {},
      };
      const result = apiKeyService.getAPIKeyFromRequest(req);

      expect(result).toBeUndefined();
    });
  });
});
