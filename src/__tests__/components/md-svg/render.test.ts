import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { describe, expect, it } from 'vitest';

import { MdSvg } from '../../../components/md-svg/md-svg.js';
import { iconEdit } from '../../../icons.js';
import { RootElement } from '../../../root-element/root-element.js';
import type { CustomElementProperties } from '../../../utility.types.js';
import { createFixture } from '../../__helpers__/create-fixture.js';

describe(MdSvg.name, () => {
  const render = createFixture(
    (init?: Partial<CustomElementProperties<MdSvg>>) => {
      class TestComponent extends RootElement {
        protected override render() {
          return html`
          <md-svg
            .content=${init?.content}
            fill=${ifDefined(init?.fill || undefined)}
            height=${ifDefined(init?.height || undefined)}
            stroke=${ifDefined(init?.stroke || undefined)}
            strokewidth=${ifDefined(init?.strokeWidth || undefined)}
            viewBox=${ifDefined(init?.viewBox || undefined)}
            width=${ifDefined(init?.width || undefined)}
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
    }
  );

  it('renders correctly', async () => {
    const { getHost, getSvg } = await render({
      content: iconEdit,
    });

    expect(getHost()).toBeInTheDocument();
    expect(getSvg()).toBeInTheDocument();
    expect(getSvg()?.innerHTML).toContain(iconEdit.strings.at(0));

    expect(getHost()?.fill).toBeUndefined();
    expect(getHost()?.height).toBeUndefined();
    expect(getHost()?.stroke).toBeUndefined();
    expect(getHost()?.strokeWidth).toBeUndefined();
    expect(getHost()?.viewBox).toBeUndefined();
    expect(getHost()?.width).toBeUndefined();

    expect(getHost()).not.toHaveAttribute('fill');
    expect(getHost()).not.toHaveAttribute('height');
    expect(getHost()).not.toHaveAttribute('stroke');
    expect(getHost()).not.toHaveAttribute('strokewidth');
    expect(getHost()).not.toHaveAttribute('viewBox');
    expect(getHost()).not.toHaveAttribute('width');

    expect(getSvg()).toHaveAttribute('fill', 'currentColor');
    expect(getSvg()).toHaveAttribute('height', '24');
    expect(getSvg()).not.toHaveAttribute('stroke-width');
    expect(getSvg()).not.toHaveAttribute('stroke');
    expect(getSvg()).toHaveAttribute('viewBox', '0 0 24 24');
    expect(getSvg()).toHaveAttribute('width', '24');
  });

  it('renders no svg correctly', async () => {
    const { getHost, getSvg } = await render();

    expect(getHost()).toBeInTheDocument();
    expect(getSvg()).not.toBeInTheDocument();

    expect(getHost()?.fill).toBeUndefined();
    expect(getHost()?.height).toBeUndefined();
    expect(getHost()?.stroke).toBeUndefined();
    expect(getHost()?.strokeWidth).toBeUndefined();
    expect(getHost()?.viewBox).toBeUndefined();
    expect(getHost()?.width).toBeUndefined();

    expect(getHost()).not.toHaveAttribute('fill');
    expect(getHost()).not.toHaveAttribute('height');
    expect(getHost()).not.toHaveAttribute('stroke');
    expect(getHost()).not.toHaveAttribute('strokewidth');
    expect(getHost()).not.toHaveAttribute('viewBox');
    expect(getHost()).not.toHaveAttribute('width');
  });

  it('renders correctly with optional properties', async () => {
    const { getHost, getSvg } = await render({
      content: iconEdit,
      fill: 'red',
      height: 18,
      stroke: 'red',
      strokeWidth: '2',
      viewBox: '0 0 18 18',
      width: 18,
    });

    expect(getHost()).toBeInTheDocument();
    expect(getSvg()).toBeInTheDocument();

    expect(getHost()?.fill).toBe('red');
    expect(getHost()?.height).toBe(18);
    expect(getHost()?.stroke).toBe('red');
    expect(getHost()?.strokeWidth).toBe('2');
    expect(getHost()?.viewBox).toBe('0 0 18 18');
    expect(getHost()?.width).toBe(18);

    expect(getHost()).toHaveAttribute('fill', 'red');
    expect(getHost()).toHaveAttribute('height', '18');
    expect(getHost()).toHaveAttribute('stroke', 'red');
    expect(getHost()).toHaveAttribute('strokewidth', '2');
    expect(getHost()).toHaveAttribute('viewBox', '0 0 18 18');
    expect(getHost()).toHaveAttribute('width', '18');
  });
});
