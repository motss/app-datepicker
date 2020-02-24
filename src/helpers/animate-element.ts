interface AnimateElementOptions {
  hasNativeWebAnimation?: boolean;
  keyframes?: Keyframe[];
  options?: KeyframeAnimationOptions;
}

export async function animateElement(
  node: HTMLElement,
  opts: AnimateElementOptions
): Promise<void> {
  const {
    hasNativeWebAnimation = false,
    keyframes = [],
    options = { duration: 100 },
  } = opts || {};

  if (!Array.isArray(keyframes) || !keyframes.length) return;

  return new Promise<void>((y) => {
    if (hasNativeWebAnimation) {
      const animationEnd = node.animate(keyframes, options);

      animationEnd.onfinish = () => y();
    } else {
      const [, endFrame] = keyframes || [];
      const transitionEnd = () => {
        node.removeEventListener('transitionend', transitionEnd);
        y();
      };

      node.addEventListener('transitionend', transitionEnd);
      node.style.transitionDuration = `${options.duration}ms`;

      if (options.easing) node.style.transitionTimingFunction = options.easing;

      Object.keys(endFrame).forEach((n) => {
        if (n) (node.style as any)[n] = endFrame[n];
      });
    }
  });
}
