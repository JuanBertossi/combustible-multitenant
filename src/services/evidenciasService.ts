import apiClient from "./api/apiClient";
import type {
  Evidencia,
  EvidenciaUploadRequest,
  EvidenciaUploadResponse,
  TipoEvidencia,
} from "../types/reports";

export const evidenciasService = {
  // Obtener todas las evidencias de un evento
  getByEvento: async (eventoId: number): Promise<Evidencia[]> => {
    const response = await apiClient.get<Evidencia[]>(
      `/evidencias/evento/${eventoId}`
    );
    return response.data;
  },

  // Obtener evidencias por tipo
  getByTipo: async (
    eventoId: number,
    tipo: TipoEvidencia
  ): Promise<Evidencia[]> => {
    const response = await apiClient.get<Evidencia[]>(
      `/evidencias/evento/${eventoId}/tipo/${tipo}`
    );
    return response.data;
  },

  // Upload de evidencia (imagen, audio, etc.)
  upload: async (
    request: EvidenciaUploadRequest
  ): Promise<EvidenciaUploadResponse> => {
    const formData = new FormData();
    formData.append("file", request.file);
    formData.append("eventoId", request.eventoId.toString());
    formData.append("tipo", request.tipo);

    if (request.metadata) {
      formData.append("metadata", JSON.stringify(request.metadata));
    }

    const response = await apiClient.post<EvidenciaUploadResponse>(
      "/evidencias/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Upload múltiple
  uploadMultiple: async (
    eventoId: number,
    files: Array<{ file: File; tipo: TipoEvidencia }>
  ): Promise<EvidenciaUploadResponse[]> => {
    const uploadPromises = files.map((item) =>
      this.upload({
        eventoId,
        tipo: item.tipo,
        file: item.file,
      })
    );

    return Promise.all(uploadPromises);
  },

  // Eliminar evidencia
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/evidencias/${id}`);
  },

  // Obtener URL de descarga
  getDownloadUrl: async (id: number): Promise<string> => {
    const response = await apiClient.get<{ url: string }>(
      `/evidencias/${id}/download-url`
    );
    return response.data.url;
  },

  // Validar evidencia (marcar como revisada)
  validate: async (id: number, validada: boolean): Promise<Evidencia> => {
    const response = await apiClient.patch<Evidencia>(
      `/evidencias/${id}/validate`,
      { validada }
    );
    return response.data;
  },
};
