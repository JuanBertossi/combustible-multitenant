export function validarEventoConPoliticas(
  evento,
  evidencias,
  politica,
  umbral
) {
  // Simulación de validación
  const errores = [];
  const advertencias = [];
  let valido = true;
  if (!evidencias || evidencias.length === 0) {
    errores.push("Faltan evidencias");
    valido = false;
  }
  if (evento.litros > (umbral?.maxLitros ?? 100)) {
    advertencias.push("Litros exceden el umbral");
  }
  return { valido, errores, advertencias };
}

export function getResumenValidacion(result) {
  if (!result) return "Sin validación";
  if (!result.valido) return `${result.errores.length} errores`;
  if (result.advertencias.length) return "Advertencias";
  return "Cumple políticas";
}

export const ValidationResult = {};
