import { createContext, useContext, useState, type PropsWithChildren } from 'react';

interface LikeState {
  likesCount: number;
  liked: boolean;
}

interface LikesContextValue {
  get: (postId: string) => LikeState | undefined;
  setState: (postId: string, state: LikeState) => void;
  update: (postId: string, partial: Partial<LikeState>) => void;
}

const LikesContext = createContext<LikesContextValue | null>(null);

export function LikesProvider({ children }: PropsWithChildren) {
  const [map, setMap] = useState<Record<string, LikeState>>({});

  const get = (postId: string) => map[postId];

  const setState = (postId: string, state: LikeState) => {
    setMap((prev) => ({ ...prev, [postId]: state }));
  };

  const update = (postId: string, partial: Partial<LikeState>) => {
    setMap((prev) => {
      const current = prev[postId];
      if (!current) {
        return prev;
      }
      return { ...prev, [postId]: { ...current, ...partial } };
    });
  };

  return (
    <LikesContext.Provider value={{ get, setState, update }}>
      {children}
    </LikesContext.Provider>
  );
}

export function useLikes() {
  const value = useContext(LikesContext);
  if (!value) {
    throw new Error('useLikes debe usarse dentro de <LikesProvider />');
  }
  return value;
}
