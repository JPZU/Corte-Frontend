import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8090/corte-backend/api/v1",
});

export default api;
