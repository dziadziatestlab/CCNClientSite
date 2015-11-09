/**
 * Created by Robert on 2015-11-04.
 */
"use strict";

process.title="node-chat";

var webSocketServerPort=1337;
var webSocketServer=require('websocket').server;
var http=require('http');


var history=[];
var clients=[];

var server=http.createServer(function(request,response){});
server.listen(webSocketServerPort,function(){
    console.log("Server is listening on port "+webSocketServerPort);
});


var wsServer=new webSocketServer({httpServer:server});


wsServer.on('request',function(request){
    console.log("connection from origin:"+request.origin);
    var connection=request.accept();

    console.log('clients number: '+clients.length);
    connection.on('message',function(message){
        console.log('Received message:'+message.utf8Data);
        var mObject=JSON.parse(message.utf8Data);
        console.log('SDP: '+mObject.SDP);
        clients.push({
            userId:mObject.userId,
            connection:connection,
            description:mObject.SDP

        });
        console.log('info data: \n'+clients[0].description);

    });



});
wsServer.on('close',function(){
    console.log("Connection closed !");
})

