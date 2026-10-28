
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

import { createPost } from '../../api/posts';
import { getCategories } from '../../api/categories';
import type { Category, GarmentType } from '../../types';

export type CreatePostForm = {
  title: string;
  description: string;
};

export function useCreatePost() {
  const router = useRouter();

  const { control, handleSubmit, getValues } = useForm<CreatePostForm>({
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [garmentType, setGarmentType] = useState<GarmentType | null>(null);
  const [confirm, setConfirm] = useState(false);

  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [garmentError, setGarmentError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        const data = await getCategories();

        if (active) {
          setCategories(data);
        }
      } catch (error) {
        console.log('Error cargando categorías:', error);
      }
    }

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/home');
    }
  };

  const toggleCategory = (id: string) => {
    setCategoryIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );

    setCategoryError(null);
  };

  const selectImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permiso necesario',
          'Necesitas permitir el acceso a tus imágenes.',
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        setImageError(null);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo abrir la galería. Inténtalo de nuevo.',
      );
      console.log('Error seleccionando imagen:', error);
    }
  };

  const selectGarment = (type: GarmentType) => {
    setGarmentType(type);
    setGarmentError(null);
  };

  const requestCreate = handleSubmit(() => {
    setCategoryError(null);
    setGarmentError(null);
    setImageError(null);

    if (categoryIds.length === 0) {
      setCategoryError('Selecciona al menos un estilo.');
      return;
    }

    if (!garmentType) {
      setGarmentError('Selecciona el tipo de prenda.');
      return;
    }

    if (!image) {
      setImageError('Selecciona una imagen.');
      return;
    }

    setConfirm(true);
  });

  const onConfirmCreate = async () => {
    if (loading || categoryIds.length === 0 || !garmentType || !image) {
      return;
    }

    const { title, description } = getValues();

    setLoading(true);

    try {
      await createPost(
        title,
        description,
        image,
        categoryIds,
        garmentType,
      );

      setConfirm(false);
      router.replace('/(tabs)/profile');
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'No se pudo crear la publicación.',
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    control,
    goBack,

    image,
    imageError,
    selectImage,

    categories,
    categoryIds,
    categoryError,
    toggleCategory,

    garmentType,
    garmentError,
    selectGarment,

    loading,
    requestCreate,

    confirm,
    confirmMessage: `Se publicará el outfit "${getValues().title}".`,
    onConfirmCreate,
    cancelConfirm: () => setConfirm(false),
    };
}
