import { emptyReadonlyArray } from '../constants.js';
import type { CustomEventAction, LitConstructor } from '../types.js';
import type { ElementMixinProperties, MixinReturnType } from './types.js';

export const ElementMixin = <BaseConstructor extends LitConstructor>(
  superClass: BaseConstructor
): MixinReturnType<BaseConstructor, ElementMixinProperties> => {
  class ElementMixinClass extends superClass {
    public fire<T extends CustomEventAction<string, unknown>>({
      detail,
      type,
    }: T): void {
      this.dispatchEvent(
        new CustomEvent(type, {
          bubbles: true,
          composed: true,
          detail,
        })
      );
    }

    public query<T extends HTMLElement>(selector: string): T | null {
      return this.root.querySelector(selector) as T;
    }

    public queryAll<T extends HTMLElement>(selector: string): T[] {
      return Array.from(
        this.root.querySelectorAll(selector) ?? emptyReadonlyArray
      );
    }

    public get root(): ShadowRoot {
      return this.shadowRoot as ShadowRoot;
    }
  }

  return ElementMixinClass as unknown as MixinReturnType<
    BaseConstructor,
    ElementMixinProperties
  >;
};
