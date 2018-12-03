/*
`<datepicker-slide-from-bottom-animation>` animates the transform of an element from
`translateX(-100%)` to `none` and animates opacity from 0 to 1.
The `transformOrigin` defaults to `0 50%`.
Configuration:
```
{
  name: "datepicker-slide-from-bottom-animation",
  node: <node>,
  transformOrigin: <transform-origin>,
  timing: <animation-timing>
}
```
*/
import { NeonAnimationBehavior } from "@polymer/neon-animation/neon-animation-behavior.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
import { PolymerElement } from "@polymer/polymer/polymer-element.js";

class DatepickerSlideFromBottomAnimation extends
  mixinBehaviors([NeonAnimationBehavior], PolymerElement) {

  static get template() {
    return null;
  }

  configure(config) {
    var node = config.node;

    if (config.transformOrigin) {
      this.setPrefixedProperty(node, "transformOrigin", config.transformOrigin);
    } else {
      this.setPrefixedProperty(node, "transformOrigin", "0 50%");
    }
    this._effect = new KeyframeEffect(node, [
      {offset: 0.0, "transform": "translateY(100%)", "opacity": 0},
      {offset: 0.8, "transform": "translateY(20%)", "opacity": 0},
      {offset: 1.0, "transform": "none", "opacity": 1}
    ], this.timingFromConfig(config));
    return this._effect;
  }
}
window.customElements.define("datepicker-slide-from-bottom-animation", DatepickerSlideFromBottomAnimation);