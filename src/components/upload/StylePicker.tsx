import { Pressable, Text, View } from 'react-native';

import GlassSurface from '@/components/LiquidGlass/GlassSurface';
import type { Category } from '../../types';

export default function StylePicker({
  categories,
  value,
  onToggle,
  error,
}: {
  categories: Category[];
  value: string[];
  onToggle: (id: string) => void;
  error?: string | null;
}) {
  return (
    <View className="gap-2">
      <Text className="text-xs font-semibold uppercase text-[#6E6B68]">Estilos</Text>
      <Text className="text-xs text-[#A39E9A]">Elige uno o varios estilos para este outfit</Text>

      <View className="flex-row flex-wrap gap-2.5">
        {categories.map((style) => {
          const selected = value.includes(style.id);
          return (
            <Pressable
              key={style.id}
              onPress={() => onToggle(style.id)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              className="active:opacity-80"
              style={{
                borderRadius: 999,
                shadowColor: selected ? '#A81245' : '#5C4B36',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: selected ? 0.22 : 0.1,
                shadowRadius: 8,
                elevation: 2,
              }}>
              <GlassSurface
                intensity={30}
                tintColor={selected ? 'rgba(168, 18, 69, 0.16)' : 'rgba(255, 255, 255, 0.55)'}
                style={{
                  height: 38,
                  paddingHorizontal: 16,
                  borderRadius: 999,
                  overflow: 'hidden',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: selected ? 'rgba(168, 18, 69, 0.55)' : 'rgba(255, 255, 255, 0.9)',
                }}>
                <Text
                  className={`text-[13px] font-semibold ${
                    selected ? 'text-[#A81245]' : 'text-[#6E6B68]'
                  }`}>
                  {style.name}
                </Text>
              </GlassSurface>
            </Pressable>
          );
        })}
      </View>

      {error && <Text className="text-xs text-red-600">{error}</Text>}
    </View>
  );
}
