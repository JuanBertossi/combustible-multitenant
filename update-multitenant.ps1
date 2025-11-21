# Script para actualizar páginas con useTenant hook
# Este script agrega el import de useTenant y reemplaza user?.empresaId con currentTenant?.id

$pages = @(
    "src\pages\Surtidores\Surtidores.tsx",
    "src\pages\Tanques\Tanques.tsx",
    "src\pages\Choferes\Choferes.tsx",
    "src\pages\Eventos\Eventos.tsx",
    "src\pages\Usuarios\Usuarios.tsx"
)

foreach ($page in $pages) {
    $fullPath = Join-Path $PSScriptRoot $page
    
    if (Test-Path $fullPath) {
        Write-Host "Procesando: $page" -ForegroundColor Cyan
        
        # Leer contenido
        $content = Get-Content $fullPath -Raw
        
        # 1. Agregar import de useTenant si no existe
        if ($content -notmatch 'useTenant') {
            $content = $content -replace '(import \{ useAuth \} from [^;]+;)', "`$1`nimport { useTenant } from `"../../hooks/useTenant`";"
            Write-Host "  ✓ Agregado import useTenant" -ForegroundColor Green
        }
        
        # 2. Agregar const { currentTenant } = useTenant(); después de useAuth
        if ($content -notmatch 'currentTenant.*useTenant') {
            $content = $content -replace '(const \{ user \} = useAuth\(\);)', "`$1`n  const { currentTenant } = useTenant();"
            Write-Host "  ✓ Agregado hook useTenant" -ForegroundColor Green
        }
        
        # 3. Reemplazar filtrado por empresa
        # Patrón: user?.rol === "SuperAdmin" ? datos : datos.filter((x) => x.empresaId === user?.empresaId)
        $content = $content -replace '(\w+)\s*=\s*user\?\.rol\s*===\s*"SuperAdmin"\s*\?\s*(\w+)\s*:\s*\2\.filter\(\([^)]+\)\s*=>\s*[^.]+\.empresaId\s*===\s*user\?\.empresaId\);', '$1 = $2.filter((x) => x.empresaId === currentTenant?.id);'
        
        # 4. Reemplazar empresaId en creación de objetos
        $content = $content -replace 'empresaId:\s*user\?\.empresaId', 'empresaId: currentTenant?.id'
        
        # 5. Reemplazar empresaNombre
        $content = $content -replace 'empresaNombre:\s*user\?\.empresaNombre', 'empresaNombre: currentTenant?.nombre'
        $content = $content -replace 'empresa:\s*user\?\.empresaNombre', 'empresa: currentTenant?.nombre'
        
        Write-Host "  ✓ Reemplazados filtros y asignaciones" -ForegroundColor Green
        
        # Guardar cambios
        Set-Content $fullPath -Value $content -NoNewline
        Write-Host "  ✓ Archivo actualizado`n" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Archivo no encontrado: $fullPath" -ForegroundColor Red
    }
}

Write-Host "`n✅ Proceso completado!" -ForegroundColor Green
Write-Host "Revisa los cambios con: git diff" -ForegroundColor Yellow
