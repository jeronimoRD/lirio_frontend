import {
    createContext,
    useContext,
    useEffect,
    useState,
    useSyncExternalStore,
    type PropsWithChildren,
} from 'react';

import { getFollowingIds } from '../api/follows';
import { useSession } from '../session/context';

const READY_KEY = '__ready__';

function createFollowsStore() {
    let following = new Set<string>();
    let ready = false;
    const listeners = new Map<string, Set<() => void>>();

    const notify = (key: string) => listeners.get(key)?.forEach((listener) => listener());
    const notifyAll = () =>
    listeners.forEach((set) => set.forEach((listener) => listener()));

    return {
        isFollowing: (userId: string) => following.has(userId),
        isReady: () => ready,

    setFollowing: (userId: string, value: boolean) => {
        if (following.has(userId) === value) return;
        if (value) following.add(userId);
        else following.delete(userId);
        notify(userId);
    },

    /** Reemplaza la lista con la que llegó del servidor. */
    hydrate: (ids: string[]) => {
        following = new Set(ids);
        ready = true;
        notifyAll();
    },

    /** Permite usar los botones aunque la carga inicial haya fallado. */
    markReady: () => {
        if (ready) return;
        ready = true;
        notify(READY_KEY);
    },

    /** Limpia todo al cambiar de usuario o cerrar sesión. */
    reset: () => {
        following = new Set();
        ready = false;
        notifyAll();
    },

    subscribe: (key: string, listener: () => void) => {
        const set = listeners.get(key) ?? new Set<() => void>();
        set.add(listener);
        listeners.set(key, set);

        return () => {
        set.delete(listener);
        if (set.size === 0) listeners.delete(key);
        };
    },
    };
}

export type FollowsStore = ReturnType<typeof createFollowsStore>;

const FollowsContext = createContext<FollowsStore | null>(null);

export function FollowsProvider({ children }: PropsWithChildren) {
    const { user } = useSession();
    const userId = user?.id ?? null;
    const [store] = useState(createFollowsStore);

    useEffect(() => {
    store.reset();
    if (!userId) return;

    let cancelled = false;

    getFollowingIds()
        .then((ids) => {
        if (!cancelled) store.hydrate(ids);
        })
        .catch(() => {
        if (!cancelled) store.markReady();
        });

    return () => {
        cancelled = true;
    };
    }, [userId, store]);

    return <FollowsContext.Provider value={store}>{children}</FollowsContext.Provider>;
}

export function useFollows(): FollowsStore {
    const value = useContext(FollowsContext);
    if (!value) throw new Error('useFollows debe usarse dentro de <FollowsProvider />');
    return value;
}

/** Indica si el usuario actual sigue a esta cuenta. */
export function useIsFollowing(userId: string | undefined): boolean {
    const store = useFollows();
    const key = userId ?? '';

    return useSyncExternalStore(
    (listener) => store.subscribe(key, listener),
    () => (userId ? store.isFollowing(userId) : false),
    () => false,
    );
}

/** Indica si ya llegó la lista inicial de seguidos. */
export function useFollowsReady(): boolean {
    const store = useFollows();

    return useSyncExternalStore(
    (listener) => store.subscribe(READY_KEY, listener),
    () => store.isReady(),
    () => false,
    );
}