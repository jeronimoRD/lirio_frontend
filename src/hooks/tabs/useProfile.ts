import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { deletePost } from '../../api/posts';
import { useMyContent } from '../../content/context';
import { useSession } from '../../session/context';
import type { Post } from '../../types';

export type GalleryTab = 'outfits' | 'saved';

export function useProfile(active = true) {
    const { user, signOut } = useSession();
    const router = useRouter();
    const { myPosts, outfits, loaded, error, refresh, setMyPosts } = useMyContent();

    const [activeTab, setActiveTab] = useState<GalleryTab>('outfits');
    const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
    if (active) refresh();
    }, [active, refresh]);

    const onDeleteConfirmed = async () => {
    if (!deleteTarget || deleting) return;

    const id = deleteTarget.id;

    setDeleting(true);

    try {
        await deletePost(id);
        setDeleteTarget(null);
        setMyPosts((currentPosts) => currentPosts.filter((post) => post.id !== id));
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

    const showSpinner = !loaded && myPosts.length === 0;

  return {
    user,
    signOut,

    posts: myPosts,
    outfitCount: outfits.length,
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
