import type { Post } from '../types';
import { request } from './client';
import { File } from 'expo-file-system';

interface PostResponse {
  _id: string;
  title: string;
  image: string;
  description: string;
  user_id: string;
  category_id?: string;
  createdAt: string;
  updatedAt: string;
  liked_by?: string[];
  saved_by?: string[];
}

function toPost(data: PostResponse): Post {
  const likedBy = data.liked_by ?? [];
  const savedBy = data.saved_by ?? [];
  return {
    id: data._id,
    title: data.title,
    image: data.image,
    description: data.description,
    userId: data.user_id,
    categoryId: data.category_id,
    createdAt: data.createdAt,
    likesCount: likedBy.length,
    likedBy: likedBy,
    savedBy: savedBy,
  };
}

export async function getPosts(): Promise<Post[]> {
  const data = await request<PostResponse[]>('/posts');

  return data.map(toPost);
}

/**
 * Alias de getPosts para el feed de Home. Hoy trae exactamente lo mismo;
 * si en algún momento el backend agrega un endpoint de feed personalizado
 * (ej. /posts/feed), este es el único lugar que hay que cambiar.
 */
export async function getFeedPosts(): Promise<Post[]> {
  return getPosts();
}

export async function getPost(id: string): Promise<Post> {
  const data = await request<PostResponse>(`/posts/${id}`);

  return toPost(data);
}

export async function toggleLike(postId: string): Promise<{
  message: string;
  liked: boolean;
  likesCount: number;
}> {
  const data = await request<{
    message: string;
    liked: boolean;
    likesCount: number;
  }>(`/posts/${postId}/like`, undefined, 'POST');
  return data;
}

export async function getLikedPosts(): Promise<Post[]> {
  const data = await request<PostResponse[]>('/posts/liked/me');
  return data.map(toPost);
}

export async function toggleSave(postId: string): Promise<{
  message: string;
  saved: boolean;
  savedCount: number;
}> {
  const data = await request<{
    message: string;
    saved: boolean;
    savedCount: number;
  }>(`/posts/${postId}/save`, undefined, 'POST');
  return data;
}

export async function getSavedPosts(): Promise<Post[]> {
  const data = await request<PostResponse[]>('/posts/saved/me');
  return data.map(toPost);
}

export async function createPost(
  title: string,
  description: string,
  imageUri: string,
  categoryId: string,
) {
  const formData = new FormData();

  formData.append('title', title);
  formData.append('description', description);
  formData.append('category_id', categoryId);

  const file = new File(imageUri);

  formData.append('image', file as any);

  return request('/posts', formData, 'POST');
}

export async function updatePost(
  id: string,
  title: string,
  description: string,
  image?: string,
): Promise<Post> {
  const data = await request<{ post: PostResponse }>(
    `/posts/${id}`,
    {
      title,
      description,
      ...(image ? { image } : {}),
    },
    'PATCH',
  );

  return toPost(data.post);
}

export async function deletePost(id: string): Promise<void> {
  try {
    await request(`/posts/${id}`, undefined, 'DELETE');
  } catch (error) {
    throw error;
  }
}
