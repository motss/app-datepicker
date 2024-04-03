import { describe, expect, it } from 'vitest';

import { templateReplacer } from '../../helpers/template-replacer.js';

describe(templateReplacer.name, () => {
  it('replaces template correctly', () => {
    const result = templateReplacer('test %s 1 %s 2 %s!', ['a', 'b', 'c']);

    expect(result).toBe('test a 1 b 2 c!');
  });
});
