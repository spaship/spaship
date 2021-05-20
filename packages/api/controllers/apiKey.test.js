const mockingoose = require("mockingoose");
const clone = require("lodash").clone;
const controller = require("./apiKey");
const APIKey = require("../models/apiKey");
const NotFoundError = require("../utils/errors/NotFoundError");

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
describe("API Key Controller", () => {
  beforeEach(() => {
    mockingoose.resetAll();
    jest.clearAllMocks();
  });
  it("should return all api keys belonging to a user", async () => {
    const mockData = [
      {
        _id: "507f191e810c19729de860ea",
        label: "mock",
        shortKey: "1234567",
        hashKey: "175344ddf79cd569645dee71fd9a58d3ee034f7b92156a08068438caa1c092b7",
        userId: "d37763ab-d01c-43f2-8f94-3a6e7ab1d396",
        createdAt: new Date("2020-02-02"),
      },
    ];
    mockingoose(APIKey).toReturn(mockData);

    const expected = [
      {
        label: "mock",
        shortKey: "1234567",
        createdAt: new Date("2020-02-02"),
      },
    ];

    const req = mockRequest();
    const res = mockResponse();
    await controller.list(req, res);

    expect(res.send).toHaveBeenCalledWith(expected);
  });

  it("should add an api key for a user", async () => {
    const req = mockRequest({ body: { label: "mock" } });
    const res = mockResponse();

    await controller.post(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("should remove an api key by it's label", async () => {
    const mockData = {
      _id: "507f191e810c19729de860ea",
      label: "mock",
      shortKey: "1234567",
      hashKey: "175344ddf79cd569645dee71fd9a58d3ee034f7b92156a08068438caa1c092b7",
      userId: "d37763ab-d01c-43f2-8f94-3a6e7ab1d396",
      createAt: new Date("2020-02-02"),
    };

    mockingoose(APIKey).toReturn(mockData, "findOneAndDelete");

    const req = mockRequest({ params: { label: "mock" } });
    const res = mockResponse();

    await controller.delete(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
