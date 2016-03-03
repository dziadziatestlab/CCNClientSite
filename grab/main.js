/**
 * Created by Robert on 2016-03-02.
 */
console.log('script main.js loaded !');
'use strict';

var localVideo=document.getElementById("localVideo");
var playVideo=document.getElementById("playVideo");
console.log('local video: '+localVideo);

var recordedBlobs;
var mediaRecorder;
var startRecord=document.getElementById("startR");
var stopRecord=document.getElementById("stopR");
var playRecord=document.getElementById("playR");
var recordedBlobs;
var connectBtn=document.getElementById("wsconnect");
connectBtn.onclick=wsConnect;
var registerBtn=document.getElementById("register");
registerBtn.onclick=wsRegister;


navigator.getUserMedia=navigator.getUserMedia||navigator.mozGetUserMedia||navigator.webkitGetUserMedia;
console.log("getUserMedia: "+navigator.getUserMedia);


var constraints={
    video:true,
    audio:true
}




navigator.getUserMedia(constraints,successCallback,errorCallback);



function successCallback(stream){
    console.log('getUserMedia onSuccess called');
    window.stream=stream;
    if(window.URL){
        localVideo.src=window.URL.createObjectURL(stream);
        localVideo.play();

    }else{
        localVideo.src=stream;
    }

}

function errorCallback(e){
    console.log("getUserMedia error: "+e);
}


startRecord.onclick=startRecording;

function startRecording(){
    console.log('startRecording called');
    var options={mimeType:'video/webm',bitsPerSecond:100000};
    recordedBlobs=[];
    try{
        console.log('trying to create mediaRecorder.');
        mediaRecorder=new MediaRecorder(window.stream,options);
    }catch (e0){
        console.log('mediaRecorder error !');

    }
    mediaRecorder.ondataavailable=handleDataAvailable;
    mediaRecorder.start(10);
    console.log('mediaRecorder started. '+mediaRecorder);
}

function handleDataAvailable(event){
    console.log('handleDataAvailable called !');
    if(event.data&&event.data.size>0){
        recordedBlobs.push(event.data);
        wsConnection.send(event.data);
    }
    console.log(event.data);

}

stopRecord.onclick=stopRecording;
function stopRecording(){
    console.log('stopRecording called');
    mediaRecorder.stop();
    console.log('mediaRecorder state: '+mediaRecorder.state);
}


playRecord.onclick=playRecorded;

function playRecorded(){
    console.log('playRecorded called');
    var buffer=new Blob(recordedBlobs,{type:'video/webm'});
    playVideo.src=window.URL.createObjectURL(buffer);
    playVideo.play();
}

function wsConnect(){
    console.log('wsconnect called ');
    window.wsConnection=WS.connect("192.168.0.162",8000);
}

function wsRegister(){
    console.log('wsRegister called');
    CCNAPI.nameRegister();
}


var gotRemoteSignalling=function(data) {
    console.log("gotRemoteSignalling called ");
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


    if (data.ANSWER) {
        console.log("ANSWER RECEIVED !!!!");
        console.log(JSON.stringify(data.ANSWER));
        var session = new mozRTCSessionDescription(data.ANSWER);
        peerConnection.setRemoteDescription(session,
            function () {
                console.log('peerConnection setRemoteDescription success');
            }, onError);
    }

    /*
     if(data.ICE){
     for(can in data.ICE){
     console.log('candidate info: '+JSON.stringify(data.ICE[can]));
     overrideIceServer(data.ICE[can]);
     addIceCandidate(data.ICE[can]);
     }
     }
     */
    if (data.ProxyServer) {
        console.log("PROXY SERVER INFO received");
        proxyServer = {
            host: data.ProxyServer[0],
            port: data.ProxyServer[1]
        };

    }
    if (data.TYPE == 'GETMEDIA') {
        //console.log("GETMEDIA type message received :\n"+JSON.stringify(data));
        if (data.RESULT === 'NOUSER') {
            console.log('No user registered. Request stopped !');
            setTimeout(function () {
                CCNAPI.getMedia();
            }, 150);
            //clearInterval(mediaLoop);
        }
        else {
            if (data.RESULT === 'NODATA') {
                setTimeout(function () {
                    CCNAPI.getMedia();
                }, 200);
            }

            else

                startMediaRequest();
        }
    }
}