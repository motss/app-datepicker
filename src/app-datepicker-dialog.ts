import { customElement, html, LitElement, property, query } from '@polymer/lit-element';

import '@material/mwc-button/mwc-button.js';

import './app-datepicker.js';
import { datepickerVariables } from './common-styles.js';
import { getResolvedLocale } from './datepicker-helpers.js';

@customElement(AppDatepickerDialog.is)
export class AppDatepickerDialog extends LitElement {
  static get is() {
    return 'app-datepicker-dialog';
  }

  @property({ type: String })
  public min: string;

  @property({ type: String })
  public max: string = '2100-12-31';

  @property({ type: Number })
  public firstDayOfWeek: number = 0;

  @property({ type: Boolean })
  public showWeekNumber: boolean = false;

  @property({ type: String })
  public weekNumberType: string = 'first-4-day-week';

  @property({ type: String })
  public disabledDays: string = '0,6';

  @property({ type: String })
  public disableDates: string;

  @property({ type: String })
  public format: string = 'yyyy-MM-dd';

  @property({ type: Boolean })
  public landscape: boolean = false;

  @property({ type: String })
  public locale: string = getResolvedLocale();

  @property({ type: Number })
  public dragRatio: number = .15;

  @property({ type: String })
  // @ts-ignore
  public startView: string = 'calendar';

  @property({ type: String })
  // @ts-ignore
  public value: string;

  @property({ type: String })
  public dismissLabel: string = 'cancel';

  @property({ type: String })
  public confirmLabel: string = 'ok';

  @query('.scrim')
  private _scrim: HTMLDivElement;

  @query('.content-container')
  private _contentContainer: HTMLDivElement;

  public open() {
    console.debug('open-dialog');
    const scrim = this._scrim;
    const contentContainer = this._contentContainer;

    scrim.style.visibility = 'visible';
    contentContainer.style.visibility = 'visible';

    const keyframes: Keyframe[] = [
      { opacity: '0' },
      { opacity: '1' },
    ];
    const opts: KeyframeAnimationOptions = {
      duration: 100,
    };
    const fadeInAnimation = contentContainer.animate(keyframes, opts);

    new Promise(yay => (fadeInAnimation.onfinish = yay)).then(() => {
      contentContainer.style.opacity = '1';

      this.dispatchEvent(new CustomEvent(`${AppDatepickerDialog.is}-opened`, {
        detail: { opened: true },
        composed: true,
        bubbles: true,
      }));
    });
  }

  public close() {
    console.debug('close-dialog');
    const scrim = this._scrim;
    const contentContainer = this._contentContainer;

    scrim.style.visibility = 'hidden';

    const keyframes: Keyframe[] = [
      { opacity: '1' },
      { opacity: '0' },
    ];
    const opts: KeyframeAnimationOptions = {
      duration: 100,
    };
    const fadeOutAnimation = contentContainer.animate(keyframes, opts);

    new Promise(yay => (fadeOutAnimation.onfinish = yay)).then(() => {
      contentContainer.style.opacity = '0';
      contentContainer.style.visibility = 'hidden';

      this.dispatchEvent(new CustomEvent(`${AppDatepickerDialog.is}-closed`, {
        detail: { opened: false },
        composed: true,
        bubbles: true,
      }));
    });
  }

  protected render() {
    const min = this.min;
    const max = this.max;
    const firstDayOfWeek = this.firstDayOfWeek;
    const showWeekNumber = this.showWeekNumber;
    const weekNumberType = this.weekNumberType;
    const disabledDays = this.disabledDays;
    const disabledDates = this.disableDates;
    const format = this.format;
    const landscape = this.landscape;
    const locale = this.locale;
    const dragRatio = this.dragRatio;
    const startView = this.startView;
    const value = this.value;
    const dismissLabel = this.dismissLabel;
    const confirmLabel = this.confirmLabel;

    return html`
    ${datepickerVariables}
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
        pointer-events: none;
        z-index: var(--app-datepicker-dialog-z-index, 24);
        -webkit-tap-highlight-color: rgba(0,0,0,0);
      }
      :host([opened]) > .scrim,
      :host([opened]) > .content-container {
        visibility: visible;
        opacity: 1;
      }

      * {
        box-sizing: border-box;
      }

      .scrim,
      .content-container {
        pointer-events: auto;
      }

      .scrim {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .25);
        visibility: hidden;
        z-index: 22;
      }

      .content-container {
        position: absolute;
        top: 50%;
        left: 50%;
        max-width: 100%;
        max-height: 100%;
        background-color: #fff;
        transform: translate3d(-50%, -50%, 0);
        border-radius: var(--app-datepicker-border-radius);
        will-change: transform, opacity;
        overflow: hidden;
        visibility: hidden;
        opacity: 0;
        z-index: 23;
      }

      .datepicker {
        --app-datepicker-border-bottom-left-radius: 0;
        --app-datepicker-border-bottom-right-radius: 0;
      }

      .actions-container {
        display: flex;
        align-items: center;
        justify-content: flex-end;

        margin: 0;
        padding: 0 12px 12px 24px;
        background-color: inherit;
        color: var(--app-datepicker-primary-color);
      }
      mwc-button + mwc-button {
        margin: 0 0 0 8px;
      }
    </style>

    <div class="scrim" @pointerup="${this.close}"></div>

    <div class="content-container">
      <app-datepicker class="datepicker"
        .min="${min}"
        .max="${max}"
        .firstDayOfWeek="${firstDayOfWeek}"
        .showWeekNumber="${showWeekNumber}"
        .weekNumberType="${weekNumberType}"
        .disabledDays="${disabledDays}"
        .disabledDates="${disabledDates}"
        .format="${format}"
        .landscape="${landscape}"
        .locale="${locale}"
        .dragRatio="${dragRatio}"
        .startView="${startView}"
        .value="${value}"
      ></app-datepicker>

      <div class="actions-container">
        <mwc-button dialog-dismiss @pointerup="${this.close}">${dismissLabel}</mwc-button>
        <mwc-button dialog-confirm>${confirmLabel}</mwc-button>
      </div>
    </div>
    `;
  }

}
