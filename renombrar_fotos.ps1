$base = 'C:\Users\ibiza\OneDrive\Desktop\pagina 1\app\public\sucursales'

for ($i = 1; $i -le 19; $i++) {
  $folder = Join-Path $base $i.ToString()
  if (-not (Test-Path $folder)) { Write-Host ("NO EXISTE: " + $i); continue }

  $files = Get-ChildItem $folder -File
  foreach ($f in $files) {
    $newName = $f.Name -replace ' ', '-'
    $newName = $newName -replace '\.jpeg$', '.jpg'
    $newName = $newName.ToLower()
    if ($newName -ne $f.Name) {
      Rename-Item $f.FullName $newName -Force
      Write-Host ($i.ToString() + ": " + $f.Name + " -> " + $newName)
    }
  }
}
Write-Host "Listo!"
