Set WshShell = WScript.CreateObject("WScript.Shell")
strDesktop = WshShell.SpecialFolders("Desktop")
Set oShellLink = WshShell.CreateShortcut(strDesktop & "\AI Life Companion.lnk")
oShellLink.TargetPath = "C:\\Users\\Alswmith S\\OneDrive\\Desktop\\frontend\\AI_Life_Companion_1\\AI_Life_Companion\\start.bat"
oShellLink.WorkingDirectory = "C:\\Users\\Alswmith S\\OneDrive\\Desktop\\frontend\\AI_Life_Companion_1\\AI_Life_Companion"
oShellLink.IconLocation = "C:\\Windows\\System32\\shell32.dll,0"
oShellLink.Save