import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { Heart } from 'lucide-react-native';

import ScreenHeader from '../ScreenHeader';
import type { Post } from '../../types';
import { useHome } from '../../hooks/tabs/useHome';
import { usePostCard } from '../../hooks/tabs/usePostCard';
import GlassSurface from '@/components/LiquidGlass/GlassSurface';
import { formatLikeCount } from '../../utils/format';

const SWATCH_COLORS = ['#DCC7A8', '#A81245', '#292724', '#6E6B68', '#EAE6E1', '#A09B95'];

export default function Home() {
  const {
    loading,
    error,
    showSpinner,
    filters,
    activeFilter,
    setActiveFilter,
    activeCategoryId,
    displayedPosts,
    featuredPost,
    leftColumn,
    rightColumn,
  } = useHome();
  

  return (
    <View className="flex-1 bg-[#FCFAF8]">
      <ScreenHeader title="Hibirio" />

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-32"
        showsVerticalScrollIndicator={false}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 px-4 pb-3 pt-4">
          {filters.map((filter) => {
            const active = filter === activeFilter;
            return (
              <Pressable
                key={filter}
                onPress={() => setActiveFilter(filter)}
                className={`items-center justify-center rounded-full px-4 py-2 ${
                  active ? 'bg-[#A81245]' : 'border border-[#EAE6E1]'
                }`}>
                <Text
                  className={`text-[13px] font-semibold ${
                    active ? 'text-white' : 'text-[#6E6B68]'
                  }`}>
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {error && (
          <View className="mx-4 rounded-xl bg-red-50 p-4">
            <Text className="text-center text-sm font-medium text-red-700">{error}</Text>
          </View>
        )}

        {showSpinner && (
          <View className="items-center py-16">
            <ActivityIndicator color="#A81245" />
          </View>
        )}

        {!loading && !error && displayedPosts.length === 0 && (
          <View className="mx-4 rounded-2xl border border-[#EAE6E1] bg-white p-6">
            <Text className="text-center text-sm text-[#6E6B68]">
              {activeCategoryId
                ? `Sin outfits en "${activeFilter}" todavía.`
                : 'Aún no hay outfits publicados.'}
            </Text>
          </View>
        )}

        {!loading && !error && displayedPosts.length > 0 && (
          <View className="gap-4 px-4 pt-1">
            <View className="flex-row gap-3">
              {[leftColumn, rightColumn].map((column, colIndex) => (
                <View key={colIndex} className="flex-1 gap-4">
                  {column.map((post, i) => {
                    const globalIndex = colIndex + i * 2;
                    const swatch = SWATCH_COLORS[globalIndex % SWATCH_COLORS.length];
                    return <FeedCard key={post.id} post={post} swatchColor={swatch} />;
                  })}
                </View>
              ))}
            </View>

            {featuredPost && <EditorialSpread post={featuredPost} />}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function FeedCard({ post, swatchColor }: { post: Post; swatchColor: string }) {
  const { openPost, liked, likesCount, toggleLike } = usePostCard(post);

  return (
    <Pressable onPress={openPost}>
      <Image
        source={{ uri: post.image }}
        className="h-[220px] w-full rounded-[14px]"
        resizeMode="cover"
      />

      <GlassSurface
        intensity={30}
        tintColor="rgba(41, 39, 36, 0.28)"
        style={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          right: 8,
          borderRadius: 999,
          paddingHorizontal: 10,
          paddingVertical: 6,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text numberOfLines={1} className="flex-1 text-[11px] font-semibold text-white">
          {post.title}
        </Text>

        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            toggleLike();
          }}
          hitSlop={8}
          className="flex-row items-center gap-1">
          <Heart size={14} color="#FFFFFF" fill={liked ? '#FFFFFF' : 'none'} />
          <Text className="text-[10px] font-semibold text-white">{formatLikeCount(likesCount)}</Text>
        </Pressable>
      </GlassSurface>

      <View
        className="absolute -bottom-1.5 -left-1 h-[22px] w-[22px] rounded-full border-2 border-white"
        style={{
          backgroundColor: swatchColor,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
        }}
      />
    </Pressable>
  );
}

function EditorialSpread({ post }: { post: Post }) {
  return (
    <View className="overflow-hidden rounded-2xl">
      <Image source={{ uri: post.image }} className="h-[260px] w-full" resizeMode="cover" />
      <View className="absolute inset-0 justify-end bg-black/35 p-5">
        <Text className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#DCC7A8]">
          {"Editor's choice"}
        </Text>
        <Text className="mb-2 font-['Lora-Italic'] text-xl leading-6 text-white">
          {post.description || 'Un look que vale la pena destacar.'}
        </Text>
        <View className="flex-row items-center justify-between">
          <Text className="font-['Lora-Italic'] text-xl text-white">{post.title}</Text>
          <Pressable className="rounded-full bg-[#A81245] px-3 py-1.5">
            <Text className="text-[11px] font-bold uppercase text-white">Ver spread</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
