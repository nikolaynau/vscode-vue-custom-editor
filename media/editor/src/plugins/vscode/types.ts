export {};

declare global {
  interface Window {
    acquireVsCodeApi: <T = unknown>() => VsCodeApi<T>;
  }

  interface VsCodeApi<T = unknown> {
    getState: () => T;
    setState: (data: T) => void;
    postMessage: (msg: unknown) => void;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $vscode: VsCodeApi<unknown>;
  }
}
