import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { getFeedPosts } from '../../api/posts';
import { getCategories } from '../../api/categories';
import { useMyContent } from '../../content/context';
import { shuffle } from '../../utils/shuffle';
import type { Post, Category } from '../../types';

const ALL_FILTER = 'Ver todos';

export function useHome() {
    const { version } = useMyContent();
    const [posts, setPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState(ALL_FILTER);

    const loadedOnce = useRef(false);

    const load = useCallback(async () => {
        if (!loadedOnce.current) {
            setLoading(true);
        }

        setError(null);

        getCategories()
            .then((allCategories) => {
                setCategories(allCategories);
            })
            .catch(() => {});

        try {
            setPosts(await getFeedPosts());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'No se pudo cargar el feed');
        } finally {
            loadedOnce.current = true;
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [load]),
    );

    const lastVersion = useRef(version);

    useEffect(() => {
        if (lastVersion.current === version) return;

        lastVersion.current = version;
        load();
    }, [version, load]);

    const refresh = useCallback(async () => {
        setRefreshing(true);
        await load();
        // Recargar a mano baraja el feed para descubrir otros looks.
        setPosts((current) => shuffle(current));
        setRefreshing(false);
    }, [load]);

    const filters = [ALL_FILTER, ...categories.map((category) => category.name)];

  // "Ver todos" muestra el feed completo (ya viene priorizado por preferencias
  // desde el backend). Elegir una categoría puntual filtra por su id.
    const activeCategoryId =
    activeFilter === ALL_FILTER
        ? null
        : (categories.find((c) => c.name === activeFilter)?.id ?? null);

    const displayedPosts = activeCategoryId
        ? posts.filter((post) => post.categoryIds.includes(activeCategoryId))
    : posts;

    const showSpinner = loading && posts.length === 0;

    return {
    loading,
    refreshing,
    refresh,
    error,
    showSpinner,
    filters,
    activeFilter,
    setActiveFilter,
    activeCategoryId,
    displayedPosts,
    featuredPost: displayedPosts[0],
    };
}
