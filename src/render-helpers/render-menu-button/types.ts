export interface RenderMenuButtonInit extends Partial<Pick<HTMLButtonElement, 'className'>> {
  iconDirection?: 'down' | 'up';
  label: string;
  onClick?(ev: MouseEvent): void;
  text: string;
  type?: string;
}
