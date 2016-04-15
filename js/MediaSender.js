/**
 * Created by Robert on 2016-04-15.
 */

self.ws=null;

self.addEventListener('message',function(e){
    console.log('worker called with data: ');
    console.log(JSON.stringify(e.data));
    var data= e.data;
    if(data.type){
        switch (data.type){
            case 'connect':
                console.log("connect command received");
                self.doConnect(data);
                break;
            case 'register':
                self.doRegister(data);
                break;
            default :
                console.log("undefined command received");
                break;
        }
    }

});
self.doConnect=function(data){
    if(self.ws==null){
        self.ws= new WebSocket('ws://'+data.proxyIP+'/'+data.serviceName);
        self.ws.onopen=function(){
            console.log("connection with proxy established");
        };
        self.ws.onerror=function(error){
            console.log("connection establish problem !!!");

        };
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