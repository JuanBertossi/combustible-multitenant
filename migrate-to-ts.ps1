# Script para migrar archivos de .jsx/.js a .tsx/.ts

Write-Host "Iniciando migración de archivos a TypeScript..." -ForegroundColor Green

# Renombrar main.jsx a main.tsx
Write-Host "Renombrando main.jsx..." -ForegroundColor Yellow
Rename-Item -Path "src\main.jsx" -NewName "main.tsx" -ErrorAction SilentlyContinue

# Renombrar App.jsx a App.tsx
Write-Host "Renombrando App.jsx..." -ForegroundColor Yellow
Rename-Item -Path "src\App.jsx" -NewName "App.tsx" -ErrorAction SilentlyContinue

# Hooks
Write-Host "Renombrando hooks..." -ForegroundColor Yellow
Get-ChildItem -Path "src\hooks" -Filter "*.js" -ErrorAction SilentlyContinue | ForEach-Object {
    Rename-Item $_.FullName -NewName ($_.Name -replace '\.js$', '.ts')
}
Get-ChildItem -Path "src\hooks" -Filter "*.jsx" -ErrorAction SilentlyContinue | ForEach-Object {
    Rename-Item $_.FullName -NewName ($_.Name -replace '\.jsx$', '.tsx')
}

# Context
Write-Host "Renombrando archivos de context..." -ForegroundColor Yellow
Get-ChildItem -Path "src\context" -Filter "*.js" -ErrorAction SilentlyContinue | ForEach-Object {
    Rename-Item $_.FullName -NewName ($_.Name -replace '\.js$', '.ts')
}
Get-ChildItem -Path "src\context" -Filter "*.jsx" -ErrorAction SilentlyContinue | ForEach-Object {
    Rename-Item $_.FullName -NewName ($_.Name -replace '\.jsx$', '.tsx')
}

# Components (recursivo)
Write-Host "Renombrando componentes..." -ForegroundColor Yellow
Get-ChildItem -Path "src\components" -Recurse -Filter "*.jsx" -ErrorAction SilentlyContinue | ForEach-Object {
    Rename-Item $_.FullName -NewName ($_.Name -replace '\.jsx$', '.tsx')
}
Get-ChildItem -Path "src\components" -Recurse -Filter "*.js" -ErrorAction SilentlyContinue | ForEach-Object {
    Rename-Item $_.FullName -NewName ($_.Name -replace '\.js$', '.ts')
}

# Pages (recursivo)
Write-Host "Renombrando páginas..." -ForegroundColor Yellow
Get-ChildItem -Path "src\pages" -Recurse -Filter "*.jsx" -ErrorAction SilentlyContinue | ForEach-Object {
    Rename-Item $_.FullName -NewName ($_.Name -replace '\.jsx$', '.tsx')
}
Get-ChildItem -Path "src\pages" -Recurse -Filter "*.js" -ErrorAction SilentlyContinue | ForEach-Object {
    Rename-Item $_.FullName -NewName ($_.Name -replace '\.js$', '.ts')
}

# Utils (ya deberían estar convertidos)
Write-Host "Verificando archivos de utils..." -ForegroundColor Yellow
Get-ChildItem -Path "src\utils" -Filter "*.js" -ErrorAction SilentlyContinue | ForEach-Object {
    Rename-Item $_.FullName -NewName ($_.Name -replace '\.js$', '.ts')
}

Write-Host "Migración de nombres de archivos completada!" -ForegroundColor Green
Write-Host "Ahora actualiza las importaciones en los archivos." -ForegroundColor Cyan
