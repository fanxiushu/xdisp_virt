@ echo off
%1 %2
mshta vbscript:createobject("shell.application").shellexecute("%~s0","goto :Admin %cd%","","runas",1)(window.close)&goto :eof
:Admin

cd /d %~dp0

rem ;;;;;

rem ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

rundll32.exe setupapi.dll,InstallHinfSection DefaultUninstall 132 %~dp0\avstrm_virt.inf


rem ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
cd /d %~dp0


pause