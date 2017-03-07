/**
 * A contructor for AppDatepicker
 *
 * @class AppDatepicker
 * @extends {Polymer.Element}
 */
class AppDatepicker extends Polymer.Element {
  /**
   * Required id for <dom-module> for Polymer to pick up
   * the dom-module to stamp the template.
   *
   * @readonly
   * @static
   *
   * @memberOf AppDatepicker
   */
  static get is() {
    return 'app-datepicker';
  }

  /**
   * Polymer-specific properties.
   *
   * @readonly
   *
   * @memberOf AppDatepicker
   */
  get properties() {
    return {

    };
  }

  /**
   * Polymer-specific observedAttributes.
   *
   * @readonly
   *
   * @memberOf AppDatepicker
   */
  get observedAttributes() {
    return [

    ];
  }

  /**
   * Creates an instance of AppDatepicker.
   *
   * @memberOf AppDatepicker
   */
  constructor() {
    super();

    console.info('created!');
  }

  /**
   * Extended version of connectedCallback method
   * from Native Custom Element v1.
   *
   * @memberOf AppDatepicker
   */
  connectedCallback() {
    super.connectedCallback();

    console.info('connected.');
  }

  /**
   * Extended version of disconnectedCallback method
   * from Native Custom Element v1.
   *
   * @memberOf AppDatepicker
   */
  disconnectedCallback() {
    super.disconnectedCallback();

    console.info('disconnected.');
  }
}

window.customElements.define(AppDatepicker.is, AppDatepicker);
