import { property } from "lit/decorators.js";

import { nullishAttributeConverter } from '../helpers/nullish-attribute-converter.js';
import type { LitConstructor, StartView } from '../typings.js';
import type { DatePickerStartViewProperties, MixinReturnType } from './typings.js';

export const DatePickerStartViewMixin = <BaseConstructor extends LitConstructor>(
  SuperClass: BaseConstructor
): MixinReturnType<BaseConstructor, DatePickerStartViewProperties> => {
  class DatePickerMixinClass extends SuperClass implements DatePickerStartViewProperties {
    @property({
      converter: { toAttribute: nullishAttributeConverter },
      reflect: true,
    })
    public startView: StartView = "calendar";
  }

  return DatePickerMixinClass as unknown as MixinReturnType<
    BaseConstructor,
    DatePickerStartViewProperties
  >;
};
