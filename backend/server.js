//importing necessary packages
const express = require("express")
const router = require("./router")

//loads .env file
require("dotenv").config()

//creates the app and assigns the router
const app = express()
app.use(router)
app.listen(process.env.PORT, () => {
    console.log("App initialised and listening on port", process.env.PORT)
})