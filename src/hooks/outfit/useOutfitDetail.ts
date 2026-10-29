import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { deleteOutfit, getOutfit } from '../../api/outfits';
import { useSession } from '../../session/context';
import type { Outfit } from '../../types';

export function useOutfitDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useSession();

  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    getOutfit(String(id))
      .then((data) => {
        if (active) setOutfit(data);
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'No se pudo cargar el outfit');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const isOwner = !!outfit && !!user && outfit.userId === user.id;

  const onDeleteConfirmed = async () => {
    if (!outfit || deleting) return;

    setDeleting(true);

    try {
      await deleteOutfit(outfit.id);
      setConfirmVisible(false);
      router.back();
    } catch (err) {
      Alert.alert(
        'Error',
        err instanceof Error ? err.message : 'No se pudo eliminar el outfit.',
      );
    } finally {
      setDeleting(false);
    }
  };

  const openPiece = (postId: string) =>
    router.push({
      pathname: '/(upload)/[id]',
      params: { id: postId },
    } as any);

  return {
    outfit,
    loading,
    error,
    isOwner,

    goBack: () => router.back(),
    openPiece,

    confirmVisible,
    deleting,
    askDelete: () => setConfirmVisible(true),
    cancelDelete: () => setConfirmVisible(false),
    onDeleteConfirmed,
  };
}
