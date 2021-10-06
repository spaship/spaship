const apiKeyError = require("../APIKeyError");

describe("check api key error", () => {
  it("response should have the correct properties", async () => {
    const res = await new apiKeyError("Testing API Key error");
    expect(res).toHaveProperty("name");
    expect(res).toHaveProperty("status");
    expect(res).toHaveProperty("statusCode");

    expect(typeof res.name).toBe("string");
    expect(typeof res.status).toBe("string");
    expect(typeof res.statusCode).toBe("number");
  });

  it("response should have correct values", async () => {
    const res = await new apiKeyError("Testing API Key error");
    expect(res.name).toBe("APIKeyError");
    expect(res.status).toBe("fail");
    expect(res.statusCode).toBe(401);
  });
});
