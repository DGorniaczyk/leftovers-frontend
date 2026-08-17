import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useRecipeOfTheDay } from './useRecipes';
import { useAuth } from '../../api/auth/useAuth';
import { useAuthModals } from '../context/AuthModalContext';
import { saveRecipe, unsaveRecipe } from '../../api/recipe/recipeService';

export function useRecipeOfTheDayCard() {
  const { recipe, loading } = useRecipeOfTheDay();
  const { isAuthenticated } = useAuth();
  const { openLogin } = useAuthModals();
  const navigate = useNavigate();
  const [savePromptOpen, setSavePromptOpen] = useState(false);

  const [saved, setSaved] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);

  useEffect(() => {
    if (recipe) setSaved(recipe.isSaved ?? false);
  }, [recipe]);

  async function toggleSaved() {
    if (!isAuthenticated) {
      setSavePromptOpen(true);
      return;
    }

    if (!recipe) return;

    setSavingLoading(true);
    try {
      if (saved) {
        await unsaveRecipe(recipe.id);
        setSaved(false);
      } else {
        await saveRecipe(recipe.id);
        setSaved(true);
      }
    } catch {
    } finally {
      setSavingLoading(false);
    }
  }

  function openRecipe() {
    if (recipe) navigate(`/recipes/${recipe.id}`);
  }

  return {
    recipe,
    loading,
    saved,
    savingLoading,
    toggleSaved,
    openRecipe,
    savePromptOpen,
    closeSavePrompt: () => setSavePromptOpen(false),
  };
}
