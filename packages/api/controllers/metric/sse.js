const event = require('../../models/event')
const eventTimeTrace = require('../../models/eventTimeTrace')
const EventSource = require("eventsource");
const { uuid } = require('uuidv4');

var source = new EventSource("http://localhost:5000/sse/80");

source.onmessage = function (event) {
    const response = JSON.parse(event.data);
    const envRandom = getRandom(4);
    const branchRandom = getRandom(3);
    Promise.all([createEventRequest(response, envRandom, branchRandom), createEventTimeTraceRequest(response, envRandom)]);
};


async function createEventRequest(response, envRandomRequest, branchRandomRequest) {
    const currentTime = new Date();
    const branchRandom = branchRandomRequest;
    const envRandom = envRandomRequest;
    const eventData = new event({
        id: response.id,
        eventId: response.id,
        propertyName: response.payload.namespace,
        spaName: response.payload.cr_name,
        version: 1,
        envs: env[envRandom],
        branch: branch[branchRandom],
        code: response.payload.CODE,
        failure: false,
        isActive: true,
        createdAt: response.time || currentTime,
        updatedAt: response.time || currentTime,
        traceId: response.payload.TraceId
    });
    const saveResponse = await eventData.save();
}

async function createEventTimeTraceRequest(response, envRandomRequest) {
    const currentTime = new Date();
    const envRandom = envRandomRequest;

    const checkTraceId = await eventTimeTrace.findOne({ traceId: response.payload.TraceId });

    if (checkTraceId == null) {
        const eventTimeTraceData = new eventTimeTrace({
            id: uuid(),
            traceId: response.payload.TraceId,
            propertyName: response.payload.namespace,
            spaName: response.payload.cr_name,
            envs: env[envRandom],
            initialCode: response.payload.CODE,
            finalCode: null,
            failure: true,
            createdAt: response.time || currentTime,
            completedAt: null,
            consumedTime: 0
        });
        const saveResponse = await eventTimeTraceData.save();
    }
    else {

        let diff = (checkTraceId.createdAt.getTime() - new Date(response.time).getTime()) / 1000;
        diff /= 60;
        const consumedTime = Math.abs(Math.round(diff));

        const updated = await eventTimeTrace.findOneAndUpdate({
            traceId: response.payload.TraceId,
        }, { $set: { finalCode: response.payload.CODE, completedAt: response.time, consumedTime: consumedTime, failure: false } },
            function (err, data) {
                if (err) {
                    console.log("error");
                }
            });
    }
}


function getRandom(max) {
    return Math.floor(Math.random() * max);
}