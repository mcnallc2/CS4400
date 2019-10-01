"use strict";
const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')
const app = express()
app.use(cors())

const port = 3000
app.get('/weather/:location', data)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

function data(req, res) {
    let location = req.params.location;
    //res.json( { result : location });
    //console.log('recieved::' + location);

    console.log("Weather request for:", location)

    let url = "http://api.openweathermap.org/data/2.5/forecast?q=" + location + "&APPID=3e2d927d4f28b456c6bc662f34350957";
    console.log(url);
 
    let prom = fetch(url)
    prom.then(response => response.json() )
    .then(response => {
        parseWeather(response)
        weather = response.weather
        console.log(weather) }
    )
    .catch(function(error){
      console.log(error);
    })
}

function parseWeather(info){
    let kelvin = 273.15;

    weather = info.weather
}
