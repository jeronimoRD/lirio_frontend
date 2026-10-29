import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { createOutfit, getOutfit, updateOutfit } from '../../api/outfits';
import { getMyPosts, getSavedPosts } from '../../api/posts';
import { useSession } from '../../session/context';
import {
  GARMENT_TYPES,
  type GarmentType,
  type OutfitItem,
  type Post,
} from '../../types';

type OutfitFormValues = {
  name: string;
};

export type OutfitSection = 'name' | 'pieces';

export type PieceSelection = Partial<Record<GarmentType, string>>;

const PIECES_MIN_MESSAGE = 'Elige al menos 2 prendas de tipos distintos.';

export function useOutfitForm({
  onFirstError,
}: {
  onFirstError: (section: OutfitSection) => void;
}) {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const outfitId = id ? String(id) : undefined;

  const router = useRouter();
  const { user } = useSession();

  const { control, handleSubmit, reset } = useForm<OutfitFormValues>({
    defaultValues: { name: '' },
  });

  const [options, setOptions] = useState<Post[]>([]);
  const [selected, setSelected] = useState<PieceSelection>({});
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [piecesError, setPiecesError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    let active = true;

    setLoading(true);
    setLoadError(null);

    Promise.all([
      getMyPosts(),
      getSavedPosts(),
      outfitId ? getOutfit(outfitId) : Promise.resolve(null),
    ])
      .then(([all, saved, outfit]) => {
        if (!active) return;

        const byId = new Map<string, Post>();

        for (const post of [...all, ...saved]) {
          byId.set(post.id, post);
        }

        setOptions([...byId.values()].filter((post) => !!post.garmentType));

        if (outfit) {
          reset({ name: outfit.name });
          setIsPublic(outfit.isPublic);
          setSelected(
            outfit.items
              .filter((item: OutfitItem) => item.isAvailable)
              .reduce<PieceSelection>(
                (acc, item) => ({ ...acc, [item.garmentType]: item.postId }),
                {},
              ),
          );
        }
      })
      .catch((err) => {
        if (active) {
          setLoadError(err instanceof Error ? err.message : 'No se pudieron cargar tus prendas');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user?.id, outfitId, reset]);

  const optionsById = useMemo(() => {
    const map = new Map<string, Post>();

    for (const post of options) {
      map.set(post.id, post);
    }

    return map;
  }, [options]);

  const togglePiece = (post: Post) => {
    const type = post.garmentType;

    if (!type) return;

    setSelected((current) => {
      const next = { ...current };

      if (next[type] === post.id) {
        delete next[type];
      } else {
        next[type] = post.id;
      }

      return next;
    });

    setPiecesError(null);
  };

  const previewItems: OutfitItem[] = GARMENT_TYPES.flatMap((type) => {
    const post = selected[type] ? optionsById.get(selected[type]!) : undefined;

    if (!post) return [];

    return [
      {
        postId: post.id,
        garmentType: type,
        title: post.title,
        image: post.image,
        isAvailable: true,
      },
    ];
  });

  const selectedPostIds = () =>
    GARMENT_TYPES.map((type) => selected[type]).filter(
      (postId): postId is string => !!postId,
    );

  const onSubmit = handleSubmit(
    async (values) => {
      const postIds = selectedPostIds();

      if (postIds.length < 2) {
        setPiecesError(PIECES_MIN_MESSAGE);
        onFirstError('pieces');
        return;
      }

      setSaving(true);
      setSubmitError(null);

      try {
        const input = {
          name: values.name.trim(),
          isPublic,
          postIds,
        };

        if (outfitId) {
          await updateOutfit(outfitId, input);
        } else {
          await createOutfit(input);
        }

        router.back();
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : 'No se pudo guardar el outfit.');
      } finally {
        setSaving(false);
      }
    },
    () => {
      if (selectedPostIds().length < 2) {
        setPiecesError(PIECES_MIN_MESSAGE);
      }

      onFirstError('name');
    },
  );

  return {
    isEdit: !!outfitId,
    control,
    options,
    selected,
    togglePiece,
    previewItems,
    isPublic,
    setIsPublic,
    loading,
    loadError,
    piecesError,
    submitError,
    saving,
    onSubmit,
    goBack: () => router.back(),
  };
}
