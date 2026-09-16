import type { Post } from '../types';
import { request } from './client';
import { File } from 'expo-file-system';

interface PostResponse {
  _id: string;
  title: string;
  image: string;
  description: string;
  user_id: string;
  createdAt: string;
  updatedAt: string;
}

function toPost(data: PostResponse): Post {
  return {
    id: data._id,
    title: data.title,
    image: data.image,
    description: data.description,
    userId: data.user_id,
    createdAt: data.createdAt,
  };
}

export async function getPosts(): Promise<Post[]> {
  const data = await request<PostResponse[]>('/posts');

  return data.map(toPost);
}

export async function createPost(
  title: string,
  description: string,
  imageUri: string,
) {
  const formData = new FormData();

  formData.append('title', title);
  formData.append('description', description);

  const file = new File(imageUri);

  formData.append('image', file as any);

  return request('/posts', formData, 'POST');
}