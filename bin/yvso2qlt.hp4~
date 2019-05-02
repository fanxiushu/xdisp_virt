目录包含：
   xdisp_virt.exe程序，xdisp_virt.ini是它的配置文件，
   xdisp_server.exe程序，xdisp_server.ini是它的配置文件。
   dx_hook32.dll, dxhook64.dll是自动注入进每个界面进程挂钩DirectX和OpenGL绘图的动态库。
   配置文件有详细的每个字段说明。
   已经配置成默认设置，可以直接运行exe程序。
   xdisp_server.exe提供了服务器中转解决内网访问等问题, 同时能把多台被控制机器集中到一起，
   对于维护人员来说有一定好处

使用方法：
   把 xdisp_virt.exe， xdisp_virt.ini， dx_hook32.dll, dx_hook64.dll复制到本地电脑某个目录下，
   直接运行 xdisp_virt.exe 按照提示使用即可。默认端口是11000，
   
   可以用浏览器在本地打开 http://localhost:11000 即可进行各种配置， 
   假设运行xdisp_virt的机器是192.168.1.1
   在别的机器或者手机或平板浏览器上打开 http://192.168.1.1:11000 即可远程控制。

   把xdisp_server.exe和xdisp_server.ini复制到公网服务器上运行，
   然后所有xdisp_virt设置连接到运行xdisp_server的服务器，即可跨越域局域网远程控制。

   如果有必要，可以安装driver目录下的镜像驱动和hid_driver目录下的虚拟鼠标键盘驱动。


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

 fanxiushu 2019-04-21

     
