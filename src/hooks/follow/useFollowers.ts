import { useCallback, useEffect, useRef, useState } from 'react';

import { getFollowers, type Follower } from '../../api/follows';

const PAGE_SIZE = 20;

/** Lista paginada de seguidores. Carga al abrir y pide más al llegar al final. */
export function useFollowers(userId: string | undefined, enabled: boolean) {
    const [items, setItems] = useState<Follower[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const pageRef = useRef(1);
    const loadingMoreRef = useRef(false);
  // Sirve para ignorar respuestas viejas si se pide otra carga.
    const requestRef = useRef(0);

    const reload = useCallback(async () => {
    if (!userId) return;

    const requestId = ++requestRef.current;
    setLoading(true);
    setError(null);

    try {
        const data = await getFollowers(userId, 1, PAGE_SIZE);
        if (requestId !== requestRef.current) return;

        pageRef.current = 1;
        setItems(data.items);
        setHasMore(data.hasMore);
        } catch (err) {
        if (requestId !== requestRef.current) return;
        setError(err instanceof Error ? err.message : 'No se pudieron cargar los seguidores');
        } finally {
        if (requestId === requestRef.current) setLoading(false);
        }
    }, [userId]);

    const loadMore = useCallback(async () => {
    if (!userId || !hasMore || loading || loadingMoreRef.current) return;

    const requestId = requestRef.current;
    loadingMoreRef.current = true;
    setLoadingMore(true);

    try {
        const data = await getFollowers(userId, pageRef.current + 1, PAGE_SIZE);
        if (requestId !== requestRef.current) return;

        pageRef.current = data.page;
        setHasMore(data.hasMore);
      // Se evitan repetidos por si la lista cambió entre páginas.
        setItems((current) => {
        const known = new Set(current.map((item) => item.id));
        return [...current, ...data.items.filter((item) => !known.has(item.id))];
        });
    } catch (err) {
        if (requestId !== requestRef.current) return;
        setError(err instanceof Error ? err.message : 'No se pudieron cargar más seguidores');
    } finally {
        loadingMoreRef.current = false;
        setLoadingMore(false);
    }
    }, [userId, hasMore, loading]);

    useEffect(() => {
        if (enabled) reload();
    }, [enabled, reload]);

    return {
    items,
    // El spinner grande solo se ve si aún no hay nada que mostrar.
    showSpinner: loading && items.length === 0,
    loadingMore,
    error,
    loadMore,
    reload,
    };
}