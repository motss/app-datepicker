import { type PropertyValueMap, svg, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { RootElement } from '../../root-element/root-element.js';
import { defaultIconSize, defaultViewBox } from './constants.js';

export class Svg extends RootElement {
  #updateSize = (changedProperties: PropertyValueMap<this>) => {
    if (changedProperties.has('height') && changedProperties.get('height') !== this.height) {
      const height = Math.floor(this.height);
      this.style.height = CSS.px ? CSS.px(height).toString() : `${height}px`;
    }

    if (changedProperties.has('width') && changedProperties.get('width') !== this.width) {
      const width = Math.floor(this.width);
      this.style.width = CSS.px ? CSS.px(width).toString() : `${width}px`;
    }
  };

  @property({ attribute: false, type: Object }) content: TemplateResult<2> = svg``;

  @property() fill?: string;

  @property({ reflect: true, type: Number }) height: number = defaultIconSize;

  @property() stroke?: string;
  @property() strokeWidth?: string;
  @property({ reflect: true }) viewBox: string = defaultViewBox;
  @property({ reflect: true, type: Number }) width: number = defaultIconSize;

  protected override render(): TemplateResult {
    const {
      content,
      fill,
      stroke,
      strokeWidth,
      viewBox,
    } = this;
    const fillWithDefault = ifDefined(fill || 'currentColor');
    const viewBoxWithDefault = ifDefined(viewBox || '0 0 24 24');

    return svg`<svg
      fill=${fillWithDefault}
      stroke=${ifDefined(stroke)}
      stroke-width=${ifDefined(strokeWidth)}
      viewBox=${viewBoxWithDefault}
    >${content}</svg>`;
  }

  protected override willUpdate(changedProperties: PropertyValueMap<this>): void {
    this.#updateSize(changedProperties);
  }
}
