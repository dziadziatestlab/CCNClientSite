window.ice=[];
window.remoteIce=[];
var gotIceCandidate=function(ice){
  console.log('gotIce candidate'+ice);
  console.log(JSON.stringify(ice.candidate));
  window.ice.push(ice.candidate);
};

var gotRemoteIceCandidate=function(ice){
  console.log('remoteIce candidate');
  window.remoteIce.push(ice.candidate);
};
var video=document.getElementById("localVideo");
var constraints={video:true};
var onSuccess=function(stream){
  console.log('onSuccess called');
  video.src=window.URL.createObjectURL(stream);
  window.stream=stream;
  video.play();
  startPeer();
};

var onError=function(){
  console.log('onError called');
};

var start=function(){
  console.log("start called");
  navigator.mozGetUserMedia(constraints,onSuccess,onError);
};

var peerConnection=new mozRTCPeerConnection();
peerConnection.onicecandidate=gotIceCandidate;
peerConnection.onaddstream=function(){
  console.log('onaddstream called');
};


var startPeer=function(){
  peerConnection.addStream(stream);
  peerConnection.createOffer(gotDescr,onError,onError);
};

var remotePeer=new mozRTCPeerConnection();
remotePeer.onicecandidate=gotRemoteIceCandidate;

var gotDescr=function(descr){
  console.log('gotDescr called');
  peerConnection.setLocalDescription(descr);
  remotePeer.setRemoteDescription(descr,function(){
    console.log('remote descr set !!!');
    remotePeer.createAnswer(onAnswer,onError);
  },onError);
  window.localDescr=descr;
};


var onAnswer=function(descr){
  console.log('answer created !');
  peerConnection.setRemoteDescription(descr,function(){
    console.log('remotePeer on local set !!!');
  },onError);
  window.remoteDescr=descr;
  remotePeer.setLocalDescription(descr,function(){
    console.log('remotePeer local SDP set');
  },onError);
};



