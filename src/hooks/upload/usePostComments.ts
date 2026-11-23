
import { useCallback, useEffect, useState } from 'react';
import {
  getComments,
  addComment,
  updateComment,
  deleteComment,
  type PostComment,
} from '../../api/posts';

export function usePostComments(postId: string) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    if (!postId) return;
    
    try {
      setError(null);
      const data = await getComments(postId);
      setComments(data);
    } catch {
      setError('No se pudieron cargar los comentarios.');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const createComment = async (content: string) => {
    if (!content.trim() || sending) return;

    try {
      setSending(true);
      const comment = await addComment(postId, content.trim());
      setComments((current) => [...current, comment]);
      return true;
    } catch {
      setError('No se pudo publicar el comentario.');
      return false;
    } finally {
      setSending(false);
    }
  };

  const editComment = async (commentId: string, content: string) => {
    if (!content.trim()) return false;

    try {
      await updateComment(postId, commentId, content.trim());

      setComments((current) =>
        current.map((comment) =>
          comment.id === commentId
            ? { ...comment, content: content.trim() }
            : comment,
        ),
      );

      return true;
    } catch {
      setError('No se pudo actualizar el comentario.');
      return false;
    }
  };

  const removeComment = async (commentId: string) => {
    try {
      await deleteComment(postId, commentId);

      setComments((current) =>
        current.filter((comment) => comment.id !== commentId),
      );

      return true;
    } catch {
      setError('No se pudo eliminar el comentario.');
      return false;
    }
  };

  return {
    comments,
    loading,
    sending,
    error,
    createComment,
    editComment,
    removeComment,
    loadComments,
  };
}
