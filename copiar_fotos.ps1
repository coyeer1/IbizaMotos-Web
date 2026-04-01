$src = 'C:\Users\ibiza\OneDrive\Desktop\sucursales de ibizamotos'
$dst = 'C:\Users\ibiza\OneDrive\Desktop\pagina 1\app\public\sucursales'

$map = @{
  1  = 'cra 7 #25-41 parque lago uribe'
  2  = 'CRA 7 #26-31'
  3  = 'CRA 7  #26-13'
  4  = 'calle 26 # 36-56'
  5  = 'Av Simón bolivar # 20-73 enseguida del frisby la Pradera'
  6  = 'CRA 16 # 41-13'
  7  = 'Calle 17 # 14-32'
  8  = 'Cr 14 # 16 11'
  9  = 'cra 15 No 15-02'
  10 = 'Cra 14 # 16-11'
  11 = 'Cr 6 # 18-32'
  12 = 'Calle 19 # 4 56 esquina'
  13 = 'Cra 8 número 19 07 centro'
  14 = 'Cra 9 # 4-09'
  15 = 'Cra 4 # 14-42 local 8 Eden'
  16 = 'Cra 5 # 12 48'
  17 = 'Carrera 5 # 12-44'
  18 = 'Carrera 2 # 5-63 centro'
  19 = 'Cra7 # 4-46 centro'
}

foreach ($id in $map.Keys) {
  $folder = $map[$id]
  $source = Join-Path $src $folder
  $dest = Join-Path $dst $id.ToString()
  if (Test-Path $source) {
    New-Item -ItemType Directory -Force -Path $dest | Out-Null
    Copy-Item -Path (Join-Path $source '*') -Destination $dest -Recurse -Force
    Write-Host ('OK ' + $id + ': ' + $folder)
  } else {
    Write-Host ('NOT FOUND ' + $id + ': ' + $folder)
  }
}
Write-Host 'Listo!'
