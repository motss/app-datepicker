import { property, state } from 'lit/decorators.js';

import { ValueController } from '../../controllers/value-controller/value-controller.js';
import { toResolvedDate } from '../../helpers/to-resolved-date.js';
import type { LitConstructor } from '../../types.js';
import type { MixinReturnType } from '../types.js';
import type { ValueMixinProperties } from './types.js';

export const ValueMixin = <BaseConstructor extends LitConstructor>(
  superClass: BaseConstructor
): MixinReturnType<BaseConstructor, ValueMixinProperties> => {
  class ValueMixinClass extends superClass implements ValueMixinProperties {
    #value_ = new ValueController(this, {
      onChange: (_, newValue) => {
        this._valueDate = toResolvedDate(newValue);
      },
    });

    @state() _valueDate: Date = this.#value_.valueDate;

    /**
     * NOTE: `null` or `''` will always reset to the old valid date. In order to reset to
     * today's date, set `value` to `undefined`.
     */
    @property() value = '';
    // fixme: should I use toDateString(toResolvedDate())?
  }

  return ValueMixinClass as unknown as MixinReturnType<
    BaseConstructor,
    ValueMixinProperties
  >;
};
