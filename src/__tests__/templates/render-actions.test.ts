import type { MdTextButton } from '@material/web/button/text-button.js';
import { html } from 'lit';
import { describe, expect, it, vi } from 'vitest';

import { RootElement } from '../../root-element/root-element.js';
import { renderActions } from '../../templates/render-actions/render-actions.js';
import { createFixture } from '../__helpers__/create-fixture.js';

const onConfirm = vi.fn();
const onDeny = vi.fn();
const toTestComponent = (...[init]: Partial<Parameters<typeof renderActions>>) => {
  class TestComponent extends RootElement {
    protected override render() {
      return html`
      ${renderActions({
        ...init,
        confirmText: init?.confirmText ?? 'confirm',
        denyText: init?.denyText ?? 'deny',
        onConfirm,
        onDeny,
      })}
      `;
    }
  }

  return TestComponent;
};

describe(renderActions.name, () => {
  const  render = (...[init]: Partial<Parameters<typeof renderActions>>) => createFixture(() => toTestComponent(init), {
    getActions(n) {
      return n.root.querySelector<HTMLDivElement>('.actions');
    },
    getConfirmText(n) {
      return n.root.querySelector<MdTextButton>('.confirmText');
    },
    getDenyText(n) {
      return n.root.querySelector<MdTextButton>('.denyText');
    }
  });

  it('renders correctly', async () => {
    const {
      getActions,
      getConfirmText,
      getDenyText,
    } = await render()();

    expect(getActions()).toBeInTheDocument();
    expect(getConfirmText()).toBeInTheDocument();
    expect(getDenyText()).toBeInTheDocument();

    expect(getActions()).not.toHaveAttribute('slot');
    expect(getConfirmText()).not.toHaveAttribute('form');
    expect(getDenyText()).not.toHaveAttribute('form');

    expect(getConfirmText()).toHaveTextContent('confirm');
    expect(getDenyText()).toHaveTextContent('deny');
  });

  it('renders with optional parameters correctly', async () => {

    const {
      getActions,
      getConfirmText,
      getDenyText,
    } = await render({
      confirmText: 'confirm',
      denyText: 'deny',
      formId: 'test-form-id',
      slot: 'test-slot-id',
    })();

    expect(getActions()).toBeInTheDocument();
    expect(getConfirmText()).toBeInTheDocument();
    expect(getDenyText()).toBeInTheDocument();

    expect(getActions()).toHaveAttribute('slot', 'test-slot-id');
    expect(getConfirmText()).toHaveAttribute('form', 'test-form-id');
    expect(getDenyText()).toHaveAttribute('form', 'test-form-id');
  });

  it('calls onConfirm()', async () => {
    const {
      getConfirmText,
      updated,
    } = await render()();

    getConfirmText()?.click();
    await updated();

    expect(onConfirm).toBeCalledWith(expect.any(MouseEvent));
  });

  it('calls onDeny()', async () => {
    const {
      getDenyText,
      updated,
    } = await render()();

    getDenyText()?.click();
    await updated();

    expect(onDeny).toBeCalledWith(expect.any(MouseEvent));
  });
});
