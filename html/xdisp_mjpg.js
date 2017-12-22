/// by fanxiushu 2017-12-05 for Motion-JPEG
function includeScript(file) {
    document.write('<script type="text/javascript" src="' + file + '"></script>');
}
includeScript("jsmpeg/jsmpeg.js")
includeScript("jsmpeg/buffer.js")
includeScript("jsmpeg/decoder.js")
includeScript("jsmpeg/mp2.js")
includeScript("jsmpeg/webaudio.js")

/// common function
function launchFullScreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozExitFullScreen) {
        document.mozExitFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

function changeImgSize(canvas, type) { //改变img大小，
    var isFullscreen = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
    if (isFullscreen) {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        return;
    }
    if (type === 1) { // match remote screen
        if (canvas.naturalWidth && canvas.naturalHeight) {
            canvas.width = canvas.naturalWidth; canvas.height = canvas.naturalHeight;
        }
        return;
    }

    var W = window.innerWidth > 30 ? window.innerWidth - 30 : 30;
    var dtH = document.getElementById('table_line1').clientHeight + document.getElementById('table_line3').clientHeight + 20;
    var H = window.innerHeight > dtH ? window.innerHeight - dtH : dtH;

    if (type === 2) {// lock w, h
        if (canvas.naturalWidth && canvas.naturalHeight) {
            var lck = 1.0 * canvas.naturalHeight / canvas.naturalWidth;
            var hh = parseInt(W * lck);
            if (hh <= H) H = hh;
            else {
                W = parseInt(H / lck);
            }
        }
        /////
    }

    canvas.width = W; canvas.height = H;
}
function IsPcBrowser() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
function IsiPhoneBrowser() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["iPhone", "iPad", "iPod"];
    var flag = false;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = true;
            break;
        }
    }
    return flag;
}


//////
window = this;

(function (window) { "use strict";
   
var ws_url;
var canvas = null;
var mjpg_quailty = 50;
var audio_rate = 256 * 1024;

var mp2decoder = null;
var audioplayer = null;
var mp2pts = 0;

var client = null;   // websocket

var is_little_endian = false; // 是不是小尾序

var r_width = 0;
var r_height = 0;

var onPictureSizeChange = null; //回调函数，远端屏幕发生变化

/////mouse 
function isIE() { //ie?  
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
    else
        return false;
}
var left, right;
left = 0; // isIE() ? 1 : 0;
right = 2;

////心跳处理
var heartBeat = {
    timeout: 10 * 1000, // 10秒
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
            hdr[1] = 1; //  request;
            client.send(hdr); //alert('timeout send');
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
    try {
        client = new WebSocket(ws_url);

        client.onclose = function (e) {
            console.log('Disconnected!');
            reconnectWebSocket();
        }

        client.onerror = function (e) {
            console.log('webSocket error!');
            reconnectWebSocket();
        }

        client.onopen = function (e) {
            ///
            client.binaryType = 'arraybuffer';

            heartBeat.reset().start(); ///
            ///
            client.onmessage = function (e) {
                heartBeat.reset().start();
                ////
                OnRecvMessage(e);
            }
            ///
            enable_video_audio(0, 1, mjpg_quailty ); ////
            change_audio_compress_type(4, audio_rate ); // MP2 ,256Kbps

            ////
            if (canvas.naturalHeight != r_height || canvas.naturalWidth != r_width) {
                r_width = canvas.naturalWidth; r_height = canvas.naturalHeight;
                if (onPictureSizeChange) onPictureSizeChange(r_width, r_height);
            }
            setTimeout(function () {
                ///
                var hdr = new Uint8Array(18);
                hdr[0] = 6; // CMD_PARAM
                hdr[1] = 0; ///
                hdr[2] = 4; /// PS_TYPE_PERSONAL
                hdr[3] = 2; // param get
                client.send(hdr);
                /////
                if (canvas.naturalHeight != r_height || canvas.naturalWidth != r_width) {
                    r_width = canvas.naturalWidth; r_height = canvas.naturalHeight;
                    if (onPictureSizeChange) onPictureSizeChange(r_width, r_height);
                }
                ///////
            }, 8 * 1000);
            ///////
        }

    }
    catch (e) {
        console.log("createWebSocket Exception");
        reconnectWebSocket();
    }
}
var is_reconnect = false;
function reconnectWebSocket() {
    if (is_reconnect) return;
    is_reconnect = true;
    setTimeout(function () {
        ///
        createWebSocket(url);

        is_reconnect = false;
        /////
    }, 4 * 1000)  ////
}

var xdisp_mjpg = window.xdisp_mjpg = function (cv, url, jpg_quailty, audioRate, on_picSizeChange)
{
    ws_url = url;
    canvas = cv;
    mjpg_quailty = jpg_quailty;
    onPictureSizeChange = on_picSizeChange;
    audio_rate = audioRate;

    if (!IsiPhoneBrowser()) {// 不是iOS系统，iOS系统需要手动开启声音
        initAudioPlayer();
    }
    /////
    var arr32 = new Uint32Array(1);
    arr32[0] = 1; ///
    var arr8 = new Uint8Array(arr32.buffer);
    if (arr8[0] == 1) {
        is_little_endian = true;
    } else is_little_endian = false;
    console.log('this machine is litte endian=' + is_little_endian);

    /////

    /// init websocket
    createWebSocket();

    /////
    ///// mouse event
    canvas.addEventListener("mousedown", MouseDown, false);
    canvas.addEventListener("mouseup", MouseUp, false);
    canvas.addEventListener("mousemove", MouseMove, false);
    canvas.addEventListener("mousewheel", MouseWheel, false);
    canvas.addEventListener("DOMMouseScroll", MouseWheel, false);
    canvas.addEventListener("contextmenu", function (e) { e.preventDefault(); return false; }, false);

    ///touch
    canvas.addEventListener("touchstart", function (e) {
        ///
        initAudioPlayer(); // for iOS 
        //  Mouse(1, 0, e);
    }, false);
    canvas.addEventListener("touchend", function (e) {
        //   Mouse(2, 0, e);
    }, false);
    canvas.addEventListener("touchmove", function (e) {
        MouseMove(e);
    }, false);

    /// key event
    canvas.setAttribute("tabindex", "1"); //设置焦点，这样才能获得键盘输入
    canvas.focus();

    canvas.addEventListener("keydown", KeyDown, false);
    canvas.addEventListener("keyup", KeyUp, false);
}

    ////
var AudioRender = function () {

}
AudioRender.prototype.play = function (sampleRate, left, right) {
    var maxAudioLag = 0.25;
    if (audioplayer.getEnqueuedTime() > maxAudioLag) {
        audioplayer.resetEnqueuedTime();
        audioplayer.enable = false;
        console.log('Has Much Audio sound.\n');
        return;
    }

    audioplayer.play(sampleRate, left, right);
}

function initAudioPlayer() {
    if (audioplayer) return;
    ////
    if (JSMpeg.AudioOutput.WebAudio.IsSupported()) { // webaudio supported
        ////
        var opts_audio = { audioBufferSize: 512000, autoPlay: true, streaming: true }; //alert('init audio');
        mp2decoder = new JSMpeg.Decoder.MP2Audio(opts_audio);
        audioplayer = new JSMpeg.AudioOutput.WebAudio(opts_audio);

        mp2decoder.connect(new AudioRender() );

        ///// for iOS
        audioplayer.unlock(function () {
            /////
        });
    }
    ///////
}

xdisp_mjpg.prototype.change_remote_screen_size = function (width, height) {
    var hdr = new Uint8Array(18); ///
    hdr[0] = 6; /// CMD_PARAM
    hdr[1] = 0; /// subcmd

    hdr[2] = 3; // scale picture
    hdr[3] = 1; // set param
    htons(hdr, 4, parseInt(width)); // new width
    htons(hdr, 6, parseInt(height));// new height
    ////
    client.send(hdr);
}

function enable_video_audio(enable_video, enable_audio, mjpg_quailty) {
    var hdr = new Uint8Array(18); ///
    hdr[0] = 6; /// CMD_PARAM
    hdr[1] = 0; /// subcmd

    hdr[2] = 4; // PS_TYPE_PERSONAL
    hdr[3] = 1; // set param
    hdr[4] = enable_video; // enable video
    hdr[5] = enable_audio; // enable audio
    hdr[6] = 1; // mjpg
    hdr[7] = mjpg_quailty; 
    ////
    client.send(hdr);
}

function change_video_compress_type(compress_type, rate) {
    var hdr = new Uint8Array(18); ///
    hdr[0] = 6; /// CMD_PARAM
    hdr[1] = 0; /// subcmd

    hdr[2] = 1; /// image compress
    hdr[3] = 1; // set param
    hdr[4] = 0; ///
    hdr[5] = compress_type;
    hdr[6] = 1;
    hdr[7] = 3;
    hdr[8] = 23; //H264图像质量越低图像质量越高， 范围 20-51
    htons(hdr, 9, parseInt(600)); // i frame max
    htonl(hdr, 11, parseInt(rate));
    //   alert('compress type =' + hdr);
    ////
    client.send(hdr);
}
function change_audio_compress_type(compress_type, rate) {
    var hdr = new Uint8Array(18); ///
    hdr[0] = 6; /// CMD_PARAM
    hdr[1] = 0; /// subcmd

    hdr[2] = 2; /// audio
    hdr[3] = 1; // set param
    hdr[4] = 4; // audio compress
    hdr[5] = compress_type; // MP2 
    htonl(hdr, 6, parseInt(rate));
    ////
    client.send(hdr);
}

////获取当前坐标,并且转换到 [0,65535]范围
function getPos(event) {
    event = event || window.event;
    // firefox , event.pageX = undefined
    var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft || 0;
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0;

    var x = event.pageX != undefined ? event.pageX : event.clientX;
    var y = event.pageY != undefined ? event.pageY : event.clientY;

    // var x = event.x;
    // var y = event.y;
    var borderW, borderH;
    var rect = canvas.getBoundingClientRect();

    var W = canvas.width;
    var H = canvas.height;

    borderW = ((rect.bottom - rect.top) - H) / 2;
    borderH = ((rect.right - rect.left) - W) / 2;

    x = x - rect.left - borderW - scrollLeft;
    y = y - rect.top - borderH - scrollTop;

    if (x < 0) {
        x = 0;
    }
    if (y < 0) {
        y = 0;
    }
    if (x >= W) {
        x = W - 1;
    }
    if (y >= H) {
        y = H - 1;
    }

    ///取整
    x = parseInt(x * 65536 / canvas.width);
    y = parseInt(y * 65536 / canvas.height);
    //////
    return {
        x: x,
        y: y
    }
}

function htonl(dst, pos, v) {
    if (is_little_endian) { //本机是小尾序，反转
        dst[pos + 0] = (v >> 24) & 0xFF;
        dst[pos + 1] = (v >> 16) & 0xFF;
        dst[pos + 2] = (v >> 8) & 0xFF;
        dst[pos + 3] = v & 0xFF;
    }
    else {
        dst[pos + 3] = (v >> 24) & 0xFF;
        dst[pos + 2] = (v >> 16) & 0xFF;
        dst[pos + 1] = (v >> 8) & 0xFF;
        dst[pos + 0] = v & 0xFF;
    }
    ////
}
function htons(dst, pos, v) {
    if (is_little_endian) { //本机是小尾序，反转
        dst[pos + 0] = (v >> 8) & 0xFF;
        dst[pos + 1] = v & 0xFF;
    }
    else {
        dst[pos + 1] = (v >> 8) & 0xFF;
        dst[pos + 0] = v & 0xFF;
    }
    ////
}
function ntohl(src, pos) {
    var dst = 0;
    if (is_little_endian) {
        dst = (src[pos + 0] << 24) | (src[pos + 1] << 16) | (src[pos + 2] << 8) | (src[pos + 3]);
    }
    else {
        dst = (src[pos + 3] << 24) | (src[pos + 2] << 16) | (src[pos + 1] << 8) | (src[pos + 0]);
    }
    return dst;
}

function Mouse(type, button, e) {
    var pt = getPos(e);
    var flags;
    if (type === 1) { // down
        if (button == right) flags = 0x08; // right down
        else flags = 0x02; ///left down
    }
    else if (type === 2) {//up
        if (button == right) flags = 0x10; // right up
        else flags = 0x04; ///left up
    }
    else if (type === 3) {//move
        flags = 0x01; /// move
        ///
    }
    /////
    var hdr = new Uint8Array(18); ///
    hdr[0] = 4; /// CMD_MOUSE
    hdr[1] = 0;

    htonl(hdr, 2, parseInt(flags)); // flags
    hdr[6] = hdr[7] = hdr[8] = hdr[9] = 0; //delta

    htonl(hdr, 10, parseInt(pt.x));
    htonl(hdr, 14, parseInt(pt.y));

    /////
    client.send(hdr);
    //////
    //   console.log("Mouse Event: "+ pt.x +" "+pt.y);
}

function MouseDown(e) {
    // console.log("MouseDown: "  );
    Mouse(1, e.button, e);
}

function MouseUp(e) {
    Mouse(2, e.button, e);
}

function MouseMove(e) {
    Mouse(3, 0, e);
}

function MouseWheel(e) {
    var pt = getPos(e);
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))) * 100;

    var hdr = new Uint8Array(18); ///
    hdr[0] = 4; /// CMD_MOUSE
    hdr[1] = 0;
    var flags = 0x0800; // MOUSEEVENTF_WHEEL

    htonl(hdr, 2, parseInt(flags)); // flags
    htonl(hdr, 6, parseInt(delta));

    htonl(hdr, 10, parseInt(pt.x));
    htonl(hdr, 14, parseInt(pt.y));

    client.send(hdr);
    ////
    console.log('mousewheel');
}

    ////////
function Key(type, e) {
    var flags = 0; /// key down
    if (type == 2) flags = 0x02; /// key up
    ////

    var hdr = new Uint8Array(18);
    hdr[0] = 5; // CMD_KEYBOARD
    hdr[1] = 0;
    htonl(hdr, 2, parseInt(flags)); // flags

    htons(hdr, 6, parseInt(e.keyCode)); // virtual code
    htons(hdr, 8, 0); // scan code

    ////
    client.send(hdr); ///
}
function KeyDown(e) {
    // alert("key down: " + e.keyCode );
    Key(1, e);
}

function KeyUp(e) {
    Key(2, e);
}

    ////
function OnRecvMessage(evt)
{
    var buf = new Uint8Array(evt.data);
    var len = buf.length;
    if (len < 18) return;
    ////
    if (buf[0] == 0) { // heartbear
        return;
    }

    ///
    if (buf[0] == 3) { // AAC audio
        PlayAudio(buf);
        return;
    }
    //////
    if (buf[0] == 6) {// CMD_PARAM
        var is_mjpg_online = buf[6];
        console.log('mjpg is online=' + is_mjpg_online);
        if (!is_mjpg_online) {
            ////
            window.location.reload(); ///
            return;
        }
    }
 //   console.log('recv Other msg len='+buf.length);
}

///audio
function PlayAudio(buf) {
    if (buf[2] != 4) {
        console.log('-- not mp2 compress audio');
        return;
    }

    if (audioplayer == null || mp2decoder == null) return;
    ///////MP2 
    var audio_data = buf.subarray(18);

    mp2decoder.write(mp2pts++, audio_data);
    while (mp2decoder.decode());

}

})(window);

