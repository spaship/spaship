const mongoose = require('mongoose')

const spaSchema = new mongoose.Schema({
    ownerEmail: {
        type: String,
    },
    ownerName: {
        type: String,
    },
    spaName: {
        type: String,
    },
    contextPath: {
        type: String,
    },
    envs: [{
        type: String,
    }],
}, { _id: false });

const repositoryConfigs = new mongoose.Schema({
    repositoryLink: {
        type: String,
    },
    branch: {
        type: String,
    },
    gitToken: {
        type: String,
    },
    spas: [spaSchema],
}, { _id: false });


const website = new mongoose.Schema({
    websiteId: {
        type: String,
        required: true
    },
    websiteName: {
        type: String,
        required: true
    },
    repositoryConfigs: [repositoryConfigs],
    isActive: {
        type: Boolean,
        required: false
    },
    createdAt: {
        type: Date,
        required: false
    },
    updatedAt: {
        type: Date,
        required: false
    },
})

module.exports = mongoose.model('website', website)