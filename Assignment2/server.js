//  Conor McNally - 16325133
//  Internet Applications - Assignment 2
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

//handle web request from client
function handleInstruction(req, res) {

    var response = {"alert" : "Instruction Not Recognised"}
    let instruction = req.params.instruction;
    let movie = req.params.movie;
    let year = req.params.year;

    console.log("Database Instruction:", instruction)
    //if creating a database
    if(instruction == "create"){
        //check create promise
        createStore().then(function(){;
            response = {"alert" : "--- Successfully Created Database ---\n"};
            res.json(response);
        })
        .catch(err => {
            error = {"alert" : "Error Creating Database" };
            console.log(error);
            res.json(error);
        });
    }
    //if querying the database
    else if(instruction == "query"){
        queryDB(movie, year).then(function(val){
            val = {"alert" : val };
            console.log("Response = ", val);
            res.json(val);
        })
        .catch(err => {
            error = {"alert" : "Query not found Database" };
            console.log(error);
            res.json(error);
        });
    }
    //destroying the database
    else if(instruction == "destroy"){
        deleteDB().then(function(){;
            response = {"alert" : "--- Successfully Deleted Database ---\n"};
            res.json(response);
        })
        .catch(err => {
            error = {"alert" : "Error Deleting Database" };
            console.log(error);
            res.json(error);
        });
    }
    //if the instruction is to return the webpage
    else if(instruction == "index"){
        //res.sendFile("C:/Users/conor/Repos/CS4400/Assignment2/index.html");
        console.log("Sending html webpage");
        res.sendFile("/home/ec2-user/index.html");
    }

    //if the instrcution is not recognised
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
        BillingMode: "PAY_PER_REQUEST"
    };
    //promise for async functions
    return new Promise((resolve, reject) => {
        let prom1 = new Promise((res, rej) => {
            dynamodb.createTable(params, function(err, data) {
                if (err) {
                    console.error("==========\nUnable to Create Table\n==========\n", JSON.stringify(err, null, 2));
                    rej();
                } else {
                    console.log("==========\nCreated Table\n==========");
                    res();
                }
            });
        });
        prom1.then(function(){
            //----- PULL DATA FROM S3 BUCKET  ----------
            var getParams = {
                Bucket: 'csu44000assignment2',
                Key: 'moviedata.json'
            }
            //Fetch or read data from aws s3
            s3.getObject(getParams, function (err, data) {

                if (err) {
                    console.log(err);
                    reject();
                } else {
                    console.log("Sucessfully Pulled Data .....");
                    //setTimeout(uploadMovies(JSON.parse(data.Body)), 5000);
                    uploadMovies(JSON.parse(data.Body));
                }
            })
        })
        .catch(err => {
            reject();
        });

        //----- LOADING DATA INTO TABLE -----
        function uploadMovies(moviedata){

            console.log("Importing movies into DynamoDB");
            console.log(moviedata.length)
            let index = 1;
            //loop through all the loaded data
            moviedata.forEach(function(movie) {
                var params = {
                    TableName: "Movies",
                    Item: {
                        "year":  movie.year,
                        "title": movie.title,
                        "info": movie.info
                    }
                };
                //recursive promise for storing the data
                let prom2 = new Promise((res, rej) => {
                    docClient.put(params, function(err, data) {
                        if (err) {
                            console.error("Unable to add Movie - ", index, ' - ', movie.title, JSON.stringify(err, null, 2));
                            rej();
                        } else {
                            console.log("Added Movie - ", index, ' - ', movie.title);
                            res();
                        }
                    });
                });
                //resolving when table is full
                prom2.then(function(){
                    if(index == moviedata.length){
                        console.log("Successfully populated database");
                        resolve();
                    }
                    index = index + 1;
                })
                .catch(err => {
                    if(index == moviedata.length){
                        console.log("Populated database");
                        resolve();
                    }
                    index = index + 1;
                });
            });
        }
    });
}

//----- QUERYING THE DATABASE ----------
function queryDB(movie, year){
    
    qmovie = movie.replace(/%20/g, " ");
    qyear = parseInt(year);
    console.log(qmovie, " - " ,qyear);
    let query_res = "";

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
    //promise for async functions
    return new Promise((resolve, reject) => {
        docClient.query(params, function(err, data) {
            if (err) {
                console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
                reject();
            } 
            else{
                console.log("Query succeeded.");
                console.log(data.Items.length);
                if(data.Items.length == 0){
                    reject(query_res);
                }

                let index = 1;
                //loop through all found items
                data.Items.forEach(function(item) {  
                    query_res = query_res + "===================" + 
                                            "\nTitle - " + item.title + 
                                            "\nYear -  " + item.year + 
                                            "\nRating - " + item.info.rating + 
                                            "\n===================\n";

                    console.log("===================" +
                                "\nTitle - ", item.title +
                                "\nYear -  " + item.year + 
                                "\nRating - " + item.info.rating +
                                "\n===================\n");
                    //resoving when all the queryed data has being logged
                    if(index == data.Items.length){
                        resolve(query_res);
                    }
                    index = index + 1;  
                });
            }
        });
    });
}

//----- DELETE TABLE ---------- 
function deleteDB(){

    var params2 = {
        TableName : "Movies"
    };
    //promise for deleting the table
    return new Promise((resolve, reject) => {
        dynamodb.deleteTable(params2, function(err, data) {
            if (err) {
                console.error("==========\nUnable to Delete Table\n==========\n", JSON.stringify(err, null, 2));
                reject();
            } else {
                console.log("==========\nDeleted Table\n==========");
                resolve();
            }
        });
    });
}
