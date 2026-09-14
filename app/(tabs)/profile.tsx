import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { getPosts } from '../../src/api/posts';
import { useSession } from '../../src/session/context';
import type { Post, Role } from '../../src/types';

// Etiqueta legible por rol. Se usa como "bio" bajo el nombre en vez de un
// badge aparte, para acercarse al layout del diseño (nombre + línea de texto
// debajo), sin perder el dato de rol que ya mostraba la versión anterior.
const ROLE_LABEL: Record<Role, string> = {
  USER: 'Usuario',
  ADMIN: 'Administrador',
};

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

// TODO: solo visual por ahora — "Guardado" no tiene datos propios todavía
// (los posts guardados no existen en el backend), así que el tab cambia el
// estado local pero no filtra nada real hasta que exista esa API.
type GalleryTab = 'outfits' | 'saved';

// Alturas alternadas para que la galería de dos columnas se vea tipo
// masonry sin tener que medir cada imagen real.
const COLUMN_HEIGHTS = [174, 112, 164, 102];

export default function Profile() {
  const { user, signOut } = useSession();
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<GalleryTab>('outfits');

  useEffect(() => {
    if (!user) return;

    let active = true;

    getPosts()
      .then((all) => {
        if (active) {
          setPosts(all.filter((post) => post.userId === user.id));
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : 'No se pudieron cargar tus publicaciones',
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [user]);

  if (!user) {
    return <Redirect href="/(login)/login" />;
  }

  // Dos columnas para el efecto masonry, alternando por índice.
  const leftColumn = posts.filter((_, i) => i % 2 === 0);
  const rightColumn = posts.filter((_, i) => i % 2 === 1);

  return (
    <ScrollView
      className="flex-1 bg-[#FCFAF8]"
      contentContainerClassName="items-center px-5 pb-10 pt-7"
    >
      <View className="w-full max-w-[390px] gap-4">
        {/* Profile photo */}
        <View className="items-center">
          <View
            className="h-[88px] w-[88px] items-center justify-center rounded-full border-[3px] border-white bg-[#DCC7A8]"
            style={{
              shadowColor: 'rgba(92, 75, 54, 0.12)',
              shadowOffset: { width: 0, height: 7 },
              shadowRadius: 20,
              shadowOpacity: 1,
            }}
          >
            <Text className="text-2xl font-bold text-white">
              {initialsOf(user.name)}
            </Text>
          </View>
        </View>

        {/* Identity */}
        <View className="items-center gap-1.5">
          <Text className="font-['Lora'] text-[26px] leading-[33px] text-[#292724]">
            {user.name}
          </Text>
          <Text className="text-center text-xs leading-[145%] text-[#6E6B68]">
            {ROLE_LABEL[user.role]} · {user.email}
          </Text>
        </View>

        {/* Profile stats */}
        {/* TODO: Followers/Following no existen en el backend todavía — solo
            se muestra "Outfits", que sí viene de datos reales (posts.length). */}
        <View className="flex-row items-start gap-2">
          <View className="flex-1 items-center gap-[3px]">
            <Text className="text-base font-bold leading-[19px] text-[#292724]">
              {posts.length}
            </Text>
            <Text className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6E6B68]">
              Outfits
            </Text>
          </View>
        </View>

        {/* Profile actions */}
        <View className="flex-row gap-2.5">
          <Pressable
            // TODO: crear ruta /edit-profile — todavía no existe la pantalla.
            onPress={() => router.push('/edit-profile' as any)}
            className="h-[42px] flex-1 items-center justify-center rounded-full bg-[#DCC7A8]"
          >
            <Text className="text-[13px] font-semibold text-white">
              Editar perfil
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/settings')}
            className="h-[42px] flex-1 items-center justify-center rounded-full border border-[#EAE6E1]"
          >
            <Text className="text-[13px] font-semibold text-[#292724]">
              Configuración
            </Text>
          </Pressable>
        </View>

        {/* Outfit tabs */}
        <View className="flex-row">
          <Pressable
            onPress={() => setActiveTab('outfits')}
            className="flex-1 items-center justify-between gap-2 pb-1"
          >
            <Text
              className={`text-[13px] leading-4 ${
                activeTab === 'outfits'
                  ? 'font-semibold text-[#292724]'
                  : 'font-normal text-[#6E6B68]'
              }`}
            >
              Mis outfits
            </Text>
            {activeTab === 'outfits' && (
              <View className="h-[2px] w-[74px] bg-[#DCC7A8]" />
            )}
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('saved')}
            className="flex-1 items-center justify-between gap-2 pb-1"
          >
            <Text
              className={`text-[13px] leading-4 ${
                activeTab === 'saved'
                  ? 'font-semibold text-[#292724]'
                  : 'font-normal text-[#6E6B68]'
              }`}
            >
              Guardado
            </Text>
            {activeTab === 'saved' && (
              <View className="h-[2px] w-[74px] bg-[#DCC7A8]" />
            )}
          </Pressable>
        </View>

        {/* MENSAJE DE ERROR */}
        {error && (
          <View className="rounded-xl bg-red-50 p-4">
            <Text className="text-center text-sm font-medium text-red-700">
              {error}
            </Text>
          </View>
        )}

        {loading && (
          <View className="items-center py-10">
            <ActivityIndicator />
          </View>
        )}

        {/* Outfit gallery */}
        {!loading && !error && activeTab === 'outfits' && (
          posts.length === 0 ? (
            <View className="rounded-2xl border border-[#EAE6E1] bg-white p-6">
              <Text className="text-center text-sm text-[#6E6B68]">
                Aún no tienes outfits publicados.
              </Text>
            </View>
          ) : (
            <View className="flex-row gap-2.5">
              {[leftColumn, rightColumn].map((column, colIndex) => (
                <View key={colIndex} className="flex-1 gap-2.5">
                  {column.map((post, i) => (
                    <Image
                      key={post.id}
                      source={{ uri: post.image }}
                      style={{
                        width: '100%',
                        height: COLUMN_HEIGHTS[(colIndex + i * 2) % COLUMN_HEIGHTS.length],
                        borderRadius: 14,
                      }}
                      resizeMode="cover"
                    />
                  ))}
                </View>
              ))}
            </View>
          )
        )}

        {!loading && !error && activeTab === 'saved' && (
          <View className="rounded-2xl border border-[#EAE6E1] bg-white p-6">
            <Text className="text-center text-sm text-[#6E6B68]">
              Próximamente: outfits guardados.
            </Text>
          </View>
        )}

        {/* Cerrar sesión */}
        <Pressable
          onPress={signOut}
          className="mt-4 h-12 w-full items-center justify-center rounded-full border border-red-200"
        >
          <Text className="text-sm font-semibold text-red-600">
            Cerrar sesión
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}