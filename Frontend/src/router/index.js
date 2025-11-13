import { createWebHistory, createRouter } from "vue-router";
// user layout
import UserLayouts from "@/layouts/UserLayouts.vue";
import HomePage from "@/layouts/HomePage.vue";
import HistoryPage from "@/layouts/HistoryPage.vue";
import User_BookList from "@/layouts/BookList.user.vue";
import CartPage from "@/layouts/Cart.vue";
import SignInpage from "@/layouts/SignIn.vue";
import SignUppage from "@/layouts/SignUp.vue";
import UserBookDetail from "@/components/user/BookDetail.user.vue";
import NotFound from "@/components/NotFound.vue";
import TestMotion from "@/components/TestMotion.vue";
import UserProfile from "@/components/user/UserProfile.user.vue";
import UpdateUser from "@/components/user/UpdateUser.user.vue";

// admin layouts
import BookShowListAdmin from "@/components/admin/BookShowList.admin.vue";
import AdminLayouts from "@/layouts/AdminLayouts.vue";
import BookRequestAdmin from "@/components/admin/BookRequest.admin.vue";
import BookBorrowAdmin from "@/components/admin/BookBorrow.admin.vue";
import BookAccountAdmin from "@/components/admin/BookAccount.admin.vue";
import AddBookAdmin from "@/components/admin/AddBook.admin.vue";
import UpdateBookAdmin from "@/components/admin/UpdateBook.admin.vue";
import DashboardAdmin from "@/components/admin/Dashboard.admin.vue";
import { path } from "framer-motion/client";

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
        path: "history",
        component: HistoryPage,
      },
      {
        path: "cart",
        component: CartPage,
      },
      {
        path: "testMotion",
        component: TestMotion,
      },
      {
        path: "user",
        children: [
          {
            path: "",
            component: UserProfile,
          },
          {
            path: ":id",
            component: UserProfile,
          },
          {
            path: ":id/edit",
            component: UpdateUser,
          },
        ],
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
        redirect: "/admin/overview",
      },
      {
        path: "overview",
        component: DashboardAdmin,
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

  // Auth Routes
  {
    path: "/signin",
    name: "signin",
    component: SignInpage,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUppage,
  },

  // Not found page
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: "active",

  // Tu dong cuon len dau trang khi chuyen huong
  scrollBehavior(to, from, savedPosition) {
    // Neu co savedPosition (quay ve/di chuyen), su dung no
    if (savedPosition) {
      return savedPosition;
    }

    // Neu route co hash (neo), cuon toi phan tu mot cach tron ven
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }

    // Default: cuon toi dau trang
    return { left: 0, top: 0, behavior: "smooth" };
  },
});

export default router;
