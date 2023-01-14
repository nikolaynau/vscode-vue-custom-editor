import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vscode from './plugins/vscode';
import '@vscode/codicons/dist/codicon.css';
import './assets/main.css';

const app = createApp(App);
app.use(router);
app.use(vscode);
app.mount('#app');
