import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { getPosts, deletePost } from '../../api/posts';
import { useSession } from '../../session/context';
import type { Post } from '../../types';

export type GalleryTab = 'outfits' | 'saved';

export function useProfile(active = true) {
    const { user, signOut } = useSession();
    const router = useRouter();

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<GalleryTab>('outfits');
    const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
    if (!active || !user) return;

    let cancelled = false;

    const load = async () => {
        setLoading(true);
        setError(null);

        try {
            const all = await getPosts();
            if (cancelled) return;
            setPosts(all.filter((post) => post.userId === user.id));
        } catch (err) {
            if (cancelled) return;
            setError(err instanceof Error ? err.message : 'No se pudieron cargar tus publicaciones');
        } finally {
            if (!cancelled) setLoading(false);
        }
    };

    load();

    return () => {
        cancelled = true;
        };
    }, [active, user]);

    const onDeleteConfirmed = async () => {
    if (!deleteTarget || deleting) return;

    const id = deleteTarget.id;

    setDeleting(true);

    try {
        await deletePost(id);
        setDeleteTarget(null);
        setPosts((currentPosts) => currentPosts.filter((post) => post.id !== id));
        } catch (err) {
        Alert.alert(
            'Error',
            err instanceof Error ? err.message : 'No se pudo eliminar la publicación.'
        );
        } finally {
        setDeleting(false);
        }
    };

    const goToSettings = () => router.push('/settings');
    const goToEditProfile = () => router.push('/edit-profile' as any);

    const editPost = (post: Post) =>
    router.push({
        pathname: '/(upload)/edit-upload',
        params: { id: post.id },
    } as any);

    const leftColumn = posts.filter((_, i) => i % 2 === 0);
    const rightColumn = posts.filter((_, i) => i % 2 === 1);

    const showSpinner = loading && posts.length === 0;

  return {
    user,
    signOut,

    posts,
    leftColumn,
    rightColumn,
    error,
    showSpinner,

    activeTab,
    setActiveTab,

    goToSettings,
    goToEditProfile,
    editPost,

    deleteTarget,
    deleting,
    askDelete: (post: Post) => setDeleteTarget(post),
    cancelDelete: () => setDeleteTarget(null),
    onDeleteConfirmed,
    };
}