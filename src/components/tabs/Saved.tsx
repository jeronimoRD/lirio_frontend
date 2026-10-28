
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  Shirt,
  Sparkles,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ConfirmModal from '../ConfirmModal';
import ScreenHeader from '../ScreenHeader';
import NewOutfitCard from '../outfits/NewOutfitCard';
import OutfitCard from '../outfits/OutfitCard';
import { useWardrobe } from '../../hooks/tabs/useWardrobe';

const COLORS = {
  burgundy: '#A81245',
};

export default function Favorites() {
  const {
    outfits,
    loading,
    error,
    editOutfit,
    deleteTarget,
    deleting,
    askDelete,
    cancelDelete,
    onDeleteConfirmed,
  } = useWardrobe();

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const goExplore = () => {
    router.replace('/(tabs)/explore');
  };

  const showSpinner = loading && outfits.length === 0;

  return (
    <View className="flex-1 bg-[#FCFAF8]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingBottom: insets.bottom + 36,
        }}>
        <ScreenHeader title="Mi ropero" />

        {/* Cabecera editorial */}
        <View className="mb-7 mt-4">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <Text className="font-['Lora-Italic'] text-[30px] leading-[38px] text-[#292724]">
                Tu estilo, tu universo.
              </Text>

              <Text className="mt-2 text-[13px] leading-5 text-[#6E6B68]">
                Tus outfits en un solo lugar, listos para cuando los necesites.
              </Text>
            </View>

            <View className="h-12 w-12 items-center justify-center rounded-full border border-[#EAE6E1] bg-white">
              <Shirt
                size={22}
                color={COLORS.burgundy}
                strokeWidth={1.4}
              />
            </View>
          </View>

          <View className="mt-5 flex-row items-center gap-2">
            <View className="h-px w-7 bg-[#DCC7A8]" />
            <View className="h-1 w-1 rounded-full bg-[#A81245]" />
            <View className="h-px w-7 bg-[#DCC7A8]" />

            <Text className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#6E6B68]">
              HIBIRIO · MI ROPERO
            </Text>

            <View className="h-px flex-1 bg-[#EAE6E1]" />
          </View>
        </View>

        {/* Colección de outfits */}
        <View className="mb-4">
          <Text className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A81245]">
            Tu colección
          </Text>

          <Text className="mt-1 font-['Lora-Italic'] text-[22px] text-[#292724]">
            Outfits que has armado
          </Text>

          <Text className="mt-1 text-[12px] leading-5 text-[#6E6B68]">
            Combina una prenda de cada tipo y decide si los compartes.
          </Text>
        </View>

        {!!error && (
          <View className="mb-4 rounded-[20px] border border-[#E8C9CE] bg-[#FBF0F1] p-5">
            <Text className="text-[13px] leading-5 text-[#A81245]">
              {error}
            </Text>
          </View>
        )}

        <View className="flex-row flex-wrap justify-between gap-y-4">
          <View className="w-[48%]">
            <NewOutfitCard />
          </View>

          {outfits.map((outfit) => (
            <View key={outfit.id} className="w-[48%]">
              <OutfitCard
                outfit={outfit}
                onEdit={() => editOutfit(outfit)}
                onDelete={() => askDelete(outfit)}
              />
            </View>
          ))}
        </View>

        {showSpinner && (
          <View className="items-center py-12">
            <ActivityIndicator color={COLORS.burgundy} />

            <Text className="mt-3 font-['Lora-Italic'] text-[15px] text-[#6E6B68]">
              Cargando tu ropero…
            </Text>
          </View>
        )}

        {!loading && !error && outfits.length === 0 && (
          <View className="mt-4 items-center rounded-[22px] border border-[#EAE6E1] bg-white px-6 py-9">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-[#F4EEE7]">
              <Sparkles
                size={25}
                color={COLORS.burgundy}
                strokeWidth={1.4}
              />
            </View>

            <Text className="text-center font-['Lora-Italic'] text-[22px] text-[#292724]">
              Tu primer outfit está por nacer.
            </Text>

            <Text className="mt-2 text-center text-[12px] leading-5 text-[#6E6B68]">
              Todavía no tienes outfits en tu ropero.
            </Text>
          </View>
        )}

        {/* Acceso a explorar */}
        <Pressable
          onPress={goExplore}
          accessibilityRole="button"
          className="mt-7 min-h-[52px] flex-row items-center justify-center gap-2 rounded-full bg-[#A81245] px-5 active:opacity-80">
          <Text className="text-[12px] font-semibold tracking-[0.04em] text-white">
            Explorar más outfits
          </Text>

          <ArrowRight size={16} color="#FFFFFF" />
        </Pressable>

        <Text className="mt-4 text-center text-[10px] leading-4 text-[#A09B95]">
          Tu estilo, tus reglas. Hibirio te acompaña.
        </Text>
      </ScrollView>

      <ConfirmModal
        visible={deleteTarget !== null}
        title="¿Eliminar outfit?"
        message={
          deleteTarget
            ? `Se eliminará el outfit "${deleteTarget.name}". Las prendas no se borran.`
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
