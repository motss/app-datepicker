export interface RenderMenuButtonInit
  extends Partial<
    Pick<HTMLButtonElement, 'className' | 'name' | 'type'>
  > {
  disabled?: boolean;
  iconDirection?: 'down' | 'up';
  label?: string;
  onClick?(ev: MouseEvent): void;
  text: string;
}
