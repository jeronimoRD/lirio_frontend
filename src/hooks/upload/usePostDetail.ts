import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { getPost, toggleLike as toggleLikeApi } from '../../api/posts';
import { getUserById } from '../../api/users';
import { getCategories } from '../../api/categories';
import { useSession } from '../../session/context';
import type { Category, Post, User } from '../../types';
import { useLikes } from '../../likes/context';

export function usePostDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user: me } = useSession();
  const { get, setState } = useLikes();

  const cached = id ? get(id) : undefined;

  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(cached?.liked ?? false);
  const [likesCount, setLikesCount] = useState(cached?.likesCount ?? 0);
  const [reportVisible, setReportVisible] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((error) => console.log('ERROR AL CARGAR ESTILOS:', error));
  }, []);

  const styleNames = (post?.categoryIds ?? [])
    .map((id) => categories.find((category) => category.id === id)?.name)
    .filter((name): name is string => !!name);

  useEffect(() => {
    async function loadPost() {
      if (!id) return;

      try {
        const data = await getPost(id);
        setPost(data);
        const initialLiked =
          data.isLikedByMe ?? (data.likedBy && me ? data.likedBy.includes(me.id) : false);
        const initialCount = data.likesCount ?? 0;
        setLikesCount(initialCount);
        setLiked(initialLiked);
        setState(id, { liked: initialLiked, likesCount: initialCount });

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
  }, [id, me?.id]);

  const goBack = () => router.back();

  const toggleLike = async () => {
    if (!id || !me) return;
    const prevLiked = liked;
    const prevCount = likesCount;
    const nextLiked = !liked;
    const nextCount = liked ? likesCount - 1 : likesCount + 1;
    setLiked(nextLiked);
    setLikesCount(nextCount);
    setState(id, { liked: nextLiked, likesCount: nextCount });
    try {
      const res = await toggleLikeApi(id);
      setLiked(res.liked);
      setLikesCount(res.likesCount);
      setState(id, { liked: res.liked, likesCount: res.likesCount });
    } catch (e) {
      setLiked(prevLiked);
      setLikesCount(prevCount);
      setState(id, { liked: prevLiked, likesCount: prevCount });
    }
  };

  return {
    post,
    styleNames,
    author,
    loading,
    goBack,
    liked,
    likesCount,
    toggleLike,
    // Solo se puede reportar una publicación ajena.
    canReport: !!post && post.userId !== me?.id,
    reportVisible,
    openReport: () => setReportVisible(true),
    closeReport: () => setReportVisible(false),
  };
}
