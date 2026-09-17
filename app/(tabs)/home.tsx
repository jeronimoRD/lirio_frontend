import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { Heart } from 'lucide-react-native';

import { getFeedPosts } from '../../src/api/posts';
import { getCategories } from '../../src/api/categories';
import { useFavorites } from '../../src/favorites/context';
import type { Post, Category } from '../../src/types';
import ScreenHeader from '@/components/ScreenHeader';
import { useRouter } from 'expo-router';

const SWATCH_COLORS = ['#DCC7A8', '#A81245', '#292724', '#6E6B68', '#EAE6E1', '#A09B95'];

export default function Home({ active = true }: { active?: boolean }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('For You');

  useEffect(() => {
    if (!active) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      getCategories()
        .then((allCategories) => {
          if (cancelled) return;
          setCategories(allCategories);
        })
        .catch(() => {});

      try {
        const allPosts = await getFeedPosts();
        if (cancelled) return;
        setPosts(allPosts);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'No se pudo cargar el feed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [active]);

  const filters = ['For You', ...categories.map((category) => category.name)];

  const leftColumn = posts.filter((_, i) => i % 2 === 0);
  const rightColumn = posts.filter((_, i) => i % 2 === 1);

  const showSpinner = loading && posts.length === 0;

  return (
    <View className="flex-1 bg-[#FCFAF8]">
      <View className="items-center border-b border-[#EAE6E1] px-5 pb-3 pt-14">
        <ScreenHeader title="Hibirio" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-24"
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
                  active ? 'bg-[#DCC7A8]' : 'border border-[#EAE6E1]'
                }`}>
                <Text
                  className={`text-[13px] font-semibold ${
                    active ? 'text-[#292724]' : 'text-[#6E6B68]'
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

        {!loading && !error && posts.length === 0 && (
          <View className="mx-4 rounded-2xl border border-[#EAE6E1] bg-white p-6">
            <Text className="text-center text-sm text-[#6E6B68]">
              Aún no hay outfits publicados.
            </Text>
          </View>
        )}

        {!error && posts.length > 0 && (
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

            {posts[0] && <EditorialSpread post={posts[0]} />}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function FeedCard({ post, swatchColor }: { post: Post; swatchColor: string }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(post.id);
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/(upload)/[id]',
          params: { id: post.id },
        })
      }>
      <Image
        source={{ uri: post.image }}
        className="w-full rounded-[14px]"
        style={{ height: 220 }}
        resizeMode="cover"
      />

      <View
        className="absolute bottom-2 left-2 right-2 flex-row items-center justify-between rounded-full px-2 py-1.5"
        style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
        <Text numberOfLines={1} className="flex-1 text-[11px] font-semibold text-white">
          {post.title}
        </Text>

        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            toggleFavorite(post.id);
          }}
          hitSlop={8}>
          <Heart size={14} color="#FFFFFF" fill={favorited ? '#FFFFFF' : 'none'} />
        </Pressable>
      </View>

      <View
        className="absolute -left-1 rounded-full border-2 border-white"
        style={{
          bottom: -6,
          width: 22,
          height: 22,
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
      <Image
        source={{ uri: post.image }}
        className="w-full"
        style={{ height: 260 }}
        resizeMode="cover"
      />
      <View
        className="absolute inset-0 justify-end p-5"
        style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}>
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
