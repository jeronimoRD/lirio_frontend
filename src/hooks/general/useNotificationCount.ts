import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { getUnreadNotificationsCount } from '../../api/notifications';

/** Contador de avisos sin leer para el badge de la campana. */
export function useNotificationCount() {
  const [count, setCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      getUnreadNotificationsCount()
        .then((value) => {
          if (active) setCount(value);
        })
        .catch(() => {});

      return () => {
        active = false;
      };
    }, [])
  );

  return count;
}
