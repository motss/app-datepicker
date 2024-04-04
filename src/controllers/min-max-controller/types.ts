import type { MinMaxProperties } from '../../types.js';

export interface MinMaxControllerHostProperties extends MinMaxProperties {}

export interface MinMaxControllerProperties {
  maxDate: Date;
  minDate: Date;
}
