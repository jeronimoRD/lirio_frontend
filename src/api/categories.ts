import type { Category } from '../types';
import { request } from './client';

interface CategoryResponse {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface MessageResponse {
  message: string;
}

function toCategory(data: CategoryResponse): Category {
  return {
    id: data._id,
    name: data.name,
  };
}

export async function getCategories(): Promise<Category[]> {
  const data = await request<CategoryResponse[]>('/categories');

  return data.map(toCategory);
}

export async function createCategory(name: string): Promise<Category> {
  return toCategory(await request<CategoryResponse>('/categories', { name }));
}

export async function updateCategory(
  id: string,
  name: string,
): Promise<Category> {
  return toCategory(
    await request<CategoryResponse>(`/categories/${id}`, { name }, 'PATCH'),
  );
}

export async function deleteCategory(id: string): Promise<void> {
  await request<MessageResponse>(`/categories/${id}`, undefined, 'DELETE');
}