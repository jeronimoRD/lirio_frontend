import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { getPosts } from '../../api/posts';
import { getPublicOutfits } from '../../api/outfits';
import { getCategories } from '../../api/categories';
import { searchUsers, suggestUsers } from '../../api/users';
import { useMyContent } from '../../content/context';
import type { Post, Outfit, Category, User } from '../../types';

export type SearchTab = 'prendas' | 'outfits' | 'cuentas';

export function useExplore() {
    const { version } = useMyContent();
    const [posts, setPosts] = useState<Post[]>([]);
    const [outfits, setOutfits] = useState<Outfit[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<SearchTab>('prendas');
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersError, setUsersError] = useState<string | null>(null);
    const [focused, setFocused] = useState(false);

    const loadedOnce = useRef(false);
    // Cada carga tiene un número; solo la más reciente puede escribir estado.
    const genRef = useRef(0);

    const load = useCallback(async () => {
        const gen = ++genRef.current;

        if (!loadedOnce.current) {
            setLoading(true);
        }

        setError(null);

        // Todo se pide a la vez y se aplica junto: si una parte falla, el resto
        // se actualiza igual y nunca queda una lista con datos viejos.
        const [postsResult, outfitsResult, categoriesResult, suggestionsResult] =
            await Promise.allSettled([
                getPosts(),
                getPublicOutfits(),
                getCategories(),
                suggestUsers(10),
            ]);

        // Llegó una carga más nueva mientras esta estaba en vuelo: se descarta
        // para no pisar el estado con datos viejos.
        if (gen !== genRef.current) return;

        if (postsResult.status === 'fulfilled') {
            setPosts(postsResult.value);
        } else {
            setError(
                postsResult.reason instanceof Error
                    ? postsResult.reason.message
                    : 'No se pudo cargar el contenido',
            );
        }

        if (outfitsResult.status === 'fulfilled') {
            setOutfits(outfitsResult.value);
        }

        if (categoriesResult.status === 'fulfilled') {
            setCategories(categoriesResult.value);
        }

        if (suggestionsResult.status === 'fulfilled') {
            setSuggestions(suggestionsResult.value);
        }

        loadedOnce.current = true;
        setLoading(false);
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
        setRefreshing(false);
    }, [load]);

  // Búsqueda de cuentas en el servidor, con un pequeño retardo.
    useEffect(() => {
        const q = query.trim();

        let active = true;

        const timer = setTimeout(() => {
        if (!active) return;

        if (!q) {
            setUsers([]);
            setUsersError(null);
            setUsersLoading(false);
        return;
        }

        setUsersLoading(true);
        setUsersError(null);

        searchUsers(q)
            .then((data) => {
            if (active) setUsers(data);
            })
            .catch((err) => {
            if (active) {
                setUsersError(err instanceof Error ? err.message : 'No se pudieron buscar cuentas');
            }
            })
            .finally(() => {
            if (active) setUsersLoading(false);
            });
    }, 250);

    return () => {
        active = false;
        clearTimeout(timer);
        };
    }, [query]);

    const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
        prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
        );
    };

    const handleFocus = () => setFocused(true);

    const handleBlur = () => {
        setFocused(false);
        if (!query.trim()) setActiveTab('prendas');
    };

    const clearQuery = () => setQuery('');

  // IDs de las categorías seleccionadas (los chips guardan el nombre, no el id).
    const activeCategoryIds = useMemo(
        () => categories.filter((c) => activeFilters.includes(c.name)).map((c) => c.id),
        [categories, activeFilters]
    );

  // Mapa rápido para resolver el nombre de la categoría de un post.
    const categoryNameById = useMemo(() => {
        const map = new Map<string, string>();
        for (const category of categories) {
        map.set(category.id, category.name);
        }
        return map;
    }, [categories]);

  // Filtra por texto (título/descripción/categoría) Y por categorías seleccionadas.
    const results = useMemo(() => {
        const q = query.trim().toLowerCase();

    return posts.filter((post) => {
        const categoryNames = post.categoryIds
            .map((id) => categoryNameById.get(id) ?? '')
            .join(' ');
        const haystack = `${post.title} ${post.description ?? ''} ${categoryNames}`.toLowerCase();

        const matchesQuery = !q || haystack.includes(q);

        const matchesCategory =
        activeCategoryIds.length === 0 ||
        post.categoryIds.some((id) => activeCategoryIds.includes(id));

        return matchesQuery && matchesCategory;
    });
    }, [posts, query, activeCategoryIds, categoryNameById]);

    const outfitResults = useMemo(() => {
        const q = query.trim().toLowerCase();

        return outfits.filter((outfit) => {
            const categoryNames = outfit.categoryIds
                .map((id) => categoryNameById.get(id) ?? '')
                .join(' ');
            const haystack = `${outfit.name} ${categoryNames}`.toLowerCase();

            const matchesQuery = !q || haystack.includes(q);

            const matchesCategory =
                activeCategoryIds.length === 0 ||
                outfit.categoryIds.some((id) => activeCategoryIds.includes(id));

            return matchesQuery && matchesCategory;
        });
    }, [outfits, query, activeCategoryIds, categoryNameById]);

    const outfitCountByUser = useMemo(() => {
    const counts = new Map<string, number>();
    for (const outfit of outfits) {
        counts.set(outfit.userId, (counts.get(outfit.userId) ?? 0) + 1);
    }
    return counts;
    }, [outfits]);

    const hasQuery = query.trim().length > 0;
    const searchActive = focused || hasQuery;
    const hasCategoryFilter = activeCategoryIds.length > 0;
    const filters = categories.map((category) => category.name);

    // Al abrir la pestaña de outfits se recarga todo, para que uno recién
    // creado aparezca aunque el foco de las tabs no cambie.
    useEffect(() => {
        if (!searchActive || activeTab !== 'outfits') return;

        const timer = setTimeout(() => {
            load();
        }, 0);

        return () => clearTimeout(timer);
    }, [searchActive, activeTab, load]);

    return {
    // carga general
    loading,
    refreshing,
    refresh,
    error,

    // buscador
    query,
    setQuery,
    clearQuery,
    handleFocus,
    handleBlur,
    focused,
    hasQuery,
    searchActive,

    // pestañas
    activeTab,
    setActiveTab,

    // filtros por categoría
    filters,
    activeFilters,
    toggleFilter,
    hasCategoryFilter,

    // prendas (posts)
    results,

    // outfits
    outfitResults,

    // cuentas
    suggestions,
    users,
    usersLoading,
    usersError,
    outfitCountByUser,
    };
}