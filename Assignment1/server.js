//  Conor McNally - 16325133
//  Internet Applications - Assignemnt 1
//  Server

"use strict";
const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')
const app = express()

//this allows my client to communicate with this server with cors enabled
app.use(cors())

const port = 3000
app.get('/weather/:location', data)
app.listen(port, () => console.log(`Server listening on port ${port}!`))

function data(req, res) {
    let location = req.params.location;
    console.log("Weather request for:", location)

    let url = "http://api.openweathermap.org/data/2.5/forecast?q=" + location + "&APPID=3e2d927d4f28b456c6bc662f34350957";
    console.log(url);
 
    let prom = fetch(url)
    prom.then(response => response.json() )
    .then(response => {
        res.json(response)
    })
    .catch(function(error){
        console.log(error);
    })
}