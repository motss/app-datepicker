import { property } from 'lit/decorators.js';

import { nullishAttributeConverter } from '../helpers/nullish-attribute-converter.js';
import type { LitConstructor } from '../typings.js';
import type { DatePickerMinMaxProperties, MixinReturnType } from './typings.js';

export const DatePickerMinMaxMixin = <BaseConstructor extends LitConstructor>(
  SuperClass: BaseConstructor
): MixinReturnType<BaseConstructor, DatePickerMinMaxProperties> => {
  class DatePickerMinMaxClass extends SuperClass implements DatePickerMinMaxProperties {

    /**
     * NOTE: `null` or `''` will always reset to the old valid date. In order to reset to MAX_DATE,
     * set `max` undefined.
     */
    @property({ reflect: true, converter: { toAttribute: nullishAttributeConverter } })
    public max?: string;

    /**
     * NOTE: `null` or `''` will always reset to the old valid date. In order to reset to
     * today's date, set `min` undefined.
     */
    @property({ reflect: true, converter: { toAttribute: nullishAttributeConverter } })
    public min?: string;
  }

  return DatePickerMinMaxClass as unknown as MixinReturnType<
    BaseConstructor,
    DatePickerMinMaxProperties
  >;
};
