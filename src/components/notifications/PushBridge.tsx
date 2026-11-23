import { usePushNotifications } from '../../hooks/general/usePushNotifications';
import { useSession } from '../../session/context';

/** Engancha el registro de push al inicio de sesión. No pinta nada. */
export function PushBridge() {
  const { user } = useSession();

  usePushNotifications(Boolean(user));

  return null;
}
