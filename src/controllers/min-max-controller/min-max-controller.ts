import type { ReactiveController, ReactiveControllerHost } from 'lit';

import { MAX_DATE, MIN_DATE } from '../../constants.js';
import { toResolvedDate } from '../../helpers/to-resolved-date.js';
import type { DatePickerMinMaxProperties } from '../../mixins/types.js';

export class MinMaxController<T extends DatePickerMinMaxProperties>
  implements ReactiveController
{
  #host: ReactiveControllerHost & T;
  #max?: string;
  #min?: string;

  #update = () => {
    const didMaxChange = this.#updateMax();
    const didMinChange = this.#updateMin();

    if (didMaxChange || didMinChange) {
      this.#host.requestUpdate();
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

  maxDate!: Date;

  minDate!: Date;

  constructor(host: ReactiveControllerHost & T) {
    this.#host = host;
    this.#update();

    host.addController(this);
  }

  hostConnected(): void {
    this.#update();
  }

  hostUpdate(): void {
    this.#update();
  }
}
