import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Search, X } from 'lucide-react-native';

import AdminBrandHeader from './AdminBrandHeader';
import Button from '../Button';
import ConfirmModal from '../ConfirmModal';
import { cardShadow } from '../../constants/theme';
import { useAdminCategories } from '../../hooks/admin/useAdminCategories';

export default function AdminCategories() {
  const insets = useSafeAreaInsets();
  const [focusedField, setFocusedField] = useState<'new' | 'search' | 'edit' | null>(null);
  const {
    categories,
    filteredCategories,
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
  } = useAdminCategories();

  return (
    <View className="flex-1 bg-screen">
      <AdminBrandHeader />
      <FlatList
        className="flex-1"
        data={loading ? [] : filteredCategories}
        keyExtractor={(category) => category.id}
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
                <ArrowLeft size={16} color="#4A3728" />
              </Pressable>
              <Text className="font-['Lora-Italic'] text-[28px] leading-9 text-admin-ink">
                Categorías
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
                  style={focusedField === 'new' ? { borderColor: '#A81245' } : undefined}
                  onFocus={() => setFocusedField('new')}
                  onBlur={() => setFocusedField(null)}
                  value={newName}
                  onChangeText={changeNewName}
                  maxLength={maxNameLength}
                  placeholder="Nueva categoría"
                  placeholderTextColor="#A09B95"
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
              style={focusedField === 'search' ? { borderColor: '#A81245' } : undefined}>
              <Search size={18} color="#A09B95" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={() => setFocusedField('search')}
                onBlur={() => setFocusedField(null)}
                placeholder="Buscar categoría..."
                placeholderTextColor="#A09B95"
                className="flex-1 text-sm text-ink"
                autoCapitalize="none"
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={clearSearch} hitSlop={8}>
                  <X size={16} color="#A09B95" />
                </Pressable>
              )}
            </View>

            {loading && (
              <View className="items-center py-10">
                <ActivityIndicator color="#4A3728" />
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <View className="mx-auto w-full max-w-md">
            {!loading && !error && categories.length === 0 && (
              <View className="mt-4 rounded-2xl bg-white p-6" style={cardShadow}>
                <Text className="text-center text-sm text-ink-secondary">
                  Aún no hay categorías. Crea la primera arriba.
                </Text>
              </View>
            )}

            {!loading && !error && categories.length > 0 && filteredCategories.length === 0 && (
              <View className="mt-4 rounded-2xl bg-white p-6" style={cardShadow}>
                <Text className="text-center text-sm text-ink-secondary">
                  No se encontraron categorías para {`"${searchQuery}"`}.
                </Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item: category }) => {
          const isEditing = editingId === category.id;

          return (
            <View className="mx-auto w-full max-w-md">
              <View className="mt-4 rounded-2xl bg-white p-5" style={cardShadow}>
                {isEditing ? (
                  <>
                    <TextInput
                      className="h-12 rounded-xl border border-line bg-screen px-4 text-sm text-ink"
                      style={focusedField === 'edit' ? { borderColor: '#A81245' } : undefined}
                      onFocus={() => setFocusedField('edit')}
                      onBlur={() => setFocusedField(null)}
                      value={editName}
                      onChangeText={setEditName}
                      maxLength={maxNameLength}
                      placeholder="Nombre de la categoría"
                      placeholderTextColor="#A09B95"
                      autoCapitalize="words"
                      onSubmitEditing={saveEdit}
                    />
                    <View className="mt-3 flex-row gap-2">
                      <View className="flex-1">
                        <Button
                          text={busyId === category.id ? 'Guardando...' : 'Guardar'}
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
                        {category.name}
                      </Text>
                      <Pressable onPress={() => startEdit(category)}>
                        <Text className="text-sm font-semibold text-admin-brown">Renombrar</Text>
                      </Pressable>
                    </View>

                    <View className="mt-4">
                      <Pressable
                        onPress={() => requestDelete(category)}
                        disabled={busyId !== null}
                        className="h-10 flex-row items-center justify-center gap-2 rounded-2xl border border-admin-danger-line bg-admin-danger-bg active:opacity-80 disabled:opacity-50">
                        <Text className="text-[13px] font-semibold text-admin-danger">
                          {busyId === category.id ? 'Eliminando...' : 'Eliminar'}
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
        title="¿Crear categoría?"
        message={`Se creará la categoría "${newName.trim()}".`}
        confirmLabel="Crear"
        loading={creating}
        onConfirm={onCreate}
        onCancel={cancelCreate}
      />

      <ConfirmModal
        visible={confirmDeleteId !== null}
        title="¿Eliminar categoría?"
        message={
          confirmDeleteId
            ? `Se eliminará la categoría "${categories.find((c) => c.id === confirmDeleteId)?.name ?? ''}".`
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
