import { createWebHistory, createRouter } from "vue-router";
import mainPage from "@/layouts/main.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: mainPage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
