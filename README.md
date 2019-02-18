<div align="center" style="text-align: center;">
  <h1 style="border-bottom: none;">app-datepicker</h1>

  <p>Datepicker element built with lit-element and Material Design 2</p>
</div>

<hr />

[![Version][version-badge]][version-url]
[![Node version][node-version-badge]][node-version-url]
[![MIT License][mit-license-badge]][mit-license-url]
<!-- [![lit-element][lit-element-version-badge]][lit-element-url] -->

[![jsDelivr downloads][jsdelivr-badge]][jsdelivr-url]
[![Downloads][downloads-badge]][downloads-url]
[![Total downloads][total-downloads-badge]][downloads-url]
[![Packagephobia][packagephobia-badge]][packagephobia-url]
[![Bundlephobia][bundlephobia-badge]][bundlephobia-url]

[![Build Status][travis-badge]][travis-url]
[![Dependency Status][daviddm-badge]][daviddm-url]

[![codebeat badge][codebeat-badge]][codebeat-url]
[![Codacy Badge][codacy-badge]][codacy-url]
[![Code of Conduct][coc-badge]][coc-url]

> A different way of `datepicker`-ing on the web.
>
> 🛠 While it is still in RC release, feel free to try it out.

This marks another completion of an important milestone of `app-datepicker` with all the love from the [Web Components community][web-components-community-url] in making this element great and wonderful. As Web Components getting more and more traction and better at providing a web standard way of creating shareable components, it plays an important role in the JavaScript community as many developers depend on a plethora of development tools written in JavaScript for the web to create a better developer experience when developing a library, a component, or even a large scalable application.

![screen shot 2019-01-30 at 12 49 30](https://user-images.githubusercontent.com/10607759/51959002-857c1100-248d-11e9-8d1a-9abbafdb2385.png)

Today, `app-datepicker` has been completely rewritten to adapt to the best of both worlds by leveraging the modern technologies the community most familiar with since year 2018.

The following are the list of tools used that makes it shine:

  1. [TypeScript][typescript-url]
  2. [lit-element][lit-element-url]

## Table of contents

<!-- TOC -->

- [Older versions](#older-versions)
- [License](#license)

<!-- /TOC -->

## Pre-requisite

- [Node.js][node-js-url] >= 10.13.0
- [NPM][npm-url] >= 5.5.1 ([NPM][npm-url] comes with [Node.js][node-js-url] so there is no need to install separately.)
- [lit-element][lit-element-url] >= 2.0.1
- [TypeScript][typescript-url] >= 3.3.3

## Installation

- NPM

  ```sh
  $ npm i app-datepicker@next
  ```

- Alternatively, it can be downloaded from any of the following awesome CDNs:

  1. [jsdelivr (ESM)][jsdelivr-url]
  2. [unpkg (ESM)][unpkg-url]

## How to use

**my-app.ts**

```ts
/**
 * Say you've already installed the element via NPM, simply import the package to your application.
 * Here I'm using `lit-element` for developing my application.
 */
import { css, customElement, html, LitElement } from 'lit-element';
import 'app-datepicker';

@customElement(MyApp.is)
export class MyApp extends LitElement {
  static is() { return 'my-app'; }

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

  protected render() {
    return html`<app-datepicker></app-datepicker>`;
  }
}
```

**index.html**

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

## API

_Coming soon!_

## Older versions

Meantime, feel free to check the older version out at:

  1. [`2.x` branch][2-x-url] - Built with Material Design and [Polymer 2][polymer-2-url], published at Bower.
  2. [`3.x` branch][3-x-url] - Built with Material Design and [Polymer 3][polymer-3-url], published at NPM.

## License

[MIT License](http://motss.mit-license.org/) © Rong Sen Ng

<!-- References -->
[node-js-url]: https://nodejs.org
[npm-url]: https://www.npmjs.com
[node-releases-url]: https://nodejs.org/en/download/releases
[typescript-url]: https://github.com/Microsoft/TypeScript
[web-components-community-url]: https://www.webcomponents.org
[lit-element-url]: https://github.com/Polymer/lit-element
[jsdelivr-url]: https://www.jsdelivr.com/package/npm/app-datepicker?version=next
[unpkg-url]: https://unpkg.com/app-datepicker@next/
[material-design-2-url]: https://material.io/design/
[2-x-url]: https://github.com/motss/app-datepicker/tree/2.x
[3-x-url]: https://github.com/motss/app-datepicker/tree/3.x
[polymer-2-url]: https://polymer-library.polymer-project.org/2.0/docs/devguide/feature-overview
[polymer-3-url]: https://polymer-library.polymer-project.org/3.0/docs/devguide/feature-overview

<!-- MDN -->
[map-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
[string-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[object-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[number-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[boolean-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[html-style-element-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLStyleElement
[promise-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

<!-- Badges -->
[version-badge]: https://flat.badgen.net/npm/v/app-datepicker/next
[node-version-badge]: https://flat.badgen.net/npm/node/app-datepicker
<!-- [lit-element-version-badge]: https://flat.badgen.net/lit-element/v/lit-element/latest -->
[mit-license-badge]: https://flat.badgen.net/npm/license/app-datepicker

[jsdelivr-badge]: https://data.jsdelivr.com/v1/package/npm/app-datepicker/badge?version=next
[downloads-badge]: https://flat.badgen.net/npm/dm/app-datepicker
[total-downloads-badge]: https://flat.badgen.net/npm/dt/app-datepicker?label=total%20downloads
[packagephobia-badge]: https://flat.badgen.net/packagephobia/install/app-datepicker%40next
[bundlephobia-badge]: https://flat.badgen.net/bundlephobia/minzip/app-datepicker@next

[travis-badge]: https://flat.badgen.net/travis/motss/app-datepicker/master
[daviddm-badge]: https://flat.badgen.net/david/dep/motss/app-datepicker

[codacy-badge]: https://api.codacy.com/project/badge/Grade/0525e4467aa5414b85ea0feebe8fbd95
[codebeat-badge]: https://codebeat.co/badges/3a212108-43cd-4a1f-ab2c-fe890ad734b6
[coc-badge]: https://flat.badgen.net/badge/code%20of/conduct/pink

<!-- Links -->
[version-url]: https://www.npmjs.com/package/app-datepicker/v/next
[node-version-url]: https://nodejs.org/en/download
<!-- [lit-element-url]: https://www.npmjs.com/package/lit-element/v/latest -->
[mit-license-url]: https://github.com/motss/app-datepicker/blob/master/LICENSE

[jsdelivr-url]: https://www.jsdelivr.com/package/npm/app-datepicker?version=next
[downloads-url]: http://www.npmtrends.com/app-datepicker
[packagephobia-url]: https://packagephobia.now.sh/result?p=app-datepicker%40next
[bundlephobia-url]: https://bundlephobia.com/result?p=app-datepicker@next

[travis-url]: https://travis-ci.org/motss/app-datepicker
[daviddm-url]: https://david-dm.org/motss/app-datepicker

[codacy-url]: https://www.codacy.com/app/motss/app-datepicker?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=motss/app-datepicker&amp;utm_campaign=Badge_Grade
[codebeat-url]: https://codebeat.co/projects/github-com-motss-app-datepicker-master-68699d41-3539-4c5f-81df-c9202be34919
[coc-url]: https://github.com/motss/app-datepicker/blob/master/CODE_OF_CONDUCT.md

<!-- [intl-polyfill-url]: https://github.com/andyearnshaw/Intl.js -->
<!-- [web-animations-js-polyfill-url]: https://www.npmjs.com/package/web-animations-js -->
<!-- [polymer-3-browser-support-url]: https://polymer-library.polymer-project.org/3.0/docs/browsers -->
