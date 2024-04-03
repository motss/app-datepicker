import type {
  LitElement,
  ReactiveController,
  ReactiveControllerHost,
} from 'lit';

import type { OmitKey } from '../../utility.types.js';

type ExecuteOrder = 'update' | 'updated';

interface Init<
  T extends LitElement,
  Property extends keyof T,
  Order extends ExecuteOrder,
> {
  compare?: boolean;
  onUpdate?(oldValue: T[Property] | undefined, newValue: T[Property]): void;
  onUpdated?(oldValue: T[Property] | undefined, newValue: T[Property]): void;
  order: Order;
  property: Property;
}

export class PropertyChangeController<
  T extends LitElement,
  Property extends keyof T,
  Order extends ExecuteOrder,
> implements ReactiveController
{
  #compare = true;
  #host: ReactiveControllerHost & T;
  #oldValue?: T[Property];
  #onUpdate?: Init<T, Property, Order>['onUpdate'];
  #onUpdated?: Init<T, Property, Order>['onUpdated'];
  #order: ExecuteOrder = 'update';
  #property: Property;

  #update = (from: 'connected' | 'update' | 'updated') => {
    const property = this.#property;
    const order = this.#order;

    const shouldRunAfterOrderCheck = from === 'connected' || order === from;

    if (property && shouldRunAfterOrderCheck) {
      const newValue = this.#host[property];
      const shouldRunAfterCompareCheck =
        !this.#compare || this.#oldValue !== newValue;

      if (shouldRunAfterCompareCheck) {
        (order === 'updated' ? this.#onUpdated : this.#onUpdate)?.(
          this.#oldValue,
          newValue
        );
        this.#oldValue = newValue;
      }
    }
  };

  constructor(
    host: ReactiveControllerHost & T,
    init: Order extends 'updated'
      ? OmitKey<Init<T, Property, Order>, 'onUpdate'>
      : OmitKey<Init<T, Property, Order>, 'onUpdated'>
  ) {
    this.#compare = init?.compare ?? true;
    this.#host = host;
    this.#onUpdate = (init as Init<T, Property, 'update'>)?.onUpdate;
    this.#onUpdated = (init as Init<T, Property, 'updated'>)?.onUpdated;
    this.#order = init?.order;
    this.#property = init?.property;

    host.addController(this);
  }

  hostConnected(): void {
    this.#update('connected');
  }

  hostUpdate(): void {
    this.#update('update');
  }

  hostUpdated(): void {
    this.#update('updated');
  }
}
