import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { getPost, updatePost } from '../../api/posts';

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

    useEffect(() => {
        async function loadPost() {
        if (!id) return;

        try {
        const post = await getPost(id);

        reset({ title: post.title ?? '', description: post.description ?? '' });
        setImage(post.image);
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

    try {
        setSaving(true);

        await updatePost(id, title.trim(), description.trim());

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

    return { control, image, loading, saving, goBack, requestUpdate };
}