import type { LitConstructor } from '../types.js';
import type { Constructor } from '../utility.types.js';

export type MixinReturnType<
  BaseConstructor extends LitConstructor,
  Mixin,
> = BaseConstructor & Constructor<Mixin>;
