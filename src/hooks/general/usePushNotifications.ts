import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { savePushToken } from '../../api/notifications';

// Sin esto, un aviso que llega con la app abierta no se muestra.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Devuelve el ExpoPushToken de este teléfono, o null si no se puede: web,
 * permiso negado o Expo Go en Android (desde el SDK 53 no trae push; hace
 * falta un development build o el APK).
 */
async function requestPushToken(): Promise<string | null> {
  if (Platform.OS === 'web') return null;

  // Android 13+: el canal debe existir antes de pedir permiso, o el diálogo
  // del sistema no aparece.
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Avisos de Hibirio',
      importance: AndroidImportance.MAX,
    });
  }

  let { status } = await Notifications.getPermissionsAsync();

  if (status !== 'granted') {
    ({ status } = await Notifications.requestPermissionsAsync());
  }

  if (status !== 'granted') return null;

  // El projectId de EAS (app.json -> extra.eas.projectId) dice a qué app
  // pertenece el token.
  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

  return (await Notifications.getExpoPushTokenAsync({ projectId })).data;
}

/** Pide permiso y registra este teléfono en el servidor. */
export async function registerThisDevice(): Promise<boolean> {
  const pushToken = await requestPushToken();

  if (!pushToken) return false;

  await savePushToken(pushToken);

  return true;
}

/** Deja de enviar avisos a este teléfono. */
export async function unregisterThisDevice(): Promise<void> {
  await savePushToken(null);
}

/**
 * Se usa una vez en el layout raíz:
 *  - al iniciar sesión registra el teléfono en el servidor;
 *  - al tocar un aviso abre el post (o la bandeja si el evento no tiene post).
 *    `useLastNotificationResponse` cubre también la app cerrada: el toque
 *    espera a que haya sesión y entonces navega.
 */
export function usePushNotifications(signedIn: boolean): void {
  useEffect(() => {
    if (!signedIn) return;

    // Sin avisos la app sigue sirviendo: se informa y se sigue. Nunca se
    // imprime el token, identifica al teléfono.
    registerThisDevice().catch((failure: Error) =>
      console.warn('Notificaciones push no disponibles:', failure.message)
    );
  }, [signedIn]);

  const response = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (!signedIn || !response) return;

    const data = response.notification.request.content.data ?? {};
    const postId = typeof data.postId === 'string' ? data.postId : null;

    // Se consume: si no, volvería a navegar en el siguiente inicio.
    void Notifications.clearLastNotificationResponseAsync();

    router.push(postId ? `/${postId}` : '/notifications');
  }, [response, signedIn]);
}
