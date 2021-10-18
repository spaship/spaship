const webProperty = require('../../models/webProperty')
const { uuid } = require('uuidv4');

module.exports = async function saveWebProperty(req, res) {
    if (getWebPropertyId(req)) {
        const updatedResponse = await updateWebProperty(req);
        return updatedResponse;
    }
    let webPropertyId = getGeneratedSpaConfigId();
    let webPropertyRequest = createWebPropertyRequest(webPropertyId, req)
    const createdResponse = await createWebProperty(webPropertyRequest);
    return createdResponse;
}

async function createWebProperty(webPropertyRequest) {
    try {
        const saveResponse = await webPropertyRequest.save();
        return saveResponse;
    } catch (e) {
        return { "Error": e };
    }
}

function getGeneratedSpaConfigId() {
    return uuid();
}

function createWebPropertyRequest(id, req) {
    const currentTime = new Date();
    const webPropertyRequest = new webProperty({
        webPropertyId: id,
        webPropertyName: getWebPropertyName(req),
        repositoryConfigs: getRepositoryConfigs(req),
        isActive: true,
        createdAt: currentTime,
        updatedAt: currentTime,
    });
    return webPropertyRequest;
}

async function updateWebProperty(req) {
    const requestWebPropertyId=getWebPropertyId(req);
    const updateResponse = await webProperty.findOneAndUpdate({ webPropertyId: requestWebPropertyId },
        updateWebPropertyRequest(req),
        (error, data) => {
            if (error) {
                console.log(error);
            }
        }
    );
    return updateResponse;
}

function updateWebPropertyRequest(req) {
    const updateRequest = {
        webPropertyName: getWebPropertyName(req),
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

function getWebPropertyId(req) {
    const requestWebPropertyId = req?.body?.webPropertyId || ''
    return requestWebPropertyId.toString();
}

function getGitToken(req) {
    return req.body?.gitToken || '';
}

function getWebPropertyName(req) {
    return req?.body?.webPropertyName || '';
}

function getIsActive(req) {
    return req?.body?.isActive || false;
}
