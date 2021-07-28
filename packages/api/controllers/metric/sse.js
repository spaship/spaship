const event = require('../../models/event')
const eventTimeTrace = require('../../models/eventTimeTrace')
const EventSource = require("eventsource");
const { uuid } = require('uuidv4');
const config = require('../../config');

var source = new EventSource(config.get("sse"));

source.onmessage = function (event) {
    const response = JSON.parse(event.data);
    Promise.all([createEventRequest(response), createEventTimeTraceRequest(response)]);
};


async function createEventRequest(response) {
    const currentTime = new Date();
    const eventData = new event({
        id: response?.id,
        eventId: response?.id,
        propertyName: response?.payload.namespace,
        spaName: response?.payload.cr_name,
        version: 1,
        envs: response?.payload?.env,
        branch: "",
        code: response?.payload?.CODE,
        failure: false,
        isActive: true,
        createdAt: response?.time || currentTime,
        updatedAt: response?.time || currentTime,
        traceId: response?.payload.TraceId
    });
    const saveResponse = await eventData.save();
}

async function createEventTimeTraceRequest(response) {
    const currentTime = new Date();
    const checkTraceId = await eventTimeTrace.findOne({ traceId: response.payload.TraceId });
    if (checkTraceId == null) {
        const eventTimeTraceData = new eventTimeTrace({
            id: uuid(),
            traceId: response?.payload?.TraceId,
            propertyName: response?.payload?.namespace,
            spaName: response?.payload?.cr_name,
            envs: response?.payload?.env,
            initialCode: response?.payload?.CODE,
            finalCode: null,
            failure: true,
            createdAt: response?.time || currentTime,
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
        }, { $set: { finalCode: response?.payload?.CODE, completedAt: response?.time, consumedTime: consumedTime, failure: false } },
            function (err, data) {
                if (err) {
                    console.log("error");
                }
            });
    }
}