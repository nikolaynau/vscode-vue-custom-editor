import { inject } from 'vue';
import { vscodeKey } from './injection-symbols';

export function useVsCode(): VsCodeApi {
  return inject(vscodeKey) as VsCodeApi;
}

export type UseVsCodeReturn = ReturnType<typeof useVsCode>;
