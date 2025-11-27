export function getEvidenciasByEvento(eventoId) {
  // Devuelve un array simulado de evidencias
  if (eventoId === 1) return ["foto1.jpg", "audio1.mp3"];
  if (eventoId === 2) return ["foto2.jpg"];
  return [];
}
