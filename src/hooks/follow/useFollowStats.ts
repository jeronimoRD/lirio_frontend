import { useCallback, useEffect, useState } from 'react';

import { getFollowStatus } from '../../api/follows';

/** Contadores de seguidores y seguidos de un perfil. */
export function useFollowStats(userId: string | undefined, active = true) {
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    const refresh = useCallback(async () => {
    if (!userId) return;

    try {
        const status = await getFollowStatus(userId);
        setFollowersCount(status.followersCount);
        setFollowingCount(status.followingCount);
    } catch {
      // Si falla se conserva el último número conocido.
    }
    }, [userId]);

  // Se actualiza cada vez que el perfil queda visible.
    useEffect(() => {
        if (active) refresh();
    }, [active, refresh]);

    return { followersCount, followingCount, refresh };
}