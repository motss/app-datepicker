import {
  customElement,
  html,
  LitElement,
  query,
} from 'lit-element';

@customElement(ClipboardCopy.is)
export class ClipboardCopy extends LitElement {
  static get is() { return 'clipboard-copy'; }

  @query('slot')
  private _slot!: HTMLSlotElement;

  private _forEl?: HTMLElement;

  protected updated() {
    if (this._forEl == null) {
      const assignedNodes = this._slot.assignedNodes() as HTMLElement[];
      const forEl = assignedNodes.find(n => n.nodeType === 1 && n.hasAttribute('for'))!;

      forEl.addEventListener('click', () => this._copyText(), { passive: true });

      this._forEl = forEl;
      this.requestUpdate('_forEl');
    }
  }

  protected render() {
    return html`<slot></slot>`;
  }

  private _copyText() {
    const copyNode = this.querySelector(`#${this._forEl!.getAttribute('for')!}`)!;
    const selection = getSelection()!;
    const range = document.createRange();

    selection.removeAllRanges();
    range.selectNodeContents(copyNode);
    selection.addRange(range);
    document.execCommand('copy');
    selection.removeAllRanges();

    this.dispatchEvent(new CustomEvent('clipboard-copy-copied'));
  }
}
