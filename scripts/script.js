/**
 * @name handfall
 * @param err - error thrown by any function
 * @description Helper function to handle errors
 */
let handleFall = function(err){
    console.log("Error : ", err);
}

// Queries the container in which the remote feeds belong
let remoteContainer = document.getElementById(remote-container);
let canvasContainer = document.getElementById(canvas-container);

/**
 * @name addVideoStream
 * @param streamId
 * @description Helper function to add the video stream to "remote-container"
 */
function addVideoStream(streamId){
    let streamDiv = document.createElement("div"); // Create a new div for every stream
    streamDiv.id = streamId;                       // Assigning id to div
    streamDiv.style.transform='rotateY(180deg)';   // Takes care of lateral inversion (mirror image)
    remoteContainer.appendChild(streamDiv);        // Add new div to container
}

/**
 * @name removeVideoStream
 * @param evt - Remove event
 * @description Helper function to add the video stream to "remote-container"
 */
function removeVideoStream(evt){
    let stream = evt.stream;
    stream.stop();
    let remDiv = document.getElementById(stream.getId());
    remDiv.parentNode.removeChild(remDiv);
    console.log("Remote stream is removed " + stream.getId());
}

/**
 * @name aaddCanvas
 * @param streamId
 * @description Helper function to add the video stream to a canvas
 */
function addCanvas(streamId){
    let video=document.getElementById(`video${streamId}`);
    let canvas=document.createElement("canvas");
    canvasContainer.appendChild(canvas);
    let ctx = canvas.getContext('2d');

    video.addEventListener('loadedmetadata', function() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    });

    video.addEventListener('play', function() {
        var $this = this; //cache
        (function loop() {
            if (!$this.paused && !$this.ended) {
                if($this.width !== canvas.width){
                    canvas.width=video.videoWidth;
                    canvas.height=video.videoHeight;
                }
                ctx.drawImage($this, 0, 0);
                setTimeout(loop,1000/30); // drawing at 30fp
            }
        })();
    }, 0);
}

let client=AgoraRTC.createClient({
    mode:'live',
    codec:'h264'
});

client.init("01a08fd5783d47dd81986121c2ecbfe1", ()=>console.log("Client initialized !"));

client.join(null, 'agora-demo', null, (uid)=>{
    let localStream=AgoraRTC.createStream({
        streamID:uid,
        audio:false,
        video:true,
        screen:false
    });

    localStream.init(function () {
        localStream.play('me');
        client.publish(localStream.handleFall);

        client.on('stream-added', function (evt) {
            client.subscribe(evt.stream.handleFall);
        });

        client.on('stream-subscribed', function (evt) {
            let stream=evt.stream;
            addVideoStream(stream.getId());
            stream.play(stream.getId());
            addCanvas(stream.getId());
        });
        
        client.on('stream-removed', removeVideoStream);

    }.handleFall)
},handleFall);
