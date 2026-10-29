import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, X } from 'lucide-react-native';

import AdminBrandHeader from './AdminBrandHeader';
import Button from '../Button';
import ConfirmModal from '../ConfirmModal';
import Field from '../Field';
import type { Role } from '../../types';
import { ROLES } from '../../types';
import { adminColors, cardShadow } from '../../constants/theme';
import { initialsOf } from '../../utils/strings';
import { useAdminUsers } from '../../hooks/admin/useAdminUsers';

const ROLE_STYLE: Record<Role, { label: string; className: string }> = {
  USER: { label: 'Usuario', className: 'bg-icon-well text-ink-secondary' },
  ADMIN: { label: 'Admin', className: 'bg-admin-brown/10 text-admin-brown' },
};

export default function AdminUsers({ showHeader = true }: { showHeader?: boolean }) {
  const insets = useSafeAreaInsets();
  const [searchFocused, setSearchFocused] = useState(false);
  const {
    meId,
    users,
    filteredUsers,
    loading,
    error,
    showCreate,
    newRole,
    setNewRole,
    submitting,
    busyId,
    pendingDelete,
    pendingCreate,
    query,
    setQuery,
    control,
    toggleCreate,
    requestCreate,
    onCreate,
    onToggleRole,
    requestDelete,
    onDelete,
    cancelCreate,
    cancelDelete,
  } = useAdminUsers();

  const emptyContent = loading ? (
    <View className="items-center py-10">
      <ActivityIndicator color={adminColors.brown} />
    </View>
  ) : !error && users.length === 0 ? (
    <View className="mt-4 rounded-2xl bg-white p-6" style={cardShadow}>
      <Text className="text-center text-sm text-ink-secondary">No hay usuarios registrados.</Text>
    </View>
  ) : !error && users.length > 0 && filteredUsers.length === 0 ? (
    <View className="mt-4 rounded-2xl bg-white p-6" style={cardShadow}>
      <Text className="text-center text-sm text-ink-secondary">
        No se encontraron usuarios para {`"${query}"`}.
      </Text>
    </View>
  ) : undefined;

  return (
    <View className="flex-1 bg-screen">
      {showHeader && <AdminBrandHeader title="Usuarios" />}
      <FlatList
        data={loading ? [] : filteredUsers}
        keyExtractor={(user) => user.id}
        className="flex-1"
        contentContainerClassName="px-5 pb-8"
        contentContainerStyle={{ paddingTop: 24, paddingBottom: 94 + insets.bottom }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View className="mx-auto w-full max-w-md">
            <View className="mb-6">
              <Text className="font-['Lora-Italic'] text-[28px] leading-9 text-admin-ink">
                Usuarios
              </Text>
            </View>

            {error && (
              <View className="mb-4 rounded-2xl bg-red-50 p-4">
                <Text className="text-center text-sm font-medium text-red-700">{error}</Text>
              </View>
            )}

            <Button
              text={showCreate ? 'Cancelar' : 'Nuevo usuario'}
              secondary
              textClassName="text-sm font-semibold text-ink"
              className="rounded-2xl border border-line bg-white"
              onPress={toggleCreate}
            />

            {!showCreate && (
              <View
                className="mt-4 h-12 flex-row items-center gap-2 rounded-full border border-line bg-white px-4"
                style={searchFocused ? { borderColor: adminColors.brand } : undefined}>
                <Search size={18} color={adminColors.faint} />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Buscar usuario por nombre o correo..."
                  placeholderTextColor={adminColors.faint}
                  className="flex-1 text-sm text-ink"
                  autoCapitalize="none"
                  returnKeyType="search"
                />
                {query.length > 0 && (
                  <Pressable onPress={() => setQuery('')} hitSlop={8}>
                    <X size={16} color={adminColors.faint} />
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
                    labelClassName="text-xs font-semibold uppercase text-ink-secondary"
                    inputWrapperClassName="h-12 flex-row items-center rounded-xl border border-line bg-screen px-4"
                    inputClassName="flex-1 text-sm text-ink"
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
                    labelClassName="text-xs font-semibold uppercase text-ink-secondary"
                    inputWrapperClassName="h-12 flex-row items-center rounded-xl border border-line bg-screen px-4"
                    inputClassName="flex-1 text-sm text-ink"
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
                    labelClassName="text-xs font-semibold uppercase text-ink-secondary"
                    inputWrapperClassName="h-12 flex-row items-center rounded-xl border border-line bg-screen px-4"
                    inputClassName="flex-1 text-sm text-ink"
                    maxLength={128}
                    rules={{
                      required: 'Escribe una contraseña',
                      minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                      maxLength: { value: 128, message: 'Máximo 128 caracteres' },
                    }}
                  />

                  <View className="gap-2">
                    <Text className="text-xs font-semibold uppercase text-ink-secondary">Rol</Text>
                    <View className="flex-row gap-2">
                      {ROLES.map((role) => {
                        const selected = role === newRole;
                        return (
                          <Pressable
                            key={role}
                            onPress={() => setNewRole(role)}
                            className={`flex-1 items-center rounded-xl border px-3 py-3 active:opacity-80 ${
                              selected ? 'border-admin-brown bg-admin-brown' : 'border-line bg-white'
                            }`}>
                            <Text
                              className={`text-sm font-semibold ${
                                selected ? 'text-white' : 'text-ink-secondary'
                              }`}>
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
                    className="rounded-2xl bg-admin-brown"
                  />
                </View>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          emptyContent && <View className="mx-auto w-full max-w-md">{emptyContent}</View>
        }
        renderItem={({ item: user }) => {
          const role = ROLE_STYLE[user.role];
          const isMe = user.id === meId;

          return (
            <View className="mx-auto w-full max-w-md">
              <View className="mt-4 rounded-2xl bg-white p-5" style={cardShadow}>
                <View className="flex-row items-center gap-3">
                  <View className="h-11 w-11 items-center justify-center rounded-full bg-admin-brown">
                    <Text className="text-sm font-bold text-white">{initialsOf(user.name)}</Text>
                  </View>

                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-base font-semibold text-ink">{user.name}</Text>
                      {isMe && <Text className="text-xs text-ink-muted">(tú)</Text>}
                    </View>
                    <Text className="mt-0.5 text-sm text-ink-secondary">{user.email}</Text>
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
                        textClassName="text-sm font-semibold text-ink"
                        className="rounded-2xl border border-line bg-white"
                        onPress={() => onToggleRole(user)}
                        disabled={busyId !== null || isMe}
                      />
                    ) : null}
                  </View>

                  <View className="flex-1">
                    <Pressable
                      onPress={() => requestDelete(user)}
                      disabled={busyId !== null || isMe}
                      className="h-12 flex-row items-center justify-center gap-2 rounded-2xl border border-admin-danger-line bg-admin-danger-bg active:opacity-80 disabled:opacity-50">
                      <Text className="text-[13px] font-semibold text-admin-danger">
                        {busyId === user.id ? 'Eliminando...' : 'Eliminar'}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
      />

      <ConfirmModal
        visible={pendingCreate !== null}
        title="¿Crear usuario?"
        message={`Se creará la cuenta "${pendingCreate?.name ?? ''}" con el rol ${
          newRole === 'ADMIN' ? 'admin' : 'usuario'
        }.`}
        confirmLabel="Crear"
        loading={submitting}
        onConfirm={onCreate}
        onCancel={cancelCreate}
      />

      <ConfirmModal
        visible={pendingDelete !== null}
        title="¿Eliminar usuario?"
        message={`Se eliminará la cuenta "${pendingDelete?.name ?? ''}" de forma permanente.`}
        confirmLabel="Eliminar"
        danger
        loading={busyId !== null}
        onConfirm={onDelete}
        onCancel={cancelDelete}
      />
    </View>
  );
}
