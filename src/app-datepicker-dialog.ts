import { AppDatepicker } from './app-datepicker.js';
import { FocusTrap, KEYCODES_MAP } from './datepicker-helpers.js';

import { css, customElement, html, LitElement, property, query } from 'lit-element';

import '@material/mwc-button/mwc-button.js';

import './app-datepicker.js';
import { datepickerVariables } from './common-styles.js';
import {
  dispatchCustomEvent,
  getResolvedLocale,
  setFocusTrap,
} from './datepicker-helpers.js';

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
  public startView: string = 'calendar';

  @property({ type: String })
  public value: string;

  @property({ type: String })
  public dismissLabel: string = 'cancel';

  @property({ type: String })
  public confirmLabel: string = 'ok';

  @property({ type: Boolean })
  public noFocusTrap: boolean = false;

  @query('.scrim')
  private _scrim: HTMLDivElement;

  @query('.content-container')
  private _contentContainer: HTMLDivElement;

  @query('.datepicker')
  private _datepicker: AppDatepicker;

  @query('mwc-button[dialog-confirm]')
  private _dialogConfirm: HTMLElement;

  private _focusable: HTMLElement;
  private _focusTrap: FocusTrap;

  public constructor() {
    super();

    this.setAttribute('role', 'dialog');
    this.setAttribute('aria-label', 'datepicker');
    this.setAttribute('aria-modal', 'true');
  }

  public open() {
    const scrim = this._scrim;
    const contentContainer = this._contentContainer;

    this.removeAttribute('aria-hidden');
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

      const focusable = this._focusable;

      if (!this.noFocusTrap) {
        this._focusTrap = setFocusTrap(this, [
          focusable,
          this._dialogConfirm,
        ])!;
      }

      focusable.focus();
      dispatchCustomEvent(this, 'datepicker-dialog-opened', { opened: true, value: this.value });
    });
  }

  public close() {
    const scrim = this._scrim;
    const contentContainer = this._contentContainer;

    scrim.style.visibility = '';

    const keyframes: Keyframe[] = [
      { opacity: '1' },
      { opacity: '0' },
    ];
    const opts: KeyframeAnimationOptions = {
      duration: 100,
    };
    const fadeOutAnimation = contentContainer.animate(keyframes, opts);

    new Promise(yay => (fadeOutAnimation.onfinish = yay)).then(() => {
      contentContainer.style.opacity = '';
      contentContainer.style.visibility = '';

      this.setAttribute('aria-hidden', 'true');
      if (!this.noFocusTrap) this._focusTrap.disconnect();
      dispatchCustomEvent(this, 'datepicker-dialog-closed', { opened: false, value: this.value });
    });
  }

  protected firstUpdated() {
    this._updateValue();
    this.addEventListener('keyup', (ev: KeyboardEvent) => {
      if (ev.keyCode === KEYCODES_MAP.ESCAPE) {
        this.close();
      }
    });

    dispatchCustomEvent(this, 'datepicker-dialog-first-updated', { value: this.value });
  }

  static get styles() {
    return [
      datepickerVariables,
      css`
      :host {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;

        position: fixed;
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
        padding: 12px;
        background-color: inherit;
        color: var(--app-datepicker-primary-color);
      }

      mwc-button + mwc-button {
        margin: 0 0 0 8px;
      }

      /**
       * NOTE: IE11-only fix via CSS hack.
       *
       * Visit https://bit.ly/2DEUNZu|CSS for more relevant browsers' hacks.
       */
      @media screen and (-ms-high-contrast: none) {
        mwc-button[dialog-dismiss] {
          min-width: 10ch;
        }
      }
      `,
    ];
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

    // <div class="scrim" @pointerup="${this.close}"></div>
    return html`
    <div class="scrim" @click="${this.close}"></div>

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
        @datepicker-first-updated="${this._setFocusable}"
      ></app-datepicker>

      <div class="actions-container">
        <mwc-button dialog-dismiss @click="${this.close}">${dismissLabel}</mwc-button>
        <mwc-button dialog-confirm @click="${this._update}">${confirmLabel}</mwc-button>
      </div>
    </div>
    `;
  }

  private _update() {
    this._updateValue();
    this.close();
  }

  private _updateValue() {
    const datepicker = this._datepicker;
    this.value = datepicker.value;
  }

  private _setFocusable(ev: CustomEvent) {
    const { firstFocusableElement } = ev.detail;
    this._focusable = firstFocusableElement;
  }

}
