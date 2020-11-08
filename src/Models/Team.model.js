const mongoose = require('mongoose')

const TeamSchema = new mongoose.Schema({
    id: Number,
    username: String,
    job: String,
    description: String
})

module.exports = mongoose.model('Team', TeamSchema)