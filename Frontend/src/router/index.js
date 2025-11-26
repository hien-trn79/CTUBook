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
import UserAdminDetail from "@/components/admin/UserProfile.admin.vue";
import UpdateUserAdmin from "@/components/admin/UpdateUser.admin.vue";

// utils
import { isLoggedIn, getCurrentUser, getCurrentAdmin } from "@/utils/auth.util";

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
            path: "",
            component: UserAdminDetail,
          },
          {
            path: "updateAdmin",
            component: UpdateUserAdmin,
          },
          {
            path: "edit",
            component: UpdateBookAdmin,
          },
        ],
      },
    ],

    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
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

// Bodyguard route
router.beforeEach((to, from, next) => {
  const currentAdmin = getCurrentAdmin();
  const tokenAdmin = localStorage.getItem("authTokenAdmin");
  const tokenUser = localStorage.getItem("authToken");

  if (to.path.startsWith("/admin")) {
    if (tokenAdmin) {
      next(); // cho phep vao khi co token admin
    } else {
      next("/signin"); // chuyen huong den trang dang nhap
    }
    return;
  }

  // Logic bao ve trang dang nhap
  // if (to.path === "/signin") {
  //   if (tokenAdmin) {
  //     next("/admin");
  //   } else if (tokenUser) {
  //     next("/");
  //   } else {
  //     next(); // cho phep vao trang dang nhap
  //   }
  //   return;
  // }

  // // Neu khong phai trang admin hay dang nhap, cho phep di tiep
  next();
});

export default router;
