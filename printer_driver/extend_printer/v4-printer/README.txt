进入 driver 目录，运行 install_printer.cmd 脚本安装 V4 Virtual Printer 驱动。

注意：WIN10以上系统，驱动需要正确签名才能安装成功，
或者让windows进入禁止驱动签名模式。
V4驱动需要WIN10以上系统才支持。

驱动直接从 WDK10 的例子代码中编译生成的，没做任何修改，
具体例子是 print\v4PrintDriverSamples\v4PrintDriver-HostBasedSampleDriver

converter 目录里边的是转换程序gxpswin32.exe，程序来源于 GhostScript 开源程序，
xps2pdf.bat 脚本调用 gxpswin32.exe 转换 XPS文档 为PDF文档，bat输入两个参数，具体可查看bat脚本详情。

v4PrintDriver-HostBasedSampleDriver.zip 压缩包是此驱动的源码，直接从 WDK10的实例代码复制的，没做任何修改。

至于如何接入xdisp_virt.exe程序，可查阅 printer_driver\printer_driver-v4.ini 配置文件。
注意：如果要生效，需要在 xdisp_virt.ini 配置文件中添加extend_printer_config_path，并且设置正确的printer_driver-v4.ini路径




