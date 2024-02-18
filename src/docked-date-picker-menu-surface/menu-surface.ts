import '@material/web/focus/md-focus-ring.js';
import '@material/web/elevation/elevation.js';

import { requestUpdateOnAriaChange } from '@material/web/internal/aria/delegate.js';
import { createAnimationSignal, EASING } from '@material/web/internal/motion/animation.js';
import { isClosableKey, isElementInSubtree } from '@material/web/menu/internal/controllers/shared.js';
import { Corner, SurfacePositionController, type SurfacePositionTarget } from '@material/web/menu/internal/controllers/surfacePositionController.js';
import {html, isServer } from 'lit';
import {eventOptions, property, query } from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';

import { RootElement } from '../root-element/root-element.js';

export { Corner } from '@material/web/menu/internal/controllers/surfacePositionController.js';

/**
 * Gets the currently focused element on the page.
 *
 * @param activeDoc The document or shadowroot from which to start the search.
 *    Defaults to `window.document`
 * @return Returns the currently deeply focused element or `null` if none.
 */
function getFocusedElement(activeDoc: Document|ShadowRoot = document):
    HTMLElement|null {
  const activeEl = activeDoc.activeElement as HTMLElement | null;

  if (!activeEl) {
    return null;
  }

  if (activeEl.shadowRoot) {
    return getFocusedElement(activeEl.shadowRoot) ?? activeEl;
  }

  return activeEl;
}

/**
 * @fires opening Fired before the opening animation begins
 * @fires opened Fired once the menu is open, after any animations
 * @fires closing Fired before the closing animation begins
 * @fires closed Fired once the menu is closed, after any animations
 */
export abstract class MenuSurface extends RootElement {
  /**
   * The element that was focused before the menu opened.
   */
  private _lastFocusedElement: HTMLElement | null = null;

  /**
   * Animates closed.
   */
  private readonly beforeClose = async () => {
    this.open = false;

    if (!this.skipRestoreFocus) {
      this._lastFocusedElement?.focus?.();
    }

    if (!this.quick) {
      await this.animateClose();
    }
  };

  /**
   * Handles positioning the surface and aligning it to the anchor.
   */
  private readonly menuPositionController =
      new SurfacePositionController(this, () => {
        return {
          anchorCorner: this.anchorCorner,
          anchorEl: this.anchor,
          beforeClose: this.beforeClose,
          isOpen: this.open,
          isTopLayer: this.fixed,
          onClose: this.onClosed,
          onOpen: this.onOpened,
          positioning: 'document', /** note: `document` is equivalent to `popover`. See https://github.com/material-components/material-web/blob/87d7eac5c5c59805c3316d7044303464d636fd40/menu/internal/menu.ts#L366 for mroe info. */
          repositionStrategy: 'move',
          surfaceCorner: this.menuCorner,
          surfaceEl: this.surfaceEl,
          xOffset: this.xOffset,
          yOffset: this.yOffset,
        };
      });

  /**
   * Focuses the last focused element.
   */
  private readonly onClosed = () => {
    if (this.quick) {
      this.dispatchEvent(new Event('closing'));
      this.dispatchEvent(new Event('closed'));
    }
  };

  /**
   * Saves the last focused element focuses the new element based on
   * `defaultFocus`, and animates open.
   */
  private readonly onOpened = () => {
    this._lastFocusedElement = getFocusedElement();

    if (!this.slotElement) return;

    this.slotElement?.focus();

    if (this.quick) {
      this.dispatchEvent(new Event('opening'));
      this.dispatchEvent(new Event('opened'));
    } else {
      this.animateOpen();
    }
  };
  private readonly onWindowClick = (e: MouseEvent) => {
    if (!this.stayOpenOnOutsideClick && !e.composedPath().includes(this)) {
      this.open = false;
    }
  };
  private readonly openCloseAnimationSignal = createAnimationSignal();
  @query('slot') private readonly slotEl!: HTMLSlotElement|null;
  @query('slot') private readonly slotElement!: HTMLSlotElement | null;
  @query('.menu') private readonly surfaceEl!: HTMLElement|null;
  /**
   * The element in which the menu should align to.
   */
  @property({attribute: false})
  anchor: HTMLElement&Partial<SurfacePositionTarget>|null = null;
  /**
   * The corner of the anchor which to align the menu in the standard logical
   * property style of <block>_<inline>.
   */
  @property({attribute: 'anchor-corner'}) anchorCorner: Corner = Corner.END_START;
  /**
   * Makes the element use `position:fixed` instead of `position:absolute`. In
   * most cases, the menu should position itself above most other
   * `position:absolute` or `position:fixed` elements when placed inside of
   * them. e.g. using a menu inside of an `md-dialog`.
   *
   * __NOTE__: Fixed menus will not scroll with the page and will be fixed to
   * the window instead.
   */
  @property({type: Boolean}) fixed = false;
  /**
   * Displays overflow content like a submenu.
   *
   * __NOTE__: This may cause adverse effects if you set
   * `md-menu {max-height:...}`
   * and have items overflowing items in the "y" direction.
   */
  @property({attribute: 'has-overflow', type: Boolean}) hasOverflow = false;
  /**
   * The tabindex of the underlying list element.
   */
  @property({attribute: 'list-tabindex', type: Number}) listTabIndex = 0;
  /**
   * The corner of the menu which to align the anchor in the standard logical
   * property style of <block>_<inline>.
   */
  @property({attribute: 'menu-corner'}) menuCorner: Corner = Corner.START_START;
  /**
   * Opens the menu and makes it visible. Alternative to the `.show()` and
   * `.close()` methods
   */
  @property({reflect: true, type: Boolean}) open = false;
  /**
   * Skips the opening and closing animations.
   */
  @property({type: Boolean}) quick = false;

  /**
   * After closing, does not restore focus to the last focused element before
   * the menu was opened.
   */
  @property({attribute: 'skip-restore-focus', type: Boolean})
  skipRestoreFocus = false;

  /**
   * Keeps the menu open when focus leaves the menu's composed subtree.
   *
   * NOTE: Focusout behavior will stop propagation of the focusout event. Set
   * this property to true to opt-out of menu's focuout handling altogether.
   */
  @property({attribute: 'stay-open-on-focusout', type: Boolean})
  stayOpenOnFocusout = false;

  /**
   * Keeps the user clicks outside the menu.
   *
   * NOTE: clicking outside may still cause focusout to close the menu so see
   * `stayOpenOnFocusout`.
   */
  @property({attribute: 'stay-open-on-outside-click', type: Boolean})
  stayOpenOnOutsideClick = false;

  /**
   * Offsets the menu's inline alignment from the anchor by the given number in
   * pixels. This value is direction aware and will follow the LTR / RTL
   * direction.
   *
   * e.g. LTR: positive -> right, negative -> left
   *      RTL: positive -> left, negative -> right
   */
  @property({attribute: 'x-offset', type: Number}) xOffset = 0;

  /**
   * Offsets the menu's block alignment from the anchor by the given number in
   * pixels.
   *
   * e.g. positive -> down, negative -> up
   */
  @property({attribute: 'y-offset', type: Number}) yOffset = 0;

  /**
   * Performs the closing animation:
   *
   * https://direct.googleplex.com/#/spec/295000003+271060003
   */
  private animateClose() {
    let promiseResolve!: (value: unknown) => void;
    let promiseReject!: () => void;

    // This promise blocks the surface position controller from setting
    // display: none on the surface which will interfere with this animation.
    const animationEnded = new Promise((resolve, reject) => {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    const surfaceEl = this.surfaceEl;
    const slotEl = this.slotEl;

    if (!surfaceEl || !slotEl) {
      promiseReject();
      return animationEnded;
    }

    const openDirection = this.openDirection;
    const closingDownwards = openDirection === 'UP';
    this.dispatchEvent(new Event('closing'));
    // needs to be imperative because we don't want to mix animation and Lit
    // render timing
    surfaceEl.classList.toggle('animating', true);
    const signal = this.openCloseAnimationSignal.start();
    const height = surfaceEl.offsetHeight;
    // const children = this.items;
    const FULL_DURATION = 150;
    const SURFACE_OPACITY_DURATION = 50;
    // The surface fades away at the very end
    const SURFACE_OPACITY_DELAY = FULL_DURATION - SURFACE_OPACITY_DURATION;
    // const ITEM_OPACITY_DURATION = 50;
    // const ITEM_OPACITY_INIT// todo: revisitIAL_DELAY = 50;
    const END_HEIGHT_PERCENTAGE = .35;

    // todo: revisit
    // We want to fit every child fade-out animation within the full duration of
    // the animation.
    // const DELAY_BETWEEN_ITEMS =
    //     (FULL_DURATION - ITEM_OPACITY_INITIAL_DELAY - ITEM_OPACITY_DURATION) /
    //     children.length;

    // The mock has the animation shrink to 35%
    const surfaceHeightAnimation = surfaceEl.animate(
        [
          {height: `${height}px`},
          {height: `${height * END_HEIGHT_PERCENTAGE}px`},
        ],
        {
          duration: FULL_DURATION,
          easing: EASING.EMPHASIZED_ACCELERATE,
        });

    // When we are closing downwards, we want to make sure the last item is
    // always in view, so we need to translate it upwards the opposite direction
    // of the height animation
    const downPositionCorrectionAnimation = slotEl.animate(
        [
          {transform: ''}, {
            transform: closingDownwards ?
                `translateY(-${height * (1 - END_HEIGHT_PERCENTAGE)}px)` :
                '',
          },
        ],
        {duration: FULL_DURATION, easing: EASING.EMPHASIZED_ACCELERATE});

    const surfaceOpacityAnimation = surfaceEl.animate(
        [{opacity: 1}, {opacity: 0}],
        {delay: SURFACE_OPACITY_DELAY, duration: SURFACE_OPACITY_DURATION});

    const childrenAnimations: Array<[HTMLElement, Animation]> = [];

    // todo: revisit
    // for (let i = 0; i < children.length; i++) {
    //   // If the animation is closing upwards, then reverse the list of
    //   // children so that we animate in the opposite direction.
    //   const directionalIndex = closingDownwards ? i : children.length - 1 - i;
    //   const child = children[directionalIndex];
    //   const animation = child.animate([{opacity: 1}, {opacity: 0}], {
    //     delay: ITEM_OPACITY_INITIAL_DELAY + DELAY_BETWEEN_ITEMS * i,
    //     duration: ITEM_OPACITY_DURATION,
    //   });

    //   // Make sure the items stay hidden at the end of each child animation.
    //   // We clean this up at the end of the overall animation.
    //   animation.addEventListener('finish', () => {
    //     child.classList.toggle('hidden', true);
    //   });
    //   childrenAnimations.push([child, animation]);
    // }

    signal.addEventListener('abort', () => {
      surfaceHeightAnimation.cancel();
      downPositionCorrectionAnimation.cancel();
      surfaceOpacityAnimation.cancel();
      childrenAnimations.forEach(([child, animation]) => {
        animation.cancel();
        child.classList.toggle('hidden', false);
      });
      promiseReject();
    });

    surfaceHeightAnimation.addEventListener('finish', () => {
      surfaceEl.classList.toggle('animating', false);
      childrenAnimations.forEach(([child]) => {
        child.classList.toggle('hidden', false);
      });
      this.openCloseAnimationSignal.finish();
      this.dispatchEvent(new Event('closed'));
      promiseResolve(true);
    });

    return animationEnded;
  }

  /**
   * Performs the opening animation:
   *
   * https://direct.googleplex.com/#/spec/295000003+271060003
   */
  private animateOpen() {
    const surfaceEl = this.surfaceEl;
    const slotEl = this.slotEl;

    if (!surfaceEl || !slotEl) return;

    const openDirection = this.openDirection;
    this.dispatchEvent(new Event('opening'));
    // needs to be imperative because we don't want to mix animation and Lit
    // render timing
    surfaceEl.classList.toggle('animating', true);

    const signal = this.openCloseAnimationSignal.start();
    const height = surfaceEl.offsetHeight;
    const openingUpwards = openDirection === 'UP';
    // const children = this.items;
    const FULL_DURATION = 500;
    const SURFACE_OPACITY_DURATION = 50;
    // const ITEM_OPACITY_DURATION = 250;

    // todo: revisit
    // We want to fit every child fade-in animation within the full duration of
    // the animation.
    // const DELAY_BETWEEN_ITEMS =
    //     (FULL_DURATION - ITEM_OPACITY_DURATION) / children.length;

    const surfaceHeightAnimation =
        surfaceEl.animate([{height: '0px'}, {height: `${height}px`}], {
          duration: FULL_DURATION,
          easing: EASING.EMPHASIZED,
        });
    // When we are opening upwards, we want to make sure the last item is always
    // in view, so we need to translate it upwards the opposite direction of the
    // height animation
    const upPositionCorrectionAnimation = slotEl.animate(
        [
          {transform: openingUpwards ? `translateY(-${height}px)` : ''},
          {transform: ''},
        ],
        {duration: FULL_DURATION, easing: EASING.EMPHASIZED});

    const surfaceOpacityAnimation = surfaceEl.animate(
        [{opacity: 0}, {opacity: 1}], SURFACE_OPACITY_DURATION);

    const childrenAnimations: Array<[HTMLElement, Animation]> = [];

    // todo: revisit
    // for (let i = 0; i < children.length; i++) {
    //   // If we are animating upwards, then reverse the children list.
    //   const directionalIndex = openingUpwards ? children.length - 1 - i : i;
    //   const child = children[directionalIndex];
    //   const animation = child.animate([{opacity: 0}, {opacity: 1}], {
    //     delay: DELAY_BETWEEN_ITEMS * i,
    //     duration: ITEM_OPACITY_DURATION,
    //   });

    //   // Make them all initially hidden and then clean up at the end of each
    //   // animation.
    //   child.classList.toggle('hidden', true);
    //   animation.addEventListener('finish', () => {
    //     child.classList.toggle('hidden', false);
    //   });

    //   childrenAnimations.push([child, animation]);
    // }

    signal.addEventListener('abort', () => {
      surfaceHeightAnimation.cancel();
      upPositionCorrectionAnimation.cancel();
      surfaceOpacityAnimation.cancel();
      childrenAnimations.forEach(([child, animation]) => {
        child.classList.toggle('hidden', false);
        animation.cancel();
      });
    });

    surfaceHeightAnimation.addEventListener('finish', () => {
      surfaceEl.classList.toggle('animating', false);
      this.openCloseAnimationSignal.finish();
      this.dispatchEvent(new Event('opened'));
    });
  }

  private getSurfaceClasses() {
    return {
      fixed: this.fixed,
      'has-overflow': this.hasOverflow,
      open: this.open,
    };
  }

  private handleCloseOnFocusout(e: Event) {
    e.stopPropagation();
    this.stayOpenOnFocusout = false;
  }

  private async handleFocusout(e: FocusEvent) {
    if (this.stayOpenOnFocusout) {
      return;
    }

    // Stop propagation to prevent nested menus from interfering with each other
    e.stopPropagation();

    if (e.relatedTarget) {
      // Don't close the menu if we are switching focus between menu,
      // md-menu-item, and md-list
      if (isElementInSubtree(e.relatedTarget, this)) {
        return;
      }
    }

    const oldRestoreFocus = this.skipRestoreFocus;
    // allow focus to continue to the next focused object rather than returning
    this.skipRestoreFocus = true;
    this.close();
    // await for close
    await this.updateComplete;
    // return to previous behavior
    this.skipRestoreFocus = oldRestoreFocus;
  }

  // Capture so that we can grab the event before it reaches the list item
  // istelf. Specifically useful for the case where typeahead encounters a space
  // and we don't want the menu item to close the menu.
  @eventOptions({capture: true})
  private handleListKeydown(e: KeyboardEvent) {
    if (e.target === this.slotElement && !e.defaultPrevented &&
        isClosableKey(e.code)) {
      e.preventDefault();
      this.close();
    }
  }

  private handleStayOpenOnFocusout(e: Event) {
    e.stopPropagation();
    this.stayOpenOnFocusout = true;
  }

  private onCloseMenu() {
    this.close();
  }

  private onDeactivateItems(e: Event) {
    e.stopPropagation();

    // todo: revisit
    // const items = this.items;
    // for (const item of items) {
    //   item.active = false;
    //   item.selected = false;
    // }
  }

  /**
   * Whether the menu is animating upwards or downwards when opening. This is
   * helpful for calculating some animation calculations.
   */
  private get openDirection(): 'DOWN'|'UP' {
    const menuCornerBlock = this.menuCorner.split('_')[0];
    return menuCornerBlock === 'START' ? 'DOWN' : 'UP';
  }

  /**
   * Renders the elevation component.
   */
  private renderElevation() {
    return html`<md-elevation></md-elevation>`;
  }

  /**
   * Renders the focus ring component.
   */
  private renderFocusRing() {
    return html`<md-focus-ring for="list"></md-focus-ring>`;
  }

  /**
   * Renders the List element and its items
   */
  private renderList() {
    return html`<slot
        @close-menu=${this.onCloseMenu}
        @deactivate-items=${this.onDeactivateItems}
        @stay-open-on-focusout=${this.handleStayOpenOnFocusout}
        @close-on-focusout=${this.handleCloseOnFocusout}></slot>`;
  }

  /**
   * Renders the positionable surface element and its contents.
   */
  private renderSurface() {
    // TODO(b/274140618): elevation should be an underlay, not an overlay that
    // tints content
    return html`
       <div
          class="menu ${classMap(this.getSurfaceClasses())}"
          style=${styleMap(this.menuPositionController.surfaceStyles)}
          @focusout=${this.handleFocusout}>
        ${this.renderElevation()}
        ${this.renderList()}
        ${this.renderFocusRing()}
       </div>
     `;
  }

  close() {
    this.open = false;

    // todo: revisit
    // this.items.forEach(item => {
    //   item.close?.();
    // });
  }

  override connectedCallback() {
    super.connectedCallback();
    if (!isServer) {
      window.addEventListener('click', this.onWindowClick, {capture: true});
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (!isServer) {
      window.removeEventListener('click', this.onWindowClick, {capture: true});
    }
  }

  override focus() {
    this.slotElement?.focus();
  }

  protected override render() {
    return this.renderSurface();
  }

  show() {
    console.debug('show');

    this.open = true;
  }

  static {
    requestUpdateOnAriaChange(this);
  }
}
