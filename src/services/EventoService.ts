import { LocalStorageService } from "./base/CrudService";
import { mockEventos } from "../utils/mockData";
import type { EventoExtended } from "../types";

class EventoService extends LocalStorageService<EventoExtended> {
  constructor() {
    super("eventos_data", mockEventos as unknown as EventoExtended[]);
  }
}

export const eventoService = new EventoService();
