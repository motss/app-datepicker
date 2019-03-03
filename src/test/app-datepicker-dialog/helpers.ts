// type DatepickerTypes = AppDatepicker | AppDatepickerDialog;

import { AppDatepicker } from '../../app-datepicker';
import { AppDatepickerDialog } from '../../app-datepicker-dialog';
import { ElementTypes } from '../test-helpers';

import {
  shadowQuery,
  shadowQueryAll,
} from '../test-helpers';

export const getAppDatepickerEl = (el: AppDatepickerDialog) =>
  shadowQuery<AppDatepickerDialog, AppDatepicker>(el, 'app-datepicker');
export const getSelectableDateEl =
  <T extends ElementTypes, U extends ElementTypes>(el: T, label: string) =>
    shadowQuery<T, U>(
      el,
      `.calendar-container:nth-of-type(2) .full-calendar__day[aria-label="${label}"]`);
export const getAllDisabledDatesEl =
  <T extends ElementTypes, U extends ElementTypes>(el: T) =>
    shadowQueryAll<T, U>(
      el,
      '.calendar-container:nth-of-type(2) .full-calendar__day.day--disabled');
export const getFocusedDateEl =
  <T extends ElementTypes, U extends ElementTypes>(el: T) =>
    shadowQuery<T, U>(
      el,
      '.calendar-container:nth-of-type(2) .full-calendar__day.day--focused');
