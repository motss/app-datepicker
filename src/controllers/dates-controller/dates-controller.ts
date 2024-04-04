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
  InferredFromSet,
  SupportedKey,
} from '../../types.js';
import type { DatesControllerHostProperties, DatesControllerProperties } from './types.js';

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
  T extends DatesControllerHostProperties,
> implements DatesControllerProperties, ReactiveController
{
  #host: ReactiveControllerHost & T;
  #max?: string;
  #maxDate: Date = toResolvedDate(MAX_DATE);
  #min?: string;
  #minDate: Date = toResolvedDate(MIN_DATE);
  #onConfirmByKey: Init['onConfirmByKey'];

  #update = () => {
    const { max, min, value } = this.#host;

    if (max !== this.#max) {
      this.#max = max;
      this.#maxDate = toResolvedDate(max || MAX_DATE);
    }

    if (min !== this.#min) {
      this.#min = min;
      this.#minDate = toResolvedDate(min || MIN_DATE);
    }

    if (value !== this.#value) {
      this.#value = value ?? undefined;

      const valueDate = toResolvedDate(value);

      this.updateBy({
         focusedDate: valueDate,
         selectedDate: valueDate,
      });
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
      const disabledDateList = splitString(disabledDates ?? '', toResolvedDate);
      const disabledDayList = splitString(disabledDays ?? '', Number);

      this.tabbableDate = toNextSelectedDate({
        currentDate: focusedDate,
        date: selectedDate,
        disabledDatesSet: new Set(disabledDateList.map((d) => d.getTime())),
        disabledDaysSet: new Set(disabledDayList),
        hasAltKey: false,
        key: keyHome,
        maxTime: this.#maxDate.getTime(),
        minTime: this.#minDate.getTime(),
      });
    }

    this.#host.requestUpdate();
  };

  #value?: string;

  focusedDate: Date = toResolvedDate();

  onDateUpdateByClick: DatesControllerProperties['onDateUpdateByClick'] = (
    _ev,
    node
  ) => {
    const fullDate = toResolvedDate(
      node.dataset.fulldate
    );

    this.updateBy({
      focusedDate: fullDate,
      selectedDate: fullDate,
    });
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
        /**
         * TODO: Add the following back if anything breaks because of the removal:
         *
         * ```ts
         * || nextDateTime !== selectedDate.getTime()
         * ```
         *
         * Why removing this as of writing?
         * It is because it seems like it is not possible to update selected date
         * without updating focused date. Focused date will always be updated
         * especially updating it with a `KeyboardEvent`. When selected date is
         * updated, focused date will be updated as well. Checking focused date
         * here should suffice.
        */
        nextDateTime !== focusedDate.getTime()
      ) {
        this.updateBy({
          focusedDate: nextDate,
          selectedDate: nextDate,
        });
      }
    } else if (
      confirmKeySet.has(ev.key as InferredFromSet<typeof confirmKeySet>)
    ) {
      const { focusedDate, selectedDate, tabbableDate } = this;

      this.#onConfirmByKey?.(ev, {
        focusedDate,
        selectedDate,
        tabbableDate,
      });
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
      this.#updateTabbableDate(this.focusedDate, this.selectedDate);
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

  reset() {
    const newValue = toResolvedDate(this.#value);

    this.updateBy({
      focusedDate: newValue,
      selectedDate: newValue,
    });
  }
}
