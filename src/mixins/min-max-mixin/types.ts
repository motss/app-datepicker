import type { MinMaxProperties } from '../../types.js';

export interface MinMaxMixinProperties
  extends MinMaxProperties,
    MinMaxMixinStates {}

interface MinMaxMixinStates {
  _maxDate: Date;
  _minDate: Date;
}
