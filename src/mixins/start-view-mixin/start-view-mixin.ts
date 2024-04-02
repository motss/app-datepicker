import { property } from 'lit/decorators.js';

import { nullishAttributeConverter } from '../../helpers/nullish-attribute-converter.js';
import type { LitConstructor, StartView } from '../../types.js';
import type { MixinReturnType } from '../types.js';
import type { StartViewMixinProperties } from './types.js';

export const StartViewMixin = <BaseConstructor extends LitConstructor>(
  superClass: BaseConstructor
): MixinReturnType<BaseConstructor, StartViewMixinProperties> => {
  class DatePickerMixinClass
    extends superClass
    implements StartViewMixinProperties
  {
    @property({
      converter: { toAttribute: nullishAttributeConverter },
      reflect: true,
    })
    public startView: StartView = 'calendar';
  }

  return DatePickerMixinClass as unknown as MixinReturnType<
    BaseConstructor,
    StartViewMixinProperties
  >;
};
