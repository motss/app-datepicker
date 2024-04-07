import type { TemplateResult } from 'lit';

import type { Option } from '../../utility.types.js';

export interface MdSvgProperties extends SvgProperties {}

export interface SvgProperties {
  ariaLabel: HTMLElement['ariaLabel'];
  content: Option<TemplateResult<2>>;
  fill: Option<string>;
  height: Option<number>;
  role: HTMLElement['role'];
  stroke: Option<string>;
  strokeWidth: Option<string>;
  viewBox: Option<string>;
  width: Option<number>;
}
