const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    id: Number,
    name: String,
    lastName: String,
    email: String,
    password: String
})

module.exports = mongoose.model('User', UserSchema)