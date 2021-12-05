import '../../date-picker-dialog/app-date-picker-dialog-base';

import { expect, fixture, html } from '@open-wc/testing';
import type { TemplateResult } from 'lit';

import type { AppDatePickerDialogBase } from '../../date-picker-dialog/app-date-picker-dialog-base';
import type { AppDatePickerDialogDialog } from '../../date-picker-dialog/app-date-picker-dialog-dialog';
import { appDatePickerDialogBaseName, appDatePickerDialogDialogName } from '../../date-picker-dialog/constants';
import { messageFormatter } from '../test-utils/message-formatter';

describe(appDatePickerDialogBaseName, () => {
  const elementSelectors = {
    datePickerDialogDialog: appDatePickerDialogDialogName,
    testSlot: '.test',
  } as const;
  const renderTestSlot = (): TemplateResult => html`<div class=test>Test</div>`;

  type CaseRenders = [boolean, boolean];
  const casesRenders: CaseRenders[] = [
    [false, false],
    [true, true],
  ];
  casesRenders.forEach((a) => {
    const [testOpen, expectedHasAssignedElements] = a;

    it(
      messageFormatter('renders (open=%s)', a),
      async () => {
        const el = await fixture<AppDatePickerDialogBase>(
          html`<app-date-picker-dialog-base
            .open=${testOpen}
          >${renderTestSlot()}</app-date-picker-dialog-base>`
        );

        const datePickerDialogDialog = el.query<AppDatePickerDialogDialog>(
          elementSelectors.datePickerDialogDialog
        );
        const lightTestSlot = el.querySelector(elementSelectors.testSlot);
        const slot = datePickerDialogDialog?.query<HTMLSlotElement>('slot');

        expect(datePickerDialogDialog).exist;
        expect(lightTestSlot).exist;
        expect(slot).exist;

        const hasTestSlot =
          slot?.assignedElements({ flatten: true })
            .some(n => n.isEqualNode(lightTestSlot));

        expect(hasTestSlot).equal(expectedHasAssignedElements);
      }
    )
  });
});
