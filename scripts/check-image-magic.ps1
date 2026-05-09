Get-ChildItem -Path 'c:\Users\Jesus\OneDrive\Desktop\website\public\products' -Recurse -File -Filter '*.jpg' | ForEach-Object {
  $bytes = [System.IO.File]::ReadAllBytes($_.FullName) | Select-Object -First 4
  $hex = ($bytes | ForEach-Object { $_.ToString('X2') }) -join ' '
  $type = switch -Wildcard ($hex) {
    '89 50 4E 47*' { 'PNG (mislabeled!)' }
    'FF D8 FF*'    { 'JPEG' }
    '52 49 46 46*' { 'WEBP/RIFF' }
    '47 49 46 38*' { 'GIF' }
    default        { 'UNKNOWN: ' + $hex }
  }
  $rel = $_.FullName.Substring($_.FullName.IndexOf('products'))
  [PSCustomObject]@{ File = $rel; Type = $type }
} | Format-Table -AutoSize | Out-String -Width 200
