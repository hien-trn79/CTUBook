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
import TestMotion from "@/components/TestMotion.vue";

// admin layouts
import BookShowListAdmin from "@/components/admin/BookShowList.admin.vue";
import AdminLayouts from "@/layouts/AdminLayouts.vue";
import BookRequestAdmin from "@/components/admin/BookRequest.admin.vue";
import BookBorrowAdmin from "@/components/admin/BookBorrow.admin.vue";
import BookAccountAdmin from "@/components/admin/BookAccount.admin.vue";
import AddBookAdmin from "@/components/admin/AddBook.admin.vue";
import UpdateBookAdmin from "@/components/admin/UpdateBook.admin.vue";

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
      {
        path: "testMotion",
        component: TestMotion,
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
        redirect: "admin/books",
      },
      {
        path: "books",
        component: BookShowListAdmin,
      },
      {
        path: "request",
        component: BookRequestAdmin,
      },
      {
        path: "borrow",
        component: BookBorrowAdmin,
      },
      {
        path: "account",
        component: BookAccountAdmin,
      },
      {
        path: "addBook",
        component: AddBookAdmin,
      },
      {
        path: ":id",
        children: [
          {
            path: "edit",
            component: UpdateBookAdmin,
          },
        ],
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
