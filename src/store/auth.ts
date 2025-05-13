import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    role: localStorage.getItem("role") || "",
    name: localStorage.getItem("name") || "",
    email: localStorage.getItem("email") || "",
    userId: Number(localStorage.getItem("userId")) || 0, // ✅ nuevo campo
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
      userId,
      role,
      name,
      email,
    }: {
      userId: number;
      role: string;
      name: string;
      email: string;
    }) {
      this.userId = userId;
      this.role = role;
      this.name = name;
      this.email = email;

      localStorage.setItem("userId", userId.toString());
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
