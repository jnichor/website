$files = @('p028\0.jpg', 'p028\1.jpg', 'p018\1.jpg')
foreach ($f in $files) {
  $p = 'c:\Users\Jesus\OneDrive\Desktop\website\public\products\' + $f
  $bytes = [System.IO.File]::ReadAllBytes($p) | Select-Object -First 32
  $hex = ($bytes | ForEach-Object { $_.ToString('X2') }) -join ' '
  $ascii = -join ($bytes | ForEach-Object {
    if ($_ -ge 32 -and $_ -le 126) { [char]$_ } else { '.' }
  })
  Write-Host "$f"
  Write-Host "  HEX  : $hex"
  Write-Host "  ASCII: $ascii"
  Write-Host ''
}
