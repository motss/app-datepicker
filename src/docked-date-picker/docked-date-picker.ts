import '@material/web/iconbutton/icon-button.js';
import '@material/web/textfield/outlined-text-field.js';
import '../date-picker-calendar/date-picker-calendar.js';
import '../docked-date-picker-header/docked-date-picker-header.js';
import '../docked-date-picker-menu-list/docked-date-picker-menu-list.js';
import '../md-menu-surface/md-menu-surface.js';

import { fromPartsToUtcDate } from '@ipohjs/calendar/from-parts-to-utc-date';
import type { CloseMenuEvent } from '@material/web/menu/menu.js';
import type { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js';
import { html, type PropertyValueMap, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';

import type { AppCalendar } from '../calendar/app-calendar.js';
import { renderCalendarDay } from '../calendar/helpers/render-calendar-day/render-calendar-day.js';
import { renderWeekDay } from '../calendar/helpers/render-week-day/render-week-day.js';
import type { CalendarProperties } from '../calendar/types.js';
import { labelConfirm, labelDeny, labelMonthMenuItemTemplate, labelNextMonth, labelNextYear, labelPreviousMonth, labelPreviousYear, labelSelectedMonthMenuItemTemplate, labelSelectedYearMenuItemTemplate, labelYearMenuItemTemplate, MAX_DATE, MIN_DATE, renderNoop } from '../constants.js';
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
import { dockedDatePicker_calendarIconLabel, dockedDatePickerName } from './constants.js';
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

  #hostRef: Ref<this> = createRef();

  #onCalendarUpdated: AppCalendar['onUpdated'] = async () => {
    // this.onDateUpdate?.(this._selectedDate);
  };

  #onCloseMenu = (event: CloseMenuEvent) => {
    const reason = event.detail.reason;
    // const item = event.detail.itemPath[0] as SelectOption;
    const hasChanged = false;

    // if (reason.kind === 'click-selection') {
    //   hasChanged = this.selectItem(item);
    // } else if (reason.kind === 'keydown' && isSelectableKey(reason.key)) {
    //   hasChanged = this.selectItem(item);
    // } else {
    //   // This can happen on ESC being pressed
    //   item.tabIndex = -1;
    //   item.blur();
    // }

    console.debug('closemenu', reason);

    // Dispatch interaction events since selection has been made via keyboard
    // or mouse.
    if (hasChanged) {
      this.#dispatchInteractionEvents();
    }

    this.open = false;
  };

  #onClosing = () => {
    this.open = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.#textFieldRef.value as any).focused = false;
  };

  #onConfirm = () => { };

  #onDateUpdateByClick: NonNullable<CalendarProperties['onDateUpdateByClick']> = (_ev, node) => {
    // this._focusedDate = this._selectedDate = toResolvedDate(node.dataset.fulldate);
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

  // @query('md-outlined-text-field') private readonly textField!: MdOutlinedTextField | null;

  #onDeny = () => { };

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.#textFieldRef.value as any).focused = true;
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

  #showMenuSurface = () => {
    if (this.open) {
      this.#onClosing();
    } else {
      this.#onOpening();
    }
  };

  #textFieldRef = createRef<MdOutlinedTextField>();

  readonly #todayDate: Date = toResolvedDate();

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
    if (init.type === 'monthMenu' || init.type === 'yearMenu') {
      const { startView } = this;

      this.startView = startView === 'monthMenu' || startView === 'yearMenu' ?
        'calendar' : init.type;
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
    } = this;

    const anchorId = 'field_01HQDDHBZFASJH3XSA4GJC0TZA';
    const value = toDateString(toResolvedDate(this._focusedDate));

    return html`
    <div ${ref(this.#hostRef)}>
      <md-outlined-text-field
        ${ref(this.#textFieldRef)}
        id=${anchorId}
        label=${label}
        value=${value}
      >
        <md-icon-button
          slot="trailing-icon"
          @click=${this.#showMenuSurface}
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
          @close-menu=${this.#onCloseMenu}
          @closing=${this.#onClosing}
          @opening=${this.#onOpening}
          anchor=${anchorId}
          stay-open-on-focusout
        >
          <div style="display:contents;">
            <docked-date-picker-header
              class=header
              locale=${locale}
              max=${ifDefined(max)}
              min=${ifDefined(min)}
              value=${value}
              nextMonthButtonLabel=${labelNextMonth}
              prevMonthButtonLabel=${labelPreviousMonth}
              nextYearButtonLabel=${labelNextYear}
              prevYearButtonLabel=${labelPreviousYear}
              startView=${startView}
              .onMonthMenuClick=${this.#updateStartViewByMenuListType}
              .onYearMenuClick=${this.#updateStartViewByMenuListType}
            ></docked-date-picker-header>

            <div
              ${ref(this.#bodyRef)}
              class=${classMap({ body: true, [startView]: true })}
            >${
              startView === 'calendar' ? html`
              <app-calendar
                class=calendar
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
                .onDateChange=${() => { /** todo: */ }}
                .onDateUpdate=${() => { /** todo: */ }}
                .onYearUpdate=${() => { /** todo: */ }}
                .value=${value}
                ?showWeekNumber=${showWeekNumber}
                .onDateUpdateByClick=${this.#onDateUpdateByClick}
                .onDateUpdateByKey=${this.#onDateUpdateByKey}
                .renderCalendarDay=${this.#renderCalendarDay}
                .renderFooter=${renderNoop}
                .renderWeekDay=${this.#renderWeekDay}
                .renderWeekLabel=${renderNoop}
                .renderWeekNumber=${renderNoop}
                .onUpdated=${this.#onCalendarUpdated}
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
                value=${value}
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
        const listItemRect = listItems[0].getBoundingClientRect();
        const offsetToCenter = 2;

        body.scrollTop = (selectedListItemIdx - offsetToCenter) * listItemRect.height;
      }
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    [dockedDatePickerName]: DockedDatePicker;
  }
}

// fixme: focus calendar when opened
