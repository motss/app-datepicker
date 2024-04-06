import type { TemplateResult } from 'lit';

import type { Option } from '../../utility.types.js';

export interface SvgProperties {
  content: Option<TemplateResult<2>>;
  fill: Option<string>;
  height: Option<number>;
  stroke: Option<string>;
  strokeWidth: Option<string>;
  viewBox: Option<string>;
  width: Option<number>;
}
