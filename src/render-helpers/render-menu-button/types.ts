import type { MdTextButton } from '@material/web/button/text-button.js';
import type { Ref } from 'lit/directives/ref.js';

export interface RenderMenuButtonInit
  extends Partial<
    Pick<HTMLButtonElement, 'className' | 'name' | 'type' | 'value'>
  > {
  disabled?: boolean;
  iconDirection?: 'down' | 'up';
  label: string;
  onClick?(ev: MouseEvent): void;
  ref?: Ref<MdTextButton>;
  text: string;
}
