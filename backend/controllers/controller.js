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
        const {spelling} = req.params

        const word = (await WordModel.find({spelling}))[0]

        if (word != undefined) {
            res.status(200).json(word)
        }
        else {
            res.status(400).json({error: spelling + " not in database"})
        }
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//adds word to database
async function add_word(req, res) {
    const {spelling, definition, difficulty} = req.body

    try {
        //ensures word doesn't already exist in the list first
        if ((await WordModel.find({spelling})).length == 0) {
            const word = await WordModel.create({spelling, definition, difficulty})
            res.status(200).json(word)
        }
        else {
            res.status(400).json({error: spelling + " already in database"})
        }        
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//deletes word from database
async function delete_word(req, res) {
    const {spelling} = req.params

    try {
        const delete_result = await WordModel.deleteOne({spelling})
        res.status(200).json(delete_result)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}


//updates word from databse
async function update_word(req, res) {
    const { spelling } = req.params
    
    try {
        //checks if word exists in the list first
        if ((await WordModel.find({spelling})).length != 0) {
            const word = await WordModel.findOneAndUpdate({spelling}, {...req.body})
            res.status(200).json(spelling + " successfully updated.")
        }
        else {
            res.status(400).json({error: spelling + " not in database"})
        }
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

//define word 
async function search(req, res) {
    console.log("searching")
    const { spelling } = req.params

    try {
        console.log("response")
        const stem = "https://api.dictionaryapi.dev/api/v2/entries/en/"
        const api_call = stem + spelling
        console.log(api_call)

        fetch(api_call)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                else {
                    throw new Error("Word not found");
                }
            }) 
            .then(data => {
                console.log(data);
                console.log(data[0]["meanings"])
            })
            .catch(error => {
                console.error('Error:', error);
            }); 

    } catch (error) {
        res.status(400).json({error: error.message})
    }
}


//exports functions
module.exports = {
    get_words,
    get_word,
    add_word,
    delete_word,
    update_word,
    search
}