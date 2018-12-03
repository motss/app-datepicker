import "./app-datepicker.js";
import { PaperDialogBehavior } from "@polymer/paper-dialog-behavior/paper-dialog-behavior.js";
import "@polymer/paper-button/paper-button.js";
import { NeonAnimationRunnerBehavior } from "@polymer/neon-animation/neon-animation-runner-behavior.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";

class AppDatepickerDialog extends
  mixinBehaviors([NeonAnimationRunnerBehavior, PaperDialogBehavior], PolymerElement) {

  static get template() {
    return html`
    <style>
      :host {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        box-sizing: border-box;
        -webkit-tap-highlight-color: rgba(0,0,0,0);

        display: block;
      }

      * {
        box-sizing: border-box;
      }
    </style>

    <app-datepicker
      id="datePicker"
      class="no-padding"
      first-day-of-week="[[firstDayOfWeek]]"
      disable-days="[[disableDays]]"
      disable-dates="[[disableDates]]"
      min-date="[[minDate]]"
      max-date="[[maxDate]]"
      format="[[format]]"
      date="{{_readOnlyDate}}"
      input-date="[[inputDate]]"
      show-long-date="[[showLongDate]]"
      no-animation="[[noAnimation]]"
      page-entry-animation="[[pageEntryAnimation]]"
      page-exit-animation="[[pageExitAnimation]]"
      invalid-date="{{_readOnlyInvalidDate}}"
      view="[[view]]"
      theme="[[theme]]"
      locale="[[locale]]"
      always-reset-selected-date-on-dialog-close="[[alwaysResetSelectedDateOnDialogClose]]"
      >
        <paper-button slot="dismiss-button" noink="[[noAnimation]]" dialog-dismiss>[[ dismissLabel ]]</paper-button>
        <paper-button slot="confirm-button" noink="[[noAnimation]]" dialog-confirm>[[ confirmLabel ]]</paper-button>
    </app-datepicker>`;
  }

  static get properties() {
    return {
      view: String,
      theme: String,
      firstDayOfWeek: Number,
      disableDays: Array,
      disableDates: Array,
      minDate: String,
      maxDate: String,
      format: String,
      date: {
        type: String,
        notify: true,
        readOnly: true
      },
      invalidDate: {
        type: Boolean,
        notify: true,
        readOnly: true
      },
      inputDate: String,
      showLongDate: Boolean,
      noAnimation: Boolean,
      pageEntryAnimation: String,
      pageExitAnimation: String,
      locale: String,
      confirmLabel: {
        type: String,
        value: "ok"
      },
      dismissLabel: {
        type: String,
        value: "cancel"
      },
      alwaysResetSelectedDateOnDialogClose: Boolean,

      _readOnlyDate: String,
      _readOnlyInvalidDate: String,
    };
  }

  ready() {
    super.ready();
    this.addEventListener("neon-animation-finish", this._onNeonAnimationFinish.bind(this));
    this.addEventListener("iron-overlay-closed", this._alwaysResetSelectedDate.bind(this));
  }

  _alwaysResetSelectedDate() {
    if (this.alwaysResetSelectedDateOnDialogClose) {
      this.async(function () {
        this.$.datePicker.resetDate();
      }.bind(this), 1);
    }
  }

  static get observers() {
    return [
      "_updateReadOnlyDate(_readOnlyDate)",
      "_updateReadOnlyInvalidDate(_readOnlyInvalidDate)",
      "_updateDatepickerView(view)",
    ];
  }

  _renderOpened() {
    if (this.withBackdrop) {
      this.backdropElement.open();
    }
    this.playAnimation("entry");
  }

  _renderClosed() {
    if (this.withBackdrop) {
      this.backdropElement.close();
    }
    this.playAnimation("exit");
  }

  _onNeonAnimationFinish() {
    if (this.opened) {
      this._finishRenderOpened();
    } else {
      this._finishRenderClosed();
    }
  }

  // Special method to update two-way binded read-only property.
  _updateReadOnlyDate(_readOnlyDate) {
    this._setDate(_readOnlyDate);
  }

  // Special method to update two-way binded read-only property.
  _updateReadOnlyInvalidDate(_readOnlyInvalidDate) {
    this._setInvalidDate(_readOnlyInvalidDate);
  }

  // Resize dialog to re-center the dialog when view is changed.
  _updateDatepickerView() {
    this.notifyResize();
  }

}
window.customElements.define("app-datepicker-dialog", AppDatepickerDialog);