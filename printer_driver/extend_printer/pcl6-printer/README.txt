进入 driver 目录，运行 install_printer.cmd 脚本安装 PCL6 Virtual Printer 驱动。

注意：WIN10以上系统，驱动需要正确签名才能安装成功，
或者让windows进入禁止驱动签名模式。
WIN7以下系统，虽然会弹出驱动签名警告，但是能安装成功。

p6virt_printer.gpd 数据文件直接复制自 WDK7开发包的源码实例：
src\print\mini\MDW\vector\pcl6\p6sample.gpd ，同时增加了彩色打印支持。

converter 目录里边的是转换程序gpcl6win32.exe，程序来源于 GhostScript 开源程序，
pcl2pdf.bat 脚本调用 gpcl6win32.exe 转换 PCL6 为PDF文档，bat输入两个参数，具体可查看bat脚本详情。

至于如何接入xdisp_virt.exe程序，可查阅 printer_driver\printer_driver.ini 配置文件。

