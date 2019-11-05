import { PropertyValue } from '@reallyland/really-elements/dist/code-configurator/code-configurator.js';

import {
  getResolvedDate,
  getResolvedLocale,
  toFormattedDateString,
} from '../datepicker-helpers.js';
import { StartView, WeekNumberType } from '../typings.js';
import { locales } from './locales.js';

const properties: PropertyValue[] = [
  {
    name: 'firstDayOfWeek',
    value: 0,
    type: 'number',
  },
  {
    name: 'showWeekNumber',
    value: false,
    type: 'boolean',
  },
  {
    name: 'weekNumberType',
    value: 'first-4-day-week' as WeekNumberType,
    type: 'string',
    options: ([
      'first-4-day-week',
      'first-day-of-year',
      'first-full-week',
    ] as WeekNumberType[]).map((n) => {
      return { label: n, value: n };
    }),
  },
  {
    name: 'landscape',
    value: false,
    type: 'boolean',
  },
  {
    name: 'startView',
    value: 'calendar' as StartView,
    type: 'string',
    options: ([
      'calendar',
      'yearList',
    ] as StartView[]).map((n) => {
      return { label: n, value: n };
    }),
  },
  {
    name: 'min',
    value: '',
    type: 'string',
  },
  {
    name: 'max',
    value: '',
    type: 'string',
  },
  {
    name: 'value',
    value: toFormattedDateString(getResolvedDate()),
    type: 'string',
  },
  {
    name: 'locale',
    value: getResolvedLocale(),
    type: 'string',
    options: locales.map(n => ({ label: n.name, value: n.code })),
  },
  {
    name: 'disabledDays',
    value: '',
    type: 'string',
  },
  {
    name: 'disabledDates',
    value: '',
    type: 'string',
  },
  {
    name: 'weekLabel',
    value: 'Wk',
    type: 'string',
  },
  // {
  //   name: 'dragRatio',
  //   value: .15,
  //   type: 'number',
  // },
];

const cssProperties: PropertyValue[] = [
  {
    name: '--app-datepicker-accent-color',
    value: '#1a73e8',
  },
  {
    name: '--app-datepicker-bg-color',
    value: '#fff',
  },
  {
    name: '--app-datepicker-border-bottom-left-radius',
    value: '8px',
  },
  {
    name: '--app-datepicker-border-bottom-right-radius',
    value: '8px',
  },
  {
    name: '--app-dateicker-border-top-left-radius',
    value: '8px',
  },
  {
    name: '--app-datepicker-border-top-right-radius',
    value: '8px',
  },
  {
    name: '--app-datepicker-color',
    value: '#000',
  },
  {
    name: '--app-datepicker-disabled-day-color',
    value: 'rgba(0, 0, 0, .35)',
  },
  {
    name: '--app-datepicker-focused-day-color',
    value: '#fff',
  },
  {
    name: '--app-datepicker-selector-color',
    value: 'rgba(0, 0, 0, .55)',
  },
  {
    name: '--app-datepicker-separator-color',
    value: '#ddd',
  },
  {
    name: '--app-datepicker-weekday-color',
    value: 'rgba(0, 0, 0, .55)',
  },
];

const propertiesDialog: PropertyValue[] = [
  ...properties,
  {
    name: 'dismissLabel',
    value: 'cancel',
    type: 'string',
  },
  {
    name: 'confirmLabel',
    value: 'ok',
    type: 'string',
  },
  {
    name: 'noFocusTrap',
    value: false,
    type: 'boolean',
  },
];

const cssPropertiesDialog: PropertyValue[] = [
  ...cssProperties,
  {
    name: '--app-datepicker-dialog-border-radius',
    value: '8px',
  },
  {
    name: '--app-datepicker-dialog-scrim-bg-color',
    value: 'rgba(0, 0, 0, .55)',
  },
  {
    name: '--app-datepicker-dialog-z-index',
    value: '24',
  },
];

export { properties, cssProperties, propertiesDialog, cssPropertiesDialog };
