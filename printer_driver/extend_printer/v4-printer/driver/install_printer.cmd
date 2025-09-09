@ echo off
%1 %2
mshta vbscript:createobject("shell.application").shellexecute("%~s0","goto :Admin %cd%","","runas",1)(window.close)&goto :eof
:Admin

cd /d %~dp0



rundll32 printui.dll,PrintUIEntry /if /b "xdisp_virt Virtual V4 Printer" /f "usb_host_based_sample.inf" /r "FILE:" /m "USB Host Based Sample Driver"


pause
