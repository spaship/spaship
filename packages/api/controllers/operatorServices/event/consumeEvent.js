const event = require("../../../models/event");
const deploymentConnection = require("../../../models/deploymentConnection");
const eventTimeTrace = require("../../../models/eventTimeTrace");
const webProperty = require("../../../models/webProperty");
const EventSource = require("eventsource");
const { uuid } = require("uuidv4");
const config = require("../../../config");
//const source = new EventSource("http://localhost:4001/sse/2");
const { log } = require("@spaship/common/lib/logging/pino");

module.exports = async function consumeEvent() {
  const sse = await deploymentConnection.find();
  for (let item of sse) {
    log.info(item);
    const eventUrl = `${item.baseurl}/api/event`;
    console.log(eventUrl);
    new EventSource(eventUrl).onmessage = async function (eventRequest) {
      log.info(eventUrl);
      log.info(eventRequest);
      processEvents(eventRequest);
    };
  }
};

function processEvents(eventRequest) {
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
}

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
    console.error("Duplicate Entry");
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
