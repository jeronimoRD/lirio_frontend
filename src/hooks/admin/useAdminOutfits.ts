import { useEffect, useState } from 'react';

import { getAdminUsers } from '../../api/admin';
import { deleteAdminOutfit, getAdminOutfits } from '../../api/outfits';
import type { Outfit, User } from '../../types';

export function useAdminOutfits() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [usersById, setUsersById] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Outfit | null>(null);

  useEffect(() => {
    Promise.all([getAdminOutfits(), getAdminUsers()])
      .then(([loadedOutfits, loadedUsers]) => {
        setOutfits(loadedOutfits);
        setUsersById(Object.fromEntries(loadedUsers.map((user) => [user.id, user])));
        setError(null);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'No se pudieron cargar los outfits')
      )
      .finally(() => setLoading(false));
  }, []);

  const requestDelete = (outfit: Outfit) => setPendingDelete(outfit);
  const cancelDelete = () => setPendingDelete(null);

  const onDelete = async () => {
    const target = pendingDelete;

    if (!target || busyId !== null) return;

    setPendingDelete(null);
    setBusyId(target.id);
    setError(null);

    try {
      await deleteAdminOutfit(target.id);
      setOutfits((current) => current.filter((outfit) => outfit.id !== target.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el outfit');
    } finally {
      setBusyId(null);
    }
  };

  return {
    outfits,
    usersById,
    loading,
    error,
    busyId,
    pendingDelete,
    requestDelete,
    cancelDelete,
    onDelete,
  };
}
