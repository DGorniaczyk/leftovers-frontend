import { useEffect, useState } from 'react';
import { fetchRecipes, fetchRecipeOfTheDay } from '../../api/recipe/recipeService';
import type { Recipe } from './types';

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes({ details: true })
      .then(setRecipes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { recipes, loading };
}

export function useRecipeOfTheDay() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipeOfTheDay()
      .then(setRecipe)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { recipe, loading };
}
