<div align="center" style="text-align: center;">
  <h1 style="border-bottom: none;">app-datepicker</h1>

  <p>Material Design datepicker built with Polymer 3</p>
</div>

<hr />

[![GitHub version](https://badge.fury.io/gh/motss%2Fapp-datepicker.svg)](http://badge.fury.io/gh/motss%2Fapp-datepicker)
[![Build Status](https://travis-ci.org/motss/app-datepicker.svg?branch=master)](https://travis-ci.org/motss/app-datepicker)
[![Published on Vaadin Directory](https://img.shields.io/badge/Vaadin%20Directory-published-00b4f0.svg)](https://vaadin.com/directory/component/motssapp-datepicker)
[![Stars on vaadin.com/directory](https://img.shields.io/vaadin-directory/star/motssapp-datepicker.svg)](https://vaadin.com/directory/component/motssapp-datepicker)

![img-app-datepicker](https://cloud.githubusercontent.com/assets/10607759/26274668/48b75cce-3d81-11e7-81aa-b79ab9b90d36.png)

<!-- ![light-themed-app-datepicker-landscape](https://cloud.githubusercontent.com/assets/10607759/10119266/ce6d5b0e-64c3-11e5-843d-1310de755315.png)
![dark-themed-app-datepicker-portrait](https://cloud.githubusercontent.com/assets/10607759/10119265/c9ad900c-64c3-11e5-937e-338a770eebea.png) -->
<!-- ![app-datepicker-landscape](https://cloud.githubusercontent.com/assets/10607759/9871233/c9e33d04-5bc4-11e5-8af9-d93d080d8815.PNG) -->
<!-- ![app-datepicker-portrait](https://cloud.githubusercontent.com/assets/10607759/9871234/cacf33c6-5bc4-11e5-833a-96cbd3dbf440.PNG) -->
<!-- ![dark-themed-app-datepicker](https://cloud.githubusercontent.com/assets/10607759/10106751/1bec71c0-63e9-11e5-93f2-ee197d2ba0f2.png) -->

See the [component page](http://motss.github.io/app-datepicker/components/app-datepicker/) for more information.

## Update (v3.0.0) - Breaking changes

- **Upgraded to Polymer 3 stable.**
- **Moved to NPM.**
- Recommended to include the Intl polyfill and web-animations-js polyfill at the top document level.

  ```html
  <app-datepicker></app-datepicker>
  <app-datepicker view="horizontal"></app-datepicker>
  <app-datepicker theme="dark-theme"></app-datepicker>
  <app-datepicker-dialog modal></app-datepicker-dialog>
  <app-datepicker-dialog with-backdrop></app-datepicker-dialog>
  <app-datepicker-dialog></app-datepicker-dialog>
  ```

`app-datepicker` provides a regular datepicker element.
While `app-datepicker-dialog` has a `app-datepicker` being wrapped inside a dialog.

~~## ( Coming soon!) Generating your own boilerplate code of the compounds~~
~~At the end of the demo, there is a section where user can play around with to generate your own boilerplate code with the attributes provided.~~

## Styling

Now with mixins, head over to the [component page](http://motss.github.io/app-datepicker/components/app-datepicker/) for more details.

## Getting Started

1. Install with npm.

    ```sh
    $ npm i app-datepicker
    ```

2. (Optional) Load the dependencies and the [Intl][intl-polyfill-url] and [web-animations-js][web-animations-js-polyfill-url] polyfills on unsupported browsers:

    ```html
    <script src="https://cdnjs.cloudflare.com/ajax/libs/web-animations/2.3.1/web-animations-next.min.js"></script>
    <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale"></script>
    ```

3. Load element in HTML or JS.

    ```html
    <!-- In HTML, load with script[type=module], either `app-datepicker` -->
    <script type="module" href="/node_modules/app-datepicker/app-datepicker.js"></script>

    <!-- or, `app-datepicker-dialog` -->
    <!-- <script type="module" src="/node_modules/app-datepicker/app-datepicker-dialog.js"></script> -->
    ```

    ```js
    // Alternatively, loading element in JavaScript.
    ...
    import 'app-datepicker/app-datepicker.js';
    ...
    ```

## Browser Support

### `app-datepicker` and `app-datepicker-dialog`:

Same as that of [Polymer 3][polymer-3-browser-support-url].


### [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat)

ECMAScript Internationalization API for `locale`. For more details please visit [Can I use... Intl?](http://caniuse.com/#search=intl):

| ![Internet Explorer](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/internet-explorer/internet-explorer_48x48.png) | ![Microsoft Edge](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/edge/edge_48x48.png) | ![Mozilla Firefox](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/firefox/firefox_48x48.png) ![Mozilla Firefox Developer Edition](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/firefox-developer-edition/firefox-developer-edition_48x48.png) | ![Google Chrome](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/chrome/chrome_48x48.png) ![Google Chrome Canary](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/archive/chrome-canary_19-48/chrome-canary_19-48_48x48.png) | ![Opera](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/opera/opera_48x48.png) ![Opera Developer Edition](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/opera-developer/opera-developer_48x48.png) | ![Safari](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/safari/safari_48x48.png) ![Safari Technology Preview](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/safari-technology-preview/safari-technology-preview_48x48.png)
| --- | --- | --- | --- | --- | --- |
| 11 | 12+ | latest | latest | latest | 10+ **

___** [Intl Polyfill for unsupported browsers](intl-polyfill-url)___

## Throughput

[![Throughput Graph](https://graphs.waffle.io/motss/app-datepicker/throughput.svg)](https://waffle.io/motss/app-datepicker/metrics/throughput)

## License

[MIT License](http://motss.mit-license.org/) © Rong Sen Ng

[intl-polyfill-url]: https://github.com/andyearnshaw/Intl.js
[web-animations-js-polyfill-url]: https://www.npmjs.com/package/web-animations-js
[polymer-3-browser-support-url]: https://polymer-library.polymer-project.org/3.0/docs/browsers
