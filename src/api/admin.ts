import type { Role, User } from '../types';
import { request } from './client';

interface UserResponse {
  _id: string;
  email: string;
  user_name: string;
  role: Role;
  bio?: string;
  preferred_categories?: string[];
  createdAt?: string;
  last_login?: string;
}

interface MessageResponse {
  message: string;
}

function toUser(data: UserResponse): User {
  return {
    id: data._id,
    name: data.user_name,
    email: data.email,
    role: data.role,
    bio: data.bio ?? '',
    preferredCategories: data.preferred_categories ?? [],
    createdAt: data.createdAt,
    lastLogin: data.last_login,
  };
}

/** Lista de todos los usuarios (solo admin). */
export async function getAdminUsers(): Promise<User[]> {
  const data = await request<UserResponse[]>('/users');

  return data.map(toUser);
}

export async function createUser(
  name: string,
  email: string,
  password: string,
  role: Role
): Promise<void> {
  await request<MessageResponse>('/users', {
    email,
    user_name: name,
    password,
    role,
  });
}

export async function updateUserRole(userId: string, role: Role): Promise<void> {
  await request<MessageResponse>(`/users/${userId}`, { role }, 'PATCH');
}

export async function deleteUser(userId: string): Promise<void> {
  await request<MessageResponse>(`/users/${userId}`, undefined, 'DELETE');
}
