
import { Pressable, Text, View } from 'react-native';

import { useGarmentTypes } from '../../garment-types/context';

export default function GarmentPicker({
  value,
  onChange,
  error,
}: {
  value: string | null;
  onChange: (value: string) => void;
  error?: string | null;
}) {
  const { types } = useGarmentTypes();

  return (
    <View className="gap-1.5">
      <Text className="text-xs font-semibold uppercase text-ink-secondary">
        Tipo de prenda
      </Text>

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
              className={`h-12 flex-1 items-center justify-center rounded-lg border px-3 ${
                selected
                  ? 'border-brand bg-brand/10'
                  : 'border-line bg-white'
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

      {!!error && (
        <Text className="text-xs text-red-600">
          {error}
        </Text>
      )}
    </View>
  );
}
