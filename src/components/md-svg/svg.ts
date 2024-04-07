import { nothing, svg, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { RootElement } from '../../root-element/root-element.js';
import type { Option } from '../../utility.types.js';
import { defaultFill, defaultIconSize, defaultViewBox } from './constants.js';
import type { SvgProperties } from './types.js';

export class Svg extends RootElement implements SvgProperties {
  @property() override ariaLabel: null | string = null;

  @property({ attribute: false, type: Object }) content: Option<
    TemplateResult<2>
  >;

  @property() fill: Option<string>;

  @property({ type: Number }) height: Option<number>;

  @property() override role: null | string = null;

  @property() stroke: Option<string>;

  @property() strokeWidth: Option<string>;

  @property() viewBox: Option<string>;

  @property({ type: Number }) width: Option<number>;

  protected override render(): TemplateResult<2> | typeof nothing {
    const { ariaLabel, content, fill, height, role, stroke, strokeWidth, viewBox, width } = this;

    const ariaLabelledBy = ariaLabel ? `labelled-by-01HTW8130BTX50Y28XJX9S6CQA-${Math.random().toString(36).slice(-7)}` : undefined;
    const ariaHidden = ariaLabel ? 'false' : 'true';

    return content
      ? svg`
        <svg
          aria-hidden=${ifDefined(ariaHidden)}
          aria-label=${ifDefined(ariaLabel)}
          aria-labelledby=${ifDefined(ariaLabelledBy)}
          fill=${ifDefined(fill || defaultFill)}
          height=${ifDefined(height || defaultIconSize)}
          role=${ifDefined(role)}
          stroke-width=${ifDefined(strokeWidth)}
          stroke=${ifDefined(stroke)}
          viewBox=${ifDefined(viewBox || defaultViewBox)}
          width=${ifDefined(width || defaultIconSize)}
        >
          ${ariaLabel && ariaLabelledBy ? svg`<title id=${ariaLabelledBy}>${ariaLabel}</title>` : svg``}
          ${content}
        </svg>
        `
      : nothing;
  }
}
