/**
 * Created by Robert on 2015-10-30.
 */

var mediaBtn,offerBtn,remoteBtn;
var localVideoElement,remoteVideoElement;
var peerConnection;
var remotePeerConnection=new mozRTCPeerConnection();
var mediaObject={};
var ipAddress,portNumber,wsButton,wsCloseButton;
var registerButton;
var makeCallButton;


var pc_config = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};



navigator.getUserMedia=navigator.mozGetUserMedia;
window.RTCPeerConnection=mozRTCPeerConnection;

var constraints={audio:false,video:true};



var init=function(){
    console.log("# onload called !!!");
    mediaBtn=document.getElementById('mediaBtn');
    mediaBtn.onclick=getMedia;
    localVideoElement=document.getElementById("localStream");
    remoteVideoElement=document.getElementById('remoteStream');
    offerBtn=document.getElementById('offerBtn');
    offerBtn.onclick=createOffer;
    remoteBtn=document.getElementById('remoteBtn');
    remoteBtn.onclick=startRemoteVideo;
    wsButton=document.getElementById("wsConnection");
    wsCloseButton=document.getElementById("wsConnectionClose");
    wsButton.onclick=establishWSConnection;
    wsCloseButton.onclick=wsCloseConnection;
    registerButton=document.getElementById("regBtn");
    console.log(registerButton);
    registerButton.onclick=CCNAPI.nameRegister;
    makeCallButton=document.getElementById("makeCall");
    makeCallButton.onclick=CCNAPI.makeCall;

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
    peerConnection.addStream(stream);
    peerConnection.onicecandidate=gotIceCandidate;
    remotePeerConnection.onicecandidate=gotRemoteIceCandidate;
    peerConnection.createOffer(gotDescription,onError,onError);

}

var gotDescription=function(description){
    console.log('# gotDescription called');
    console.log(description.sdp);
    mediaObject.localDescription=description;
    peerConnection.setLocalDescription(description,function(){console.log('setLocalDescription finished.');},onError    );
}

var gotIceCandidate=function(candidates){
    console.log('gotIceCandidate called');
    console.log(JSON.stringify(candidates.candidate));
    //var adad=new mozRTCIceCandidate(candidates.candidate);
    console.log('remotePeerConnection: ');
    console.log(remotePeerConnection);
    startRemote(candidates);

}

var startRemote=function(can){
    console.log('# start remote called');

    //var remotePeerConnection=new RTCPeerConnection();
    if(can.candidate) {
        var candidate = new mozRTCIceCandidate(can.candidate);
        console.log('candidate on remote site: '+JSON.stringify(candidate));
        remotePeerConnection.addIceCandidate(candidate);
        console.log(remotePeerConnection);
    }
}

var startRemoteVideo=function(){
    var session=new mozRTCSessionDescription(mediaObject.localDescription);
    console.log('new RTCP SDP created ');
    remotePeerConnection.setRemoteDescription(session,doAnswer,onError);
    console.log(remotePeerConnection);
    /*
    remotePeerConnection.createAnswer(function(description2){
        console.log('got description2 :'+description2);
    },null,constraints);
    */

}

var doAnswer=function(){
    console.log('doAnswer called. Success in SDP settings.');
    remotePeerConnection.createAnswer(onCreateAnswerSuccess,onError);
}

remotePeerConnection.onaddstream=function(e){
    console.log('PC2 onaddstream called.');
    remoteVideoElement.srcObject= e.stream;
    remoteVideoElement.play();
}

var onCreateAnswerSuccess=function(desc){
    console.log('createAnswer success !!!');
    remotePeerConnection.setLocalDescription(desc,function(){
        console.log('remotePeerConnection setLocalDescription success');
    },
    onError);
    peerConnection.setRemoteDescription(desc,
    function(){
        console.log('peerConnection setRemoteDescription success');
    },onError);

}

var gotRemoteIceCandidate=function(can){
    console.log('gotRemoteIceCandidate called !!!');
    if(can.candidate) {
        var candidate = new mozRTCIceCandidate(can.candidate);
        console.log('candidate on local site: '+JSON.stringify(candidate));
        peerConnection.addIceCandidate(candidate);
        console.log(peerConnection);
    }
}

var establishWSConnection=function(){
    console.log("establishWSConnection called");
    ipAddress=document.getElementById("ipAddress").value;
    portNumber=document.getElementById("portNumber").value;
    console.log("ipAddress of remote Node:"+ipAddress+":"+portNumber);
    window.WSConnection=WS.connect(ipAddress,portNumber);
}
var wsCloseConnection=function(){
    console.log("wsCloseConnection called !");
    WSConnection.close();
}

var nameRegister=function(){
    console.log('Name register !!!');
    CCNAPI.nameRegister();
}