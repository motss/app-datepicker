import type { DatePickerProperties, LabelValue, MenuListType } from '../../../typings.js';

export interface MenuListItem extends LabelValue<number> {
  disabled: boolean;
  selected: boolean;
}

export interface MdListItemDataset extends DOMStringMap {
  type: MenuListType;
  value: string;
}

export interface MenuListProperties extends Partial<Pick<DatePickerProperties, 'locale' | 'value'>> {
  menuListType?: MenuListType;
  monthMenuItemTemplate?: string;
  onMenuChange?(init: OnMenuChangeInit): void;
  selectedMonthMenuItemTemplate?: string;
  selectedYearMenuItemTemplate?: string;
  yearMenuItemTemplate?: string;
}

export interface OnMenuChangeInit {
  type: MenuListType;
  value: number;
}
