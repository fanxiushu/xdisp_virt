
这是基于windows，macOS，linux等平台的远程桌面控制程序最新版本（版本三）。
提供远程控制，支持摄像头，多路音频，推流，集成各种直播服务端。
以及能在远程桌面顺畅的观看视频，玩游戏等多媒体娱乐功能。

被控制端支持的平台包括 windows系列（从 XP，WIN7， WIN8， WIN10），macOS，Linux。
控制端支持原生客户端，也支持网页客户端。
网页客户端支持的浏览器包括Chrome，FireFox，Apple Safari，Microsoft Edge，Opera等具备现代功能的浏览器，
不支持IE以及IE内核浏览器。网页客户端不限平台，几乎所有操作系统平台都支持（包括移动平台和PC平台）。
网络传输既支持不加密的明文传输；也支持SSL加密传输，为数据传输带来安全保证。

软件不链接到某个固定服务器，也不提供自动更新功能。如有需求，请给本人发邮件
fanxiushu@163.com
或者访问相关BLOG:
CSDN: https://blog.csdn.net/fanxiushu
GITHUB: https://github.com/fanxiushu

此程序体积较大，包括多个平台的版本，如果在GITHUB网站下载xdisp_virt困难，可前往CSDN下载：
https://download.csdn.net/download/fanxiushu/12125875  （此CSDN链接只提供到2020-1月份版本，之后的更新版本请从GITHUB下载）
不过如果以后有版本修正，可能还是得从GITHUB下载。

bin目录包含所有执行文件
driver目录是镜像驱动，没有签名。
hid_driver目录是虚拟的HID鼠标键盘驱动，没有签名。
html目录包含所有网页以及javascript脚本，html目录已经被打包进 xdisp_virt.exe程序。
image目录是程序运行的一些效果图。
indirect_display 主要用于WIN10以上平台模拟虚拟显示器。
virtual_camera 把远程xdisp_virt作为音视频输入源，模拟出虚拟摄像头和虚拟麦克风。

程序开始的地方：
一切都是从bin目录下的xdisp_virt.exe程序开始。
把xdisp_virt.exe和xdisp_virt.ini下载到本地任意目录下，然后直接运行按照程序指示操作即可，之后一切都可在浏览器中完成各种配置和远程控制推流等。
当你感觉不错，想进一步使用。
如果你有多台机器想要控制，且都在内网中，你可以下载xdisp_server.exe运行到公网机器中，从而可以对多台内网机器进行集中管理维护。
如果你的电脑比较旧，比如还在运行WINXP系统，可以安装driver目录下的镜像驱动来提升截屏效率。
如果你是远程游戏爱好者，可以安装hid_driver目录下的虚拟鼠标键盘驱动，从而保证全屏游戏能被你远程控制。
如果你喜欢折腾多显示器，喜欢扩展桌面效果，但是身边却没有多余的显示器，你可以折腾indirect_display目录下的驱动。
如果你喜欢把远程桌面或远程摄像头，再次映射成本地摄像头，可以折腾virtual_camera目录下的驱动。

驱动和程序签名情况：
    驱动和应用层程序都没做任何签名，尤其是驱动，如果不签名通常是安装不成功的。
    需要你自己购买驱动签名证书，或者把windows系统设置成禁用驱动签名强制模式。
    大致操作如下：
    WIN7，重启按F8；WIN10 ，按住Shift + 重启。更具体你可以搜索其他相关资料。

程序开发及开放源代码说明：
    xdisp_virt和xdisp_server程序都是使用C/C++语言，VS2015编译生成，所有使用到的开源库均是静态编译进程序。
    CSDN上分享了第一版本的抓屏部分代码，GITHUB分享了xdisp_virt的推流子功能代码stream_push
    （可以推流到RTSP,RTMP服务器或者保存为本地MP4,MKV视频文件）。这里的html目录分享了网页客户端的全部源代码。	
    除此之外，其他源代码并不开源，整套工程源代码也并不出售，以此带来不便敬请谅解。
    （整套程序基本也不会帮忙定制开发，但是驱动部分代码可以出售以及帮忙定制开发，
    比如这里的虚拟鼠标键盘，虚拟摄像头，虚拟显示器等驱动，以及其他类型的驱动程序）
    如有兴趣，也可以参阅发布到CSDN或GITHUB上的其他方面的开源代码。
    同时 xdisp_virt 程序远程图像会有水印，严禁商用。
    目前也无商业化打算，如有此需求请使用其他软件。
                
2020-06月 更新：
1，网页客户端Javascript解码，全部替换成统一使用编译成wasm的ffmpeg，因此能解码xdisp_virt提供的大部分音频和图像。
   这是本次更新的最大改变，以前是不会使用emscripten工具来编译ffmpeg，因此从GITHUB下载了使用了一些已经编译好的wasm解码库，但是解码能力有限。
   此次使用emscripten编译ffmpeg之后，很多以前无法想的都能在网页客户端解码处理了。
   支持xdisp_virt提供的所有AAC,AC3,FLAC,MP2音频格式解码。支持H264，MPEG4，MPEG2，MPEG1,VP8，VP9，H265等图像解码。
   对H264，除了支持Baseline外，还支持Main，High等方式，同时对H264硬编码的解码也不再像以前使用h264bsd（Android上的开源库）那样卡顿。
2，实现桌面图像的滤镜特效，类似Photoshop那样的特效。具体介绍可以查看：
     https://blog.csdn.net/fanxiushu/article/details/106950167
3，可以实时查看当前动态帧率，流量带宽等信息，以及一些其他小功能的增加。

2020-02月 增加虚拟摄像头扩展功能：
  把xdisp_virt提供的音视频数据作为输入源，开发对应的虚拟摄像头驱动和虚拟麦克风驱动，
  从而把远程桌面图像或者远程摄像头，再次映射到本地摄像头中。
    详细信息，请查看：
     https://blog.csdn.net/fanxiushu/article/details/104609499
     
2019-12月 - 2020-1月更新：
1，移植xdisp_virt程序到 macOS，linux平台。
     详细信息，请查看：
        https://blog.csdn.net/fanxiushu/article/details/103428592
        https://blog.csdn.net/fanxiushu/article/details/103529339
        https://blog.csdn.net/fanxiushu/article/details/103662309
        https://blog.csdn.net/fanxiushu/article/details/103772801
2，给xdisp_virt集成RTSP,RTMP,HTTP-FLV,HLS直播服务端功能。
     详细信息，请查看：
        https://blog.csdn.net/fanxiushu/article/details/104078323
3，给xdisp_server.exe服务程序集成了各种直播服务端，这样可以在中转服务器上直播登录上来的各个xdisp_virt被控制端桌面图像。
4，添加手指触摸控制，给移动平台浏览器控制PC提供了方便，不过比起鼠标键盘控制还是不能比较。

2019-6月更新：
   1，优化RGB转YUV代码，使得转换时间更少，转换之后的图像质量更好。
   2，修改HID虚拟鼠标键盘驱动在WIN10 1703,1709版本中蓝屏问题，
         同时修正在多显示器的环境中，HID虚拟绝对鼠标 在WIN7，WIN8，WIN10 1511 这些系统只识别主显示器的问题。
   3，WIN10 1607 之后的系统，增加 Indirect Display驱动添加新的虚拟显示器。

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

2019-01月更新:
    1, 修正网页客户端在最新chrome或firefox中，远程显示窗口不能根据浏览器窗口自动适配问题，
	   问题出在 xdisp_h264.js脚本函数changeCanvasSize中对全屏判断。

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
   11，使用emscripten工具编译ffmpeg成wasm，从而实现javascript网页端音频和图像解码。

远程控制网络带宽占用情况：
   本软件主要是通过对桌面图像压缩成H264， 然后在网络中传输。
   不管是外网环境还是内网环境，根据H264编码的特点，1080P的图像，带宽在 10-20 Mbps 范围内才能让图像达到最优效果。
   因此本软件对弱网环境（不管是内网还是外网，就是网络带宽非常低，小于1Mbps或512Kbps以下，网络延时和断线情况经常发生）并不友好。
   真正要能在弱网中顺畅控制，得使用RDP那样的协议，采用传输绘图命令而不是图像像素，
   但是这对远程游戏或远程视频来说，没有任何帮助，还是得采用类似H264方式压缩传输。
   因此最好的解决办法是把两者结合起来使用。
   但是本软件目前并不打算做绘图命令传输这方面的尝试，因为一是会造成软件更加复杂，二是在网络带宽日益充盈的今天好像也无必要。

原生客户端未发布的的原因，以及网页客户端性能注意问题：

   原生客户端一直都没有发布出来，并不是不存在原生客户端程序，
   而是因为xdisp_virt有许多配置参数，原生客户端都没有去实现，也懒得去开发。
   只实现了核心的远程控制部分，所以属于半成品，况且也只实现了windows平台的原生客户端。
   但是某些要求很高的场所，比如要达到 60 FPS 的远程展现速度，2K，4K桌面远程展现， 
   这样情况下网页客户端运行起来是非常吃力的， 
   即使配置良好的机器运行chrome或firefox来远程控制xdisp_virt机器也比较吃力。
   xdisp_virt程序经过多次改进优化，性能基本能达到比较好的效果。
   比如在很早前的ATOM，N270这样的CPU的上网本中运行WINXP，使用xdisp_virt远程起来都能基本上能用。
   但是这样配置的CPU运行chrome或Firefox都非常吃力，更别说在网页中进行远程控制。
   所以往往造成网页客户端需要的机器配置要比运行xdisp_virt被控制端的还要高。

在多次测试中，基本上总结出两个改进网页客户端性能的问题，
1，不管是chrome或者Firefox或其他现代浏览器，必须开启浏览器中的硬件加速选项(如果显卡不支持浏览器的硬件加速模式那也糟糕)，
   否则不管多强悍的机器，远程起来依然像蜗牛速度一样。
2，网页客户端的显卡支持的最大分辨率达不到被控端分辨率，也会造成网页客户端很慢。
   比如运行chrome网页客户端的设备（包括手机，平板，电脑等）的显卡分辨率最大只能达到 1920X1080， 
   但是被控制端的桌面图像是2560X1600甚至更高， 这种情况下因为网页客户端的显卡无法进行硬件加速，所以速度很慢。
以上就是多次测试总结的，如果使用中或者开发过程中发现其他提升网页客户端的性能的办法，不妨告知。

其他一些注意事项：
1，windows平台如果遇到不能远程控制鼠标键盘，请以服务方式运行程序，并且关闭某些杀毒软件。
   因为应用层模拟鼠标键盘行为，对权限要求高，同时某些杀毒软件会阻止应用层鼠标键盘的模拟。
   如果不想关闭杀毒软件，也不想以服务方式运行，请安装hid_driver目录下的虚拟鼠标键盘驱动，以达到更强的鼠标键盘控制。
2，windows平台要能截取登录界面，以及屏保界面等特殊桌面，以及随电脑启动达到自动控制，必须以服务方式运行程序。
3，linux平台请进入 X Window图形化界面，然后再打开terminal终端再运行xdisp_virt,不要在远程ssh等命令行中运行程序。
   linux和macOS平台目前都不支持随电脑启动等全自动化控制。

相关博客：
https://blog.csdn.net/fanxiushu/article/details/81905680
https://blog.csdn.net/fanxiushu/article/details/78869719

fanxiushu 2017-2020

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

The "driver" directory is mirrored and has no signature.
The "HTML" directory contains all the web pages and JavaScript scripts, 
and the HTML directory has been packed into the xdisp_virt.exe program.
The "image" directory is some effect diagram of the program running.
The "hid_driver" director is a virtual HID mouse keyboard driver with no signature.
"Indirect_display" directory is mainly used to simulate virtual displays on platforms above WIN10.

for detail:
https://blog.csdn.net/fanxiushu/article/details/81905680
https://blog.csdn.net/fanxiushu/article/details/78869719

fanxiushu 2017-2019


