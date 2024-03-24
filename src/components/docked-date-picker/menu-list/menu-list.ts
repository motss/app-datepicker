import '@material/web/list/list.js';
import '@material/web/list/list-item.js';

import type { MdList } from '@material/web/list/list.js';
import type { MdListItem } from '@material/web/list/list-item.js';
import type { ListItem } from '@material/web/menu/menu.js';
import { html, type PropertyValueMap, svg, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { createRef, ref } from 'lit/directives/ref.js';

import {
  emptyReadonlyArray,
  labelMonthMenuItemTemplate,
  labelSelectedMonthMenuItemTemplate,
  labelSelectedYearMenuItemTemplate,
  labelYearMenuItemTemplate,
  longMonthFormatOptions,
  MAX_DATE,
  MIN_DATE,
  yearFormatOptions,
} from '../../../constants.js';
import { templateReplacer } from '../../../helpers/template-replacer.js';
import { toResolvedDate } from '../../../helpers/to-resolved-date.js';
import { iconCheck } from '../../../icons.js';
import { MinMaxMixin } from '../../../mixins/min-max-mixin.js';
import { RootElement } from '../../../root-element/root-element.js';
import type { MenuListType } from '../../../types.js';
import type {
  MdListItemDataset,
  MenuListItem,
  MenuListProperties,
} from './types.js';

const monthList: number[] = Array.from(Array(12), (_, i) => i);

const findFirstMdListItem = (node: EventTarget): node is MdListItem => {
  return (
    (node as Element)?.nodeType === Node.ELEMENT_NODE &&
    (node as Element).localName === 'md-list-item'
  );
};

export class MenuList
  extends MinMaxMixin(RootElement)
  implements MenuListProperties
{
  #listRef = createRef<MdList>();

  #menuItemTemplateFn!: (arg: number) => string;

  #monthFormat!: Intl.DateTimeFormat['format'];

  #onMenuItemClick = (ev: MouseEvent) => {
    const listItem = ev.composedPath().find(findFirstMdListItem);

    if (listItem) {
      const { type, value } = listItem.dataset as MdListItemDataset;

      this.onMenuChange?.({ type, value: Number(value) });
    }
  };

  #selectedMenuItemTemplateFn!: (arg: number) => string;

  #updateFormatter = (changedProperties: PropertyValueMap<this>) => {
    if (
      changedProperties.has('locale') &&
      changedProperties.get('locale') !== this.locale
    ) {
      this.#monthFormat = new Intl.DateTimeFormat(
        this.locale,
        longMonthFormatOptions
      ).format;
      this.#yearFormat = new Intl.DateTimeFormat(
        this.locale,
        yearFormatOptions
      ).format;
      this.requestUpdate();
    }
  };

  #updateMenuItemTemplates = (changedProperties: PropertyValueMap<this>) => {
    if (
      (changedProperties.has('menuListType') &&
        changedProperties.get('menuListType') !== this.menuListType) ||
      (changedProperties.has('monthMenuItemTemplate') &&
        changedProperties.get('monthMenuItemTemplate') !==
          this.monthMenuItemTemplate) ||
      (changedProperties.has('yearMenuItemTemplate') &&
        changedProperties.get('yearMenuItemTemplate') !==
          this.yearMenuItemTemplate) ||
      (changedProperties.has('selectedMonthMenuItemTemplate') &&
        changedProperties.get('selectedMonthMenuItemTemplate') !==
          this.selectedMonthMenuItemTemplate) ||
      (changedProperties.has('selectedYearMenuItemTemplate') &&
        changedProperties.get('selectedYearMenuItemTemplate') !==
          this.selectedYearMenuItemTemplate)
    ) {
      const {
        menuListType,
        monthMenuItemTemplate,
        selectedMonthMenuItemTemplate,
        selectedYearMenuItemTemplate,
        yearMenuItemTemplate,
      } = this;

      const isMonthMenu = menuListType === 'monthMenu';
      const template = isMonthMenu
        ? monthMenuItemTemplate
        : yearMenuItemTemplate;
      const selectedTemplate = isMonthMenu
        ? selectedMonthMenuItemTemplate
        : selectedYearMenuItemTemplate;

      this.#menuItemTemplateFn = (arg: number) =>
        templateReplacer(template, [arg]);
      this.#selectedMenuItemTemplateFn = (arg: number) =>
        templateReplacer(selectedTemplate, [arg]);
      this.requestUpdate();
    }
  };

  #updateMenuList = (changedProperties: PropertyValueMap<this>) => {
    if (
      (changedProperties.has('menuListType') &&
        changedProperties.get('menuListType') !== this.menuListType) ||
      (changedProperties.has('min') &&
        changedProperties.get('min') !== this.menuListType) ||
      (changedProperties.has('max') &&
        changedProperties.get('max') !== this.menuListType) ||
      (changedProperties.has('value') &&
        changedProperties.get('value') !== this.menuListType)
    ) {
      const { max, menuListType, min, value } = this;

      const minDate = toResolvedDate(min ?? MIN_DATE);
      const maxDate = toResolvedDate(max ?? MAX_DATE);
      const valueDate = toResolvedDate(value);

      let list: MenuListItem[] = emptyReadonlyArray as MenuListItem[];

      switch (menuListType) {
        case 'monthMenu': {
          const maxTime = maxDate.getTime();
          const minTime = minDate.getTime();
          const valueTime = valueDate.getTime();
          const year = valueDate.getUTCFullYear();

          list = monthList.map<MenuListItem>((_, i) => {
            const disabled = valueTime < minTime || valueTime > maxTime;
            const label = this.#monthFormat(Date.UTC(year, i, 1));
            const selected = valueDate.getUTCMonth() === i;

            return { disabled, label, selected, value: i };
          });

          break;
        }
        case 'yearMenu':
        default: {
          const maxYear = maxDate.getUTCFullYear();
          const minYear = minDate.getUTCFullYear();

          list = Array.from<unknown, MenuListItem>(
            Array(maxYear - minYear + 1),
            (_, i) => {
              const year = i + minYear;

              const label = this.#yearFormat(Date.UTC(year, 1, 1));
              const selected = year === valueDate.getUTCFullYear();

              return { disabled: false, label, selected, value: year };
            }
          );
        }
      }

      this._menuList = list;
    }
  };

  #yearFormat!: Intl.DateTimeFormat['format'];
  @state() _menuList: MenuListItem[] = emptyReadonlyArray as MenuListItem[];
  @property() locale: string = Intl.DateTimeFormat().resolvedOptions().locale;
  @property() menuListType: MenuListType = 'monthMenu';
  @property() monthMenuItemTemplate: string = labelMonthMenuItemTemplate;

  @property({ attribute: false })
  onMenuChange?: MenuListProperties['onMenuChange'];

  @property() selectedMonthMenuItemTemplate: string =
    labelSelectedMonthMenuItemTemplate;

  @property() selectedYearMenuItemTemplate: string =
    labelSelectedYearMenuItemTemplate;

  @property() value = '';
  @property() yearMenuItemTemplate: string = labelYearMenuItemTemplate;

  async getListItems(): Promise<ListItem[] | undefined> {
    await this.updateComplete;

    const list = this.#listRef.value;

    await list?.updateComplete;

    return list?.items;
  }

  protected override render(): TemplateResult {
    const { _menuList, menuListType } = this;

    return html`
    <md-list
      ${ref(this.#listRef)}
      @click=${this.#onMenuItemClick}
    >${map(_menuList, ({ disabled, label, selected, value }) => {
      const ariaLabel = (
        selected ? this.#selectedMenuItemTemplateFn : this.#menuItemTemplateFn
      )(value);

      return html`
        <md-list-item
          ?disabled=${disabled}
          aria-label=${ariaLabel}
          data-type=${menuListType}
          data-value=${value}
          tabindex=${selected ? 0 : -1}
          type=button
        >
          <md-svg
            aria-hidden=true
            slot=start
            .content=${selected ? iconCheck : svg``}
          ></md-svg>
          ${label}
        </md-list-item>`;
    })}</md-list>
    `;
  }

  protected override willUpdate(
    changedProperties: PropertyValueMap<this>
  ): void {
    this.#updateFormatter(changedProperties);
    this.#updateMenuList(changedProperties);
    this.#updateMenuItemTemplates(changedProperties);
  }
}
