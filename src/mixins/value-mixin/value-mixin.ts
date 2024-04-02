import { property, state } from 'lit/decorators.js';

import { PropertyChangeController } from '../../controllers/property-change-controller/property-change-controller.js';
import { toDateString } from '../../helpers/to-date-string.js';
import { toResolvedDate } from '../../helpers/to-resolved-date.js';
import type { LitConstructor } from '../../types.js';
import type { MixinReturnType } from '../types.js';
import type { ValueMixinProperties } from './types.js';

export const ValueMixin = <BaseConstructor extends LitConstructor>(
  superClass: BaseConstructor
): MixinReturnType<BaseConstructor, ValueMixinProperties> => {
  class ValueMixinClass extends superClass implements ValueMixinProperties {
    _ = new PropertyChangeController(this, {
      onUpdate: (oldValue, value) => {
        const whichValue =
          value === null || value === '' ? (oldValue as string) : value;

        this._valueDate = toResolvedDate(whichValue);
        this.value = whichValue;
      },
      order: 'update',
      property: 'value',
    });

    @state() _valueDate: Date = toResolvedDate();

    /**
     * NOTE: `null` or `''` will always reset to the old valid date. In order to reset to
     * today's date, set `value` to `undefined`.
     */
    @property() value = toDateString(toResolvedDate());
  }

  return ValueMixinClass as unknown as MixinReturnType<
    BaseConstructor,
    ValueMixinProperties
  >;
};
