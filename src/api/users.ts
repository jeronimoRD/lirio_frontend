import type { Role, User } from '../types';
import { request } from './client';

interface UserResponse {
  _id: string;
  email: string;
  user_name: string;
  role: Role;
  bio?: string;
  preferred_categories?: string[];
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
  };
}

/** Usuario actual según el token guardado. */
export async function getMe(): Promise<User> {
  return toUser(await request<UserResponse>('/users/me'));
}

/** Busca cuentas por nombre de usuario, correo o bio. */
export async function searchUsers(
  query: string,
  limit = 10,
): Promise<User[]> {
  const data = await request<UserResponse[]>(
    `/users/search?q=${encodeURIComponent(query)}&limit=${limit}`,
  );

  return data.map(toUser);
}

/** Cuentas aleatorias para las sugerencias del buscador. */
export async function suggestUsers(limit = 3): Promise<User[]> {
  const data = await request<UserResponse[]>(
    `/users/suggestions?limit=${limit}`,
  );
  

  return data.map(toUser);
}

/** Un usuario puntual por su id (para mostrar quién publicó un post). */
export async function getUserById(id: string): Promise<User> {
    return toUser(await request<UserResponse>(`/users/${id}/profile`));
  }

export async function updateProfile(
  name: string,
  email: string,
  bio?: string,
): Promise<User> {
  return toUser(
    await request<UserResponse>(
      '/users/me',
      {
        user_name: name,
        email,
        ...(bio !== undefined ? { bio } : {}),
      },
      'PATCH',
    ),
  );
}

export async function updatePassword(newPassword: string): Promise<void> {
  await request<MessageResponse>(
    '/users/me/password',
    {
      new_password: newPassword,
    },
    'PATCH',
  );
}

export async function deleteAccount(): Promise<void> {
  await request<MessageResponse>('/users/me', undefined, 'DELETE');
}