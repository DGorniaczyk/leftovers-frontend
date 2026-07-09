import { describe, expect, it } from 'vitest';
import { buildCategoryOptions } from './categories';

describe('buildCategoryOptions', () => {
  it('adds an all option and formats backend values into labels', () => {
    expect(buildCategoryOptions(['BREAKFAST', 'LUNCH'])).toEqual([
      { value: 'all', label: 'All' },
      { value: 'BREAKFAST', label: 'Breakfast' },
      { value: 'LUNCH', label: 'Lunch' },
    ]);
  });

  it('returns only the all option when no categories are provided', () => {
    expect(buildCategoryOptions()).toEqual([{ value: 'all', label: 'All' }]);
  });
});
