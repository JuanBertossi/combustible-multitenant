import apiClient from "./api/apiClient";
import type { AuthResponse, User } from "../types";

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem("user");
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    const user = authService.getCurrentUser();
    return !!user?.token;
  },
};
