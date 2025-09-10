进入 driver 目录，运行 install_printer.cmd 脚本安装 Easy Printer 驱动。

注意：WIN10以上系统，驱动需要正确签名才能安装成功，
或者让windows进入禁止驱动签名模式。
WIN7以下系统，虽然会弹出驱动签名警告，但是能安装成功。

Easy Printer只有GPD数据文件和INF配置文件，
xdisp_virt程序会自动配置Easy Printer的打印数据生成到 
c:\ProgramData\xdisp_virt\PrintToFile 文件，
然后xdisp_virt再内部解析此打印文件，并且最终生成PDF文档。

虽然是PDF文档，但所有页面都是JPEG图像 ，JPEG图像压缩质量固定为75%。
也因此即便是纯文本打印，当页数很多的时候，
经过Easy Printer 打印之后，生成的PDF文档也会很大。

可尝试其他两种打印驱动模式。

