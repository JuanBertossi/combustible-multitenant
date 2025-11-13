import { createContext } from "react";
import type { User } from "../types";

export interface AuthContextType {
  user: User | null;
  login: () => boolean;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
