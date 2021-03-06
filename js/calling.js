/**
 * Created by Robert on 2015-11-27.
 */
var localVideoElement;
var peerConnection;
var isICELoaded=false;
var isSDPLoaded=false;
var isANSWERReady=false;
//var remotePeerConnection;
var mediaObject={};
mediaObject.iceLocal=[]
var testcan=[];
var remoteTestCan=[];
var proxyServer;
var mediaLoop;



//var pc_config = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};

var constraints={audio:false,video:{mandatory:{
    maxHeight:320,
    maxWidth:180
},optional:[]}};
window.RTCPeerConnection=mozRTCPeerConnection;

navigator.getUserMedia=navigator.mozGetUserMedia;

function init(){
    localVideoElement=document.getElementById("localStream");
    //peerConnection=new mozRTCPeerConnection();
    remoteVideoElement=document.getElementById("remoteStream");
}

var getMedia=function(){
    console.log('# mediaBtn clicked.');
    navigator.getUserMedia(constraints,gotStream,onError);
}

var gotStream=function(stream){
    console.log('# gotStream called');
    window.stream=stream;
    localVideoElement.src=window.URL.createObjectURL(stream);
    localVideoElement.play();
}

var onError=function(e){
    console.log('# onError called');
    console.log(e.name);
}



var createOffer=function(){
    console.log('# createOffer called');
    peerConnection=new RTCPeerConnection();
    peerConnection.onaddstream=function(e){
        console.log('local onaddstream called !');
        remoteVideoElement.src=window.URL.createObjectURL(e.stream);
        remoteVideoElement.play();
    };
    if(window.stream){
        peerConnection.addStream(stream);
        peerConnection.onicecandidate=gotIceCandidate;
        peerConnection.createOffer(gotDescription,onError,onError);
    }
    else console.log("### stream not obtained !!!");

}

var gotIceCandidate=function(candidates){
    console.log('gotIceCandidate called');
    testcan.push(candidates);
    console.log(JSON.stringify(candidates.candidate));
    isICELoaded=true;
    iceCandidates(candidates);
}

var iceCandidates=function(candidates){
    console.log("iceCandidate called ");
    if(candidates.candidate){
        mediaObject.iceLocal.push(candidates.candidate);
    }
}

var gotDescription=function(description){
    console.log('# gotDescription called');
    console.log(description.sdp);
    mediaObject.localDescription=description;
    peerConnection.setLocalDescription(description,function(){console.log('setLocalDescription finished.');},onError    );
    isSDPLoaded=true;
}


var establishWSConnection=function(){
    console.log("establishWSConnection called");
    ipAddress=document.getElementById("ipAddress").value;
    portNumber=document.getElementById("portNumber").value;
    console.log("ipAddress of remote Node:"+ipAddress+":"+portNumber);
    window.WSConnection=WS.connect(ipAddress,portNumber);
}


function addIceCandidate(candidate){
    console.log('# addIceCandidate called');

    //var remotePeerConnection=new RTCPeerConnection();
    if(candidate) {
        var candidate = new mozRTCIceCandidate(candidate);
        console.log('candidate on local site: '+JSON.stringify(candidate));
        remoteTestCan.push(candidate);
        peerConnection.addIceCandidate(candidate);
        //console.log(remotePeerConnection);
    }
}

var gotRemoteSignalling=function(data){
    //console.log("gotRemoteSignalling called ");
    //console.log("type of localDescription: "+typeof(mediaObject.localDescription));
    //console.log("type of data.SDP: "+typeof(data.SDP));
    //console.log("data.SDP: \n"+data.SDP);


    /*
    for(can in data.ICE){
        console.log("ICE data: \n"+JSON.stringify(data.ICE[can]));
        startRemote(data.ICE[can]);
    }
    */

    /*
    if(data.SDP){
        var session=new mozRTCSessionDescription(data.SDP);
        console.log('new RTCP SDP created ');
        peerConnection.setRemoteDescription(session,function(){
            console.log('peerConnection setRemoteDescription success');
        },onError);
    }
    */

    /*
    if(data.SDP){
        var session=new mozRTCSessionDescription(data.SDP);
        console.log('new RTCP SDP created ');
        remotePeerConnection=new mozRTCPeerConnection();
        remotePeerConnection.onaddstream=function(e){
            console.log("remotePeerConnection onaddstream called");
            remoteVideoElement.srcObject= e.stream;


        }
        remotePeerConnection.setRemoteDescription(session,function(){
            console.log('remotePeerConnection setRemoteDescription success');
        },onError);

        remotePeerConnection.createAnswer(onCreateAnswerSuccess,onError);

    }
    */


    if(data.ANSWER){
        console.log("ANSWER RECEIVED !!!!");
        console.log(JSON.stringify(data.ANSWER));
        var session= new mozRTCSessionDescription(data.ANSWER);
        peerConnection.setRemoteDescription(session,
            function(){
                console.log('peerConnection setRemoteDescription success');
            },onError);
    }

    if(data.ICE){
        for(can in data.ICE){
            console.log('candidate info: '+JSON.stringify(data.ICE[can]));
            overrideIceServer(data.ICE[can]);
            addIceCandidate(data.ICE[can]);
        }
    }

    if(data.ProxyServer){
        console.log("PROXY SERVER INFO received");
        proxyServer={host:data.ProxyServer[0],
                    port: data.ProxyServer[1]};

    }
    if(data.TYPE=='GETMEDIA'){
        //console.log("GETMEDIA type message received :\n"+JSON.stringify(data));
        if(data.RESULT==='NOUSER')
            console.log('No user registered. Request stopped !');
            //clearInterval(mediaLoop);
        else {
            if(data.RESULT==='NODATA'){
                setTimeout(function(){
                    CCNAPI.getMedia();
                },200);
            }

            else

            startMediaRequest();
        }
    };




    //remotePeerConnection=new mozRTCPeerConnection();
    //peerConnection.setRemoteDescription(session,doAnswer,onError);
    //console.log(remotePeerConnection);

    /*
     remotePeerConnection.createAnswer(function(description2){
     console.log('got description2 :'+description2);
     },null,constraints);
     */



}

function overrideIceServer(candidate){
    console.log('overrideIceCandidate called with data: '+JSON.stringify(candidate));
    var tempIce=candidate.candidate.split(" ");
    console.log('candidate length: '+tempIce.length);
    tempIce[5]=document.getElementById("portNumberICE").value;
    tempIce[4]=document.getElementById("ipAddressICE").value;
    var tempCandidate=tempIce.join(" ");
    console.log("joined candidate: "+tempCandidate);
    candidate.candidate=tempCandidate;


}

function onCreateAnswerSuccess(desc){
    console.log("onCreateAnswerSuccess called");
    remotePeerConnection.setLocalDescription(desc,function(){
        console.log("remotePeerConnection setLocalDescription success !!!")
    },onError);

    remoteVideoElement.play();

}

function setProxy(){
    console.log("setProxy called");

}

function startMediaRequest(){
    setTimeout(function(){
        CCNAPI.getMedia();
    },10);

    /*

    console.log("startMedaiaRequest called");
    mediaLoop=setInterval(function(){
        console.log("getMedia ");
        CCNAPI.getMedia();
    },20);

    */
}


/*
var doAnswer=function(){
    console.log('doAnswer called. Success in SDP settings.');
    remotePeerConnect.createAnswer(onCreateAnswerSuccess,onError);
}

var onCreateAnswerSuccess=function(desc){
    console.log('createAnswer success !!!');
    remotePeerConnection.setLocalDescription(desc,function(){
            console.log('remotePeerConnection setLocalDescription success');
        },
        onError);
    /*
     peerConnection.setRemoteDescription(desc,
     function(){
     console.log('peerConnection setRemoteDescription success');
     },onError);

    mediaObject.ANSWER=desc;
    isANSWERReady=true;

}
*/

