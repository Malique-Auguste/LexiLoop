//importing necessary packages
const mongoose = require("mongoose")
const express = require("express")
const router = require("./router")

//loads .env file
require("dotenv").config()

//creates the app
const app = express()

//ensures that request body is accessible
app.use(express.json())

//assigns the router to the address after '/api'
app.use("/api", router)

//enables router
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("Connected to database and listening on port", process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })
