import '@material/web/focus/md-focus-ring.js';
import '@material/web/elevation/elevation.js';

import { createAnimationSignal, EASING } from '@material/web/internal/motion/animation.js';
import {
  FocusState,
  isClosableKey,
  isElementInSubtree,
} from '@material/web/menu/internal/controllers/shared.js';
import {
  Corner,
  SurfacePositionController,
  type SurfacePositionTarget,
} from '@material/web/menu/internal/controllers/surfacePositionController.js';
import { html, isServer, LitElement, nothing, type PropertyValues } from 'lit';
import { property, query, queryAssignedElements } from 'lit/decorators.js';
import { type ClassInfo, classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

export { Corner } from '@material/web/menu/internal/controllers/surfacePositionController.js';

/**
 * Gets the currently focused element on the page.
 *
 * @param activeDoc The document or shadowroot from which to start the search.
 *    Defaults to `window.document`
 * @return Returns the currently deeply focused element or `null` if none.
 */
function getFocusedElement(
  activeDoc: Document | ShadowRoot = document
): HTMLElement | null {
  let activeEl = activeDoc.activeElement as HTMLElement | null;

  // Check for activeElement in the case that an element with a shadow root host
  // is currently focused.
  while (activeEl && activeEl?.shadowRoot?.activeElement) {
    activeEl = activeEl.shadowRoot.activeElement as HTMLElement | null;
  }

  return activeEl;
}

/**
 * @fires opening {Event} Fired before the opening animation begins
 * @fires opened {Event} Fired once the menu is open, after any animations
 * @fires closing {Event} Fired before the closing animation begins
 * @fires closed {Event} Fired once the menu is closed, after any animations
 */
export abstract class MenuSurface extends LitElement {
  /**
   * Animates closed.
   */
  private readonly beforeClose = async () => {
    this.open = false;

    if (!this.skipRestoreFocus) {
      this.lastFocusedElement?.focus?.();
    }

    if (!this.quick) {
      await this.animateClose();
    }
  };
  private currentAnchorElement: HTMLElement | null = null;

  private readonly handleFocusout = async (event: FocusEvent) => {
    const anchorEl = this.anchorElement!;
    // Do not close if we focused out by clicking on the anchor element. We
    // can't assume anchor buttons can be the related target because of iOS does
    // not focus buttons.
    if (
      this.stayOpenOnFocusout ||
      !this.open ||
      this.pointerPath.includes(anchorEl)
    ) {
      return;
    }

    if (event.relatedTarget) {
      // Don't close the menu if we are switching focus between menu,
      // md-menu-item, and md-list or if the anchor was click focused, but check
      // if length of pointerPath is 0 because that means something was at least
      // clicked (shift+tab case).
      if (
        isElementInSubtree(event.relatedTarget, this) ||
        (this.pointerPath.length !== 0 &&
          isElementInSubtree(event.relatedTarget, anchorEl))
      ) {
        return;
      }
    } else if (this.pointerPath.includes(this)) {
      // If menu tabindex == -1 and the user clicks on the menu or a divider, we
      // want to keep the menu open.
      return;
    }

    const oldRestoreFocus = this.skipRestoreFocus;
    // allow focus to continue to the next focused object rather than returning
    this.skipRestoreFocus = true;
    this.close();
    // await for close
    await this.updateComplete;
    // return to previous behavior
    this.skipRestoreFocus = oldRestoreFocus;
  };
  private readonly internals =
    // Cast needed for closure
    (this as HTMLElement).attachInternals();
  /**
   * Whether or not the menu is repositoining due to window / document resize
   */
  private isRepositioning = false;

  /**
   * The element that was focused before the menu opened.
   */
  private lastFocusedElement: HTMLElement | null = null;

  /**
   * Handles positioning the surface and aligning it to the anchor as well as
   * keeping it in the viewport.
   */
  private readonly menuPositionController = new SurfacePositionController(
    this,
    () => {
      debugger;
      return {
        anchorCorner: this.anchorCorner,
        anchorEl: this.anchorElement,
        beforeClose: this.beforeClose,
        isOpen: this.open,
        onClose: this.onClosed,
        onOpen: this.onOpened,
        positioning:
          this.positioning === 'popover' ? 'document' : this.positioning,
        // content.
        repositionStrategy:
          this.hasOverflow && this.positioning !== 'popover'
            ? 'move'
            : 'resize',
        surfaceCorner: this.menuCorner,
        surfaceEl: this.surfaceEl,
        xOffset: this.xOffset,
        // We can't resize components that have overflow like menus with
        // submenus because the overflow-y will show menu items / content
        // outside the bounds of the menu. Popover API fixes this because each
        // submenu is hoisted to the top-layer and are not considered overflow
        yOffset: this.yOffset,
      };
    }
  );
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
   * We cannot listen to window click because Safari on iOS will not bubble a
   * click event on window if the item clicked is not a "clickable" item such as
   * <body>
   */
  private readonly onDocumentClick = (event: Event) => {
    if (!this.open) {
      return;
    }

    const path = event.composedPath();

    if (
      !this.stayOpenOnOutsideClick &&
      !path.includes(this) &&
      !path.includes(this.anchorElement!)
    ) {
      this.open = false;
    }
  };
  /**
   * Saves the last focused element focuses the new element based on
   * `defaultFocus`, and animates open.
   */
  private readonly onOpened = async () => {
    this.lastFocusedElement = getFocusedElement();

    // const items = this.items;
    // const activeItemRecord = getActiveItem(items);

    // if (activeItemRecord && this.defaultFocus !== FocusState.NONE) {
    //   activeItemRecord.item.tabIndex = -1;
    // }

    let animationAborted = !this.quick;

    if (this.quick) {
      this.dispatchEvent(new Event('opening'));
    } else {
      animationAborted = !!(await this.animateOpen());
    }

    // This must come after the opening animation or else it may focus one of
    // the items before the animation has begun and causes the list to slide
    // (block-padding-of-the-menu)px at the end of the animation
    switch (this.defaultFocus) {
      case FocusState.LIST_ROOT:
        this.focus();
        break;
      default:
      case FocusState.NONE:
        // Do nothing.
        break;
    }

    if (!animationAborted) {
      this.dispatchEvent(new Event('opened'));
    }
  };
  private readonly onWindowPointerdown = (event: PointerEvent) => {
    this.pointerPath = event.composedPath();
  };
  private readonly onWindowResize = () => {
    if (
      this.isRepositioning ||
      (this.positioning !== 'document' &&
        this.positioning !== 'fixed' &&
        this.positioning !== 'popover')
    ) {
      return;
    }
    this.isRepositioning = true;
    this.reposition();
    this.isRepositioning = false;
  };
  private readonly openCloseAnimationSignal = createAnimationSignal();
  /**
   * The event path of the last window pointerdown event.
   */
  private pointerPath: EventTarget[] = [];
  @query('slot') private readonly slotEl!: HTMLSlotElement | null;

  @query('.menu') private readonly surfaceEl!: HTMLElement | null;

  /**
   * The ID of the element in the same root node in which the menu should align
   * to. Overrides setting `anchorElement = elementReference`.
   *
   * __NOTE__: anchor or anchorElement must either be an HTMLElement or resolve
   * to an HTMLElement in order for menu to open.
   */
  @property() anchor = '';

  /**
   * The corner of the anchor which to align the menu in the standard logical
   * property style of <block>-<inline> e.g. `'end-start'`.
   *
   * NOTE: This value may not be respected by the menu positioning algorithm
   * if the menu would render outisde the viewport.
   */
  @property({attribute: 'anchor-corner'})
  anchorCorner: Corner = Corner.END_START;

  /**
   * The element that should be focused by default once opened.
   *
   * NOTE: When setting default focus to 'LIST_ROOT', remember to change
   * `tabindex` to `0` and change md-menu's display to something other than
   * `display: contents` when necessary.
   */
  @property({attribute: 'default-focus'})
  defaultFocus: FocusState = FocusState.FIRST_ITEM;
  /**
   * Displays overflow content like a submenu. Not required in most cases when
   * using `positioning="popover"`.
   *
   * __NOTE__: This may cause adverse effects if you set
   * `md-menu {max-height:...}`
   * and have items overflowing items in the "y" direction.
   */
  @property({attribute: 'has-overflow', type: Boolean}) hasOverflow = false;

  /**
   * Whether or not the current menu is a submenu and should not handle specific
   * navigation keys.
   *
   * @exports
   */
  isSubmenu = false;

  /**
   * The corner of the menu which to align the anchor in the standard logical
   * property style of <block>-<inline> e.g. `'start-start'`.
   *
   * NOTE: This value may not be respected by the menu positioning algorithm
   * if the menu would render outisde the viewport.
   */
  @property({attribute: 'menu-corner'}) menuCorner: Corner = Corner.START_START;

  /**
   * Opens the menu and makes it visible. Alternative to the `.show()` and
   * `.close()` methods
   */
  @property({reflect: true, type: Boolean}) open = false;

  /**
   * Whether the positioning algorithm should calculate relative to the parent
   * of the anchor element (`absolute`), relative to the window (`fixed`), or
   * relative to the document (`document`). `popover` will use the popover API
   * to render the menu in the top-layer. If your browser does not support the
   * popover API, it will fall back to `fixed`.
   *
   * __Examples for `position = 'fixed'`:__
   *
   * - If there is no `position:relative` in the given parent tree and the
   *   surface is `position:absolute`
   * - If the surface is `position:fixed`
   * - If the surface is in the "top layer"
   * - The anchor and the surface do not share a common `position:relative`
   *   ancestor
   *
   * When using `positioning=fixed`, in most cases, the menu should position
   * itself above most other `position:absolute` or `position:fixed` elements
   * when placed inside of them. e.g. using a menu inside of an `md-dialog`.
   *
   * __NOTE__: Fixed menus will not scroll with the page and will be fixed to
   * the window instead.
   *
   * __Examples for `position = 'document'`:__
   *
   * - There is no parent that creates a relative positioning context e.g.
   *   `position: relative`, `position: absolute`, `transform: translate(x, y)`,
   *   etc.
   * - You put the effort into hoisting the menu to the top of the DOM like the
   *   end of the `<body>` to render over everything or in a top-layer.
   * - You are reusing a single `md-menu` element that dynamically renders
   *   content.
   *
   * __Examples for `position = 'popover'`:__
   *
   * - Your browser supports `popover`.
   * - Most cases. Once popover is in browsers, this will become the default.
   */
  @property() positioning: 'absolute' | 'document' | 'fixed' | 'popover' =
    'absolute';

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

  @queryAssignedElements({ flatten: true }) readonly slotElements!: HTMLElement[];

  @queryAssignedElements({flatten: true}) protected slotItems!: HTMLElement[];

  /**
   * Keeps the menu open when focus leaves the menu's composed subtree.
   *
   * NOTE: Focusout behavior will stop propagation of the focusout event. Set
   * this property to true to opt-out of menu's focusout handling altogether.
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

  constructor() {
    super();
    if (!isServer) {
      this.internals.role = 'menu';
      // Capture so that we can grab the event before it reaches the menu item
      // istelf. Specifically useful for the case where typeahead encounters a
      // space and we don't want the menu item to close the menu.
      this.addEventListener('keydown', this.captureKeydown, {capture: true});
      this.addEventListener('focusout', this.handleFocusout);
    }
  }

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
    const children = this.items;
    const FULL_DURATION = 150;
    const SURFACE_OPACITY_DURATION = 50;
    // The surface fades away at the very end
    const SURFACE_OPACITY_DELAY = FULL_DURATION - SURFACE_OPACITY_DURATION;
    const ITEM_OPACITY_DURATION = 50;
    const ITEM_OPACITY_INITIAL_DELAY = 50;
    const END_HEIGHT_PERCENTAGE = 0.35;

    // We want to fit every child fade-out animation within the full duration of
    // the animation.
    const DELAY_BETWEEN_ITEMS =
      (FULL_DURATION - ITEM_OPACITY_INITIAL_DELAY - ITEM_OPACITY_DURATION) /
      children.length;

    // The mock has the animation shrink to 35%
    const surfaceHeightAnimation = surfaceEl.animate(
      [
        {height: `${height}px`},
        {height: `${height * END_HEIGHT_PERCENTAGE}px`},
      ],
      {
        duration: FULL_DURATION,
        easing: EASING.EMPHASIZED_ACCELERATE,
      }
    );

    // When we are closing downwards, we want to make sure the last item is
    // always in view, so we need to translate it upwards the opposite direction
    // of the height animation
    const downPositionCorrectionAnimation = slotEl.animate(
      [
        {transform: ''},
        {
          transform: closingDownwards
            ? `translateY(-${height * (1 - END_HEIGHT_PERCENTAGE)}px)`
            : '',
        },
      ],
      {duration: FULL_DURATION, easing: EASING.EMPHASIZED_ACCELERATE}
    );

    const surfaceOpacityAnimation = surfaceEl.animate(
      [{opacity: 1}, {opacity: 0}],
      {delay: SURFACE_OPACITY_DELAY, duration: SURFACE_OPACITY_DURATION}
    );

    const childrenAnimations: Array<[HTMLElement, Animation]> = [];

    for (let i = 0; i < children.length; i++) {
      // If the animation is closing upwards, then reverse the list of
      // children so that we animate in the opposite direction.
      const directionalIndex = closingDownwards ? i : children.length - 1 - i;
      const child = children[directionalIndex];
      const animation = child.animate([{opacity: 1}, {opacity: 0}], {
        delay: ITEM_OPACITY_INITIAL_DELAY + DELAY_BETWEEN_ITEMS * i,
        duration: ITEM_OPACITY_DURATION,
      });

      // Make sure the items stay hidden at the end of each child animation.
      // We clean this up at the end of the overall animation.
      animation.addEventListener('finish', () => {
        child.classList.toggle('md-menu-hidden', true);
      });
      childrenAnimations.push([child, animation]);
    }

    signal.addEventListener('abort', () => {
      surfaceHeightAnimation.cancel();
      downPositionCorrectionAnimation.cancel();
      surfaceOpacityAnimation.cancel();
      childrenAnimations.forEach(([child, animation]) => {
        animation.cancel();
        child.classList.toggle('md-menu-hidden', false);
      });
      promiseReject();
    });

    surfaceHeightAnimation.addEventListener('finish', () => {
      surfaceEl.classList.toggle('animating', false);
      childrenAnimations.forEach(([child]) => {
        child.classList.toggle('md-menu-hidden', false);
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
   *
   * @return A promise that resolve to `true` if the animation was aborted,
   *     `false` if it was not aborted.
   */
  private async animateOpen() {
    const surfaceEl = this.surfaceEl;
    const slotEl = this.slotEl;

    if (!surfaceEl || !slotEl) return true;

    const openDirection = this.openDirection;
    this.dispatchEvent(new Event('opening'));
    // needs to be imperative because we don't want to mix animation and Lit
    // render timing
    surfaceEl.classList.toggle('animating', true);

    const signal = this.openCloseAnimationSignal.start();
    const height = surfaceEl.offsetHeight;
    const openingUpwards = openDirection === 'UP';
    const children = this.items;
    const FULL_DURATION = 500;
    const SURFACE_OPACITY_DURATION = 50;
    const ITEM_OPACITY_DURATION = 250;
    // We want to fit every child fade-in animation within the full duration of
    // the animation.
    const DELAY_BETWEEN_ITEMS =
      (FULL_DURATION - ITEM_OPACITY_DURATION) / children.length;

    const surfaceHeightAnimation = surfaceEl.animate(
      [{height: '0px'}, {height: `${height}px`}],
      {
        duration: FULL_DURATION,
        easing: EASING.EMPHASIZED,
      }
    );
    // When we are opening upwards, we want to make sure the last item is always
    // in view, so we need to translate it upwards the opposite direction of the
    // height animation
    const upPositionCorrectionAnimation = slotEl.animate(
      [
        {transform: openingUpwards ? `translateY(-${height}px)` : ''},
        {transform: ''},
      ],
      {duration: FULL_DURATION, easing: EASING.EMPHASIZED}
    );

    const surfaceOpacityAnimation = surfaceEl.animate(
      [{opacity: 0}, {opacity: 1}],
      SURFACE_OPACITY_DURATION
    );

    const childrenAnimations: Array<[HTMLElement, Animation]> = [];

    for (let i = 0; i < children.length; i++) {
      // If we are animating upwards, then reverse the children list.
      const directionalIndex = openingUpwards ? children.length - 1 - i : i;
      const child = children[directionalIndex];
      const animation = child.animate([{opacity: 0}, {opacity: 1}], {
        delay: DELAY_BETWEEN_ITEMS * i,
        duration: ITEM_OPACITY_DURATION,
      });

      // Make them all initially hidden and then clean up at the end of each
      // animation.
      child.classList.toggle('md-menu-hidden', true);
      animation.addEventListener('finish', () => {
        child.classList.toggle('md-menu-hidden', false);
      });

      childrenAnimations.push([child, animation]);
    }

    let resolveAnimation = (_value: boolean) => {};
    const animationFinished = new Promise<boolean>((resolve) => {
      resolveAnimation = resolve;
    });

    signal.addEventListener('abort', () => {
      surfaceHeightAnimation.cancel();
      upPositionCorrectionAnimation.cancel();
      surfaceOpacityAnimation.cancel();
      childrenAnimations.forEach(([child, animation]) => {
        child.classList.toggle('md-menu-hidden', false);
        animation.cancel();
      });

      resolveAnimation(true);
    });

    surfaceHeightAnimation.addEventListener('finish', () => {
      surfaceEl.classList.toggle('animating', false);
      this.openCloseAnimationSignal.finish();
      resolveAnimation(false);
    });

    return await animationFinished;
  }

  private captureKeydown(event: KeyboardEvent) {
    if (
      event.target === this &&
      !event.defaultPrevented &&
      isClosableKey(event.code)
    ) {
      event.preventDefault();
      this.close();
    }
  }

  private cleanUpGlobalEventListeners() {
    document.removeEventListener('click', this.onDocumentClick, {
      capture: true,
    });
    window.removeEventListener('pointerdown', this.onWindowPointerdown);
    document.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('resize', this.onWindowResize);
  }

  private getSurfaceClasses(): ClassInfo {
    return {
      fixed: this.positioning === 'fixed',
      'has-overflow': this.hasOverflow,
      open: this.open,
    };
  }

  private handleCloseOnFocusout(event: Event) {
    event.stopPropagation();
    this.stayOpenOnFocusout = false;
  }

  private handleStayOpenOnFocusout(event: Event) {
    event.stopPropagation();
    this.stayOpenOnFocusout = true;
  }

  private onCloseMenu() {
    this.close();
  }

  private onDeactivateItems(event: Event) {
    event.stopPropagation();
    // this.listController.onDeactivateItems();
  }

  private onRequestActivation(event: Event) {
    event.stopPropagation();
    // this.listController.onRequestActivation(event);
  }

  /**
   * Whether the menu is animating upwards or downwards when opening. This is
   * helpful for calculating some animation calculations.
   */
  private get openDirection(): 'DOWN' | 'UP' {
    const menuCornerBlock = this.menuCorner.split('-')[0];
    return menuCornerBlock === 'start' ? 'DOWN' : 'UP';
  }

  /**
   * Renders the elevation component.
   */
  private renderElevation() {
    return html`<md-elevation part="elevation"></md-elevation>`;
  }

  /**
   * Renders the menu items' slot
   */
  private renderMenuItems() {
    // @slotchange=${this.listController.onSlotchange}
    return html`<slot
      @close-menu=${this.onCloseMenu}
      @deactivate-items=${this.onDeactivateItems}
      @request-activation=${this.onRequestActivation}
      @stay-open-on-focusout=${this.handleStayOpenOnFocusout}
      @close-on-focusout=${this.handleCloseOnFocusout}
    ></slot>`;
  }

  /**
   * Renders the positionable surface element and its contents.
   */
  private renderSurface() {
    return html`
      <div
        class="menu ${classMap(this.getSurfaceClasses())}"
        style=${styleMap(this.menuPositionController.surfaceStyles)}
        popover=${this.positioning === 'popover' ? 'manual' : nothing}>
        ${this.renderElevation()}
        <div class="items">
          <div class="item-padding"> ${this.renderMenuItems()} </div>
        </div>
      </div>
    `;
  }

  private setUpGlobalEventListeners() {
    document.addEventListener('click', this.onDocumentClick, {capture: true});
    window.addEventListener('pointerdown', this.onWindowPointerdown);
    document.addEventListener('resize', this.onWindowResize, {passive: true});
    window.addEventListener('resize', this.onWindowResize, {passive: true});
  }

  close() {
    this.open = false;
    const maybeSubmenu = this.slotItems as Array<
      HTMLElement & {close?: () => void}
    >;
    maybeSubmenu.forEach((item) => {
      item.close?.();
    });
  }

  override connectedCallback() {
    super.connectedCallback();
    if (this.open) {
      this.setUpGlobalEventListeners();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanUpGlobalEventListeners();
  }

  protected override render() {
    return this.renderSurface();
  }

  /**
   * Repositions the menu if it is open.
   *
   * Useful for the case where document or window-positioned menus have their
   * anchors moved while open.
   */
  reposition() {
    if (this.open) {
      this.menuPositionController.position();
    }
  }

  show() {
    this.open = true;
  }

  override update(changed: PropertyValues<this>) {
    if (changed.has('open')) {
      if (this.open) {
        this.setUpGlobalEventListeners();
      } else {
        this.cleanUpGlobalEventListeners();
      }
    }

    // Firefox does not support popover. Fall-back to using fixed.
    if (
      changed.has('positioning') &&
      this.positioning === 'popover' &&
      // type required for Google JS conformance
      !(this as unknown as {showPopover?: () => void}).showPopover
    ) {
      this.positioning = 'fixed';
    }

    super.update(changed);
  }

  protected override willUpdate(changed: PropertyValues<this>) {
    if (!changed.has('open')) {
      return;
    }

    if (this.open) {
      this.removeAttribute('aria-hidden');
      return;
    }

    this.setAttribute('aria-hidden', 'true');
  }

  /**
   * The element which the menu should align to. If `anchor` is set to a
   * non-empty idref string, then `anchorEl` will resolve to the element with
   * the given id in the same root node. Otherwise, `null`.
   */
  get anchorElement(): (HTMLElement & Partial<SurfacePositionTarget>) | null {
    if (this.anchor) {
      return (this.getRootNode() as Document | ShadowRoot).querySelector(
        `#${this.anchor}`
      );
    }

    return this.currentAnchorElement;
  }

  set anchorElement(
    element: (HTMLElement & Partial<SurfacePositionTarget>) | null
  ) {
    this.currentAnchorElement = element;
    this.requestUpdate('anchorElement');
  }

  /**
   * The menu items associated with this menu. The items must be `MenuItem`s and
   * have both the `md-menu-item` and `md-list-item` attributes.
   */
  get items(): HTMLElement[] {
    return this.slotElements;
  }
}
