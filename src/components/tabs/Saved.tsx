
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  Plus,
  Search,
  Shirt,
  Sparkles,
  X,
} from 'lucide-react-native';
import { useTabBarClearance } from '../LiquidGlass/TabBarClearance';

import ConfirmModal from '../ConfirmModal';
import ScreenHeader from '../ScreenHeader';
import OutfitCard from '../outfits/OutfitCard';
import GarmentFilter from '../wardrobe/GarmentFilter';
import { useWardrobe } from '../../hooks/tabs/useWardrobe';

const COLORS = {
  burgundy: '#A81245',
};

export default function Favorites() {
  const {
    outfits,
    totalOutfits,
    loading,
    error,
    garmentType,
    selectGarmentType,
    piecesOfType,
    selectedPostId,
    togglePiece,
    query,
    setQuery,
    editOutfit,
    deleteTarget,
    deleting,
    askDelete,
    cancelDelete,
    onDeleteConfirmed,
  } = useWardrobe();

  const router = useRouter();
  const clearance = useTabBarClearance();

  const goExplore = () => {
    router.replace('/(tabs)/explore');
  };

  const showSpinner = loading && totalOutfits === 0;
  const filtering = !!garmentType || query.trim().length > 0;

  return (
    <View className="flex-1 bg-screen">
      <FlatList
        data={outfits}
        numColumns={2}
        keyExtractor={(outfit) => outfit.id}
        columnWrapperStyle={{ gap: 16 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingBottom: clearance,
          gap: 16,
        }}
        renderItem={({ item }) => (
          <View className="flex-1">
            <OutfitCard
              outfit={item}
              onEdit={() => editOutfit(item)}
              onDelete={() => askDelete(item)}
            />
          </View>
        )}
        ListHeaderComponent={
          <View>
            <ScreenHeader title="Mi vestidor" />

            {/* Cabecera editorial */}
            <View className="mb-7 mt-4">
              <View className="flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className="font-['Lora-Italic'] text-[30px] leading-[38px] text-ink">
                    Tu estilo
                  </Text>
                </View>

                <View className="h-12 w-12 items-center justify-center rounded-full border border-line bg-white">
                  <Shirt
                    size={22}
                    color={COLORS.burgundy}
                    strokeWidth={1.4}
                  />
                </View>
              </View>

              <View className="mt-5 flex-row items-center gap-2">
                <View className="h-px w-7 bg-beige" />
                <View className="h-1 w-1 rounded-full bg-brand" />
                <View className="h-px w-7 bg-beige" />

                <Text className="text-[9px] font-semibold uppercase tracking-[0.2em] text-ink-secondary">
                  HIBIRIO · MI ROPERO
                </Text>

                <View className="h-px flex-1 bg-line" />
              </View>
            </View>

            {/* Colección de outfits */}
            <View className="flex-row items-end justify-between gap-3">
              <View className="flex-1">
                <Text className="text-[9px] font-semibold uppercase tracking-[0.18em] text-brand">
                  Tu colección
                </Text>

                <Text className="mt-1 font-['Lora-Italic'] text-[22px] text-ink">
                  Outfits que has armado
                </Text>
              </View>

              <Pressable
                onPress={() => router.push('/outfit/new')}
                accessibilityRole="button"
                accessibilityLabel="Crear outfit"
                className="min-h-[48px] flex-row items-center gap-1.5 rounded-full bg-brand px-4 active:opacity-80">
                <Plus size={16} color="#FFFFFF" />
                <Text className="text-[12px] font-semibold text-white">Crear outfit</Text>
              </Pressable>
            </View>

            <View className="mt-5 gap-4">
              <GarmentFilter
                value={garmentType}
                onChange={selectGarmentType}
                pieces={piecesOfType}
                selectedPostId={selectedPostId}
                onSelectPiece={togglePiece}
              />

              <View className="h-[50px] flex-row items-center gap-2 rounded-full border border-line bg-white px-4">
                <Search size={18} color="#A09B95" />

                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Buscar outfits por nombre..."
                  placeholderTextColor="#A09B95"
                  className="flex-1 text-sm text-ink"
                  autoCapitalize="none"
                  returnKeyType="search"
                />

                {query.length > 0 && (
                  <Pressable
                    onPress={() => setQuery('')}
                    hitSlop={8}
                    accessibilityLabel="Limpiar búsqueda"
                  >
                    <X size={16} color="#A09B95" />
                  </Pressable>
                )}
              </View>
            </View>

            {!!error && (
              <View className="mt-4 rounded-card border border-brand-line bg-brand-tint p-5">
                <Text className="text-[13px] leading-5 text-brand">
                  {error}
                </Text>
              </View>
            )}
          </View>
        }
        ListFooterComponent={
          <View>
            {showSpinner && (
              <View className="items-center py-12">
                <ActivityIndicator color={COLORS.burgundy} />

                <Text className="mt-3 font-['Lora-Italic'] text-[15px] text-ink-secondary">
                  Cargando tu ropero…
                </Text>
              </View>
            )}

            {!loading && !error && filtering && outfits.length === 0 && totalOutfits > 0 && (
              <View className="items-center rounded-[22px] border border-line bg-white px-6 py-9">
                <Text className="text-center font-['Lora-Italic'] text-[20px] text-ink">
                  Ningún outfit coincide.
                </Text>

                <Text className="mt-2 text-center text-[12px] leading-5 text-ink-secondary">
                  Prueba con otra prenda o cambia el nombre de la búsqueda.
                </Text>
              </View>
            )}

            {!loading && !error && totalOutfits === 0 && (
              <View className="items-center rounded-[22px] border border-line bg-white px-6 py-9">
                <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-icon-well">
                  <Sparkles
                    size={25}
                    color={COLORS.burgundy}
                    strokeWidth={1.4}
                  />
                </View>

                <Text className="text-center font-['Lora-Italic'] text-[22px] text-ink">
                  Tu primer outfit está por nacer.
                </Text>

                <Text className="mt-2 text-center text-[12px] leading-5 text-ink-secondary">
                  Todavía no tienes outfits en tu ropero.
                </Text>
              </View>
            )}

            {/* Acceso a explorar */}
            <Pressable
              onPress={goExplore}
              accessibilityRole="button"
              className="mt-7 min-h-[52px] flex-row items-center justify-center gap-2 rounded-full bg-brand px-5 active:opacity-80">
              <Text className="text-[12px] font-semibold tracking-[0.04em] text-white">
                Explorar más outfits
              </Text>

              <ArrowRight size={16} color="#FFFFFF" />
            </Pressable>

            <Text className="mt-4 text-center text-[10px] leading-4 text-ink-muted">
              Tu estilo, tus reglas. Hibirio te acompaña.
            </Text>
          </View>
        }
      />

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
