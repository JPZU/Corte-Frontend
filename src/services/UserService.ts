import api from "./api";

export async function getAllUsers() {
  const response = await api.get("/users/all");
  return response.data;
}

export async function createUser(data: any) {
  const response = await api.post("/users/create", data);
  return response.data;
}

export async function updateUser(data: any) {
  const response = await api.put("/users/update", data);
  return response.data;
}

export async function deleteUser(id: number) {
  const response = await api.delete(`/users/delete/${id}`);
  return response.data;
}

export async function getUserById(id: number) {
  const response = await api.get(`/users/id/${id}`);
  return response.data;
}

export async function getUserByName(name: string) {
  const response = await api.get(`/users/name/${name}`);
  return response.data;
}

export async function getUserByEmail(email: string) {
  const response = await api.get(`/users/email/${email}`);
  return response.data;
}

export async function getUserByRole(role: string) {
  const response = await api.get(`/users/role/${role}`);
  return response.data;
}
