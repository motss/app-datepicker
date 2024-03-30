import '@material/web/iconbutton/icon-button.js';
import '@material/web/textfield/outlined-text-field.js';
import '../date-picker-calendar/date-picker-calendar.js';
import '../md-menu-surface/md-menu-surface.js';
import '../md-svg/md-svg.js';
import './header/docked-date-picker-header.js';
import './menu-list/docked-date-picker-menu-list.js';

import { fromPartsToUtcDate } from '@ipohjs/calendar/from-parts-to-utc-date';
import type { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js';
import { html, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';

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
import { DatePickerMixin } from '../../mixins/date-picker-mixin.js';
import { ElementMixin } from '../../mixins/element-mixin.js';
import { MinMaxMixin } from '../../mixins/min-max-mixin.js';
import { ValueMixin } from '../../mixins/value-mixin/value-mixin.js';
import { renderActions } from '../../render-helpers/render-actions/render-actions.js';
import { renderActionsStyle } from '../../render-helpers/render-actions/styles.js';
import { RootElement } from '../../root-element/root-element.js';
import { resetShadowRoot } from '../../styles.js';
import type { MenuListType } from '../../types.js';
import { renderCalendarDay } from '../date-picker-calendar/calendar/helpers/render-calendar-day/render-calendar-day.js';
import { renderWeekDay } from '../date-picker-calendar/calendar/helpers/render-week-day/render-week-day.js';
import type { CalendarProperties } from '../date-picker-calendar/calendar/types.js';
import { dockedDatePickerName } from './constants.js';
import type { DockedDatePickerHeader } from './header/docked-date-picker-header.js';
import type { DockedDatePickerMenuList } from './menu-list/docked-date-picker-menu-list.js';
import { dockedDatePickerStyles } from './styles.js';
import type { DockedDatePickerProperties } from './types.js';

const yOffset = 7;

@customElement(dockedDatePickerName)
export class DockedDatePicker
  extends DatePickerMixin(ElementMixin(MinMaxMixin(ValueMixin(RootElement))))
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

  #didConfirm = false;

  #headerRef = createRef<DockedDatePickerHeader>();
  #hostRef: Ref<this> = createRef();

  #menuListRef = createRef<DockedDatePickerMenuList>();

  #onClosed = () => {
    const { $datesController_, value } = this;

    if (this.#didConfirm) {
      this.value = toDateString($datesController_.selectedDate);
      this.#didConfirm = false;
    } else {
      const newDate = toResolvedDate(value);

      this.$datesController_.updateBy({
        focusedDate: newDate,
        selectedDate: newDate,
      });
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

  #onDeny = () => {
    this.#onClosing();
  };

  #onMenuChange: DockedDatePickerMenuList['onMenuChange'] = ({
    type,
    value,
  }) => {
    const { $datesController_ } = this;
    const y = $datesController_.focusedDate.getUTCFullYear();
    const m = $datesController_.focusedDate.getUTCMonth();
    const d = $datesController_.focusedDate.getUTCDate();

    this.$datesController_.updateBy({
      focusedDate: fromPartsToUtcDate(
        type === 'yearMenu' ? value : y,
        type === 'monthMenu' ? value : m,
        d
      ),
    });
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
    const { $datesController_ } = this;

    return renderCalendarDay({
      data,
      selectedDate: $datesController_.selectedDate,
      tabbableDate: $datesController_.tabbableDate,
      todayDate: this.#todayDate,
    });
  };

  #renderWeekDay: CalendarProperties['renderWeekDay'] = ({ weekday }) => {
    return renderWeekDay(weekday);
  };

  #scrollSelectedMenuListItemIntoView = async () => {
    const body = this.#bodyRef.value;
    const listItems = (await this.#menuListRef.value?.getListItems()) ?? [];
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

  #textFieldRef = createRef<MdOutlinedTextField>();

  readonly #todayDate: Date = toResolvedDate();

  #toggleMenuSurface = () => {
    if (this.open) {
      this.#onClosing();
    } else {
      this.#onOpening();
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
        this.$datesController_.updateBy({ focusedDate: init.date });
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
      this.#textFieldRef.value as unknown as MdOutlinedTextFieldWithFocused
    ).focused = focused;
  };

  $datesController_ = new DatesController(this, {
    onConfirm: this.#onConfirm,
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

  protected override render(): TemplateResult {
    const {
      $datesController_,
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
    const focusedValue = toDateString($datesController_.focusedDate);
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
                    .onDateUpdateByClick=${
                      $datesController_.onDateUpdateByClick
                    }
                    .onDateUpdateByKey=${$datesController_.onDateUpdateByKey}
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
