@ echo off
%1 %2
mshta vbscript:createobject("shell.application").shellexecute("%~s0","goto :Admin %cd%","","runas",1)(window.close)&goto :eof
:Admin

cd /d %~dp0


rundll32 printui.dll,PrintUIEntry /if /b "xdisp_virt Virtual PCL6 Printer" /f "p6virt_printer.inf" /r "FILE:" /m "PCL6 Virtual Printer Mini Driver"

pause
