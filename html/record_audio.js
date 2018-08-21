/// by Fanxiushu 2018-08-11 

function includeScript(file) {
    document.write('<script type="text/javascript" src="' + file + '"></script>');
}

///
var client = null;
var ws_url = null;
var is_closed_wsock = false;

////
var record_source = null;
var record_node = null;
var record_worker = null;

var record_volume = 1.0;

var sample_rate = 48000;

////心跳处理
var heartBeat = {
    timeout: 20 * 1000, // 20毫秒
    timerObj1: null,
    timerObj2: null,
    reset: function () {
        clearTimeout(this.timerObj1);
        clearTimeout(this.timerObj2);
        return this;
    },
    start: function () {
        var self = this;
        this.timerObj1 = setTimeout(function () {
            //发送心跳，
            var hdr = new Uint8Array(18);
            hdr[0] = 0; //// CMD_NOOP;
            hdr[1] = 1; // request;
            client.send(hdr);
            // wsock_send(hdr);
            ////
            self.timerObj2 = setTimeout(function () {
                //
                client.close(); ///一定时间后，服务端没响应，直接关闭
                ////
            }, self.timeout * 2)
            //////
        }, this.timeout)
    }
}
function createWebSocket() {
    var xhr = new XMLHttpRequest();
    var is_tmo = false;
    var timer = setTimeout(function () {
        is_tmo = true;
        xhr.abort();
    }, 10 * 1000);
    xhr.onreadystatechange = function () {
        if (is_tmo) {
            console.log('wsock_GetToken timeout, reconnect');
            reconnectWebSocket();
            return;
        }
        if (xhr.readyState != 4) {
            return;
        }
        clearTimeout(timer);
        if (xhr.status === 200 && xhr.responseText != null) {
            var url = ws_url + "&token=" + xhr.responseText; //alert(url);
            __createWebSocket(url);
        }
        else {
            console.log('Not Get Wsock Token.');
            reconnectWebSocket();
            //
        }
    };
    ////
    xhr.open("GET", "/wsock_token", true);
    xhr.send(null);
}
var intervalId = null;
function __createWebSocket(wsUrl) {
    try {
        try {
            if (client != null) {
                if (intervalId) { clearInterval(intervalId); intervalId = null; }
                client.onclose = function (e) { console.log('Closed not use webSocket.') }
                client.close(); client = null;
            }
        } catch (e) { console.log('close excep.') }
        ///
        client = new WebSocket(wsUrl);

        client.onclose = function (e) {
            if (intervalId) { clearInterval(intervalId); intervalId = null; }
            console.log('Disconnected!');
            reconnectWebSocket();
        }

        client.onerror = function (e) {
            if (intervalId) { clearInterval(intervalId); intervalId = null; }
            console.log('webSocket error!');
            reconnectWebSocket();
        }

        client.onopen = function (e) {

            ///
            client.binaryType = 'arraybuffer';

            heartBeat.reset().start(); ///

            ////
            intervalId = setInterval(function () {
                var hdr = new Uint8Array(18);
                hdr[0] = 0; /// CMD_NOOP;
                hdr[1] = 1; // request
                client.send(hdr);
                ///
            },
                20 * 1000);
            ///
            client.onmessage = function (e) {
                heartBeat.reset().start();
                ////
                OnRecvMessage(e);
            }
            ///
            enable_video_audio(0, 0); // enable audio & video

            /////
        }

    }
    catch (e) {
        console.log("createWebSocket Exception");
        reconnectWebSocket();
    }
}
var is_connecting = false;
function reconnectWebSocket() {
    if (is_closed_wsock) return;
    ///
    if (is_connecting) return;
    ///
    is_connecting = true;
    //
    setTimeout(function () {
        ///

        createWebSocket();

        is_connecting = false;
        /////
    }, 4 * 1000)  ////
}
function wsock_send(data) {
    if (client == null) {
        //    console.log('wsock send data not create websocket, will reconnect.');
        //     reconnectWebSocket();
        return -1;
    }
    try {
        if (client.readyState != 1) return -1; // not OPEN
        ///
        return client.send(data);
    } catch (e) {
        console.log('websocket send exception:' + e);
        client.close();
        client = null;
        return -1;
    }
    return 0;
}

function enable_video_audio(enable_video, enable_audio) {
    var hdr = new Uint8Array(18); ///
    hdr[0] = 6; /// CMD_PARAM
    hdr[1] = 0; /// subcmd

    hdr[2] = 4; // PS_TYPE_PERSONAL
    hdr[3] = 1; // set param
    hdr[4] = enable_video; // enable video
    hdr[5] = enable_audio; // enable audio
    hdr[6] = 0; // mjpg
    ////
    client.send(hdr);
}

function OnRecvMessage(evt) {
    ///
    var buf = new Uint8Array(evt.data);
    var len = buf.length;
    if (len < 18) return;
    ////
    if (buf[0] == 0) { // heartbear
        return;
    }
    //////

}


function webaudio_recoder_create(wsock_url, err_cbk )
{
    ////
    ws_url = wsock_url;

    ////
    try{
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        window.URL = window.URL || window.webkitURL;
        ///
        navigator.getUserMedia({ audio: true },
            function (stream) {
                ///
                var audio_context = new window.AudioContext;
                record_source = audio_context.createMediaStreamSource(stream);
                record_node = (audio_context.createScriptProcessor || audio_context.createJavaScriptNode).call(audio_context, 1024*4, 2, 2); /// buflen=8192, 2 channel

                ////
                if (record_worker == null) {
                    record_worker = new Worker("record_worker.js");
                    ///
                    record_worker.addEventListener('message', function (e) {
                        //
                        if (is_closed_wsock) return;
                        ////
                        var message = e.data;
                        if (message.type === 'encode') {
                            ///
                            wsock_send(message.buffer);
                            ////
                        }
                        ////
                    });

                    /////
                }

                ///
                if (record_worker != null) {
                    var sample_rate = audio_context.sampleRate;
                    if (sample_rate === 96000) sample_rate = 48000; //???chrome显示 96000，但是实际是 48000， 其他似乎正常

                    record_worker.postMessage({ type: 'init', sample_rate: sample_rate });
                }

                ////
                is_closed_wsock = false;
                createWebSocket();

                //////
                record_node.onaudioprocess = function (e) {
                    var left = e.inputBuffer.getChannelData(0); // left
                    var right = e.inputBuffer.getChannelData(1);// right
                    ///
                    //console.log('left=' + left.length+', right='+right.length); //

                    var v, i;
                    for (i = 0; i < left.length; i++) {
                        v = left[i] *record_volume;
                        if (v > 1.0) v = 1.0; else if (v < -1.0) v = -1.0;
                        left[i] = v;
                    }
                    for (i = 0; i < right.length; i++) {
                        v = right[i] * record_volume;
                        if (v > 1.0) v = 1.0; else if (v < -1.0) v = -1.0;
                        right[i] = v;
                    }
                    /////
                    if (record_worker != null) {
                        //
                        ///
                        record_worker.postMessage({ type:'data', left: left ,right:right});
                    }
                }

                /////

                console.log('samples=' + audio_context.sampleRate);

                //////
                record_source.connect(record_node);
                record_node.connect(audio_context.destination);

                ////

            },
            function (e) {
                ////
                //   alert('No live audio input: ' + e);
                err_cbk('No live audio input: ' + e);
                return false;
            });
        /////
    }
    catch (e) {
        //    alert('the web Browser Not Supported WebAudio Recorder: ' + e);
        err_cbk('the web Browser Not Supported WebAudio Recorder: ' + e);
        return false;
    }
    ////
    return true;
}

function webaudio_recorder_destroy()
{
    is_closed_wsock = true;
    ///
    if (record_worker) {
        record_worker.postMessage({ type: 'deinit' });
        record_worker.terminate();
        record_worker = null;
        ///
    }
    /////
    if (record_node) {
        record_node.disconnect();
        record_node = null;
    }
    if (record_source) {
        record_source.disconnect();
        record_source = null;
    }

    /////
   
    if (client != null) {
        client.close();
        client = null;
    }
}

function webaudio_set_volume(volume)
{
    record_volume = volume;
}
function webaudio_get_volume()
{
    return record_volume;
}

