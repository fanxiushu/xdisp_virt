@ echo off
%1 %2
mshta vbscript:createobject("shell.application").shellexecute("%~s0","goto :Admin %cd%","","runas",1)(window.close)&goto :eof
:Admin

cd /d %~dp0

devcon.exe install avstrm_virt.inf "Root\FanxiushuAvStrmBusEnumeratorHwId"

rundll32.exe setupapi.dll,InstallHinfSection DefaultInstall 132 %~dp0\avstrm_virt.inf


pause

