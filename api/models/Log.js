const mongoose = require('mongoose')

const logSchema = mongoose.Schema({
    log : { type: String, required: true }
});

module.exports = mongoose.model('Log', logSchema);