/** Import project dependencies */
import {
  html,
  LitElement
} from '../node_modules/@polymer/lit-element/lit-element.js';

/** Import other modules */
import './app-datepicker.js';

class AppDatepickerDialog extends LitElement {
  static get is() {
    return 'app-datepicker-dialog';
  }

  static get properties() {
    return {
      min: Date,
      max: Date,
      value: String,
      valueAsDate: Date,
      valueAsNumber: Number,

      firstDayOfWeek: Number,
      disabledDays: String,
      locale: String,
      startView: String,
      weekdayFormat: String,
      showWeekNumber: Boolean,

      opened: Boolean,
      dialogType: String,
    };
  }

  _shouldPropertiesChange(props, changedProps) {
    console.log('# AppDatepickerDialog:_shouldPropertiesChange', changedProps);

    const { opened } = changedProps;

    if ('opened' in changedProps) {
      opened
        ? this.classList.add('opened')
        : this.classList.remove('opened');

      // TODO: To add focus trap handler.
    }

    return true;
  }

  constructor() {
    super();

    this.initProps();

    /** NOTE: Setup document click handler */
    this._boundDocumentClickHandler = this.documentClickHandler.bind(this);
  }

  didRender(props, changedProps) {
    if (changedProps == null) {
      return true;
    }

    const {
      dialogType,
      opened,
    } = changedProps;

    if (dialogType == null || (typeof dialogType === 'string' && !dialogType.length)) {
      this.dialogScrim && this.dialogScrim.classList.remove('has-scrim');
    }

    if (/^(backdrop|modal)/i.test(dialogType)) {
      this.dialogScrim && this.dialogScrim.classList.add('has-scrim');
    }

    if (!opened) {
      document.body.removeEventListener('click', this._boundDocumentClickHandler);
    }

    if (opened) {
      /** NOTE: Skip setting document click handler up if the scrim exists */
      if (/^(backdrop|modal)/i.test(dialogType)) {
        return;
      }

      window.requestAnimationFrame(() => {
        document.body.addEventListener('click', this._boundDocumentClickHandler);
      });
    }

    return Promise.resolve(this.renderComplete);
  }

  render({
    min,
    max,
    value,
    valueAsDate,
    valueAsNumber,

    dialogType,

  }) {
    return html`
      <style>
        :host {
          display: block;
          box-sizing: border-box;
          pointer-events: none;

          --app-datepicker-dialog-footer-height: 59px;
          --app-datepicker-dialog-width: 300px;
        }

        * {
          box-sizing: border-box;
        }

        app-datepicker {
          --app-datepicker-width: var(--app-datepicker-dialog-width);
          --app-datepicker-footer-height: var(--app-datepicker-dialog-footer-height);
        }

        .dialog__datepicker {
          display: none;
          position: fixed;
          top: calc((100% - (var(--app-datepicker-dialog-width) / .66)) / 2);
          left: calc((100% - var(--app-datepicker-dialog-width)) / 2);
          width: var(--app-datepicker-dialog-width);
          z-index: 24;
          pointer-events: auto;
          box-shadow: 0 24px 38px 3px rgba(0, 0, 0, 0.14),
                      0 9px 46px 8px rgba(0, 0, 0, 0.12),
                      0 11px 15px -7px rgba(0, 0, 0, 0.4);
        }
        :host(.opened) > .dialog__datepicker {
          display: block;
        }

        .datepicker__footer {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-end;

          background-color: #fff;
          width: 100%;
          height: var(--app-datepicker-dialog-footer-height);
          padding: 0 8px 0 0;
        }
        .datepicker__footer > paper-button {
          color: var(--app-datepicker-primary-color);
          font-size: 14px;

          --paper-button-ink-color: #848484;
        }

        .dialog__scrim {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, .55);
          opacity: 0;
          pointer-events: none;
          transition: opacity 150ms cubic-bezier(0, 0, .4, 1);
        }
        :host(.opened) .dialog__scrim.has-scrim {
          opacity: 1;
          pointer-events: auto;
        }
      </style>

      <div class="dialog__datepicker">
        <app-datepicker
          value="${value}"
          valueAsDate="${valueAsDate}"
          valueAsNumber="${valueAsNumber}"
          on-value-changed="${
            ev => this.dispatchEvent(new CustomEvent('value-changed', {
              detail: Object.assign({}, ev.detail),
            }))
          }"
          on-change="${
            ev => this.dispatchEvent(new CustomEvent('change', {
              detail: Object.assign({}, ev.detail),
            }))
          }"
          on-input="${
            ev => this.dispatchEvent(new CustomEvent('input', {
              detail: Object.assign({}, ev.detail),
            }))
          }"></app-datepicker>

        <div class="datepicker__footer">
          <paper-button dialog-dismiss
            on-tap="${ev => this.closeDatepickerOnDismissButtonTap(ev)}">cancel</paper-button>
          <paper-button dialog-confirm
            on-tap="${ev => this.updateValueOnTap(ev)}">ok</paper-button>
        </div>
      </div>

      ${
        /^(backdrop|modal)/i.test(dialogType)
          ? html`<div class="dialog__scrim" on-click="${ev => this.closeDatepickerOnScrimTap(ev)}"></div>`
          : null
      }
    `;
  }

  initProps() {
  }

  documentClickHandler(ev) {
    console.log('# documentClickHandler', ev.target);

    const findElemOnTap = (tgt) => {
      return tgt == null
        || (/^input/i.test(tgt.tagName) && /^datepicker\_+input/i.test(tgt.id))
          ? tgt
          : findElemOnTap(tgt.parentElement);
    };

    return Promise.resolve(this.renderComplete)
      .then(() => {
        const target = ev.target;

        if (
          (/^input/i.test(target.tagName) && /^datepicker\_\_input/i.test(target.id))
            || /^app\-datepicker\-dialog/i.test(target.tagName)
        ) {
          return;
        }

        if (findElemOnTap(target) == null) {
          return Promise.resolve(this.renderComplete)
            .then(() => {
              this.opened = false;
            });
        }
      });
  }

  closeDatepicker() {
    return Promise.resolve(this.renderComplete)
      .then(() => {
        this.opened = false;
      });
  }

  closeDatepickerOnDismissButtonTap(ev) {
    return this.closeDatepicker();
  }

  closeDatepickerOnScrimTap(ev) {
    /** NOTE: No op when the dialog is a modal one */
    if (/^modal/i.test(this.dialogType)) {
      return;
    }

    return this.closeDatepicker();
  }

  updateValueOnTap(ev) {
    const elemOnTap = ev.target;

    if (!elemOnTap.hasAttribute('dialog-confirm')) {
      return;
    }

    return Promise.resolve(this.renderComplete)
      .then(() => {
        const updatedVal = this.shadowRoot
          .querySelector('app-datepicker')
          .updateValueOnTap();

        return Promise.resolve(this.renderComplete)
          .then(() => {
            /** NOTE: Update all values */
            this.value = updatedVal.value;
            this.valueAsDate = updatedVal.valueAsDate;
            this.valueAsNumber = updatedVal.valueAsNumber;

            return this.renderComplete;
          })
          .then(() => {
            /** NOTE: Fire an event upwards */
            this.dispatchEvent(new CustomEvent('value-updated', {
              detail: Object.assign({}, updatedVal),
            }));

            return this.closeDatepicker();
          });
      });
  }

  get dialogScrim() {
    return this.shadowRoot.querySelector('.dialog__scrim');
  }
}

window.customElements.define(AppDatepickerDialog.is, AppDatepickerDialog);
