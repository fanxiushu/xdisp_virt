@ echo off
%1 %2
ver|find "5.">nul&&goto :Admin
mshta vbscript:createobject("shell.application").shellexecute("%~s0","goto :Admin %cd%","","runas",1)(window.close)&goto :eof
:Admin

set ARCHITECTURE=%PROCESSOR_ARCHITECTURE%
if "%ARCHITECTURE%"=="AMD64" (
     cd /d %~dp0\x64
) else if "%ARCHITECTURE%"=="x86" (
     cd /d %~dp0\x86
) else (
     cd /d %~dp0
)


rundll32.exe indirect_display.dll,rundll32_execute install_classics


pause
