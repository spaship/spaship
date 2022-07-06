const application = require("../../../models/application");
const event = require("../../../models/event");
const deploymentConnection = require("../../../models/deploymentConnection");
const eventTimeTrace = require("../../../models/eventTimeTrace");
const EventSource = require("eventsource");
const { uuid } = require("uuidv4");
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

async function processEvents(eventRequest) {
  const response = JSON.parse(eventRequest.data);
  const eventBody = new event({
    id: uuid(),
    eventId: response?.uuid,
    propertyName: response?.websiteName || "NA",
    spaName: response?.spaName || "NA",
    version: 1,
    env: response?.environmentName || "NA",
    branch: "main",
    state: response.state,
    path: response?.contextPath || "NA",
    accessUrl: getUrl(response.accessUrl),
    code: getCode(response.state),
    failure: false,
    isActive: true,
    traceId: response?.uuid,
  });
  console.log(eventBody);
  await createEventRequest(eventBody);
  await createEventTimeTraceRequest(response);
}

function getCode(state) {
  const property = { WEBSITE_CREATED: "WEBSITE_CREATED", WEBSITE_CREATION_STARTED: "WEBSITE_CREATION_STARTED" };
  if (state == "spa deployment ops performed") return property.WEBSITE_CREATED;
  return property.WEBSITE_CREATION_STARTED;
}

function getUrl(accessUrl) {
  return accessUrl == null ? "NA" : accessUrl;
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
  if (response.accessUrl == null) return;
  const property = { WEBSITE_CREATED: "WEBSITE_CREATED", WEBSITE_CREATION_STARTED: "WEBSITE_CREATION_STARTED" };
  const propertyName = response.websiteName;
  const name = response?.spaName;
  const path = `/${response?.contextPath}`;
  const env = response?.environmentName;
  const accessUrl = response?.accessUrl;
  const applicationResponse = await application.updateOne({ propertyName, name, path, env }, { accessUrl });
  console.log(applicationResponse);
  const currentTime = new Date();
  const eventRequest = await event.findOne({ eventId: response.uuid }).sort({ createdAt: 1 }).lean().exec();
  let diff = (eventRequest?.createdAt?.getTime() - currentTime.getTime()) / 1000;
  const consumedTime = Math.abs(diff);
  log.info(`time diffrence between : ${eventRequest?.createdAt}  -  ${currentTime}`);
  log.info(`consumedTime : ${consumedTime}`);
  const eventTimeTraceData = new eventTimeTrace({
    id: uuid(),
    traceId: response.uuid,
    propertyName: propertyName,
    env: env,
    spaName: name,
    initialCode: property.WEBSITE_CREATION_STARTED,
    finalCode: property.WEBSITE_CREATED,
    failure: false,
    createdAt: eventRequest?.createdAt,
    completedAt: currentTime,
    consumedTime: consumedTime,
  });
  await eventTimeTraceData.save();
}
