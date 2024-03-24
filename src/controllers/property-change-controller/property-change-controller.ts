import type {
  LitElement,
  ReactiveController,
  ReactiveControllerHost,
} from 'lit';

interface Init<T extends object, Property extends keyof T> {
  compare?: boolean;
  onChange?(oldValue: T[Property] | undefined, newValue: T[Property]): void;
  property: Property;
}

export class PropertyChangeController<
  T extends LitElement,
  Property extends keyof T,
> implements ReactiveController
{
  #compare = true;
  #host: ReactiveControllerHost & T;
  #oldValue?: T[Property];
  #onChange?: Init<T, Property>['onChange'];
  #property: Property;

  #update = () => {
    const property = this.#property;

    if (property) {
      const newValue = this.#host[property];
      const shouldRun = !this.#compare || this.#oldValue !== newValue;

      if (shouldRun) {
        this.#onChange?.(this.#oldValue, newValue);
        this.#oldValue = newValue;
      }
    }
  };

  constructor(host: ReactiveControllerHost & T, init: Init<T, Property>) {
    this.#compare = init?.compare ?? true;
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
