const chart = require('../../models/event')

module.exports = async function findAllChart(req, res) {
    try {
        const response = await chart.find();
        console.log(response);
        res.status(200).json(response);
    } catch (e) {
        return {"Error" : e};
    }
}