{/* <link rel="import" href="../iron-iconset-svg/iron-iconset-svg.html"> */}

import '../node_modules/@polymer/iron-iconset-svg/iron-iconset-svg.js';

const $_documentContainer = document.createElement('div');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<iron-iconset-svg size="24" name="datepicker">
<svg><defs>
<g id="chevron-left"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></g>
<g id="chevron-right"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></g>
</defs></svg>
</iron-iconset-svg>`;

document.head.appendChild($_documentContainer);
