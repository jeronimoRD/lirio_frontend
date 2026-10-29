import { useRouter } from 'expo-router';

import type { Post } from '../../types';
import { useEffect, useMemo } from 'react';
import { toggleLike as toggleLikeApi } from '../../api/posts';
import { useSession } from '../../session/context';
import { useLikes, usePostLikeState } from '../../likes/context';

/** Lógica de cada tarjeta del feed: navegación al detalle y likes. */
export function usePostCard(post: Post) {
  const router = useRouter();
  const { user } = useSession();
  const { get, setState } = useLikes();
  const fallback = useMemo(
    () => ({
      liked: post.isLikedByMe ?? (post.likedBy && user ? post.likedBy.includes(user.id) : false),
      likesCount: post.likesCount ?? 0,
    }),
    [post.isLikedByMe, post.likedBy, post.likesCount, user]
  );
  const { liked, likesCount } = usePostLikeState(post.id, fallback);

  useEffect(() => {
    if (!get(post.id)) setState(post.id, fallback);
  }, [post.id, get, setState, fallback]);

  const handleToggleLike = async () => {
    if (!user) return;
    const prevLiked = liked;
    const prevCount = likesCount;
    const nextLiked = !liked;
    const nextCount = liked ? likesCount - 1 : likesCount + 1;
    setState(post.id, { liked: nextLiked, likesCount: nextCount });
    try {
      const res = await toggleLikeApi(post.id);
      setState(post.id, { liked: res.liked, likesCount: res.likesCount });
    } catch {
      setState(post.id, { liked: prevLiked, likesCount: prevCount });
    }
  };

  return {
    openPost: () =>
      router.push({
        pathname: '/(upload)/[id]',
        params: { id: post.id },
      }),
    liked,
    likesCount,
    toggleLike: handleToggleLike,
  };
}
