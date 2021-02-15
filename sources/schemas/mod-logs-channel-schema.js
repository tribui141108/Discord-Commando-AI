const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true,
}

const modLogsChannelSchema = mongoose.Schema({
    // Guild ID
    _id: reqString,
    channelId: reqString,
})

module.exports = mongoose.model('moderator-log-channels', modLogsChannelSchema)