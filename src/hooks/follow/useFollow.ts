import { Alert } from 'react-native';
import { useCallback, useRef, useState } from 'react';

import { followUser, unfollowUser } from '../../api/follows';
import { useFollows, useFollowsReady, useIsFollowing } from '../../follows/context';

/** Lógica del botón de seguir: cambio inmediato y reversión si falla. */
export function useFollow(userId: string | undefined) {
    const store = useFollows();
    const following = useIsFollowing(userId);
    const ready = useFollowsReady();

    const [busy, setBusy] = useState(false);
     // El ref evita dos peticiones si el usuario toca muy rápido.
    const busyRef = useRef(false);

    const toggle = useCallback(async () => {
    if (!userId || busyRef.current) return;

    busyRef.current = true;
    setBusy(true);

    const previous = store.isFollowing(userId);
    store.setFollowing(userId, !previous);

    try {
        if (previous) await unfollowUser(userId);
        else await followUser(userId);
    } catch (error) {
        store.setFollowing(userId, previous);
        Alert.alert(
            'Error',
            error instanceof Error ? error.message : 'No se pudo actualizar el seguimiento.',
        );
    } finally {
        busyRef.current = false;
        setBusy(false);
    }
    }, [userId, store]);

    return { following, busy, ready, toggle };
}