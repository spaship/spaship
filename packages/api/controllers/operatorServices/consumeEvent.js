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
    propertyName: response?.websiteName || "NA",
    spaName: response?.spaName || "NA",
    version: 1,
    env: response.environmentName,
    branch: "main",
    path: "",
    url: "",
    code: getCode(response.state),
    failure: false,
    isActive: true,
    createdAt: currentTime,
    updatedAt: currentTime,
    traceId: response?.uuid,
  });
  console.log(eventBody);
  Promise.all([createEventRequest(eventBody), createEventTimeTraceRequest(response)]);
};

function getCode(state) {
  if (state == "mapping file loaded into memory") return "WEBSITE_CREATE_STARTED";
  if (state == "spa deployment ops performed") return "WEBSITE_CREATE";
  return "";
}

async function createEventRequest(response) {
  const result = await event.findOne({ traceId: response.traceId, env: response.code });
  if (!result) {
    await response.save();
  } else {
    console.log("Duplicate Entry");
  }
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
    env: response.environmentName,
    spaName: response?.spaName,
    initialCode: "WEBSITE_CREATE_STARTED",
    finalCode: "WEBSITE_CREATE",
    failure: false,
    createdAt: eventRequest.createdAt,
    completedAt: currentTime,
    consumedTime: consumedTime,
  });
  await eventTimeTraceData.save();
}
