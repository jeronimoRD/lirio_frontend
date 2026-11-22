import type { Role, User } from '../types';
import { request } from './client';
import { File } from 'expo-file-system';

interface UserResponse {
  _id: string;
  email: string;
  user_name: string;
  role: Role;
  bio?: string;
  avatar_url?: string;
  banner_url?: string;
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
    avatarUrl: data.avatar_url ?? '',
    bannerUrl: data.banner_url ?? '',
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

function imageForm(uri: string): FormData {
  const formData = new FormData();
  formData.append('image', new File(uri) as any);

  return formData;
}

/** Sube la foto de perfil y devuelve el usuario actualizado. */
export async function uploadAvatar(uri: string): Promise<User> {
  return toUser(
    await request<UserResponse>(
      '/users/me/avatar',
      imageForm(uri),
      'PATCH',
    ),
  );
}

/** Quita la foto de perfil y vuelve a las iniciales. */
export async function removeAvatar(): Promise<void> {
  await request<MessageResponse>('/users/me/avatar', undefined, 'DELETE');
}

/** Sube la foto de portada y devuelve el usuario actualizado. */
export async function uploadBanner(uri: string): Promise<User> {
  return toUser(
    await request<UserResponse>(
      '/users/me/banner',
      imageForm(uri),
      'PATCH',
    ),
  );
}

/** Quita la portada propia y vuelve a la imagen de la última publicación. */
export async function removeBanner(): Promise<void> {
  await request<MessageResponse>('/users/me/banner', undefined, 'DELETE');
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