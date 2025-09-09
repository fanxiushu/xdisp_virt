
此目录下的 printer_driver.ini 配置文件配置了如何让第三方虚拟打印驱动接入xdisp_virt程序。
具体配置，可查看里边的注释。

要让printer_driver.ini生效，需要在 xdisp_virt.ini 配置文件中添加 extend_printer_config_path 字段
如下：
;;配置 extend printer driver的配置文件路径,可以是相对xdisp_virt.exe程序的路径 
extend_printer_config_path=../printer_driver/printer_driver.ini


要求第三方虚拟打印驱动能打印到文件，
并且需要能自动打印到打印端口指定的文件，也就是打印途中无弹出选择打印文件的对话框。

同时要求需要有转换程序，把打印文件转成pdf文档(若本身输出的就是pdf文档，则不需要转换程序)。 
比如，如果输出的是标准PCL打印机语言，PostScript, 或者XPS， 都可以使用GhostScript 程序转换。

