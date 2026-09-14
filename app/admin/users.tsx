import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useForm } from 'react-hook-form';

import {
  createUser,
  deleteUser,
  getAdminUsers,
  updateUserRole,
} from '../../src/api/admin';
import Button from '../../src/components/Button';
import Field from '../../src/components/Field';
import { useSession } from '../../src/session/context';
import type { Role, User } from '../../src/types';
import { ROLES } from '../../src/types';

type CreateForm = {
  name: string;
  email: string;
  password: string;
};

const ROLE_STYLE: Record<Role, { label: string; className: string }> = {
  USER: { label: 'Usuario', className: 'bg-blue-100 text-blue-700' },
  ADMIN: { label: 'Admin', className: 'bg-amber-100 text-amber-800' },
};

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function AdminUsers() {
  const { user: me } = useSession();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [newRole, setNewRole] = useState<Role>('USER');
  const [submitting, setSubmitting] = useState(false);

  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { control, handleSubmit, reset } = useForm<CreateForm>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const loadUsers = async () => {
    try {
      const data = await getAdminUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudieron cargar los usuarios',
      );
    }
  };

  useEffect(() => {
    getAdminUsers()
      .then((data) => {
        setUsers(data);
        setError(null);
      })
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudieron cargar los usuarios',
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  const onCreate = async (data: CreateForm) => {
    setSubmitting(true);
    setError(null);

    try {
      await createUser(data.name, data.email, data.password, newRole);
      setShowCreate(false);
      reset();
      setNewRole('USER');
      await loadUsers();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo crear el usuario',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onToggleRole = async (user: User) => {
    if (busyId || confirmDeleteId || user.id === me?.id) return;

    const nextRole: Role = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    setBusyId(user.id);
    setError(null);

    try {
      await updateUserRole(user.id, nextRole);
      setUsers((current) =>
        current.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u)),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo cambiar el rol del usuario',
      );
    } finally {
      setBusyId(null);
    }
  };

  const onDeletePress = async (user: User) => {
    if (busyId) return;

    if (confirmDeleteId !== user.id) {
      setConfirmDeleteId(user.id);
      return;
    }

    setBusyId(user.id);
    setConfirmDeleteId(null);
    setError(null);

    try {
      await deleteUser(user.id);
      setUsers((current) => current.filter((u) => u.id !== user.id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo eliminar el usuario',
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-neutral-50"
      contentContainerClassName="px-6 py-8"
    >
      <View className="mx-auto w-full max-w-md">
        <Text className="mb-6 text-3xl font-bold text-neutral-900">
          Usuarios
        </Text>

        {error && (
          <View className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4">
            <Text className="text-center text-sm font-medium text-red-700">
              {error}
            </Text>
          </View>
        )}

        <Button
          text={showCreate ? 'Cancelar' : 'Nuevo usuario'}
          secondary
          onPress={() => setShowCreate((current) => !current)}
        />

        {showCreate && (
          <View className="mt-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <View className="gap-4">
              <Field
                control={control}
                name="name"
                label="Nombre de usuario"
                placeholder="lirio_secret"
                rules={{ required: 'Escribe un nombre' }}
              />
              <Field
                control={control}
                name="email"
                label="Correo electrónico"
                keyboardType="email-address"
                placeholder="nombre@correo.com"
                rules={{ required: 'Escribe un correo' }}
              />
              <Field
                control={control}
                name="password"
                label="Contraseña"
                secureTextEntry
                placeholder="••••••••"
                rules={{ required: 'Escribe una contraseña' }}
              />

              <View className="gap-2">
                <Text className="font-semibold">Rol</Text>
                <View className="flex-row gap-2">
                  {ROLES.map((role) => {
                    const selected = role === newRole;
                    return (
                      <Pressable
                        key={role}
                        onPress={() => setNewRole(role)}
                        className={`flex-1 items-center rounded-xl border px-3 py-3 active:opacity-80 ${
                          selected
                            ? 'border-green-500 bg-green-500'
                            : 'border-neutral-300 bg-white'
                        }`}
                      >
                        <Text
                          className={`text-sm font-semibold ${
                            selected ? 'text-white' : 'text-neutral-700'
                          }`}
                        >
                          {ROLE_STYLE[role].label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <Button
                text={submitting ? 'Creando...' : 'Crear usuario'}
                onPress={handleSubmit(onCreate)}
                disabled={submitting}
              />
            </View>
          </View>
        )}

        {loading && (
          <View className="items-center py-10">
            <ActivityIndicator />
          </View>
        )}

        {!loading && !error && users.length === 0 && (
          <View className="mt-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <Text className="text-center text-sm text-neutral-500">
              No hay usuarios registrados.
            </Text>
          </View>
        )}

        {!loading &&
          users.map((user) => {
            const role = ROLE_STYLE[user.role];
            const isMe = user.id === me?.id;

            return (
              <View
                key={user.id}
                className="mt-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
              >
                <View className="flex-row items-center gap-3">
                  <View className="h-11 w-11 items-center justify-center rounded-full bg-green-500">
                    <Text className="text-sm font-bold text-white">
                      {initialsOf(user.name)}
                    </Text>
                  </View>

                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-base font-semibold text-neutral-900">
                        {user.name}
                      </Text>
                      {isMe && (
                        <Text className="text-xs text-neutral-400">(tú)</Text>
                      )}
                    </View>
                    <Text className="mt-0.5 text-sm text-neutral-500">
                      {user.email}
                    </Text>
                  </View>

                  <View className={`rounded-full px-3 py-1 ${role.className}`}>
                    <Text className="text-xs font-semibold">{role.label}</Text>
                  </View>
                </View>

                <View className="mt-4 flex-row gap-2">
                  <View className="flex-1">
                    {!isMe ? (
                      <Button
                        text={
                          busyId === user.id
                            ? 'Guardando...'
                            : user.role === 'ADMIN'
                              ? 'Quitar admin'
                              : 'Hacer admin'
                        }
                        secondary
                        onPress={() => onToggleRole(user)}
                        disabled={busyId !== null || isMe}
                      />
                    ) : null}
                  </View>

                  <View className="flex-1">
                    <Button
                      text={
                        confirmDeleteId === user.id
                          ? '¿Confirmar?'
                          : busyId === user.id
                            ? 'Eliminando...'
                            : 'Eliminar'
                      }
                      danger
                      onPress={() => onDeletePress(user)}
                      disabled={busyId !== null || isMe}
                    />
                  </View>
                </View>
              </View>
            );
          })}
      </View>
    </ScrollView>
  );
}