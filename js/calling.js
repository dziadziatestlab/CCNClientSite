/**
 * Created by Robert on 2015-11-27.
 */
var localVideoElement;
var peerConnection;
var isICELoaded=false;
var isSDPLoaded=false;
var isANSWERReady=false;
var remotePeerConnection;
var mediaObject={};
mediaObject.iceLocal=[]



var constraints={audio:false,video:true};
window.RTCPeerConnection=mozRTCPeerConnection;

navigator.getUserMedia=navigator.mozGetUserMedia;

function init(){
    localVideoElement=document.getElementById("localStream");
    peerConnection=new mozRTCPeerConnection();
    remoteVideoElement=document.getElementsByName("remoteStream");
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


function addIceCandidate(can){
    console.log('# addIceCandidate called');

    //var remotePeerConnection=new RTCPeerConnection();
    if(can.candidate) {
        var candidate = new mozRTCIceCandidate(can.candidate);
        //console.log('candidate on remote site: '+JSON.stringify(candidate));
        remotePeerConnection.addIceCandidate(candidate);
        //console.log(remotePeerConnection);
    }
}

var gotRemoteSignalling=function(data){
    console.log("gotRemoteSignalling called ");
    console.log("type of localDescription: "+typeof(mediaObject.localDescription));
    console.log("type of data.SDP: "+typeof(data.SDP));
    console.log("data.SDP: \n"+data.SDP);
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

    /*
    if(data.ICE){
        for(can in data.ICE){
            addIceCandidate(data.ICE[can]);
        }
    }

    */


    //remotePeerConnection=new mozRTCPeerConnection();
    //peerConnection.setRemoteDescription(session,doAnswer,onError);
    //console.log(remotePeerConnection);

    if(data.ANSWER){
        console.log("ANSWER RECEIVED !!!!");
        console.log(JSON.stringify(data.ANSWER));
        peerConnection.setRemoteDescription(data.ANSWER,
            function(){
                console.log('peerConnection setRemoteDescription success');
            },onError);
    }
    /*
     remotePeerConnection.createAnswer(function(description2){
     console.log('got description2 :'+description2);
     },null,constraints);
     */



}

function onCreateAnswerSuccess(desc){
    console.log("onCreateAnswerSuccess called");
    remotePeerConnection.setLocalDescription(desc,function(){
        console.log("remotePeerConnection setLocalDescription success !!!")
    },onError);

    remoteVideoElement.play();

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