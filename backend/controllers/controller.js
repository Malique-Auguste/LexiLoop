//importing required modules
const {WordModel, MeaningModel} = require("../models/models")

//gets all words
async function get_words(req, res) {
    try {
        const words = await WordModel.find({}).sort({createdAt: -1})
        res.status(200).json(words)
        console.log("Success")
    } catch (error) {
        res.status(400).json({error: error.message})
        console.log("Failure")
    }
}

//gets all words
async function get_word(req, res) {
    try {
        const {spelling} = req.params

        const word = (await WordModel.find({spelling}))[0]

        if (word != undefined) {
            res.status(200).json(word)
            console.log("Success")
        }
        else {
            res.status(400).json({error: spelling + " not in database"})
            console.log("Failure")
        }
    } catch (error) {
        res.status(400).json({error: error.message})
        console.log("Failure")
    }
}

//adds word to database
async function add_word(req, res) {
    const {spelling, meanings_list, difficulty} = req.body

    try {
        //ensures word doesn't already exist in the list first
        if ((await WordModel.find({spelling})).length == 0) {
            var meanings_models = []
            meanings_list.forEach(meaning => {
                const {part_of_speech, definitions} = meaning
                meanings_models.push(new MeaningModel({part_of_speech, definitions}))
            })

            const word = await WordModel.create({spelling, meanings_list: meanings_models, difficulty})
            res.status(200).json(word)
            console.log("Success")

        }
        else {
            res.status(400).json({error: spelling + " already in database"})
            console.log("Failure")
        }        
    } catch (error) {
        res.status(400).json({error: error.message})
        console.log("Failure")
    }
}

//deletes word from database
async function delete_word(req, res) {
    const {spelling} = req.params

    try {
        const delete_result = await WordModel.deleteOne({spelling})
        res.status(200).json(delete_result)
        console.log("Success")

    } catch (error) {
        res.status(400).json({error: error.message})
        console.log("Failure")
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
           console.log("Success")

        }
        else {
            res.status(400).json({error: spelling + " not in database"})
            console.log("Failure")
        }
    } catch (error) {
        res.status(400).json({error: error.message})
        console.log("Failure")
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
                console.log("Success")

            })
    } catch (error) {
        console.log(error)
        try {
            await suggester_api(spelling)
                .then(output => {
                    console.log(output)
                    res.status(200).json(output)
                    console.log("Success")
                })
        } catch (error) {
            console.log(error)
            res.status(400).json({"error": error.message})
            console.log("Failure")
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
            var meaning_models = []

            //searches through response object and identifies the definitions for each word
            data_list.forEach(item => {
                const meanings_list = item["meanings"]

                meanings_list.forEach(meaning => {
                    part_of_speech = meaning["partOfSpeech"]
                    definitions = []

                    //removes excessive definitions for words. 
                    // see the word "hi" with and without this if statement commented out to understand
                    if (meaning["definitions"].length > 3) {
                        meaning["definitions"] = meaning["definitions"].slice(0, 3)
                    }

                    meaning["definitions"].forEach(definition => {
                        definitions.push(definition["definition"])
                    })

                    meaning_models.push(new MeaningModel({part_of_speech, definitions}))
                })
            })

            return new WordModel({spelling: word, meanings_list: meaning_models, difficulty: 0.5})
        })

    return output
}

async function suggester_api(word) {
    const stem_spelling = "https://api.datamuse.com/words?sp="
    const stem_sound = "https://api.datamuse.com/words?sl="
    const stem_complete = "https://api.datamuse.com/sug?s="
    const ending = "&max=2"

    var api_call = stem_spelling + word + ending

    //identifies 1 similarly spelt word
    var output = await fetch(api_call)
        //checks if word is found
        .then(response => {
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

    api_call = stem_sound + word + ending

    //identifies 1 similar sounding word
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
        
            return word_list
        })
        .catch(error => {
            console.log(error)
        })
    )

    api_call = stem_complete + word + ending

    //finds word that could be made by completing the list
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
                word_list.push(auto_completed)
            })
            
            return word_list
        })
        .catch(error => {
            console.log(error)
        })
    )

    //removes duplicates of the orignal word from output
    output = [... new Set(output)]
    output = output.filter(item => {
        return (item != word) && (item.split(" ").length == 1)
    })

    console.log(output)
    const promises = output.map(async (item) => {
        return definer_api(item)
            .then(res => {
                if (res != undefined) {
                    return [item, true]
                }
            })
            .catch(_ => {
                return [item, false]
            })
    })

    var output_mapped = await Promise.all(promises)

    output_mapped = output_mapped.filter(item => item[1])
    output = output_mapped.map(item => item[0])

    if (output.length == 0) {
        throw new Error("Word provided doesn't have similar words")
    }

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