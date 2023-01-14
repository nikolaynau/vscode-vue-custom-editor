/* eslint-disable @typescript-eslint/no-unused-vars */
export default {
  getState: () => {
    return undefined;
  },
  setState: data => {},
  postMessage: (msg: unknown) => {
    if (import.meta.env.MODE === 'development') {
      console.log('vscode.postMessage:', msg);
    }
  }
} as VsCodeApi;
