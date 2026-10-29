
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Heart, Sparkles } from 'lucide-react-native';

import ScreenHeader from '../ScreenHeader';
import type { Post } from '../../types';
import { useHome } from '../../hooks/tabs/useHome';
import { usePostCard } from '../../hooks/tabs/usePostCard';
import GlassSurface from '@/components/LiquidGlass/GlassSurface';
import GlassBadge from '@/components/LiquidGlass/GlassBadge';
import PressableCard from '@/components/PressableCard';
import { useTabBarClearance } from '@/components/LiquidGlass/TabBarClearance';
import { useGarmentTypes } from '../../garment-types/context';
import { cloudinaryImageUrl } from '../../utils/cloudinaryImage';
import { formatLikeCount } from '../../utils/format';

const COLORS = {
  background: '#FCFAF8',
  burgundy: '#A81245',
  text: '#292724',
  secondary: '#6E6B68',
  border: '#EAE6E1',
  champagne: '#DCC7A8',
  botanical: '#3D6B52',
};

const SWATCH_COLORS = [
  COLORS.champagne,
  COLORS.burgundy,
  COLORS.text,
  COLORS.secondary,
  COLORS.border,
  '#A09B95',
];

function EditorialMark() {
  return (
    <View
      className="flex-row items-center gap-2"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View className="h-px w-7 bg-beige" />
      <View className="h-1 w-1 rounded-full bg-brand" />
      <View className="h-px w-7 bg-beige" />
    </View>
  );
}

function LoadingState() {
  return (
    <View className="items-center py-16">
      <View className="mb-5 h-14 w-14 items-center justify-center rounded-full border border-line bg-white">
        <Sparkles size={22} color={COLORS.burgundy} strokeWidth={1.4} />
      </View>

      <ActivityIndicator color={COLORS.burgundy} size="small" />

      <Text className="mt-4 font-['Lora-Italic'] text-[18px] text-ink-secondary">
        Preparando la selección…
      </Text>

      <View className="mt-4 h-px w-12 bg-beige" />
    </View>
  );
}

function EmptyState({
  activeFilter,
  activeCategoryId,
}: {
  activeFilter: string;
  activeCategoryId: string | number | null | undefined;
}) {
  return (
    <View className="mx-[18px] items-center rounded-[22px] border border-line bg-white px-6 py-10">
      <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-screen">
        <Heart size={27} color={COLORS.burgundy} strokeWidth={1.3} />
      </View>

      <EditorialMark />

      <Text className="mt-5 text-center font-['Lora-Italic'] text-[24px] leading-8 text-ink">
        Un espacio para tu estilo
      </Text>

      <Text className="mt-2 text-center text-[13px] leading-5 text-ink-secondary">
        {activeCategoryId
          ? `Todavía no hay outfits en "${activeFilter}".`
          : 'Aún no hay outfits publicados. Vuelve pronto para descubrir nuevas ideas.'}
      </Text>
    </View>
  );
}

export default function Home() {
  const {
    loading,
    error,
    filters,
    activeFilter,
    setActiveFilter,
    activeCategoryId,
    displayedPosts,
    featuredPost,
  } = useHome();

  const clearance = useTabBarClearance();

  const showFeed = !loading && !error;

  return (
    <View className="flex-1 bg-screen">
      <FlatList
        className="flex-1"
        data={showFeed ? displayedPosts : []}
        numColumns={2}
        initialNumToRender={6}
        maxToRenderPerBatch={4}
        updateCellsBatchingPeriod={50}
        windowSize={7}
        keyExtractor={(post) => post.id}
        columnWrapperStyle={{ gap: 13, paddingHorizontal: 18 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: clearance }}
        renderItem={({ item, index }) => (
          <View className="flex-1 pb-5">
            <FeedCard
              post={item}
              swatchColor={SWATCH_COLORS[index % SWATCH_COLORS.length]}
            />
          </View>
        )}
        ListHeaderComponent={
          <View>
            {/* Encabezado editorial */}
            <View className="px-[18px] pt-2">
              <ScreenHeader title="Hibirio" />

              <View className="mb-5 mt-3">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="font-['Lora-Italic'] text-[30px] leading-[37px] text-ink">
                      Viste tu esencia.
                    </Text>

                    <Text className="mt-2 max-w-[280px] text-[13px] leading-5 text-ink-secondary">
                      Inspiración, tendencias y looks que cuentan tu historia.
                    </Text>
                  </View>

                  <View className="mt-1 h-11 w-11 items-center justify-center rounded-full border border-line bg-white">
                    <Sparkles
                      size={19}
                      color={COLORS.burgundy}
                      strokeWidth={1.4}
                    />
                  </View>
                </View>

                <View className="mt-5 flex-row items-center gap-2">
                  <EditorialMark />

                  <Text className="text-[9px] font-semibold uppercase tracking-[0.2em] text-ink-secondary">
                    HIBIRIO · THE EDIT
                  </Text>

                  <View className="h-px flex-1 bg-line" />
                </View>
              </View>
            </View>

            {/* Filtros */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-2 px-[18px] pb-5 pt-1"
            >
              {filters.map((filter) => {
                const active = filter === activeFilter;

                return (
                  <Pressable
                    key={filter}
                    onPress={() => setActiveFilter(filter)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    className={`items-center justify-center rounded-full px-[17px] py-[10px] ${
                      active
                        ? 'bg-brand'
                        : 'border border-line bg-white'
                    }`}
                  >
                    <Text
                      className={`text-[12px] font-semibold ${
                        active ? 'text-white' : 'text-ink-secondary'
                      }`}
                    >
                      {filter}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Error */}
            {!!error && (
              <View className="mx-[18px] rounded-2xl border border-red-200 bg-red-50 p-4">
                <Text className="text-center text-[13px] leading-5 text-red-700">
                  {error}
                </Text>
              </View>
            )}

            {/* Feed */}
            {showFeed && displayedPosts.length > 0 && (
              <View className="mb-4 flex-row items-end justify-between px-[18px] pt-1">
                <View>
                  <Text className="font-['Lora-Italic'] text-[23px] text-ink">
                    Para inspirarte
                  </Text>

                  <Text className="mt-1 text-[11px] tracking-[0.04em] text-ink-secondary">
                    UNA SELECCIÓN DE LA COMUNIDAD
                  </Text>
                </View>

                <View className="mb-1 h-px w-10 bg-beige" />
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <LoadingState />
          ) : error ? undefined : (
            <EmptyState
              activeFilter={activeFilter}
              activeCategoryId={activeCategoryId}
            />
          )
        }
        ListFooterComponent={
          showFeed && featuredPost ? (
            <View className="mt-7 px-[18px]">
              <EditorialSpread post={featuredPost} />
            </View>
          ) : undefined
        }
      />
    </View>
  );
}

function FeedCard({
  post,
  swatchColor,
}: {
  post: Post;
  swatchColor: string;
}) {
  const { openPost, liked, likesCount, toggleLike } = usePostCard(post);
  const { labelOf } = useGarmentTypes();
  const garmentType = labelOf(post.garmentTypeId);
  const image = cloudinaryImageUrl(post.image, 600);

  return (
    <PressableCard
      onPress={openPost}
      accessibilityRole="button"
      accessibilityLabel={`Abrir outfit: ${post.title}`}
      style={{ marginBottom: 4 }}
    >
      <View
        className="overflow-hidden rounded-[16px] bg-line"
        style={{
          shadowColor: '#292724',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.09,
          shadowRadius: 10,
          elevation: 3,
        }}
      >
        <Image
          source={{ uri: image }}
          className="h-[220px] w-full"
          resizeMode="cover"
        />

        {!!garmentType && (
          <View className="absolute left-2.5 top-2.5">
            <GlassBadge
              label={garmentType}
              variant="garment"
            />
          </View>
        )}

        {/* Superficie translúcida compatible con web */}
        <View
          style={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            right: 8,
            borderRadius: 999,
            paddingHorizontal: 10,
            paddingVertical: 7,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(41, 39, 36, 0.78)',
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              paddingRight: 8,
              fontSize: 11,
              fontWeight: '600',
              color: '#FFFFFF',
            }}
          >
            {post.title}
          </Text>

          <Pressable
            onPress={(event) => {
              event.stopPropagation();
              toggleLike();
            }}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={liked ? 'Quitar me gusta' : 'Dar me gusta'}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Heart
              size={14}
              color="#FFFFFF"
              fill={liked ? '#FFFFFF' : 'transparent'}
              strokeWidth={1.8}
            />

            <Text
              style={{
                fontSize: 10,
                fontWeight: '600',
                color: '#FFFFFF',
              }}
            >
              {formatLikeCount(likesCount)}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Muestra de color decorativa */}
      <View
        style={{
          position: 'absolute',
          bottom: -6,
          left: -5,
          width: 22,
          height: 22,
          borderRadius: 11,
          borderWidth: 2,
          borderColor: '#FFFFFF',
          backgroundColor: swatchColor,
          shadowColor: '#292724',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 2,
        }}
      />
    </PressableCard>
  );
}

function EditorialSpread({ post }: { post: Post }) {
  const { openPost } = usePostCard(post);
  const { labelOf } = useGarmentTypes();
  const garmentType = labelOf(post.garmentTypeId);
  const image = cloudinaryImageUrl(post.image, 1200);

  return (
    <View>
      <View className="mb-4 flex-row items-center gap-2">
        <EditorialMark />

        <Text className="text-[9px] font-semibold uppercase tracking-[0.2em] text-ink-secondary">
          HIBIRIO · EDITOR'S CHOICE
        </Text>

        <View className="h-px flex-1 bg-line" />
      </View>

      <PressableCard
        onPress={openPost}
        accessibilityRole="button"
        accessibilityLabel={`Ver selección editorial: ${post.title}`}
        className="overflow-hidden rounded-card bg-ink"
        style={{
          shadowColor: '#292724',
          shadowOffset: { width: 0, height: 7 },
          shadowOpacity: 0.12,
          shadowRadius: 14,
          elevation: 4,
        }}
      >
        <Image
          source={{ uri: image }}
          className="h-[280px] w-full"
          resizeMode="cover"
        />

        <View className="absolute inset-0 bg-black/20" />

        {!!garmentType && (
          <View className="absolute left-3 top-3">
            <GlassBadge
              label={garmentType}
              variant="garment"
            />
          </View>
        )}

        {/* Liquid Glass se conserva en la selección editorial */}
        <GlassSurface
          intensity={35}
          tintColor="rgba(41, 39, 36, 0.52)"
          style={{
            position: 'absolute',
            left: 10,
            right: 10,
            bottom: 10,
            borderRadius: 16,
            paddingHorizontal: 15,
            paddingVertical: 14,
          }}
        >
          <Text className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-beige">
            La mirada de Hibirio
          </Text>

          <Text className="font-['Lora-Italic'] text-[20px] leading-[27px] text-white">
            {post.description || 'Un look que merece un lugar en la editorial.'}
          </Text>

          <View className="mt-3 flex-row items-center justify-between">
            <Text
              numberOfLines={1}
              className="flex-1 pr-3 text-[12px] font-semibold text-white"
            >
              {post.title}
            </Text>

            <View className="rounded-full bg-brand px-3 py-2">
              <Text className="text-[9px] font-bold uppercase tracking-[0.08em] text-white">
                Ver outfit
              </Text>
            </View>
          </View>
        </GlassSurface>
      </PressableCard>
    </View>
  );
}
