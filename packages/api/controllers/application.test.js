const mockingoose = require("mockingoose");
const fs = require("fs");
const mockfs = require("mock-fs");
const tar = require("tar");
const config = require("../config");
const controller = require("./application");
const Application = require("../models/application");
const NotFoundError = require("../utils/errors/NotFoundError");
const DeployError = require("../utils/errors/DeployError");
const NotImplementedError = require("../utils/errors/NotImplementedError");

global.console = require("../../../__mocks__/console");

// override some configuration values
config.get = jest.fn((opt) => {
  const fakeConfig = {
    webroot: "/fake/webroot",
    "auth:keycloak:id_prop": "uuid",
  };
  return fakeConfig[opt];
});

const mockRequest = (data = {}) => ({
  ...data,
  user: {
    uuid: "d37763ab-d01c-43f2-8f94-3a6e7ab1d396",
  },
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = () => {
  return jest.fn();
};

describe("Application Controller", () => {
  beforeEach(() => {
    mockingoose.resetAll();
    jest.clearAllMocks();
    mockfs({
      "/fake/new-app": {
        "test.txt": "Hello world",
      },
      "/fake/test-spa-with-yaml": {
        "index.html": "<!doctype html><html>This is a test spa</html>",
        "spaship.yaml": "name: test-with-yaml\npath: /unit/test/with/yaml\nref: 1.0.0\nsingle: true",
      },
      "/fake/test-spa-without-yaml": {
        "index.html": "<!doctype html><html>This is a test spa</html>",
      },
      "/fake/webroot": mockfs.directory({
        items: {
          // some SPAs in the webroot
          foo: mockfs.directory({
            ctime: new Date("2020-02-02"),
            items: {
              "index.html": "<!doctype html><html></html>",
              "spaship.yaml": "name: Foo\npath: /foo\nref: v1.0.1\nsingle: true",
            },
          }),
          foo_bar: mockfs.directory({
            ctime: new Date("2020-02-02"),
            items: {
              "index.html": "<!doctype html><html></html>",
              "spaship.yaml": "name: Foo Bar\npath: /foo/bar\nref: master",
            },
          }),
          baz: mockfs.directory({
            ctime: new Date("2020-02-02"),
            items: {
              "index.html": "<!doctype html><html></html>",
              "spaship.yaml": "name: Baz\npath: /baz\nsingle: true",
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

  it("should return all applications belonging to the user", async () => {
    const expected = [
      // some SPAs in the webroot
      {
        name: "Foo",
        path: "/foo",
        ref: "v1.0.1",
        single: true,
        timestamp: new Date("2020-02-02"),
      },
      {
        name: "Foo Bar",
        path: "/foo/bar",
        ref: "master",
        timestamp: new Date("2020-02-02"),
      },
      {
        name: "Baz",
        path: "/baz",
        single: true,
        timestamp: new Date("2020-02-02"),
      },
    ];

    const req = mockRequest();
    const res = mockResponse();
    await controller.list(req, res);

    expect(res.send).toHaveBeenCalledWith(expect.arrayContaining(expected));
  });

  it("should add an application", async () => {
    // important !!, mock-fs will break Mongoose lazy required.
    // need restore it before Mongoose test
    mockfs.restore();
    const mockData = {
      _id: "507f191e810c19729de860ea",
      name: "mock",
      path: "/fake/mock",
      userId: "d37763ab-d01c-43f2-8f94-3a6e7ab1d396",
      createdAt: new Date("2020-02-02"),
    };

    mockingoose(Application).toReturn(mockData, "save");
    const data = { name: "mock", path: "/fake/mock" };
    const req = mockRequest({ body: data });
    const res = mockResponse();
    const next = mockNext();
    await controller.post(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        ...data,
        timestamp: new Date("2020-02-02"),
      })
    );
  });

  it("should get an application", async () => {
    expect(fs.existsSync("/fake/webroot/foo")).toBe(true);

    const expectData = {
      name: "Foo",
      path: "/foo",
      ref: "v1.0.1",
      timestamp: new Date("2020-02-02"),
    };

    const req = mockRequest({ params: { name: "Foo" } });
    const res = mockResponse();
    const next = mockNext();
    await controller.get(req, res, next);
    expect(res.send).toHaveBeenCalledWith(expect.objectContaining(expectData));
  });

  it("should error when get an application with no exists name", async () => {
    expect(fs.existsSync("/fake/webroot/foo")).toBe(true);

    const req = mockRequest({ params: { name: "noexist" } });
    const res = mockResponse();
    const next = mockNext();
    await controller.get(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.objectContaining(new NotFoundError()));
  });

  it("should error when update an application", async () => {
    expect(fs.existsSync("/fake/webroot/foo")).toBe(true);

    const req = mockRequest({ params: { name: "noexist" } });
    const res = mockResponse();
    const next = mockNext();
    await controller.put(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.objectContaining(new NotImplementedError()));
  });

  it("should delete an application", async () => {
    expect(fs.existsSync("/fake/webroot/foo")).toBe(true);
    const mockData = {
      _id: "507f191e810c19729de860ea",
      name: "Foo",
      path: "/foo",
      userId: "d37763ab-d01c-43f2-8f94-3a6e7ab1d396",
      createdAt: new Date("2020-02-02"),
    };

    mockingoose(Application).toReturn(mockData, "findOneAndDelete");

    const req = mockRequest({ params: { name: "Foo" } });
    const res = mockResponse();
    const next = mockNext();
    await controller.delete(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(fs.existsSync("/fake/webroot/foo")).toBe(false);
  });

  it("should deploy an application with spaship.yaml", async () => {
    expect(fs.existsSync("/fake/test-spa-with-yaml")).toBe(true);

    await tar.create(
      {
        gzip: true,
        cwd: "/fake/test-spa-with-yaml/",
        file: "/fake/test-spa-with-yaml.tgz",
      },
      ["./"]
    );

    expect(fs.existsSync("/fake/test-spa-with-yaml.tgz")).toBe(true);

    const expectData = {
      name: "test-with-yaml",
      path: "/unit/test/with/yaml",
      ref: "1.0.0",
    };

    const req = mockRequest({
      body: expectData,
      file: { path: "/fake/test-spa-with-yaml.tgz" },
    });
    const res = mockResponse();
    const next = mockNext();
    await controller.deploy(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(expect.objectContaining(expectData));
    expect(fs.existsSync("/fake/webroot/unit_test_with_yaml")).toBe(true);
  });

  it("should deploy an application without spaship.yaml", async () => {
    expect(fs.existsSync("/fake/test-spa-without-yaml")).toBe(true);

    await tar.create(
      {
        gzip: true,
        cwd: "/fake/test-spa-without-yaml/",
        file: "/fake/test-spa-without-yaml.tgz",
      },
      ["./"]
    );

    expect(fs.existsSync("/fake/test-spa-without-yaml.tgz")).toBe(true);

    const expectData = {
      name: "test-without-yaml",
      path: "/unit/test/without/yaml",
      ref: "1.0.0",
    };

    const req = mockRequest({
      body: expectData,
      file: { path: "/fake/test-spa-without-yaml.tgz" },
    });
    const res = mockResponse();
    const next = mockNext();
    await controller.deploy(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(expect.objectContaining(expectData));
    expect(fs.existsSync("/fake/webroot/unit_test_without_yaml")).toBe(true);
  });

  it("should deploy an application and get deploy error", async () => {
    const req = mockRequest({
      body: {
        name: "deploy-error",
        path: "/deploy/error",
        ref: "1.0.0",
      },
      file: { path: "" },
    });
    const res = mockResponse();
    const next = mockNext();
    await controller.deploy(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.objectContaining(new DeployError()));
  });

  it("should redeploy an application successfully", async () => {
    expect(fs.existsSync("/fake/webroot/foo")).toBe(true);
    expect(fs.existsSync("/fake/new-app")).toBe(true);

    await tar.create(
      {
        gzip: true,
        cwd: "/fake/new-app/",
        file: "/fake/new-app.tgz",
      },
      ["./"]
    );

    const expectData = {
      name: "foo",
      path: "/foo",
      ref: "1.0.2",
    };

    const req = mockRequest({
      body: expectData,
      file: { path: "/fake/new-app.tgz" },
    });
    const res = mockResponse();
    const next = mockNext();
    await controller.deploy(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(expect.objectContaining(expectData));
    expect(fs.existsSync("/fake/webroot/foo/index.html")).toBe(false);
    expect(fs.existsSync("/fake/webroot/foo/test.txt")).toBe(true);
  });
});
