import { createApp } from 'vue'
import App from './App.vue'
import globalComponents from "./utils/global-components"
import vscode from "./plugins/vscode";
import "vscode-codicons/dist/codicon.css";

const app = createApp(App);

app.use(globalComponents);
app.use(vscode);

app.mount('#app');
