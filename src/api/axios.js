import axios from "axios";

const api = axios.create({
  // URL de tu futuro backend local
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api"
});

export default api;