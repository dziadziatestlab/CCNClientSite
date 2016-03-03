/**
 * Created by Robert on 2016-03-03.
 */

var getStreamBtn=document.getElementById("getStream");
getStreamBtn.onclick=getMediaStream;
var wsConnectBtn=document.getElementById("wsConnect");
wsConnectBtn.onclick=wsConnectF;




function wsConnectF(){
    console.log('wsConnectF called');
    window.WSConnection=WS.connect("192.168.0.162",8000);
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