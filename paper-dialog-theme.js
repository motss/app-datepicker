import "@polymer/polymer/polymer-element.js";

const $_documentContainer = document.createElement("template");
$_documentContainer.innerHTML = `<dom-module id="shared-styles">
  <template>
    <style>
      :host {
        display: block;
        margin: 24px 40px;
        -webkit-overflow-scrolling: touch;

        background: var(--paper-dialog-background-color, --primary-background-color);
        color: var(--paper-dialog-color, --primary-text-color);

        @apply(--paper-font-body1);
        @apply(--shadow-elevation-16dp);
        @apply(--paper-dialog);
      }

      :host > ::content > * {
        margin-top: 20px;
        padding: 0 24px;
      }

      :host > ::content > .no-padding {
        padding: 0;
      }

      :host > ::content > *:first-child {
        margin-top: 24px;
      }

      :host > ::content > *:last-child {
        margin-bottom: 24px;
      }

      :host > ::content h2 {
        position: relative;
        margin: 0;
        @apply(--paper-font-title);

        @apply(--paper-dialog-title);
      }

      :host > ::content .buttons {
        position: relative;
        padding: 8px 8px 8px 24px;
        margin: 0;

        color: var(--paper-dialog-button-color, --default-primary-color);

        @apply(--layout-horizontal);
        @apply(--layout-end-justified);
      }

    </style>`;
document.head.appendChild($_documentContainer.content);

