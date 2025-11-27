import { useContext } from "react";

const mockUser = {
  rol: "SuperAdmin",
  empresaId: 1,
  nombre: "Juan Admin",
};

export function useAuth() {
  // Simulación de contexto de usuario
  return { user: mockUser };
}
