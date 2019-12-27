import { AppDatepicker } from '../../app-datepicker.js';
import { StartView } from '../../custom_typings.js';
import { APP_INDEX_URL } from '../constants.js';
import { deepStrictEqual } from '../helpers/typed-assert.js';

type A11yReport = { type: 'success' } | {
  type: 'error';
  name: string;
  message: string;
  stack: string;
};

describe('ally', () => {
  const elementName = 'app-datepicker';
  const toError = (result: A11yReport) => {
    if (result.type === 'success') return '';

    const { message, name, stack } = result ?? {};

    const err = new Error(message);

    if (name) err.name = name;
    if (stack) err.stack = stack;

    return err;
  };

  before(async () => {
    await browser.url(APP_INDEX_URL);
  });

  beforeEach(async () => {
    await browser.executeAsync(async (a, done) => {
      const el: AppDatepicker = document.createElement(a)!;

      document.body.appendChild(el);

      await el.updateComplete;

      done();
    }, elementName);
  });

  afterEach(async () => {
    await browser.executeAsync(async (a, done) => {
      const el: AppDatepicker = document.body.querySelector(a)!;

      if (el) document.body.removeChild(el);

      done();
    }, elementName);
  });

  it(`is accessible`, async () => {
    const resultsTasks = [
      'calendar' as StartView,
      'yearList' as StartView,
    ].map<Promise<A11yReport>>(async (startView) => {
      const report = await browser.executeAsync(async (a, b, done) => {
        try {
          const el: AppDatepicker = document.body.querySelector(a)!;

          el.startView = b;

          await el.updateComplete;

          await (window as any).axeReport(el);

          done({ type: 'success' });
        } catch (e) {
          done({
            type: 'error',
            name: e.name,
            message: e.message,
            stack: e.stack,
          });
        }
      }, elementName, startView);

      return report;
    });
    const results = await Promise.all(resultsTasks);

    deepStrictEqual(
      (results).every(n => n.type === 'success'),
      true,
      toError(results.find(n => n.type === 'error') ?? {
        type: 'error',
        message: 'Test failed with unknown accessibility error',
        name: 'error',
        stack: '',
      })
    );
  });

});
