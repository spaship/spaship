const axios = require("axios");
const mockfs = require("mock-fs");
const pathProxy = require("./index");

describe("router", () => {
  beforeEach(() => {
    // Configured using environment variables in ./jest.config.js
    mockfs({
      "/var/www/spaship": {
        foo: {
          "spaship.yaml": "name: Foo\npath: /foo\nref: v1.0.1\nsingle: true\ndeploykey: sehvgqrnyre",
          "index.html": "I AM FOO",
        },
        ROOTSPA: {
          "spaship.yaml": "name: Root Spa\npath: /\nref: v1.0.1\nsingle: true\ndeploykey: dc34ldv3sd",
          "index.html": "I AM ROOTSPA",
        },
      },
    });
  });
  afterEach(() => {
    mockfs.restore();
  });
  test("should respond to requests", async () => {
    await pathProxy.start();
    let response;
    try {
      response = await axios.get("http://localhost:8081/foo/");
    } catch (e) {
      // errors are fine; this test is only looking for a response
      response = e.response;
    }
    expect(response.status).toBeGreaterThan(1);
    expect(response.status).toBeLessThan(599);
    await pathProxy.stop();
  });

  test("should respond to requests with duplicate slash", async () => {
    await pathProxy.start();
    let response;
    try {
      response = await axios.get("http://localhost:8081//foo/");
    } catch (e) {
      // errors are fine; this test is only looking for a response
      response = e.response;
    }
    expect(response.status).toBeGreaterThan(1);
    expect(response.status).toBeLessThan(599);
    await pathProxy.stop();
  });

  test("should respond to root path spa request", async () => {
    await pathProxy.start();
    let response;
    try {
      response = await axios.get("http://localhost:8081/");
    } catch (e) {
      // errors are fine; this test is only looking for a response
      response = e.response;
    }
    expect(response.status).toBeGreaterThan(1);
    expect(response.status).toBeLessThan(599);
    await pathProxy.stop();
  });
});
