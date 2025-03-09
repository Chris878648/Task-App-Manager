import api from "./api";

// Iniciar sesión
export const login = async (username, password) => {
  try {
    const response = await api.post("/login", { username, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Registrar un nuevo usuario
export const register = async (username, email, password) => {
  try {
    const response = await api.post("/register", { username, email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cerrar sesión
export const logout = async () => {
  try {
    const response = await api.post("/logout");
    return response.data;
  } catch (error) {
    throw error;
  }
};
