import { useEffect, useMemo, useState } from 'react';

import { getPosts } from '../../api/posts';
import { getCategories } from '../../api/categories';
import { searchUsers, suggestUsers } from '../../api/users';
import type { Post, Category, User } from '../../types';

export type SearchTab = 'outfits' | 'cuentas';

export function useExplore() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<SearchTab>('outfits');
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersError, setUsersError] = useState<string | null>(null);
    const [focused, setFocused] = useState(false);

    useEffect(() => {
        let active = true;

        getCategories()
        .then((all) => {
            if (active) setCategories(all);
        })
        .catch(() => {});

        getPosts()
        .then((all) => {
            if (active) setPosts(all);
        })
        .catch((err) => {
            if (active) {
            setError(err instanceof Error ? err.message : 'No se pudo cargar el contenido');
            }
        })
        .finally(() => {
            if (active) setLoading(false);
        });

        suggestUsers(10)
        .then((all) => {
            if (active) setSuggestions(all);
        })
        .catch(() => {});

        return () => {
        active = false;
        };
    }, []);

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
        if (!query.trim()) setActiveTab('outfits');
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
        const categoryName = post.categoryId ? (categoryNameById.get(post.categoryId) ?? '') : '';
        const haystack = `${post.title} ${post.description ?? ''} ${categoryName}`.toLowerCase();

        const matchesQuery = !q || haystack.includes(q);

        const matchesCategory =
        activeCategoryIds.length === 0 ||
        (post.categoryId !== undefined && activeCategoryIds.includes(post.categoryId));

        return matchesQuery && matchesCategory;
    });
    }, [posts, query, activeCategoryIds, categoryNameById]);

    const outfitCountByUser = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
        counts.set(post.userId, (counts.get(post.userId) ?? 0) + 1);
    }
    return counts;
    }, [posts]);

    const hasQuery = query.trim().length > 0;
    const searchActive = focused || hasQuery;
    const hasCategoryFilter = activeCategoryIds.length > 0;
    const filters = categories.map((category) => category.name);

    const leftColumn = results.filter((_, i) => i % 2 === 0);
    const rightColumn = results.filter((_, i) => i % 2 === 1);

    return {
    // carga general
    loading,
    error,

    // buscador
    query,
    setQuery,
    clearQuery,
    handleFocus,
    handleBlur,
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

    // outfits
    results,
    leftColumn,
    rightColumn,

    // cuentas
    suggestions,
    users,
    usersLoading,
    usersError,
    outfitCountByUser,
    };
}