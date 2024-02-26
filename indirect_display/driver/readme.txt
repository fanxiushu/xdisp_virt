驱动提供了多种安装方式，均使用脚本，
一步就可以完成安装过程，十分方便。

脚本本质是使用系统自带的rundll32.exe程序调用 indirect_display.dll导出的rundll32_execute函数，
IDD驱动文件本身就是一个dll库，因此在里边添加了rundll32_execute函数，用于实现IDD驱动的安装和卸载。

**注意：驱动都需要签名，甚至去做WHQL认证，否则无法安装成功，
             或者让windows 处于禁止驱动签名检测状态下才能安装成功


【1】install_classics.bat 脚本是之前经典的安装方式：
        先安装indirect_device.sys驱动，从而生成一个底层设备，接着在这个底层设备上安装IDD驱动。

此脚本对应的手动安装办法：
       打开 设备管理器，操作-> 添加过时硬件，一路“下一步”，直到选择从磁盘安装，
       进入对应的驱动目录下，选择 indirect_device.inf，
       会出现 “Fanxiushu Indirect Display Bus System Device”，安装。
       安装之后，会在设备管理器出现一个带感叹号的“Fanxiushu-Indirect-Device1”，
       右击，“更新驱动程序”，选择 同样目录下的indirect_display.inf  安装。
       安装成功后会在 显示适配器出现 ”Fanxiushu Indirect Display Driver “

【2】install_swd.bat 脚本是使用windows的SwCreateDevice函数创建一个底层设备，然后在这个设备上安装IDD驱动。
        但是有个缺点，就是系统重启之后，这个底层设备不会重启，
        因此必须重新运行安装，所以可以运行脚本 start_swd.bat 让SWD设备重新启动起来。
        如果嫌每次都手动运行麻烦，可以把这个脚本加到windows的自动启动里。
        同时此种办法也无法保证WIN10的不同版本能正常使用，同样有可能出现IddCxAdapterInitAsync 调用失败的问题。

【3】install_native.bat 脚本是直接安装IDD驱动，
        (只需要 indirect_display.dll, indirect_display.inf, indirect_display.cat 三个文件)
        不再使用indirect_device.sys或者SwCreateDevice创建底层设备。
        这个安装方法在老版本的Win10系统中，都会有问题，基本上WIN10 1909之前都不会成功，

        在把WIN10更新到最新版本，或者WIN11之后，才能使用此脚本安装IDD驱动。

        这应该是微软在最新版本的windows中已经意识到IDD驱动需要额外的底层设备，
        否则IddCxAdapterInitAsync调用会失败的问题，从而解决了这个问题.


**注意：以上三种安装办法中，只有第一种 install_classics.bat 才能确保不同WIN10版本系统都能正常使用，
后两种安装办法无法保证所有WIN10 系统能正常运行。
因此，如果想要保证最大程度的兼容，请尽量使用 install_classics.bat 脚本安装驱动.

如果出现IddCxAdapterInitAsync调用失败，会在 c:\\ProgramData\\indirect_display.err.log 日志文件中打印出来.

remove.bat 脚本卸载驱动，不论之前使用什么安装方式，都会被统一卸载掉
