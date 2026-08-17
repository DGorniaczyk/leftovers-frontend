import { SaveRecipeModal } from '../auth/SaveRecipeGuestModal';
import { RecipeCard } from './RecipeCard';
import { useRecipeCard } from './useRecipeCard';
import type { Recipe } from './types';

interface RecipeCardWrapperProps {
  recipe: Recipe;
  isAuthenticated: boolean;
}

export function RecipeCardWrapper({ recipe, isAuthenticated }: RecipeCardWrapperProps) {
  const { saved, loading, toggleSaved, openRecipe, savePromptOpen, closeSavePrompt } =
    useRecipeCard({ recipe, isAuthenticated });

  return (
    <>
      <RecipeCard
        recipe={recipe}
        saved={saved}
        loading={loading}
        onOpen={openRecipe}
        onToggleSaved={toggleSaved}
      />
      <SaveRecipeModal open={savePromptOpen} onClose={closeSavePrompt} />
    </>
  );
}
