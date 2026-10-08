import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Search, X } from 'lucide-react-native';

import AdminBrandHeader from './AdminBrandHeader';
import Button from '../Button';
import ConfirmModal from '../ConfirmModal';
import { cardShadow } from '../../constants/theme';
import { useAdminCategories } from '../../hooks/admin/useAdminCategories';

export default function AdminCategories() {
  const insets = useSafeAreaInsets();
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
    <View className="flex-1 bg-[#FCFAF8]">
      <AdminBrandHeader />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-8"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 + insets.bottom }}>
        <View className="mx-auto w-full max-w-md">
          <View className="mb-6">
            <Pressable
              onPress={goBack}
              className="mb-3 h-8 w-8 items-center justify-center rounded-full bg-[#F4EEE7]"
              hitSlop={8}>
              <ArrowLeft size={16} color="#4A3728" />
            </Pressable>
            <Text className="font-['Lora-Italic'] text-[28px] leading-9 text-[#241E1B]">
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
                className="h-12 w-full rounded-xl border border-[#EAE6E1] bg-white px-4 text-sm text-[#292724]"
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
                <Text className="mt-1 text-right text-[11px] text-[#A09B95]">
                  {newName.trim().length}/{maxNameLength}
                </Text>
              )}
            </View>
            <View className="w-28">
              <Button
                text={creating ? '...' : 'Agregar'}
                onPress={requestCreate}
                disabled={creating || newName.trim() === ''}
                className="h-12 rounded-xl bg-[#4A3728] px-4 py-0"
              />
            </View>
          </View>

          <View className="mt-4 h-12 flex-row items-center gap-2 rounded-full border border-[#EAE6E1] bg-white px-4">
            <Search size={18} color="#A09B95" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar categoría..."
              placeholderTextColor="#A09B95"
              className="flex-1 text-sm text-[#292724]"
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

          {!loading && !error && categories.length === 0 && (
            <View className="mt-4 rounded-2xl bg-white p-6" style={cardShadow}>
              <Text className="text-center text-sm text-[#6E6B68]">
                Aún no hay categorías. Crea la primera arriba.
              </Text>
            </View>
          )}

          {!loading && !error && categories.length > 0 && filteredCategories.length === 0 && (
            <View className="mt-4 rounded-2xl bg-white p-6" style={cardShadow}>
              <Text className="text-center text-sm text-[#6E6B68]">
                No se encontraron categorías para {`"${searchQuery}"`}.
              </Text>
            </View>
          )}

          {!loading &&
            filteredCategories.map((category) => {
              const isEditing = editingId === category.id;

              return (
                <View
                  key={category.id}
                  className="mt-4 rounded-2xl bg-white p-5"
                  style={cardShadow}>
                  {isEditing ? (
                    <>
                      <TextInput
                        className="h-12 rounded-xl border border-[#EAE6E1] bg-[#FCFAF8] px-4 text-sm text-[#292724]"
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
                            className="rounded-2xl bg-[#4A3728]"
                          />
                        </View>
                        <View className="flex-1">
                          <Button
                            text="Cancelar"
                            secondary
                            textClassName="text-sm font-semibold text-[#292724]"
                            className="rounded-2xl border border-[#EAE6E1] bg-white"
                            onPress={cancelEdit}
                            disabled={busyId !== null}
                          />
                        </View>
                      </View>
                    </>
                  ) : (
                    <>
                      <View className="flex-row items-center justify-between gap-3">
                        <Text className="flex-1 text-base font-semibold text-[#292724]">
                          {category.name}
                        </Text>
                        <Pressable onPress={() => startEdit(category)}>
                          <Text className="text-sm font-semibold text-[#4A3728]">Renombrar</Text>
                        </Pressable>
                      </View>

                      <View className="mt-4">
                        <Pressable
                          onPress={() => requestDelete(category)}
                          disabled={busyId !== null}
                          className="h-10 flex-row items-center justify-center gap-2 rounded-2xl border border-[#E9AFA6] bg-[#FBE6E1] active:opacity-80 disabled:opacity-50">
                          <Text className="text-[13px] font-semibold text-[#C2391F]">
                            {busyId === category.id ? 'Eliminando...' : 'Eliminar'}
                          </Text>
                        </Pressable>
                      </View>
                    </>
                  )}
                </View>
              );
            })}
        </View>
      </ScrollView>

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
