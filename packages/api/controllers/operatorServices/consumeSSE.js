const event = require("../../models/event");
const eventTimeTrace = require("../../models/eventTimeTrace");
const webProperty = require("../../models/webProperty");
const EventSource = require("eventsource");
const { uuid } = require("uuidv4");
const config = require("../../config");
const source = new EventSource(config.get("sse:base_path"));
const { log } = require("@spaship/common/lib/logging/pino");

source.onmessage = function (eventRequest) {
  log.info(eventRequest.data);
  const response = JSON.parse(eventRequest.data);
  const currentTime = new Date();
  const eventBody = new event({
    id: uuid(),
    eventId: response?.uuid,
    propertyName: response?.websiteName,
    spaName: "SPASHIP",
    version: 1,
    envs: response.environmentName,
    branch: "main",
    code: getCode(response.state),
    failure: false,
    isActive: true,
    createdAt: currentTime,
    updatedAt: currentTime,
    traceId: response?.uuid,
  });
  Promise.all([createEventRequest(eventBody), createEventTimeTraceRequest(response)]);
};

function getCode(state) {
  if (state == "mapping file loaded into memory") return "WEBSITE_CREATE_STARTED";
  if (state == "spa deployment ops performed") return "WEBSITE_CREATE";
  return undefined;
}

async function createEventRequest(response) {
  await response.save();
}

async function createEventTimeTraceRequest(response) {
  if (response.environmentName == "NA") return;
  const currentTime = new Date();
  const eventRequest = await event.findOne({ eventId: response.uuid });
  let diff = (eventRequest.createdAt.getTime() - currentTime.getTime()) / 1000;
  const consumedTime = Math.abs(Math.round(diff));
  log.info(`time diffrence between : ${eventRequest.createdAt}  -  ${currentTime}`);
  log.info(`consumedTime : ${consumedTime}`);
  const eventTimeTraceData = new eventTimeTrace({
    id: uuid(),
    traceId: response.uuid,
    propertyName: response.websiteName,
    envs: response.environmentName,
    initialCode: "WEBSITE_CREATE_STARTED",
    finalCode: "WEBSITE_CREATE",
    failure: true,
    createdAt: eventRequest.createdAt,
    completedAt: currentTime,
    consumedTime: consumedTime,
  });
  await eventTimeTraceData.save();
}
