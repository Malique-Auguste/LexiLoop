//importing required modules
const WordModel = require("../models/word_model")

//gets all words
async function get_words(req, res) {
    try {
        const words = await WordModel.find({}).sort({createdAt: -1})
        res.status(200).json(words)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//gets all words
async function get_word(req, res) {
    try {
        const spelling = req.query.spelling
        const word = (await WordModel.find({spelling}))[0]
        res.status(200).json(word)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//adds word to database
async function add_word(req, res) {
    const {spelling, definition, difficulty} = req.body

    try {
        //checks if word already exists in the list first
        if ((await WordModel.find({spelling})).length == 0) {
            const word = await WordModel.create({spelling, definition, difficulty})
            res.status(200).json(word)
        }
        else {
            res.status(400).json({error: "Word already in database"})
        }

        
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//deletes word from database
async function delete_word(req, res) {
    const spelling = req.query.spelling
    console.log(spelling)

    try {
        const delete_result = await WordModel.deleteOne({spelling})
        res.status(200).json(delete_result)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}



//exports functions
module.exports = {
    get_words,
    get_word,
    add_word,
    delete_word
}