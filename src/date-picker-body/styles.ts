import { css } from 'lit';

export const datePickerBodyStyle = css`
:host {
  --_side: 12px;
}

.datePickerBody {
  display: grid;
  grid-template-areas: 'menu' 'body';
  grid-template-rows: calc(4px + 4px + 40px + 4px + 4px) minmax(auto, calc(48px * 7));
  gap: 4px 0;
}

.menu,
.body {
  --_padding: var(--_side);
}

.menu {
  grid-area: menu;
}

.body {
  grid-area: body;

  overflow: hidden auto;
  scrollbar-width: thin;
  scrollbar-color: red blue;
  scroll-behavior: smooth;
  overscroll-behavior: contain;
  scrollbar-gutter: stable both-edges;
}

@supports not (scrollbar-width: thin) {
  .body::-webkit-scrollbar {
    width: 8px;
    background: none;
  }

  .body::-webkit-scrollbar-thumb {
    width: inherit;
    background-color: #cdcdcd;
    border-radius: 4px;
  }

  .body::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, .35);
  }

  .body::-webkit-scrollbar-thumb:active {
    background-color: rgba(0, 0, 0, .55);
  }

  @media (prefers-color-scheme: dark) {
    .body::-webkit-scrollbar-thumb {
      background-color: #686868;
    }

    .body::-webkit-scrollbar-thumb:hover {
      background-color: #494949;
    }

    .body::-webkit-scrollbar-thumb:active {
      background-color: #5a5a5a;
    }
  }
}
`;
