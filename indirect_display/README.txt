
这是支持 WIN10 1607 之后的 Indirect Display 虚拟显示器驱动。

安装办法：
打开 设备管理器，操作-> 添加过时硬件，一路“下一步”，直到选择从磁盘安装，
进入对应的驱动目录下，选择 indirect_device.inf，
会出现 “Fanxiushu Indirect Display Bus System Device”，安装。
安装之后，会在设备管理器出现一个带感叹号的“Fanxiushu-Indirect-Device1”，
右击，“更新驱动程序”，选择 同样目录下的indirect_display.inf  安装。
安装成功后会在 显示适配器出现 ”Fanxiushu Indirect Display Driver “

驱动签名签名情况：
驱动没做任何签名，如果想要安装成功，虚拟你自己签名，
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

WIN10 1607之前系统如果想要模拟虚拟显示器：
打开控制面板->显示->屏幕分辨率，“更改显示器外观”，选择“检测”，就会出现“未检测到其他显示器”，选中之后，
下面“多显示器”一栏，会出现“依然尝试在以下对象上进行连接：VGA”，选择它，就这样就建立了一个新的虚拟显示器，
当然这个新的显示器是不支持3D加速的。

详情：
https://blog.csdn.net/fanxiushu/article/details/93524220

fanxiushu 2019-06-27


