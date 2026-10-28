
import {
  Image,
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

import ScreenHeader from '../ScreenHeader';
import { useHome } from '../../hooks/tabs/useHome';

const COLORS = {
  burgundy: '#A81245',
  text: '#292724',
  secondary: '#6E6B68',
  border: '#EAE6E1',
  champagne: '#DCC7A8',
  background: '#FCFAF8',
};

export default function Favorites() {
  const { displayedPosts, loading, error } = useHome();

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const goToPost = (id: string) => {
    router.push({
      pathname: '/(upload)/[id]',
      params: { id },
    });
  };

  const goExplore = () => {
    router.replace('/(tabs)/explore');
  };

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
                Un espacio para descubrir, guardar y organizar tus próximos
                looks.
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

        {/* Presentación del futuro ropero */}
        <View className="mb-7 overflow-hidden rounded-[24px] border border-[#EAE6E1] bg-white">
          <View className="px-5 pb-5 pt-6">
            <View className="mb-4 flex-row items-center gap-2">
              <Sparkles
                size={15}
                color={COLORS.burgundy}
                strokeWidth={1.5}
              />

              <Text className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A81245]">
                Tu próximo capítulo
              </Text>
            </View>

            <Text className="font-['Lora-Italic'] text-[25px] leading-8 text-[#292724]">
              Un ropero hecho a tu medida.
            </Text>

            <Text className="mt-3 text-[13px] leading-6 text-[#6E6B68]">
              Estamos preparando un espacio donde tus prendas, combinaciones
              e inspiraciones puedan convivir. Tu estilo merece un lugar
              propio.
            </Text>

            <View className="mt-6 flex-row items-center gap-3 rounded-[18px] bg-[#FCFAF8] p-4">
              <View className="h-11 w-11 items-center justify-center rounded-full border border-[#DCC7A8] bg-white">
                <Shirt
                  size={20}
                  color={COLORS.burgundy}
                  strokeWidth={1.3}
                />
              </View>

              <View className="flex-1">
                <Text className="font-['Lora-Italic'] text-[16px] text-[#292724]">
                  Tu colección personal
                </Text>

                <Text className="mt-1 text-[11px] leading-4 text-[#6E6B68]">
                  Prendas, ideas y looks por descubrir.
                </Text>
              </View>
            </View>
          </View>

          <View className="h-1 bg-[#A81245]" />
        </View>

        {/* Inspiración de la comunidad */}
        <View className="mb-4">
          <Text className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A81245]">
            Inspírate
          </Text>

          <Text className="mt-1 font-['Lora-Italic'] text-[22px] text-[#292724]">
            Looks de la comunidad
          </Text>

          <Text className="mt-1 text-[12px] leading-5 text-[#6E6B68]">
            Descubre nuevas ideas mientras preparas tu ropero.
          </Text>
        </View>

        {loading && (
          <View className="items-center py-12">
            <Text className="font-['Lora-Italic'] text-[17px] text-[#6E6B68]">
              Buscando inspiración…
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

        {!loading && !error && displayedPosts.length === 0 && (
          <View className="items-center rounded-[22px] border border-[#EAE6E1] bg-white px-6 py-9">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-[#F4EEE7]">
              <Sparkles
                size={25}
                color={COLORS.burgundy}
                strokeWidth={1.4}
              />
            </View>

            <Text className="text-center font-['Lora-Italic'] text-[22px] text-[#292724]">
              La inspiración está por llegar.
            </Text>

            <Text className="mt-2 text-center text-[12px] leading-5 text-[#6E6B68]">
              Cuando haya publicaciones disponibles, podrás descubrir nuevos
              estilos desde aquí.
            </Text>
          </View>
        )}

        {!loading && !error && displayedPosts.length > 0 && (
          <View className="flex-row flex-wrap justify-between gap-y-4">
            {displayedPosts.slice(0, 6).map((post) => (
              <Pressable
                key={post.id}
                onPress={() => goToPost(post.id)}
                accessibilityRole="button"
                accessibilityLabel={`Ver outfit: ${post.title || 'Inspiración de estilo'}`}
                className="w-[48%] overflow-hidden rounded-[18px] border border-[#EAE6E1] bg-white active:opacity-80">
                <View className="overflow-hidden bg-[#F4EEE7]">
                  <Image
                    source={{ uri: post.image }}
                    resizeMode="cover"
                    className="aspect-[3/4] w-full"
                  />
                </View>

                <View className="px-3 py-3">
                  <Text
                    numberOfLines={2}
                    className="font-['Lora-Italic'] text-[15px] leading-5 text-[#292724]">
                    {post.title || 'Inspiración de estilo'}
                  </Text>

                  <View className="mt-2 flex-row items-center gap-1">
                    <Sparkles size={11} color={COLORS.champagne} />

                    <Text className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#6E6B68]">
                      Descubrir look
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
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
    </View>
  );
}
