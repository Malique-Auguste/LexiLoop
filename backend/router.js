//importing required packages
const express = require("express")
const WordModel = require("./models/word_model")

//creates the router
const router = express.Router()

//logs every request that comes in
router.use((req, res, next) => {
    console.log(req.path, req.method, req.body)

    next()
})

//temporary path for testing the creation of a WordModel based on user input
router.post("/", async (req, res) => {
    const {spelling, definition, difficulty} = req.body

    try {
        const word = await WordModel.create({spelling, definition, difficulty})
        res.status(200).json(word)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

//exports router
module.exports = router