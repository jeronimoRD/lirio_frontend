
import { Pressable, Text, View } from 'react-native';

import type { GarmentType } from '../../types';

const OPTIONS: { value: GarmentType; label: string }[] = [
  { value: 'SHIRT', label: 'Camiseta' },
  { value: 'PANTS', label: 'Pantalón' },
  { value: 'SHOES', label: 'Zapato' },
];

export function garmentLabel(type: GarmentType): string {
  return OPTIONS.find((option) => option.value === type)?.label ?? '';
}

export default function GarmentPicker({
  value,
  onChange,
  error,
}: {
  value: GarmentType | null;
  onChange: (value: GarmentType) => void;
  error?: string | null;
}) {
  return (
    <View className="gap-1.5">
      <Text className="text-xs font-semibold uppercase text-ink-secondary">
        Tipo de prenda
      </Text>

      <View className="flex-row gap-2">
        {OPTIONS.map((option) => {
          const selected = value === option.value;

          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={option.label}
              className={`h-12 flex-1 items-center justify-center rounded-lg border ${
                selected
                  ? 'border-brand bg-brand/10'
                  : 'border-line bg-white'
              }`}>
              <Text
                className={`text-sm font-semibold ${
                  selected ? 'text-brand' : 'text-ink-secondary'
                }`}>
                {option.label}
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
