import '@material/web/icon/icon.js';
import '@material/web/menu/menu.js';
import '@material/web/iconbutton/outlined-icon-button.js';
import '@material/web/textfield/outlined-text-field.js';
import '../date-picker/app-date-picker.js';

import { css, html, nothing, type ReactiveController, type ReactiveControllerHost } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { iconClear } from '../icons.js';
import { RootElement } from '../root-element/root-element.js';

class EventController implements ReactiveController {
  #fn = (_ev: MouseEvent) => { /** no-op */ };
  // private host: ReactiveControllerHost;

  constructor(host: ReactiveControllerHost, fn: (ev: MouseEvent) => unknown) {
    host.addController(this);
    
    document.body.removeEventListener('click', this.#fn);
    this.#fn = fn;
  }

  hostConnected() {
    document.body.addEventListener('click', this.#fn);
  }

  hostDisconnected() {
    document.body.removeEventListener('click', this.#fn);
  }
}

@customElement('date-picker-input')
export class DatePickerInput extends RootElement {
  static override styles = css`
    :host {
      color: blue;
    }
  `;

  ctrl = new EventController(this, (ev: MouseEvent) => {
    const a = ev.composedPath()
      .find(
        (ev) => {
          if ((ev as HTMLElement).nodeType === Node.ELEMENT_NODE) {
            const el = ev as HTMLElement;

            return [
              'button',
              'app-date-picker',
            ].some(n => el.localName === n);
          }

          return false;
        }
      );

    if (!a) {
      this.show = false;
    }
  });

  @state() show = false;

  protected override render() {
    return html`
    <p>date-picker-input</p>
    <md-outlined-text-field label="Select date">
      <md-icon-button slot="trailing-icon">
        <md-icon>${iconClear}</md-icon>
      </md-icon-button>
    </md-outlined-text-field>
    <div style="position: relative;">
      <button type="button" @click=${() => this.show = true}>Open</button>
      ${this.show ? html`
      <app-date-picker style="position: absolute;top:24px"></app-date-picker>
      ` : nothing}
    </div>
      `;
  }
}
