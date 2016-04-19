/**
 * Created by Robert on 2016-04-15.
 */

self.ws=null;

self.addEventListener('message',function(e){
    //#console.log('worker called with data: !!!');
    //#console.log(JSON.stringify(e.data));
    var data= e.data;
    if(data.type){
        switch (data.type){
            case 'connect':
                //console.log("connect command received");
                self.doConnect(data);
                break;
            case 'register':
                self.doRegister(data);
                break;
            case 'mediaStream':
                //console.log("worker mediaStream case block !!!");
                self.doSendData(data.data);
                break;
            case 'remoteStream':
                self.doRequest(data);
                break;
            default :
                console.log("undefined command received");
                break;
        }
    }

});


self.doRequest=function(dataFull){
    var data={
          type:'GETMEDIA',
          From:dataFull.From,
          To:dataFull.To
       };
    console.log("worker, message to send: "+JSON.stringify(data));
    self.ws.send(JSON.stringify(data));
}

self.doSendData= function (data) {
    self.ws.send(data);
    //console.log("Worker !. Data sent to server");
}

self.doConnect=function(data){
    if(self.ws==null){
        self.ws= new WebSocket('ws://'+data.proxyIP+'/'+data.serviceName);
        self.ws.onopen=function(){
            console.log("connection with proxy established");
        };
        self.ws.onerror=function(error){
            console.log("connection establish problem !!!");

        };
        self.ws.onmessage=function(message){
            //message.data == received data
            //#console.log("remote message received !!!!");
            /*
            var data="";
            try{
                data=JSON.parse(message.data);
                //#console.log("WORKER parsing message OK !!!");

            }
            catch(e){
                console.log("WORKER No possibility to catch")
            }
            if(typeof(data)=="object"){
                //#console.log("WORKER object received");
            }else{
                //#console.log(" WORKER data no object");
            }
            */
            self.postMessage(message.data);
        }
    }
}
self.doRegister=function(data){
    var data={
        type:"REGISTER",
        userId:data.name
        //SDP:mediaObject.localDescription,
        //ICE:mediaObject.iceLocal
    };
    self.ws.send(JSON.stringify(data));

}