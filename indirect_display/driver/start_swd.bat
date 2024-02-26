@ echo off
%1 %2
ver|find "5.">nul&&goto :Admin
mshta vbscript:createobject("shell.application").shellexecute("%~s0","goto :Admin %cd%","","runas",1)(window.close)&goto :eof
:Admin


rundll32.exe %SystemRoot%\system32\drivers\UMDF\indirect_display.dll,rundll32_execute start_swd