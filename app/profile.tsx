import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { getPosts } from '../src/api/posts';
import Button from '../src/components/Button';
import { useSession } from '../src/session/context';
import type { Post, Role } from '../src/types';

const ROLE_STYLE: Record<Role, { label: string; className: string }> = {
  USER: { label: 'Usuario', className: 'bg-blue-100 text-blue-700' },
  ADMIN: { label: 'Administrador', className: 'bg-amber-100 text-amber-800' },
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

export default function Profile() {
  const { user, signOut } = useSession();
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const role = ROLE_STYLE[user.role];

  return (
    <ScrollView
      className="flex-1 bg-neutral-50"
      contentContainerClassName="px-6 py-10"
    >
      <View className="mx-auto w-full max-w-md">
        <Text className="mb-6 text-3xl font-bold text-neutral-900">
          Mi perfil
        </Text>

        {/* Tarjeta del usuario */}
        <View className="mb-6 items-center rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-green-500">
            <Text className="text-2xl font-bold text-white">
              {initialsOf(user.name)}
            </Text>
          </View>

          <Text className="mt-4 text-xl font-bold text-neutral-900">
            {user.name}
          </Text>
          <Text className="mt-1 text-sm text-neutral-500">{user.email}</Text>

          <View className={`mt-3 rounded-full px-3 py-1 ${role.className}`}>
            <Text className="text-xs font-semibold">{role.label}</Text>
          </View>
        </View>

        {/* Estadísticas */}
        <View className="mb-6 flex-row gap-3">
          <View className="flex-1 items-center rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
            <Text className="text-2xl font-bold text-neutral-900">
              {posts.length}
            </Text>
            <Text className="mt-1 text-xs font-medium text-neutral-500">
              Publicaciones
            </Text>
          </View>
        </View>

        {/* Mis publicaciones */}
        <Text className="mb-3 text-base font-semibold text-neutral-900">
          Mis publicaciones
        </Text>

        {error && (
          <View className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4">
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

        {!loading && !error && posts.length === 0 && (
          <View className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <Text className="text-center text-sm text-neutral-500">
              Aún no tienes publicaciones.
            </Text>
          </View>
        )}

        {!loading &&
          !error &&
          posts.map((post) => (
            <View
              key={post.id}
              className="mb-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
            >
              <Image
                source={{ uri: post.image }}
                className="h-40 w-full"
                resizeMode="cover"
              />
              <View className="p-4">
                <Text className="text-base font-semibold text-neutral-900">
                  {post.title}
                </Text>
                <Text
                  className="mt-1 text-sm text-neutral-500"
                  numberOfLines={3}
                >
                  {post.description}
                </Text>
                <Text className="mt-2 text-xs text-neutral-400">
                  {new Date(post.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))}

        <View className="mt-4 gap-3">
          <Button
            text="Configuración del perfil"
            secondary
            onPress={() => router.push('/settings')}
          />
          <Button text="Cerrar sesión" secondary onPress={signOut} />
        </View>
      </View>
    </ScrollView>
  );
}