import { LocalStorageService } from "./base/CrudService";
import { mockChoferes } from "../utils/mockData";
import type { Chofer } from "../types";

class ChoferService extends LocalStorageService<Chofer> {
  constructor() {
    super("choferes_data", mockChoferes);
  }
}

export const choferService = new ChoferService();
