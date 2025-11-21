import { LocalStorageService } from "./base/CrudService";
import { mockVehiculos } from "../utils/mockData";
import type { Vehiculo } from "../types";

class VehiculoService extends LocalStorageService<Vehiculo> {
  constructor() {
    super("vehiculos_data", mockVehiculos as Vehiculo[]);
  }

  // Aquí podríamos agregar métodos específicos si fuera necesario
  // Por ejemplo: getByPatente(patente: string)
}

export const vehiculoService = new VehiculoService();
