
这是支持 WIN10 1607 之后的 Indirect Display 虚拟显示器驱动。

安装办法：
打开 设备管理器，操作-> 添加过时硬件，一路“下一步”，直到选择从磁盘安装，
进入对应的驱动目录下，选择 indirect_device.inf，
会出现 “Fanxiushu Indirect Display Bus System Device”，安装。
安装之后，会在设备管理器出现一个带感叹号的“Fanxiushu-Indirect-Device1”，
右击，“更新驱动程序”，选择 同样目录下的indirect_display.inf  安装。
安装成功后会在 显示适配器出现 ”Fanxiushu Indirect Display Driver “

驱动签名签名情况：
驱动没做任何签名，如果想要安装成功，需要你自己签名，
或者 按住 Shift + 重启， 进入”配置启动“，选择禁用驱动强制签名。

使用办法：
安装驱动成功之后，运行 indirect_display_plug.exe 模拟插入 虚拟显示器，按照程序指示操作即可。
运行 indirect_display_image 程序截取对应的虚拟显示器的图像并且显示出来，这是一个简单的测试程序。
插入显示器之后，会在系统中出现一个新的虚拟显示器，可以设置成扩展桌面，设置分辨率等。
这时可以使用xdisp_virt或者teamviewer这类支持多显示器功能的远程控制程序来查看操控虚拟显示器桌面。
一定程度上可以代替duetdisplay，DisplayLink，iDIsplay等这类专门实现显示器扩展的软件。

系统支持情况：
目前测试的系统包括：WIN10系统的 1703，1709, 1803, 1809, 1903 。测试的是64位系统，都没有问题。
其中只有 1903 在真实电脑上测试， 其他版本均是在vmware环境中测试。
至于 1607 版本的WIN10，在vmware环境中，测试都是失败的，真机没测试过。
失败现象：调用 IddCxAdapterInitAsync 函数会出现 
Invalid parameter passed to C runtime function 错误，
并且 IddCxAdapterInitAsync 返回 0xC000009A （STATUS_INSUFFICIENT_RESOURCES）错误。
原因暂时不明。

注意事项：
驱动里边设置的最大显示器分辨率是 3840X2160，也就是4K屏，
这要求你的真实显卡需要支持 4K，否则可能会出现一些莫名其妙的问题。

WIN10 1607之前系统如果想要模拟虚拟显示器：
打开控制面板->显示->屏幕分辨率，“更改显示器外观”，选择“检测”，就会出现“未检测到其他显示器”，选中之后，
下面“多显示器”一栏，会出现“依然尝试在以下对象上进行连接：VGA”，选择它，就这样就建立了一个新的虚拟显示器，
当然这个新的显示器是不支持3D加速的。

详情：
https://blog.csdn.net/fanxiushu/article/details/93524220
https://blog.csdn.net/fanxiushu/article/details/106238853

fanxiushu 2019-06-27

===========================================
This is the Indirect Display virtual display driver that supports WIN10 1607.

Installation method:
Open Device Manager, Action -> Add Obsolete Hardware, all the way to "Next" until you choose to install from disk,
Go to the corresponding driver directory and select indirect_device.inf.
“Fanxiushu Indirect Display Bus System Device” will appear.
After installation, a "Fanxiushu-Indirect-Device1" with an exclamation point will appear in the device manager.
Right-click, "Update Driver" and select the indirect_display.inf installation in the same directory.
After the installation is successful, the display adapter will appear "Fanxiushu Indirect Display Driver"

Drive signature signature situation:
The driver does not make any signatures. If you want to install successfully, you need to sign it yourself.
Or Hold Shift + Restart to enter "Configuration Startup" and select Disable Driver Force Signature.

How to use:
After the driver is successfully installed, run indirect_display_plug.exe to simulate inserting the virtual display and follow the program instructions.
Run the indirect_display_image program to capture the image of the corresponding virtual display and display it. This is a simple test program.
Once the monitor is plugged in, a new virtual display will appear in the system, which can be set to expand the desktop, set the resolution, and more.
At this time, you can use the remote control program such as xdisp_virt or teamviewer to support multi-monitor function to view and control the virtual display desktop.
To a certain extent, it can replace the software that specifically implements display expansion such as duetdisplay, DisplayLink, iDIsplay, etc.

System support:
The currently tested systems include: 1703, 1709, 1803, 1809, 1903 of the WIN10 system. The test is a 64-bit system, and there is no problem.
Only 1903 was tested on real computers, and other versions were tested in the vmware environment.
As for the 1607 version of WIN10, in the vmware environment, the test failed, and the real machine has not been tested.
Failure: Calling the IddCxAdapterInitAsync function will appear
Invalid parameter passed to C runtime function error,
And IddCxAdapterInitAsync returns 0xC000009A (STATUS_INSUFFICIENT_RESOURCES) error.
The reason is temporarily unknown.

Before WIN10 1607, if the system wants to simulate a virtual display:
Open Control Panel -> Display -> Screen Resolution, "Change Display Appearance", select "Detect", and "No other monitors will be detected" will appear. After selecting,
In the "Multi-Monitor" column below, you will see "Always try to connect on the following objects: VGA", select it, and you will create a new virtual display.
Of course this new display does not support 3D acceleration.

Details:
Https://blog.csdn.net/fanxiushu/article/details/93524220
https://blog.csdn.net/fanxiushu/article/details/106238853

fanxiushu 2017-2019

