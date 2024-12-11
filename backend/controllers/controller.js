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
        await definer_api(spelling)
            .then(output => {
                console.log(output)
                res.status(200).json(output)
            })
    } catch (error) {
        console.log(error)
        res.status(400).json({"error": error.message})
    }
    
}

async function definer_api(word) {
    const stem = "https://api.dictionaryapi.dev/api/v2/entries/en/"
    const api_call = stem + word

    const temp = fetch(api_call)
        //checks if word is found
        .then(response => {
            if (response.ok) {
                data_list = response.json()
                return data_list
            }
            else {
                throw new Error("Word not found");
            }
        }) 
        //if the word is found, its definitions are returned
        .then(data_list => {
            output = []

            //searches through response object and identifies the definitions for each word
            data_list.forEach(item => {
                meanings = item["meanings"]

                meanings.forEach(meaning => {
                    part_of_speech = meaning["partOfSpeech"]
                    definitions = []

                    meaning["definitions"].forEach(definition => {
                        definitions.push(definition["definition"])
                    })

                    output.push([part_of_speech, definitions])
                })
            })

            return output
        })

    return temp
}

async function suggester_api(word) {

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