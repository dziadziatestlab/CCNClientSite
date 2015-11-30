/**
 * Created by Robert on 2015-11-27.
 */
var localVideoElement;
var remoteVideoElement;
var peerConnection;
var remotePeerConnection;
var isICELoaded=false;
var isSDPLoaded=false;
var isANSWERReady=false;

var mediaObject={};
mediaObject.iceLocal=[]

var pc_config = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};

var constraints={audio:false,video:true};
window.RTCPeerConnection=mozRTCPeerConnection;

navigator.getUserMedia=navigator.mozGetUserMedia;

function init(){
    localVideoElement=document.getElementById("localStream");
    remoteVideoElement=document.getElementById("remoteStream");
    peerConnection=new mozRTCPeerConnection(pc_config);
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
    console.log(e.message);
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

var createAnswerCall=function(){
    console.log("createAnswerCall called");
    CCNAPI.makeCall();

}

var gotRemoteSignalling=function(data){
    console.log("gotRemoteSignalling called");
    if(data.SDP){
        var session=new mozRTCSessionDescription(data.SDP);
        console.log('new RTCP SDP created ');
        remotePeerConnection=new mozRTCPeerConnection(pc_config);

        remotePeerConnection.onaddstream=function(e){
            console.log("remotePeerConnection onaddstream called");
            remoteVideoElement.srcObject= e.stream;
            remoteVideoElement.play();
        }

        for(can in data.ICE){
            console.log("ICE data: \n"+JSON.stringify(data.ICE[can]));
            startRemote(data.ICE[can]);
        }

        remotePeerConnection.setRemoteDescription(session,function(){
            console.log('remotePeerConnection setRemoteDescription success');
            remotePeerConnection.createAnswer(onCreateAnswerSuccess,onError);
        },onError);


        /*
        peerConnection.setRemoteDescription(session,function(){
            console.log('peerConnection setRemoteDescription success');
            peerConnection.createAnswer(onCreateAnswerSuccess,onError);

        },onError);
        */


    }


}

var onCreateAnswerSuccess=function(desc){
    console.log("onCreateAnswerSuccess called");
    console.log(desc);

    remotePeerConnection.setLocalDescription(desc,function(){
        console.log("remotePeerConnection setLocalDescription after onAswer called");
    },onError);
    mediaObject.ANSWER=desc;
    isANSWERReady=true;
    CCNAPI.nameRegister();
}

var startRemote=function(can){
    console.log('# start remote called');

    //var remotePeerConnection=new RTCPeerConnection();
    if(can) {
        console.log("before setting candidate interface");
        var candidate = new mozRTCIceCandidate(can);
        console.log("after setting candidate interface");
        console.log('candidate on remote site: '+JSON.stringify(candidate));
        remotePeerConnection.addIceCandidate(candidate);
        //console.log(remotePeerConnection);
    }
}