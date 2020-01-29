这是基于windows，macOS，linux等平台的远程桌面控制程序最新版本（版本三）。
提供远程控制，支持摄像头，多路音频，推流，集成各种直播服务端。
以及能在远程桌面顺畅的观看视频，玩游戏等多媒体娱乐功能。

程序在 macOS10.15 平台下编译。
桌面图像采集基于 CoreGraphics，使用CGDisplayStreamCreateWithDispatchQueue函数采集。

经测试，程序可以在macOS 的 10.10， 10.13,  10.15版本的平台中运行，10.14 没测试过，应该也能正常运行。
最低支持10.10 版本。
在10.14，10.15以上会弹出系统鉴权确认框。

macOS下的xdisp_virt程序运行方式：
下载xdisp_virt和xdisp_virt.ini文件到本地电脑某个目录下。
系统登录到桌面图形界面，然后打开Terminal终端，在终端中运行 xdisp_virt。当然直接双击也能运行。
10.14，10.15以上系统中，因为是在Terminal终端中运行，系统鉴权框也是针对Terminal终端。

不像windows平台下的xdisp_virt，能全程以服务方式运行，并且从启动，登录，重启都能全程控制远程机器。
macOS版本的xdisp_virt程序只能系统正常登录到图形界面，在Terminal终端中运行 xdisp_virt。
目前不能全程自动化，也许以后能解决。

                                                                                                     