const mongoose = require('mongoose')

const event = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    eventId: {
        type: String,
        required: true
    },
    traceId: {
        type: String,
        required: true
    },
    propertyName: {
        type: String,
        required: false
    },
    spaName: {
        type: String,
        required: false
    },
    version: {
        type: String,
        required: false
    },
    envs: {
        type: String,
        required: false
    },
    branch: {
        type: String,
        required: false
    },
    code: {
        type: String,
        required: false
    },
    failure: {
        type: Boolean,
        required: false
    },
    isActive: {
        type: Boolean,
        required: false
    },
    createdAt: {
        type: Date,
        required: false
    },
    udpatedAt: {
        type: Date,
        required: false
    },
})

module.exports = mongoose.model('event', event)

/*
Previous Schema
const mongoose = require('mongoose')
const activities = new mongoose.Schema({
    lastDeploy: {
        type: String,
    },
    timeProperty: {
        type: String,
    },
    spaName: {
        type: String,
    },
    isActive: {
        type: Boolean,
        required: false
    },
    createdAt: {
        type: Date,
        required: false
    },
});
const chart = new mongoose.Schema({
    eventId: {
        type: String,
        unique: true
    },
    deployedSPA: {
        type: String,
        required: false
    }, ///refactor  - to be removed
    property: {
        type: String,
        required: false
    },  //?? to be changed in SPAProperty
    version: {
        type: String,
        required: false
    },  //to be handed by SPAship
    // Add branch Var
    // Add code
    failure: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
      required: false
    },
    createdAt: {
        type: Date,
        required: false
    },
    udpatedAt: {
        type: Date,
        required: false
    },
    // activities: [activities],
    // latestActivities: activities
})
*/