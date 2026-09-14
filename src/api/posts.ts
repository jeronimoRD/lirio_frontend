import type { Post } from '../types';
import { request } from './client';

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