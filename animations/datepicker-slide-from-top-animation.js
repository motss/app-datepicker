/*
`<datepicker-slide-from-top-animation>` animates the transform of an element from
`translateX(-100%)` to `none` and animates opacity from 0 to 1.
The `transformOrigin` defaults to `0 50%`.
Configuration:
```
{
  name: 'datepicker-slide-from-top-animation',
  node: <node>,
  transformOrigin: <transform-origin>,
  timing: <animation-timing>
}
```
*/
import { NeonAnimationBehavior } from '@polymer/neon-animation/neon-animation-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class DatepickerSlideFromTopAnimation extends
  mixinBehaviors([NeonAnimationBehavior], PolymerElement) {

  static get template() {
    return null
  }

  configure(config) {
    var node = config.node;

    if (config.transformOrigin) {
      this.setPrefixedProperty(node, 'transformOrigin', config.transformOrigin);
    } else {
      this.setPrefixedProperty(node, 'transformOrigin', '0 50%');
    }
    this._effect = new KeyframeEffect(node, [
      {offset: 0.0, 'transform': 'none', 'opacity': 1},
      {offset: 0.2, 'transform': 'translateY(20%)', 'opacity': 0.2},
      {offset: 1.0, 'transform': 'translateY(100%)', 'opacity': 0}
    ], this.timingFromConfig(config));
    return this._effect;
  }
}
window.customElements.define('datepicker-slide-from-top-animation', DatepickerSlideFromTopAnimation);

