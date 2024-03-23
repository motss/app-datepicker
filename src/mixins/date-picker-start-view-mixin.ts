import { property } from 'lit/decorators.js';

import { nullishAttributeConverter } from '../helpers/nullish-attribute-converter.js';
import type { LitConstructor, StartView } from '../types.js';
import type {
  DatePickerStartViewProperties,
  MixinReturnType,
} from './types.js';

export const DatePickerStartViewMixin = <
  BaseConstructor extends LitConstructor,
>(
  superClass: BaseConstructor
): MixinReturnType<BaseConstructor, DatePickerStartViewProperties> => {
  class DatePickerMixinClass
    extends superClass
    implements DatePickerStartViewProperties
  {
    @property({
      converter: { toAttribute: nullishAttributeConverter },
      reflect: true,
    })
    public startView: StartView = 'calendar';
  }

  return DatePickerMixinClass as unknown as MixinReturnType<
    BaseConstructor,
    DatePickerStartViewProperties
  >;
};
