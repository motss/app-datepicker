import { css } from 'lit-element';

export const markdownStyling = css`
:not(pre) > code {
  padding: .15rem;
  /* background-color: #dfe8f2; */
  /* color: #00479f; */
  background-color: var(--app-primary-background-color);
  color: var(--app-primary-color);
  font-size: .9rem;
  border-radius: .3rem;
}

pre,
pre[class*=language-] {
  margin: 1rem 0;
  padding: 1rem 1.5rem;
  /* background-color: #dfe8f2; */
  background-color: var(--app-primary-background-color);
  border-radius: .5rem;
  overflow: auto;
}
pre[class*=language-],
code[class*=language-] {
  /* text-shadow: 0 1px rgba(0,0,0,.3); */
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  word-wrap: normal;
  line-height: 1.5;
  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4;
  -webkit-hyphens: none;
  -moz-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;
}

pre > code,
code[class*=language-] {
  background-color: inherit;
  /* color: #00479f; */
  color: var(--app-primary-color);
}

blockquote {
  margin: 0 0 16px 40px;
}
blockquote > p {
  background-color: #efdff2;
  color: #85087f;
  padding: 10px 16px;
  border-radius: 16px;
}
`;
// tslint:disable-next-line:max-line-length
// export const highlightJsMonokaiSublimeTheme = css`<style>.hljs{display:block;overflow-x:auto;padding:0.5em;background:#23241f}.hljs,.hljs-tag,.hljs-subst{color:#f8f8f2}.hljs-strong,.hljs-emphasis{color:#a8a8a2}.hljs-bullet,.hljs-quote,.hljs-number,.hljs-regexp,.hljs-literal,.hljs-link{color:#ae81ff}.hljs-code,.hljs-title,.hljs-section,.hljs-selector-class{color:#a6e22e}.hljs-strong{font-weight:bold}.hljs-emphasis{font-style:italic}.hljs-keyword,.hljs-selector-tag,.hljs-name,.hljs-attr{color:#f92672}.hljs-symbol,.hljs-attribute{color:#66d9ef}.hljs-params,.hljs-class .hljs-title{color:#f8f8f2}.hljs-string,.hljs-type,.hljs-built_in,.hljs-builtin-name,.hljs-selector-id,.hljs-selector-attr,.hljs-selector-pseudo,.hljs-addition,.hljs-variable,.hljs-template-variable{color:#e6db74}.hljs-comment,.hljs-deletion,.hljs-meta{color:#75715e}</style>`;
export const highlightJsAppTheme = css`
.hljs-string,
.hljs-type,
.hljs-built_in,
.hljs-builtin-name,
.hljs-selector-id,
.hljs-selector-attr,
.hljs-selector-pseudo,
.hljs-addition,
.hljs-variable,
.hljs-template-variable {
  color: #930757;
}

.hljs-comment {
  color: #796d6d;
}
`;
