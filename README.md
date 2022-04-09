<div align="center" style="text-align: center;">
  <h1 style="border-bottom: none;">app-datepicker</h1>

  <p>Datepicker element built with lit and Material Design 2021</p>
</div>

<hr />

[![buymeacoffee][buymeacoffee-badge]][buymeacoffee-url]
[![tippin.me][tippin-me-badge]][tippin-me-url]
[![Follow me][follow-me-badge]][follow-me-url]
[![Join Discord][join-discord-badge]][join-discord-url]

[![Version][version-badge]][version-url]
[![lit][lit-version-badge]][lit]
[![MIT License][mit-license-badge]][mit-license-url]

[![Downloads][downloads-badge]][downloads-url]
[![Total downloads][total-downloads-badge]][downloads-url]
[![Packagephobia][packagephobia-badge]][packagephobia-url]
[![Bundlephobia][bundlephobia-badge]][bundlephobia-url]

[![ci][ga-ci-badge]][ga-ci-url]
[![ci-helpers][ga-ci-helpers-badge]][ga-ci-helpers-url]
[![codecov][codecov-badge]][codecov-url]

[![Code of Conduct][coc-badge]][coc-url]

## Table of contents <!-- omit in toc -->

- [Pre-requisite](#pre-requisite)
- [Installation](#installation)
- [How to use](#how-to-use)
  - [Polyfills](#polyfills)
  - [ES Modules](#es-modules)
    - [my-app.js](#my-appjs)
    - [index.html](#indexhtml)
- [Browser compatibility](#browser-compatibility)
- [Q&A](#qa)
- [API references](#api-references)
- [Demo](#demo)
- [Older versions](#older-versions)
- [License](#license)

> Miracle happens when marrying Material Design with date pickers on the web.
>
> 💯 Also, featured in [awesome-lit-html].

This marks another completion of an important milestone of `app-datepicker` with all the love from the [Web Components community][web-components-community-url] in making this element great and wonderful. As Web Components getting more and more traction and better at providing a web standard way of creating shareable components, it plays an important role in the JavaScript community as many developers depend on a plethora of development tools written in JavaScript for the web to create a better developer experience when developing a library, a component, or even a large scalable application.

![date-pickers-in-different-themes](https://user-images.githubusercontent.com/10607759/158053308-b43cb0e1-f510-4f0e-9804-827a349d5fc7.png)

Today, `app-datepicker` has been completely rewritten to adapt to the best of both worlds by leveraging the modern technologies the community most familiar with since year 2018.

The following are the list of tools used that makes it shine:

  1. [TypeScript]
  2. [lit]

## Table of contents <!-- omit in toc -->

- [Pre-requisite](#pre-requisite)
- [Installation](#installation)
- [How to use](#how-to-use)
  - [Polyfills](#polyfills)
  - [ES Modules](#es-modules)
    - [my-app.js](#my-appjs)
    - [index.html](#indexhtml)
- [Browser compatibility](#browser-compatibility)
- [Q&A](#qa)
- [API references](#api-references)
- [Demo](#demo)
- [Older versions](#older-versions)
- [License](#license)

## Pre-requisite

- [ES2019] _(The element is compiled with features targeting ES2019, so it might not work properly without transpilation on older browsers.)_
- [lit] >= 2.2.0
- [OPTIONAL] [TypeScript] >= 4.5.5 _(TypeScript users only)_

## Installation

- NPM

  ```sh
  $ npm i app-datepicker@next
  ```

- Alternatively, it can be downloaded from any of the following awesome CDNs:

  1. [esm.run/ jsdelivr][jsdelivr-url]
  2. [esm.sh][esm-sh-url]

## How to use

### Polyfills

Please make sure you have all these features available on the browsers you are supporting. If no, please consider polyfill-ing in order to run the datepicker element.

* [Array.prototype.find]
* [Intl.DateTimeFormat]

The following snippet shows a simple script used in the demo to load polyfills via feature detection on different browsers:

```html
<script>
  if (null == Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
      value: function arrayFind(cb) {
        var filtered = this.filter(cb);
        return !filtered.length ? void 0 : filtered[0];
      },
    });
  }

  if (!window.Intl) {
    var wa = document.createElement('script');
    /** NOTE: Pin package version due to https://github.com/andyearnshaw/Intl.js/issues/256 */
    wa.src = 'https://esm.run/intl@1.2.4/dist/Intl.complete.js';
    wa.onload = function onLoad() { console.info('🌐 Intl polyfill loaded'); };
    wa.onerror = console.error;
    document.head.appendChild(wa);
  }
</script>
```

### ES Modules

#### my-app.js

```ts
/**
 * Say you've already installed the element via NPM, simply import the package to your application.
 * Here I'm using `lit` for developing my application.
 */
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import 'app-datepicker';

const localName = 'my-app';

@customElement(localName)
export class MyApp extends LitElement {
  static styles = [
    css`
    :host {
      display: block;
    }

    * {
      box-sizing: border-box;
    }
    `
  ];

  render() {
    return html`<app-date-picker></app-date-picker>`;
  }
}
```

#### index.html

```html
<!doctype html>
<html>
  <!-- Using ES modules to load the app -->
  <script type="module" src="/my-app.js"></script>
  ...
  <body>
    <my-app>
      <!-- <AppDatepicker> will be rendered when <MyApp> loads. -->
    </my-app>
  </body>
  ...
</html>
```

## Browser compatibility

All the elements work in last 2 versions of all evergreen browsers (Chrome/ Edge, Firefox, and Safari). Internet Explorer 11 is no longer supported in favor of the [new Microsoft Edge].

Tested on the following browsers:

1. `Chrome/ Edge 100`
2. `Firefox 96`
3. `Safari 15.4`

Not tested on the following browsers but it should work with all the polyfills needed:

1. `Edge 18` and below
3. `Safari 13.1` and below

## Q&A

1. Does it work well with [material-components-web-components]?

    For [material-components-web-components] users, you can create your own custom date picker element by wrapping `app-date-picker` inside [mwc-dialog].

    <!-- Feasible source code can be viewed [here][mwc-date-picker-url]. -->

    ```ts
    // Simplified code snippet

    class MWCDatePicker extends LitElement {
      render() {
        return html`
        <mwc-dialog>
          <app-date-picker></app-date-picker>

          <mwc-button slot="secondaryAction" dialogAction="cancel">cancel</mwc-button>
          <mwc-button slot="primaryAction" dialogAction="set">set</mwc-button>
        </mwc-dialog>
        `;
      }
    }
    ```

## API references

- [AppDatePicker]
- [AppDatePickerDialog]
- [AppDatePickerInput]

## Demo

- [`app-datepicker` demo with configurable code snippets]

## Older versions

- [`4-5.x`](https://github.com/motss/app-datepicker/tree/4-5.x)

## License

[MIT License](http://motss.mit-license.org/) © Rong Sen Ng

<!-- References -->
[`app-datepicker` demo with configurable code snippets]: https://motss.xyz/demos/app-datepicker
[AppDatePicker]: /docs/app-date-picker.md
[AppDatePickerDialog]: /docs/app-date-picker-dialog.md
[AppDatePickerInput]: /docs/app-date-picker-input.md
[Array.prototype.find]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
[awesome-lit-html]: https://github.com/web-padawan/awesome-lit-html#individual-components
[ES2019]: https://kangax.github.io/compat-table/es2016plus/#test-Object.fromEntries
[esm-sh-url]: https://esm.sh/app-datepicker@next?target=es2019
[Intl.DateTimeFormat]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
[jsdelivr-url]: https://www.jsdelivr.com/package/npm/app-datepicker?version=next&amp;utm_source=github.com&amp;utm_medium=referral&amp;utm_content=motss/app-datepicker
[lit]: https://github.com/lit/lit?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=motss/app-datepicker
[material-components-web-components]: https://github.com/material-components/material-components-web-components
[mwc-date-picker-url]: https://motss-app.web.app/demo/app-datepicker/mwc-date-picker.js
[mwc-dialog]: https://github.com/material-components/material-components-web-components/tree/master/packages/dialog
[new Microsoft Edge]: https://blogs.windows.com/msedgedev/2020/01/15/upgrading-new-microsoft-edge-79-chromium
[TypeScript]: https://github.com/Microsoft/TypeScript?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=motss/app-datepicker
[web-components-community-url]: https://www.webcomponents.org?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=motss/app-datepicker
[wre-2019-url]: https://www.deepcrawl.com/blog/news/what-version-of-chrome-is-google-actually-using-for-rendering

<!-- MDN -->
[string-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String?utm_source=github.com&amp;utm_medium=referral
[object-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object?utm_source=github.com&amp;utm_medium=referral
[number-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number?utm_source=github.com&amp;utm_medium=referral
[boolean-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean?utm_source=github.com&amp;utm_medium=referral

<!-- Badges -->
[buymeacoffee-badge]: https://flat.badgen.net/badge/icon/buymeacoffee?icon=buymeacoffee&label=motss
[tippin-me-badge]: https://badgen.net/badge/%E2%9A%A1%EF%B8%8Ftippin.me/@igarshmyb/F0918E
[follow-me-badge]: https://flat.badgen.net/twitter/follow/igarshmyb?icon=twitter
[join-discord-badge]: https://badgen.net/discord/members/ps8mCrvTKR?label=app-datepicker&icon=discord

[version-badge]: https://flat.badgen.net/npm/v/app-datepicker/next?icon=npm
[lit-version-badge]: https://flat.badgen.net/npm/v/lit/latest?icon=npm&label=lit
[mit-license-badge]: https://flat.badgen.net/npm/license/app-datepicker

[downloads-badge]: https://flat.badgen.net/npm/dm/app-datepicker
[total-downloads-badge]: https://flat.badgen.net/npm/dt/app-datepicker?label=total%20downloads
[packagephobia-badge]: https://flat.badgen.net/packagephobia/install/app-datepicker@next
[bundlephobia-badge]: https://flat.badgen.net/bundlephobia/minzip/app-datepicker@next

[ga-ci-badge]: https://github.com/motss/app-datepicker/actions/workflows/ci.yml/badge.svg
[ga-ci-helpers-badge]: https://github.com/motss/app-datepicker/actions/workflows/ci-helpers.yml/badge.svg
[codecov-badge]: https://codecov.io/gh/motss/app-datepicker/branch/main/graph/badge.svg?token=0M1yaJNDxq

[coc-badge]: https://flat.badgen.net/badge/code%20of/conduct/pink

<!-- Links -->
[buymeacoffee-url]: https://www.buymeacoffee.com/RLmMhgXFb
[tippin-me-url]: https://tippin.me/@igarshmyb
[follow-me-url]: https://twitter.com/igarshmyb?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=motss/app-datepicker
[join-discord-url]: https://discord.gg/ps8mCrvTKR

[version-url]: https://www.npmjs.com/package/app-datepicker/v/next?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=motss/app-datepicker
[mit-license-url]: https://github.com/motss/app-datepicker/blob/main/LICENSE?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=motss/app-datepicker

[downloads-url]: http://www.npmtrends.com/app-datepicker?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=motss/app-datepicker
[packagephobia-url]: https://packagephobia.now.sh/result?p=app-datepicker@next&utm_source=github.com&amp;utm_medium=referral&amp;utm_content=motss/app-datepicker
[bundlephobia-url]: https://bundlephobia.com/result?p=app-datepicker@next&amp;utm_source=github.com&amp;utm_medium=referral&amp;utm_content=motss/app-datepicker

[ga-ci-url]: https://github.com/motss/app-datepicker/actions/workflows/ci.yml
[ga-ci-helpers-url]: https://github.com/motss/app-datepicker/actions/workflows/ci-helpers.yml
[codecov-url]: https://codecov.io/gh/motss/app-datepicker

[coc-url]: https://github.com/motss/app-datepicker/blob/main/code-of-conduct.md?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=motss/app-datepicker
