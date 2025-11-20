import type { Evidencia } from "../types/reports";

// Mock evidences for demonstration
export const mockEvidencias: Evidencia[] = [
  // Evidencias para Evento 1
  {
    id: 1,
    eventoId: 1,
    tipo: "foto-surtidor",
    url: "https://images.unsplash.com/photo-1545262810-77515befe149?w=800",
    filename: "surtidor_evento1_001.jpg",
    uploadedAt: "2023-02-02T08:05:00Z",
    metadata: {
      width: 1920,
      height: 1080,
    },
  },
  {
    id: 2,
    eventoId: 1,
    tipo: "foto-cuenta-litros",
    url: "https://images.unsplash.com/photo-1621570945002-f4cdd43dbc68?w=800",
    filename: "cuenta_litros_evento1_001.jpg",
    uploadedAt: "2023-02-02T08:06:00Z",
    metadata: {
      width: 1920,
      height: 1080,
    },
  },
  {
    id: 3,
    eventoId: 1,
    tipo: "foto-odometro",
    url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
    filename: "odometro_evento1_001.jpg",
    uploadedAt: "2023-02-02T08:07:00Z",
    metadata: {
      width: 1920,
      height: 1080,
    },
  },
  {
    id: 4,
    eventoId: 1,
    tipo: "audio",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    filename: "nota_voz_evento1.mp3",
    uploadedAt: "2023-02-02T08:08:00Z",
    metadata: {
      duration: 180,
    },
  },
  {
    id: 5,
    eventoId: 1,
    tipo: "ubicacion",
    url: "",
    uploadedAt: "2023-02-02T08:00:00Z",
    metadata: {
      latitude: -31.420083,
      longitude: -64.188776,
      accuracy: 12,
    },
  },

  // Evidencias para Evento 2 (solo algunas)
  {
    id: 6,
    eventoId: 2,
    tipo: "foto-surtidor",
    url: "https://images.unsplash.com/photo-1545262810-77515befe149?w=800",
    filename: "surtidor_evento2_001.jpg",
    uploadedAt: "2023-02-03T09:35:00Z",
    metadata: {
      width: 1920,
      height: 1080,
    },
  },
  {
    id: 7,
    eventoId: 2,
    tipo: "ubicacion",
    url: "",
    uploadedAt: "2023-02-03T09:30:00Z",
    metadata: {
      latitude: -31.421234,
      longitude: -64.189456,
      accuracy: 25,
    },
  },

  // Evidencias para Evento 3
  {
    id: 8,
    eventoId: 3,
    tipo: "foto-surtidor",
    url: "https://images.unsplash.com/photo-1545262810-77515befe149?w=800",
    filename: "surtidor_evento3_001.jpg",
    uploadedAt: "2023-02-06T11:05:00Z",
    metadata: {
      width: 1920,
      height: 1080,
    },
  },
  {
    id: 9,
    eventoId: 3,
    tipo: "foto-cuenta-litros",
    url: "https://images.unsplash.com/photo-1621570945002-f4cdd43dbc68?w=800",
    filename: "cuenta_litros_evento3_001.jpg",
    uploadedAt: "2023-02-06T11:06:00Z",
    metadata: {
      width: 1920,
      height: 1080,
    },
  },
  {
    id: 10,
    eventoId: 3,
    tipo: "foto-horometro",
    url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
    filename: "horometro_evento3_001.jpg",
    uploadedAt: "2023-02-06T11:07:00Z",
    metadata: {
      width: 1920,
      height: 1080,
    },
  },
  {
    id: 11,
    eventoId: 3,
    tipo: "audio",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    filename: "nota_voz_evento3.mp3",
    uploadedAt: "2023-02-06T11:08:00Z",
    metadata: {
      duration: 120,
    },
  },
  {
    id: 12,
    eventoId: 3,
    tipo: "ubicacion",
    url: "",
    uploadedAt: "2023-02-06T11:00:00Z",
    metadata: {
      latitude: -31.418765,
      longitude: -64.187234,
      accuracy: 8,
    },
  },
];

// Helper function para obtener evidencias por evento
export const getEvidenciasByEvento = (eventoId: number): Evidencia[] => {
  return mockEvidencias.filter((e) => e.eventoId === eventoId);
};
