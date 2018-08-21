if (typeof (JsVpx) === "undefined") {
    importScripts('jsvpx.js')
}
///
function onMessage(e) {
    var message = e.data;
    switch (message.type) {
        case 'queueInput':
            var img = decoder.decode(message.data);
            if (!img) break;
            var output = new Uint8Array(img.img_data);
            var crop = { left: 20, top: 10, width: img.d_w + 20, height: img.d_h + 10 };

            postMessage({
                'type': 'pictureReady',
                'width': img.w,
                'height': img.h,
                'croppingParams': crop,
                'data': output.buffer,
            }, [output.buffer]);

            break;
    }
}

////
addEventListener('message', onMessage);
var decoder = new JsVpx();

