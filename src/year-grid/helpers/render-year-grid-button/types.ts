export interface RenderYearGridButtonInit extends Pick<HTMLButtonElement, 'tabIndex'> {
  label: string;
  selected: boolean;
  toyear: boolean;
  year: number;
}
