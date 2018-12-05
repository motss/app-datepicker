import { customElement, html, LitElement, property } from '@polymer/lit-element';

import '@polymer/paper-button/paper-button.js';

import '../app-datepicker.js';

@customElement(AppDatepickerDialog.is as any)
export class AppDatepickerDialog extends LitElement {
  static get is() {
    return 'app-datepicker-dialog';
  }

  @property({ type: String })
  public min: string = '1970-01-01T00:00:00.000Z';

  @property({ type: String })
  public max: string = '2100-12-31T23:59:59.999Z';

  @property({ type: Date })
  public value: string = 'yyyy-MM-dd';

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
        z-index: var(--app-datepicker-dialog-z-index, 24);
      }

      * {
        box-sizing: border-box;
      }

      .scrim {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: auto;
        background-color: rgba(0, 0, 0, .25);
        z-index: 22;
      }

      .datepicker {
        display: none;
        position: absolute;
        top: 50%;
        left: 50%;
        max-width: 100%;
        max-height: 100%;
        transform: translate3d(-50%, -50%, 0);
        will-change: transform;
        overflow: auto;
        pointer-events: auto;
        z-index: 23;
      }
    </style>

    <div class="scrim"
      @pointerup="${this.close}"></div>

    <app-datepicker class="datepicker"
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

  public open() {
    const scrim = this._scrim;
    const datepicker = this._datepicker;

    scrim.style.display = 'block';
    datepicker.style.display = 'block';

    const fadeInAnimations = [scrim, datepicker].map(n => n.animate([
      { opacity: '0' },
      { opacity: '1' },
    ] as Keyframe[], {
      duration: 250,
      fill: 'forwards',
    }).finished);

    Promise.all(fadeInAnimations)
      .then(() => {
        scrim.style.opacity = '1';
        datepicker.style.opacity = '1';

        this.dispatchEvent(new CustomEvent(`${AppDatepickerDialog.is}-opened`, {
          detail: { opened: true },
          composed: true,
          bubbles: true,
        }));
      });
  }

  public close() {
    const scrim = this._scrim;
    const datepicker = this._datepicker;

    const fadeOutAnimations = [scrim, datepicker].map(n => n.animate([
      { opacity: '1' },
      { opacity: '0' },
    ] as Keyframe[], {
      duration: 250,
      fill: 'forwards',
    }).finished);

    Promise.all(fadeOutAnimations)
      .then(() => {
        scrim.style.opacity = '0';
        datepicker.style.opacity = '0';

        scrim.style.display = 'none';
        datepicker.style.display = 'none';

        this.dispatchEvent(new CustomEvent(`${AppDatepickerDialog.is}-closed`, {
          detail: { opened: false },
          composed: true,
          bubbles: true,
        }));
      });
  }

  private get _scrim() {
    return this.shadowRoot!.querySelector<HTMLDivElement>('.scrim')!;
  }

  private get _datepicker() {
    return this.shadowRoot!.querySelector<HTMLDivElement>('.datepicker')!;
  }
}
