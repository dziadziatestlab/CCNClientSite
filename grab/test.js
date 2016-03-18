
/**
 * Created by Robert on 2016-03-17.
 */

var startLocalBtn=document.getElementById("startLocal");
startLocalBtn.onclick=startVideo;

var localVideo=document.getElementById("localVideo");
var remoteVideo=document.getElementById("remoteVideo");
var mediaSourceBtn=document.getElementById("mediaSource");
mediaSourceBtn.onclick=startMediaSource;

var recordBtn=document.getElementById("record");
recordBtn.onclick=startRecord;
var playRemoteBtn=document.getElementById("playRemote");
playRemoteBtn.onclick=playRemote;

var constraints={video:true,audio:true};
var mediaRecorder;
var recordedBlobs=[];
var mediaSource;

var success=function(stream){
    window.rawStream=stream;
    window.stream=window.URL.createObjectURL(stream);
    localVideo.src=window.stream;
    localVideo.play();

}
var error=function(){
    console.log("Some errors");
}

function startVideo(){
    navigator.mozGetUserMedia(constraints,success,error);
}


function startRecord(){
    console.log("startRecord called");
    var options={mimeType:'video/webm'};
    try{
        mediaRecorder=new MediaRecorder(window.rawStream,options);
        mediaRecorder.ondataavailable=dataHandler;
        mediaRecorder.start(10);
    }catch (e){
        console.log("mediaRecorder problems");
    }

}


function dataHandler(event){
    //console.log("dataHandler called");
    recordedBlobs.push(event.data);
    addToBuffer(event.data);
}


function addToBuffer(data){
    var f=new FileReader();
    f.onloadend=function(){
        sourceB.appendBuffer(f.result);
    }
    var rb=[];
    rb.push(data);
    var b=new Blob(rb,{type:'video/webm'});
    f.readAsArrayBuffer(b);
    //console.log(window.sourceB);
    //window.sourceB.appendBuffer(f.result);

}


function startMediaSource(){

    mediaSource=new MediaSource;
    mediaSource.addEventListener('sourceopen',sourceOpenHandler);
    remoteVideo.src=window.URL.createObjectURL(mediaSource);
    remoteVideo.play();
}


function sourceOpenHandler(_){
    console.log("soourceOpenHandler called");
    var mimeCodec="video/webm";
    var mediaSource=this;
    var sourceBuffer=mediaSource.addSourceBuffer(mimeCodec);
    sourceBuffer.addEventListener('updateend',function(_){
        console.log("sourceBuffer updateend called");
        //mediaSource.endOfStream();
        //remoteVideo.play();

    });
    /*
    setInterval(function(){
        console.log('setInterval called');
        var b=new Blob(recordedBlobs,{type: 'video/webm'});
        console.log(b);
        var f=new FileReader();
        f.readAsArrayBuffer(b);
        sourceBuffer.appendBuffer(f.result);
    },15000);
    */


    window.sourceB=sourceBuffer;
    console.log(window.sourceB);

}

startMediaSource();

function playRemote(){
    console.log('play remote called');
    var b=new Blob(recordedBlobs,{type:'video/webm'});
    console.log(b);
    var f= new FileReader();
    f.onloadend=function(){
        console.log('file onloadend called');
        console.log(f);
        console.log(sourceB);
        sourceB.appendBuffer(f.result);
        //mediaSource.endOfStream();
        //remoteVideo.play();
    }
    f.readAsArrayBuffer(b);
}

//window.setInterval(playRemote(),20000);