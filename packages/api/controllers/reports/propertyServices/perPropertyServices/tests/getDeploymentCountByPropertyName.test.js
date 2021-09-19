const db = require("../../../../../db.js");
const getDeploymentCountByPropertyName = require("../getDeploymentCountByPropertyName");

beforeAll(() => db.connect());

const mockRequest = async () => {
  return await getDeploymentCountByPropertyName.getDeploymentCountByPropertyNameService('one.redhat.com');
}

describe("check getDeploymentCountByPropertyName", () => {

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
      expect(data).toHaveProperty('propertyName');
      expect(data).toHaveProperty('spaName');
      expect(data).toHaveProperty('count');
      expect(data).toHaveProperty('id');
      expect(typeof data.propertyName).toBe('string');
      expect(typeof data.spaName).toBe('string');
      expect(typeof data.count).toBe('number');
      expect(typeof data.id).toBe('number');
    }
  })
});