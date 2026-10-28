import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import { deleteOutfit, getMyOutfits } from '../../api/outfits';
import type { Outfit } from '../../types';

export function useWardrobe() {
  const router = useRouter();

  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Outfit | null>(null);
  const [deleting, setDeleting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      setLoading(true);
      setError(null);

      getMyOutfits()
        .then((all) => {
          if (active) setOutfits(all);
        })
        .catch((err) => {
          if (active) {
            setError(err instanceof Error ? err.message : 'No se pudo cargar tu ropero');
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => {
        active = false;
      };
    }, []),
  );

  const onDeleteConfirmed = async () => {
    if (!deleteTarget || deleting) return;

    const id = deleteTarget.id;

    setDeleting(true);

    try {
      await deleteOutfit(id);
      setDeleteTarget(null);
      setOutfits((current) => current.filter((outfit) => outfit.id !== id));
    } catch (err) {
      Alert.alert(
        'Error',
        err instanceof Error ? err.message : 'No se pudo eliminar el outfit.',
      );
    } finally {
      setDeleting(false);
    }
  };

  const editOutfit = (outfit: Outfit) =>
    router.push({
      pathname: '/outfit/edit',
      params: { id: outfit.id },
    });

  return {
    outfits,
    loading,
    error,
    editOutfit,
    deleteTarget,
    deleting,
    askDelete: (outfit: Outfit) => setDeleteTarget(outfit),
    cancelDelete: () => setDeleteTarget(null),
    onDeleteConfirmed,
  };
}
