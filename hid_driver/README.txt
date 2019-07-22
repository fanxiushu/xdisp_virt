这是xdisp_virt对应的HID虚拟鼠标键盘驱动。

安装：
进入对应64位或者32位系统的目录中，运行 install.bat 执行安装。
安装成功后，会在设备管理器中出现 “Fanxiushu Virtual HID Input Device”的 HID设备，
并同时生成一个 HID键盘和两个HID鼠标（相对鼠标和绝对鼠标）。

安装成功后，重启 xdisp_virt.exe程序，就会自动使用驱动键盘和鼠标来代替应用层的模拟输入。

卸载：
进入对应的目录，运行 uninstall.bat执行驱动卸载，卸载前请确保 xdisp_virt.exe不在运行。

驱动没有签名，要正确在64位系统安装，需要你自己签名，或者让系统运行在“禁止驱动强制签名”模式。

这是为某些游戏无法使用应用层的鼠标键盘模拟而添加的驱动。
普通远程控制同样可以使用本驱动.

*******************************************************************
虚拟HID绝对鼠标坐标在多显示器下的修正补丁：
在多显示器环境下，WIN7, WIN8, WIN10 1511 这样的系统中，HID绝对鼠标默认只识别主显示器。
mouse_patch.sys 鼠标过滤驱动解决了此问题，使得HID绝对鼠标能识别所有显示器。
在安装成功上面的虚拟鼠标键盘驱动之后，运行 install_mouse_patch.bat安装。

fanxiushu 2019-04-29 06-30

=========================================
This is the HID virtual mouse and keyboard driver for xdisp_virt.

installation:
Go to the directory corresponding to the 64-bit or 32-bit system and run install.bat to perform the installation.
After the installation is successful, the HID device of “Fanxiushu Virtual HID Input Device” will appear in the device manager.
At the same time, an HID keyboard and two HID mice (relative to the mouse and absolute mouse) are generated.

After the installation is successful, restarting the xdisp_virt.exe program will automatically use the driver keyboard and mouse instead of the application layer's analog input.

Uninstall:
Enter the corresponding directory, run uninstall.bat to perform driver uninstallation, and make sure that xdisp_virt.exe is not running before uninstalling.

The driver does not have a signature. To properly install on a 64-bit system, you need to sign it yourself, or let the system run in the "Forbidden Drive Forced Signature" mode.

This is a driver added for some games that cannot use the application layer's mouse and keyboard emulation.
Ordinary remote control can also use this driver.

************************************************** *****************
Virtual HID absolute mouse coordinates correction patch under multiple monitors:
In a multi-monitor environment, in systems such as WIN7, WIN8, and WIN10 1511, the HID absolute mouse only recognizes the primary display by default.
The mouse_patch.sys mouse filter driver solves this problem, making the HID absolute mouse recognize all displays.
After installing the above virtual mouse and keyboard driver, run install_mouse_patch.bat to install.

fanxiushu 2017-2019
