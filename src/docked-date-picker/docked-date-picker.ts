import '@material/web/iconbutton/icon-button.js';
import '@material/web/textfield/outlined-text-field.js';
import '../date-picker-calendar/date-picker-calendar.js';
import '../docked-date-picker-header/docked-date-picker-header.js';
import '../docked-date-picker-menu-list/docked-date-picker-menu-list.js';
import '../md-menu-surface/md-menu-surface.js';

import { fromPartsToUtcDate } from '@ipohjs/calendar/from-parts-to-utc-date';
import { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js';
import { html, type PropertyValueMap, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';

import type { AppCalendar } from '../calendar/app-calendar.js';
import { renderCalendarDay } from '../calendar/helpers/render-calendar-day/render-calendar-day.js';
import { renderWeekDay } from '../calendar/helpers/render-week-day/render-week-day.js';
import type { CalendarProperties } from '../calendar/types.js';
import { labelConfirm, labelDeny, labelMonthMenuItemTemplate, labelNextMonth, labelNextYear, labelPreviousMonth, labelPreviousYear, labelSelectedMonthMenuItemTemplate, labelSelectedYearMenuItemTemplate, labelSupportingText, labelYearMenuItemTemplate, MAX_DATE, MIN_DATE, renderNoop } from '../constants.js';
import type { DockedDatePickerHeader } from '../docked-date-picker-header/docked-date-picker-header.js';
import { DockedDatePickerMenuList } from '../docked-date-picker-menu-list/docked-date-picker-menu-list.js';
import { toDateString } from '../helpers/to-date-string.js';
import { toResolvedDate } from '../helpers/to-resolved-date.js';
import { iconCalendar } from '../icons.js';
import { DatePickerMinMaxMixin } from '../mixins/date-picker-min-max-mixin.js';
import { DatePickerMixin } from '../mixins/date-picker-mixin.js';
import { ElementMixin } from '../mixins/element-mixin.js';
import { renderActions } from '../render-helpers/render-actions/render-actions.js';
import { renderActionsStyle } from '../render-helpers/render-actions/styles.js';
import { RootElement } from '../root-element/root-element.js';
import { resetShadowRoot } from '../stylings.js';
import type { MenuListType } from '../typings.js';
import { dockedDatePicker_calendarIconLabel, dockedDatePicker_mdMenuSurfaceYOffset, dockedDatePickerName } from './constants.js';
import { dockedDatePickerStyles } from './styles.js';
import type { DockedDatePickerProperties } from './types.js';

const defaultDate = toResolvedDate();

@customElement(dockedDatePickerName)
export class DockedDatePicker extends DatePickerMixin(DatePickerMinMaxMixin(ElementMixin(RootElement))) implements DockedDatePickerProperties {
  // close(returnValue: DockedDatePickerPropertiesReturnValue): Promise<void> {

  // }

  // show(): Promise<void> {

  // }

  // reset(): Promise<boolean> {

  // }

  // get returnValue(): ModalDatePickerProperties['returnValue'] {
  //   return (this.#dialogRef.value as MdDialog).returnValue;
  // }

  #hostRef: Ref<this> = createRef();
  #didConfirm: boolean = false;
  #headerRef = createRef<DockedDatePickerHeader>();
  #textFieldRef = createRef<MdOutlinedTextField>();
  readonly #todayDate: Date = toResolvedDate();

  static override styles = [
    resetShadowRoot,
    renderActionsStyle,
    dockedDatePickerStyles,
  ];

  /**
   * Dispatches the `input` and `change` events.
   */
  #dispatchInteractionEvents = () => {
    this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    this.dispatchEvent(new Event('change', { bubbles: true }));
  };

  #onCalendarUpdated: AppCalendar['onUpdated'] = async () => {
    // this.onDateUpdate?.(this._selectedDate);
  };

  #onClosing = () => {
    this.open = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.#textFieldRef.value as any).focused = false;
  };

  #onConfirm = () => {
    this.#didConfirm = true;
    this.#onClosing();
  };

  #onDateUpdateByClick: NonNullable<CalendarProperties['onDateUpdateByClick']> = (_ev, node) => {
    const fulldate = node?.dataset.fulldate;

    if (fulldate) {
      this._focusedDate = this._selectedDate = toResolvedDate(fulldate);
    }
  };

  #onDateUpdateByKey: NonNullable<CalendarProperties['onDateUpdateByKey']> = (ev, _node, { disabledDatesSet, disabledDaysSet }) => {
    // if (navigationKeySetGrid.has(ev.key as InferredFromSet<typeof navigationKeySetGrid>)) {
    //   const nextDate = toNextSelectedDate({
    //     currentDate: this._focusedDate,
    //     date: this._selectedDate,
    //     disabledDatesSet,
    //     disabledDaysSet,
    //     hasAltKey: ev.altKey,
    //     key: ev.key as SupportedKey,
    //     maxTime: toResolvedDate(this.max).getTime(),
    //     minTime: toResolvedDate(this.min).getTime(),
    //   });
    //   const nextDateTime = nextDate.getTime();

    //   if (
    //     nextDateTime !== this._focusedDate.getTime() ||
    //     nextDateTime !== this._selectedDate.getTime()
    //   ) {
    //     this._focusedDate = this._selectedDate = nextDate;
    //   }
    // } else if (confirmKeySet.has(ev.key as InferredFromSet<typeof confirmKeySet>)) {
    //   this.#onCalendarUpdated?.();
    // }
  };

  #onDeny = () => {
    this.#onClosing();
  };

  #onMenuChange: DockedDatePickerMenuList['onMenuChange'] = ({ type, value }) => {
    const {
      _focusedDate,
    } = this;
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

  #onOpening = () => {
    this.open = true;

    /**
     * NOTE: A workaround to ensure that the text field renders in its focused state
     * when the user focuses the menu surface.
     */
    interface MdOutlinedTextFieldWithFocused extends Omit<MdOutlinedTextField, 'focused'> {
      focused: boolean;
    }
    (this.#textFieldRef.value as unknown as MdOutlinedTextFieldWithFocused).focused = true;
  };

  #renderCalendarDay: CalendarProperties['renderCalendarDay'] = ({
    data,
  }) => {
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

  #toggleMenuSurface = () => {
    if (this.open) {
      this.#onClosing();
    } else {
      this.#onOpening();
    }
  };

  #updateDatesByValue = (changedProperties: PropertyValueMap<this>): void => {
    const { value } = this;

    if (changedProperties.has('value') && value !== changedProperties.get('value')) {
      this._focusedDate = this._selectedDate = this._tabbableDate = toResolvedDate(value);
    }
  };

  #updateMinMax = (changedProperties: PropertyValueMap<this>) => {
    const { max, min } = this;

    if (changedProperties.has('max') && changedProperties.get('max') !== max) {
      this._maxDate = toResolvedDate(max || MAX_DATE);
    }

    if (changedProperties.has('min') && changedProperties.get('min') !== min) {
      this._minDate = toResolvedDate(min || MIN_DATE);
    }
  };

  #updateStartViewByMenuListType: DockedDatePickerHeader['onMonthMenuClick'] = (init) => {
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

        this.startView = startView === 'monthMenu' || startView === 'yearMenu' ?
          'calendar' : init.type;

        break;
      }
      default:
    }
  };

  @state() _focusedDate: Date = defaultDate;

  @state() _maxDate!: Date;

  @state() _minDate!: Date;

  @state() _selectedDate: Date = defaultDate;

  @state() private _tabbableDate: Date = defaultDate;

  @property() calendarIconLabel: string = dockedDatePicker_calendarIconLabel;

  @property() confirmText: string = labelConfirm;

  @property() denyText: string = labelDeny;

  @property() label = '';

  @property({ reflect: true, type: Boolean }) open: boolean = false;

  @property({ reflect: true }) supportingText: string = labelSupportingText;

  /**
   * Opens the menu synchronously with no animation.
   */
  @property({ type: Boolean }) quick = false;

  @property({ reflect: true }) startView: 'calendar' | MenuListType = 'calendar';

  #bodyRef = createRef<HTMLDivElement>();

  #menuListRef = createRef<DockedDatePickerMenuList>();

  constructor() {
    super();

    const { max, min, value } = this;

    this._maxDate = toResolvedDate(max ?? MAX_DATE);
    this._minDate = toResolvedDate(min ?? MIN_DATE);
    this._focusedDate = this._selectedDate = this._tabbableDate = toResolvedDate(value);
    this.supportingText
  }

  protected override render(): TemplateResult {
    const {
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
      toyearTemplate,
      weekLabel,
      weekNumberTemplate,
      weekNumberType,
      _focusedDate,
      value,
      supportingText,
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
          y-offset=${dockedDatePicker_mdMenuSurfaceYOffset}
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
              startView === 'calendar' ? html`
              <app-calendar
                ?showWeekNumber=${showWeekNumber}
                .onDateUpdateByClick=${this.#onDateUpdateByClick}
                .onDateUpdateByKey=${this.#onDateUpdateByKey}
                .onUpdated=${this.#onCalendarUpdated}
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
              ` : html`
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

  protected override willUpdate(changedProperties: PropertyValueMap<this>): void {
    this.#updateDatesByValue(changedProperties);
    this.#updateMinMax(changedProperties);
  }

  #onOpened = async () => {
    if (this.startView === 'calendar') {
      await this.updateComplete

      const header = this.#headerRef.value;

      if (header) {
        await header.updateComplete;

        const monthMenuButton = await header.getMonthMenuButton()

        if (monthMenuButton) {
          await monthMenuButton.updateComplete;

          monthMenuButton.focus();
        }
      }
    }
  };

  #onClosed = () => {
    const { _selectedDate, value } = this;

    if (this.#didConfirm) {
      this.value = toDateString(_selectedDate);
      this.#didConfirm = false;
    } else {
      this._focusedDate = this._selectedDate = toResolvedDate(value);
    }
  };

  protected override async updated(changedProperties: PropertyValueMap<this>): Promise<void> {
    this.#scrollIntoViewWhenNeeded(changedProperties);
  }

  #scrollIntoViewWhenNeeded = async (changedProperties: PropertyValueMap<this>) => {
    const { startView } = this;

    if (
      changedProperties.get('startView') &&
      changedProperties.get('startView') !== startView
    ) {
      const body = this.#bodyRef.value;
      const listItems = (await this.#menuListRef.value?.getListItems()) ?? [];
      const selectedListItemIdx = listItems.findIndex(n => !n.disabled && n.tabIndex > -1);

      if (body && selectedListItemIdx > -1) {
        const containerMarginTop = 8;
        const listItemRect = listItems[0].getBoundingClientRect();
        const offsetToCenter = 3;

        body.scrollTop = (selectedListItemIdx - offsetToCenter) * listItemRect.height + containerMarginTop;
      }
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    [dockedDatePickerName]: DockedDatePicker;
  }
}

// fixme: update tabbale date
// fixme: update date by key
//
// done: focus calendar when opened
// done: focus menulist when opened
// done: update focused, selected date
// done: navigate month and year in calendar view
