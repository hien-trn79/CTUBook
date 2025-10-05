import { createWebHistory, createRouter } from "vue-router";
import HomePage from "@/layouts/HomePage.vue";
import EventPage from "@/layouts/EventPage.vue";
import Book from "@/layouts/BookList.vue";
import CartPage from "@/layouts/Cart.vue";
import SignInpage from "@/layouts/SignIn.vue";

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
  {
    path: "/signIn",
    name: "signIn",
    component: SignInpage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
