import { useRef } from 'react';
import { router } from 'expo-router';
import { Image, Pressable, Text, View, type ViewInstance } from 'react-native';
import { BlurTargetView } from 'expo-blur';
import { MoreVertical } from 'lucide-react-native';
import type { Post } from '@/types';

import { useFeedCard } from '@/hooks/general/useFeedCard';
import PressableCard from '@/components/PressableCard';
import GlassBadge from '@/components/LiquidGlass/GlassBadge';
import { useGarmentTypes } from '../garment-types/context';

type FeedCardProps = {
  post: Post;
  swatchColor?: string;
  showMenu?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function FeedCard({ post, swatchColor, showMenu, onEdit, onDelete }: FeedCardProps) {
  const { openMenu, toggleMenu, closeMenu } = useFeedCard();
  const { labelOf } = useGarmentTypes();
  const imageRef = useRef<ViewInstance | null>(null);
  const garmentType = labelOf(post.garmentTypeId);

  return (
    <PressableCard
      onPress={() => router.push(`/${post.id}`)}
      className="overflow-hidden rounded-[14px]">
      <BlurTargetView ref={imageRef} style={{ height: 200, width: '100%' }}>
        <Image source={{ uri: post.image }} className="h-full w-full" resizeMode="cover" />
      </BlurTargetView>

      {!!garmentType && (
        <View className="absolute left-2 top-2">
          <GlassBadge label={garmentType} variant="garment" blurTarget={imageRef} />
        </View>
      )}

      {showMenu && (
        <>
          <Pressable
            onPress={toggleMenu}
            hitSlop={8}
            className="absolute right-2 top-2 h-8 w-8 items-center justify-center rounded-full bg-black/35">
            <MoreVertical size={18} color="#FFFFFF" />
          </Pressable>

          {openMenu && (
            <View className="absolute right-2 top-11 w-28 overflow-hidden rounded-xl border border-line bg-white">
              {onEdit && (
                <Pressable
                  onPress={() => {
                    closeMenu();
                    onEdit();
                  }}
                  className="px-4 py-3">
                  <Text className="text-sm text-ink">Editar</Text>
                </Pressable>
              )}

              {onDelete && (
                <Pressable
                  onPress={() => {
                    closeMenu();
                    onDelete();
                  }}
                  className="border-t border-line px-4 py-3">
                  <Text className="text-sm text-red-600">Eliminar</Text>
                </Pressable>
              )}
            </View>
          )}
        </>
      )}

      <View className="absolute bottom-0 left-0 right-0 bg-black/30 px-2 py-1.5">
        <Text numberOfLines={1} className="text-[11px] font-semibold text-white">
          {post.title}
        </Text>
      </View>
    </PressableCard>
  );
}
