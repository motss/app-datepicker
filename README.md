[![GitHub version](https://badge.fury.io/gh/motss%2Fapp-datepicker.svg)](http://badge.fury.io/gh/motss%2Fapp-datepicker)
[![Bower version](https://badge.fury.io/bo/app-datepicker.svg)](http://badge.fury.io/bo/app-datepicker)
[![Build Status](https://travis-ci.org/motss/app-datepicker.svg?branch=master)](https://travis-ci.org/motss/app-datepicker)

# app-datepicker (formerly `jv-datepicker`)
![img-app-datepicker](https://cloud.githubusercontent.com/assets/10607759/26274668/48b75cce-3d81-11e7-81aa-b79ab9b90d36.png)

<!-- ![light-themed-app-datepicker-landscape](https://cloud.githubusercontent.com/assets/10607759/10119266/ce6d5b0e-64c3-11e5-843d-1310de755315.png)
![dark-themed-app-datepicker-portrait](https://cloud.githubusercontent.com/assets/10607759/10119265/c9ad900c-64c3-11e5-937e-338a770eebea.png) -->
<!-- ![app-datepicker-landscape](https://cloud.githubusercontent.com/assets/10607759/9871233/c9e33d04-5bc4-11e5-8af9-d93d080d8815.PNG) -->
<!-- ![app-datepicker-portrait](https://cloud.githubusercontent.com/assets/10607759/9871234/cacf33c6-5bc4-11e5-833a-96cbd3dbf440.PNG) -->
<!-- ![dark-themed-app-datepicker](https://cloud.githubusercontent.com/assets/10607759/10106751/1bec71c0-63e9-11e5-93f2-ee197d2ba0f2.png) -->



See the [component page](http://motss.github.io/app-datepicker/components/app-datepicker/) for more information.

An custom Polymer element built from scratch to provide a datepicker based on Google's Material Design that is more compelling and rich with features.


## Update (v2.11.0)
- **Pleased to announce that `app-datepicker` is now compatible with both Polymer 1.x and Polymer 2.0 stable.**
- **Now Intl polyfill will not load (previously it does) if the browser does not natively support it and it is recommended for users to load the polyfill at the top-level document by some feature detections.**
- `alwaysResetSelectedDateOnDialogClose` - proposed by [#74](https://github.com/motss/app-datepicker/issues/74) to allow datepicker to reset the selected date to today's date once the datepicker closes and the demo has this included as well.
- As of `v2.11`, all dates will no longer include users' local system's timezone offset and all will be default to GMT/ UTC timezone. For more info, please see [#89](https://github.com/motss/app-datepicker/pull/89).

Example:

    <app-datepicker></app-datepicker>
    <app-datepicker view="horizontal"></app-datepicker>
    <app-datepicker theme="dark-theme"></app-datepicker>
    <app-datepicker-dialog modal></app-datepicker-dialog>
    <app-datepicker-dialog with-backdrop></app-datepicker-dialog>
    <app-datepicker-dialog></app-datepicker-dialog>

`app-datepicker` provides a regular datepicker element.
While `app-datepicker-dialog` has a `app-datepicker` being wrapped inside a dialog.


~~## ( Coming soon!) Generating your own boilerplate code of the compounds~~
~~At the end of the demo, there is a section where user can play around with to generate your own boilerplate code with the attributes provided.~~


## Styling
Now with mixins, head over to the [component page](http://motss.github.io/app-datepicker/components/app-datepicker/) for more details.


## Getting Started
1. Install with bower.
`bower install --save app-datepicker`

2. Load the dependencies and the Intl polyfill if needed.

    Load [`Intl Polyfill`](https://github.com/andyearnshaw/Intl.js) for unsupported browsers via feature detection,

    ```js
    if (window.Intl) {
      var intlPolyfill = document.createElement('script');
      intlPolyfill.src = 'path_to_intl_polyfill';
      document.head.appendChild(intlPolyfill);
    }
    ```

    For `app-datepicker`,

    ```html
    <link rel="import" href="path-to-bower-components/app-datepicker/app-datepicker.html">
    ```
    For `app-datepicker-dialog`,

    ```html
    <link rel="import" href="path-to-bower-components/app-datepicker/app-datepicker-dialog.html">
    ```

3. Markup with `<app-datepicker></app-datepicker>` or `<app-datepicker-dialog></app-datepicker-dialog>`.

4. Done.

## Browser Support

### `app-datepicker` and `app-datepicker-dialog`:

#### Microsoft Windows x64
| ![Internet Explorer](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/internet-explorer/internet-explorer_48x48.png) | ![Microsoft Edge](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/edge/edge_48x48.png) | ![Mozilla Firefox](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/firefox/firefox_48x48.png) ![Mozilla Firefox Developer Edition](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/firefox-developer-edition/firefox-developer-edition_48x48.png) | ![Google Chrome](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/chrome/chrome_48x48.png) ![Google Chrome Canary](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/archive/chrome-canary_19-48/chrome-canary_19-48_48x48.png) | ![Opera](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/opera/opera_48x48.png) ![Opera Developer Edition](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/opera-developer/opera-developer_48x48.png)
| --- | --- | --- | --- | ---
| 11 | 12+ | latest | latest | latest


#### Linux x64
| ![Mozilla Firefox](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/firefox/firefox_48x48.png) ![Mozilla Firefox Developer Edition](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/firefox-developer-edition/firefox-developer-edition_48x48.png) | ![Google Chrome](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/chrome/chrome_48x48.png) ![Google Chrome Canary](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/archive/chrome-canary_19-48/chrome-canary_19-48_48x48.png) | ![Opera](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/opera/opera_48x48.png) ![Opera Developer Edition](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/opera-developer/opera-developer_48x48.png)
| --- | --- | ---
| latest | latest | latest


#### Mac OS X
| ![Mozilla Firefox](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/firefox/firefox_48x48.png) ![Mozilla Firefox Developer Edition](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/firefox-developer-edition/firefox-developer-edition_48x48.png) | ![Google Chrome](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/chrome/chrome_48x48.png) ![Google Chrome Canary](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/archive/chrome-canary_19-48/chrome-canary_19-48_48x48.png) | ![Opera](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/opera/opera_48x48.png) ![Opera Developer Edition](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/opera-developer/opera-developer_48x48.png) | ![Safari](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/safari/safari_48x48.png) ![Safari Technology Preview](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/safari-technology-preview/safari-technology-preview_48x48.png)
| --- | --- | --- | ---
| latest | latest | latest | 7+


#### Android 4.4.4 and above

| ![Mozilla Firefox](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/firefox/firefox_48x48.png) | ![Google Chrome](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/chrome/chrome_48x48.png) ![Google Chrome Dev](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/chrome-dev/chrome-dev_48x48.png) | ![Opera](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/opera/opera_48x48.png) | ![Android WebView](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/android-webview-beta/android-webview-beta_48x48.png)
| --- | --- | --- | ---
| latest | latest | latest | latest

#### iOS 7.1 and above
| ![Mozilla Firefox](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/firefox/firefox_48x48.png) | ![Google Chrome](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/chrome/chrome_48x48.png) | ![Opera](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/opera/opera_48x48.png) | ![Safari for iOS](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/safari-ios/safari-ios_48x48.png)
| --- | --- | --- | ---
| latest | latest | latest | 7+

### [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat)

ECMAScript Internationalization API for `locale`. For more details please visit [Can I use... Intl?](http://caniuse.com/#search=intl):


| ![Internet Explorer](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/internet-explorer/internet-explorer_48x48.png) | ![Microsoft Edge](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/edge/edge_48x48.png) | ![Mozilla Firefox](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/firefox/firefox_48x48.png) ![Mozilla Firefox Developer Edition](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/firefox-developer-edition/firefox-developer-edition_48x48.png) | ![Google Chrome](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/chrome/chrome_48x48.png) ![Google Chrome Canary](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/archive/chrome-canary_19-48/chrome-canary_19-48_48x48.png) | ![Opera](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/opera/opera_48x48.png) ![Opera Developer Edition](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/opera-developer/opera-developer_48x48.png) | ![Safari](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/safari/safari_48x48.png) ![Safari Technology Preview](https://cdnjs.cloudflare.com/ajax/libs/browser-logos/35.1.0/safari-technology-preview/safari-technology-preview_48x48.png)
| --- | --- | --- | --- | --- | --- |
| 11 | 12+ | latest | latest | latest | 10+ **

___** [Intl Polyfill for unsupported browsers](https://github.com/andyearnshaw/Intl.js)___

## Throughput
[![Throughput Graph](https://graphs.waffle.io/motss/app-datepicker/throughput.svg)](https://waffle.io/motss/app-datepicker/metrics/throughput)

## License
[MIT License](http://motss.mit-license.org/) © Rong Sen Ng
