import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import globalComponents from "./utils/global-components"
import vscode from "./plugins/vscode";
import "@vscode/codicons/dist/codicon.css";

const app = createApp(App);

app.use(router);
app.use(globalComponents);
app.use(vscode);

app.mount('#app');
