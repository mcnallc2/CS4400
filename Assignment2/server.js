//  Conor McNally - 16325133
//  Internet Applications - Assignemnt 2
//  Server

"use strict";

var aws = require('aws-sdk'); //require aws-sdk
var express = require('express'); //require express
const cors = require('cors')
const app = express()

//this allows my client to communicate with this server with cors enabled
app.use(cors())

//getting credentials form my config file
aws.config.credentials = new aws.SharedIniFileCredentials();

//setting region
aws.config.update({
    region: "eu-west-1",
});

const port = 3000
app.get('/dbinstruction/:instruction/:movie/:year', handleInstruction)
app.listen(port, () => console.log(`Server listening on port ${port}!`))

function handleInstruction(req, res) {

    var response = {"alert" : "Instruction Not Recognised"}
    let instruction = req.params.instruction;
    let movie = req.params.movie;
    let year = req.params.year;

    console.log("Database Instruction:", instruction)

    if(instruction == "create"){
        createStore();
        response = {"alert" : "Recieved Create Instruction"};
        res.json(response);
    }
    else if(instruction == "query"){
        queryDB(movie, year);
        response = {"alert" : "Recieved Query Instruction"}
        res.json(response);
    }
    else if(instruction == "destroy"){
        deleteDB();
        response = {"alert" : "Recieved Delete Instruction"}
        res.json(response);
    }
    else{
        res.json(response);
    }
}

var docClient = new aws.DynamoDB.DocumentClient();
var dynamodb = new aws.DynamoDB();
var s3 = new aws.S3();

//----- CREATE TABLE PULL DATA FROM BUCKET AND LOAD INTO TABLE ----------
function createStore(){

    //----- CREATE A TABLE ----------
    var params = {
        TableName : "Movies",
        KeySchema: [       
            { AttributeName: "year", KeyType: "HASH" },  //Partition key
            { AttributeName: "title", KeyType: "RANGE"}  //Sort key
        ],
        AttributeDefinitions: [       
            { AttributeName: "year", AttributeType: "N" },
            { AttributeName: "title", AttributeType: "S" }
        ],
        ProvisionedThroughput: {       
            ReadCapacityUnits: 10, 
            WriteCapacityUnits: 10
        }
    };

    dynamodb.createTable(params, function(err, data) {
        if (err) {
            console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
        }
    });

    //----- PULL DATA FROM S3 BUCKET  ----------
    var getParams = {
        Bucket: 'csu44000assignment2',
        Key: 'moviedata.json'
    }
    //Fetch or read data from aws s3
    s3.getObject(getParams, function (err, data) {

        if (err) {
            console.log(err);
        } else {
            console.log("Sucessfully Pulled Data .....");
            uploadMovies(JSON.parse(data.Body));
        }
    })

    //----- LOADING DATA INTO TABLE -----
    function uploadMovies(moviedata){

        console.log("Importing movies into DynamoDB. Please wait.");

        moviedata.forEach(function(movie) {
            var params = {
                TableName: "Movies",
                Item: {
                    "year":  movie.year,
                    "title": movie.title,
                    "info":  movie.info
                }
            };

            docClient.put(params, function(err, data) {
                if (err) {
                    console.error("Unable to add Movie - ", movie.title);
                } else {
                    console.log("Added Movie - ", movie.title);
                }
            });
        });
        console.log("Finshed Loading Movies ...");
    }
}

function queryDB(movie, year){
    
    qmovie = movie.replace(/%20/g, " ");
    qyear = parseInt(year);
    console.log(qmovie, " - " ,qyear);

    var params = {
        TableName: "Movies",
        KeyConditionExpression: "#yr = :yyyy and begins_with(title, :mt)",
        ExpressionAttributeNames:{
            "#yr": "year"
        },
        ExpressionAttributeValues: {
            ":yyyy" : qyear,
            ":mt" : qmovie
        }
    };
    
    docClient.query(params, function(err, data) {
        if (err) {
            console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            data.Items.forEach(function(item) {                     
                console.log("----------" +
                            "\nTitle - ", item.title +
                            "\nYear -  " + item.year + 
                            "\nRating - " + item.info.rating +
                            "\n----------");
            });
        }
    });
}

//----- DELETE TABLE ---------- 
function deleteDB(){

    var params2 = {
        TableName : "Movies"
    };

    dynamodb.deleteTable(params2, function(err, data) {
        if (err) {
            console.error("==========\nUnable to Delete Table\n==========");//("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("==========\nDeleted Table\n==========");//("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
        }
    });
}
