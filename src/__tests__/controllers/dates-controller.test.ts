import { toUTCDate } from '@ipohjs/calendar/to-utc-date';
import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { describe, expect, it, vi } from 'vitest';

import { DatesController } from '../../controllers/dates-controller/dates-controller.js';
import type { DatesControllerHostProperties } from '../../controllers/dates-controller/types.js';
import { toDateString } from '../../helpers/to-date-string.js';
import { toResolvedDate } from '../../helpers/to-resolved-date.js';
import { RootElement } from '../../root-element/root-element.js';
import { createFixture } from '../__helpers__/create-fixture.js';

describe(DatesController.name, () => {
  const onConfirmByKey = vi.fn();
  const onUpdate = vi.fn();

  const render = createFixture(
    () => {
      class TestComponent
        extends RootElement
        implements DatesControllerHostProperties
      {
        #onConfirmByKey = (ev: KeyboardEvent) => {
          this.dates_.onDateUpdateByKey(
            ...([
              new KeyboardEvent('keydown', { altKey: false, key: ' ' }),
              ev.currentTarget,
              {
                disabledDatesSet: new Set(),
                disabledDaysSet: new Set(),
              },
            ] as Parameters<typeof this.dates_.onDateUpdateByKey>)
          );
        };

        #onDateUpdateByClick = (ev: MouseEvent) => {
          this.dates_.onDateUpdateByClick(
            ...([ev, ev.currentTarget, {}] as Parameters<
              typeof this.dates_.onDateUpdateByClick
            >)
          );
        };

        #onDateUpdateByKey = (ev: KeyboardEvent) => {
          this.dates_.onDateUpdateByKey(
            ...([
              new KeyboardEvent('keydown', { altKey: false, key: 'ArrowLeft' }),
              ev.currentTarget,
              {
                disabledDatesSet: new Set(),
                disabledDaysSet: new Set(),
              },
            ] as Parameters<typeof this.dates_.onDateUpdateByKey>)
          );
        };

        #onDateUpdateByKeyA = (ev: KeyboardEvent) => {
          this.dates_.onDateUpdateByKey(
            ...([
              new KeyboardEvent('keydown', { altKey: false, key: 'a' }),
              ev.currentTarget,
              {
                disabledDatesSet: new Set(),
                disabledDaysSet: new Set(),
              },
            ] as Parameters<typeof this.dates_.onDateUpdateByKey>)
          );
        };

        dates_ = new DatesController(this, {
          onConfirmByKey,
          onUpdate,
        });

        @property() disabledDates?: string = '';

        @property() disabledDays?: string = '';

        @property() max?: string = '';

        @property() min?: string = '';

        @property() value?: string = toResolvedDate().toJSON();

        protected override render(): TemplateResult {
          return html`
          <button id=byClick type=button @click=${this.#onDateUpdateByClick} data-day=1 data-fulldate=2020-02-01>1</button>
          <button id=byKey type=button @click=${this.#onDateUpdateByKey} data-day=2 data-fulldate=2020-02-02>2</button>
          <button id=byKeyA type=button @click=${this.#onDateUpdateByKeyA} data-day=2 data-fulldate=2020-02-02>2</button>
          <button id=confirm type=button @click=${this.#onConfirmByKey} data-day=2 data-fulldate=2020-02-02>2</button>
          `;
        }
      }
      return TestComponent;
    },
    {
      getByClick(n) {
        return n.root.querySelector<HTMLButtonElement>('#byClick');
      },
      getByKey(n) {
        return n.root.querySelector<HTMLButtonElement>('#byKey');
      },
      getByKeyA(n) {
        return n.root.querySelector<HTMLButtonElement>('#byKeyA');
      },
      getConfirm(n) {
        return n.root.querySelector<HTMLButtonElement>('#confirm');
      },
    }
  );

  it('returns dates correctly', async () => {
    const { element } = await render();

    expect(element.min).toBe('');
    expect(element.max).toBe('');
    expect(element.disabledDates).toBe('');
    expect(element.disabledDays).toBe('');
    expect(element.value).toBe(toResolvedDate().toJSON());

    expect(element.dates_).toBeDefined();
    expect(element.dates_.focusedDate).toEqual(toResolvedDate());
    expect(element.dates_.selectedDate).toEqual(toResolvedDate());
    expect(element.dates_.tabbableDate).toEqual(toResolvedDate());
    expect(element.dates_.onDateUpdateByClick).toEqual(expect.any(Function));
    expect(element.dates_.onDateUpdateByKey).toEqual(expect.any(Function));
    expect(element.dates_.reset).toEqual(expect.any(Function));
    expect(element.dates_.updateBy).toEqual(expect.any(Function));

    expect(onConfirmByKey).not.toBeCalled();
    expect(onUpdate).nthCalledWith(1, {
      focusedDate: toResolvedDate(),
      selectedDate: toResolvedDate(),
      tabbableDate: toResolvedDate(),
    });
  });

  it('updates dates correctly when host properties changes', async () => {
    const { element, updated } = await render();

    element.min = '2020-01-01';
    element.max = '2020-11-11';
    element.value = '2020-02-02';
    element.disabledDates = '2020-05-05';
    element.disabledDays = '1';
    await updated();

    expect(element.min).toBe('2020-01-01');
    expect(element.max).toBe('2020-11-11');
    expect(element.disabledDates).toBe('2020-05-05');
    expect(element.disabledDays).toBe('1');
    expect(element.value).toBe(toDateString(toResolvedDate('2020-02-02')));

    expect(element.dates_).toBeDefined();
    expect(element.dates_.focusedDate).toEqual(toResolvedDate('2020-02-02'));
    expect(element.dates_.selectedDate).toEqual(toResolvedDate('2020-02-02'));
    expect(element.dates_.tabbableDate).toEqual(toResolvedDate('2020-02-02'));
  });

  it('updates tabbableDate to first day of month with undefined disabledDates and undefined disabledDays when focusedDate and selectedDate are in different month', async () => {
    const { element, updated } = await render();

    element.disabledDates = undefined;
    element.disabledDays = undefined;
    element.dates_.updateBy({
      focusedDate: toResolvedDate('2020-02-02'),
    });
    await updated();

    expect(element.dates_).toBeDefined();
    expect(element.dates_.focusedDate).toEqual(
      new Date('2020-02-02T00:00:00.001Z')
    );
    expect(element.dates_.selectedDate).toEqual(toResolvedDate());
    expect(element.dates_.tabbableDate).toEqual(toResolvedDate('2020-02-01'));
  });

  it('updates tabbableDate to first day of month with defined disabledDates and defined disabledDays when focusedDate and selectedDate are in different month', async () => {
    const { element, updated } = await render();

    element.disabledDates = '2020-01-01';
    element.disabledDays = '1';
    element.dates_.updateBy({
      focusedDate: toResolvedDate('2020-02-02'),
    });
    await updated();

    expect(element.dates_).toBeDefined();
    expect(element.dates_.focusedDate).toEqual(
      new Date('2020-02-02T00:00:00.001Z')
    );
    expect(element.dates_.selectedDate).toEqual(toResolvedDate());
    expect(element.dates_.tabbableDate).toEqual(toResolvedDate('2020-02-01'));
  });

  it('updates value to undefined', async () => {
    const { element, updated } = await render();

    element.value = undefined;
    await updated();

    expect(element.value).toBeUndefined();

    expect(element.dates_).toBeDefined();
    expect(element.dates_.focusedDate).toEqual(toResolvedDate());
    expect(element.dates_.selectedDate).toEqual(toResolvedDate());
    expect(element.dates_.tabbableDate).toEqual(toResolvedDate());
  });

  it('calls updateBy()', async () => {
    const { element, updated } = await render();

    element.dates_.updateBy({
      focusedDate: toResolvedDate('2020-02-02'),
      selectedDate: toResolvedDate('2020-02-04'),
    });
    await updated();

    expect(element.dates_).toBeDefined();
    expect(element.dates_.focusedDate).toEqual(
      new Date('2020-02-02T00:00:00.001Z')
    );
    expect(element.dates_.selectedDate).toEqual(toResolvedDate('2020-02-04'));
    expect(element.dates_.tabbableDate).toEqual(toResolvedDate('2020-02-04'));

    expect(onUpdate).toBeCalledTimes(2);
    expect(onUpdate).lastCalledWith({
      focusedDate: new Date('2020-02-02T00:00:00.001Z'),
      selectedDate: toResolvedDate('2020-02-04'),
      tabbableDate: toResolvedDate('2020-02-04'),
    });
  });

  it('calls updateBy() without any new dates', async () => {
    const { element, updated } = await render();

    element.dates_.updateBy({});
    await updated();

    expect(element.dates_).toBeDefined();
    expect(element.dates_.focusedDate).toEqual(toResolvedDate());
    expect(element.dates_.selectedDate).toEqual(toResolvedDate());
    expect(element.dates_.tabbableDate).toEqual(toResolvedDate());

    expect(onUpdate).toBeCalledTimes(1);
  });

  it('calls onDateUpdateByClick()', async () => {
    const { element, getByClick, updated } = await render();

    expect(getByClick()).toBeInTheDocument();

    getByClick()?.click();
    await updated();

    expect(element.dates_).toBeDefined();
    expect(element.dates_.focusedDate).toEqual(toResolvedDate('2020-02-01'));
    expect(element.dates_.selectedDate).toEqual(toResolvedDate('2020-02-01'));
    expect(element.dates_.tabbableDate).toEqual(toResolvedDate('2020-02-01'));
  });

  it('calls onDateUpdateByKey()', async () => {
    const { element, getByKey, updated } = await render();

    expect(getByKey()).toBeInTheDocument();

    getByKey()?.click();
    await updated();

    expect(element.dates_.focusedDate).toEqual(
      toUTCDate(toResolvedDate(), { day: -1 })
    );
    expect(element.dates_.selectedDate).toEqual(
      toUTCDate(toResolvedDate(), { day: -1 })
    );
    expect(element.dates_.tabbableDate).toEqual(
      toUTCDate(toResolvedDate(), { day: -1 })
    );
  });

  it('calls onDateUpdateByKey() but focused date not change because it is the min date', async () => {
    const { element, getByKey, updated } = await render();

    expect(getByKey()).toBeInTheDocument();

    element.min = '2020-02-02';
    element.value = '2020-02-02';
    await updated();

    expect(element.value).toBe('2020-02-02');
    expect(element.min).toBe('2020-02-02');
    expect(element.dates_.focusedDate).toEqual(toResolvedDate('2020-02-02'));
    expect(element.dates_.selectedDate).toEqual(toResolvedDate('2020-02-02'));
    expect(element.dates_.tabbableDate).toEqual(toResolvedDate('2020-02-02'));

    getByKey()?.click();
    await updated();

    expect(element.dates_.focusedDate).toEqual(toResolvedDate('2020-02-02'));
    expect(element.dates_.selectedDate).toEqual(toResolvedDate('2020-02-02'));
    expect(element.dates_.tabbableDate).toEqual(toResolvedDate('2020-02-02'));
  });

  it('calls onDateUpdateByKey() with key=a', async () => {
    const { element, getByKeyA, updated } = await render();

    expect(getByKeyA()).toBeInTheDocument();

    getByKeyA()?.click();
    await updated();

    expect(element.dates_.focusedDate).toEqual(toResolvedDate());
    expect(element.dates_.selectedDate).toEqual(toResolvedDate());
    expect(element.dates_.tabbableDate).toEqual(toResolvedDate());
  });

  it('calls onConfirmByKey()', async () => {
    const { element, getConfirm, updated } = await render();

    expect(getConfirm()).toBeInTheDocument();

    getConfirm()?.click();
    await updated();

    expect(element.dates_).toBeDefined();
    expect(element.dates_.focusedDate).toEqual(toResolvedDate());
    expect(element.dates_.selectedDate).toEqual(toResolvedDate());
    expect(element.dates_.tabbableDate).toEqual(toResolvedDate());

    expect(onConfirmByKey).nthCalledWith(1, expect.any(KeyboardEvent), {
      focusedDate: toResolvedDate(),
      selectedDate: toResolvedDate(),
      tabbableDate: toResolvedDate(),
    });
  });

  it('calls reset()', async () => {
    const { element, updated } = await render();

    element.dates_.updateBy({
      focusedDate: toResolvedDate('2020-02-02'),
      selectedDate: toResolvedDate('2020-02-02'),
    });
    await updated();

    expect(element.dates_).toBeDefined();
    expect(element.dates_.focusedDate).toEqual(
      new Date('2020-02-02T00:00:00.001Z')
    );
    expect(element.dates_.selectedDate).toEqual(toResolvedDate('2020-02-02'));
    expect(element.dates_.tabbableDate).toEqual(toResolvedDate('2020-02-02'));

    element.dates_.reset();
    await updated();

    expect(element.dates_.focusedDate).toEqual(toResolvedDate());
    expect(element.dates_.selectedDate).toEqual(toResolvedDate());
    expect(element.dates_.tabbableDate).toEqual(toResolvedDate());
  });
});
