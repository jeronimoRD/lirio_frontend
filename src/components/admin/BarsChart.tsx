import { Text, View } from 'react-native';

const MAX_BAR_HEIGHT = 88;

/**
 * Barras en orden L-M-MI-J-V-S-D. `highlightIndex` resalta una barra (hoy).
 */
export default function BarsChart({
  counts,
  highlightIndex,
}: {
  counts: number[];
  highlightIndex?: number;
}) {
  const max = Math.max(...counts, 1);

  return (
    <View className="flex-row items-end gap-3">
      {counts.map((count, i) => {
        const height = count > 0 ? Math.max(13, Math.round((count / max) * MAX_BAR_HEIGHT)) : 6;
        const highlighted = highlightIndex === i;

        return (
          <View key={i} className="flex-1 items-center justify-end gap-2">
            <View
              className="w-6 rounded-t"
              style={{
                height,
                backgroundColor: highlighted ? '#A91243' : '#F8E7ED',
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
              }}
            />
            <Text className="text-[11px] font-semibold text-[#7A6E65]">
              {['L', 'M', 'MI', 'J', 'V', 'S', 'D'][i]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
