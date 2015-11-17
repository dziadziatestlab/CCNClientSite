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
        userId:name,
        SDP:mediaObject.localDescription.sdp
    };
    if(typeof(name)!="string")     data.userId=document.getElementById("name").value;
    console.log('data to be send: '+JSON.stringify(data));
    WSConnection.send(JSON.stringify(data));

}

CCNAPI.makeCall=function(){
    var data={
        type:'CALL',
        From:document.getElementById("name").value,
        To:document.getElementById("calledName").value
    };

    WSConnection.send(JSON.stringify(data));

}