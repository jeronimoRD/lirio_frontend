import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { getPost } from '../../api/posts';
import { getUserById } from '../../api/users';
import { useSession } from '../../session/context';
import type { Post, User } from '../../types';

export function usePostDetail() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user: me } = useSession();

    const [post, setPost] = useState<Post | null>(null);
    const [author, setAuthor] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [reportVisible, setReportVisible] = useState(false);

    useEffect(() => {
        async function loadPost() {
        if (!id) return;

        try {
        const data = await getPost(id);
        setPost(data);

        // El autor se busca aparte: si falla (usuario borrado, etc.) el
        // post igual se muestra, solo sin el nombre de quien lo publicó.
        try {
            const user = await getUserById(data.userId);
            setAuthor(user);
            } catch (error) {
            console.log('ERROR AL CARGAR AUTOR:', error);
            }
        } catch (error) {
            console.log('ERROR AL CARGAR POST:', error);
        } finally {
            setLoading(false);
        }
    }

    loadPost();
    }, [id]);

    const goBack = () => router.back();

    return {
    post,
    author,
    loading,
    goBack,

    liked,
    toggleLike: () => setLiked((v) => !v),

    // Solo se puede reportar una publicación ajena.
    canReport: !!post && post.userId !== me?.id,
    reportVisible,
    openReport: () => setReportVisible(true),
    closeReport: () => setReportVisible(false),
    };
}