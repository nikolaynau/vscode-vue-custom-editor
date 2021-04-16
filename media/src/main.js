import { createApp } from 'vue'
import App from './App.vue'
import globalComponents from "./utils/global-components"
import vscode from "./plugins/vscode";

const app = createApp(App);

app.use(globalComponents);
app.use(vscode);

app.mount('#app');
