import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import { MotionPlugin } from "@vueuse/motion";
import PrimeVue from "primevue/config";

import ToastService from "primevue/toastservice";

// CSS cua primeVue
import Aura from "@primeuix/themes/aura";

const app = createApp(App);

app.use(router);
app.use(MotionPlugin);

// PrimeVue
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      // Tùy chọn theme:
      darkModeSelector: "none", // Đảm bảo theme luôn ở chế độ sáng (nếu không có dark mode)
    },
  },
});
app.use(ToastService);

app.mount("#app");
