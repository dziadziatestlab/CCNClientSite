var PORT=33333;
var HOST='192.168.0.124';

var dgram=require('dgram');
var message= new Buffer('Hello, its me, Robert');

var client=dgram.createSocket('udp4');
client.send(message,0,message.length,PORT,HOST,function(err,bytes){
    if(err) throw err;
    console.log('UDP message sent to '+HOST+":"+PORT);
    client.close();
});
