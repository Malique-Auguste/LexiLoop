//importing required packages
const express = require("express")

//creates the router
const router = express.Router()

//logs every request that comes in
router.use((req, res, next) => {
    console.log(req.path, req.method, req.body)

    next()
})

//exports router
module.exports = router