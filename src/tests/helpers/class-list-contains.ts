export async function classListContains(
  rootSelector: string,
  selector: string,
  classes: string
): Promise<boolean> {
  const result = await browser.executeAsync(async (a, b, c, done) => {
    const el: HTMLElement = document.body.querySelector(a)!;
    const el2: HTMLElement = el.shadowRoot!.querySelector(b)!;

    done(el2.classList.contains(c));
  }, rootSelector, selector, classes);

  return result;
}
