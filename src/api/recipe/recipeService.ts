import httpClient from '../axios';

export async function fetchRecipes(params?: {
  category?: string;
  title?: string;
  rating?: number;
  details?: boolean;
  startDate?: string;
  endDate?: string;
  sortBy?: 'date' | 'rating';
  sortDirection?: 'asc' | 'desc';
}) {
  const response = await httpClient.get('/recipes', { params });
  return response.data;
}

export async function fetchRecipeById(id: string) {
  const response = await httpClient.get(`/recipes/${id}`);
  return response.data;
}

export async function fetchSavedRecipes() {
  const response = await httpClient.get('/recipes/saved');
  return response.data;
}

export async function postRating(recipeId: string, rating: number) {
  const response = await httpClient.post(`/recipes/${recipeId}/rate`, { rating });
  return response.data;
}

export async function saveRecipe(recipeId: string) {
  const response = await httpClient.post(`/recipes/${recipeId}/save`);
  return response.data;
}

export async function unsaveRecipe(recipeId: string) {
  await httpClient.delete(`/recipes/${recipeId}/save`);
}

export async function fetchRecipeOfTheDay() {
  const response = await httpClient.get('/recipes', {
    params: { details: true },
  });
  const recipes: any[] = response.data;
  if (recipes.length === 0) return null;

  const today = new Date().toISOString().slice(0, 10);
  const seed = today.split('-').reduce((acc, n) => acc + parseInt(n), 0);
  return recipes[seed % recipes.length];
}
