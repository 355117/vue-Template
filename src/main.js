import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router/index.js";
import "normalize.css/normalize.css"
import './assets/css/global.css'

let app = createApp(App)

app.use(router).mount("#app");



