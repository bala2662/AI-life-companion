Dim WshShell, fso, scriptDir, phpBin

Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
WshShell.CurrentDirectory = scriptDir

phpBin = "C:\xampp\php\php.exe"
If Not fso.FileExists(phpBin) Then
    phpBin = "php"
End If

' Kill any lingering PHP servers first
WshShell.Run "taskkill /F /IM php.exe", 0, True
WScript.Sleep 500

' Start PHP built-in server silently in background on port 8000
WshShell.Run Chr(34) & phpBin & Chr(34) & " -S 127.0.0.1:8000 router.php", 0, False

' Wait 1.5 seconds for server to be fully ready
WScript.Sleep 1500

' Open browser to the live application
WshShell.Run "http://127.0.0.1:8000/index.php"
