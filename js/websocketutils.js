/**
 * Created by Robert on 2015-11-09.
 */


var WS={};

WS.connect=function(ipAddress,port){
    window.WebSocket=window.WebSocket||window.MozWebSocket;
    var connection=new WebSocket('ws://'+ipAddress+':'+port);
    connection.onopen=function(){

    };
    connection.onerror=function(error){
        console.log("connection establish problem !!!");

    };
    connection.onmessage=function(message){
        console.log('onmessage called');
        //var dane=JSON.parse(message.data);
        //console.log(JSON.stringify(dane));
        console.log(message.data);
    };

    return connection;
}