const express = require("express")
const morgan = require("morgan")
const creatErrors = require("http-errors")
const routes = require("../api/routes")
require("dotenv").config()

const expressLoader = async (app) => {
    app.use(morgan("dev"))
    app.use(express.json())
    app.use(express.urlencoded({extended: true}))
    app.get("/", async (req, res, next) => {
        res.send("Home Rout")
    })
    app.use("/api", routes())
    //app.use("/auth", AuthRouts)
    app.use(async(req, res, next) => {
        next(creatErrors.NotFound())
        })
    app.use( async (err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        erorr :{
            status : err.status || 500,
            message: err.message,
        }
    })
})

app.listen(process.env.PORT , () => {
   console.log ("server is runnng on port ",3000)
})
}

module.exports = expressLoader;