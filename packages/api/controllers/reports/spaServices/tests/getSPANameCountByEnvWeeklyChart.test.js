const db = require("../../../../db.js");
const getSPANameCountByEnvWeeklyChart = require("../getSPANameCountByEnvWeeklyChart");

beforeAll(() => db.connect());

const mockRequest = async () => {
  return await getSPANameCountByEnvWeeklyChart.getSPANameCountByEnvWeeklyChartService('one.redhat.com', 'home');
}

describe("check getSPANameCountByEnvWeeklyChart", () => {

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
    for (array of res) {
      for (data of array) {
        expect(data).toHaveProperty('spaName');
        expect(data).toHaveProperty('envs');
        expect(data).toHaveProperty('count');
        expect(data).toHaveProperty('startDate');
        expect(data).toHaveProperty('endDate');
        
        expect(typeof data.spaName).toBe('string');
        expect(typeof data.envs).toBe('string');
        expect(typeof data.count).toBe('number');
        expect(typeof data.startDate).toBe('object');
        expect(typeof data.endDate).toBe('object');
      }
    }
  })
});