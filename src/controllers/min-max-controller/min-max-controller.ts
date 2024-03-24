import type { ReactiveController, ReactiveControllerHost } from 'lit';

import { MAX_DATE, MIN_DATE } from '../../constants.js';
import { toResolvedDate } from '../../helpers/to-resolved-date.js';
import type { MinMaxProperties } from '../../mixins/types.js';
import type { MinMaxControllerProperties } from './types.js';

interface Init {
  onChange(data: Pick<MinMaxControllerProperties, 'maxDate' | 'minDate'>): void;
}

export class MinMaxController<T extends Pick<MinMaxProperties, 'max' | 'min'>>
  implements MinMaxControllerProperties, ReactiveController
{
  #host: ReactiveControllerHost & T;
  #max?: string;
  #min?: string;

  #onChange?: Init['onChange'];

  #update = () => {
    const didMaxChange = this.#updateMax();
    const didMinChange = this.#updateMin();

    if (didMaxChange || didMinChange) {
      this.#onChange?.({
        maxDate: this.maxDate,
        minDate: this.minDate,
      });
    }
  };

  #updateMax = () => {
    const { max } = this.#host;

    if (this.#max !== max) {
      this.#max = max;
      this.maxDate = toResolvedDate(max || MAX_DATE);

      return true;
    }

    return false;
  };

  #updateMin = () => {
    const { min } = this.#host;

    if (this.#min !== min) {
      this.#min = min;
      this.minDate = toResolvedDate(min || MIN_DATE);

      return true;
    }

    return false;
  };

  maxDate: Date = toResolvedDate(MAX_DATE);

  minDate: Date = toResolvedDate(MIN_DATE);

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
