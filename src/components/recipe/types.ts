export interface Recipe {
  id: string;
  title: string;
  description: string;
  coverImageUrl: string;
  averageRating: number;
  ratingsCount: number;
  prepTimeMinutes: number;
  servings: number;
  isSaved: boolean;
}
