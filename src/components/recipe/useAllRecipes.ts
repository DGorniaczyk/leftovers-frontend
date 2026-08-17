import { useEffect, useState } from 'react';
import { fetchRecipes } from '../../api/recipe/recipeService';
import type { Recipe } from './types';

export type SortField = 'rating' | 'date' | null;
export type SortDirection = 'asc' | 'desc';

export interface RecipeFilters {
  category?: string;
  /** allow selecting multiple categories in the UI */
  selectedCategories?: string[];
  rating?: number;
  sortBy: SortField;
  sortDirection: SortDirection;
  /** saved/unsaved inclusion flags */
  includeSaved?: boolean;
  includeUnsaved?: boolean;
}

const DEFAULT_FILTERS: RecipeFilters = {
  category: undefined,
  selectedCategories: [],
  rating: undefined,
  sortBy: null,
  sortDirection: 'desc',
  includeSaved: true,
  includeUnsaved: true,
};

export function useAllRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<RecipeFilters>(DEFAULT_FILTERS);

  useEffect(() => {
    setLoading(true);
    // If multiple categories are selected, fetch without server-side category filter
    const shouldSendCategory = !filters.selectedCategories || filters.selectedCategories.length <= 1;

    fetchRecipes({
      details: true,
      category: shouldSendCategory ? filters.category : undefined,
      rating: filters.rating,
      ...(filters.sortBy ? { sortBy: filters.sortBy } : {}),
      sortDirection: filters.sortDirection,
    })
      .then((data) => {
        let result = data as Recipe[];

        // Client-side filter for multiple categories
        if (filters.selectedCategories && filters.selectedCategories.length > 0) {
          result = result.filter((r: any) => filters.selectedCategories!.includes(r.category));
        }

        // Client-side filter for saved/unsaved
        if (!filters.includeSaved || !filters.includeUnsaved) {
          result = result.filter((r: any) => {
            if (filters.includeSaved && !filters.includeUnsaved) return r.isSaved === true;
            if (!filters.includeSaved && filters.includeUnsaved) return r.isSaved === false;
            return false;
          });
        }

        setRecipes(result);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters]);

  const setSortBy = (field: SortField) => {
    setFilters((prev) => {
      if (prev.sortBy === field) {
        return {
          ...prev,
          sortDirection: prev.sortDirection === 'desc' ? 'asc' : 'desc',
        };
      }
      return { ...prev, sortBy: field, sortDirection: 'desc' };
    });
  };

  const setCategory = (category?: string) => {
    setFilters((prev) => ({ ...prev, category }));
  };

  const setMinRating = (rating?: number) => {
    setFilters((prev) => ({ ...prev, rating }));
  };

  const setSelectedCategories = (categories: string[]) => {
    setFilters((prev) => ({ ...prev, selectedCategories: categories, category: categories.length === 1 ? categories[0] : undefined }));
  };

  const setSavedInclusion = (includeSaved: boolean, includeUnsaved: boolean) => {
    setFilters((prev) => ({ ...prev, includeSaved, includeUnsaved }));
  };

  const setSort = (field: SortField, direction: SortDirection) => {
    setFilters((prev) => ({ ...prev, sortBy: field, sortDirection: direction }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return {
    recipes,
    loading,
    filters,
    setSortBy,
    setSort,
    setCategory,
    setMinRating,
    setSelectedCategories,
    setSavedInclusion,
    resetFilters,
  };
}
