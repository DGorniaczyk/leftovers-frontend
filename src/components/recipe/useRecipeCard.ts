import { useState } from 'react';
import { saveRecipe, unsaveRecipe } from '../../api/recipe/recipeService';
import type { Recipe } from './types';
import { useAuthModals } from '../context/AuthModalContext';
import { useNavigate } from 'react-router';

interface UseRecipeCardOptions {
  recipe: Recipe;
  isAuthenticated: boolean;
}

export function useRecipeCard({ recipe, isAuthenticated }: UseRecipeCardOptions) {
  const navigate = useNavigate();
  const { openLogin } = useAuthModals();

  const [saved, setSaved] = useState(recipe.isSaved);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggleSaved() {
    if (!isAuthenticated) {
      openLogin();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (saved) {
        await unsaveRecipe(recipe.id);
        setSaved(false);
      } else {
        await saveRecipe(recipe.id);
        setSaved(true);
      }
    } catch {
      setError('Failed to update saved status. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function openRecipe() {
    navigate(`/recipes/${recipe.id}`);
  }

  return {
    saved,
    loading,
    toggleSaved,
    openRecipe,
  };
}
