import { svg, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { PropertyChangeController } from '../../controllers/property-change-controller/property-change-controller.js';
import { RootElement } from '../../root-element/root-element.js';
import { defaultIconSize, defaultViewBox } from './constants.js';

export class Svg extends RootElement {
  @property({ attribute: false, type: Object }) content: TemplateResult<2> =
    svg``;

  @property() fill?: string;
  @property({ reflect: true, type: Number }) height: number = defaultIconSize;
  @property() stroke?: string;
  @property() strokeWidth?: string;
  @property({ reflect: true }) viewBox: string = defaultViewBox;
  @property({ reflect: true, type: Number }) width: number = defaultIconSize;

  constructor() {
    super();

    new PropertyChangeController(this, {
      onChange: (_, height) => {
        const flooredHeight = Math.floor(height);
        this.style.height = CSS.px
          ? CSS.px(flooredHeight).toString()
          : `${flooredHeight}px`;
      },
      property: 'height',
    });

    new PropertyChangeController(this, {
      onChange: (_, width) => {
        const flooredWidth = Math.floor(width);
        this.style.width = CSS.px
          ? CSS.px(flooredWidth).toString()
          : `${flooredWidth}px`;
      },
      property: 'width',
    });
  }

  protected override render(): TemplateResult {
    const { content, fill, stroke, strokeWidth, viewBox } = this;
    const fillWithDefault = ifDefined(fill || 'currentColor');
    const viewBoxWithDefault = ifDefined(viewBox || '0 0 24 24');

    return svg`<svg
      fill=${fillWithDefault}
      stroke=${ifDefined(stroke)}
      stroke-width=${ifDefined(strokeWidth)}
      viewBox=${viewBoxWithDefault}
    >${content}</svg>`;
  }
}
