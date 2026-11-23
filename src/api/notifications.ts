import type { Notification, NotificationType } from '../types';
import { request } from './client';

interface NotificationResponse {
  _id: string;
  type: NotificationType;
  message: string;
  post_id?: string;
  is_read: boolean;
  createdAt: string;
  sender?: {
    user_name?: string;
    avatar_url?: string;
  };
}

function toNotification(data: NotificationResponse): Notification {
  return {
    id: data._id,
    type: data.type,
    message: data.message,
    postId: data.post_id,
    isRead: data.is_read,
    createdAt: data.createdAt,
    sender: {
      name: data.sender?.user_name ?? 'Usuario',
      avatarUrl: data.sender?.avatar_url ?? '',
    },
  };
}

export async function getNotifications(): Promise<Notification[]> {
  const data = await request<NotificationResponse[]>('/notifications');

  return data.map(toNotification);
}

/** Avisos sin leer para el badge de la campana. */
export async function getUnreadNotificationsCount(): Promise<number> {
  const data = await request<{ count: number }>('/notifications/unread-count');

  return data.count;
}

export async function markNotificationRead(id: string): Promise<void> {
  await request(`/notifications/${id}/read`, undefined, 'PATCH');
}

export async function markAllNotificationsRead(): Promise<void> {
  await request('/notifications/read-all', undefined, 'PATCH');
}

export async function deleteNotification(id: string): Promise<void> {
  await request(`/notifications/${id}`, undefined, 'DELETE');
}

/** Registra el teléfono que recibe avisos push; null lo da de baja. */
export async function savePushToken(token: string | null): Promise<void> {
  await request('/users/me/push-token', { token }, 'PATCH');
}
