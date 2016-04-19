/**
 * Created by Robert on 2016-03-03.
 */

var getStreamBtn=document.getElementById("getRemoteStream");
getStreamBtn.onclick=getMediaStream;

function videoEnd(){
    console.log("VideoEnd called");
    playVideoPressed();
};

var recordedBlobs=[];

var  mediaSource=new MediaSource;
mediaSource.addEventListener('sourceopen',mediaSourceOpenHandler);
remoteVideo.src=window.URL.createObjectURL(mediaSource);
remoteVideo.play();

function mediaSourceOpenHandler(_){

    var mediaSource=this;
    var mimeCodec="video/webm";
    var sourceBuffer=mediaSource.addSourceBuffer(mimeCodec);
    sourceBuffer.addEventListener('updateend',function(_){
        //#console.log("sourceBuffer updated");
    });
    window.sourceB=sourceBuffer;
}

function playVideoPressed(){
    var nBlob=new Blob(recordedBlobs,{type:"video/webm"});
    var stream=window.URL.createObjectURL(nBlob);
    remoteVideo.src=stream;
    //remoteVideo.play();
    recordedBlobs=[];

}


function wsConnectF(){
    console.log('wsConnectF called');
    window.wsConnection=WS.connect(document.getElementById("ipAddress").value,document.getElementById("portNumber").value);
}

function playVideo(data){
    //var rBlobs=[];
    //rBlobs.push(data);
    //var blob=new Blob(rBlobs,{type:"video/webm"});
    //console.log("playVideo blob: ");
    //console.log(blob);
    //var st=window.URL.createObjectURL(blob);
    //remoteVideo.src=st;
    //remoteVideo.play();
    //recordedBlobs.push(data);
    //#console.log('PLAYVIDEO called !!!!');

    //console.log('buffer'+ buffer);


    //remoteVideo.play();

    var rb=[];
    rb.push(data);
    var b=new Blob(rb,{type:'video/webm'});
    var f=new FileReader();
    f.onloadend=function(){
        window.sourceB.appendBuffer(f.result);

    };
    f.readAsArrayBuffer(b);
}


function getMediaStream(){

    console.log('getMediaStream called');

    mediaSender.addEventListener('message',function(message){
        //#console.log("Worker said !!!");
        /*
        var data="";
        try{
            data=JSON.parse(message.data);
            //#console.log("parsing message OK !!!");

        }
        catch(e){
            console.log("No possibility to catch")
        }
        */

        gotRemoteStreamCCN(message.data);
    });


    var data={
        type:'remoteStream',
        From:document.getElementById("name").value,
        To:document.getElementById("calledName").value
    };
    mediaSender.postMessage(data);

}




var gotRemoteSignalling=function(data) {
    //#console.log("gotRemoteSignalling called ");
    //#console.log('type of data :'+typeof(data)+ '!!!!!!!!!!!!!!!' );


    if (data.ANSWER) {
        //#console.log("ANSWER RECEIVED !!!!");
        //#console.log(JSON.stringify(data.ANSWER));
        var session = new mozRTCSessionDescription(data.ANSWER);
        peerConnection.setRemoteDescription(session,
            function () {
                console.log('peerConnection setRemoteDescription success');
            }, onError);
    }

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
        }
        else {
            if (data.RESULT === 'NODATA') {
                setTimeout(function () {
                    CCNAPI.getMedia();
                }, 700);
            }

            else {
                //#console.log('Received answer: '+JSON.stringify(data));
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
    //#console.log('gotRemoteStream called !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    playVideo(data);
}

function wsRegister(){
    console.log('wsRegister called');
    CCNAPI.nameRegister();
}
