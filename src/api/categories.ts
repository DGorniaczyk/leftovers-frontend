import httpClient from './axios';

export interface CategoryOption {
  value: string;
  label: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  BREAKFAST: '🥪 Breakfasts',
  LUNCH: '🍔 Lunch',
  DESSERT: '🧁 Desserts',
  SNACK: '🍿 Snacks',
  BAKING: '🥐 Baking',
  SOUP: '🍲 Soups',
  SALAD: '🥗 Salads',
  DRINK: '🥤 Drinks',
};

export function buildCategoryOptions(categories?: string[]): CategoryOption[] {
  const normalized = categories?.filter(Boolean) ?? [];
  const options = normalized.map((value) => ({
    value,
    label:
      CATEGORY_LABELS[value] ??
      value
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/^./, (c) => c.toUpperCase()),
  }));

  return [{ value: 'all', label: '🍽️ All recipes' }, ...options];
}

export async function fetchCategories(): Promise<CategoryOption[]> {
  try {
    const { data } = await httpClient.get<string[]>('/recipes/categories');
    return buildCategoryOptions(data);
  } catch {
    return buildCategoryOptions();
  }
}
