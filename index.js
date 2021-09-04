var startRecord = document.querySelector("#start");
var stopRecord = document.querySelector("#stop");
var video = document.querySelector("#video");
var recordedChunks = [];

startRecord.addEventListener("click",()=>{
    startCapture(video);
});

stopRecord.addEventListener("click",()=>{
    stopCapture(video);
});

async function startCapture(vid) {
    try {
        let displayMediaOptions = {
            video: "true",
            audio: "true"
        };
        let mediaRecordOptions = { 
            mimeType: "video/webm; codecs=vp9" 
        };

        stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
        vid.srcObject = stream;
        startMediaRecorder(stream,mediaRecordOptions);
    } catch(err) {
        console.log(err);
    }
}

function stopCapture(v){
    let tracks = v.srcObject.getTracks();

    tracks.forEach(element => element.stop());
    v.srcObject = null;
}

function startMediaRecorder(strm,options) {
    mediaRecorder = new MediaRecorder(strm,options);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start();
}

function handleDataAvailable(event) {
    if(event.data.size > 0) {
        recordedChunks.push(event.data);
        download();
    } 
}

function download() {
	if(confirm("Do you want to download this recording?")==true) {
		var blob = new Blob(recordedChunks, {
	    	type: "video/webm"
	    });
	    var url = URL.createObjectURL(blob);
	    var a = document.createElement("a");

	    document.body.appendChild(a);
	    a.style = "display: none";
	    a.href = url;
	    a.download = "test.webm";
	    a.click();
	    window.URL.revokeObjectURL(url);
	}    
}