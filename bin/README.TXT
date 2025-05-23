#################################################################
        这是基于windows,macOS,linux等平台的远程桌面控制程序最新版本（版本六）。
        提供核心的远程控制功能，支持摄像头，多路音频，直播推流
        集成各种直播服务端协议，以及安防监控ONVIF控制协议
        集成AirPlay接收端服务，轻松镜像苹果设备（iOS，iPad，macOS）屏幕
        可以投射浏览器摄像头到本程序，同时把视频流模拟成电脑摄像头
        集成Web Terminal，支持文件和目录传输
        浏览器客户端支持 WebGL，WebRTC，MSE 等多种图像渲染方式
        以及能在远程桌面顺畅的观看视频，玩游戏等多媒体娱乐功能。
#################################################################

目录包含：
   xdisp_virt.exe程序，xdisp_virt.ini是它的配置文件，
   xdisp_server.exe程序，xdisp_server.ini是它的配置文件。
   dx_hook32.dll, dxhook64.dll是自动注入进每个界面进程挂钩DirectX和OpenGL绘图的动态库。
   配置文件有详细的每个字段说明。
   已经配置成默认设置，可以直接运行exe程序。
   xdisp_server.exe提供了服务器中转解决内网访问等问题, 同时能把多台被控制机器集中到一起，
   对于维护人员来说有一定好处

使用方法：
   把 xdisp_virt.exe， xdisp_virt.ini 复制到本地电脑某个目录下，
   直接运行 xdisp_virt.exe 按照提示使用即可。默认端口是11000，
   可以用浏览器在本地打开 http://localhost:11000 即可进行各种配置， 
   假设运行xdisp_virt的机器是192.168.1.1
   在其他PC，手机，平板等浏览器上打开 http://192.168.1.1:11000 即可远程控制。
   程序运行会生成xdisp_virt.db文件，这是保存各种配置参数和识别不同机器的唯一ID，勿复制此文件到不同的机器。

   把xdisp_server.exe和xdisp_server.ini复制到公网服务器上运行，默认端口32000，
   然后所有xdisp_virt设置连接到运行xdisp_server的服务器，
   假设xdisp_server的机器的公网IP是13.14.15.16
   则在其他PC，手机，平板等浏览器上打开 http://13.14.15.16:32000 就能看到所有连上来的xdisp_virt列表，
   从而可跨越域局域网远程控制。

   如果有必要，可以安装driver目录下的镜像驱动和hid_driver目录下的虚拟鼠标键盘驱动。

2025年01-05月更新：
1，添加了Web Terminal，类似于SSH，TELNET等远端登录功能。
2，支持文件和目录的上传和下载，
      文件上传下载可通过Web Terminal传输，也可以通过xdisp_virt的远程桌面共传输，
      还可以通过专门的页面进行传输。
3，支持文本的复制粘贴。
4，其他小功能的添加，以及某些bug的修改

2024年7-12月更新：
1，添加了把浏览器的摄像头图像传输到xdisp_virt程序的功能。
2，全面修改虚拟摄像头驱动，把虚拟摄像头驱动的功能集成到xdisp_virt程序中，
      其中windows平台提供了虚拟摄像头，虚拟麦克风，虚拟声卡，摄像头过滤等多种功能。
      xdisp_virt任何的图像流，都可以被模拟成虚拟摄像头，
      当然也包括从AirPlay或者浏览器摄像头输入到xdisp_virt的图像流。
      对应的驱动文件在virtual_camera目录中。
      技术细节请查询：
             https://blog.csdn.net/fanxiushu/article/details/140249812?spm=1001.2014.3001.5501
             https://blog.csdn.net/fanxiushu/article/details/144424520?spm=1001.2014.3001.5501
3，其他许多功能的改进与修改，比如增加了A卡的硬编码，
      从而使得三大类Intel，NVIDIA, AMD 显卡都支持硬编码。
      比如修改了图像旋转方式，使得旋转可以只在浏览器端进行，不影响原始图像流。
      以及其他一些细节的修改等。

2024年2-5月更新：
1，添加AirPlay功能，使得苹果设备（iOS苹果手机，iPad，macOS等）
     能轻松的镜像苹果设备的屏幕到xdisp_virt程序，
     并且通过xdisp_virt程序强大的图像延展功能，
     把苹果设备的屏幕通过多种途径共享出去。
     详情可查询：
            https://blog.csdn.net/fanxiushu/article/details/138498255?spm=1001.2014.3001.5502
2，添加模拟蓝牙鼠标和蓝牙键盘的驱动，把电脑模拟成蓝牙鼠标键盘，
     这样通过AirPlay镜像的苹果设备，也能通过蓝牙鼠标键盘被控制。
     需要iOS13以上的苹果手机系统才支持蓝牙鼠标键盘。
     技术细节查询：
            https://blog.csdn.net/fanxiushu/article/details/136735920?spm=1001.2014.3001.5502
            https://blog.csdn.net/fanxiushu/article/details/137010239?spm=1001.2014.3001.5502
            https://blog.csdn.net/fanxiushu/article/details/138161953?spm=1001.2014.3001.5502
     A)，macOS平台因为目前并不熟悉蓝牙的开发，所以没有实现电脑模拟蓝牙鼠标键盘的功能
     B)，windows平台则是需要单独安装驱动，但需要此驱动做破解，这会造成一些未知的麻烦，
            基于此，目前并未公布windows的蓝牙驱动。
     C)，inux下的蓝牙鼠标键盘，则是直接集成到了xdisp_virt程序中，  
            但是需要自己去配置蓝牙服务，具体需要满足以下一些条件： 
           1，当然需要有蓝牙设备这个实物。
           2，需要安装blueZ，linux系统默认都会安装的。
           3，需要xdisp_virt以 root 超级用户方式运行。
           4，bluetoothd 以带参数方式运行： bluetoothd -C -P input
3，增加旋转鼠标坐标和旋转图像等功能，用于方便横竖屏的操作。

2022年10月更新：
1，调整linux平台下x window截屏，使截屏更有效率
2，调整修改包括录制到本地目录，web界面，统计信息等多个小功能，进一步优化调整程序。

2022年7月更新：
1，浏览器webrtc渲染添加 TCP TURN 中转传输，为某些有限制的网络环境使用WebRTC的video标签提供可能。
      详细可查询：
           https://blog.csdn.net/fanxiushu/article/details/125791928?spm=1001.2014.3001.5501
2，可以同时连接到多个xdisp_server中转服务器。

 2022年5月更新：
 1, 改进 Indirect Display驱动，以配置文件方式代替以前的程序“插拔”虚拟显示器，并且提供多种和灵活的显示器分辨率和刷新率。
 
2022年3月更新：
1，添加WebRTC和MSE功能，实现浏览器客户端使用video标签的图像渲染，使得远程桌面图像的显示与原生客户端程序的性能基本一致。
   关于xdisp_virt实现的WebRTC和MSE的功能，可查阅如下连接：
       https://blog.csdn.net/fanxiushu/article/details/122561371?spm=1001.2014.3001.5501
       https://blog.csdn.net/fanxiushu/article/details/123461869?spm=1001.2014.3001.5501
2，Windows平台的 hid_driver 驱动添加虚拟10指触摸屏驱动的功能。
3，linux平台添加了 FrameBuffer 方式截屏，此功能使得登录到纯字符界面的linux系统可以远程桌面控制。
4，远程桌面图像上的水印可以随意拖动。

2021年更新：
1，添加 ONVIF 安防监控控制协议，可以让桌面屏幕录制到NVR设备中。具体详情可以查看如下连接：
     https://blog.csdn.net/fanxiushu/article/details/121011712
2，增加xdisp_virt其他一些小功能，比如截屏，在远程桌面图像中显示当前日期和时间戳，显示采集帧率，CPU占有率等信息。
     进一步增加直播服务端的各种功能，比如完善RTSP服务端协议，录制桌面屏幕到本地目录等。
3，进一步优化xdisp_virt的性能，采集图像和编码图像分成两个线程来处理。windows平台下，Sleep精确睡眠的问题，
      由于windows线程调度的特殊性，通常时间是15毫秒一个Sleep，但是针对60FPS以上的采集率，需要精确到 1 毫秒为单位的线程唤醒。

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
1，新增加了对 主程序 xdisp_virt.exe的xdisp_virt.ini 配置文件，
     可以通过网页方式进行配置，不用再像以前一样非得打开xdisp_virt.ini文件来做配置。

2，把 DirectX HOOK 动态库打包进 xdisp_virt.exe 程序中，
      在配置 启动DXHOOK的情况下，会自动从程序释放出 dx_hook32.dll和dx_hook64.dll动态库。

3,  进一步优化采集时间间隔，使用NtSetTimerResolution 把系统时间精度设置最大，从而确保Sleep精确睡眠，
     保证图像采集间隔尽量精确。尤其针对这对 60 FPS这样的高采集率。
     不过网页客户端本身的资源消耗挺大，可能无法承受高采集率，需使用性能良好的网页客户端或者使用原生客户端。

2019-4月新增功能：

1, 支持多显示器远程控制，可以把多个显示合并到一起或者单独显示。
     在xdisp_virt.ini配置文件中，添加
     multi_display_supported=2 即可支持多显示器远程控制。

2，在WIN7等平台，增加 DirectX HOOK 方式截取全屏独占程序。
     在xdisp_virt.ini配置文件中，添加
     fulld3d_supported=aero, true_full, uwp 
     即可支持DirectX Hook截取独占全屏，dx_hook32.dll和  dx_hook64.dll会被注入所有界面程序中。
     dll动态库是依靠系统自带的 rundll32.exe 来运行。
     目前测试的程序包括WIN7中的Windows Media Center，
     极品飞车17，极品飞车18, 极品飞车6（热力追踪2）， CS1.6， CrossFire，鬼泣2，古墓丽影8，
     生化危机5，正当防卫2，暗黑地牢，魔兽争霸3之冰封王座，英雄联盟
     由于游戏实在太多，无法都做测试，而且测试的时候基本上是不超过10分钟就退出，不清楚长久运行之后的稳定如何。
     如果使用中，影响到你的程序，或者出现程序莫名的崩溃。
     请屏蔽  fulld3d_supported 配置字段，并重启xdisp_virt程序或者重启系统。
     如果愿意，可以告诉我崩溃程序。
     
     详细信息，请查看：
     https://blog.csdn.net/fanxiushu/article/details/89363222
     https://blog.csdn.net/fanxiushu/article/details/89426367

3，增加虚拟的HID鼠标键盘驱动来代替原来的应用层鼠标键盘控制，
   安装hid_driver目录中对应的驱动，然后重启xdisp_virt程序，就会自动切换到虚拟鼠标键盘驱动控制。
   这是为某些全屏游戏无法通过应用层模拟鼠标键盘控制而增加的功能。

 fanxiushu 2017-2019

=======================================
The directory contains:
   The xdisp_virt.exe program, xdisp_virt.ini is its configuration file.
   The xdisp_server.exe program, xdisp_server.ini, is its configuration file.
   Dx_hook32.dll, dxhook64.dll is a dynamic library that automatically injects into each interface process hooking DirectX and OpenGL drawing.
   The configuration file has detailed descriptions of each field.
   Already configured as the default, you can run the exe program directly.
   Xdisp_server.exe provides server relay to solve problems such as intranet access, and can bring together multiple controlled machines.
   There are certain benefits for maintenance personnel

Instructions:
   Copy xdisp_virt.exe, xdisp_virt.ini to a directory on your local computer.
   Run xdisp_virt.exe directly as prompted. The default port is 11000.
   You can do various configurations by opening http://localhost:11000 locally with your browser.
   Suppose the machine running xdisp_virt is 192.168.1.1
   Open http://192.168.1.1:11000 on other PCs, mobile phones, tablets and other browsers to remotely control.
   The program will generate the xdisp_virt.db file, which is the unique ID for saving various configuration parameters and identifying different machines. Do not copy this file to a different machine.

   Copy xdisp_server.exe and xdisp_server.ini to the public network server, the default port is 32000.
   Then all xdisp_virt settings are connected to the server running xdisp_server.
   Suppose the public network IP of the xdisp_server machine is 13.14.15.16
   Then open http://13.14.15.16:32000 on other PCs, mobile phones, tablets and other browsers to see all the xdisp_virt lists that are connected.
   This allows remote control across domain LANs.

   If necessary, you can install the mirror driver in the driver directory and the virtual mouse and keyboard driver in the hid_driver directory.

fanxiushu 2017-2019