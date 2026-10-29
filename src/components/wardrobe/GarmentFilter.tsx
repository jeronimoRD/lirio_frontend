import { FlatList, Image, Pressable, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';

import { useGarmentTypes } from '../../garment-types/context';
import type { Post } from '../../types';

export default function GarmentFilter({
  value,
  onChange,
  pieces,
  selectedPostId,
  onSelectPiece,
}: {
  value: string | null;
  onChange: (typeId: string) => void;
  pieces: Post[];
  selectedPostId: string | null;
  onSelectPiece: (post: Post) => void;
}) {
  const { types, labelOf } = useGarmentTypes();

  return (
    <View className="gap-4">
      <View className="flex-row flex-wrap gap-2">
        {types.map((type) => {
          const selected = value === type.id;

          return (
            <Pressable
              key={type.id}
              onPress={() => onChange(type.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={type.name}
              className={`h-12 flex-1 items-center justify-center rounded-full border px-3 ${
                selected ? 'border-brand bg-brand/10' : 'border-line bg-white'
              }`}>
              <Text
                className={`text-sm font-semibold ${
                  selected ? 'text-brand' : 'text-ink-secondary'
                }`}>
                {type.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {value && (
        <View className="gap-2">
          {pieces.length === 0 ? (
            <Text className="text-[12px] leading-5 text-ink-muted">
              No tienes prendas de este tipo en tus publicaciones ni en tus guardados.
            </Text>
          ) : (
            <FlatList
              horizontal
              data={pieces}
              keyExtractor={(post) => post.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10 }}
              renderItem={({ item }) => {
                const selected = item.id === selectedPostId;

                return (
                  <Pressable
                    onPress={() => onSelectPiece(item)}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`${labelOf(value)}: ${item.title}`}
                    className={`w-[64px] overflow-hidden rounded-[12px] border-2 bg-white ${
                      selected ? 'border-brand' : 'border-transparent'
                    }`}>
                    <Image source={{ uri: item.image }} resizeMode="cover" className="h-[80px] w-full" />

                    <View className="items-center justify-center px-1 py-1">
                      {selected ? (
                        <Check size={11} color="#A81245" />
                      ) : (
                        <Text numberOfLines={1} className="text-[9px] text-ink-secondary">
                          {item.title}
                        </Text>
                      )}
                    </View>
                  </Pressable>
                );
              }}
            />
          )}
        </View>
      )}
    </View>
  );
}
