/// by fanxiushu 2018-08-11 worker for lame encoder

importScripts('jsmp3/lame.min.js')


var sample_rate=48000;

var mp3encoder = null;

var is_little_endian = false; // 是不是小尾序


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

var floatTo16BitPCM = function (input, output, pos) {
    for (var i = 0; i < input.length; i++) {
        var s = Math.max(-1, Math.min(1, input[i]));
        output[i + pos] = (s < 0 ? s * 0x8000 : s * 0x7FFF);
    }
};

/////
var left_sample_length = 0;
var right_sample_length = 0;
var left_sample  = new Int16Array(192 * 1024);
var right_sample = new Int16Array(192 * 1024);

////
function mp3_encode_data(left, right)
{
    var sampleBlockSize = 1152; /// mp3

    ////
    floatTo16BitPCM(left, left_sample, left_sample_length); left_sample_length += left.length;
    floatTo16BitPCM(right, right_sample, right_sample_length); right_sample_length += right.length;
    /////

    var pos = 0;
    while (pos + sampleBlockSize <= left_sample_length) {
        ///
        var leftChunk = left_sample.subarray(pos, pos + sampleBlockSize);
        var rightChunk = right_sample.subarray(pos, pos + sampleBlockSize);

        var mp3data = mp3encoder.encodeBuffer(leftChunk, rightChunk); //console.log('enc len=' + mp3data.length);

        if (mp3data.length > 0) {
            var hdr = new Uint8Array(18 + mp3data.length);
            hdr[0] = 3;  // CMD_AUDIO
            hdr[1] = 0;  // subcmd
            hdr[2] = 5;  // compresstype MP3
            hdr[3] = 0;  // slot index
            hdr[4] = 2;  // channel
            hdr[5] = 16; // bit_rate
            htonl(hdr, 6, parseInt(sample_rate));     // sample rate
            htonl(hdr, 10, parseInt(mp3data.length)); // data length
            hdr.set(new Uint8Array(mp3data), 18);

            postMessage({ type: 'encode', buffer: hdr.buffer }, [hdr.buffer]);
            ////
        }

        /////
        pos += sampleBlockSize;
    }

    if (pos < left_sample_length) {
        var r = left_sample_length - pos;
        for (var i = 0; i < r; ++i) {
            left_sample[i] = left_sample[i + pos];
            right_sample[i] = right_sample[i + pos];
            ///
        }
        left_sample_length = r;
        right_sample_length = r;
    }
    else {
        left_sample_length = 0;
        right_sample_length = 0;
    }

    /////

}

function onMessage(e)
{
    var message = e.data;
    
    ////
    switch (message.type) {
    case 'init':
        var arr32 = new Uint32Array(1);
        arr32[0] = 1; ///
        var arr8 = new Uint8Array(arr32.buffer);
        if (arr8[0] == 1) {
            is_little_endian = true;
        } else {
            is_little_endian = false;
        }
        ////
        sample_rate = message.sample_rate;
        mp3encoder = new lamejs.Mp3Encoder(2, message.sample_rate, 128); ///
        ///
        break;
    case 'deinit':
        mp3encoder = null;
        console.log('** deinit record_worker.');
        break;

    case 'data':
     //   console.log('data, ' + message.left.length);
        var mp3data = mp3_encode_data(message.left, message.right);
        break;
    }

    //////
}

/////
addEventListener('message', onMessage);

