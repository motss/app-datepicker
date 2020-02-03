export interface DatepickerDialogClosed {
  opened: boolean;
  value: AppDatepickerDialog['value'];
}
export type DatepickerDialogOpened = DatepickerDialogClosed & DatepickerFirstUpdated;

import '@material/mwc-button/mwc-button.js';
import { css, customElement, html, LitElement, property, query } from 'lit-element';

import { WeekNumberType } from 'nodemod/dist/calendar/calendar_typing';
import { AppDatepicker } from './app-datepicker.js';
import './app-datepicker.js';
import { datepickerVariables } from './common-styles.js';
import {
  DatepickerFirstUpdated,
  DatepickerValueUpdated,
  FocusTrap,
  KEY_CODES_MAP,
  StartView,
} from './custom_typings.js';
import { dispatchCustomEvent } from './helpers/dispatch-custom-event.js';
import { getResolvedDate } from './helpers/get-resolved-date.js';
import { getResolvedLocale } from './helpers/get-resolved-locale.js';
import { setFocusTrap } from './helpers/set-focus-trap.js';
import { toFormattedDateString } from './helpers/to-formatted-date-string.js';

const opts: KeyframeAnimationOptions = { duration: 100 };

@customElement(AppDatepickerDialog.is)
export class AppDatepickerDialog extends LitElement {
  static get is() { return 'app-datepicker-dialog'; }

  static get styles() {
    // tslint:disable: max-line-length
    return [
      datepickerVariables,
      css`
      :host {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;

        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: var(--app-datepicker-dialog-z-index, 24);
        -webkit-tap-highlight-color: rgba(0,0,0,0);
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
        background-color: var(--app-datepicker-dialog-scrim-bg-color, rgba(0, 0, 0, .55));
        visibility: hidden;
        z-index: 22;
      }

      .content-container {
        position: absolute;
        top: 50%;
        left: 50%;
        max-width: 100%;
        max-height: 100%;
        background-color: var(--app-datepicker-bg-color, #fff);
        transform: translate3d(-50%, -50%, 0);
        border-radius: var(--app-datepicker-dialog-border-radius, 8px);
        will-change: transform, opacity;
        overflow: hidden;
        visibility: hidden;
        opacity: 0;
        z-index: 23;
        box-shadow: 0 24px 38px 3px rgba(0, 0, 0, 0.14),
                    0 9px 46px 8px rgba(0, 0, 0, 0.12),
                    0 11px 15px -7px rgba(0, 0, 0, 0.4);
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
        --mdc-theme-primary: var(--app-datepicker-accent-color, #1a73e8);
      }

      mwc-button + mwc-button {
        margin: 0 0 0 8px;
      }

      /**
       * NOTE: IE11-only fix via CSS hack.
       * Visit https://bit.ly/2DEUNZu|CSS for more relevant browsers' hacks.
       */
      @media screen and (-ms-high-contrast: none) {
        mwc-button[dialog-dismiss] {
          min-width: 10ch;
        }
      }
      `,
    ];
    // tslint:enable: max-line-length
  }

  @property({ type: Number, reflect: true })
  public firstDayOfWeek: number = 0;

  @property({ type: Boolean, reflect: true })
  public showWeekNumber: boolean = false;

  @property({ type: String, reflect: true })
  public weekNumberType: WeekNumberType = 'first-4-day-week';

  @property({ type: Boolean, reflect: true })
  public landscape: boolean = false;

  @property({ type: String, reflect: true })
  public startView: StartView = 'calendar';

  @property({ type: String, reflect: true })
  public min?: string;

  @property({ type: String, reflect: true })
  public max?: string;

  @property({ type: String })
  public value: string = toFormattedDateString(getResolvedDate());

  @property({ type: String })
  public locale: string = getResolvedLocale();

  @property({ type: String })
  public disabledDays: string = '';

  @property({ type: String })
  public disabledDates?: string;

  @property({ type: String })
  public weekLabel: string = 'Wk';

  // @property({ type: Number })
  // public dragRatio: number = .15;

  @property({ type: String })
  public dismissLabel: string = 'cancel';

  @property({ type: String })
  public confirmLabel: string = 'ok';

  @property({ type: Boolean })
  public noFocusTrap: boolean = false;

  @query('.content-container')
  private _contentContainer?: HTMLDivElement;

  @query('mwc-button[dialog-confirm]')
  private _dialogConfirm?: HTMLElement;

  private _focusable?: HTMLElement;
  private _focusTrap?: FocusTrap;
  private _opened: boolean = false;

  public open() {
    if (this._opened) return this.updateComplete;

    return this.updateComplete.then(() => {
      this.removeAttribute('aria-hidden');
      this.style.display = 'block';
      this._opened = true;

      return this.requestUpdate();
    }).then(() => {
      const contentContainer = this._contentContainer!;
      const keyframes: Keyframe[] = [
        { opacity: '0' },
        { opacity: '1' },
      ];

      this._scrim!.style.visibility = contentContainer.style.visibility = 'visible';

      const fadeInAnimationTask = new Promise(yay =>
        ((contentContainer.animate(keyframes, opts)).onfinish = yay));

      return fadeInAnimationTask.then(() => {
        contentContainer.style.opacity = '1';

        const focusable = this._focusable!;
        if (!this.noFocusTrap) {
          this._focusTrap = setFocusTrap(this, [focusable, this._dialogConfirm!])!;
        }
        focusable.focus();
        dispatchCustomEvent<DatepickerDialogOpened>(this, 'datepicker-dialog-opened', {
          firstFocusableElement: focusable,
          opened: true,
          value: this.value,
        });
      });
    });
  }

  public close() {
    if (!this._opened) return this.updateComplete;

    return this.updateComplete.then(() => {
      this._opened = false;
      this._scrim!.style.visibility = '';

      const contentContainer = this._contentContainer!;
      const keyframes: Keyframe[] = [
        { opacity: '1' },
        { opacity: '0' },
      ];
      const fadeOutAnimationTask = new Promise(yay =>
        ((contentContainer.animate(keyframes, opts)).onfinish = yay));

      return fadeOutAnimationTask.then(() => {
        contentContainer.style.opacity =
        contentContainer.style.visibility = '';

        this.setAttribute('aria-hidden', 'true');
        this.style.display = 'none';

        if (!this.noFocusTrap) this._focusTrap!.disconnect();

        dispatchCustomEvent<DatepickerDialogClosed>(
          this, 'datepicker-dialog-closed', { opened: false, value: this.value });
      });
    });
  }

  protected shouldUpdate() {
    return !this.hasAttribute('aria-hidden');
  }

  protected firstUpdated() {
    this.setAttribute('role', 'dialog');
    this.setAttribute('aria-label', 'datepicker');
    this.setAttribute('aria-modal', 'true');
    this.setAttribute('aria-hidden', 'true');
    this.addEventListener('keyup', (ev: KeyboardEvent) => {
      if (ev.keyCode === KEY_CODES_MAP.ESCAPE) this.close();
    });

    dispatchCustomEvent<DatepickerFirstUpdated>(this, 'datepicker-dialog-first-updated', {
      value: this.value,
      firstFocusableElement: this._focusable!,
    });
  }

  // tslint:disable-next-line: function-name
  protected _getUpdateComplete() {
    const datepicker = this._datepicker;

    return (
      datepicker ? datepicker.updateComplete : Promise.resolve()
    ).then(() => super._getUpdateComplete());
  }

  protected render() {
    // .dragRatio="${this.dragRatio}"
    return html`
    <div class="scrim" @click="${this.close}"></div>

    ${this._opened ? html`<div class="content-container">
    <app-datepicker class="datepicker"
      .min="${this.min}"
      .max="${this.max}"
      .firstDayOfWeek="${this.firstDayOfWeek}"
      .showWeekNumber="${this.showWeekNumber}"
      .weekNumberType="${this.weekNumberType}"
      .disabledDays="${this.disabledDays}"
      .disabledDates="${this.disabledDates}"
      .landscape="${this.landscape}"
      .locale="${this.locale}"
      .startView="${this.startView}"
      .value="${this.value}"
      .weekLabel="${this.weekLabel}"
      @datepicker-first-updated="${this._setFocusable}"
      @datepicker-value-updated="${this._updateWithKey}"></app-datepicker>

      <div class="actions-container">
        <mwc-button dialog-dismiss @click="${this.close}">${this.dismissLabel}</mwc-button>
        <mwc-button dialog-confirm @click="${this._update}">${this.confirmLabel}</mwc-button>
      </div>
    </div>` : null}
    `;
  }

  private _updateValue() {
    this.value = this._datepicker!.value;
  }

  private _update() {
    this._updateValue();

    return this.close();
  }

  private _updateWithKey(ev: CustomEvent<DatepickerValueUpdated>) {
    const { isKeypress, keyCode } = ev.detail;

    if (!isKeypress || keyCode !== KEY_CODES_MAP.ENTER && keyCode !== KEY_CODES_MAP.SPACE) return;

    return this._update();
  }

  private _setFocusable(ev: CustomEvent<DatepickerFirstUpdated>) {
    this._focusable = ev.detail && ev.detail.firstFocusableElement;
    this._updateValue();
  }

  private get _datepicker() {
    return this.shadowRoot!.querySelector<AppDatepicker>('.datepicker');
  }

  private get _scrim() {
    return this.shadowRoot!.querySelector<HTMLDivElement>('.scrim');
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'app-datepicker-dialog': AppDatepickerDialog;
  }

  interface HTMLElementEventMap {
    'datepicker-dialog-closed': CustomEvent<DatepickerDialogClosed>;
    'datepicker-dialog-first-updated': CustomEvent<DatepickerFirstUpdated>;
    'datepicker-dialog-opened': CustomEvent<DatepickerDialogOpened>;
  }
}
