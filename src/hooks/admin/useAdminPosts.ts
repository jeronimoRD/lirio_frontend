import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { getAdminUsers } from '../../api/admin';
import { deletePost, getPosts } from '../../api/posts';
import type { Post, User } from '../../types';

export function useAdminPosts() {
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [usersById, setUsersById] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Post | null>(null);

  useEffect(() => {
    Promise.all([getPosts(), getAdminUsers()])
      .then(([loadedPosts, loadedUsers]) => {
        setPosts(loadedPosts);
        setUsersById(Object.fromEntries(loadedUsers.map((user) => [user.id, user])));
        setError(null);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'No se pudieron cargar las publicaciones')
      )
      .finally(() => setLoading(false));
  }, []);

  const onDelete = async () => {
    const target = pendingDelete;

    if (!target || busyId !== null) return;

    setPendingDelete(null);
    setBusyId(target.id);
    setError(null);

    try {
      await deletePost(target.id);
      setPosts((current) => current.filter((post) => post.id !== target.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar la publicación');
    } finally {
      setBusyId(null);
    }
  };

  const requestDelete = (post: Post) => setPendingDelete(post);

  const cancelDelete = () => setPendingDelete(null);

  const openPost = (post: Post) =>
    router.push({ pathname: '/(upload)/[id]', params: { id: post.id } });

  return {
    posts,
    usersById,
    loading,
    error,
    busyId,
    pendingDelete,
    requestDelete,
    cancelDelete,
    onDelete,
    openPost,
  };
}
