import { DATEPICKER_NAME } from "./constants.js";
import { Datepicker } from "./datepicker.js";
import { customElementsDefine } from "./helpers/custom-elements-define.js";

customElementsDefine(DATEPICKER_NAME, Datepicker);

declare global {
  interface HTMLElementTagNameMap {
    "app-datepicker": Datepicker;
  }
}
export { customElementsDefine, Datepicker };
