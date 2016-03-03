/**
 * Created by Robert on 2015-11-09.
 */
'use strict'

var CCNAPI={};

// WSConnection object should be created before calling followed method !!!

CCNAPI.nameRegister=function(name){
    console.log('CCNAPI, nameRegister called');

    var data={
        type:"REGISTER",
        userId:name
        //SDP:mediaObject.localDescription,
        //ICE:mediaObject.iceLocal
    };

    if(typeof(name)!="string")     data.userId=document.getElementById("name").value;
    /*
    if(isANSWERReady) data.ANSWER=mediaObject.ANSWER;
    if(isICELoaded && isSDPLoaded){
        console.log('data to be send: '+JSON.stringify(data));
        WSConnection.send(JSON.stringify(data));
    }else console.log('Waiting for all information');

    */
    wsConnection.send(JSON.stringify(data));


}

CCNAPI.makeCall=function(){
    console.log("API makeCall");
    var data={
        type:'CALL',
        From:document.getElementById("name").value,
        To:document.getElementById("calledName").value
    };
    WSConnection.send(JSON.stringify(data));


}

CCNAPI.getRemoteInfo=function(){
    console.log("API getRemoteInfo");
    var data={
        type:'GETINFO',
        From:document.getElementById("name").value,
        To:document.getElementById("calledName").value
    }

    WSConnection.send(JSON.stringify(data));
}

CCNAPI.getMedia=function(){
    console.log('API getMedia called');
    var data={
        type:'GETMEDIA',
        From:document.getElementById("name").value,
        To:document.getElementById("calledName").value
    };
    WSConnection.send(JSON.stringify(data));
}