import { createWebHistory, createRouter } from "vue-router";
import mainPage from "@/layouts/main.vue";
import HomePage from "@/layouts/HomePage.vue";
import EventPage from "@/layouts/EventPage.vue";
import Book from "@/layouts/Book.vue";
import CartPage from "@/layouts/Cart.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },
  {
    path: "/home",
    name: "homepage",
    component: HomePage,
  },
  {
    path: "/event",
    name: "event",
    component: EventPage,
  },
  {
    path: "/books",
    name: "books",
    component: Book,
  },
  {
    path: "/cart",
    name: "cart",
    component: CartPage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
