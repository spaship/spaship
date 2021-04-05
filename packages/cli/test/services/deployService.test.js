const assert = require("assert");
const nock = require("nock");
const FormData = require("form-data");
const DeployService = require("../../src/services/deployService");

describe("deployService", () => {
  it("http: upload success", async () => {
    const form = new FormData();
    form.append("name", "test-spa");
    form.append("path", "test-spa");
    form.append("ref", "latest");
    const mockData = {
      host: "http://spaship.server",
      path: "/api/v1/application/deploy",
      data: form,
      apiKey: "xxxx",
      response: {
        status: "success",
        data: {
          name: "test-spa",
          path: "/test-spa",
          ref: "latest",
          timestamp: "2020-05-29T01:52:53.666Z",
        },
      },
    };

    nock(mockData.host).post(mockData.path).reply(200, mockData.response);

    const response = await DeployService.upload(
      mockData.host + mockData.path,
      mockData.data,
      mockData.apiKey,
      () => {}
    );
    assert.deepStrictEqual(response, mockData.response);
  });

  it("https: upload success", async () => {
    const form = new FormData();
    form.append("name", "test-spa");
    form.append("path", "test-spa");
    form.append("ref", "latest");
    const mockData = {
      host: "https://spaship.server",
      path: "/api/v1/application/deploy",
      data: form,
      apiKey: "xxxx",
      response: {
        status: "success",
        data: {
          name: "test-spa",
          path: "/test-spa",
          ref: "latest",
          timestamp: "2020-05-29T01:52:53.666Z",
        },
      },
    };

    nock(mockData.host).post(mockData.path).reply(200, mockData.response);

    const response = await DeployService.upload(
      mockData.host + mockData.path,
      mockData.data,
      mockData.apiKey,
      () => {}
    );
    assert.deepStrictEqual(response, mockData.response);
  });

  it("https: upload failed", async () => {
    const form = new FormData();
    form.append("name", "test-spa");
    form.append("path", "test-spa");
    form.append("ref", "latest");
    const mockData = {
      host: "https://spaship.server",
      path: "/api/v1/application/deploy",
      data: form,
      apiKey: "xxxx",
      response: {
        status: "fail",
        message: "You are not auth",
      },
    };

    nock(mockData.host).post(mockData.path).reply(401, mockData.response);

    (async () => {
      await assert.rejects(async () => {
        await DeployService.upload(mockData.host + mockData.path, mockData.data, mockData.apiKey, () => {});
      });
    })();
  });

  it("http: upload failed", async () => {
    const form = new FormData();
    form.append("name", "test-spa");
    form.append("path", "test-spa");
    form.append("ref", "latest");
    const mockData = {
      host: "http://spaship.server",
      path: "/api/v1/application/deploy",
      data: form,
      apiKey: "xxxx",
      response: {
        status: "fail",
        message: "You are not auth",
      },
    };

    nock(mockData.host).post(mockData.path).reply(401, mockData.response);

    (async () => {
      await assert.rejects(async () => {
        await DeployService.upload(mockData.host + mockData.path, mockData.data, mockData.apiKey, () => {});
      });
    })();
  });
});
