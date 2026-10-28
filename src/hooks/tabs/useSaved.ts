import { useEffect, useState } from 'react';

import { getLikedPosts, getSavedPosts } from '../../api/posts';
import type { Post } from '../../types';

export function useSaved() {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    getSavedPosts()
      .then((posts) => {
        if (active) setSavedPosts(posts);
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

  return { savedPosts, loading, error };
}

export function useLikedPosts() {
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    getLikedPosts()
      .then((posts) => {
        if (active) setLikedPosts(posts);
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'No se pudo cargar los posts que te han gustado');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { likedPosts, loading, error };
}
