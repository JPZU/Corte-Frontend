import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import HomeView from "@/views/HomeView.vue";
import UsersView from "@/views/UsersView.vue";
import ClothsView from "@/views/ClothsView.vue";
import ClothsEntryView from "@/views/ClothsEntryView.vue";
import ReferencesView from "@/views/ReferencesView.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/",
    name: "Home",
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: "/users",
    name: "Users",
    component: UsersView,
    meta: {
      requiresAuth: true,
      roles: ["SUPER_ADMIN", "ADMIN", "VIEWER"], // EDITOR no entra aquí
    },
  },
  {
    path: "/cloths",
    name: "Cloths",
    component: ClothsView,
    meta: {
      requiresAuth: true,
      roles: ["SUPER_ADMIN", "ADMIN", "VIEWER", "EDITOR"],
    },
  },
  {
    path: "/cloths-entry",
    name: "ClothsEntry",
    component: ClothsEntryView,
    meta: {
      requiresAuth: true,
      roles: ["SUPER_ADMIN", "ADMIN", "VIEWER", "EDITOR"],
    },
  },
  {
    path: "/references",
    name: "References",
    component: ReferencesView,
    meta: {
      requiresAuth: true,
      roles: ["SUPER_ADMIN", "ADMIN", "VIEWER", "EDITOR"],
    },
  },

  // Puedes ir agregando más rutas aquí
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const { useAuthStore } = await import("@/store/auth");
  const authStore = useAuthStore();

  const isAuthenticated = authStore.isAuthenticated;
  const userRole = authStore.role;

  // Bloquear acceso si no está autenticado
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next("/login");
  }

  // Si está autenticado pero el rol es INACTIVE
  if (userRole === "INACTIVE") {
    authStore.logout();
    return next("/login");
  }

  // Si la ruta define roles permitidos
  const allowedRoles = to.meta.roles as string[] | undefined;
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    const { useToast } = await import("vue-toastification");
    const toast = useToast();
    toast.error("No tienes permiso para acceder a esta página");
    return next("/");
  }

  return next();
});

export default router;
