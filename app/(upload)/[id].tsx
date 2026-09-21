import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Flag, Heart } from 'lucide-react-native';

import { getPost } from '../../src/api/posts';
import { getUserById } from '../../src/api/users';
import { useSession } from '../../src/session/context';
import type { Post, User } from '../../src/types';
import { initialsOf } from '../../src/utils/strings';
import ReportModal from '../../src/components/ReportModal';

const SWATCH_COLORS = ['#DCC7A8', '#A81245', '#3D6B52'];

const imageShadow = {
  shadowColor: '#292724',
  shadowOffset: { width: 0, height: 12 },
  shadowRadius: 24,
  shadowOpacity: 0.18,
  elevation: 8,
};

const floatingButtonShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 6,
  shadowOpacity: 0.15,
  elevation: 3,
};

export default function PostDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [reportVisible, setReportVisible] = useState(false);
  const { user: me } = useSession();

  useEffect(() => {
    async function loadPost() {
      if (!id) return;

      try {
        const data = await getPost(id);
        setPost(data);

        // El autor se busca aparte: si falla (usuario borrado, etc.) el
        // post igual se muestra, solo sin el nombre de quien lo publicó.
        try {
          const user = await getUserById(data.userId);
          setAuthor(user);
        } catch (error) {
          console.log('ERROR AL CARGAR AUTOR:', error);
        }
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
        <Text className="text-center text-[#6E6B68]">No se pudo encontrar esta publicación.</Text>

        <Pressable
          onPress={() => router.back()}
          className="mt-5 rounded-full bg-[#A81245] px-6 py-3">
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
        contentContainerClassName="pb-10 pt-14">
        {/* Imagen como tarjeta flotante, con margen y sombra — no pegada al borde */}
        <View className="px-5">
          <View className="overflow-hidden rounded-[24px]" style={imageShadow}>
            <Image
              source={{ uri: post.image }}
              className="w-full"
              style={{ aspectRatio: 4 / 5 }}
              resizeMode="cover"
            />

            <Pressable
              onPress={() => router.back()}
              hitSlop={8}
              className="absolute left-4 top-4 h-10 w-10 items-center justify-center rounded-full"
              style={[{ backgroundColor: 'rgba(255,255,255,0.85)' }, floatingButtonShadow]}>
              <ArrowLeft size={20} color="#292724" />
            </Pressable>

            <Pressable
              onPress={() => setLiked(!liked)}
              hitSlop={8}
              className="absolute right-4 top-4 h-10 w-10 items-center justify-center rounded-full"
              style={[{ backgroundColor: 'rgba(255,255,255,0.85)' }, floatingButtonShadow]}>
              <Heart size={18} color="#A81245" fill={liked ? '#A81245' : 'none'} />
            </Pressable>
          </View>
        </View>

        {/* Contenido debajo de la tarjeta */}
        <View className="gap-5 px-6 pt-6">
          <Text className="font-['Lora-Italic'] text-[26px] leading-9 text-[#292724]">
            {post.title}
          </Text>

          <View className="flex-row items-center gap-2.5">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-[#F4EEE7]">
              <Text className="text-xs font-bold text-[#A81245]">
                {author ? initialsOf(author.name) : '??'}
              </Text>
            </View>
            <Text className="text-sm font-medium text-[#6E6B68]">
              {author ? `Publicado por ${author.name}` : 'Publicado por un usuario'}
            </Text>
          </View>

          {post.userId !== me?.id && (
            <Pressable
              onPress={() => setReportVisible(true)}
              hitSlop={8}
              className="flex-row items-center gap-1.5 self-start">
              <Flag size={14} color="#A09B95" />
              <Text className="text-xs font-semibold text-[#A09B95]">Reportar publicación</Text>
            </Pressable>
          )}

          <Text className="text-[15px] leading-6 text-[#6E6B68]">{post.description}</Text>

          <Text className="text-sm font-semibold text-[#292724]">{liked ? '1' : '0'} Me gusta</Text>

          <View className="gap-2">
            <Text className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#A09B95]">
              Colores del look
            </Text>
            <View className="flex-row gap-2">
              {SWATCH_COLORS.map((color) => (
                <View
                  key={color}
                  className="h-8 w-8 rounded-full border-2 border-white"
                  style={{
                    backgroundColor: color,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 4,
                  }}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <ReportModal
        visible={reportVisible}
        targetType="POST"
        targetId={post.id}
        onClose={() => setReportVisible(false)}
      />
    </View>
  );
}
