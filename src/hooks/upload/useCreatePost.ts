import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

import { createPost } from '../../api/posts';
import { getCategories } from '../../api/categories';
import type { Category } from '../../types';

export type CreatePostForm = {
    title: string;
    description: string;
};

export function useCreatePost() {
    const router = useRouter();

    const { control, handleSubmit, getValues } = useForm<CreatePostForm>({
        defaultValues: { title: '', description: '' },
    });

    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [showCategories, setShowCategories] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [categoryError, setCategoryError] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);

    useEffect(() => {
        async function loadCategories() {
        try {
        const data = await getCategories();
        setCategories(data);
        } catch (error) {
            console.log('Error cargando categorías:', error);
        }
        }

        loadCategories();
    }, []);

    const goBack = () => {
        if (router.canGoBack()) {
        router.back();
        } else {
        router.replace('/(tabs)/home');
        }
    };

    const toggleCategories = () => setShowCategories((v) => !v);

    const selectCategory = (item: Category) => {
    setCategory(item);
    setShowCategories(false);
    setCategoryError(null);
    };

    const selectImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
        Alert.alert('Permiso necesario', 'Necesitas permitir el acceso a tus imágenes.');
        return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
    });

    if (!result.canceled) {
        setImage(result.assets[0].uri);
        setImageError(null);
    }
    };

    const requestCreate = handleSubmit(() => {
    setCategoryError(null);
    setImageError(null);

    if (!category) {
        setCategoryError('Selecciona una categoría.');
        return;
    }

    if (!image) {
        setImageError('Selecciona una imagen.');
        return;
    }

    setConfirm(true);
    });

    const onConfirmCreate = async () => {
    if (loading || !category || !image) return;

    const { title, description } = getValues();

    setLoading(true);

    try {
        await createPost(title, description, image, category.id);
        setConfirm(false);
        router.replace('/(tabs)/profile');
        } catch (error) {
        Alert.alert('Error', error instanceof Error ? error.message : 'No se pudo crear el post.');
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
    category,
    categoryError,
    showCategories,
    toggleCategories,
    selectCategory,

    loading,
    requestCreate,

    confirm,
    confirmMessage: `Se publicará el outfit "${getValues().title}".`,
    onConfirmCreate,
    cancelConfirm: () => setConfirm(false),
    };
}