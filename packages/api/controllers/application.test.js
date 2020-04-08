const mockingoose = require("mockingoose").default;
const mockfs = require("mock-fs");
const config = require("../config");
const clone = require("lodash").clone;
const controller = require("./application");
const Application = require("../models/application");
const fsp = require("fs").promises;
const fs = require("fs");

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

  it("should return all applications belong to user", async () => {
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

    // mock-fs has a bug. it not support fs.rmdir with option "recursive"
    // issue: https://github.com/tschaub/mock-fs/issues/292
    // the fs.rmdir will only remove empty dir
    // expect(fs.existsSync("/fake/webroot/foo")).toBe(false);
  });
});
