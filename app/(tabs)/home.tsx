import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  View,
} from 'react-native';

import { getPosts } from '../../src/api/posts';
import type { Post } from '../../src/types';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.log('Error cargando posts:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FCFAF8]">
        <ActivityIndicator size="large" />
        <Text className="mt-3 text-[#1A1A1A]">
          Cargando posts...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FCFAF8]">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 16,
        }}
        ListHeaderComponent={
          <Text className="mb-5 text-2xl font-bold text-[#1A1A1A]">
            Publicaciones
          </Text>
        }
        ListEmptyComponent={
          <Text className="text-center text-[#666666]">
            No hay publicaciones todavía.
          </Text>
        }
        renderItem={({ item }) => (
          <View className="mb-6 overflow-hidden rounded-2xl border border-[#F2C8D5] bg-[#FFF0F4]">
            <Image
              source={{ uri: item.image }}
              className="h-64 w-full"
              resizeMode="cover"
            />

            <View className="p-4">
              <Text className="text-xl font-bold text-[#1A1A1A]">
                {item.title}
              </Text>

              <Text className="mt-2 text-base text-[#555555]">
                {item.description}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}