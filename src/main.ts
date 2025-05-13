import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";

// 👇 Agrega esto
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// Estilos opcionales
import "bootstrap/dist/css/bootstrap.min.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

// 👇 Activa el plugin
app.use(Toast);

app.mount("#app");
