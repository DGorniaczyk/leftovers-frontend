import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCategories } from './hooks/useCategories';
import * as categoriesApi from '../src/api/categories';

const MOCK_CATEGORIES = [
  { value: 'all', label: '🍽️ All recipes' },
  { value: 'BREAKFAST', label: '🥪 Breakfasts' },
  { value: 'LUNCH', label: '🍔 Lunch' },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useCategories — initial state', () => {
  it('starts with an empty categories array', () => {
    vi.spyOn(categoriesApi, 'fetchCategories').mockResolvedValue([]);
    const { result } = renderHook(() => useCategories());
    expect(result.current.categories).toEqual([]);
  });

  it('starts in a loading state', () => {
    vi.spyOn(categoriesApi, 'fetchCategories').mockResolvedValue([]);
    const { result } = renderHook(() => useCategories());
    expect(result.current.loading).toBe(true);
  });
});

describe('useCategories — successful fetch', () => {
  it('populates categories after the fetch resolves', async () => {
    vi.spyOn(categoriesApi, 'fetchCategories').mockResolvedValue(MOCK_CATEGORIES);
    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.categories).toEqual(MOCK_CATEGORIES);
    });
  });

  it('sets loading to false after the fetch resolves', async () => {
    vi.spyOn(categoriesApi, 'fetchCategories').mockResolvedValue(MOCK_CATEGORIES);
    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('calls fetchCategories exactly once on mount', async () => {
    const spy = vi.spyOn(categoriesApi, 'fetchCategories').mockResolvedValue([]);
    renderHook(() => useCategories());

    await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
  });
});

describe('useCategories — failed fetch', () => {
  it('keeps categories empty when the fetch fails', async () => {
    vi.spyOn(categoriesApi, 'fetchCategories').mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.categories).toEqual([]);
    });
  });

  it('sets loading to false even when the fetch fails', async () => {
    vi.spyOn(categoriesApi, 'fetchCategories').mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});
