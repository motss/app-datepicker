import type { LitElement, ReactiveController, ReactiveControllerHost } from 'lit';

interface Init<T extends object, Property extends keyof T> {
  onChange?(oldValue: T[Property] | undefined, newValue: T[Property]): void;
  property: Property;
}

export class PropertyChangeController<T extends LitElement, Property extends keyof T>
  implements ReactiveController
{
  #host: ReactiveControllerHost & T;
  #oldValue?: T[Property];
  #onChange?: Init<T, Property>['onChange'];
  #property: Property;

  #update = () => {
    const property = this.#property;

    if (property) {
      const newValue = this.#host[property];

      if (this.#oldValue !== newValue) {
        this.#onChange?.(this.#oldValue, newValue);
        this.#oldValue = newValue;
      }
    }
  };

  constructor(host: ReactiveControllerHost & T, init: Init<T, Property>) {
    this.#host = host;
    this.#onChange = init?.onChange;
    this.#property = init?.property;

    host.addController(this);
  }

  hostConnected(): void {
    this.#update();
  }

  hostUpdate(): void {
    this.#update();
  }
}
