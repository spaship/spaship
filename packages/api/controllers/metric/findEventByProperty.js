const chart = require('../../models/event')

module.exports = async function findChartByProperty(req, res) {
    try {
        let response =  await chart.find({propertyName: getProperty(req)});    
        res.send(response);
    } catch (e) {
        return {"Error" : e};
    }
}

function getProperty(req) {
    return req.params.propertyName;
}
