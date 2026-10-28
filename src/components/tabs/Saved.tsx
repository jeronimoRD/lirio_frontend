
import { useMemo } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, Sparkles } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ScreenHeader from '../ScreenHeader';
import { useFavorites } from '../../favorites/context';
import { useHome } from '../../hooks/tabs/useHome';

const COLORS = {
  burgundy: '#A81245',
  text: '#292724',
  secondary: '#6E6B68',
  border: '#EAE6E1',
  champagne: '#DCC7A8',
};

const GRID_GAP = 13;
const PAGE_PADDING = 18;

export default function Favorites() {
  const { favoriteIds } = useFavorites();
  const {
    displayedPosts,
    loading,
    error,
  } = useHome();

  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Mostrar exclusivamente publicaciones marcadas con Me gusta.
  const favoritePosts = useMemo(
    () => displayedPosts.filter((post) => favoriteIds.has(post.id)),
    [displayedPosts, favoriteIds],
  );

  const goToPost = (id: string) => {
    router.push({
      pathname: '/(upload)/[id]',
      params: { id },
    });
  };

  return (
    <View className="flex-1 bg-[#FCFAF8]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: PAGE_PADDING,
          paddingBottom: insets.bottom + 36,
        }}
      >
        <ScreenHeader title="Favoritos" />

        <View className="mb-6 mt-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="font-['Lora-Italic'] text-[28px] leading-[36px] text-[#292724]">
                Lo que te enamora.
              </Text>
              <Text className="mt-2 text-[13px] leading-5 text-[#6E6B68]">
                Los looks que te encantan, reunidos en un solo lugar.
              </Text>
            </View>

            <View className="h-12 w-12 items-center justify-center rounded-full border border-[#EAE6E1] bg-white">
              <Heart
                size={21}
                color={COLORS.burgundy}
                fill={COLORS.burgundy}
                strokeWidth={1.4}
              />
            </View>
          </View>

          <View className="mt-5 flex-row items-center gap-2">
            <View className="h-px w-7 bg-[#DCC7A8]" />
            <View className="h-1 w-1 rounded-full bg-[#A81245]" />
            <View className="h-px w-7 bg-[#DCC7A8]" />

            <Text className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#6E6B68]">
              HIBIRIO · FAVORITOS
            </Text>

            <View className="h-px flex-1 bg-[#EAE6E1]" />
          </View>
        </View>

        {loading && (
          <View className="items-center py-16">
            <ActivityIndicator color={COLORS.burgundy} />
            <Text className="mt-4 font-['Lora-Italic'] text-[18px] text-[#6E6B68]">
              Abriendo tus favoritos…
            </Text>
          </View>
        )}

        {!loading && !!error && (
          <View className="rounded-[20px] border border-[#E8C9CE] bg-[#FBF0F1] p-5">
            <Text className="text-[13px] leading-5 text-[#A81245]">
              {error}
            </Text>
          </View>
        )}

        {!loading && !error && favoritePosts.length === 0 && (
          <View className="items-center rounded-[24px] border border-[#EAE6E1] bg-white px-6 py-10">
            <View className="mb-5 h-20 w-20 items-center justify-center rounded-full bg-[#F4EEE7]">
              <Heart
                size={30}
                color={COLORS.burgundy}
                strokeWidth={1.3}
              />
            </View>

            <Text className="text-center font-['Lora-Italic'] text-[25px] text-[#292724]">
              Todavía no hay favoritos
            </Text>

            <Text className="mt-3 max-w-[270px] text-center text-[13px] leading-6 text-[#6E6B68]">
              Cuando encuentres un outfit que te encante, dale Me gusta y aparecerá aquí.
            </Text>

            <View className="mt-6 flex-row items-center gap-2">
              <Sparkles size={14} color={COLORS.champagne} />
              <Text className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#6E6B68]">
                TU SELECCIÓN PERSONAL
              </Text>
            </View>
          </View>
        )}

        {!loading && !error && favoritePosts.length > 0 && (
          <View>
            <View className="mb-4 flex-row items-end justify-between">
              <View>
                <Text className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A81245]">
                  Tu selección
                </Text>
                <Text className="mt-1 font-['Lora-Italic'] text-[19px] text-[#292724]">
                  Looks favoritos
                </Text>
              </View>

              <Text className="pb-0.5 text-[11px] text-[#6E6B68]">
                {favoritePosts.length}{' '}
                {favoritePosts.length === 1 ? 'look' : 'looks'}
              </Text>
            </View>

            <View className="flex-row gap-[13px]">
              {[0, 1].map((columnIndex) => {
                const column = favoritePosts.filter(
                  (_, index) => index % 2 === columnIndex,
                );

                return (
                  <View key={columnIndex} className="flex-1 gap-[13px]">
                    {column.map((post) => (
                      <Pressable
                        key={post.id}
                        onPress={() => goToPost(post.id)}
                        accessibilityRole="button"
                        accessibilityLabel={`Abrir favorito: ${post.title || 'Outfit'}`}
                        className="overflow-hidden rounded-[18px] border border-[#EAE6E1] bg-white"
                      >
                        <View className="overflow-hidden bg-[#F4EEE7]">
                          <Image
                            source={{ uri: post.image }}
                            resizeMode="cover"
                            className="aspect-[3/4] w-full"
                          />

                          <View className="absolute right-2.5 top-2.5 h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-[#FCFAF8]/90">
                            <Heart
                              size={14}
                              color={COLORS.burgundy}
                              fill={COLORS.burgundy}
                            />
                          </View>
                        </View>

                        <View className="px-3 py-3">
                          <Text
                            numberOfLines={2}
                            className="font-['Lora-Italic'] text-[15px] leading-5 text-[#292724]"
                          >
                            {post.title || 'Inspiración de estilo'}
                          </Text>

                          <Text className="mt-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6E6B68]">
                            Te gusta
                          </Text>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
