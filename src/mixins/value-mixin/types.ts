export interface ValueMixinProperties extends ValueMixinStates {
  value?: null | string | undefined;
}

interface ValueMixinStates {
  _valueDate: Date;
}
