import type {
  Evento,
  Evidencia,
  PoliticaCombustible,
  UmbralVehiculo,
} from "../types/reports";
import { mockVehiculos } from "./mockData";

/**
 * Resultado de validación de un evento
 */
export interface ValidationResult {
  valido: boolean;
  errores: ValidationError[];
  advertencias: ValidationWarning[];
}

export interface ValidationError {
  tipo: "evidencia" | "litros" | "umbral" | "duplicado" | "geolocation";
  mensaje: string;
  severidad: "alta" | "media" | "baja";
}

export interface ValidationWarning {
  tipo: "desvio" | "tiempo" | "eficiencia";
  mensaje: string;
}

/**
 * Valida un evento contra las políticas de la empresa y umbrales del vehículo
 */
export function validarEventoConPoliticas(
  evento: Evento,
  evidencias: Evidencia[],
  politica: PoliticaCombustible,
  umbral?: UmbralVehiculo
): ValidationResult {
  const errores: ValidationError[] = [];
  const advertencias: ValidationWarning[] = [];

  // ============================================
  // 1. Validar Evidencias Fotográficas
  // ============================================

  if (politica.evidenciasFotograficas.surtidor) {
    const tieneFotoSurtidor = evidencias.some((e) => e.tipo === "foto-surtidor");
    if (!tieneFotoSurtidor) {
      errores.push({
        tipo: "evidencia",
        mensaje: "Falta evidencia obligatoria: Foto del Surtidor",
        severidad: "alta",
      });
    }
  }

  if (politica.evidenciasFotograficas.cuentaLitros) {
    const tieneFotoCuentaLitros = evidencias.some((e) => e.tipo === "foto-cuenta-litros");
    if (!tieneFotoCuentaLitros) {
      errores.push({
        tipo: "evidencia",
        mensaje: "Falta evidencia obligatoria: Foto del Cuenta-Litros",
        severidad: "alta",
      });
    }
  }

  if (politica.evidenciasFotograficas.odometro) {
    const tieneFotoOdometro = evidencias.some((e) => e.tipo === "foto-odometro");
    if (!tieneFotoOdometro) {
      errores.push({
        tipo: "evidencia",
        mensaje: "Falta evidencia obligatoria: Foto del Odómetro",
        severidad: "media",
      });
    }
  }

  if (politica.evidenciasFotograficas.horometro) {
    const tieneFotoHorometro = evidencias.some((e) => e.tipo === "foto-horometro");
    if (!tieneFotoHorometro) {
      errores.push({
        tipo: "evidencia",
        mensaje: "Falta evidencia obligatoria: Foto del Horómetro",
        severidad: "media",
      });
    }
  }

  // ============================================
  // 2. Validar Evidencia de Audio
  // ============================================

  if (politica.evidenciaAudio) {
    const tieneAudio = evidencias.some((e) => e.tipo === "audio");
    if (!tieneAudio) {
      errores.push({
        tipo: "evidencia",
        mensaje: "Falta evidencia obligatoria: Nota de Voz",
        severidad: "media",
      });
    }
  }

  // ============================================
  // 3. Validar Geolocalización
  // ============================================

  if (politica.geolocalizacionObligatoria) {
    const tieneUbicacion = evidencias.some((e) => e.tipo === "ubicacion");
    if (!tieneUbicacion) {
      errores.push({
        tipo: "geolocation",
        mensaje: "Falta evidencia obligatoria: Geolocalización GPS",
        severidad: "alta",
      });
    } else {
      // Validar geovalla si está configurada
      if (politica.radioGeovallaMetros) {
        const ubicacion = evidencias.find((e) => e.tipo === "ubicacion");
        if (ubicacion?.metadata) {
          // Aquí se podría validar la distancia desde el surtidor
          // Por ahora solo verificamos que tenga coordenadas
          if (!ubicacion.metadata.latitude || !ubicacion.metadata.longitude) {
            errores.push({
              tipo: "geolocation",
              mensaje: "Las coordenadas GPS no son válidas",
              severidad: "alta",
            });
          }
        }
      }
    }
  }

  // ============================================
  // 4. Validar Litros Máximos por Carga
  // ============================================

  if (evento.litros > politica.litrosMaximosPorCarga) {
    errores.push({
      tipo: "litros",
      mensaje: `Excede litros máximos permitidos (${politica.litrosMaximosPorCarga}L). Cargados: ${evento.litros}L`,
      severidad: "alta",
    });
  }

  // ============================================
  // 5. Validar Capacidad del Tanque y Estimar Autonomía
  // ============================================

  if (umbral && umbral.activo) {
    // Obtener el vehículo para validar capacidad del tanque
    const vehiculo = mockVehiculos.find((v) => v.id === evento.vehiculoId);

    if (vehiculo) {
      // Validar que no exceda la capacidad del tanque
      const capacidadTanque = vehiculo.capacidadTanque || vehiculo.capacidad || 0;
      
      if (evento.litros > capacidadTanque) {
        errores.push({
          tipo: "litros",
          mensaje: `La carga (${evento.litros}L) excede la capacidad del tanque (${capacidadTanque}L)`,
          severidad: "alta",
        });
      }

      // Estimar autonomía basada en el consumo promedio
      if (umbral.consumoPromedioEsperado && evento.litros > 0) {
        // Detectar si es vehículo de transporte (L/100km) o maquinaria (L/hora)
        const esMaquinaria = vehiculo.tipo && 
          (vehiculo.tipo.toLowerCase().includes("tractor") ||
           vehiculo.tipo.toLowerCase().includes("sembradora") ||
           vehiculo.tipo.toLowerCase().includes("cosechadora") ||
           vehiculo.tipo.toLowerCase().includes("pulverizadora"));

        if (esMaquinaria) {
          // Para maquinaria: consumo en L/hora
          const horasEstimadas = evento.litros / umbral.consumoPromedioEsperado;
          advertencias.push({
            tipo: "eficiencia",
            mensaje: `Con ${evento.litros}L podrás operar aproximadamente ${horasEstimadas.toFixed(1)} horas`,
          });
        } else {
          // Para vehículos de transporte: consumo en L/100km
          const kmEstimados = (evento.litros / umbral.consumoPromedioEsperado) * 100;
          advertencias.push({
            tipo: "eficiencia",
            mensaje: `Con ${evento.litros}L podrás recorrer aproximadamente ${kmEstimados.toFixed(0)} km`,
          });
        }
      }

      // Advertencia si la carga es muy baja (menos del 20% de la capacidad)
      if (capacidadTanque > 0 && evento.litros < capacidadTanque * 0.2) {
        advertencias.push({
          tipo: "eficiencia",
          mensaje: `Carga baja: solo ${((evento.litros / capacidadTanque) * 100).toFixed(0)}% de la capacidad del tanque`,
        });
      }
    }

    // Validar consumo máximo configurado (si existe)
    if (umbral.consumoMaximoLitros && evento.litros > umbral.consumoMaximoLitros) {
      errores.push({
        tipo: "umbral",
        mensaje: `Excede el límite máximo de carga configurado (${umbral.consumoMaximoLitros}L)`,
        severidad: "alta",
      });
    }
  }

  // ============================================
  // 6. Validaciones Adicionales
  // ============================================

  // Advertencia si los litros son muy bajos (menos de 10L)
  if (evento.litros < 10) {
    advertencias.push({
      tipo: "eficiencia",
      mensaje: `Carga inusualmente baja: ${evento.litros}L`,
    });
  }

  return {
    valido: errores.length === 0,
    errores,
    advertencias,
  };
}

/**
 * Obtiene un color para el badge de severidad
 */
export function getSeveridadColor(severidad: "alta" | "media" | "baja"): string {
  switch (severidad) {
    case "alta":
      return "#ef4444"; // red-500
    case "media":
      return "#f59e0b"; // amber-500
    case "baja":
      return "#3b82f6"; // blue-500
    default:
      return "#6b7280"; // gray-500
  }
}

/**
 * Obtiene un mensaje resumido de validación
 */
export function getResumenValidacion(result: ValidationResult): string {
  if (result.valido) {
    if (result.advertencias.length > 0) {
      return `Válido con ${result.advertencias.length} advertencia(s)`;
    }
    return "Evento válido";
  }

  const erroresAlta = result.errores.filter((e) => e.severidad === "alta").length;
  const erroresMedia = result.errores.filter((e) => e.severidad === "media").length;
  const erroresBaja = result.errores.filter((e) => e.severidad === "baja").length;

  const partes: string[] = [];
  if (erroresAlta > 0) partes.push(`${erroresAlta} crítico(s)`);
  if (erroresMedia > 0) partes.push(`${erroresMedia} moderado(s)`);
  if (erroresBaja > 0) partes.push(`${erroresBaja} menor(es)`);

  return `${result.errores.length} error(es): ${partes.join(", ")}`;
}

/**
 * Determina si un evento debe ser rechazado automáticamente
 */
export function debeRechazarAutomaticamente(result: ValidationResult): boolean {
  // Rechazar si tiene 2 o más errores de severidad alta
  const erroresAlta = result.errores.filter((e) => e.severidad === "alta").length;
  return erroresAlta >= 2;
}
