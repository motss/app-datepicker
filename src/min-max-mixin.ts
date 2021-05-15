import type { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { nullishAttributeConverter } from './helpers/nullish-attribute-converter.js';
import type { Constructor, DatePickerMinMaxInterface, MixinReturnType } from './typings.js';

export const DatePickerMinMaxMixin = <BaseConstructor extends Constructor<LitElement>>(
  SuperClass: BaseConstructor
): MixinReturnType<BaseConstructor, DatePickerMinMaxInterface> => {
  class DatePickerMinMaxElement extends SuperClass {

    @property({ reflect: true, converter: { toAttribute: nullishAttributeConverter } })
    public max?: string;

    @property({ reflect: true, converter: { toAttribute: nullishAttributeConverter } })
    public min?: string;
  }

  return DatePickerMinMaxElement as unknown as MixinReturnType<
    BaseConstructor,
    DatePickerMinMaxInterface
  >;
};
