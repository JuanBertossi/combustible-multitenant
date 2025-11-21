const fs = require('fs');
const path = require('path');

console.log('Iniciando actualizacion multi-tenant...\n');

// Surtidores.tsx
try {
  const surtidoresPath = path.join(__dirname, 'src/pages/Surtidores/Surtidores.tsx');
  let content = fs.readFileSync(surtidoresPath, 'utf8');
  
  // Cambio 1: Agregar import
  content = content.replace(
    'import { useAuth } from "../../hooks/useAuth";',
    'import { useAuth } from "../../hooks/useAuth";\nimport { useTenant } from "../../hooks/useTenant";'
  );
  
  // Cambio 2: Agregar hook
  content = content.replace(
    'export default function Surtidores() {\n  const { user } = useAuth();',
    'export default function Surtidores() {\n  const { user } = useAuth();\n  const { currentTenant } = useTenant();'
  );
  
  // Cambio 3: Actualizar filtrado
  content = content.replace(
    '  const surtidoresPorEmpresa =\n    user?.rol === "SuperAdmin"\n      ? surtidores\n      : surtidores.filter((s) => s.empresaId === user?.empresaId);',
    '  const surtidoresPorEmpresa = surtidores.filter(\n    (s) => s.empresaId === currentTenant?.id\n  );'
  );
  
  // Cambio 4: Actualizar creacion
  content = content.replace(
    '        empresaId: user?.empresaId || 0,\n        empresa: user?.empresaNombre,',
    '        empresaId: currentTenant?.id || 0,\n        empresa: currentTenant?.nombre,'
  );
  
  fs.writeFileSync(surtidoresPath, content, 'utf8');
  console.log('OK: Surtidores.tsx actualizado');
} catch (e) {
  console.log('ERROR en Surtidores.tsx:', e.message);
}

// Tanques.tsx
try {
  const tanquesPath = path.join(__dirname, 'src/pages/Tanques/Tanques.tsx');
  let content = fs.readFileSync(tanquesPath, 'utf8');
  
  content = content.replace(
    'import { useAuth } from "../../hooks/useAuth";',
    'import { useAuth } from "../../hooks/useAuth";\nimport { useTenant } from "../../hooks/useTenant";'
  );
  
  content = content.replace(
    'export default function Tanques() {\n  const { user } = useAuth();',
    'export default function Tanques() {\n  const { user } = useAuth();\n  const { currentTenant } = useTenant();'
  );
  
  content = content.replace(
    ': tanques.filter((t) => t.empresaId === user?.empresaId);',
    '  const tanquesPorEmpresa = tanques.filter(\n    (t) => t.empresaId === currentTenant?.id\n  );'
  );
  
  content = content.replace(
    /empresaId: user\?\.empresaId \|\| 1,/g,
    'empresaId: currentTenant?.id || 0,'
  );
  
  fs.writeFileSync(tanquesPath, content, 'utf8');
  console.log('OK: Tanques.tsx actualizado');
} catch (e) {
  console.log('ERROR en Tanques.tsx:', e.message);
}

// Choferes.tsx
try {
  const choferesPath = path.join(__dirname, 'src/pages/Choferes/Choferes.tsx');
  let content = fs.readFileSync(choferesPath, 'utf8');
  
  content = content.replace(
    'import { useAuth } from "../../hooks/useAuth";',
    'import { useAuth } from "../../hooks/useAuth";\nimport { useTenant } from "../../hooks/useTenant";'
  );
  
  content = content.replace(
    'export default function Choferes() {\n  const { user } = useAuth();',
    'export default function Choferes() {\n  const { user } = useAuth();\n  const { currentTenant } = useTenant();'
  );
  
  content = content.replace(
    ': choferes.filter((c) => c.empresaId === user?.empresaId);',
    '  const choferesPorEmpresa = choferes.filter(\n    (c) => c.empresaId === currentTenant?.id\n  );'
  );
  
  content = content.replace(
    /empresaId: user\?\.empresaId \|\| 0,/g,
    'empresaId: currentTenant?.id || 0,'
  );
  
  fs.writeFileSync(choferesPath, content, 'utf8');
  console.log('OK: Choferes.tsx actualizado');
} catch (e) {
  console.log('ERROR en Choferes.tsx:', e.message);
}

// Eventos.tsx
try {
  const eventosPath = path.join(__dirname, 'src/pages/Eventos/Eventos.tsx');
  let content = fs.readFileSync(eventosPath, 'utf8');
  
  content = content.replace(
    'import { useAuth } from "../../hooks/useAuth";',
    'import { useAuth } from "../../hooks/useAuth";\nimport { useTenant } from "../../hooks/useTenant";'
  );
  
  content = content.replace(
    'export default function Eventos() {\n  const { user } = useAuth();',
    'export default function Eventos() {\n  const { user } = useAuth();\n  const { currentTenant } = useTenant();'
  );
  
  content = content.replace(
    ': eventos.filter((e) => e.empresaId === user?.empresaId);',
    '  const eventosPorEmpresa = eventos.filter(\n    (e) => e.empresaId === currentTenant?.id\n  );'
  );
  
  content = content.replace(
    /empresaId: user\?\.empresaId \|\| 1,/g,
    'empresaId: currentTenant?.id || 0,'
  );
  
  fs.writeFileSync(eventosPath, content, 'utf8');
  console.log('OK: Eventos.tsx actualizado');
} catch (e) {
  console.log('ERROR en Eventos.tsx:', e.message);
}

// Usuarios.tsx
try {
  const usuariosPath = path.join(__dirname, 'src/pages/Usuarios/Usuarios.tsx');
  let content = fs.readFileSync(usuariosPath, 'utf8');
  
  content = content.replace(
    'import { useAuth } from "../../hooks/useAuth";',
    'import { useAuth } from "../../hooks/useAuth";\nimport { useTenant } from "../../hooks/useTenant";'
  );
  
  content = content.replace(
    'export default function Usuarios() {\n  const { user } = useAuth();',
    'export default function Usuarios() {\n  const { user } = useAuth();\n  const { currentTenant } = useTenant();'
  );
  
  content = content.replace(
    ': usuarios.filter((u) => u.empresaId === user?.empresaId);',
    '  const usuariosPorEmpresa = usuarios.filter(\n    (u) => u.empresaId === currentTenant?.id\n  );'
  );
  
  content = content.replace(
    /empresaId: user\?\.empresaId \|\| 1,/g,
    'empresaId: currentTenant?.id || 0,'
  );
  
  content = content.replace(
    /empresaId: user\?\.empresaId,/g,
    'empresaId: currentTenant?.id,'
  );
  
  fs.writeFileSync(usuariosPath, content, 'utf8');
  console.log('OK: Usuarios.tsx actualizado');
} catch (e) {
  console.log('ERROR en Usuarios.tsx:', e.message);
}

console.log('\nCompletado! Verifica los cambios con: git diff');
