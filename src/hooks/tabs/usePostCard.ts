import { useRouter } from 'expo-router';

import type { Post } from '../../types';
import { useEffect, useState } from 'react';
import { toggleLike as toggleLikeApi } from '../../api/posts';
import { useSession } from '../../session/context';
import { useLikes } from '../../likes/context';

/** Lógica de cada tarjeta del feed: navegación al detalle y likes. */
export function usePostCard(post: Post) {
  const router = useRouter();
  const { user } = useSession();
  const { get, setState } = useLikes();
  const cached = get(post.id);

  const initialLiked =
    cached?.liked ??
    post.isLikedByMe ??
    (post.likedBy && user ? post.likedBy.includes(user.id) : false);
  const initialCount = cached?.likesCount ?? post.likesCount ?? 0;

  const [likesCount, setLikesCount] = useState(initialCount);
  const [liked, setLiked] = useState(initialLiked);

  useEffect(() => {
    const c = get(post.id);
    if (c) {
      setLikesCount(c.likesCount);
      setLiked(c.liked);
      return;
    }
    const l = post.isLikedByMe ?? (post.likedBy && user ? post.likedBy.includes(user.id) : false);
    setLikesCount(post.likesCount ?? 0);
    setLiked(l);
    setState(post.id, { likesCount: post.likesCount ?? 0, liked: l });
  }, [post.id, post.likesCount, post.isLikedByMe, post.likedBy, user?.id, get, setState]);

  const handleToggleLike = async () => {
    if (!user) return;
    const prevLiked = liked;
    const prevCount = likesCount;
    const nextLiked = !liked;
    const nextCount = liked ? likesCount - 1 : likesCount + 1;
    setLiked(nextLiked);
    setLikesCount(nextCount);
    setState(post.id, { liked: nextLiked, likesCount: nextCount });
    try {
      const res = await toggleLikeApi(post.id);
      setLiked(res.liked);
      setLikesCount(res.likesCount);
      setState(post.id, { liked: res.liked, likesCount: res.likesCount });
    } catch (e) {
      setLiked(prevLiked);
      setLikesCount(prevCount);
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
