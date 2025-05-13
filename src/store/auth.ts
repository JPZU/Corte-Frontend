import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    role: localStorage.getItem("role") || "",
    name: localStorage.getItem("name") || "",
    email: localStorage.getItem("email") || "",
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    login(token: string) {
      this.token = token;
      localStorage.setItem("token", token);
    },
    setUserData({
      role,
      name,
      email,
    }: {
      role: string;
      name: string;
      email: string;
    }) {
      this.role = role;
      this.name = name;
      this.email = email;

      localStorage.setItem("role", role);
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
    },
    logout() {
      this.token = "";
      this.role = "";
      this.name = "";
      this.email = "";
      localStorage.clear();
    },
  },
});
