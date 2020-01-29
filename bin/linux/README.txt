这是基于windows，macOS，linux等平台的远程桌面控制程序最新版本（版本三）。
提供远程控制，支持摄像头，多路音频，推流，集成各种直播服务端。
以及能在远程桌面顺畅的观看视频，玩游戏等多媒体娱乐功能。

程序在 CentOS7 平台下编译。
桌面图像采集基于 X Window，使用XShmGetImage 函数采集。
采集图像的详细介绍查看：
    https://blog.csdn.net/fanxiushu/article/details/103772801

经测试，程序可以在CentOS7，CentOS8，Redhat linux AS7， Ubuntu18，其他同类linux估计也能正常运行。
其中CentOS7和CentOS8，如果按照系统默认启动到图形界面，会采集不到图像，
需先登录到命令行，再运行 startx进入图形界面才能正确采集桌面图像，原因不清楚。
Ubuntu18则无此问题.

在老版本的linux中也能运行xdisp_virt，比如CentOS6.5，Redhat linux AS6 。
不过需要把GLIBC运行库的版本更新到12.17以上。

linux下的xdisp_virt程序运行方式：
下载xdisp_virt和xdisp_virt.ini文件到本地电脑某个目录下。
系统登录到桌面图形界面（X Window 图形桌面），然后打开Terminal终端，在终端中运行 xdisp_virt。

不像windows平台下的xdisp_virt，能全程以服务方式运行，并且从启动，登录，重启都能全程控制远程机器。
linux版本的xdisp_virt程序只能系统正常登录到 X Window图形界面，在Terminal终端中运行 xdisp_virt。
目前不能全程自动化，也许以后能解决。

