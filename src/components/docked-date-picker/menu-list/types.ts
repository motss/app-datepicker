import type {
  DatePickerProperties,
  LabelValue,
  MenuListType,
} from '../../../types.js';

export interface MenuListItem extends LabelValue<number> {
  disabled: boolean;
  selected: boolean;
}

export interface MdListItemDataset extends DOMStringMap {
  type: MenuListType;
  value: string;
}

interface MenuListFormatters {
  longMonthFormat: Intl.DateTimeFormat;
  yearFormat: Intl.DateTimeFormat;
}

export interface MenuListProperties
  extends MenuListStates,
    Partial<Pick<DatePickerProperties, 'locale' | 'value'>> {
  menuListType?: MenuListType;
  monthMenuItemTemplate?: string;
  onMenuChange?(init: OnMenuChangeInit): void;
  selectedMonthMenuItemTemplate?: string;
  selectedYearMenuItemTemplate?: string;
  yearMenuItemTemplate?: string;
}

interface MenuListStates {
  _formatters: MenuListFormatters;
}

export interface OnMenuChangeInit {
  type: MenuListType;
  value: number;
}
