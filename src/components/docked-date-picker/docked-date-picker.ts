import '@material/web/iconbutton/icon-button.js';
import '@material/web/textfield/outlined-text-field.js';
import '../date-picker-calendar/date-picker-calendar.js';
import './header/docked-date-picker-header.js';
import './menu-list/docked-date-picker-menu-list.js';
import '../md-menu-surface/md-menu-surface.js';

import { fromPartsToUtcDate } from '@ipohjs/calendar/from-parts-to-utc-date';
import type { ListItem } from '@material/web/menu/menu.js';
import type { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js';
import { html, type PropertyValueMap, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';

import {
  confirmKeySet,
  emptyReadonlyArray,
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
  navigationKeySetGrid,
  renderNoop,
} from '../../constants.js';
import { isSameMonth } from '../../helpers/is-same-month.js';
import { splitString } from '../../helpers/split-string.js';
import { toDateString } from '../../helpers/to-date-string.js';
import { toNextSelectedDate } from '../../helpers/to-next-selected-date.js';
import { toResolvedDate } from '../../helpers/to-resolved-date.js';
import { iconCalendar } from '../../icons.js';
import { keyHome } from '../../key-values.js';
import { DatePickerMixin } from '../../mixins/date-picker-mixin.js';
import { ElementMixin } from '../../mixins/element-mixin.js';
import { MinMaxMixin } from '../../mixins/min-max-mixin.js';
import { renderActions } from '../../render-helpers/render-actions/render-actions.js';
import { renderActionsStyle } from '../../render-helpers/render-actions/styles.js';
import { RootElement } from '../../root-element/root-element.js';
import { resetShadowRoot } from '../../styles.js';
import type {
  InferredFromSet,
  MenuListType,
  SupportedKey,
} from '../../types.js';
import { renderCalendarDay } from '../date-picker-calendar/calendar/helpers/render-calendar-day/render-calendar-day.js';
import { renderWeekDay } from '../date-picker-calendar/calendar/helpers/render-week-day/render-week-day.js';
import type {
  CalendarDayElement,
  CalendarProperties,
} from '../date-picker-calendar/calendar/types.js';
import { dockedDatePickerName } from './constants.js';
import type { DockedDatePickerHeader } from './header/docked-date-picker-header.js';
import type { DockedDatePickerMenuList } from './menu-list/docked-date-picker-menu-list.js';
import { dockedDatePickerStyles } from './styles.js';
import type { DockedDatePickerProperties } from './types.js';

const defaultDate = toResolvedDate();
const yOffset = 7;

@customElement(dockedDatePickerName)
export class DockedDatePicker
  extends DatePickerMixin(MinMaxMixin(ElementMixin(RootElement)))
  implements DockedDatePickerProperties
{
  // close(returnValue: DockedDatePickerPropertiesReturnValue): Promise<void> {

  // }

  // show(): Promise<void> {

  // }

  // reset(): Promise<boolean> {

  // }

  // get returnValue(): ModalDatePickerProperties['returnValue'] {
  //   return (this.#dialogRef.value as MdDialog).returnValue;
  // }

  static override styles = [
    resetShadowRoot,
    renderActionsStyle,
    dockedDatePickerStyles,
  ];

  #bodyRef = createRef<HTMLDivElement>();

  #confirmSelectedDate = (node: CalendarDayElement) => {
    this._focusedDate = this._selectedDate = toResolvedDate(
      node.dataset.fulldate
    );
  };

  #didConfirm = false;
  #headerRef = createRef<DockedDatePickerHeader>();

  #hostRef: Ref<this> = createRef();

  #menuListRef = createRef<DockedDatePickerMenuList>();

  #onClosed = () => {
    const { _selectedDate, value } = this;

    if (this.#didConfirm) {
      this.value = toDateString(_selectedDate);
      this.#didConfirm = false;
    } else {
      this._focusedDate = this._selectedDate = toResolvedDate(value);
    }

    this.startView = 'calendar';
  };

  #onClosing = () => {
    this.open = false;
    this.#updateTextFieldFocusedTo(false);
  };

  #onConfirm = () => {
    this.#didConfirm = true;
    this.#onClosing();
  };

  #onDateUpdateByClick: NonNullable<CalendarProperties['onDateUpdateByClick']> =
    (_ev, node) => {
      this.#confirmSelectedDate(node);
    };

  #onDateUpdateByKey: NonNullable<CalendarProperties['onDateUpdateByKey']> = (
    ev,
    _node,
    { disabledDatesSet, disabledDaysSet }
  ) => {
    if (
      navigationKeySetGrid.has(
        ev.key as InferredFromSet<typeof navigationKeySetGrid>
      )
    ) {
      const { _focusedDate, _maxDate, _minDate, _selectedDate } = this;

      const nextDate = toNextSelectedDate({
        currentDate: _focusedDate,
        date: _selectedDate,
        disabledDatesSet,
        disabledDaysSet,
        hasAltKey: ev.altKey,
        key: ev.key as SupportedKey,
        maxTime: _maxDate.getTime(),
        minTime: _minDate.getTime(),
      });
      const nextDateTime = nextDate.getTime();

      if (
        nextDateTime !== _focusedDate.getTime() ||
        nextDateTime !== _selectedDate.getTime()
      ) {
        this._focusedDate = this._selectedDate = nextDate;
      }
    } else if (
      confirmKeySet.has(ev.key as InferredFromSet<typeof confirmKeySet>)
    ) {
      this.#onConfirm();
    }
  };

  #onDeny = () => {
    this.#onClosing();
  };

  #onMenuChange: DockedDatePickerMenuList['onMenuChange'] = ({
    type,
    value,
  }) => {
    const { _focusedDate } = this;
    const y = _focusedDate.getUTCFullYear();
    const m = _focusedDate.getUTCMonth();
    const d = _focusedDate.getUTCDate();

    this._focusedDate = fromPartsToUtcDate(
      type === 'yearMenu' ? value : y,
      type === 'monthMenu' ? value : m,
      d
    );
    this.startView = 'calendar';
  };

  #onOpened = async () => {
    if (this.startView === 'calendar') {
      await this.updateComplete;

      const header = this.#headerRef.value;

      if (header) {
        await header.updateComplete;

        const monthMenuButton = await header.getMonthMenuButton();

        if (monthMenuButton) {
          await monthMenuButton.updateComplete;

          monthMenuButton.focus();
        }
      }
    }
  };

  #onOpening = () => {
    this.open = true;
    this.#updateTextFieldFocusedTo(true);
  };

  #renderCalendarDay: CalendarProperties['renderCalendarDay'] = ({ data }) => {
    return renderCalendarDay({
      data,
      selectedDate: this._selectedDate,
      tabbableDate: this._tabbableDate,
      todayDate: this.#todayDate,
    });
  };

  #renderWeekDay: CalendarProperties['renderWeekDay'] = ({ weekday }) => {
    return renderWeekDay(weekday);
  };

  #scrollIntoViewWhenNeeded = async (
    changedProperties: PropertyValueMap<this>
  ) => {
    const { startView } = this;

    if (
      changedProperties.get('startView') &&
      changedProperties.get('startView') !== startView
    ) {
      const body = this.#bodyRef.value;
      const listItems =
        (await this.#menuListRef.value?.getListItems()) ??
        (emptyReadonlyArray as ListItem[]);
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
    }
  };

  #textFieldRef = createRef<MdOutlinedTextField>();

  readonly #todayDate: Date = toResolvedDate();

  #toggleMenuSurface = () => {
    if (this.open) {
      this.#onClosing();
    } else {
      this.#onOpening();
    }
  };

  #updateDatesByValue = (changedProperties: PropertyValueMap<this>): void => {
    const { value } = this;

    if (
      changedProperties.has('value') &&
      value !== changedProperties.get('value')
    ) {
      this._focusedDate =
        this._selectedDate =
        this._tabbableDate =
          toResolvedDate(value);
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
        this._focusedDate = init.date;
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

  #updateTabbableDate = (changedProperties: PropertyValueMap<this>) => {
    const { _focusedDate, _maxDate, _minDate, _selectedDate, disabledDates, disabledDays } = this;

    if (
      (changedProperties.has('_focusedDate') &&
        changedProperties.get('_focusedDate') !== _focusedDate) ||
      (changedProperties.has('_selectedDate') &&
        changedProperties.get('_selectedDate') !== _selectedDate)
    ) {
      const isWithinSameMonth = isSameMonth(_selectedDate, _focusedDate);

      if (isWithinSameMonth) {
        this._tabbableDate = _selectedDate;
      } else {
        /**
         * NOTE: This reset tabindex of a tab-able calendar day to
         * the first day of month when navigating away from the current month
         * where the focused/ selected date is no longer in the new current month.
         */
        const disabledDateList = splitString(disabledDates, toResolvedDate);
        const disabledDayList = splitString(disabledDays, Number);

        this._tabbableDate = toNextSelectedDate({
          currentDate: this._focusedDate,
          date: this._selectedDate,
          disabledDatesSet: new Set(disabledDateList?.map((d) => d.getTime())),
          disabledDaysSet: new Set(disabledDayList),
          hasAltKey: false,
          key: keyHome,
          maxTime: _maxDate.getTime(),
          minTime: _minDate.getTime(),
        });
      }
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
      this.#textFieldRef.value as unknown as MdOutlinedTextFieldWithFocused
    ).focused = focused;
  };

  @state() _focusedDate: Date = defaultDate;

  @state() _selectedDate: Date = defaultDate;

  @state() private _tabbableDate: Date = defaultDate;

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

    const { value } = this;

    this._focusedDate =
      this._selectedDate =
      this._tabbableDate =
        toResolvedDate(value);
  }

  protected override render(): TemplateResult {
    const {
      _focusedDate,
      calendarIconLabel,
      confirmText,
      denyText,
      disabledDates,
      disabledDays,
      firstDayOfWeek,
      label,
      locale,
      max,
      min,
      open,
      quick,
      selectedYearTemplate,
      shortWeekLabel,
      showWeekNumber,
      startView,
      supportingText,
      toyearTemplate,
      value,
      weekLabel,
      weekNumberTemplate,
      weekNumberType,
    } = this;

    const anchorId = 'field_01HQDDHBZFASJH3XSA4GJC0TZA';
    const focusedValue = toDateString(_focusedDate);
    const valueValue = toDateString(toResolvedDate(value));

    return html`
    <div ${ref(this.#hostRef)}>
      <md-outlined-text-field
        ${ref(this.#textFieldRef)}
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
          ${iconCalendar}
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
              ${ref(this.#headerRef)}
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
              ${ref(this.#bodyRef)}
            >${
              startView === 'calendar'
                ? html`
              <app-calendar
                ?showWeekNumber=${showWeekNumber}
                .onDateUpdateByClick=${this.#onDateUpdateByClick}
                .onDateUpdateByKey=${this.#onDateUpdateByKey}
                .onUpdated=${() => {
                  /** todo: */
                }}
                .renderCalendarDay=${this.#renderCalendarDay}
                .renderFooter=${renderNoop}
                .renderWeekDay=${this.#renderWeekDay}
                .renderWeekLabel=${renderNoop}
                .renderWeekNumber=${renderNoop}
                .value=${focusedValue}
                class=appCalendar
                disabledDates=${disabledDates}
                disabledDays=${disabledDays}
                firstDayOfWeek=${firstDayOfWeek}
                locale=${locale}
                max=${ifDefined(max)}
                min=${ifDefined(min)}
                selectedYearTemplate=${selectedYearTemplate}
                shortWeekLabel=${shortWeekLabel}
                startView=${this.startView}
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
                ${ref(this.#menuListRef)}
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

  protected override async updated(
    changedProperties: PropertyValueMap<this>
  ): Promise<void> {
    this.#scrollIntoViewWhenNeeded(changedProperties);
  }

  protected override willUpdate(
    changedProperties: PropertyValueMap<this>
  ): void {
    this.#updateDatesByValue(changedProperties);
    this.#updateTabbableDate(changedProperties);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [dockedDatePickerName]: DockedDatePicker;
  }
}

// fixme: create more controllers to share code to update properties
// fixme: add showPicker(), show(), close(), reset()
//
// done: Esc does not close menu
// done: update tabbale date
// done: update date by key
// done: focus calendar when opened
// done: focus menulist when opened
// done: update focused, selected date
// done: navigate month and year in calendar view
