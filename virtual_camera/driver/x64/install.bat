@echo off
mode con lines=30 cols=60
%1 mshta vbscript:CreateObject("Shell.Application").ShellExecute("cmd.exe","/c %~s0 ::","","runas",1)(window.close)&&exit
cd /d "%~dp0"
rem ------------------------

devcon.exe install xcam_stream.inf "*FanxiushuVirtualCameraMicrophone"
pause
