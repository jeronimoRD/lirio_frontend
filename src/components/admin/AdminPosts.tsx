import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AdminBrandHeader from './AdminBrandHeader';
import ConfirmModal from '../ConfirmModal';
import { cardShadow } from '../../constants/theme';
import { useAdminPosts } from '../../hooks/admin/useAdminPosts';

export default function AdminPosts() {
  const insets = useSafeAreaInsets();
  const {
    posts,
    usersById,
    loading,
    error,
    busyId,
    pendingDelete,
    requestDelete,
    cancelDelete,
    onDelete,
    openPost,
  } = useAdminPosts();

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
                  <Pressable onPress={() => openPost(post)} className="flex-row items-center gap-3">
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
                    onPress={() => requestDelete(post)}
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
        onCancel={cancelDelete}
      />
    </View>
  );
}
