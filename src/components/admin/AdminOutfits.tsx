import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AdminBrandHeader from './AdminBrandHeader';
import ConfirmModal from '../ConfirmModal';
import OutfitCollage from '../outfits/OutfitCollage';
import { adminColors, cardShadow } from '../../constants/theme';
import { useAdminOutfits } from '../../hooks/admin/useAdminOutfits';

export default function AdminOutfits({ showHeader = true }: { showHeader?: boolean }) {
  const insets = useSafeAreaInsets();
  const {
    outfits,
    usersById,
    loading,
    error,
    busyId,
    pendingDelete,
    requestDelete,
    cancelDelete,
    onDelete,
  } = useAdminOutfits();

  return (
    <View className="flex-1 bg-admin-screen">
      {showHeader && <AdminBrandHeader title="Outfits" />}
      <FlatList
        data={loading ? [] : outfits}
        keyExtractor={(outfit) => outfit.id}
        className="flex-1"
        contentContainerClassName="px-5"
        contentContainerStyle={{
          gap: 12,
          paddingTop: 24,
          paddingBottom: 94 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="mx-auto mb-2 w-full max-w-md">
            <Text className="font-['Lora-Italic'] text-[28px] leading-9 text-admin-ink">
              Outfits
            </Text>
            <Text className="mt-1 text-[13px] leading-4 text-admin-muted">
              Todos los outfits, públicos y privados
            </Text>
            {error && (
              <View className="mt-4 rounded-2xl bg-red-50 p-4">
                <Text className="text-center text-sm font-medium text-red-700">{error}</Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <View className="mx-auto w-full max-w-md">
            {loading ? (
              <View className="items-center py-10">
                <ActivityIndicator color={adminColors.brand} />
              </View>
            ) : !error ? (
              <View className="rounded-2xl bg-white p-6" style={cardShadow}>
                <Text className="text-center text-sm text-ink-secondary">Aún no hay outfits.</Text>
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item: outfit }) => {
          const owner = usersById[outfit.userId];

          return (
            <View
              className="mx-auto w-full max-w-md flex-row gap-3 rounded-2xl bg-white p-3"
              style={cardShadow}>
              <View className="h-36 w-28 overflow-hidden rounded-xl">
                <OutfitCollage items={outfit.items} />
              </View>

              <View className="flex-1 justify-center gap-1">
                <Text numberOfLines={2} className="font-['Lora-Italic'] text-lg text-admin-ink">
                  {outfit.name}
                </Text>
                <Text numberOfLines={1} className="text-xs text-ink-secondary">
                  {owner ? `Por ${owner.name}` : 'Autor no disponible'}
                </Text>
                <Text className="text-xs text-ink-secondary">
                  {outfit.items.length} prendas · {outfit.isPublic ? 'Público' : 'Privado'}
                </Text>
                {!outfit.isAvailable && (
                  <Text className="text-xs font-semibold text-admin-danger">
                    Prendas no disponibles
                  </Text>
                )}
                <Pressable
                  onPress={() => requestDelete(outfit)}
                  disabled={busyId !== null}
                  accessibilityRole="button"
                  accessibilityLabel={`Eliminar outfit ${outfit.name}`}
                  className="mt-1 h-12 flex-row items-center justify-center rounded-xl border border-admin-danger-line bg-admin-danger-bg active:opacity-80 disabled:opacity-50">
                  <Text className="text-[13px] font-semibold text-admin-danger">
                    {busyId === outfit.id ? 'Eliminando...' : 'Eliminar'}
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      />
      <ConfirmModal
        visible={pendingDelete !== null}
        title="¿Eliminar outfit?"
        message={
          pendingDelete ? `Se eliminará "${pendingDelete.name}" de forma permanente.` : undefined
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
