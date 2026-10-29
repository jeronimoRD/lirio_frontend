import { createContext, use, useCallback, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';

import { getMyOutfits } from '../api/outfits';
import { getMyPosts, getSavedPosts } from '../api/posts';
import { useSession } from '../session/context';
import type { Outfit, Post } from '../types';

interface MyContent {
  /** Publicaciones del usuario actual. */
  myPosts: Post[];
  /** Publicaciones que el usuario guardó. */
  savedPosts: Post[];
  /** Outfits del usuario actual. */
  outfits: Outfit[];
  /** Falso hasta la primera carga completa; el spinner solo debe mostrarse entonces. */
  loaded: boolean;
  error: string | null;
  /** Vuelve a pedir todo en segundo plano; lo que ya está en memoria se sigue mostrando. */
  refresh: () => Promise<void>;
  setMyPosts: (update: (posts: Post[]) => Post[]) => void;
  setOutfits: (update: (outfits: Outfit[]) => Outfit[]) => void;
}

const MyContentContext = createContext<MyContent | null>(null);

export function useMyContent(): MyContent {
  const value = use(MyContentContext);
  if (!value) throw new Error('useMyContent debe usarse dentro de <MyContentProvider />');
  return value;
}

export function MyContentProvider({ children }: PropsWithChildren) {
  const { user } = useSession();
  const userId = user?.id ?? null;

  const [myPosts, setMyPostsState] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [outfits, setOutfitsState] = useState<Outfit[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentUserRef = useRef<string | null>(userId);

  const refresh = useCallback(async () => {
    if (!userId) return;

    const requestedFor = userId;

    try {
      const [mine, saved, all] = await Promise.all([
        getMyPosts(),
        getSavedPosts(),
        getMyOutfits(),
      ]);

      if (currentUserRef.current !== requestedFor) return;

      setMyPostsState(mine);
      setSavedPosts(saved);
      setOutfitsState(all);
      setError(null);
      setLoaded(true);
    } catch (err) {
      if (currentUserRef.current !== requestedFor) return;

      setError(err instanceof Error ? err.message : 'No se pudo cargar tu contenido');
      setLoaded(true);
    }
  }, [userId]);

  useEffect(() => {
    currentUserRef.current = userId;

    setMyPostsState([]);
    setSavedPosts([]);
    setOutfitsState([]);
    setLoaded(false);
    setError(null);

    if (userId) refresh();
  }, [userId, refresh]);

  const value = useMemo<MyContent>(
    () => ({
      myPosts,
      savedPosts,
      outfits,
      loaded,
      error,
      refresh,
      setMyPosts: (update) => setMyPostsState((current) => update(current)),
      setOutfits: (update) => setOutfitsState((current) => update(current)),
    }),
    [myPosts, savedPosts, outfits, loaded, error, refresh],
  );

  return <MyContentContext value={value}>{children}</MyContentContext>;
}
