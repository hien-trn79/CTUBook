import { createWebHistory, createRouter } from "vue-router";
// user layout
import UserLayouts from "@/layouts/UserLayouts.vue";
import HomePage from "@/layouts/HomePage.vue";
import EventPage from "@/layouts/EventPage.vue";
import User_BookList from "@/layouts/BookList.user.vue";
import CartPage from "@/layouts/Cart.vue";
import SignInpage from "@/layouts/SignIn.vue";
import UserBookDetail from "@/components/BookDetail.user.vue";
import NotFound from "@/components/NotFound.vue";

// admin layouts
import BookShowListAdmin from "@/components/admin/BookShowList.admin.vue";
import AdminLayouts from "@/layouts/AdminLayouts.vue";

// const routes = [
//   {
//     path: "/",
//     name: "home",
//     component: HomePage,
//   },
//   {
//     path: "/home",
//     name: "homepage",
//     component: HomePage,
//   },
//   {
//     path: "/event",
//     name: "event",
//     component: EventPage,
//   },
//   {
//     path: "/user",
//     children: [
//       {
//         path: "books",
//         component: User_BookList,
//       },
//       {
//         path: "books/:id",
//         component: UserBookDetail,
//       },
//     ],
//   },
//   {
//     path: "/admin",
//     components: {
//       sideBar: BookListAdmin,
//     },
//   },
//   {
//     path: "/cart",
//     name: "cart",
//     component: CartPage,
//   },
//   {
//     path: "/signIn",
//     name: "signIn",
//     component: SignInpage,
//   },

// ];

const routes = [
  // User Routes
  {
    path: "/",
    component: UserLayouts,
    children: [
      {
        path: "",
        redirect: "/home",
      },
      {
        path: "home",
        component: HomePage,
      },
      {
        path: "books",
        component: User_BookList,
      },
      {
        path: "books/:id",
        component: UserBookDetail,
      },
      {
        path: "event",
        component: EventPage,
      },
      {
        path: "cart",
        component: CartPage,
      },
      {
        path: "signIn",
        component: SignInpage,
      },
    ],
  },

  // Admin Routes
  {
    path: "/admin",
    component: AdminLayouts,
    children: [
      {
        path: "",
        component: AdminLayouts,
      },
    ],
  },

  // Not found page
  {
    path: "/:pathMatch(.*)*",
    name: "notdound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
