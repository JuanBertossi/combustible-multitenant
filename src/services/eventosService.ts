import apiClient from "./api/apiClient";
import type { Evento } from "../types";
// 1. Importamos los datos simulados
import { mockEventos } from "../utils/mockData";

interface EventoFilters {
  estado?: string;
  vehiculoId?: number;
  choferId?: number;
  fechaInicio?: string;
  fechaFin?: string;
}

// 2. Bandera global para activar o desactivar la simulación
const IS_MOCKING = true;

// 3. (Opcional) Función para simular la latencia de la red
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const eventosService = {
  getAll: async (filters: EventoFilters = {}): Promise<Evento[]> => {
    // --- INICIO DE SIMULACIÓN ---
    if (IS_MOCKING) {
      console.log("SIMULANDO API (getAll):", { filters });
      await delay(300); // Simula 0.3s de espera

      // Lógica de filtrado simulada (igual a la que haría el backend)
      let eventosFiltrados = mockEventos;
      // El filtro por empresaId ahora se hace automáticamente por el interceptor en modo real
      if (filters.estado) {
        eventosFiltrados = eventosFiltrados.filter(
          (e) => e.estado === filters.estado
        );
      }
      if (filters.vehiculoId) {
        eventosFiltrados = eventosFiltrados.filter(
          (e) => e.vehiculoId === filters.vehiculoId
        );
      }
      // (Puedes agregar más lógica de filtro para fechas aquí)

      return Promise.resolve([...eventosFiltrados]); // Devuelve una copia
    }
    // --- FIN DE SIMULACIÓN ---

    // Código original (se ejecutará si IS_MOCKING = false)
    const response = await apiClient.get<Evento[]>("/eventos", {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: number): Promise<Evento> => {
    // --- INICIO DE SIMULACIÓN ---
    if (IS_MOCKING) {
      console.log(`SIMULANDO API (getById): ${id}`);
      await delay(150);
      const evento = mockEventos.find((e) => e.id === id);

      if (evento) {
        return Promise.resolve({ ...evento }); // Devuelve una copia
      }
      return Promise.reject(new Error(`Evento con id ${id} no encontrado`));
    }
    // --- FIN DE SIMULACIÓN ---

    const response = await apiClient.get<Evento>(`/eventos/${id}`);
    return response.data;
  },

  create: async (data: Partial<Evento>): Promise<Evento> => {
    // --- INICIO DE SIMULACIÓN ---
    if (IS_MOCKING) {
      console.log("SIMULANDO API (create):", data);
      await delay(400);

      // Simula la creación de un nuevo evento
      const newId = Math.max(...mockEventos.map((e) => e.id)) + 1;
      const nuevoEvento: Evento = {
        // Datos del formulario primero
        ...(data as Evento),
        // Datos obligatorios que no se sobrescriben
        id: newId,
        fecha: data.fecha || new Date().toISOString(),
        estado: data.estado || "Pendiente",
        empresaId: data.empresaId || 1,
      };

      // Agregamos el nuevo evento a nuestra lista simulada
      mockEventos.push(nuevoEvento);
      return Promise.resolve({ ...nuevoEvento });
    }
    // --- FIN DE SIMULACIÓN ---

    const response = await apiClient.post<Evento>("/eventos", data);
    return response.data;
  },

  validate: async (id: number, data: Partial<Evento>): Promise<Evento> => {
    // --- INICIO DE SIMULACIÓN ---
    if (IS_MOCKING) {
      console.log(`SIMULANDO API (validate): ${id}`);
      await delay(200);
      const evento = mockEventos.find((e) => e.id === id);

      if (evento) {
        evento.estado = "Validado"; // Cambia el estado
        Object.assign(evento, data); // Aplica otros cambios (ej. precio)
        return Promise.resolve({ ...evento });
      }
      return Promise.reject(new Error(`Evento con id ${id} no encontrado`));
    }
    // --- FIN DE SIMULACIÓN ---

    const response = await apiClient.put<Evento>(
      `/eventos/${id}/validar`,
      data
    );
    return response.data;
  },

  reject: async (id: number, motivo: string): Promise<Evento> => {
    // --- INICIO DE SIMULACIÓN ---
    if (IS_MOCKING) {
      console.log(`SIMULANDO API (reject): ${id}`, { motivo });
      await delay(200);
      const evento = mockEventos.find((e) => e.id === id);

      if (evento) {
        evento.estado = "Rechazado"; // Cambia el estado
        // Si tuvieras un campo "motivoRechazo" en el tipo Evento, lo asignarías aquí
        // evento.motivoRechazo = motivo;
        return Promise.resolve({ ...evento });
      }
      return Promise.reject(new Error(`Evento con id ${id} no encontrado`));
    }
    // --- FIN DE SIMULACIÓN ---

    const response = await apiClient.put<Evento>(`/eventos/${id}/rechazar`, {
      motivo,
    });
    return response.data;
  },

  getPending: async (empresaId: number | null = null): Promise<Evento[]> => {
    // --- INICIO DE SIMULACIÓN ---
    if (IS_MOCKING) {
      console.log("SIMULANDO API (getPending):", { empresaId });
      await delay(250);

      // Lógica de filtrado simulada
      let eventosPendientes = mockEventos.filter(
        (e) => e.estado === "Pendiente"
      );

      if (empresaId) {
        eventosPendientes = eventosPendientes.filter(
          (e) => e.empresaId === empresaId
        );
      }

      return Promise.resolve([...eventosPendientes]); // Devuelve una copia
    }
    // --- FIN DE SIMULACIÓN ---

    const params = empresaId
      ? { empresaId, estado: "Pendiente" }
      : { estado: "Pendiente" };
    const response = await apiClient.get<Evento[]>("/eventos", { params });
    return response.data;
  },
};
