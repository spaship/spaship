const db = require("../../../../../db.js");
const getPropertyCountByEnvChart = require("../getPropertyCountByEnvChart");

beforeAll(() => db.connect());

const mockRequest = async () => {
  return await getPropertyCountByEnvChart.getPropertyCountByEnvChartService('one.redhat.com');
}

describe("check getPropertyCountByEnvChart", () => {

  it('npm erresponse should not to be null', async () => {
    const res = await mockRequest();
    expect(res).not.toBeNull();
  })

  it('response must be defined', async () => {
    const res = await mockRequest();
    expect(res).toBeDefined();
  })

  it('response must not be undefined', async () => {
    const res = await mockRequest();
    expect(res).not.toBeUndefined();
    expect().not.toBeTruthy();
  })

  it('response should be list array', async () => {
    const res = await mockRequest();
    expect(Array.isArray(res)).toBe(true)
  })

  it('response should have the correct properties', async () => {
    const res = await mockRequest();
    for (data of res) {
      expect(data).toHaveProperty('envs');
      expect(data).toHaveProperty('propertyName');
      expect(data).toHaveProperty('count');

      expect(typeof data.envs).toBe('string');
      expect(typeof data.propertyName).toBe('string');
      expect(typeof data.count).toBe('number');
    }
  })
});