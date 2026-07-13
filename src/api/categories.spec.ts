import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildCategoryOptions, fetchCategories } from './categories.ts';
import httpClient from './axios';

vi.mock('./axios');

const mockedHttpClient = vi.mocked(httpClient);

describe('buildCategoryOptions', () => {
  it('always prepends "All recipes" as the first option', () => {
    const result = buildCategoryOptions([]);
    expect(result[0]).toEqual({ value: 'all', label: '🍽️ All recipes' });
  });

  it('maps known categories to their labels', () => {
    const result = buildCategoryOptions(['BREAKFAST', 'LUNCH', 'DESSERT']);
    expect(result).toContainEqual({ value: 'BREAKFAST', label: '🥪 Breakfasts' });
    expect(result).toContainEqual({ value: 'LUNCH', label: '🍔 Lunch' });
    expect(result).toContainEqual({ value: 'DESSERT', label: '🧁 Desserts' });
  });

  it('formats unknown categories by humanising the value', () => {
    const result = buildCategoryOptions(['SLOW_COOK']);
    expect(result).toContainEqual({ value: 'SLOW_COOK', label: 'Slow cook' });
  });

  it('returns only "All recipes" when called with no argument', () => {
    const result = buildCategoryOptions();
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe('all');
  });

  it('returns only "All recipes" when called with an empty array', () => {
    const result = buildCategoryOptions([]);
    expect(result).toHaveLength(1);
  });

  it('filters out falsy values', () => {
    const result = buildCategoryOptions(['BREAKFAST', '', undefined as unknown as string]);
    expect(result).toHaveLength(2); // "all" + BREAKFAST
  });

  it('preserves the order of the input array after "All recipes"', () => {
    const input = ['SOUP', 'SALAD', 'DRINK'];
    const result = buildCategoryOptions(input);
    const values = result.map((o) => o.value);
    expect(values).toEqual(['all', 'SOUP', 'SALAD', 'DRINK']);
  });
});

describe('fetchCategories', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns mapped category options on a successful response', async () => {
    vi.mocked(mockedHttpClient.get).mockResolvedValueOnce({
      data: ['BREAKFAST', 'LUNCH'],
    });

    const result = await fetchCategories();

    expect(result).toEqual([
      { value: 'all', label: '🍽️ All recipes' },
      { value: 'BREAKFAST', label: '🥪 Breakfasts' },
      { value: 'LUNCH', label: '🍔 Lunch' },
    ]);
  });

  it('calls the correct endpoint', async () => {
    vi.mocked(mockedHttpClient.get).mockResolvedValueOnce({ data: [] });

    await fetchCategories();

    expect(mockedHttpClient.get).toHaveBeenCalledWith('/recipes/categories');
  });

  it('returns only "All recipes" when the API call fails', async () => {
    vi.mocked(mockedHttpClient.get).mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchCategories();

    expect(result).toEqual([{ value: 'all', label: '🍽️ All recipes' }]);
  });

  it('returns only "All recipes" when the API returns an empty array', async () => {
    vi.mocked(mockedHttpClient.get).mockResolvedValueOnce({ data: [] });

    const result = await fetchCategories();

    expect(result).toHaveLength(1);
    expect(result[0].value).toBe('all');
  });

  it('handles unknown categories returned by the API gracefully', async () => {
    vi.mocked(mockedHttpClient.get).mockResolvedValueOnce({
      data: ['SLOW_COOK'],
    });

    const result = await fetchCategories();

    expect(result).toContainEqual({ value: 'SLOW_COOK', label: 'Slow cook' });
  });
});
