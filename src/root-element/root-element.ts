import { LitElement } from 'lit';

import type { CustomEventAction } from '../types.js';
import type { RootElementProperties } from './types.js';

export class RootElement extends LitElement implements RootElementProperties {
  fire<T extends CustomEventAction<string, unknown>>({
    detail,
    type,
  }: T): void {
    this.dispatchEvent(
      new CustomEvent<T['detail']>(type, {
        bubbles: true,
        composed: true,
        detail,
      })
    );
  }

  query<T extends HTMLElement>(selector: string): T | null {
    return this.root.querySelector<T>(selector);
  }

  queryAll<T extends HTMLElement>(selector: string): readonly T[] {
    return Array.from(this.root.querySelectorAll<T>(selector));
  }

  get root(): ShadowRoot {
    return this.shadowRoot as ShadowRoot;
  }
}
