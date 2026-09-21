import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { getAdminUsers } from '../../src/api/admin';
import { deletePost, getPosts } from '../../src/api/posts';
import AdminBrandHeader from '../../src/components/admin/AdminBrandHeader';
import ConfirmModal from '../../src/components/ConfirmModal';
import type { Post, User } from '../../src/types';
import { cardShadow } from '../../src/constants/theme';

export default function AdminPosts() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [posts, setPosts] = useState<Post[]>([]);
  const [usersById, setUsersById] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Post | null>(null);

  useEffect(() => {
    Promise.all([getPosts(), getAdminUsers()])
      .then(([loadedPosts, loadedUsers]) => {
        setPosts(loadedPosts);
        setUsersById(Object.fromEntries(loadedUsers.map((user) => [user.id, user])));
        setError(null);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'No se pudieron cargar las publicaciones')
      )
      .finally(() => setLoading(false));
  }, []);

  const onDelete = async () => {
    const target = pendingDelete;

    if (!target || busyId !== null) return;

    setPendingDelete(null);
    setBusyId(target.id);
    setError(null);

    try {
      await deletePost(target.id);
      setPosts((current) => current.filter((post) => post.id !== target.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar la publicación');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <View className="flex-1 bg-[#FAF8F6]">
      <AdminBrandHeader />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5"
        contentContainerStyle={{ paddingTop: 24, paddingBottom: 24 + insets.bottom }}>
        <View className="mx-auto w-full max-w-md">
          <View className="mb-6">
            <Text className="font-['Lora-Italic'] text-[28px] leading-9 text-[#241E1B]">Posts</Text>
          </View>

          {error && (
            <View className="mb-4 rounded-2xl bg-red-50 p-4">
              <Text className="text-center text-sm font-medium text-red-700">{error}</Text>
            </View>
          )}

          {loading && (
            <View className="items-center py-10">
              <ActivityIndicator color="#A91243" />
            </View>
          )}

          {!loading && !error && posts.length === 0 && (
            <View className="rounded-2xl bg-white p-6" style={cardShadow}>
              <Text className="text-center text-sm text-[#6E6B68]">Aún no hay publicaciones.</Text>
            </View>
          )}

          {!loading &&
            posts.map((post) => {
              const author = usersById[post.userId];
              const busy = busyId === post.id;

              return (
                <View key={post.id} className="mb-3 rounded-2xl bg-white p-4" style={cardShadow}>
                  <Pressable
                    onPress={() =>
                      router.push({ pathname: '/(upload)/[id]', params: { id: post.id } })
                    }
                    className="flex-row items-center gap-3">
                    <Image
                      source={{ uri: post.image }}
                      className="h-14 w-14 rounded-xl"
                      resizeMode="cover"
                    />
                    <View className="flex-1">
                      <Text numberOfLines={1} className="text-sm font-semibold text-[#292724]">
                        {post.title}
                      </Text>
                      <Text numberOfLines={1} className="mt-0.5 text-xs text-[#6E6B68]">
                        {author ? author.name : 'Usuario'} ·{' '}
                        {new Date(post.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </Pressable>

                  <Pressable
                    onPress={() => setPendingDelete(post)}
                    disabled={busy}
                    className="mt-3 h-10 flex-row items-center justify-center gap-2 rounded-2xl border border-[#E9AFA6] bg-[#FBE6E1] active:opacity-80 disabled:opacity-50">
                    <Text className="text-[13px] font-semibold text-[#C2391F]">
                      {busy ? 'Eliminando...' : 'Eliminar'}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
        </View>
      </ScrollView>

      <ConfirmModal
        visible={pendingDelete !== null}
        title="¿Eliminar publicación?"
        message={
          pendingDelete ? `Se eliminará "${pendingDelete.title}" de forma permanente.` : undefined
        }
        confirmLabel="Eliminar"
        danger
        loading={busyId !== null}
        onConfirm={onDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </View>
  );
}
