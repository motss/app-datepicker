export async function getAttr<T>(
  selector: string,
  attributeName: string
): Promise<T> {
  return browser.executeAsync((a, b, done) => {
    const el = document.body.querySelector<HTMLElement>(a)!;

    done(el.getAttribute(b));
  }, selector, attributeName);
}
