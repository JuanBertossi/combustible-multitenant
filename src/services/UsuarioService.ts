import { LocalStorageService } from "./base/CrudService";
import { mockUsuarios } from "../utils/mockData";
import type { UsuarioExtended } from "../types";

class UsuarioService extends LocalStorageService<UsuarioExtended> {
  constructor() {
    super("usuarios_data", mockUsuarios as unknown as UsuarioExtended[]);
  }
}

export const usuarioService = new UsuarioService();
