const website = require('../../models/website')
const { uuid } = require('uuidv4');

module.exports = async function saveWebsite(req, res) {
    if (getWebsiteId(req)) {
        const updatedResponse = await updateWebsite(req);
        return updatedResponse;
    }
    let websiteId = getGeneratedSpaConfigId();
    let websiteRequest = createWebsiteRequest(websiteId, req)
    const createdResponse = await createWebsite(websiteRequest);
    return createdResponse;
}

async function createWebsite(websiteRequest) {
    try {
        const saveResponse = await websiteRequest.save();
        console.log(saveResponse)
        return saveResponse;
    } catch (e) {
        return { "Error": e };
    }
}

function getGeneratedSpaConfigId() {
    return uuid();
}

function createWebsiteRequest(id, req) {
    const currentTime = new Date();
    const websiteRequest = new website({
        websiteId: id,
        websiteName: getWebsiteName(req),
        repositoryConfigs: getRepositoryConfigs(req),
        isActive: true,
        createdAt: currentTime,
        updatedAt: currentTime,
    });
    return websiteRequest;
}

async function updateWebsite(req) {
    const requestWebsiteId=getWebsiteId(req);
    const updateResponse = await website.findOneAndUpdate({ websiteId: requestWebsiteId },
        updateWebsiteRequest(req),
        (error, data) => {
            if (error) {
                console.log(error);
            }
        }
    );
    return updateResponse;
}

function updateWebsiteRequest(req) {
    const updateRequest = {
        websiteName: getWebsiteName(req),
        repositoryConfigs: getRepositoryConfigs(req),
        isActive: true,
        updatedAt: new Date()
    };
    return JSON.parse(JSON.stringify(updateRequest));
}

function getSpas(req, reqBody) {
    return req.map((each) => ({
        repositoryLink: each?.repositoryLink,
        spaName: each?.spaName,
        contextPath: each?.contextPath,
        envs: each?.envs,
        ownerEmail : reqBody.body?.ownerEmail,
        ownerName: reqBody.body?.ownerName
    }));
}

function getRepositoryConfigs(req) {
    return req.body?.repositoryConfigs.map((each) => ({
        repositoryLink: each?.repositoryLink,
        branch: each?.branch,
        gitToken: each.gitToken,
        spas: getSpas(each.spas, req),
    }));
}

function getWebsiteId(req) {
    return req?.body?.websiteId || 0;
}

function getGitToken(req) {
    return req.body?.gitToken || '';
}

function getWebsiteName(req) {
    return req?.body?.websiteName || '';
}

function getIsActive(req) {
    return req?.body?.isActive || false;
}
