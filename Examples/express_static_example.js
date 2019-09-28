"use strict";
const express = require('express')
const path=require("path")
const app = express()
const port = 3000

//let publicPath= path.resolve(__dirname, "public")
app.use(express.static('.'))
app.get('/sayhello', (req, res) => res.send('Hello World!'))
app.get('/saygoodbye', saygoodbye)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

function saygoodbye(req,res,next){ res.send("It is too soon to say goodbye")}