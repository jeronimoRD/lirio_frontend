import { Redirect } from 'expo-router';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { ScrollView, Text, TextInput, View } from 'react-native';

import {
  deleteAccount,
  updatePassword,
  updateProfile,
} from '../src/api/users';
import Button from '../src/components/Button';
import Field from '../src/components/Field';
import { useSession } from '../src/session/context';

type ProfileForm = {
  name: string;
  email: string;
};

type PasswordForm = {
  password: string;
  confirm: string;
};

function messageOf(err: unknown): string {
  return err instanceof Error ? err.message : 'Ocurrió un error inesperado';
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Settings() {
  const { user, signOut, refreshUser } = useSession();

  const profileForm = useForm<ProfileForm>({
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
    },
  });

  const passwordForm = useForm<PasswordForm>({
    defaultValues: {
      password: '',
      confirm: '',
    },
  });

  const newPassword = useWatch({
    control: passwordForm.control,
    name: 'password',
  });

  const [bio, setBio] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [message, setMessage] = useState<{
    kind: 'ok' | 'error';
    text: string;
  } | null>(null);

  if (!user) {
    return <Redirect href="/(login)/login" />;
  }

  const saveProfile = async (data: ProfileForm) => {
    setMessage(null);
    setSavingProfile(true);

    try {
      await updateProfile(data.name.trim(), data.email.trim().toLowerCase());
      await refreshUser();
      setMessage({ kind: 'ok', text: 'Datos actualizados correctamente' });
    } catch (err) {
      setMessage({ kind: 'error', text: messageOf(err) });
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (data: PasswordForm) => {
    setMessage(null);
    setSavingPassword(true);

    try {
      await updatePassword(data.password);
      passwordForm.reset();
      setMessage({ kind: 'ok', text: 'Contraseña actualizada correctamente' });
    } catch (err) {
      setMessage({ kind: 'error', text: messageOf(err) });
    } finally {
      setSavingPassword(false);
    }
  };

  const removeAccount = async () => {
    setMessage(null);
    setDeleting(true);

    try {
      await deleteAccount();
      signOut();
      // signOut deja user en null: el Redirect de arriba lo lleva al login.
    } catch (err) {
      setMessage({ kind: 'error', text: messageOf(err) });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-neutral-50"
      contentContainerClassName="px-6 py-10"
    >
      <View className="mx-auto w-full max-w-md">
        <Text className="mb-6 text-3xl font-bold text-neutral-900">
          Configuración del perfil
        </Text>

        {/* Foto de perfil (solo estética) */}
        <View className="mb-6 items-center rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <View className="relative">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-green-500">
              <Text className="text-2xl font-bold text-white">
                {initialsOf(user.name)}
              </Text>
            </View>

            {/* Insinúa que la foto se puede cambiar */}
            <View className="absolute -bottom-1 -right-1 h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-600">
              <Text className="text-xs font-bold leading-none text-white">
                +
              </Text>
            </View>
          </View>

          <Text className="mt-3 text-sm font-semibold text-blue-600">
            Editar foto de perfil
          </Text>
        </View>

        {/* Bibliografía (solo estética) */}
        <View className="mb-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <Text className="mb-1 font-semibold">Bibliografía</Text>
          <TextInput
            className="min-h-24 rounded-lg border border-neutral-300 p-3"
            placeholder="Cuéntanos algo sobre ti..."
            value={bio}
            onChangeText={setBio}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Datos de la cuenta */}
        <View className="mb-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <Text className="mb-4 text-base font-semibold text-neutral-900">
            Datos de la cuenta
          </Text>

          <View className="gap-4">
            <Field
              control={profileForm.control}
              name="name"
              label="Nombre"
              rules={{
                minLength: {
                  value: 3,
                  message: 'El nombre debe tener al menos 3 caracteres',
                },
              }}
            />

            <Field
              control={profileForm.control}
              name="email"
              label="Correo electrónico"
              keyboardType="email-address"
              rules={{
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Ingresa un correo válido',
                },
              }}
            />

            <Button
              text={savingProfile ? 'Guardando...' : 'Guardar cambios'}
              onPress={profileForm.handleSubmit(saveProfile)}
              disabled={savingProfile}
            />
          </View>
        </View>

        {/* Contraseña */}
        <View className="mb-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <Text className="mb-4 text-base font-semibold text-neutral-900">
            Contraseña
          </Text>

          <View className="gap-4">
            <Field
              control={passwordForm.control}
              name="password"
              label="Contraseña nueva"
              secureTextEntry
              rules={{
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres',
                },
              }}
            />

            <Field
              control={passwordForm.control}
              name="confirm"
              label="Confirmar contraseña"
              secureTextEntry
              rules={{
                validate: (value) =>
                  value === newPassword || 'Las contraseñas no coinciden',
              }}
            />

            <Button
              text={savingPassword ? 'Actualizando...' : 'Cambiar contraseña'}
              onPress={passwordForm.handleSubmit(savePassword)}
              disabled={savingPassword}
            />
          </View>
        </View>

        {/* Zona de peligro */}
        <View className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
          <Text className="mb-2 text-base font-semibold text-red-900">
            Zona de peligro
          </Text>

          <Text className="mb-4 text-sm text-red-700">
            Al eliminar tu cuenta se borrarán también tus publicaciones. Esta
            acción no se puede deshacer.
          </Text>

          {confirmingDelete ? (
            <View className="gap-3">
              <Button
                text={deleting ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
                danger
                onPress={removeAccount}
                disabled={deleting}
              />
              <Button
                text="Cancelar"
                secondary
                onPress={() => setConfirmingDelete(false)}
                disabled={deleting}
              />
            </View>
          ) : (
            <Button
              text="Eliminar cuenta"
              danger
              onPress={() => setConfirmingDelete(true)}
            />
          )}
        </View>

        {/* Mensajes de resultado */}
        {message && (
          <View
            className={`rounded-xl border p-4 ${
              message.kind === 'ok'
                ? 'border-green-200 bg-green-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            <Text
              className={`text-center text-sm font-medium ${
                message.kind === 'ok' ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {message.text}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}