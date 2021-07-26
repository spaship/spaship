const chart = require('../../models/event')

module.exports = async function findChartById(req, res) {
    try {
        const response =  await chart.findOne({eventId: getId(req)})
        res.send(response);
    } catch (e) {
        return {"Error" : e};
    }
}

function getId(req) {
    return req.params.id;
}
