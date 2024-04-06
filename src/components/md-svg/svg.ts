import { nothing, svg, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { RootElement } from '../../root-element/root-element.js';
import type { Option } from '../../utility.types.js';
import { defaultFill, defaultIconSize, defaultViewBox } from './constants.js';
import type { SvgProperties } from './types.js';

export class Svg extends RootElement implements SvgProperties {
  @property({ attribute: false, type: Object }) content: Option<
    TemplateResult<2>
  >;

  @property() fill: Option<string>;

  @property({ reflect: true, type: Number }) height: Option<number>;

  @property() stroke: Option<string>;

  @property() strokeWidth: Option<string>;

  @property({ reflect: true }) viewBox: Option<string>;

  @property({ reflect: true, type: Number }) width: Option<number>;

  protected override render(): TemplateResult<2> | typeof nothing {
    const { content, fill, height, stroke, strokeWidth, viewBox, width } = this;

    return content
      ? svg`
        <svg
          fill=${ifDefined(fill || defaultFill)}
          height=${ifDefined(height || defaultIconSize)}
          stroke-width=${ifDefined(strokeWidth)}
          stroke=${ifDefined(stroke)}
          viewBox=${ifDefined(viewBox || defaultViewBox)}
          width=${ifDefined(width || defaultIconSize)}
        >${content}</svg>
        `
      : nothing;
  }
}
