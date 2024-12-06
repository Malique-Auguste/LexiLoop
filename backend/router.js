//importing required packages
const express = require("express")
const {
    get_words,
    get_word,
    add_word,
    delete_word
} = require("./controllers/controller")


//creates the router
const router = express.Router()

//logs every request that comes in
router.use((req, res, next) => {
    console.log(req.method, req.path, req.query, req.body)

    next()
})

//assignment of paths
router.get("/", get_words)
router.get("/single", get_word)
router.post("/", add_word)
router.delete("/", delete_word)

//exports router
module.exports = router