const EventSource = require("eventsource");
const config = require("../../config");
const { uuid } = require("uuidv4");
const { log } = require("@spaship/common/lib/logging/pino");

const SSE_RESPONSE_HEADER = {
  Connection: "keep-alive",
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  "X-Accel-Buffering": "no",
};

module.exports = async function produceEvent(req, res) {
  let events = {};
  const source = new EventSource(config.get("sse:base_path"));
  log.info(`connection established for activity stream : "${req.params.id}"`);
  let id = getEventId(req);
  events[id] = req;
  res.writeHead(200, SSE_RESPONSE_HEADER);
  let intervalId = setInterval(function () {
    try {
      source.onmessage = function (eventRequest) {
        const parsedEventRequest = JSON.parse(eventRequest.data);
        log.info(parsedEventRequest);
        const response = {
          id: uuid(),
          webProperty: parsedEventRequest.websiteName,
          environment: parsedEventRequest.environmentName,
          message: parsedEventRequest?.spaName || "NA",
        };
        res.write(`data: ${JSON.stringify(response)}\n\n`);
        res.flush();
      };
    } catch (err) {
      log.error(err);
    }
  }, 500);

  req.on("close", function () {
    let id = getEventId(req);
    source.close();
    log.info(`connection closed for activity stream : "${id}"`);
    clearInterval(intervalId);
    delete events[id];
  });

  req.on("end", function () {
    let id = getEventId(req);
    log.info(`connection ended for activity stream : "${id}"`);
  });
};

function getEventId(req) {
  return req.params.id;
}
