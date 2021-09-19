const db = require("../../../../db.js");
const getLatestActivitiesBySPAName = require("../getLatestActivitiesBySPAName");

beforeAll(() => db.connect());

const mockRequest = async () => {
  return await getLatestActivitiesBySPAName.getLatestActivitiesBySPANameService('one.redhat.com', 'home');
}

describe("check getLatestActivitiesBySPAName", () => {

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
      expect(data).toHaveProperty('spaName');
      expect(data).toHaveProperty('propertyName');
      expect(data).toHaveProperty('code');
      expect(data).toHaveProperty('branch');
      expect(data).toHaveProperty('envs');
      expect(data).toHaveProperty('createdAt');
      expect(data).toHaveProperty('id');
      expect(data).toHaveProperty('latestActivityHead');
      expect(data).toHaveProperty('latestActivityTail');

      expect(typeof data.spaName).toBe('string');
      expect(typeof data.propertyName).toBe('string');
      expect(typeof data.code).toBe('string');
      expect(typeof data.branch).toBe('string');
      expect(typeof data.envs).toBe('string');
      expect(typeof data.createdAt).toBe('object');
      expect(typeof data.id).toBe('number');
      expect(typeof data.latestActivityHead).toBe('string');
      expect(typeof data.latestActivityTail).toBe('string');
    }
  })
});