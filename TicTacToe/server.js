/* Standard Node Server

//Lets require/import the HTTP module
var http = require('http');

//Lets define a port we want to listen to
const PORT=8080;

//We need a function which handles requests and send response
function handleRequest(request, response){
    response.end('It Works!! Path Hit: ' + request.url);
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});

*/

// Creating a simple static server using Express

var express = require("express");

var server = express();
server.use(express.static(__dirname + "/app"));

server.listen(3000, function() {
	console.log("TicTacToe App listening on port 3000!");
});
