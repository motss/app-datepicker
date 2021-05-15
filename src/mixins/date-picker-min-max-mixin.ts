import type { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import { nullishAttributeConverter } from '../helpers/nullish-attribute-converter.js';
import type { Constructor } from '../typings.js';
import type { DatePickerMinMaxProperties, MixinReturnType } from './typings.js';

export const DatePickerMinMaxMixin = <BaseConstructor extends Constructor<LitElement>>(
  SuperClass: BaseConstructor
): MixinReturnType<BaseConstructor, DatePickerMinMaxProperties> => {
  class DatePickerMinMaxClass extends SuperClass implements DatePickerMinMaxProperties {

    @property({ reflect: true, converter: { toAttribute: nullishAttributeConverter } })
    public max?: string;

    @property({ reflect: true, converter: { toAttribute: nullishAttributeConverter } })
    public min?: string;
  }

  return DatePickerMinMaxClass as unknown as MixinReturnType<
    BaseConstructor,
    DatePickerMinMaxProperties
  >;
};
