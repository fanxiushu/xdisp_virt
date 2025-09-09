@ echo off
%1 %2
mshta vbscript:createobject("shell.application").shellexecute("%~s0","goto :Admin %cd%","","runas",1)(window.close)&goto :eof
:Admin

cd /d %~dp0

rundll32 printui.dll,PrintUIEntry /if /b "xdisp_virt Virtual Easy Printer" /f "easy_printer.inf" /r "FILE:" /m "xdisp_virt Virtual Easy Printer"


pause
