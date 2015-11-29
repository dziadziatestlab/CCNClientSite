/**
 * Created by Robert on 2015-11-27.
 */
var localVideoElement;
var peerConnection;
var isICELoaded=false;
var isSDPLoaded=false;
var isANSWERReady=false;

var mediaObject={};
mediaObject.iceLocal=[]



var constraints={audio:false,video:true};
window.RTCPeerConnection=mozRTCPeerConnection;

navigator.getUserMedia=navigator.mozGetUserMedia;

function init(){
    localVideoElement=document.getElementById("localStream");
    peerConnection==new mozRTCPeerConnection();
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
}



var createOffer=function(){
    console.log('# createOffer called');
    peerConnection=new RTCPeerConnection();
    peerConnection.onaddstream=function(){console.log('local onaddstream called !')};
    if(window.stream){
        peerConnection.addStream(stream);
        peerConnection.onicecandidate=gotIceCandidate;
        peerConnection.createOffer(gotDescription,onError,onError);
    }
    else console.log("### stream not obtained !!!");

}

var gotIceCandidate=function(candidates){
    console.log('gotIceCandidate called');
    console.log(JSON.stringify(candidates.candidate));
    isICELoaded=true;
    iceCandidates(candidates);
}

var iceCandidates=function(candidates){
    console.log("iceCandidate called ");
    if(candidates.candidate){
        mediaObject.iceLocal.push(candidates);
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

var createAnswerCall=function(){
    console.log("createAnswerCall called");
    CCNAPI.makeCall();

}

var gotRemoteSignalling=function(data){
    console.log("gotRemoteSignalling called");
    if(data.SDP){
        var session=new mozRTCSessionDescription(data.SDP);
        console.log('new RTCP SDP created ');
        //remotePeerConnection=new mozRTCPeerConnection();
        /*
        remotePeerConnection.onaddstream=function(e){
            console.log("remotePeerConnection onaddstream called");
            remoteVideoElement.srcObject= e.stream;


        }
        */
        peerConnection.setRemoteDescription(session,function(){
            console.log('peerConnection setRemoteDescription success');
            peerConnection.createAnswer(onCreateAnswerSuccess,onError);

        },onError);

    }
}

var onCreateAnswerSuccess=function(desc){
    console.log("onCreateAnswerSuccess called");
    peerConnection.setLocalDescription(desc,function(){
        console.log("setLocalDescription after onAswer called");
    },onError);
}
