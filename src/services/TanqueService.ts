import { LocalStorageService } from "./base/CrudService";
import { mockTanques } from "../utils/mockData";
import type { TanqueExtended } from "../types";

class TanqueService extends LocalStorageService<TanqueExtended> {
  constructor() {
    super("tanques_data", mockTanques as unknown as TanqueExtended[]);
  }
}

export const tanqueService = new TanqueService();
