import '@material/web/iconbutton/icon-button.js';
import '@material/web/textfield/outlined-text-field.js';
import '../app-calendar/app-calendar.js';
import '../md-menu-surface/md-menu-surface.js';
import '../md-svg/md-svg.js';
import './header/docked-date-picker-header.js';
import './menu-list/docked-date-picker-menu-list.js';

import { fromPartsToUtcDate } from '@ipohjs/calendar/from-parts-to-utc-date';
import type { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js';
import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, ref } from 'lit/directives/ref.js';

import {
  labelConfirm,
  labelDeny,
  labelMonthMenuItemTemplate,
  labelNextMonth,
  labelNextYear,
  labelPreviousMonth,
  labelPreviousYear,
  labelSelectedMonthMenuItemTemplate,
  labelSelectedYearMenuItemTemplate,
  labelShowCalendar,
  labelSupportingText,
  labelYearMenuItemTemplate,
  renderNoop,
} from '../../constants.js';
import { DatesController } from '../../controllers/dates-controller/dates-controller.js';
import { PropertyChangeController } from '../../controllers/property-change-controller/property-change-controller.js';
import { toDateString } from '../../helpers/to-date-string.js';
import { toResolvedDate } from '../../helpers/to-resolved-date.js';
import { iconCalendar } from '../../icons.js';
import { DatePickerMixin } from '../../mixins/date-picker-mixin/date-picker-mixin.js';
import { MinMaxMixin } from '../../mixins/min-max-mixin/min-max-mixin.js';
import { ValueMixin } from '../../mixins/value-mixin/value-mixin.js';
import { RootElement } from '../../root-element/root-element.js';
import { renderActions } from '../../templates/render-actions/render-actions.js';
import type { MenuListType } from '../../types.js';
import { renderCalendarDay } from '../app-calendar/helpers/render-calendar-day/render-calendar-day.js';
import { renderWeekDay } from '../app-calendar/helpers/render-week-day/render-week-day.js';
import type { CalendarProperties } from '../app-calendar/types.js';
import type { DockedDatePickerHeader } from './header/docked-date-picker-header.js';
import type { DockedDatePickerMenuList } from './menu-list/docked-date-picker-menu-list.js';
import type { DatePickerProperties } from './types.js';

const yOffset = 7;

export class DatePicker
  extends DatePickerMixin(MinMaxMixin(ValueMixin(RootElement)))
  implements DatePickerProperties
{
  #$body = createRef<HTMLDivElement>();

  #$header = createRef<DockedDatePickerHeader>();

  #$hot = createRef<this>();

  #$menuList = createRef<DockedDatePickerMenuList>();

  #$textField = createRef<MdOutlinedTextField>();

  #didConfirm = false;

  #onClosed = (ev: CustomEvent<object>) => {
    const { _$dates_ } = this;

    if (this.#didConfirm) {
      this.value = toDateString(_$dates_.selectedDate);
      this.#didConfirm = false;
    } else {
      this.reset();
    }

    this.startView = 'calendar';
    this.#propagateCustomEvent(ev);
  };

  #onClosing = (ev: CustomEvent<object>) => {
    this.close();
    this.#propagateCustomEvent(ev);
  };

  #onConfirm = () => {
    this.#didConfirm = true;
    this.close();
  };

  #onDeny = () => {
    this.close();
  };

  #onMenuChange: DockedDatePickerMenuList['onMenuChange'] = ({
    type,
    value,
  }) => {
    const { _$dates_ } = this;
    const y = _$dates_.focusedDate.getUTCFullYear();
    const m = _$dates_.focusedDate.getUTCMonth();
    const d = _$dates_.focusedDate.getUTCDate();

    this._$dates_.updateBy({
      focusedDate: fromPartsToUtcDate(
        type === 'yearMenu' ? value : y,
        type === 'monthMenu' ? value : m,
        d
      ),
    });
    this.startView = 'calendar';
  };

  #onOpened = async (ev: CustomEvent<object>) => {
    if (this.startView === 'calendar') {
      await this.updateComplete;

      const header = this.#$header.value;

      if (header) {
        await header.updateComplete;

        const monthMenuButton = await header.getMonthMenuButton();

        if (monthMenuButton) {
          await monthMenuButton.updateComplete;

          monthMenuButton.focus();
        }
      }
    }

    this.#propagateCustomEvent(ev);
  };

  #onOpening = (ev: CustomEvent<object>) => {
    this.show();
    this.#propagateCustomEvent(ev);
  };

  #propagateCustomEvent = (ev: CustomEvent<object>) => {
    this.fire({ detail: ev.detail, type: ev.type });
  };

  #renderCalendarDay: CalendarProperties['renderCalendarDay'] = ({ data }) => {
    const { _$dates_ } = this;

    return renderCalendarDay({
      data,
      selectedDate: _$dates_.selectedDate,
      tabbableDate: _$dates_.tabbableDate,
      todayDate: this.#todayDate,
    });
  };

  #renderWeekDay: CalendarProperties['renderWeekDay'] = ({ weekday }) => {
    return renderWeekDay(weekday);
  };

  #scrollSelectedMenuListItemIntoView = async () => {
    const body = this.#$body.value;
    const listItems = (await this.#$menuList.value?.getListItems()) ?? [];
    const selectedListItemIdx = listItems.findIndex(
      (n) => !n.disabled && n.tabIndex > -1
    );

    if (body && selectedListItemIdx > -1) {
      const [firstListItem] = listItems;

      if (firstListItem) {
        const containerMarginTop = 8;
        const offsetToCenter = 3;

        const listItemRect = firstListItem.getBoundingClientRect();

        body.scrollTop =
          (selectedListItemIdx - offsetToCenter) * listItemRect.height +
          containerMarginTop;
      }
    }
  };

  readonly #todayDate: Date = toResolvedDate();

  #toggleMenuSurface = () => {
    if (this.open) {
      this.close();
    } else {
      this.show();
    }
  };

  #updateStartViewByMenuListType: DockedDatePickerHeader['onMonthMenuClick'] = (
    init
  ) => {
    switch (init.type) {
      case 'monthDec':
      case 'monthInc':
      case 'yearDec':
      case 'yearInc': {
        this._$dates_.updateBy({ focusedDate: init.date });
        break;
      }
      case 'monthMenu':
      case 'yearMenu': {
        const { startView } = this;

        this.startView =
          startView === 'monthMenu' || startView === 'yearMenu'
            ? 'calendar'
            : init.type;

        break;
      }
      default:
    }
  };

  #updateTextFieldFocusedTo = (focused: boolean) => {
    /**
     * NOTE: A workaround to ensure that the text field renders in its focused state
     * when the user focuses the menu surface.
     */
    interface MdOutlinedTextFieldWithFocused
      extends Omit<MdOutlinedTextField, 'focused'> {
      focused: boolean;
    }

    (
      this.#$textField.value as unknown as MdOutlinedTextFieldWithFocused
    ).focused = focused;
  };

  private _$dates_ = new DatesController(this, {
    onConfirmByKey: this.#onConfirm,
  });

  @property() calendarIconLabel: string = labelShowCalendar;

  @property() confirmText: string = labelConfirm;

  @property() denyText: string = labelDeny;

  @property() label = '';

  @property({ reflect: true, type: Boolean }) open = false;

  /**
   * Opens the menu synchronously with no animation.
   */
  @property({ type: Boolean }) quick = false;

  @property({ reflect: true }) startView: 'calendar' | MenuListType =
    'calendar';

  @property({ reflect: true }) supportingText: string = labelSupportingText;

  constructor() {
    super();

    new PropertyChangeController(this, {
      onUpdated: this.#scrollSelectedMenuListItemIntoView,
      order: 'updated',
      property: 'startView',
    });
  }

  close(): void {
    this.open = false;
    this.#updateTextFieldFocusedTo(false);
  }

  protected override render(): TemplateResult {
    const {
      _$dates_,
      calendarIconLabel,
      chooseMonthLabel,
      chooseYearLabel,
      confirmText,
      denyText,
      disabledDates,
      disabledDays,
      firstDayOfWeek,
      label,
      locale,
      max,
      min,
      nextMonthLabel,
      open,
      previousMonthLabel,
      quick,
      selectDateLabel,
      selectedDateLabel,
      selectedYearTemplate,
      shortWeekLabel,
      showWeekNumber,
      startView,
      supportingText,
      todayLabel,
      toyearTemplate,
      value,
      weekLabel,
      weekNumberTemplate,
      weekNumberType,
    } = this;

    const anchorId = 'field_01HQDDHBZFASJH3XSA4GJC0TZA';
    const focusedValue = toDateString(_$dates_.focusedDate);
    const valueValue = toDateString(toResolvedDate(value));

    return html`
    <div ${ref(this.#$hot)}>
      <md-outlined-text-field
        ${ref(this.#$textField)}
        id=${anchorId}
        label=${label}
        value=${valueValue}
        supporting-text=${supportingText}
      >
        <md-icon-button
          slot="trailing-icon"
          @click=${this.#toggleMenuSurface}
          aria-label=${calendarIconLabel}
          title=${calendarIconLabel}
        >
          <md-svg .content=${iconCalendar}></md-svg>
        </md-icon-button>
      </md-outlined-text-field>

      <div class=menu>
        <md-menu-surface
          ?open=${open}
          ?quick=${quick}
          @closed=${this.#onClosed}
          @closing=${this.#onClosing}
          @opening=${this.#onOpening}
          @opened=${this.#onOpened}
          anchor=${anchorId}
          stay-open-on-focusout
          y-offset=${yOffset}
        >
          <div
            class=${classMap({ [startView]: true })}
            style="display:contents;"
          >
            <docked-date-picker-header
              ${ref(this.#$header)}
              class=header
              locale=${locale}
              max=${ifDefined(max)}
              min=${ifDefined(min)}
              value=${focusedValue}
              nextMonthButtonLabel=${labelNextMonth}
              prevMonthButtonLabel=${labelPreviousMonth}
              nextYearButtonLabel=${labelNextYear}
              prevYearButtonLabel=${labelPreviousYear}
              startView=${startView}
              .onMonthMenuClick=${this.#updateStartViewByMenuListType}
              .onYearMenuClick=${this.#updateStartViewByMenuListType}
            ></docked-date-picker-header>

            <div
              class=body
              ${ref(this.#$body)}
            >${
              startView === 'calendar'
                ? html`
                  <app-calendar
                    ?showWeekNumber=${showWeekNumber}
                    .max=${max}
                    .min=${min}
                    .onDateUpdateByClick=${_$dates_.onDateUpdateByClick}
                    .onDateUpdateByKey=${_$dates_.onDateUpdateByKey}
                    .renderCalendarDay=${this.#renderCalendarDay}
                    .renderFooter=${renderNoop}
                    .renderWeekDay=${this.#renderWeekDay}
                    .renderWeekLabel=${renderNoop}
                    .renderWeekNumber=${renderNoop}
                    .value=${focusedValue}
                    chooseMonthLabel=${chooseMonthLabel}
                    chooseYearLabel=${chooseYearLabel}
                    class=appCalendar
                    disabledDates=${disabledDates}
                    disabledDays=${disabledDays}
                    firstDayOfWeek=${firstDayOfWeek}
                    locale=${locale}
                    nextMonthLabel=${nextMonthLabel}
                    previousMonthLabel=${previousMonthLabel}
                    selectDateLabel=${selectDateLabel}
                    selectedDateLabel=${selectedDateLabel}
                    selectedYearTemplate=${selectedYearTemplate}
                    shortWeekLabel=${shortWeekLabel}
                    startView=${startView}
                    todayLabel=${todayLabel}
                    toyearTemplate=${toyearTemplate}
                    weekLabel=${weekLabel}
                    weekNumberTemplate=${weekNumberTemplate}
                    weekNumberType=${weekNumberType}
                  ></app-calendar>

                  ${renderActions({
                    confirmText,
                    denyText,
                    onConfirm: this.#onConfirm,
                    onDeny: this.#onDeny,
                  })}
                  `
                : html`
                  <docked-date-picker-menu-list
                    ${ref(this.#$menuList)}
                    class=menuList
                    locale=${locale}
                    max=${ifDefined(max)}
                    menuListType=${startView}
                    min=${ifDefined(min)}
                    monthMenuItemTemplate=${labelMonthMenuItemTemplate}
                    selectedMonthMenuItemTemplate=${labelSelectedMonthMenuItemTemplate}
                    selectedYearMenuItemTemplate=${labelSelectedYearMenuItemTemplate}
                    value=${focusedValue}
                    yearMenuItemTemplate=${labelYearMenuItemTemplate}
                    .onMenuChange=${this.#onMenuChange}
                  ></docked-date-picker-menu-list>
                  `
            }</div>
          </div>
        </md-menu-surface>
      </div>
    </div>
    `;
  }

  reset(): void {
    this._$dates_.reset();
  }

  show(): void {
    this.open = true;
    this.#updateTextFieldFocusedTo(true);
  }

  showPicker() {
    this.show();
  }
}

//
// done: Esc does not close menu
// done: update tabbale date
// done: update date by key
// done: focus calendar when opened
// done: focus menulist when opened
// done: update focused, selected date
// done: navigate month and year in calendar view
// done: create more controllers to share code to update properties
// done: add showPicker(), show(), close(), reset()
