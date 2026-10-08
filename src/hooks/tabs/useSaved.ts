import { useEffect, useState } from 'react';

import { getPosts } from '../../api/posts';
import { useFavorites } from '../../favorites/context';
import type { Post } from '../../types';

export function useSaved() {
    const { favoriteIds } = useFavorites();
    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    let active = true;

    getPosts()
        .then((all) => {
            if (active) setAllPosts(all);
        })
        .catch((err) => {
            if (active) {
            setError(err instanceof Error ? err.message : 'No se pudo cargar tus guardados');
            }
        })
        .finally(() => {
            if (active) setLoading(false);
        });

    return () => {
        active = false;
        };
    }, []);

  const savedPosts = allPosts.filter((post) => favoriteIds.has(post.id));

    return { savedPosts, loading, error };
}