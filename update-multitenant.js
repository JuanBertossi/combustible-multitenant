const fs = require('fs');
const path = require('path');

// Archivos a actualizar con sus cambios específicos
const updates = [
  {
    file: 'src/pages/Surtidores/Surtidores.tsx',
    changes: [
      {
        find: 'import { useAuth } from "../../hooks/useAuth";',
        replace: 'import { useAuth } from "../../hooks/useAuth";\nimport { useTenant } from "../../hooks/useTenant";'
      },
      {
        find: 'export default function Surtidores() {\n  const { user } = useAuth();',
        replace: 'export default function Surtidores() {\n  const { user } = useAuth();\n  const { currentTenant } = useTenant();'
      },
      {
        find: '  const surtidoresPorEmpresa =\n    user?.rol === "SuperAdmin"\n      ? surtidores\n      : surtidores.filter((s) => s.empresaId === user?.empresaId);',
        replace: '  const surtidoresPorEmpresa = surtidores.filter(\n    (s) => s.empresaId === currentTenant?.id\n  );'
      },
      {
        find: '        empresaId: user?.empresaId || 0,\n        empresa: user?.empresaNombre,',
        replace: '        empresaId: currentTenant?.id || 0,\n        empresa: currentTenant?.nombre,'
      }
    ]
  },
  {
    file: 'src/pages/Tanques/Tanques.tsx',
    changes: [
      {
        find: 'import { useAuth } from "../../hooks/useAuth";',
        replace: 'import { useAuth } from "../../hooks/useAuth";\nimport { useTenant } from "../../hooks/useTenant";'
      },
      {
        find: 'export default function Tanques() {\n  const { user } = useAuth();',
        replace: 'export default function Tanques() {\n  const { user } = useAuth();\n  const { currentTenant } = useTenant();'
      },
      {
        find: ': tanques.filter((t) => t.empresaId === user?.empresaId);',
        replace: '  const tanquesPorEmpresa = tanques.filter(\n    (t) => t.empresaId === currentTenant?.id\n  );'
      },
      {
        find: 'empresaId: user?.empresaId || 1,',
        replace: 'empresaId: currentTenant?.id || 0,'
      }
    ]
  },
  {
    file: 'src/pages/Choferes/Choferes.tsx',
    changes: [
      {
        find: 'import { useAuth } from "../../hooks/useAuth";',
        replace: 'import { useAuth } from "../../hooks/useAuth";\nimport { useTenant } from "../../hooks/useTenant";'
      },
      {
        find: 'export default function Choferes() {\n  const { user } = useAuth();',
        replace: 'export default function Choferes() {\n  const { user } = useAuth();\n  const { currentTenant } = useTenant();'
      },
      {
        find: ': choferes.filter((c) => c.empresaId === user?.empresaId);',
        replace: '  const choferesPorEmpresa = choferes.filter(\n    (c) => c.empresaId === currentTenant?.id\n  );'
      },
      {
        find: 'empresaId: user?.empresaId || 0,',
        replace: 'empresaId: currentTenant?.id || 0,'
      }
    ]
  },
  {
    file: 'src/pages/Eventos/Eventos.tsx',
    changes: [
      {
        find: 'import { useAuth } from "../../hooks/useAuth";',
        replace: 'import { useAuth } from "../../hooks/useAuth";\nimport { useTenant } from "../../hooks/useTenant";'
      },
      {
        find: 'export default function Eventos() {\n  const { user } = useAuth();',
        replace: 'export default function Eventos() {\n  const { user } = useAuth();\n  const { currentTenant } = useTenant();'
      },
      {
        find: ': eventos.filter((e) => e.empresaId === user?.empresaId);',
        replace: '  const eventosPorEmpresa = eventos.filter(\n    (e) => e.empresaId === currentTenant?.id\n  );'
      },
      {
        find: 'empresaId: user?.empresaId || 1,',
        replace: 'empresaId: currentTenant?.id || 0,'
      }
    ]
  },
  {
    file: 'src/pages/Usuarios/Usuarios.tsx',
    changes: [
      {
        find: 'import { useAuth } from "../../hooks/useAuth";',
        replace: 'import { useAuth } from "../../hooks/useAuth";\nimport { useTenant } from "../../hooks/useTenant";'
      },
      {
        find: 'export default function Usuarios() {\n  const { user } = useAuth();',
        replace: 'export default function Usuarios() {\n  const { user } = useAuth();\n  const { currentTenant } = useTenant();'
      },
      {
        find: ': usuarios.filter((u) => u.empresaId === user?.empresaId);',
        replace: '  const usuariosPorEmpresa = usuarios.filter(\n    (u) => u.empresaId === currentTenant?.id\n  );'
      },
      {
        find: 'empresaId: user?.empresaId || 1,',
        replace: 'empresaId: currentTenant?.id || 0,'
      },
      {
        find: 'empresaId: user?.empresaId,',
        replace: 'empresaId: currentTenant?.id,'
      }
    ]
  }
];

console.log('🚀 Iniciando actualización multi-tenant...\n');

let totalChanges = 0;
let totalFiles = 0;

updates.forEach(({ file, changes }) => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Archivo no encontrado: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let fileChanges = 0;
  
  changes.forEach(({ find, replace }) => {
    if (content.includes(find)) {
      content = content.replace(find, replace);
      fileChanges++;
      totalChanges++;
    }
  });
  
  if (fileChanges > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file} - ${fileChanges} cambio(s) aplicado(s)`);
    totalFiles++;
  } else {
    console.log(`⏭️  ${file} - Sin cambios necesarios`);
  }
});

console.log(`\n🎉 Completado! ${totalChanges} cambios en ${totalFiles} archivos.`);
console.log('\n📝 Próximos pasos:');
console.log('  1. Verificar que la aplicación compile: npm run dev');
console.log('  2. Revisar los cambios: git diff');
console.log('  3. Probar el cambio de tenant en la interfaz');
