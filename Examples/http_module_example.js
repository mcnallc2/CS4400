// simple webserver using http built-in module
var http = require("http");
function requestHandler(request,response){
    console.log("In comes a request to: "+ request.url);
    response.end("Hello from your new web server");
}
var server = http.createServer(requestHandler);
server.listen(3000);
