//importing modules
const mongoose = require("mongoose")

//defines WordSchema
const WordSchema = new mongoose.Schema({
    spelling: {
        type: String,
        required: true
    },
    definition: {
        type: String,
        required: true
    },
    difficulty: {
        type: Number,
        required: true
    }
}, {timestamps: true})

//exports a model of words
module.exports = mongoose.model("Word", WordSchema)