//importing modules
const mongoose = require("mongoose")

//defines MeaningSchema
const MeaningSchema = new mongoose.Schema({
    part_of_speech: {
        type: String,
        required: true
    },
    definitions: {
        type: [String],
        required: true
    }
})

//defines WordSchema
const WordSchema = new mongoose.Schema({
    spelling: {
        type: String,
        required: true
    },
    meanings_list: {
        type: [MeaningSchema],
        required: true
    },
    difficulty: {
        type: Number,
        required: true
    }
}, {timestamps: true})


const WordModel = mongoose.model("Word", WordSchema)
const MeaningModel = mongoose.model("Meaning", MeaningSchema)

//exports a model of words
module.exports = {
    WordModel,
    MeaningModel
}
