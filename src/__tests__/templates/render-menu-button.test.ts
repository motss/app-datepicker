import { html } from 'lit';
import { describe, expect, it, vi } from 'vitest';

import { iconArrowDropdown } from '../../icons.js';
import { RootElement } from '../../root-element/root-element.js';
import { renderMenuButton } from '../../templates/render-menu-button/render-menu-button.js';
import { renderMenuButtonStyles } from '../../templates/render-menu-button/styles.js';
import { createFixture } from '../__helpers__/create-fixture.js';

describe(renderMenuButton.name, () => {
  const onClick = vi.fn();
  const render = createFixture(
    (init?: Partial<Parameters<typeof renderMenuButton>[0]>) => {
      class TestComponent extends RootElement {
        static override styles = [renderMenuButtonStyles];

        protected override render() {
          return html`
          ${renderMenuButton({
            ...init,
            text: 'text',
          })}
          `;
        }
      }

      return TestComponent;
    },
    {
      getIcon(n) {
        return n.root.querySelector<HTMLDivElement>('.icon');
      },
      getMenuButton(n) {
        return n.root.querySelector<HTMLDivElement>('.menuButton');
      },
    }
  );

  it('renders correctly', async () => {
    const { getIcon, getMenuButton } = await render();

    expect(getMenuButton()).toBeInTheDocument();
    expect(getIcon()).toBeInTheDocument();

    expect(getMenuButton()).not.toHaveAttribute('disabled');
    expect(getMenuButton()).not.toHaveAttribute('name');
    expect(getMenuButton()).not.toHaveAttribute('title');
    expect(getMenuButton()).not.toHaveAttribute('type');
    expect(getMenuButton()).toHaveAttribute('trailing-icon');
    expect(getMenuButton()).toHaveClass('menuButton');

    expect(getIcon()).toHaveClass('icon');
    expect(getIcon()).toHaveAttribute('slot', 'icon');
    expect(getIcon()).toHaveAttribute('style', '--_state:0deg;');
    expect(getIcon()?.querySelector('md-svg')).toBeInTheDocument();

    expect(getIcon()?.querySelector('md-svg')).toHaveAttribute('width', '18');
    expect(getIcon()?.querySelector('md-svg')).toHaveAttribute('height', '18');
    expect(getIcon()?.querySelector('md-svg')?.content).toEqual(
      iconArrowDropdown
    );
  });

  it('renders correctly with optional parameters', async () => {
    const { getIcon, getMenuButton } = await render({
      className: 'test',
      disabled: true,
      iconDirection: 'up',
      label: 'test',
      name: 'test',
      text: 'test',
      type: 'button',
    });

    expect(getMenuButton()).toBeInTheDocument();
    expect(getIcon()).not.toBeInTheDocument();

    expect(getMenuButton()).toHaveAttribute('disabled');
    expect(getMenuButton()).toHaveAttribute('name', 'test');
    expect(getMenuButton()).toHaveAttribute('title', 'test');
    expect(getMenuButton()).toHaveAttribute('type', 'button');
    expect(getMenuButton()).toHaveAttribute('trailing-icon');
    expect(getMenuButton()).toHaveClass('menuButton test');
  });

  it('renders correctly with optional iconDirection', async () => {
    const { getIcon, getMenuButton } = await render({
      iconDirection: 'up',
      text: 'test',
    });

    expect(getMenuButton()).toBeInTheDocument();
    expect(getIcon()).toBeInTheDocument();

    expect(getIcon()).toHaveClass('icon');
    expect(getIcon()).toHaveAttribute('slot', 'icon');
    expect(getIcon()).toHaveAttribute('style', '--_state:180deg;');
    expect(getIcon()?.querySelector('md-svg')).toBeInTheDocument();

    expect(getIcon()?.querySelector('md-svg')).toHaveAttribute('width', '18');
    expect(getIcon()?.querySelector('md-svg')).toHaveAttribute('height', '18');
    expect(getIcon()?.querySelector('md-svg')?.content).toEqual(
      iconArrowDropdown
    );
  });

  it('calls onClick()', async () => {
    const { getMenuButton, updated } = await render({
      onClick,
      text: 'test',
    });

    expect(getMenuButton()).toBeInTheDocument();

    getMenuButton()?.click();
    await updated();

    expect(onClick).toBeCalledWith(expect.any(MouseEvent));
  });
});
