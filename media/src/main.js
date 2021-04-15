import { createApp } from 'vue'
import App from './App.vue'
import globalComponents from "./utils/global-components"

const app = createApp(App);

app.use(globalComponents);

app.mount('#app');
