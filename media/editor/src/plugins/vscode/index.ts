import type { Plugin, App } from 'vue';
import { vscodeKey } from './injection-symbols';
import vscodeApi from './vscode-api';

export default {
  install(app: App) {
    const vscode =
      import.meta.env.MODE === 'development' &&
      typeof window.acquireVsCodeApi !== 'function'
        ? vscodeApi
        : window.acquireVsCodeApi();

    app.config.globalProperties.$vscode = vscode;
    app.provide(vscodeKey, vscode);
  }
} as Plugin;
