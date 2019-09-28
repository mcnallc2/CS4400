// different ways to define and pass 
// functions
function f1add(x,y) { return x+y }

f2add = function (x,y) {return x+y }

f3add = (x,y) => { return x+y;}  // fat arrow

console.log("1 and 2 is "+ f1add(1,2) )
console.log("2 and 3 is "+ f2add(2,3) )
console.log("3 and 4 is "+ f3add(3,4) )

var array1 = ['a', 'b', 'c'];
array1.forEach(function(element) {  console.log(element);});
// expected output: "a"
// expected output: "b"
// expected output: "c"

