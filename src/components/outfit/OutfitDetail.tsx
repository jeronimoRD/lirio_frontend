import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ConfirmModal from '../ConfirmModal';
import ScreenHeader from '../ScreenHeader';
import OutfitCollage from '../outfits/OutfitCollage';
import { cardShadowLg } from '../../constants/theme';
import { useGarmentTypes } from '../../garment-types/context';
import { useOutfitDetail } from '../../hooks/outfit/useOutfitDetail';

export default function OutfitDetail() {
  const insets = useSafeAreaInsets();
  const { labelOf } = useGarmentTypes();

  const {
    outfit,
    loading,
    error,
    isOwner,
    goBack,
    openPiece,
    confirmVisible,
    deleting,
    askDelete,
    cancelDelete,
    onDeleteConfirmed,
  } = useOutfitDetail();

  return (
    <View className="flex-1 bg-screen">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingBottom: insets.bottom + 36,
        }}>
        <ScreenHeader title={outfit?.name ?? 'Outfit'} onBack={goBack} />

        {loading && (
          <View className="items-center py-16">
            <ActivityIndicator color="#A81245" />
          </View>
        )}

        {!loading && !!error && (
          <View className="mt-5 rounded-card border border-brand-line bg-brand-tint p-5">
            <Text className="text-[13px] leading-5 text-brand">{error}</Text>
          </View>
        )}

        {outfit && (
          <>
            <View
              className="mt-5 aspect-[3/4] w-full overflow-hidden rounded-tile border border-brand/25 bg-white"
              style={cardShadowLg}>
              <OutfitCollage items={outfit.items} />
            </View>

            <View className="mt-5 flex-row items-center gap-2">
              <View className="rounded-full bg-brand px-3 py-1.5">
                <Text className="text-[9px] font-bold uppercase tracking-[1.5px] text-white">
                  Outfit
                </Text>
              </View>

              <View className="rounded-full border border-line bg-white px-3 py-1.5">
                <Text className="text-[9px] font-semibold uppercase tracking-[1.5px] text-ink-secondary">
                  {outfit.isPublic ? 'Público' : 'Privado'}
                </Text>
              </View>
            </View>

            <Text className="mt-4 font-['Lora-Italic'] text-[28px] leading-[36px] text-ink">
              {outfit.name}
            </Text>

            {!outfit.isAvailable && (
              <View className="mt-5 rounded-card border border-brand-line bg-brand-tint p-5">
                <View className="flex-row items-center gap-2">
                  <AlertTriangle size={16} color="#A81245" />

                  <Text className="text-[14px] font-semibold text-brand">
                    Este outfit no está disponible
                  </Text>
                </View>

                <Text className="mt-2 text-[13px] leading-5 text-ink-secondary">
                  {isOwner
                    ? 'Una de sus prendas se eliminó o ya no está guardada. Te recomendamos borrar este outfit.'
                    : 'Una de sus prendas ya no está disponible.'}
                </Text>
              </View>
            )}

            <Text className="mt-7 text-[10px] font-bold uppercase tracking-[2px] text-brand">
              PRENDAS
            </Text>

            <View className="mt-3 gap-3">
              {outfit.items.map((item) => {
                const uri = item.isAvailable ? item.image : null;

                return (
                  <Pressable
                    key={item.postId}
                    onPress={() => openPiece(item.postId)}
                    disabled={!item.image}
                    accessibilityRole="button"
                    accessibilityLabel={`Ver prenda ${labelOf(item.garmentTypeId)}`}
                    className="flex-row items-center gap-3 rounded-row border border-line bg-white p-3 active:opacity-80">
                    <View className="h-[72px] w-[56px] items-center justify-center overflow-hidden rounded-[12px] bg-icon-well">
                      {uri ? (
                        <Image
                          source={{ uri }}
                          resizeMode="cover"
                          className="h-full w-full"
                        />
                      ) : (
                        <AlertTriangle size={16} color="#A09B95" />
                      )}
                    </View>

                    <View className="flex-1">
                      <Text className="text-[10px] font-bold uppercase tracking-[1.5px] text-brand">
                        {labelOf(item.garmentTypeId)}
                      </Text>

                      <Text
                        numberOfLines={1}
                        className="mt-1 font-['Lora-Italic'] text-[15px] text-ink">
                        {item.title ?? 'Prenda eliminada'}
                      </Text>

                      <Text className="mt-1 text-[11px] text-ink-secondary">
                        {item.isAvailable ? 'Disponible' : 'No disponible'}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {isOwner && (
              <Pressable
                onPress={askDelete}
                accessibilityRole="button"
                className="mt-8 h-12 flex-row items-center justify-center rounded-full border border-line bg-white">
                <Text className="text-[13px] font-semibold text-red-600">
                  Eliminar outfit
                </Text>
              </Pressable>
            )}
          </>
        )}
      </ScrollView>

      <ConfirmModal
        visible={confirmVisible}
        title="¿Eliminar outfit?"
        message={
          outfit
            ? `Se eliminará el outfit "${outfit.name}". Las prendas no se borran.`
            : undefined
        }
        confirmLabel="Eliminar"
        danger
        loading={deleting}
        onConfirm={onDeleteConfirmed}
        onCancel={cancelDelete}
      />
    </View>
  );
}
