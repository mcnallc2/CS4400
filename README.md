# CS4400 - Internet Applications

## Assignment 1

The objective of this first assignment is to develop a simple Internet Application which demonstrates the following:
1. A reactive client running in an Internet Browser using Vue.Js – demonstrating some simple knowledge of the V- directives and mustache syntax and interacting with a Server-Side application using at least one Web API primitive
2. A Server-side application which exposes at least one API primitive and consumes the services of a 3rd party Web API – not able be to do this from the client side due to ‘same-origin’ restrictions.

I am asked to produce an application that inputs the city that someone is planning to go to.  
The server-side should use the openweathermap API to get the weather forecast for that city for the next 5 days.  
I should then display for the user some summary information including:
1. Packing: if there is rain anytime over the next 5-days indicate that the user should bring an umbrella
2. Indicate whether the user should pack for Cold (temp range -10..+10), Warm (+10-+20) or Hot (20+)
3. Give a summary table for the next 5 days showing: Temperature, Wind Speed and Rainfall level

## Assignment 2

The objective of this assignment is to write a very simple client (employing Vue.js) interacting with a server (implemented in Node.js) which in turn interacts with a Cloud-based Database (using AWS DynamoDB) and an Object stored in the Object-store (using AWS S3).

I am writing a simple client in Vue.js which has 3 buttons:
1.	Create Database
2.	Query Database - with two input boxes to allow a movie name and a year to be entered
3.	Destroy Database

Clicking each of these buttons will invoke API primitives on your Cloud-based server and deal with the responses.
‘Create’ should cause my Node.js server to make a table in a DynamoDB database – fetch the raw data from the S3 object and upload it to the newly created database. I use a small sub-set of the fields [title, release-date, rank].
‘Query’ should cause my Node.js server to find all the movies in a given year, that begin-with the entered text string – and display them on the web-page.
‘Destroy’ should cause the database table to be deleted.

A related example: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.html
