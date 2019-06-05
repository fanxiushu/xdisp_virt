
这是基于windows平台的远程桌面控制程序最新版本（版本二）。
提供远程控制，支持摄像头，多路音频，推流，
以及能在远程桌面顺畅的观看视频，玩游戏等多媒体娱乐功能。

被控制端支持的平台包括 windows系列（从 XP，WIN7， WIN8， WIN10）。
控制端支持原生客户端，也支持网页客户端。
网页客户端支持的浏览器包括Chrome，FireFox，Apple Safari，Microsoft Edge，Opera等具备现代功能的浏览器，
不支持IE以及IE内核浏览器。网页客户端不限平台，几乎所有操作系统平台都支持（包括移动平台和PC平台）。
网络传输既支持不加密的明文传输；也支持SSL加密传输，为数据传输带来安全保证。

软件不链接到某个固定服务器，也不提供自动更新功能。如有需求，请给本人发邮件
fanxiushu@163.com
或者访问相关BLOG:
CSDN: https://blog.csdn.net/fanxiushu
GITHUB: https://github.com/fanxiushu

bin目录包含所有执行文件

driver目录是镜像驱动，没有签名。

hid_driver目录是虚拟的HID鼠标键盘驱动，没有签名。

html目录包含所有网页以及javascript脚本，html目录已经被打包进 xdisp_virt.exe程序。

image目录是程序运行的一些效果图。

2019-5月更新：
    1，新增加了对 主程序 xdisp_virt.exe的xdisp_virt.ini 配置文件，可以通过网页方式进行配置，不用再像以前一样非得打开xdisp_virt.ini文件来做配置。
    2，把 DirectX HOOK 动态库打包进 xdisp_virt.exe 程序中，在配置 启动DXHOOK的情况下，会自动从程序释放出 dx_hook32.dll和dx_hook64.dll动态库。
    3,  进一步优化采集时间间隔，使用NtSetTimerResolution 把系统时间精度设置最大，从而确保Sleep精确睡眠，
     保证图像采集间隔尽量精确。尤其针对这对 60 FPS这样的高采集率。
     不过网页客户端本身的资源消耗挺大，可能无法承受高采集率，需使用性能良好的网页客户端或者使用原生客户端。

2019-04 新增功能：
     1，  支持多显示器远程控制，可以把多个显示合并到一起或者单独显示。
     2，  在WIN7，WIN10等平台，增加 DirectX HOOK 方式截取全屏独占程序, 主要目的是为了能在远程控制中玩某些大型的3D全屏独占游戏。
     3，  增加虚拟HID鼠标键盘驱动来代替应用层的鼠标键盘模拟控制，主要目的是为了解决某些游戏无法从应用层模拟鼠标键盘控制。


Bug fixed:
    1, 修正网页客户端在最新chrome或firefox中，远程显示窗口不能根据浏览器窗口自动适配问题，
	   问题出在 xdisp_h264.js脚本函数changeCanvasSize中对全屏判断。2019-01-25

程序开发及开放源代码说明：
	xdisp_virt和xdisp_server程序都是使用C/C++语言，VS2015编译生成，所有使用到的开源库均是静态编译进程序。
	CSDN上分享了第一版本的抓屏部分代码，GITHUB分享了xdisp_virt的推流子功能代码push_stream
	（可以推流到RTSP,RTMP服务器或者保存为本地MP4,MKV视频文件）,
	这里的html目录分享了网页客户端的全部源代码。
	除此之外，其他源代码并不开源，以此带来不便敬请谅解。
   
使用到的开源库如下：
    1，x264和openh264用于图像H264编码。mfx_dispatch和ffmpeg用于H264的Intel显卡的QSV硬编码和Nvidia显卡硬编码。
    2，ffmpeg用于MPEG4，MPEG2，MPEG1编码，以及一些图像和音频转换，rtsp，rtmp推流，以及AAC，FLAC，AC3，MP2等音频编码等。 
    3，libvpx用于VP8和VP9编码和解码。
    4，libjpeg-turbo用于JPEG图像编码和解码，以及RGB和YUV格式转换。
    5，libyuv用于图像快速缩放， 以及RGB与YUV格式转换。
    6，fdk-aac和ffmpeg用于AAC编码，jbig2用于二值图像编码解码。
    7，x265用于H265编码。
    8，zlib,liblzma,lzo用于无损压缩。 
    9，openssl用于网络SSL加密传输。
   10，unqlite对象数据库用于保存配置参数。
   11，jsmpeg和h264bsd，以及一些其他相关js开源库用于网页客户端javascript解码图像和音频。

相关博客：
https://blog.csdn.net/fanxiushu/article/details/81905680
https://blog.csdn.net/fanxiushu/article/details/78869719

=====================================================================
This is the latest version of the remote desktop control program based on the windows platform (version two).
Provide remote control, support camera, multi-channel audio and push flow.
And can watch videos, play games and other multimedia entertainment functions on the remote desktop。

The platform supported by the control end includes windows series (from XP, WIN7, WIN8, WIN10).
The control side supports native clients, and also supports web clients.
Web client-supported browsers include Chrome, FireFox, Apple Safari, Microsoft Edge, Opera and other modern browsers.
IE and IE kernel browser are not supported. Web client is open platform, almost all operating system platforms support (including mobile platforms and PC platforms).
Network transmission not only supports unencrypted plaintext transmission, but also supports SSL encrypted transmission, providing security for data transmission.

The software does not link to a fixed server, nor does it provide automatic update. If there is any need, please send me an email.
Fanxiushu@163.com
Or visit related BLOG:
CSDN: https://blog.csdn.net/fanxiushu
GITHUB: https://github.com/fanxiushu

The bin directory contains the xdisp_virt.exe program, and xdisp_virt.ini is its configuration file.
The xdisp_server.exe program, xdisp_server.ini is its configuration file.
The configuration file has a detailed description of each field.
It has been configured as a default setting to run the EXE program directly.
xdisp_server.exe provides server transit to solve intranet access problems and to bring together multiple controlled machines.
There are certain benefits for maintainers.

The driver directory is mirrored and has no signature.
The HTML directory contains all the web pages and JavaScript scripts, 
and the HTML directory has been packed into the xdisp_virt.exe program.
The image directory is some effect diagram of the program running.

for detail:
https://blog.csdn.net/fanxiushu/article/details/81905680
https://blog.csdn.net/fanxiushu/article/details/78869719

fanxiushu 2017-2018


