import { customElement } from 'lit/decorators.js';

import { mdSvgName } from './constants.js';
import { Svg } from './svg.js';

@customElement(mdSvgName)
export class MdSvg extends Svg {}

declare global {
  interface HTMLElementTagNameMap {
    [mdSvgName]: MdSvg;
  }
}
