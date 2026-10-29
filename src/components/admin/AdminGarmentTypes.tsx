import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Search, X } from 'lucide-react-native';

import AdminBrandHeader from './AdminBrandHeader';
import Button from '../Button';
import ConfirmModal from '../ConfirmModal';
import { adminColors, cardShadow } from '../../constants/theme';
import { useAdminGarmentTypes } from '../../hooks/admin/useAdminGarmentTypes';

export default function AdminGarmentTypes() {
  const insets = useSafeAreaInsets();
  const [focusedField, setFocusedField] = useState<'new' | 'search' | 'edit' | null>(null);
  const {
    types,
    filteredTypes,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    clearSearch,
    newName,
    changeNewName,
    nameError,
    confirmCreate,
    creating,
    requestCreate,
    onCreate,
    cancelCreate,
    editingId,
    editName,
    setEditName,
    startEdit,
    saveEdit,
    cancelEdit,
    busyId,
    confirmDeleteId,
    requestDelete,
    onDelete,
    cancelDelete,
    maxNameLength,
    goBack,
  } = useAdminGarmentTypes();

  return (
    <View className="flex-1 bg-screen">
      <AdminBrandHeader title="Tipos de prenda" />
      <FlatList
        className="flex-1"
        data={loading ? [] : filteredTypes}
        keyExtractor={(type) => type.id}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pb-8"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 + insets.bottom }}
        ListHeaderComponent={
          <View className="mx-auto w-full max-w-md">
            <View className="mb-6">
              <Pressable
                onPress={goBack}
                className="mb-3 h-8 w-8 items-center justify-center rounded-full bg-icon-well"
                hitSlop={8}>
                <ArrowLeft size={16} color={adminColors.brown} />
              </Pressable>
              <Text className="font-['Lora-Italic'] text-[28px] leading-9 text-admin-ink">
                Tipos de prenda
              </Text>
            </View>

            {error && (
              <View className="mb-4 rounded-2xl bg-red-50 p-4">
                <Text className="text-center text-sm font-medium text-red-700">{error}</Text>
              </View>
            )}

            <View className="flex-row items-start gap-2">
              <View className="flex-1">
                <TextInput
                  className="h-12 w-full rounded-xl border border-line bg-white px-4 text-sm text-ink"
                  style={focusedField === 'new' ? { borderColor: adminColors.brand } : undefined}
                  onFocus={() => setFocusedField('new')}
                  onBlur={() => setFocusedField(null)}
                  value={newName}
                  onChangeText={changeNewName}
                  maxLength={maxNameLength}
                  placeholder="Nuevo tipo de prenda"
                  placeholderTextColor={adminColors.faint}
                  autoCapitalize="words"
                  onSubmitEditing={requestCreate}
                />
                {nameError ? (
                  <Text className="mt-1 text-[11px] font-medium text-red-600">{nameError}</Text>
                ) : (
                  <Text className="mt-1 text-right text-[11px] text-ink-muted">
                    {newName.trim().length}/{maxNameLength}
                  </Text>
                )}
              </View>
              <View className="w-28">
                <Button
                  text={creating ? '...' : 'Agregar'}
                  onPress={requestCreate}
                  disabled={creating || newName.trim() === ''}
                  className="h-12 rounded-xl bg-admin-brown px-4 py-0"
                />
              </View>
            </View>

            <View
              className="mt-4 h-12 flex-row items-center gap-2 rounded-full border border-line bg-white px-4"
              style={focusedField === 'search' ? { borderColor: adminColors.brand } : undefined}>
              <Search size={18} color={adminColors.faint} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={() => setFocusedField('search')}
                onBlur={() => setFocusedField(null)}
                placeholder="Buscar tipo de prenda..."
                placeholderTextColor={adminColors.faint}
                className="flex-1 text-sm text-ink"
                autoCapitalize="none"
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={clearSearch} hitSlop={8}>
                  <X size={16} color={adminColors.faint} />
                </Pressable>
              )}
            </View>

            {loading && (
              <View className="items-center py-10">
                <ActivityIndicator color={adminColors.brown} />
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <View className="mx-auto w-full max-w-md">
            {!loading && !error && types.length === 0 && (
              <View className="mt-4 rounded-2xl bg-white p-6" style={cardShadow}>
                <Text className="text-center text-sm text-ink-secondary">
                  Aún no hay tipos de prenda. Crea el primero arriba.
                </Text>
              </View>
            )}

            {!loading && !error && types.length > 0 && filteredTypes.length === 0 && (
              <View className="mt-4 rounded-2xl bg-white p-6" style={cardShadow}>
                <Text className="text-center text-sm text-ink-secondary">
                  No se encontraron tipos para {`"${searchQuery}"`}.
                </Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item: type }) => {
          const isEditing = editingId === type.id;

          return (
            <View className="mx-auto w-full max-w-md">
              <View className="mt-4 rounded-2xl bg-white p-5" style={cardShadow}>
                {isEditing ? (
                  <>
                    <TextInput
                      className="h-12 rounded-xl border border-line bg-screen px-4 text-sm text-ink"
                      style={focusedField === 'edit' ? { borderColor: adminColors.brand } : undefined}
                      onFocus={() => setFocusedField('edit')}
                      onBlur={() => setFocusedField(null)}
                      value={editName}
                      onChangeText={setEditName}
                      maxLength={maxNameLength}
                      placeholder="Nombre del tipo de prenda"
                      placeholderTextColor={adminColors.faint}
                      autoCapitalize="words"
                      onSubmitEditing={saveEdit}
                    />
                    <View className="mt-3 flex-row gap-2">
                      <View className="flex-1">
                        <Button
                          text={busyId === type.id ? 'Guardando...' : 'Guardar'}
                          onPress={saveEdit}
                          disabled={busyId !== null || editName.trim() === ''}
                          className="rounded-2xl bg-admin-brown"
                        />
                      </View>
                      <View className="flex-1">
                        <Button
                          text="Cancelar"
                          secondary
                          textClassName="text-sm font-semibold text-ink"
                          className="rounded-2xl border border-line bg-white"
                          onPress={cancelEdit}
                          disabled={busyId !== null}
                        />
                      </View>
                    </View>
                  </>
                ) : (
                  <>
                    <View className="flex-row items-center justify-between gap-3">
                      <Text className="flex-1 text-base font-semibold text-ink">
                        {type.name}
                      </Text>
                      <Pressable onPress={() => startEdit(type)}>
                        <Text className="text-sm font-semibold text-admin-brown">Renombrar</Text>
                      </Pressable>
                    </View>

                    <View className="mt-4">
                      <Pressable
                        onPress={() => requestDelete(type)}
                        disabled={busyId !== null}
                        className="h-10 flex-row items-center justify-center gap-2 rounded-2xl border border-admin-danger-line bg-admin-danger-bg active:opacity-80 disabled:opacity-50">
                        <Text className="text-[13px] font-semibold text-admin-danger">
                          {busyId === type.id ? 'Eliminando...' : 'Eliminar'}
                        </Text>
                      </Pressable>
                    </View>
                  </>
                )}
              </View>
            </View>
          );
        }}
      />

      <ConfirmModal
        visible={confirmCreate}
        title="¿Crear tipo de prenda?"
        message={`Se creará el tipo "${newName.trim()}".`}
        confirmLabel="Crear"
        loading={creating}
        onConfirm={onCreate}
        onCancel={cancelCreate}
      />

      <ConfirmModal
        visible={confirmDeleteId !== null}
        title="¿Eliminar tipo de prenda?"
        message={
          confirmDeleteId
            ? `Se eliminará el tipo "${types.find((t) => t.id === confirmDeleteId)?.name ?? ''}".`
            : undefined
        }
        confirmLabel="Eliminar"
        danger
        loading={busyId !== null}
        onConfirm={onDelete}
        onCancel={cancelDelete}
      />
    </View>
  );
}
