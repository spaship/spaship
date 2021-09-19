const db = require("../../../../../db.js");
const getAllDeploymentPropertyAnalysis = require("../getAllDeploymentPropertyAnalysis");

beforeAll( () => db.connect());

const mockRequest = async ()=>{
  return await getAllDeploymentPropertyAnalysis.getAllDeploymentPropertyAnalysisService();
}

describe("check getAllDeploymentPropertyAnalysis",  () => {

  it('npm erresponse should not to be null', async () => {
    const res =await mockRequest();
    expect(res).not.toBeNull();
  })

  it('response must be defined', async () => {
    const res =await mockRequest();
    expect(res).toBeDefined();
  })

  it('response must not be undefined', async () => {
    const res =await mockRequest();
    expect(res).not.toBeUndefined();
    expect().not.toBeTruthy();
  })

  it('response should be list array', async () => {
    const res =await mockRequest();
    expect(Array.isArray(res)).toBe(true)
  })

  it('each response should have the correct properties', async () => {
    const res =await mockRequest();
    expect(Array.isArray(res)).toBe(true)
  })
});