# Script para actualizar todas las importaciones de .jsx/.js a .tsx/.ts

Write-Host "Actualizando importaciones en archivos TypeScript..." -ForegroundColor Green

# Función para actualizar importaciones en un archivo
function Update-Imports {
    param (
        [string]$FilePath
    )
    
    $content = Get-Content -Path $FilePath -Raw -ErrorAction SilentlyContinue
    
    if ($null -eq $content) {
        return
    }
    
    # Actualizar importaciones .jsx a .tsx
    $content = $content -replace "from ['""](.+?)\.jsx['""]", "from '`$1.tsx'"
    
    # Actualizar importaciones .js a .ts (excepto archivos CSS)
    $content = $content -replace "from ['""](.+?)\.js['""]", "from '`$1.ts'"
    
    # Guardar el archivo
    Set-Content -Path $FilePath -Value $content -NoNewline
}

# Actualizar todos los archivos .ts y .tsx en el proyecto
Write-Host "Procesando archivos..." -ForegroundColor Yellow

Get-ChildItem -Path "src" -Recurse -Include *.ts,*.tsx -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "Actualizando: $($_.FullName)" -ForegroundColor Cyan
    Update-Imports -FilePath $_.FullName
}

Write-Host "Actualización de importaciones completada!" -ForegroundColor Green
