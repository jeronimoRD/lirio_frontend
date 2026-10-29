import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { getPost, updatePost } from '../../api/posts';
import { getCategories } from '../../api/categories';
import type { Category, GarmentType } from '../../types';

export type EditPostForm = {
    title: string;
    description: string;
};

export function useEditPost() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const { control, handleSubmit, reset } = useForm<EditPostForm>({
        defaultValues: { title: '', description: '' },
    });

    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryIds, setCategoryIds] = useState<string[]>([]);
    const [categoryError, setCategoryError] = useState<string | null>(null);
    const [garmentType, setGarmentType] = useState<GarmentType | null>(null);
    const [garmentError, setGarmentError] = useState<string | null>(null);

    const selectGarment = (type: GarmentType) => {
        setGarmentType(type);
        setGarmentError(null);
    };

    const toggleCategory = (categoryId: string) => {
        setCategoryIds((previous) =>
            previous.includes(categoryId)
                ? previous.filter((item) => item !== categoryId)
                : [...previous, categoryId],
        );
        setCategoryError(null);
    };

    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch((error) => console.log('Error cargando estilos:', error));
    }, []);

    useEffect(() => {
        async function loadPost() {
        if (!id) return;

        try {
        const post = await getPost(id);

        reset({ title: post.title ?? '', description: post.description ?? '' });
        setImage(post.image);
        setGarmentType(post.garmentType ?? null);
        setCategoryIds(post.categoryIds);
        } catch (error) {
            Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo cargar el post.');

            router.back();
        } finally {
            setLoading(false);
        }
    }

    loadPost();
    }, [id, reset, router]);

    const goBack = () => {
        if (router.canGoBack()) {
        router.back();
        } else {
        router.replace('/(tabs)/profile');
        }
    };

  const requestUpdate = handleSubmit(async ({ title, description }) => {
    if (!id) return;

    if (categoryIds.length === 0) {
        setCategoryError('Selecciona al menos un estilo.');
        return;
    }

    if (!garmentType) {
        setGarmentError('Selecciona el tipo de prenda.');
        return;
    }

    try {
        setSaving(true);

        await updatePost(id, title.trim(), description.trim(), categoryIds, garmentType);

        router.replace('/(tabs)/profile');
        } catch (error) {
        Alert.alert(
            'Error',
            error instanceof Error ? error.message : 'No se pudo actualizar el post.'
        );
        } finally {
        setSaving(false);
        }
    });

    return {
        control,
        image,
        loading,
        saving,
        goBack,
        requestUpdate,
        categories,
        categoryIds,
        categoryError,
        toggleCategory,
        garmentType,
        garmentError,
        selectGarment,
    };
}
