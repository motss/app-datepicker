export function targetScrollTo(
  target: null | HTMLElement,
  scrollToOptions: ScrollToOptions
): void {
  if (!target) return;

  /**
   * NOTE: Due to `Element.scrollTo` and `ScrollToOptions` are not widely supported,
   * this helper can fallback to old school way of updating scrolling position.
   *
   * Links below for more browser compat:-
   *
   *   1. https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo
   *   2. https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo
   */
  if (target.scrollTo == null) {
    const { top, left } = scrollToOptions || {} as ScrollToOptions;

    target.scrollTop = top || 0;
    target.scrollLeft = left || 0;
  } else {
    target.scrollTo(scrollToOptions);
  }
}
