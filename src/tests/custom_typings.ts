import { LitElement } from 'lit-element';

import { AppDatepicker } from '../app-datepicker.js';

export type PrepareOptions = Partial<
  Record<'props' | 'attrs', Partial<Omit<AppDatepicker, keyof LitElement>>>>;
