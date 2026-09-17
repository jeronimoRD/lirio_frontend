import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { MoreVertical } from 'lucide-react-native';
import type { Post } from '@/types';

type FeedCardProps = {
  post: Post;
  swatchColor?: string;
  showMenu?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function FeedCard({
  post,
  swatchColor,
  showMenu,
  onEdit,
  onDelete,
}: FeedCardProps) {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <Pressable
      onPress={() => router.push(`/${post.id}`)}
      className="overflow-hidden rounded-[14px]"
    >
      <Image
        source={{ uri: post.image }}
        className="w-full"
        style={{ height: 200 }}
        resizeMode="cover"
      />

      {showMenu && (
        <>
          <Pressable
            onPress={() => setOpenMenu((prev) => !prev)}
            hitSlop={8}
            className="absolute right-2 top-2 h-8 w-8 items-center justify-center rounded-full bg-black/35"
          >
            <MoreVertical size={18} color="#FFFFFF" />
          </Pressable>

          {openMenu && (
            <View className="absolute right-2 top-11 w-28 overflow-hidden rounded-xl border border-[#EAE6E1] bg-white">
              {onEdit && (
                <Pressable
                  onPress={() => {
                    setOpenMenu(false);
                    onEdit();
                  }}
                  className="px-4 py-3"
                >
                  <Text className="text-sm text-[#292724]">
                    Editar
                  </Text>
                </Pressable>
              )}

              {onDelete && (
                <Pressable
                  onPress={() => {
                    setOpenMenu(false);
                    onDelete();
                  }}
                  className="border-t border-[#EAE6E1] px-4 py-3"
                >
                  <Text className="text-sm text-red-600">
                    Eliminar
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </>
      )}

      <View className="absolute bottom-0 left-0 right-0 bg-black/30 px-2 py-1.5">
        <Text
          numberOfLines={1}
          className="text-[11px] font-semibold text-white"
        >
          {post.title}
        </Text>
      </View>
    </Pressable>
  );
}