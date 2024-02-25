import { svg, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { RootElement } from '../root-element/root-element.js';
import { defaultIconSize, defaultViewBox, mdSvgName } from './constants.js';

@customElement(mdSvgName)
export class MdSvg extends RootElement {
  @property({ attribute: false, type: Object }) content: TemplateResult<2> = svg``;

  @property({ reflect: true, type: Number }) height: number = defaultIconSize;

  @property({ reflect: true }) viewBox: string = defaultViewBox;

  @property({ reflect: true, type: Number }) width: number = defaultIconSize;

  protected override render(): TemplateResult {
    const {
      content,
      height,
      viewBox,
      width,
    } = this;

    return svg`
    <svg fill=currentColor height=${height} width=${width} viewBox=${viewBox ?? '0 0 24 24'}>
      ${content}
    </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [mdSvgName]: MdSvg;
  }
}
