import { LocalStorageService } from "./base/CrudService";
import { mockSurtidores } from "../utils/mockData";
import type { SurtidorExtended } from "../types";

class SurtidorService extends LocalStorageService<SurtidorExtended> {
  constructor() {
    super("surtidores_data", mockSurtidores as unknown as SurtidorExtended[]);
  }
}

export const surtidorService = new SurtidorService();
