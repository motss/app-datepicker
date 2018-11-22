import "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-button/paper-button.js";
import "../app-datepicker-dialog.js";
import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";

class BindDateToInputDate extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
        box-sizing: border-box;
      }

      * {
        box-sizing: border-box;
      }

      .container {
        position: relative;
      }

      paper-button {
        background-color: #4285f4;
        color: #fff;
        margin: 24px;
      }
    </style>

    <div class="container">
      <paper-button raised="" on-tap="openStartDate">[[planDate.startDate]]</paper-button>
      <div>Selected date: [[planDate.startDate]]</div>

      <app-datepicker-dialog id="startDatePicker" date="{{planDate.startDate}}" input-date="[[planDate.startDate]]" with-backdrop=""></app-datepicker-dialog>
    </div>`;
  }

  static get properties() {
    return {
      planDate: {
        type: Object,
        value: () => {
          return {
            startDate: "2016/12/01",
            endDate: "2016/12/31",
          };
        },
        observer: "_planDateChanged",
      },
    };
  }

  openStartDate() {
    this.$.startDatePicker.open();
  }

  _planDateChanged(_newv, _oldv) {
    console.log("plan-date-changed:", _newv, _oldv);
  }

}

window.customElements.define("bind-date-to-input-date", BindDateToInputDate);