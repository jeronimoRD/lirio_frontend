import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Heart } from 'lucide-react-native';

import { getPost } from '../../src/api/posts';
import type { Post } from '../../src/types';

export default function PostDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    async function loadPost() {
      if (!id) return;

      try {
        const data = await getPost(id);
        setPost(data);
      } catch (error) {
        console.log('ERROR AL CARGAR POST:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FCFAF8]">
        <ActivityIndicator color="#A81245" />
      </View>
    );
  }

  if (!post) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FCFAF8] px-6">
        <Text className="text-center text-[#6E6B68]">
          No se pudo encontrar esta publicación.
        </Text>

        <Pressable
          onPress={() => router.back()}
          className="mt-5 rounded-full bg-[#A81245] px-6 py-3"
        >
          <Text className="font-semibold text-white">Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FCFAF8]">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-10"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pb-4 pt-14">
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ArrowLeft size={22} color="#A81245" />
          </Pressable>

          <Text className="font-['Lora-Italic'] text-xl text-[#A81245]">
            Publicación
          </Text>

          <View className="w-[22px]" />
        </View>

        {/* Imagen */}
        <Image
          source={{ uri: post.image }}
          className="h-[450px] w-full"
          resizeMode="cover"
        />

        {/* Contenido */}
        <View className="gap-5 px-6 pt-6">
          <View>
            <Text className="font-['Lora-Regular'] text-[28px] leading-9 text-[#292724]">
              {post.title}
            </Text>
          </View>

          <Text className="text-[15px] leading-6 text-[#6E6B68]">
            {post.description}
          </Text>

          {/* Likes */}
          <View className="flex-row items-center">
            <Pressable
              onPress={() => setLiked(!liked)}
              className="flex-row items-center gap-2 rounded-full border border-[#EAE6E1] bg-white px-4 py-2.5"
            >
              <Heart
                size={20}
                color="#A81245"
                fill={liked ? '#A81245' : 'none'}
              />

              <Text className="text-sm font-semibold text-[#292724]">
                {liked ? '1' : '0'} Me gusta
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}