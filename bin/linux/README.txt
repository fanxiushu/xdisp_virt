############################################################################
    这是基于windows,macOS,linux等平台的远程桌面控制程序最新版本（版本七）。
    提供核心的远程控制功能，支持摄像头，多路音频，直播推流
    集成各种直播服务端协议，以及安防监控ONVIF控制协议
    集成AirPlay接收端服务，轻松镜像苹果设备（iOS，iPad，macOS）屏幕
    可以投射浏览器摄像头到本程序，同时把视频流模拟成电脑摄像头
    浏览器客户端支持 WebGL，WebRTC，MSE 等多种图像渲染方式
    以及能在远程桌面顺畅的观看视频，玩游戏等多媒体娱乐功能。
############################################################################

【1】编译以及平台兼容性说明：

低版本是在 redhat5 平台下编译，
高版本程序在 CentOS7 平台下编译。
都是X86的CPU，编译成 64位程序。

之所以要编译成高和低两个版本，是因为在比较老的系统中，
GLIBC版本的原因，高版本 xdisp_virt 无法在古老系统中运行，
虽然xdisp_virt编译的时候已经尽最大努力把各种库静态编译进程序，
由于使用了许多开源库，编译环境较复杂，GLIBC实在无法静态编译进去。
因此只好分成高低两个版本，
低版本在redhat5发行版中编译，使用的是 GLIBC2.5, 不支持V4L2摄像头，也不支持10bit的x264编码。
高版本是在CentOS7发行版中编译，使用的是 GLIBC2.17. 

经测试，程序可以在CentOS7，CentOS8，Redhat linux， Ubuntu，
deepin, uos, debain,
其他同类linux也能正常运行，
只要是GLIBC高于2.17（现在的linux发行版都合适），基于X86架构的64位CPU都能正常运行。

正是因为xdsip_virt采用这种静态编译，并且最高的编译版本是CentOS7.
所以xdisp_virt能在目前的绝大部分linux发行版本中运行，
并且并不需要安装各种杂七杂八的依赖库。

【2】运行方式：
程序经过改进后，已经支持 Wayland，Xorg，FrameBuffer 三种截屏方式，
并且都采用动态加载对应采集函数的方式，
也就是不管缺少哪种图像环境，都不会造成程序无法运行，顶多就是无法采集缺少的图像环境而已。

下载xdisp_virt和xdisp_virt.ini文件到Linux系统的本地电脑某个目录下。
然后打开Terminal终端，在终端中运行 xdisp_virt。
也可以SSH远程登录方式来运行xdisp_virt程序。
以 ./xdisp_virt -D ， 带 -D 参数表示直接后台方式运行。
运行之后，打开浏览器（可以是本电脑，也可以是其他设备，只要能正常访问就行）
输入 http://电脑IP:11000，然后进入xdisp_virt.ini 配置WEB页面，
配置好正确的桌面图像采集设备，即可使用。

【3】图像采集方法：

    A）：
     Wayland桌面环境采集：
     采用 pipewire + XDG Desktop Portal 的方式。采集图像详细介绍请查看：
         https://blog.csdn.net/fanxiushu/article/details/160021470?spm=1001.2014.3001.5501
     程序使用 /dev/uinput 作为键鼠设备，如果是以普通用户运行的程序，请 'sudo chmod 666 /dev/uinput' 修改权限。
     如果要以root身份在普通用户环境运行 xdisp_virt， 请正确设置环境变量，比如普通用户是 fxs，如下：
       sudo USER=fxs XDG_RUNTIME_DIR=/run/user/$(id -u fxs) DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/$(id -u fxs)/bus ./xdisp_virt -D
   
    B)：
    Xorg传统桌面的采集：
    使用XShmGetImage 函数。采集图像的详细介绍查看：
         https://blog.csdn.net/fanxiushu/article/details/103772801

    现代的linux系统如果使用Wayland桌面环境，必须首先切换到Xorg才能正确使用Xorg传统采集：
    比如CentOS8系统中 取消注释 /etc/gdm/custom.conf 中的 WaylandEnable=false，
    比如Ubuntu24系统中 取消注释 /etc/gdm3/custom.conf 中的 WaylandEnable=false，
   （ 如此等等，不同版本，对应位置可能有些差别。）修改之后需要重启系统。

     C）：
     不像windows平台下的xdisp_virt，能全程以服务方式运行，并且从启动，登录，重启都能全程控制远程机器。    
     linux版本的xdisp_virt程序目前无法做到像windows版本那种完全自动化，
     并且不同的Linux发行版本的桌面有不同的表现。
     需要使用者自己找办法来让xdisp_virt 开机自动运行并且正常抓屏。

     比如CentOS7系统下，CentOS7因为比较老，没有Wayland，因此默认就是Xorg显示模式。
     而且不论从哪种方式运行xdisp_virt，包括Terminal中运行，SSH远程运行，
     以root方式运行等，以及创建 systemctl 服务，或者配置rc.local开机启动等，
     只要能成功配置 xdisp_virt.ini 中的 X Window 显示设备，都能顺利远控普通登录用户显示界面。
 
     再比如最新版本的Ubuntu26等最新发行版本， 需要严格区分普通用户和root身份，
     以systemctl配置的服务开机启动后，即使配置正确的显示设备，也不一定能采集到屏幕。

     目前尝试能成功的一个方案：
     开机启动： 配置进 /etc/xdg/autostart/ 目录中自动启动，这种情况下，
     再配置Ubuntu26，让它能自动登录到当前用户，这样就能做到xdisp_virt开机自动运行并正常抓屏。

     其他能成功自动启动的方案，请更加不同的linux发行版本，自行去尝试。
