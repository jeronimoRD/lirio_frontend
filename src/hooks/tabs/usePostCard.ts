import { useRouter } from 'expo-router';

import { useFavorites } from '../../favorites/context';
import type { Post } from '../../types';

/** Lógica de cada tarjeta del feed: favoritos y navegación al detalle. */
export function usePostCard(post: Post) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const router = useRouter();

  return {
    favorited: isFavorite(post.id),
    toggleFavorite: () => toggleFavorite(post.id),
    openPost: () =>
      router.push({
        pathname: '/(upload)/[id]',
        params: { id: post.id },
      }),
  };
}
