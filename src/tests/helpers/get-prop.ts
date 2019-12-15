export async function getProp<T>(selector: string, propertyName: string): Promise<T> {
  return browser.executeAsync((a, b, done) => {
    const el = document.body.querySelector(a)!;

    done((el as any)[b]);
  }, selector, propertyName);
}
