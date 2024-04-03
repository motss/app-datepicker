import type { CustomEventAction } from '../types.js';

export interface RootElementProperties {
  fire<T extends CustomEventAction<string, unknown>>(action: T): void;
  query<T extends HTMLElement>(selector: string): T | null;
  queryAll<T extends HTMLElement>(selector: string): readonly T[];
  root: ShadowRoot;
}
