import { property, state } from 'lit/decorators.js';

import { MinMaxController } from '../controllers/min-max-controller/min-max-controller.js';
import { nullishAttributeConverter } from '../helpers/nullish-attribute-converter.js';
import type { LitConstructor } from '../types.js';
import type { MinMaxMixinProperties, MixinReturnType } from './types.js';

export const MinMaxMixin = <BaseConstructor extends LitConstructor>(
  superClass: BaseConstructor
): MixinReturnType<BaseConstructor, MinMaxMixinProperties> => {
  class MinMaxClass
    extends superClass
    implements MinMaxMixinProperties
  {
    #minMax_ = new MinMaxController(this, {
      onChange: ({ maxDate, minDate }) => {
        this._maxDate = maxDate;
        this._minDate = minDate;
      }
    });

    @state() _maxDate: Date = this.#minMax_.maxDate;

    @state() _minDate: Date = this.#minMax_.minDate;

    /**
     * NOTE: `null` or `''` will always reset to the old valid date. In order to reset to MAX_DATE,
     * set `max` undefined.
     */
    @property({
      converter: { toAttribute: nullishAttributeConverter },
      reflect: true,
    })
    public max?: string;

    /**
     * NOTE: `null` or `''` will always reset to the old valid date. In order to reset to
     * today's date, set `min` undefined.
     */
    @property({
      converter: { toAttribute: nullishAttributeConverter },
      reflect: true,
    })
    public min?: string;
  }

  return MinMaxClass as unknown as MixinReturnType<
    BaseConstructor,
    MinMaxMixinProperties
  >;
};
