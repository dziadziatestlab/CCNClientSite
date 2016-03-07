/**
 * Created by Robert on 2016-03-03.
 */

var getStreamBtn=document.getElementById("getStream");
getStreamBtn.onclick=getMediaStream;
var wsConnectBtn=document.getElementById("wsConnect");
wsConnectBtn.onclick=wsConnectF;
var registerBtn=document.getElementById("register");
registerBtn.onclick=wsRegister;
var remoteVideo=document.getElementById("remoteVideo");
remoteVideo.play();


var recordedBlobs=[];
window.buffer=new Blob(recordedBlobs,{type:'video/webm'});
var stream=window.URL.createObjectURL(buffer);
remoteVideo.src=stream;


function wsConnectF(){
    console.log('wsConnectF called');
    window.wsConnection=WS.connect(document.getElementById("ipAddress").value,document.getElementById("portNumber").value);
}

function playVideo(data){
    recordedBlobs.push(data);
    console.log('PLAYVIDEO called !!!!');

    //console.log('buffer'+ buffer);


    //remoteVideo.play();
}


function getMediaStream(){
    console.log('getMediaStream called');
    setTimeout(function(){
        CCNAPI.getMedia();
    },50);
}

var gotRemoteSignalling=function(data) {
    console.log("gotRemoteSignalling called ");
    //console.log("type of localDescription: "+typeof(mediaObject.localDescription));
    //console.log("type of data.SDP: "+typeof(data.SDP));
    //console.log("data.SDP: \n"+data.SDP);
    console.log('type of data :'+typeof(data)+ '!!!!!!!!!!!!!!!' );


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

            else {
                console.log('Received answer: '+JSON.stringify(data));
                setTimeout(function () {
                    CCNAPI.getMedia();
                }, 150);

                //startMediaRequest();
            }
        }
    }
    //playVideo(data);
}

function gotRemoteStreamCCN(data){
    console.log('gotRemoteStream called !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    playVideo(data);
}

function wsRegister(){
    console.log('wsRegister called');
    CCNAPI.nameRegister();
}
