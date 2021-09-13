const { v4: uuidv4 } = require('uuid');
const express = require('express')
const app = express()

const SSE_RESPONSE_HEADER = {
    'Connection': 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'X-Accel-Buffering': 'no'
};

var events = {};

app.get('/sse/:id', function (req, res) {

    res.writeHead(200, SSE_RESPONSE_HEADER);
    let intervalId = setInterval(function () {

    }, 5000);

    req.on("close", function () {
        let id = getEventId(req);
        console.log(`*** Close. event id: "${id}"`);
        clearInterval(intervalId);
        delete events[id];
    });

    req.on("end", function () {
        let id = getEventId(req);
        console.log(`*** End. event id: "${id}"`);
    });

});

function getEventId(req) {
    return req.params.id;
}

app.listen(5000, function () {
    console.log('Example app listening on port 5000!');
});