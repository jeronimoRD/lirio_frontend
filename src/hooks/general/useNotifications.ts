import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import {
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../api/notifications';
import type { Notification } from '../../types';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadedOnce = useRef(false);

  const load = useCallback(async () => {
    if (!loadedOnce.current) {
      setLoading(true);
    }
    setError(null);

    try {
      setNotifications(await getNotifications());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las notificaciones');
    } finally {
      loadedOnce.current = true;
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const markRead = useCallback(
    (id: string) => {
      const target = notifications.find((item) => item.id === id);

      if (!target || target.isRead) return;

      setNotifications((current) =>
        current.map((item) => (item.id === id ? { ...item, isRead: true } : item))
      );

      markNotificationRead(id).catch((err) => {
        setError(err instanceof Error ? err.message : 'No se pudo marcar como leída');
        setNotifications((current) =>
          current.map((item) => (item.id === id ? { ...item, isRead: false } : item))
        );
      });
    },
    [notifications]
  );

  const markAllRead = useCallback(async () => {
    setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));

    try {
      await markAllNotificationsRead();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron marcar como leídas');
      await load();
    }
  }, [load]);

  const remove = useCallback(
    async (id: string) => {
      const previous = notifications;

      setNotifications((current) => current.filter((item) => item.id !== id));

      try {
        await deleteNotification(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo eliminar la notificación');
        setNotifications(previous);
      }
    },
    [notifications]
  );

  return {
    notifications,
    loading,
    refreshing,
    error,
    refresh,
    markRead,
    markAllRead,
    remove,
  };
}
