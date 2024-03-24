import type { ReactiveController, ReactiveControllerHost } from 'lit';

import { toResolvedDate } from '../../helpers/to-resolved-date.js';
import type { ValueControllerProperties } from './types.js';

interface Init {
  onChange(
    oldValue: ValueControllerProperties['value'],
    newValue: ValueControllerProperties['value']
  ): void;
}

export class ValueController<T extends Pick<ValueControllerProperties, 'value'>>
  implements ValueControllerProperties, ReactiveController
{
  #host: ReactiveControllerHost & T;
  #onChange?: Init['onChange'];

  #update = () => {
    const value = this.#host.value;
    const oldValue = this.#value;

    if (oldValue !== value) {
      this.valueDate = toResolvedDate(value);
      this.#value = value;
      this.#onChange?.(oldValue, value);
    }
  };

  #value?: string;

  valueDate: Date = toResolvedDate();

  constructor(host: ReactiveControllerHost & T, init?: Init) {
    this.#host = host;
    this.#onChange = init?.onChange;

    host.addController(this);
  }

  hostConnected(): void {
    this.#update();
  }

  hostUpdate(): void {
    this.#update();
  }
}
