
// === TCP Server on Client Site
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







// === UDP Server

var PORT=33333;
var HOST='192.168.0.124';

var dgram=require('dgram');
var server=dgram.createSocket('udp4');

server.on('listening',function(){
	var address=server.address();
	console.log('UDP Server listening on '+address.address+":"+address.port);
});

server.on('message',function(message,remote){
	console.log(remote.address+":"+remote.port+" -- "+message);
});
server.bind(PORT,HOST);