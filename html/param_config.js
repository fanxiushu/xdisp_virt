/// by fanxiushu 2018-07-04, 被控制端参数配置

window = this;

(function(window){ "use strict";

var ws_url;

var client = null;   // websocket

var is_little_endian = false; // 是不是小尾序
var is_stream_push = false;

var onParamChange = null;

////心跳处理
var heartBeat = {
    timeout: 20 * 1000, // 20 秒
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
            var url = ws_url + "&token=" + xhr.responseText;
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

            if (is_stream_push) queryStreamPush();
            queryParam();

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

////
var param_config = window.param_config=function(url, on_paramChange, is_streampush)
{
    ///
    ws_url = url;
    onParamChange = on_paramChange;
    is_stream_push = is_streampush;

    ////
    var arr32 = new Uint32Array(1);
    arr32[0] = 1; ///
    var arr8 = new Uint8Array(arr32.buffer);
    if (arr8[0] == 1) {
        is_little_endian = true;
    } else is_little_endian = false;
    console.log('this machine is litte endian=' + is_little_endian);

    /// init websocket
    createWebSocket();

}

param_config.prototype.htonl = function (dst, pos, v) {
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
param_config.prototype.htons = function (dst, pos, v) {
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
function ntohs(src, pos) {
    var dst = 0;
    if (is_little_endian) {
        dst = (src[pos + 0] << 8) | (src[pos + 1]);
    }
    else {
        dst = (src[pos + 1] << 8) | (src[pos + 0]);
    }
    return dst;
}

function queryParam()
{//console.log('send query param.');
    var hdr = new Uint8Array(18); ///

    hdr[0] = 6; /// CMD_PARAM
    hdr[1] = 0; /// subcmd

    hdr[2] = 1; // image
    hdr[3] = 2; // get param
    wsock_send(hdr);
    
    ////
    hdr[2] = 2; /// audio
    hdr[3] = 2; /// get param
    hdr[4] = 2; /// audio compress type
    hdr[5] = 0; //slot index

    wsock_send(hdr);

    hdr[4] = 1; /// audio volume
    for (var i = 1; i <= 4; ++i) {
        hdr[5] = i; // slot index
        wsock_send(hdr);
    }

    ////
    hdr[2] = 3; // scale

    wsock_send(hdr);
}
function queryStreamPush()
{
    var hdr = new Uint8Array(18); ///
    for (var i = 0; i < 18; i++) hdr[i] = 0;

    hdr[0] = 9; // CMD_PROXY
    hdr[1] = 0; // subcmd

    hdr[2] = 5; // PROXY_METHOD_STREAM_PUSH
    hdr[3] = 1; // query

    wsock_send(hdr); ///
}
param_config.prototype.query_param=function()
{
    queryParam();
}
param_config.prototype.query_streampush = function ()
{
    queryStreamPush();
}
param_config.prototype.send_header=function(hdr)
{
    wsock_send(hdr);
}
param_config.prototype.change_stream_state=function(uniqueid, state)
{
    var hdr = new Uint8Array(18 + 12); ///
    for (var i = 0; i < hdr.length; ++i) hdr[i] = 0;
    ////
    hdr[0] = 9;
    hdr[1] = 1;
    hdr[2] = 5; // PROXY_METHOD_STREAM_PUSH
    hdr[3] = 2; // modify stream state
    this.htonl(hdr, 14, 12); /// proxy.length
    ////
    this.htonl(hdr, 18, parseInt(12)); ///
    this.htonl(hdr, 18 + 4, parseInt(state)); // state
    this.htonl(hdr, 18 + 8, parseInt(uniqueid));

    ///
    wsock_send(hdr); ///
}
param_config.prototype.add_new_stream=function(url, state)
{
    var len = 18 + 12 + url.length + 1; 
    var hdr = new Uint8Array(len);
    var i;
    for (i = 0; i < len; ++i) hdr[i] = 0;
    ////
    hdr[0] = 9;
    hdr[1] = 0;
    hdr[2] = 5;
    hdr[3] = 2;
    this.htonl(hdr, 14, parseInt(len - 18)); /// proxy.length 

    ////
    this.htonl(hdr, 18, parseInt(len-18)); ///
    this.htonl(hdr, 18 + 4, parseInt(state)); // state
    this.htonl(hdr, 18 + 8, parseInt(0));

    for ( i = 0; i < url.length; ++i) {
        hdr[18 + 12 + i] = url.charCodeAt(i);
    }

    ////
    wsock_send(hdr);
}

////
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
    wsock_send(hdr);
}

    ///
function parseParamCmd(buf)
{console.log('param type=' + buf[2]);
    ///
    var result = {};
    ///
    var type = buf[2];
    var ctx = buf.subarray(4);
    
    if (type == 1) { // image
        var img = {};
        img["all_type"] = ctx[0];
        img["image_type"] = ctx[1]; console.log('CTX imtype='+ctx[1])
        if (ctx[1] >= 2 && ctx[1] <= 3) { // JPEG, YUV+JPEG
            img["jpeg_quailty"] = ctx[2];

        }
        else if (ctx[1] === 11) { // LOWPIC
            img["lowpic_type"] = ctx[2];
            img["jpeg_quailty"] = ctx[3];

        }
        else if (ctx[1] >= 4 && ctx[1] <= 10) { // H264,H265,MPEG4,MPEG2,MPEG1, VP8,VP9
            img["select_encoder"] = ctx[2];
            img["preset"] = ctx[3];
            img["rf_constant"] = ctx[4];
            img["keyint_max"] = ntohs(ctx, 5);
            img["bit_rate"] = ntohl(ctx, 7);
            img["priority"] = ctx[11];
            ///
        }
        result["image"] = img;
    }
    else if (type == 2) { //audio
        var a = {}; var b = {};
        b["index"] = ctx[1]; // slot index

        if (ctx[0] == 1) {//volume
            a["enable"] = ctx[2];
            a["value"] = ntohl(ctx, 3);
            a["state"] = ctx[12]; ///current state
            a["type"] = ctx[13];  // current type
            b["volume"] = a;
        }
        else if (ctx[0] == 2) {// compress
            a["type"] = ctx[2];
            a["bit_rate"] = ntohl(ctx, 3);
            b["compress"] = a;
        }
        ///
        result["audio"] = b;
    }
    else if (type == 3) { //scale
        var s = {};
        s["screen_width"] = ntohs(ctx, 0);
        s["screen_height"] = ntohs(ctx, 2);
        s["org_width"] = ntohs(ctx, 4);
        s["org_height"] = ntohs(ctx, 6);
        s["org_bitcount"] = ntohs(ctx, 8);
        s["org_grab_msec"] = ntohs(ctx, 10);
        s["org_cursor_state"] = ctx[12]; ///
        ///
        result["scale"] = s;
    }

    return result;
}
function parsePushStreamCmd(buf)
{
    var ret = {};

    var urls = [];
    ///
    if (buf.length < 18) {
        ret["err"] = "invalid param";
        return ret;
    }
    var pos = 0;
    var u = buf.subarray(18);

    if (buf[4] != 0) { // error
    //    console.log('stream push deny.');
        ret["err"] = "deny";
    }
//    console.log('buf[4]='+buf[4])

    while (pos < buf.length - 18) {
        ///
        
        var size = ntohl(u, pos + 0);    
        var state = ntohl(u, pos + 4);    
        var uniqueid = ntohl(u, pos + 8); 
        ////
        var url = "";
        for (var i = 0; i < size - 12; ++i) {
            if (u[pos + 12 + i] == 0) break;
            url += String.fromCharCode(u[pos + 12 + i]);
        }
        ///
        //    console.log('url=' + url + ", state=" + state+", uid="+uniqueid);
        var item = {};
        item["state"] = state;
        item["uniqueid"] = uniqueid;
        item["url"] = url;

        urls.push(item); ///
        ////
        pos += size; //
    }
    ///
    ret["url_array"] = urls; //console.log('KK: '+ret);

    return ret;
}
function OnRecvMessage(evt)
{
    var buf = new Uint8Array(evt.data);
    var len = buf.length;
    if (len < 18) return;
    /////
    if (buf[0] == 6  && buf[3]== 2) { // CMD_PARAM and Get Param
        var p = parseParamCmd(buf);
        var d = {};
        d["param"] = p;
        ///
        onParamChange(d);
    }
    else if (buf[0] == 9 && buf[2] == 5 && buf[3] == 1) { // CMD_PROXY and PROXY_METHOD_PUSH_STREAM and query url
        console.log('query stream len='+buf.length );
        var px = parsePushStreamCmd(buf);
        var dd={};
        dd["proxy"] = px;
        ///
        onParamChange(dd);
    }
    else {
        console.log('not process cmd type='+buf[0]);
    }
}

///

})(window);


