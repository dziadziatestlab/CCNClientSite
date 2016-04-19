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
var startLocal=document.getElementById("getLocalMedia");
var recordedBlobs;
var connectBtn=document.getElementById("wsconnect");
connectBtn.onclick=wsConnect;
var registerBtn=document.getElementById("register");
registerBtn.onclick=wsRegister;

var mediaSender=null;

navigator.getUserMedia=navigator.getUserMedia||navigator.mozGetUserMedia||navigator.webkitGetUserMedia;
    console.log("getUserMedia: "+navigator.getUserMedia);

/*
var constraints={
    video:true,
    audio:false
}
*/

var constraints={
    video:{
        width:{min:320,ideal:320},
        height:{min:240},
        frameRate:60,
        facingMode:"user"
    },
    audio:false
}


startLocal.onclick=function() {
    navigator.getUserMedia(constraints, successCallback, errorCallback);
}


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
    //var options={mimeType:'video/webm',bitsPerSecond:100000};
    var options={mimeType:'video/webm'};
    recordedBlobs=[];
    try{
        console.log('trying to create mediaRecorder.');
        mediaRecorder=new MediaRecorder(window.stream,options);
    }catch (e0){
        console.log('mediaRecorder error !');

    }
    mediaRecorder.ondataavailable=handleDataAvailable;
    mediaRecorder.start(1);
    console.log('mediaRecorder started. '+mediaRecorder);
}

function handleDataAvailable(event){
    //console.log('handleDataAvailable called !');
    if(event.data&&event.data.size>0){
        recordedBlobs.push(event.data);
        mediaSender.postMessage({type:'mediaStream',data:event.data});
        //#console.log("Data chunk size: "+event.data.size);
    }
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
    //var buffer=new Blob(recordedBlobs);
    recordedBlobs=[];
    playVideo.src=window.URL.createObjectURL(buffer);
    playVideo.onended=function(){
        console.log("onened event fired");
        playRecorded();
    }
    playVideo.play();
}

function wsConnect(){
    console.log('wsconnect called ');
    var proxyInfo=document.getElementById("ipAddress").value;//+":"+document.getElementById("portNumber").value;
    if(mediaSender==null)  mediaSender=new Worker('../js/MediaSender.js');
    mediaSender.postMessage({type:"connect",proxyIP:proxyInfo,serviceName:document.getElementById("portNumber").value});
}

function wsRegister(){
    console.log('wsRegister called');
    mediaSender.postMessage({type:'register',name:document.getElementById("name").value,routingTag:document.getElementById("routingTag").value});
}


var gotRemoteSignalling=function(data) {
    //#console.log("gotRemoteSignalling called ");

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
