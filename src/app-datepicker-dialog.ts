import { customElement, html, LitElement, property } from '@polymer/lit-element';

import '@polymer/paper-button/paper-button.js';

import '../app-datepicker.js';

@customElement('app-datepicker-dialog' as any)
export class AppDatepickerDialog extends LitElement {
  @property({ type: Number })
  public firstDayOfWeek: number = 0;

  @property({ type: Array })
  public disableDays: number[] = [0, 6];

  @property({ type: Array })
  public disableDates: string[] = [];

  @property({ type: String })
  public format: string = 'yyyy-MM-dd';

  @property({ type: String })
  public orientation: string = 'portrait';

  @property({ type: String })
  public theme: string = 'material';

  @property({ type: String })
  public locale: string = 'en-US';

  @property({ type: String })
  public min: string = '1970-01-01T00:00:00.000Z';

  @property({ type: String })
  public max: string = '2100-12-31T23:59:59.999Z';

  @property({ type: Date })
  public value: string = 'yyyy-MM-dd';

  protected render() {
    return html`
    <style>
      :host {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;

        position: fixed;
        display: block;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        pointer-events: none;
      }

      * {
        box-sizing: border-box;
      }

      .scrim {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: auto;
        background-color: rgba(0, 0, 0, .25);
      }
    </style>

    <div class="scrim"></div>

    <app-datepicker class="no-padding"
      .firstDayOfWeek="${this.firstDayOfWeek}"
      .disableDays="${this.disableDays}"
      .disableDates="${this.disableDates}"
      .format="${this.format}"
      .orientation="${this.orientation}"
      .theme="${this.theme}"
      .locale="${this.locale}"
      .min="${this.min}"
      .max="${this.max}"
      .value="${this.value}"></app-datepicker>
      <paper-button slot="dismiss-button" .dialogDismiss>[[dismissLabel]]</paper-button>
      <paper-button slot="confirm-button" .dialogConfirm>[[confirmLabel]]</paper-button>
    </app-datepicker>
    `;
  }
}
