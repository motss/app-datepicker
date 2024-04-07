import { html } from 'lit';
import { describe, expect, it } from 'vitest';

import { MdSvg } from '../../../components/md-svg/md-svg.js';
import type { MdSvgProperties } from '../../../components/md-svg/types.js';
import { iconEdit } from '../../../icons.js';
import { RootElement } from '../../../root-element/root-element.js';
import { createFixture } from '../../__helpers__/create-fixture.js';

describe(MdSvg.name, () => {
  const render = createFixture(
    (init?: Partial<MdSvgProperties>) => {
      class TestComponent extends RootElement {
        protected override render() {
          return html`
          <md-svg
            .ariaLabel=${init?.ariaLabel || null}
            .content=${init?.content}
            .fill=${init?.fill}
            .height=${init?.height}
            .role=${init?.role || null}
            .stroke=${init?.stroke}
            .strokeWidth=${init?.strokeWidth}
            .viewBox=${init?.viewBox}
            .width=${init?.width}
          ></md-svg>
          `;
        }
      }

      return TestComponent;
    },
    {
      getHost(n) {
        return n.root.querySelector<MdSvg>('md-svg');
      },
      getSvg(n) {
        return n.root
          .querySelector<MdSvg>('md-svg')
          ?.root.querySelector<SVGSVGElement>('svg');
      },
      getTitle(n) {
        return n.root
          .querySelector<MdSvg>('md-svg')
          ?.root.querySelector<SVGSVGElement>('svg')?.querySelector<SVGTitleElement>('title');
      },
    }
  );

  it('renders correctly', async () => {
    const { getHost, getSvg, getTitle } = await render({
      content: iconEdit,
    });

    expect(getHost()).toBeInTheDocument();
    expect(getSvg()).toBeInTheDocument();
    expect(getTitle()).not.toBeInTheDocument();
    expect(getSvg()?.innerHTML).toContain(iconEdit.strings.at(0));

    expect(getHost()?.ariaLabel).toBeNull();
    expect(getHost()?.fill).toBeUndefined();
    expect(getHost()?.height).toBeUndefined();
    expect(getHost()?.role).toBeNull();
    expect(getHost()?.stroke).toBeUndefined();
    expect(getHost()?.strokeWidth).toBeUndefined();
    expect(getHost()?.viewBox).toBeUndefined();
    expect(getHost()?.width).toBeUndefined();

    expect(getHost()).not.toHaveAttribute('arialabel');
    expect(getHost()).not.toHaveAttribute('fill');
    expect(getHost()).not.toHaveAttribute('height');
    expect(getHost()).not.toHaveAttribute('role');
    expect(getHost()).not.toHaveAttribute('stroke');
    expect(getHost()).not.toHaveAttribute('strokewidth');
    expect(getHost()).not.toHaveAttribute('viewBox');
    expect(getHost()).not.toHaveAttribute('width');

    expect(getSvg()).toHaveAttribute('aria-hidden', 'true');
    expect(getSvg()).not.toHaveAttribute('aria-label');
    expect(getSvg()).not.toHaveAttribute('aria-labelledby');
    expect(getSvg()).toHaveAttribute('fill', 'currentColor');
    expect(getSvg()).toHaveAttribute('height', '24');
    expect(getSvg()).not.toHaveAttribute('role', 'graphics-document');
    expect(getSvg()).not.toHaveAttribute('stroke-width');
    expect(getSvg()).not.toHaveAttribute('stroke');
    expect(getSvg()).toHaveAttribute('viewBox', '0 0 24 24');
    expect(getSvg()).toHaveAttribute('width', '24');
  });

  it('renders no svg correctly', async () => {
    const { getHost, getSvg, getTitle } = await render();

    expect(getHost()).toBeInTheDocument();
    expect(getSvg()).not.toBeInTheDocument();
    expect(getTitle()).toBeUndefined();

    expect(getHost()?.ariaLabel).toBeNull();
    expect(getHost()?.fill).toBeUndefined();
    expect(getHost()?.height).toBeUndefined();
    expect(getHost()?.role).toBeNull();
    expect(getHost()?.stroke).toBeUndefined();
    expect(getHost()?.strokeWidth).toBeUndefined();
    expect(getHost()?.viewBox).toBeUndefined();
    expect(getHost()?.width).toBeUndefined();

    expect(getHost()).not.toHaveAttribute('arialabel');
    expect(getHost()).not.toHaveAttribute('fill');
    expect(getHost()).not.toHaveAttribute('height');
    expect(getHost()).not.toHaveAttribute('role');
    expect(getHost()).not.toHaveAttribute('stroke');
    expect(getHost()).not.toHaveAttribute('strokewidth');
    expect(getHost()).not.toHaveAttribute('viewBox');
    expect(getHost()).not.toHaveAttribute('width');
  });

  it('renders correctly with optional properties', async () => {
    const { getHost, getSvg, getTitle } = await render({
      ariaLabel: 'test',
      content: iconEdit,
      fill: 'red',
      height: 18,
      role: 'img',
      stroke: 'red',
      strokeWidth: '2',
      viewBox: '0 0 18 18',
      width: 18
    });

    expect(getHost()).toBeInTheDocument();
    expect(getSvg()).toBeInTheDocument();
    expect(getTitle()).toBeInTheDocument();

    expect(getHost()?.ariaLabel).toBe('test');
    expect(getHost()?.fill).toBe('red');
    expect(getHost()?.height).toBe(18);
    expect(getHost()?.role).toBe('img');
    expect(getHost()?.stroke).toBe('red');
    expect(getHost()?.strokeWidth).toBe('2');
    expect(getHost()?.viewBox).toBe('0 0 18 18');
    expect(getHost()?.width).toBe(18);

    expect(getHost()).not.toHaveAttribute('arialabel');
    expect(getHost()).not.toHaveAttribute('fill');
    expect(getHost()).not.toHaveAttribute('height');
    expect(getHost()).not.toHaveAttribute('role');
    expect(getHost()).not.toHaveAttribute('stroke');
    expect(getHost()).not.toHaveAttribute('strokewidth');
    expect(getHost()).not.toHaveAttribute('viewBox');
    expect(getHost()).not.toHaveAttribute('width');

    expect(getSvg()).toHaveAttribute('aria-hidden', 'false');
    expect(getSvg()).toHaveAttribute('aria-label', 'test');
    expect(getSvg()).toHaveAttribute('aria-labelledby', expect.stringMatching(/^labelled-by-(\w)+-(\w)+$/));
    expect(getSvg()).toHaveAttribute('fill', 'red');
    expect(getSvg()).toHaveAttribute('height', '18');
    expect(getSvg()).toHaveAttribute('role', 'img');
    expect(getSvg()).toHaveAttribute('stroke-width', '2');
    expect(getSvg()).toHaveAttribute('stroke', 'red');
    expect(getSvg()).toHaveAttribute('viewBox', '0 0 18 18');
    expect(getSvg()).toHaveAttribute('width', '18');

    expect(getTitle()).toHaveAttribute('id', expect.stringMatching(/^labelled-by-(\w)+-(\w)+$/));
    expect(getTitle()).toHaveTextContent('test');
  });
});
