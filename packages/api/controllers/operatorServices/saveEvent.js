const event = require('../../models/event')
const { uuid } = require('uuidv4');
const sse = require('../../notifications/sseProducer')

module.exports = async function saveChartProperty(req,res) {
    if (getChartId(req)) {
        const updatedResponse = await updateEventConfig(req);
        res.send(updatedResponse);
    }
    let id =await getGeneratedEventId();
    let chart = await createEventRequest(id, req)
    const createdResponse = await createEvent(chart);
    res.send(createdResponse);
}

async function createEvent(event) {
    try {
        const saveResponse = await event.save();
        return saveResponse;
    } catch (e) {
        return {"Error" : e};
    }
}

async function getGeneratedEventId() {
    return uuid();
}

async function createEventRequest(eventId, req) {
    const currentTime = getCurrentTime();
    return new event({
        id: eventId ,
        eventId: eventId ,
        propertyName: getPropertyName(req) ,
        spaName: getSPAName(req) ,
        version: getVersion(req) ,
        envs: getEnvs(),
        branch: getBranch(),
        code: getCode(),
        failure: getFailure(req) ,
        isActive: true,
        createdAt: currentTime,
        updatedAt: currentTime,     
    });

    function getCode() {
        return req.body?.code;
    }

    function getBranch() {
        return req.body?.branch;
    }

    function getEnvs() {
        return req.body?.envs;
    }
}

async function updateEventConfig(req) {
    const updateResponse = await event.findOneAndUpdate({ eventId: req.eventId  },
        updateEventRequest(req),
        (error, data) => {
            if (error) {
                console.log("error");
            }
        }
    );
    return updateResponse;
}

async function updateEventRequest(req) {
    const updateRequest = {
        propertyName: getPropertyName(req) ,
        spaName: getSPAName(req) ,
        version: getVersion(req) ,
        envs: getEnvs(),
        branch: getBranch(),
        code: getCode(),
        failure: getFailure(req) ,
        updatedAt: getCurrentTime(),  
    };
    return JSON.parse(JSON.stringify(updateRequest));
}

function getCurrentTime() {
    return new Date();
}

function getFailure(req) {
    return req.body?.failure;
}

function getVersion(req) {
    return req.body?.version;
}

function getSPAName(req) {
    return req.body?.spaName;
}

function getPropertyName(req) {
    return req.body?.propertyName;
}

function getChartId(req) {
    return req.body?.eventId;
}