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
        try {
            await suggester_api(spelling)
                .then(output => {
                    console.log(output)
                    res.status(200).json(output)
                })
        } catch (error) {
            console.log(error)
            res.status(400).json({"error": error.message})
        }
    }
}

async function definer_api(word) {
    const stem = "https://api.dictionaryapi.dev/api/v2/entries/en/"
    const api_call = stem + word

    const output = fetch(api_call)
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
            var definitions_list = []

            //searches through response object and identifies the definitions for each word
            data_list.forEach(item => {
                meanings = item["meanings"]

                meanings.forEach(meaning => {
                    part_of_speech = meaning["partOfSpeech"]
                    definitions = []

                    meaning["definitions"].forEach(definition => {
                        definitions.push(definition["definition"])
                    })

                    definitions_list.push([part_of_speech, definitions])
                })
            })

            return definitions_list
        })

    return output
}

async function suggester_api(word) {
    const stem_spelling = "https://api.datamuse.com/words?sp="
    const stem_sound = "https://api.datamuse.com/words?sl="
    const stem_complete = "https://api.datamuse.com/sug?s="
    const ending = "&max=2"

    var api_call = stem_spelling + word + ending

    var output = await fetch(api_call)
        //checks if word is found
        .then(response => {
            console.log("dsa")

            if (response.ok) {
                data_list = response.json()
                return data_list
            }
            else {
                throw new Error("No return from similar spelling")
            }
        }) 
        //if the word is found, its similarly spelt words are returned
        .then(data_list => {
            var word_list = []

            //searches through response object and identifies the definitions for each word
            data_list.forEach(item => {
                similar_spelling = item["word"]
                word_list.push(similar_spelling)
            })

            return word_list
        })
        .catch(error => {
            console.log(error)
        });

    console.log("asd")
    console.log(output)

    api_call = stem_sound + word + ending

    output = output.concat(await fetch(api_call)
        //checks if word is found
        .then(response => {
            if (response.ok) {
                data_list = response.json()
                return data_list
            }
            else {
                throw new Error("No return from similar sounding")
            }
        }) 
        //if the word is found, its similar sounding words are returned
        .then(data_list => {
            var word_list = []

            //searches through response object and identifies the definitions for each word
            data_list.forEach(item => {
                similar_sounding = item["word"]
                word_list.push(similar_sounding)
            })
            
            console.log(word_list)
            return word_list
        })
        .catch(error => {
            console.log(error)
        })
    )

    api_call = stem_complete + word + ending

    console.log("vfr")
    console.log(output)

    output = output.concat(await fetch(api_call)
        //checks if word is found
        .then(response => {
            if (response.ok) {
                data_list = response.json()
                return data_list
            }
            else {
                throw new Error("No return from auto-complete")
            }
        }) 
        //if the word is found, its auto-complete words are returned
        .then(data_list => {
            var word_list = []

            //searches through response object and identifies the definitions for each word
            data_list.forEach(item => {
                auto_completed = item["word"]
                if (auto_completed.split(" ").length == 1) {
                    word_list.push(auto_completed)
                }                
            })
            
            console.log(word_list)
            return word_list
        })
        .catch(error => {
            console.log(error)
        })
    )

    if (output.length <= 3) {
        throw new Error("Similarly spelt or sounding words not found.")
    }

    output = [... new Set(output)]
    output = output.filter(element => {
        return element != word
    })

    return output
    
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