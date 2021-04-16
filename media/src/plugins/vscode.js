export default {
  install(app) {
    const vscode = window?.acquireVsCodeApi?.();
    app.config.globalProperties.$vscode = vscode;
  }
}
