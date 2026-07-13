import { useEffect, useState } from 'react';
import { fetchCategories, type CategoryOption } from '../../src/api/categories';

export function useCategories() {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}
