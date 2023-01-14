import type { InjectionKey } from 'vue';

export const vscodeKey = Symbol(
  import.meta.env.MODE === 'development' ? 'vscode' : ''
) as InjectionKey<VsCodeApi>;
