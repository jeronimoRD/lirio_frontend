import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, X } from 'lucide-react-native';

import {
  createUser,
  deleteUser,
  getAdminUsers,
  updateUserRole,
} from '../../src/api/admin';
import Button from '../../src/components/Button';
import ConfirmModal from '../../src/components/ConfirmModal';
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
  USER: { label: 'Usuario', className: 'bg-[#F4EEE7] text-[#6E6B68]' },
  ADMIN: { label: 'Admin', className: 'bg-[#4A3728]/10 text-[#4A3728]' },
};

const cardShadow = {
  shadowColor: 'rgba(92, 75, 54, 0.10)',
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 12,
  shadowOpacity: 1,
  elevation: 2,
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
  const insets = useSafeAreaInsets();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [newRole, setNewRole] = useState<Role>('USER');
  const [submitting, setSubmitting] = useState(false);

  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<User | null>(null);
  const [pendingCreate, setPendingCreate] = useState<CreateForm | null>(null);
  const [query, setQuery] = useState('');

  const filteredUsers = users.filter((user) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q)
    );
  });

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

  const requestCreate = () => {
    handleSubmit((data) => setPendingCreate(data))();
  };

  const onCreate = async () => {
    if (!pendingCreate) return;

    const data = pendingCreate;
    setPendingCreate(null);
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
    if (busyId || user.id === me?.id) return;

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

  const onRequestDelete = (user: User) => {
    if (busyId || user.id === me?.id) return;

    setPendingDelete(user);
  };

  const onDelete = async () => {
    if (!pendingDelete || busyId) return;

    const target = pendingDelete;
    setPendingDelete(null);
    setBusyId(target.id);
    setError(null);

    try {
      await deleteUser(target.id);
      setUsers((current) => current.filter((u) => u.id !== target.id));
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
      className="flex-1 bg-[#FCFAF8]"
      contentContainerClassName="px-5 py-8"
      contentContainerStyle={{ paddingBottom: 32 + insets.bottom }}
    >
      <View className="mx-auto w-full max-w-md">
        <View className="mb-6 flex-row items-center gap-2">
          <Text className="text-[22px] font-bold uppercase tracking-wide text-[#292724]">
            Usuarios
          </Text>
          <View className="rounded-full bg-[#4A3728] px-2 py-0.5">
            <Text className="text-[10px] font-bold uppercase tracking-wider text-white">
              Admin
            </Text>
          </View>
        </View>

        {error && (
          <View className="mb-4 rounded-2xl bg-red-50 p-4">
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

        {!showCreate && (
          <View className="mt-4 h-12 flex-row items-center gap-2 rounded-full border border-[#EAE6E1] bg-white px-4">
            <Search size={18} color="#A09B95" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar usuario por nombre o correo..."
              placeholderTextColor="#A09B95"
              className="flex-1 text-sm text-[#292724]"
              autoCapitalize="none"
              returnKeyType="search"
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')} hitSlop={8}>
                <X size={16} color="#A09B95" />
              </Pressable>
            )}
          </View>
        )}

        {showCreate && (
          <View className="mt-4 rounded-2xl bg-white p-5" style={cardShadow}>
            <View className="gap-4">
              <Field
                control={control}
                name="name"
                label="Nombre de usuario"
                placeholder="lirio_secret"
                labelClassName="text-xs font-semibold uppercase text-[#6E6B68]"
                inputWrapperClassName="h-12 flex-row items-center rounded-xl border border-[#EAE6E1] bg-[#FCFAF8] px-4"
                inputClassName="flex-1 text-sm text-[#292724]"
                maxLength={50}
                rules={{
                  required: 'Escribe un nombre',
                  minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                  maxLength: { value: 50, message: 'Máximo 50 caracteres' },
                }}
              />
              <Field
                control={control}
                name="email"
                label="Correo electrónico"
                keyboardType="email-address"
                placeholder="nombre@correo.com"
                labelClassName="text-xs font-semibold uppercase text-[#6E6B68]"
                inputWrapperClassName="h-12 flex-row items-center rounded-xl border border-[#EAE6E1] bg-[#FCFAF8] px-4"
                inputClassName="flex-1 text-sm text-[#292724]"
                maxLength={100}
                rules={{
                  required: 'Escribe un correo',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Correo inválido' },
                  maxLength: { value: 100, message: 'Máximo 100 caracteres' },
                }}
              />
              <Field
                control={control}
                name="password"
                label="Contraseña"
                secureTextEntry
                placeholder="••••••••"
                labelClassName="text-xs font-semibold uppercase text-[#6E6B68]"
                inputWrapperClassName="h-12 flex-row items-center rounded-xl border border-[#EAE6E1] bg-[#FCFAF8] px-4"
                inputClassName="flex-1 text-sm text-[#292724]"
                maxLength={128}
                rules={{
                  required: 'Escribe una contraseña',
                  minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                  maxLength: { value: 128, message: 'Máximo 128 caracteres' },
                }}
              />

              <View className="gap-2">
                <Text className="text-xs font-semibold uppercase text-[#6E6B68]">
                  Rol
                </Text>
                <View className="flex-row gap-2">
                  {ROLES.map((role) => {
                    const selected = role === newRole;
                    return (
                      <Pressable
                        key={role}
                        onPress={() => setNewRole(role)}
                        className={`flex-1 items-center rounded-xl border px-3 py-3 active:opacity-80 ${
                          selected
                            ? 'border-[#4A3728] bg-[#4A3728]'
                            : 'border-[#EAE6E1] bg-white'
                        }`}
                      >
                        <Text
                          className={`text-sm font-semibold ${
                            selected ? 'text-white' : 'text-[#6E6B68]'
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
                onPress={requestCreate}
                disabled={submitting}
                className="bg-[#4A3728]"
              />
            </View>
          </View>
        )}

        {loading && (
          <View className="items-center py-10">
            <ActivityIndicator color="#4A3728" />
          </View>
        )}

        {!loading && !error && users.length === 0 && (
          <View className="mt-4 rounded-2xl bg-white p-6" style={cardShadow}>
            <Text className="text-center text-sm text-[#6E6B68]">
              No hay usuarios registrados.
            </Text>
          </View>
        )}

        {!loading &&
          !error &&
          users.length > 0 &&
          filteredUsers.length === 0 && (
            <View className="mt-4 rounded-2xl bg-white p-6" style={cardShadow}>
              <Text className="text-center text-sm text-[#6E6B68]">
                No se encontraron usuarios para {`"${query}"`}.
              </Text>
            </View>
          )}

        {!loading &&
          filteredUsers.map((user) => {
            const role = ROLE_STYLE[user.role];
            const isMe = user.id === me?.id;

            return (
              <View
                key={user.id}
                className="mt-4 rounded-2xl bg-white p-5"
                style={cardShadow}
              >
                <View className="flex-row items-center gap-3">
                  <View className="h-11 w-11 items-center justify-center rounded-full bg-[#4A3728]">
                    <Text className="text-sm font-bold text-white">
                      {initialsOf(user.name)}
                    </Text>
                  </View>

                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-base font-semibold text-[#292724]">
                        {user.name}
                      </Text>
                      {isMe && (
                        <Text className="text-xs text-[#A09B95]">(tú)</Text>
                      )}
                    </View>
                    <Text className="mt-0.5 text-sm text-[#6E6B68]">
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
                      text={busyId === user.id ? 'Eliminando...' : 'Eliminar'}
                      danger
                      onPress={() => onRequestDelete(user)}
                      disabled={busyId !== null || isMe}
                    />
                  </View>
                </View>
              </View>
            );
          })}
      </View>

      <ConfirmModal
        visible={pendingCreate !== null}
        title="¿Crear usuario?"
        message={`Se creará la cuenta "${pendingCreate?.name ?? ''}" con el rol ${
          newRole === 'ADMIN' ? 'admin' : 'usuario'
        }.`}
        confirmLabel="Crear"
        loading={submitting}
        onConfirm={onCreate}
        onCancel={() => setPendingCreate(null)}
      />

      <ConfirmModal
        visible={pendingDelete !== null}
        title="¿Eliminar usuario?"
        message={`Se eliminará la cuenta "${pendingDelete?.name ?? ''}" de forma permanente.`}
        confirmLabel="Eliminar"
        danger
        loading={busyId !== null}
        onConfirm={onDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </ScrollView>
  );
}