// trying out promises and Async Await
"use strict";
function callmebackin(s,subject)
    { return new Promise ( (resolve, reject) =>
        { setTimeout( () =>
            {resolve("Returned call subject: " + subject)}, s*1000)
    })
}
let topic1, topic2;
console.log("First I call you about a dog")

//Using promises
// let p1 = callmebackin (5," about a dog")
// let p2 = callmebackin(3," about another dog")
// p1.then( (subject) => console.log("Got called back: "+subject))
// p2.then( (subject) => console.log("you called me back: "+subject))

// Using Async Await
async function waitaround() { 
    topic1 = await callmebackin (5,"about a dog");
    console.log("Got called back:"+topic1)
    topic2 = await callmebackin(3,"about another dog");
    console.log("you called me back:"+topic2) 
}
waitaround()
console.log("Hoping to get some calls")
    