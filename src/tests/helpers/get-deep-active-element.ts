export async function getDeepActiveElement(): Promise<string> {
  const classesString = await browser.executeAsync((done) => {
    let a = document.activeElement;

    while (a?.shadowRoot) {
      a = a.shadowRoot.activeElement;
    }

    done(`.${Array.from(a?.classList?.values() ?? []).join('.')}`);
  });

  return classesString;
}
