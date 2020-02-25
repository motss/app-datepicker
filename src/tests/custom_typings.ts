import type { LitElement } from 'lit-element';

import type { Datepicker } from '../datepicker.js';

export type PrepareOptions = Partial<
  Record<'props' | 'attrs', Partial<Omit<Datepicker, keyof LitElement>>>>;
