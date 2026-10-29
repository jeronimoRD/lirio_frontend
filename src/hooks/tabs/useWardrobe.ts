import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import { deleteOutfit } from '../../api/outfits';
import { useMyContent } from '../../content/context';
import type { Outfit, Post } from '../../types';

export function useWardrobe() {
  const router = useRouter();

  const { myPosts, savedPosts, outfits, loaded, error, refresh, setOutfits } = useMyContent();

  const [deleteTarget, setDeleteTarget] = useState<Outfit | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [garmentTypeId, setGarmentTypeId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const pieces = useMemo(() => {
    const byId = new Map<string, Post>();

    for (const post of [...myPosts, ...savedPosts]) {
      byId.set(post.id, post);
    }

    return [...byId.values()].filter((post) => !!post.garmentTypeId);
  }, [myPosts, savedPosts]);

  const piecesOfType = useMemo(
    () => (garmentTypeId ? pieces.filter((post) => post.garmentTypeId === garmentTypeId) : []),
    [pieces, garmentTypeId],
  );

  const visibleOutfits = useMemo(() => {
    const q = query.trim().toLowerCase();

    return outfits.filter(
      (outfit) =>
        (!selectedPostId || outfit.items.some((item) => item.postId === selectedPostId)) &&
        (!q || outfit.name.toLowerCase().includes(q)),
    );
  }, [outfits, selectedPostId, query]);

  const selectGarmentType = (typeId: string) => {
    setSelectedPostId(null);
    setGarmentTypeId((current) => (current === typeId ? null : typeId));
  };

  const togglePiece = (post: Post) => {
    setSelectedPostId((current) => (current === post.id ? null : post.id));
  };

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
    outfits: visibleOutfits,
    totalOutfits: outfits.length,
    loading: !loaded,
    error,
    garmentTypeId,
    selectGarmentType,
    piecesOfType,
    selectedPostId,
    togglePiece,
    query,
    setQuery,
    editOutfit,
    deleteTarget,
    deleting,
    askDelete: (outfit: Outfit) => setDeleteTarget(outfit),
    cancelDelete: () => setDeleteTarget(null),
    onDeleteConfirmed,
  };
}
