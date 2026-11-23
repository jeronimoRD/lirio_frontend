import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  type PropsWithChildren,
} from 'react';

interface LikeState {
  likesCount: number;
  liked: boolean;
}

interface LikesContextValue {
  get: (postId: string) => LikeState | undefined;
  setState: (postId: string, state: LikeState) => void;
  update: (postId: string, partial: Partial<LikeState>) => void;
  subscribe: (postId: string, listener: () => void) => () => void;
}

const LikesContext = createContext<LikesContextValue | null>(null);

function createLikesStore(): LikesContextValue {
  const states = new Map<string, LikeState>();
  const listeners = new Map<string, Set<() => void>>();

  const notify = (postId: string) => {
    listeners.get(postId)?.forEach((listener) => listener());
  };

  return {
    get: (postId) => states.get(postId),
    setState: (postId, state) => {
      const current = states.get(postId);
      if (current?.liked === state.liked && current.likesCount === state.likesCount) return;
      states.set(postId, state);
      notify(postId);
    },
    update: (postId, partial) => {
      const current = states.get(postId);
      if (!current) return;
      const next = { ...current, ...partial };
      if (current.liked === next.liked && current.likesCount === next.likesCount) return;
      states.set(postId, next);
      notify(postId);
    },
    subscribe: (postId, listener) => {
      const postListeners = listeners.get(postId) ?? new Set<() => void>();
      postListeners.add(listener);
      listeners.set(postId, postListeners);

      return () => {
        postListeners.delete(listener);
        if (postListeners.size === 0) listeners.delete(postId);
      };
    },
  };
}

export function LikesProvider({ children }: PropsWithChildren) {
  const [store] = useState(createLikesStore);

  return <LikesContext.Provider value={store}>{children}</LikesContext.Provider>;
}

export function useLikes() {
  const value = useContext(LikesContext);
  if (!value) {
    throw new Error('useLikes debe usarse dentro de <LikesProvider />');
  }
  return value;
}

export function usePostLikeState(postId: string, fallback: LikeState): LikeState {
  const store = useLikes();

  return useSyncExternalStore(
    (listener) => store.subscribe(postId, listener),
    () => store.get(postId) ?? fallback,
    () => store.get(postId) ?? fallback
  );
}
