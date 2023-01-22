import type { InjectionKey } from 'vue';

export const vscodeKey = Symbol(
  import.meta.env.MODE === 'development' || import.meta.env.MODE === 'test'
    ? 'vscode'
    : ''
) as InjectionKey<VsCodeApi>;
