这是基于windows，macOS，linux等平台的远程桌面控制程序最新版本（版本三）。
提供远程控制，支持摄像头，多路音频，直播推流，
集成各种直播服务端，以及安防监控ONVIF控制协议。
以及能在远程桌面顺畅的观看视频，玩游戏等多媒体娱乐功能。

低版本是在 redhat5 平台下编译，
高版本程序在 CentOS7 平台下编译。
都是X86的CPU，编译成 64位程序。

桌面图像采集基于 X Window，使用XShmGetImage 函数采集。
采集图像的详细介绍查看：
    https://blog.csdn.net/fanxiushu/article/details/103772801

经测试，程序可以在CentOS7，CentOS8，Redhat linux AS7， Ubuntu18，其他同类linux估计也能正常运行。
其中CentOS7和CentOS8，如果按照系统默认启动到图形界面，会采集不到图像，
需先登录到命令行，再运行 startx进入图形界面才能正确采集桌面图像，原因不清楚。
Ubuntu18则无此问题.

之所以要编译成高和低两个版本，是因为在比较老的系统中，
GLIBC版本的原因，高版本 xdisp_virt 无法在老系统中运行，
虽然xdisp_virt编译的时候已经尽最大努力把各种库静态编译进程序，
由于使用了许多开源库，编译环境较复杂，GLIBC实在无法静态编译进去。
因此只好分成高低两个版本，
低版本在redhat5发行版中编译，使用的是 GLIBC2.5, 不支持V4L2摄像头，也不支持10bit的x264编码。
高版本是在CentOS7发行版中编译，使用的是 GLIBC2.17. 

linux下的xdisp_virt程序运行方式：
下载xdisp_virt和xdisp_virt.ini文件到本地电脑某个目录下。
系统登录到桌面图形界面（X Window 图形桌面），然后打开Terminal终端，在终端中运行 xdisp_virt。

不像windows平台下的xdisp_virt，能全程以服务方式运行，并且从启动，登录，重启都能全程控制远程机器。
linux版本的xdisp_virt程序只能系统正常登录到 X Window图形界面，在Terminal终端中运行 xdisp_virt。
目前不能全程自动化，也许以后能解决。

