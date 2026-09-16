import { createContext, useContext, useState, type PropsWithChildren } from 'react';

interface FavoritesContextValue {
    favoriteIds: Set<string>;
    isFavorite: (postId: string) => boolean;
    toggleFavorite: (postId: string) => void;
    }

    const FavoritesContext = createContext<FavoritesContextValue | null>(null);

    export function useFavorites(): FavoritesContextValue {
    const value = useContext(FavoritesContext);
    if (!value) {
        throw new Error('useFavorites debe usarse dentro de <FavoritesProvider />');
    }
    return value;
    }

    // TODO: esto vive solo en memoria por ahora (se resetea al cerrar la app o
    // cerrar sesión). Cuando el backend tenga un endpoint de favoritos, esto
    // debería sincronizarse con el servidor en vez de guardarse solo local.
    export function FavoritesProvider({ children }: PropsWithChildren) {
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

    const isFavorite = (postId: string) => favoriteIds.has(postId);

    const toggleFavorite = (postId: string) => {
        setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (next.has(postId)) {
            next.delete(postId);
        } else {
            next.add(postId);
        }
        return next;
        });
    };

    return (
        <FavoritesContext.Provider value={{ favoriteIds, isFavorite, toggleFavorite }}>
        {children}
        </FavoritesContext.Provider>
    );
}