export interface RenderMenuButtonInit<T extends string = string> extends Partial<Pick<HTMLButtonElement, 'className'>> {
  iconDirection?: 'down' | 'up';
  label: string;
  onClick?(ev: MouseEvent): void;
  text: string;
  type?: T;
}
