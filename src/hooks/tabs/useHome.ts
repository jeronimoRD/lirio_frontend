import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

import { getFeedPosts } from '../../api/posts';
import { getCategories } from '../../api/categories';
import { useFavorites } from '../../favorites/context';
import type { Post, Category } from '../../types';

const ALL_FILTER = 'Ver todos';

export function useHome() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState(ALL_FILTER);

    useEffect(() => {
    let cancelled = false;

    const load = async () => {
        setLoading(true);
        setError(null);

        getCategories()
            .then((allCategories) => {
            if (cancelled) return;
            setCategories(allCategories);
        })
        .catch(() => {});

        try {
            const allPosts = await getFeedPosts();
            if (cancelled) return;
            setPosts(allPosts);
        } catch (err) {
            if (cancelled) return;
            setError(err instanceof Error ? err.message : 'No se pudo cargar el feed');
        } finally {
            if (!cancelled) setLoading(false);
        }
    };

    load();

        return () => {
        cancelled = true;
        };
    }, []);

    const filters = [ALL_FILTER, ...categories.map((category) => category.name)];

  // "Ver todos" muestra el feed completo (ya viene priorizado por preferencias
  // desde el backend). Elegir una categoría puntual filtra por su id.
    const activeCategoryId =
    activeFilter === ALL_FILTER
        ? null
        : (categories.find((c) => c.name === activeFilter)?.id ?? null);

    const displayedPosts = activeCategoryId
        ? posts.filter((post) => post.categoryId === activeCategoryId)
    : posts;

    const leftColumn = displayedPosts.filter((_, i) => i % 2 === 0);
    const rightColumn = displayedPosts.filter((_, i) => i % 2 === 1);

    const showSpinner = loading && posts.length === 0;

    return {
    loading,
    error,
    showSpinner,
    filters,
    activeFilter,
    setActiveFilter,
    activeCategoryId,
    displayedPosts,
    featuredPost: displayedPosts[0],
    leftColumn,
    rightColumn,
    };
}

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