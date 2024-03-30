import type { ReactiveController, ReactiveControllerHost } from 'lit';

import {
  confirmKeySet,
  MAX_DATE,
  MIN_DATE,
  navigationKeySetGrid,
} from '../../constants.js';
import { isSameMonth } from '../../helpers/is-same-month.js';
import { splitString } from '../../helpers/split-string.js';
import { toNextSelectedDate } from '../../helpers/to-next-selected-date.js';
import { toResolvedDate } from '../../helpers/to-resolved-date.js';
import { keyHome } from '../../key-values.js';
import type {
  DatePickerProperties,
  InferredFromSet,
  SupportedKey,
} from '../../types.js';
import type { DatesControllerProperties } from './types.js';

interface Init {
  onConfirmByKey?(
    ev: KeyboardEvent,
    data: Pick<
      DatesControllerProperties,
      'focusedDate' | 'selectedDate' | 'tabbableDate'
    >
  ): void;
}

export class DatesController<
  T extends Pick<
    DatePickerProperties,
    'disabledDates' | 'disabledDays' | 'max' | 'min' | 'value'
  >,
> implements DatesControllerProperties, ReactiveController
{
  #host: ReactiveControllerHost & T;
  #max?: string;
  #maxDate: Date = toResolvedDate(MAX_DATE);
  #min?: string;
  #minDate: Date = toResolvedDate(MIN_DATE);
  #onConfirmByKey: Init['onConfirmByKey'];

  #requestHostUpdate = () => {
    this.#host.requestUpdate();
  };

  #update = () => {
    const { max, min, value } = this.#host;
    const { focusedDate, selectedDate } = this;

    if (max !== this.#max) {
      this.#max = max;
      this.#maxDate = toResolvedDate(max || MAX_DATE);
    }

    if (min !== this.#min) {
      this.#min = min;
      this.#minDate = toResolvedDate(min || MIN_DATE);
    }

    if (value !== this.#value) {
      this.#value = value ?? '';
      this.focusedDate = this.selectedDate = toResolvedDate(value);
    }

    if (focusedDate || selectedDate) {
      this.#updateTabbableDate(focusedDate, selectedDate);
    }
  };

  #updateTabbableDate = (focusedDate: Date, selectedDate: Date) => {
    const { disabledDates, disabledDays } = this.#host;

    const isWithinSameMonth = isSameMonth(selectedDate, focusedDate);

    if (isWithinSameMonth) {
      this.tabbableDate = this.selectedDate;
    } else {
      /**
       * NOTE: This reset tabindex of a tab-able calendar day to
       * the first day of month when navigating away from the current month
       * where the focused/ selected date is no longer in the new current month.
       */
      const disabledDateList = splitString(disabledDates, toResolvedDate);
      const disabledDayList = splitString(disabledDays, Number);

      this.tabbableDate = toNextSelectedDate({
        currentDate: focusedDate,
        date: selectedDate,
        disabledDatesSet: new Set(disabledDateList?.map((d) => d.getTime())),
        disabledDaysSet: new Set(disabledDayList),
        hasAltKey: false,
        key: keyHome,
        maxTime: this.#maxDate.getTime(),
        minTime: this.#minDate.getTime(),
      });
    }

    this.#requestHostUpdate();
  };

  #value?: string;

  focusedDate: Date = toResolvedDate();

  onDateUpdateByClick: DatesControllerProperties['onDateUpdateByClick'] = (
    _ev,
    node
  ) => {
    this.focusedDate = this.selectedDate = toResolvedDate(
      node.dataset.fulldate
    );
    this.#requestHostUpdate();
  };

  onDateUpdateByKey: DatesControllerProperties['onDateUpdateByKey'] = (
    ev,
    _node,
    { disabledDatesSet, disabledDaysSet }
  ) => {
    if (
      navigationKeySetGrid.has(
        ev.key as InferredFromSet<typeof navigationKeySetGrid>
      )
    ) {
      const { focusedDate, selectedDate } = this;

      const nextDate = toNextSelectedDate({
        currentDate: focusedDate,
        date: selectedDate,
        disabledDatesSet,
        disabledDaysSet,
        hasAltKey: ev.altKey,
        key: ev.key as SupportedKey,
        maxTime: this.#maxDate.getTime(),
        minTime: this.#minDate.getTime(),
      });
      const nextDateTime = nextDate.getTime();

      if (
        nextDateTime !== focusedDate.getTime() ||
        nextDateTime !== selectedDate.getTime()
      ) {
        this.focusedDate = this.selectedDate = nextDate;
        this.#requestHostUpdate();
      }
    } else if (
      confirmKeySet.has(ev.key as InferredFromSet<typeof confirmKeySet>)
    ) {
      this.#onConfirmByKey?.(ev, this);
    }
  };

  selectedDate: Date = toResolvedDate();

  tabbableDate: Date = toResolvedDate();

  updateBy: DatesControllerProperties['updateBy'] = ({
    focusedDate,
    selectedDate,
  }) => {
    let didUpdate = 0;

    if (focusedDate) {
      this.focusedDate = toResolvedDate(focusedDate);
      didUpdate ||= 1;
    }

    if (selectedDate) {
      this.selectedDate = toResolvedDate(selectedDate);
      didUpdate ||= 1;
    }

    if (didUpdate) {
      this.#requestHostUpdate();
    }
  };

  constructor(host: ReactiveControllerHost & T, init?: Init) {
    this.#host = host;
    this.#onConfirmByKey = init?.onConfirmByKey;

    host.addController(this);
  }

  hostConnected(): void {
    this.#update();
  }

  hostUpdate(): void {
    this.#update();
  }
}
