$path = "C:\Users\YourUser\Desktop\find-a-decorator-backend"
if (Test-Path $path) {
  try {
    Rename-Item -LiteralPath $path -NewName ($path + ".locked") -ErrorAction Stop
    Write-Output "Renamed locked folder to $path.locked"
  } catch {
    Write-Output "Rename failed, attempting takeown and remove"
    takeown /F $path /R /A
    icacls $path /grant Administrators:F /T
    Remove-Item -LiteralPath $path -Recurse -Force -ErrorAction SilentlyContinue
  }
} else {
  Write-Output "Path not found: $path"
}
